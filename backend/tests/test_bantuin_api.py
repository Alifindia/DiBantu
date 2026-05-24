"""Backend tests for the Bantuin (Custom Help Request) feature."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fallback: read frontend/.env directly
    env_path = '/app/frontend/.env'
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL'):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                    break


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def created_request(api_client):
    payload = {
        "title": "TEST_Antri sushi tako",
        "detail": "TEST_Tolong antri beli 2 box sushi tako",
        "location": "Jl. Melati No.10, Depok",
        "schedule": "Secepatnya",
        "budget": 100000,
        "photo_url": ""
    }
    r = api_client.post(f"{BASE_URL}/api/bantuin", json=payload)
    assert r.status_code == 200, f"Create failed: {r.status_code} {r.text}"
    data = r.json()
    return data


# --- Create ---
class TestBantuinCreate:
    def test_create_request_returns_id_and_number(self, created_request):
        d = created_request
        assert "id" in d and isinstance(d["id"], str)
        assert d["request_number"].startswith("BTN-")
        assert len(d["request_number"]) == 10  # BTN-XXXXXX
        assert d["status"] == "searching"
        assert d["title"] == "TEST_Antri sushi tako"
        assert d["budget"] == 100000

    def test_create_auto_generates_3_offers(self, api_client, created_request):
        r = api_client.get(f"{BASE_URL}/api/bantuin/{created_request['id']}/offers")
        assert r.status_code == 200
        offers = r.json()
        assert len(offers) == 3
        for o in offers:
            assert o["request_id"] == created_request["id"]
            assert "helper_name" in o and o["helper_name"]
            assert "helper_photo" in o
            assert isinstance(o["rating"], (int, float))
            assert isinstance(o["eta_minutes"], int)
            assert isinstance(o["price"], int)

    def test_offer_prices_within_85_110_pct_of_budget(self, api_client, created_request):
        r = api_client.get(f"{BASE_URL}/api/bantuin/{created_request['id']}/offers")
        offers = r.json()
        budget = created_request["budget"]
        lo, hi = int(budget * 0.83), int(budget * 1.12)  # tolerance for rounding to nearest 1000
        for o in offers:
            assert lo <= o["price"] <= hi, f"Offer price {o['price']} not within range of budget {budget}"


# --- Read ---
class TestBantuinRead:
    def test_get_all_requests_sorted_desc(self, api_client, created_request):
        r = api_client.get(f"{BASE_URL}/api/bantuin")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(i["id"] == created_request["id"] for i in items)
        # Verify sort order
        if len(items) >= 2:
            assert items[0]["created_at"] >= items[1]["created_at"]

    def test_get_specific_request(self, api_client, created_request):
        r = api_client.get(f"{BASE_URL}/api/bantuin/{created_request['id']}")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == created_request["id"]
        assert d["request_number"] == created_request["request_number"]

    def test_get_nonexistent_request(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/bantuin/nonexistent-id-1234")
        assert r.status_code == 404


# --- Select Helper & Status ---
class TestBantuinFlow:
    def test_full_status_flow(self, api_client):
        # Create request
        payload = {
            "title": "TEST_Pindahan kos",
            "detail": "TEST_Bantu pindahan kos pakai mobil pick-up",
            "location": "Depok",
            "schedule": "Hari ini",
            "budget": 200000,
            "photo_url": ""
        }
        cr = api_client.post(f"{BASE_URL}/api/bantuin", json=payload)
        assert cr.status_code == 200
        req = cr.json()
        req_id = req["id"]

        # Get offers
        offers = api_client.get(f"{BASE_URL}/api/bantuin/{req_id}/offers").json()
        assert len(offers) == 3
        chosen = offers[0]

        # Select helper
        sel = api_client.put(
            f"{BASE_URL}/api/bantuin/{req_id}/select-helper",
            json={"offer_id": chosen["id"]}
        )
        assert sel.status_code == 200, sel.text
        d = sel.json()
        assert d["status"] == "helper_selected"
        assert d["selected_helper_id"] == chosen["helper_id"]
        assert d["selected_offer_id"] == chosen["id"]
        assert d["final_price"] == chosen["price"]

        # Verify via GET
        g = api_client.get(f"{BASE_URL}/api/bantuin/{req_id}").json()
        assert g["status"] == "helper_selected"
        assert g["final_price"] == chosen["price"]

        # Advance: on_the_way
        r = api_client.put(f"{BASE_URL}/api/bantuin/{req_id}/status", json={"status": "on_the_way"})
        assert r.status_code == 200
        assert r.json()["status"] == "on_the_way"

        # Advance: in_progress
        r = api_client.put(f"{BASE_URL}/api/bantuin/{req_id}/status", json={"status": "in_progress"})
        assert r.status_code == 200
        assert r.json()["status"] == "in_progress"

        # Advance: completed
        r = api_client.put(f"{BASE_URL}/api/bantuin/{req_id}/status", json={"status": "completed"})
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "completed"
        assert d.get("completed_at") is not None

    def test_select_invalid_offer_returns_404(self, api_client, created_request):
        r = api_client.put(
            f"{BASE_URL}/api/bantuin/{created_request['id']}/select-helper",
            json={"offer_id": "nonexistent-offer-id"}
        )
        assert r.status_code == 404
