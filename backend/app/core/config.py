from __future__ import annotations

import os
from typing import List

from pydantic import AnyHttpUrl, BaseSettings, validator

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))


class Settings(BaseSettings):
    PROJECT_NAME: str = "D.E.R.F. Backend"
    DATABASE_URL: str = "postgresql+asyncpg://derf:derf@localhost:5432/derf"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "please-change-this-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    MEDIA_ROOT: str = os.getenv("MEDIA_ROOT", os.path.join(BASE_DIR, "media"))
    STATIC_ROOT: str = os.getenv("STATIC_ROOT", os.path.join(BASE_DIR, "static"))
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
