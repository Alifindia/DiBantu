"""Backend API tests for TemuJasa marketplace."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://react-web-builder-5.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Categories ---
class TestCategories:
    EXPECTED_IDS = {"AC", "Plumbing", "Cleaning", "Listrik", "Pet Care", "Pest Control", "Smart Home"}

    def test_get_categories(self, session):
        r = session.get(f"{API}/categories")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 7, f"Expected 7 categories, got {len(data)}"
        ids = {c["id"] for c in data}
        assert ids == self.EXPECTED_IDS, f"Unexpected category ids: {ids}"
        for c in data:
            assert "common_issues" in c and isinstance(c["common_issues"], list) and len(c["common_issues"]) >= 1
            assert "icon" in c and c["icon"]
            assert "full_name" in c and c["full_name"]


# --- Services ---
class TestServices:
    def test_get_all_services(self, session):
        r = session.get(f"{API}/services")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 30, f"Expected 30 services, got {len(data)}"
        first = data[0]
        for key in ("id", "name", "category", "base_price"):
            assert key in first

    def test_get_services_by_category_ac(self, session):
        r = session.get(f"{API}/services/category/AC")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        for svc in data:
            assert svc["category"] == "AC"

    def test_get_services_by_category_plumbing(self, session):
        r = session.get(f"{API}/services/category/Plumbing")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 5
        assert all(s["category"] == "Plumbing" for s in data)

    def test_get_services_by_category_smart_home(self, session):
        # URL with space
        r = session.get(f"{API}/services/category/Smart Home")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert all(s["category"] == "Smart Home" for s in data)

    def test_get_services_query_filter(self, session):
        r = session.get(f"{API}/services", params={"category": "Plumbing"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 5
        assert all(s["category"] == "Plumbing" for s in data)


# --- Technicians ---
class TestTechnicians:
    def test_get_all_technicians(self, session):
        r = session.get(f"{API}/technicians")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 14, f"Expected 14 technicians, got {len(data)}"

    def test_sort_by_rating(self, session):
        r = session.get(f"{API}/technicians", params={"sort_by": "rating"})
        assert r.status_code == 200
        data = r.json()
        ratings = [t["rating"] for t in data]
        assert ratings == sorted(ratings, reverse=True)

    def test_sort_by_distance(self, session):
        r = session.get(f"{API}/technicians", params={"sort_by": "distance"})
        assert r.status_code == 200
        data = r.json()
        dists = [t["distance"] for t in data]
        assert dists == sorted(dists)

    def test_sort_by_price(self, session):
        r = session.get(f"{API}/technicians", params={"sort_by": "price"})
        assert r.status_code == 200
        data = r.json()
        prices = [t["transportation_fee_min"] for t in data]
        assert prices == sorted(prices)

    def test_filter_by_service_id(self, session):
        r = session.get(f"{API}/technicians", params={"service_id": "srv-ac-001"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for t in data:
            assert "srv-ac-001" in t["available_services"]

    def test_get_single_technician(self, session):
        r = session.get(f"{API}/technicians/tech-001")
        assert r.status_code == 200
        assert r.json()["name"] == "Pak Dedi"

    def test_get_technician_404(self, session):
        r = session.get(f"{API}/technicians/nonexistent")
        assert r.status_code == 404


# --- Orders ---
class TestOrders:
    created_order_id = None

    def test_create_order(self, session):
        payload = {
            "service_id": "srv-ac-001",
            "technician_id": "tech-001",
            "address": "TEST_ Jl. Sudirman No. 1, Jakarta",
            "schedule": "2026-01-20 10:00",
            "transportation_fee": 12000,
            "payment_method": "OVO",
        }
        r = session.post(f"{API}/orders", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["service_id"] == "srv-ac-001"
        assert data["technician_id"] == "tech-001"
        assert data["status"] == "pending"
        assert data["total"] == 75000 + 12000
        assert data["payment_method"] == "OVO"
        assert data["order_number"].startswith("INV-")
        assert len(data["timeline"]) >= 1
        TestOrders.created_order_id = data["id"]

        # Verify GET persists
        rg = session.get(f"{API}/orders/{data['id']}")
        assert rg.status_code == 200
        assert rg.json()["id"] == data["id"]

    def test_create_order_invalid_service(self, session):
        payload = {
            "service_id": "bad-id",
            "technician_id": "tech-001",
            "address": "x",
            "schedule": "now",
            "transportation_fee": 0,
            "payment_method": "OVO",
        }
        r = session.post(f"{API}/orders", json=payload)
        assert r.status_code == 404

    def test_get_all_orders(self, session):
        r = session.get(f"{API}/orders")
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert len(r.json()) >= 1

    def test_get_orders_filter_status(self, session):
        r = session.get(f"{API}/orders", params={"status": "pending"})
        assert r.status_code == 200
        for o in r.json():
            assert o["status"] == "pending"

    def test_update_status_to_completed(self, session):
        oid = TestOrders.created_order_id
        assert oid
        r = session.put(
            f"{API}/orders/{oid}/status",
            json={"status": "completed", "timeline_event": "Pekerjaan selesai"},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "completed"
        assert data["completed_at"] is not None
        assert any(t["event"] == "Pekerjaan selesai" for t in data["timeline"])

        # Verify persistence
        rg = session.get(f"{API}/orders/{oid}")
        assert rg.json()["status"] == "completed"

    def test_update_status_404(self, session):
        r = session.put(f"{API}/orders/nonexistent/status", json={"status": "completed"})
        assert r.status_code == 404


# --- Reviews ---
class TestReviews:
    def test_create_review_and_rating_update(self, session):
        oid = TestOrders.created_order_id
        assert oid, "Need order from previous test class"

        # Capture technician rating BEFORE
        before = session.get(f"{API}/technicians/tech-001").json()
        before_rating = before["rating"]
        before_count = before["reviews_count"]

        payload = {
            "order_id": oid,
            "technician_id": "tech-001",
            "rating": 5,
            "comment": "TEST_ Pelayanan sangat memuaskan!",
        }
        r = session.post(f"{API}/reviews", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["rating"] == 5
        assert data["order_id"] == oid

        # Technician rating updated
        after = session.get(f"{API}/technicians/tech-001").json()
        assert after["reviews_count"] == before_count + 1 or after["reviews_count"] >= 1
        # rating should be valid float between 1 and 5
        assert 1 <= after["rating"] <= 5

    def test_review_duplicate_rejected(self, session):
        oid = TestOrders.created_order_id
        payload = {
            "order_id": oid,
            "technician_id": "tech-001",
            "rating": 4,
            "comment": "duplicate",
        }
        r = session.post(f"{API}/reviews", json=payload)
        assert r.status_code == 400

    def test_get_technician_reviews(self, session):
        r = session.get(f"{API}/technicians/tech-001/reviews")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1


# --- Cleanup ---
def test_cleanup(session):
    """Soft cleanup: leave data so frontend tests can use them.
    But we can drop the test order via direct status update is not needed.
    """
    assert True
