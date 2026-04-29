from __future__ import annotations


def test_home_content_includes_seeded_db_data(client):
    response = client.get("/api/v1/content/home", params={"lang": "en"})
    assert response.status_code == 200
    data = response.json()

    assert data["latest_release"] is not None
    assert len(data["press_items"]) > 0
    assert len(data["site_links"]) > 0


def test_links_endpoint_returns_seeded_links(client):
    response = client.get("/api/v1/content/links")
    assert response.status_code == 200
    links = response.json()
    assert len(links) >= 4

    keys = {item["key"] for item in links}
    assert {"vk", "youtube", "vk-video", "bandlink"}.issubset(keys)


def test_media_endpoint_respects_lang_filter(client):
    en_response = client.get("/api/v1/media/list", params={"lang": "en"})
    ru_response = client.get("/api/v1/media/list", params={"lang": "ru"})

    assert en_response.status_code == 200
    assert ru_response.status_code == 200
    assert len(en_response.json()) >= 1
    assert len(ru_response.json()) == 0


def test_bulk_add_events_uses_idempotent_seeding(client):
    before = client.get("/api/v1/events", params={"lang": "en"})
    assert before.status_code == 200
    before_count = len(before.json())
    assert before_count > 0

    first = client.post("/api/v1/events/bulk-add")
    second = client.post("/api/v1/events/bulk-add")
    assert first.status_code == 200
    assert second.status_code == 200

    after = client.get("/api/v1/events", params={"lang": "en"})
    assert after.status_code == 200
    assert len(after.json()) == before_count


def test_settings_endpoint_returns_db_backed_values(client):
    response = client.get("/api/v1/content/settings", params={"lang": "en"})
    assert response.status_code == 200
    values = response.json()["values"]
    assert values["site_name"] == "D.E.R.F."
    assert values["site_title_suffix"] == "Official"
    assert "official band website" in values["site_description"]


def test_settings_endpoint_localizes_description(client):
    response = client.get("/api/v1/content/settings", params={"lang": "ru"})
    assert response.status_code == 200
    values = response.json()["values"]
    assert "официальный сайт" in values["site_description"]


def test_can_create_release_and_read_back(client):
    payload = {
        "slug": "test-release",
        "external_url": "https://example.com/release",
        "lang": "en",
        "title": "Test Release",
        "description": "Release from test",
        "sort_order": 99,
    }
    created = client.post("/api/v1/content/releases", json=payload)
    assert created.status_code == 200

    releases = client.get("/api/v1/content/releases", params={"lang": "en"})
    assert releases.status_code == 200
    slugs = [item["slug"] for item in releases.json()]
    assert "test-release" in slugs
