from __future__ import annotations

import importlib
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def client(tmp_path_factory: pytest.TempPathFactory):
    tmp_path = tmp_path_factory.mktemp("testdata")
    db_path = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{db_path}"
    os.environ["MEDIA_ROOT"] = str(tmp_path / "media")
    os.environ["STATIC_ROOT"] = str(tmp_path / "static")

    main_module = importlib.import_module("app.main")
    with TestClient(main_module.app) as test_client:
        yield test_client
