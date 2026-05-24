"""Tests for /api/activities endpoint (Activity Feed - Social Proof)."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# fallback to frontend env
if not BASE_URL:
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
    except Exception:
        pass


@pytest.fixture(scope="module")
def activities():
    r = requests.get(f"{BASE_URL}/api/activities", timeout=20)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert isinstance(data, list)
    return data


def test_activities_endpoint_returns_200():
    r = requests.get(f"{BASE_URL}/api/activities", timeout=20)
    assert r.status_code == 200


def test_activities_count_at_least_12(activities):
    assert len(activities) >= 12, f"Expected >=12, got {len(activities)}"


def test_activities_sorted_by_minutes_ago_asc(activities):
    mins = [a['minutes_ago'] for a in activities]
    assert mins == sorted(mins), f"Not sorted: {mins}"


def test_activity_schema(activities):
    required = {"id", "customer_name", "customer_avatar", "service_name",
                "technician_id", "technician_name", "technician_photo",
                "area", "minutes_ago", "status"}
    for act in activities:
        missing = required - set(act.keys())
        assert not missing, f"Missing fields {missing} in {act}"
        # _id from mongo should NOT leak
        assert "_id" not in act


def test_activities_area_is_depok(activities):
    for act in activities:
        assert "Depok" in act["area"], f"Area not Depok: {act['area']}"


def test_activities_seeded_customers_present(activities):
    names = {a["customer_name"] for a in activities}
    expected = {"Budi M.", "Sari W.", "Andi P.", "Lina K.", "Rendi A.",
                "Dewi S.", "Tono H.", "Mira L.", "Hadi R."}
    missing = expected - names
    assert not missing, f"Missing seeded customers: {missing}"


def test_activities_status_values(activities):
    allowed = {"completed", "in_progress", "booked"}
    for act in activities:
        assert act["status"] in allowed, f"Invalid status: {act['status']}"


def test_activities_first_item_is_most_recent(activities):
    # Should be Budi M. with minutes_ago=3 per seed
    assert activities[0]["minutes_ago"] == 3
    assert activities[0]["customer_name"] == "Budi M."
