"""Backend API tests for TemuJasa chat endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Conversations ---
class TestConversations:
    seeded_conv_id = None
    new_conv_id = None

    def test_get_conversations_seeded(self, session):
        r = session.get(f"{API}/conversations")
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 2, f"Expected >= 2 seeded conversations, got {len(data)}"
        names = {c["technician_name"] for c in data}
        assert "Pak Dedi" in names
        assert "Ibu Siti" in names
        # find Pak Dedi conv
        dedi = next(c for c in data if c["technician_name"] == "Pak Dedi")
        siti = next(c for c in data if c["technician_name"] == "Ibu Siti")
        # Note: unread_count may have been reset to 0 by prior get_conversation calls
        assert isinstance(dedi.get("unread_count"), int)
        assert siti.get("unread_count") == 0
        TestConversations.seeded_conv_id = dedi["id"]

    def test_get_specific_conversation_resets_unread(self, session):
        cid = TestConversations.seeded_conv_id
        assert cid
        r = session.get(f"{API}/conversations/{cid}")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == cid
        # Verify unread count reset
        r2 = session.get(f"{API}/conversations")
        target = next(c for c in r2.json() if c["id"] == cid)
        assert target["unread_count"] == 0

    def test_get_conversation_404(self, session):
        r = session.get(f"{API}/conversations/nonexistent-id")
        assert r.status_code == 404

    def test_get_messages_seeded(self, session):
        cid = TestConversations.seeded_conv_id
        r = session.get(f"{API}/conversations/{cid}/messages")
        assert r.status_code == 200
        msgs = r.json()
        assert isinstance(msgs, list)
        assert len(msgs) >= 2
        # Sorted ascending by created_at
        times = [m["created_at"] for m in msgs]
        assert times == sorted(times)
        # Has both senders
        senders = {m["sender"] for m in msgs}
        assert "user" in senders
        assert "technician" in senders

    def test_start_conversation_returns_existing(self, session):
        # Already have conv with tech-001 (Pak Dedi)
        r = session.post(f"{API}/conversations", json={"technician_id": "tech-001"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["technician_id"] == "tech-001"
        assert data["id"] == TestConversations.seeded_conv_id

    def test_start_conversation_new(self, session):
        # tech-004 should not have a conversation yet
        r = session.post(f"{API}/conversations", json={
            "technician_id": "tech-004",
            "initial_message": "TEST_ Halo pak, butuh perbaikan listrik"
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["technician_id"] == "tech-004"
        assert data["technician_name"] == "Pak Agus"
        assert data["last_message"] == "TEST_ Halo pak, butuh perbaikan listrik"
        TestConversations.new_conv_id = data["id"]

        # Verify initial message was persisted
        mr = session.get(f"{API}/conversations/{data['id']}/messages")
        assert mr.status_code == 200
        msgs = mr.json()
        assert any(m["text"] == "TEST_ Halo pak, butuh perbaikan listrik" and m["sender"] == "user" for m in msgs)

    def test_start_conversation_bad_technician(self, session):
        r = session.post(f"{API}/conversations", json={"technician_id": "nonexistent-tech"})
        assert r.status_code == 404


# --- Messages & Auto-reply ---
class TestMessages:
    def test_send_message_and_autoreply(self, session):
        cid = TestConversations.new_conv_id
        assert cid, "Need conversation from previous class"

        msgs_before = session.get(f"{API}/conversations/{cid}/messages").json()
        count_before = len(msgs_before)

        # Send a user message
        r = session.post(f"{API}/conversations/{cid}/messages", json={
            "text": "TEST_ Kapan bisa datang?",
            "sender": "user"
        })
        assert r.status_code == 200, r.text
        msg = r.json()
        assert msg["text"] == "TEST_ Kapan bisa datang?"
        assert msg["sender"] == "user"

        # After send, messages should include the new user msg + auto-reply (technician)
        msgs_after = session.get(f"{API}/conversations/{cid}/messages").json()
        assert len(msgs_after) >= count_before + 2, f"Expected user+autoreply, got {len(msgs_after) - count_before} new msgs"

        # Last message should be from technician
        tech_msgs = [m for m in msgs_after if m["sender"] == "technician"]
        assert len(tech_msgs) >= 1

        # Conversation last_message should reflect auto-reply
        conv = session.get(f"{API}/conversations/{cid}").json()
        # last_message should be the auto-reply text (one of 4 known)
        auto_replies = [
            "Halo! Terima kasih sudah menghubungi saya. Ada yang bisa dibantu?",
            "Baik, saya akan segera ke lokasi Anda. Mohon ditunggu ya.",
            "Untuk masalah ini biasanya 1-2 jam pengerjaan. Apakah waktunya sesuai?",
            "Sip, saya catat. Sampai bertemu di lokasi ya pak/bu.",
        ]
        assert conv["last_message"] in auto_replies, f"last_message='{conv['last_message']}'"

    def test_send_message_404(self, session):
        r = session.post(f"{API}/conversations/nonexistent-id/messages", json={
            "text": "TEST_", "sender": "user"
        })
        assert r.status_code == 404
