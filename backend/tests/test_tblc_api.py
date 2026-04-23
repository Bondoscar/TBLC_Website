"""Backend tests for TBLC API (events, ministries, sermons, pastors, newsletters, settings, admin)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://tblc-resource-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "DsSI5MItZj4O9D-vKUxk2w"

DRIVE_URL = "https://drive.google.com/file/d/1ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678/view?usp=sharing"
EXPECTED_DIRECT_IMG = "https://drive.google.com/thumbnail?id=1ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678&sz=w2000"
EXPECTED_DIRECT_FILE = "https://drive.google.com/uc?export=download&id=1ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# --- Auth ---
def test_login_wrong_password():
    r = requests.post(f"{API}/admin/login", json={"password": "nope"}, timeout=15)
    assert r.status_code == 401

def test_login_correct_returns_token(token):
    assert isinstance(token, str) and len(token) > 20

def test_admin_me_requires_token():
    r = requests.get(f"{API}/admin/me", timeout=15)
    assert r.status_code == 401

def test_admin_me_ok(auth_headers):
    r = requests.get(f"{API}/admin/me", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["role"] == "admin" and d["ok"] is True


# --- Bootstrap + public GETs ---
def test_bootstrap_seeded():
    r = requests.get(f"{API}/bootstrap", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert len(d["events"]) == 2
    assert len(d["ministries"]) == 8
    assert len(d["sermons"]) == 9
    assert len(d["pastors"]) == 3
    assert len(d["newsletters"]) == 16
    s = d["settings"]
    for k in ("church_info", "social_links", "about_content", "site_images"):
        assert k in s, f"missing {k}"
    assert s["church_info"]["phone"]
    # No _id leak
    for coll in ("events", "ministries", "sermons", "pastors", "newsletters"):
        for doc in d[coll]:
            assert "_id" not in doc


@pytest.mark.parametrize("resource", ["events", "ministries", "sermons", "pastors", "newsletters"])
def test_public_get_list(resource):
    r = requests.get(f"{API}/{resource}", timeout=15)
    assert r.status_code == 200
    for doc in r.json():
        assert "_id" not in doc


def test_public_settings():
    r = requests.get(f"{API}/settings", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "church_info" in d and "site_images" in d


# --- Protected mutation without auth ---
@pytest.mark.parametrize("resource", ["events", "ministries", "sermons", "pastors", "newsletters"])
def test_create_requires_auth(resource):
    r = requests.post(f"{API}/{resource}", json={"title": "x", "name": "x", "month": "x", "slug": "x"}, timeout=15)
    assert r.status_code in (401, 403)


def test_put_settings_requires_auth():
    r = requests.put(f"{API}/settings/church_info", json={"value": {"phone": "x"}}, timeout=15)
    assert r.status_code in (401, 403)


# --- Drive URL resolver ---
def test_resolve_drive_image(auth_headers):
    r = requests.post(f"{API}/admin/resolve-drive",
                      json={"url": DRIVE_URL, "kind": "image"},
                      headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["is_drive"] is True
    assert d["file_id"] == "1ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678"
    assert d["direct_url"] == EXPECTED_DIRECT_IMG


def test_resolve_drive_file(auth_headers):
    r = requests.post(f"{API}/admin/resolve-drive",
                      json={"url": DRIVE_URL, "kind": "file"},
                      headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["direct_url"] == EXPECTED_DIRECT_FILE


def test_resolve_drive_external_passthrough(auth_headers):
    ext = "https://example.com/foo.jpg"
    r = requests.post(f"{API}/admin/resolve-drive",
                      json={"url": ext, "kind": "image"},
                      headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["is_drive"] is False
    assert d["direct_url"] == ext


# --- Event CRUD with Drive URL auto-conversion ---
def test_event_crud_and_drive_conversion(auth_headers):
    payload = {
        "title": "TEST_Event_AutoDelete",
        "date": "Jan 1, 2026",
        "time": "10AM",
        "description": "test",
        "image_url": DRIVE_URL,
        "order": 99,
        "published": True,
    }
    r = requests.post(f"{API}/events", json=payload, headers=auth_headers, timeout=15)
    assert r.status_code == 200, r.text
    ev = r.json()
    eid = ev["id"]
    assert ev["image_direct_url"] == EXPECTED_DIRECT_IMG
    assert "_id" not in ev

    # GET verify persistence
    r = requests.get(f"{API}/events/{eid}", timeout=15)
    assert r.status_code == 200
    assert r.json()["image_direct_url"] == EXPECTED_DIRECT_IMG

    # External URL passthrough via update
    ext = "https://example.com/img.jpg"
    r = requests.put(f"{API}/events/{eid}",
                     json={**payload, "image_url": ext},
                     headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["image_direct_url"] == ext

    # Delete
    r = requests.delete(f"{API}/events/{eid}", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["deleted"] is True

    # 404 after delete
    r = requests.get(f"{API}/events/{eid}", timeout=15)
    assert r.status_code == 404


# --- Newsletter CRUD ---
def test_newsletter_crud_and_drive_file(auth_headers):
    payload = {"month": "TEST_November 2099", "file_url": DRIVE_URL, "order": 999, "published": True}
    r = requests.post(f"{API}/newsletters", json=payload, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    n = r.json()
    assert n["file_direct_url"] == EXPECTED_DIRECT_FILE

    # Delete
    r = requests.delete(f"{API}/newsletters/{n['id']}", headers=auth_headers, timeout=15)
    assert r.status_code == 200


# --- Settings site_images direct URL computation ---
def test_site_images_direct_urls(auth_headers):
    # Snapshot original
    orig = requests.get(f"{API}/settings/site_images", timeout=15).json()["value"]
    try:
        body = {"value": {"hero": DRIVE_URL, "worship": DRIVE_URL, "banner": "https://example.com/b.jpg"}}
        r = requests.put(f"{API}/settings/site_images", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        v = r.json()["value"]
        assert v["hero_direct"] == EXPECTED_DIRECT_IMG
        assert v["worship_direct"] == EXPECTED_DIRECT_IMG
        assert v["banner_direct"] == "https://example.com/b.jpg"
    finally:
        # restore
        requests.put(f"{API}/settings/site_images",
                     json={"value": {k: orig.get(k, "") for k in ("hero", "worship", "banner")}},
                     headers=auth_headers, timeout=15)


# --- Settings CRUD (church_info) keeps auth ---
def test_settings_put_with_auth(auth_headers):
    orig = requests.get(f"{API}/settings/church_info", timeout=15).json()["value"]
    try:
        new = {**orig, "phone": "(555) 000-TEST"}
        r = requests.put(f"{API}/settings/church_info", json={"value": new}, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["value"]["phone"] == "(555) 000-TEST"
        # Verify persistence
        r = requests.get(f"{API}/settings/church_info", timeout=15)
        assert r.json()["value"]["phone"] == "(555) 000-TEST"
    finally:
        requests.put(f"{API}/settings/church_info", json={"value": orig}, headers=auth_headers, timeout=15)
