from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app


def main() -> None:
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json().get("status") == "ok"

        home = client.get("/api/v1/content/home", params={"lang": "en"})
        assert home.status_code == 200
        assert home.json().get("latest_release") is not None

        links = client.get("/api/v1/content/links")
        assert links.status_code == 200
        assert len(links.json()) >= 1

        settings = client.get("/api/v1/content/settings", params={"lang": "en"})
        assert settings.status_code == 200
        assert settings.json().get("values", {}).get("site_name")


if __name__ == "__main__":
    main()
