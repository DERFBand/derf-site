from __future__ import annotations

from uuid import uuid4


def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_auth_register_login_and_me(client):
    username = f"tester-{uuid4().hex[:8]}"
    email = f"{username}@example.com"
    register = client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": "secret123"},
    )
    assert register.status_code == 200
    assert register.json()["username"] == username

    login = client.post("/api/v1/auth/login", json={"username": username, "password": "secret123"})
    assert login.status_code == 200
    token = login.json()["access_token"]
    assert token

    me = client.get("/api/v1/auth/me", headers=_auth_headers(token))
    assert me.status_code == 200
    assert me.json()["username"] == username


def test_auth_rejects_bad_credentials(client):
    username = f"bad-user-{uuid4().hex[:8]}"
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": f"{username}@example.com", "password": "secret123"},
    )
    bad_login = client.post("/api/v1/auth/login", json={"username": username, "password": "wrong"})
    assert bad_login.status_code == 401


def test_forum_thread_and_post_flow(client):
    username = f"forum-user-{uuid4().hex[:8]}"
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": f"{username}@example.com", "password": "secret123"},
    )
    login = client.post("/api/v1/auth/login", json={"username": username, "password": "secret123"})
    token = login.json()["access_token"]

    thread = client.post("/api/v1/forum/threads", json={"title": "General"}, headers=_auth_headers(token))
    assert thread.status_code == 200
    thread_id = thread.json()["id"]

    post = client.post(
        f"/api/v1/forum/threads/{thread_id}/posts",
        json={"content": "Hello forum"},
        headers=_auth_headers(token),
    )
    assert post.status_code == 200
    assert post.json()["content"] == "Hello forum"

    listed = client.get(f"/api/v1/forum/threads/{thread_id}/posts")
    assert listed.status_code == 200
    assert len(listed.json()) == 1
    assert listed.json()[0]["content"] == "Hello forum"


def test_forum_returns_404_for_missing_thread(client):
    username = f"forum-user-{uuid4().hex[:8]}"
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": f"{username}@example.com", "password": "secret123"},
    )
    login = client.post("/api/v1/auth/login", json={"username": username, "password": "secret123"})
    token = login.json()["access_token"]
    missing = client.post(
        "/api/v1/forum/threads/999999/posts",
        json={"content": "No thread"},
        headers=_auth_headers(token),
    )
    assert missing.status_code == 404


def test_chat_messages_endpoint_returns_persisted_messages(client):
    with client.websocket_connect("/api/v1/ws/live") as ws:
        ws.send_text("hello live room")
        echoed = ws.receive_text()
        assert echoed == "hello live room"

    messages = client.get("/api/v1/chat/messages/live")
    assert messages.status_code == 200
    payload = messages.json()
    assert len(payload) >= 1
    assert payload[0]["content"] == "hello live room"


def test_media_upload_and_list(client):
    upload = client.post(
        "/api/v1/media/upload",
        files={"file": ("photo.jpg", b"fake-jpeg-content", "image/jpeg")},
        data={"media_type": "photo", "title": "Uploaded", "lang": "en", "is_featured": "true"},
    )
    assert upload.status_code == 200
    item = upload.json()
    assert item["title"] == "Uploaded"
    assert item["url"].startswith("/media/")

    listed = client.get("/api/v1/media/list", params={"lang": "en"})
    assert listed.status_code == 200
    assert any(entry["title"] == "Uploaded" for entry in listed.json())
