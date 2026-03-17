from pydantic import BaseSettings, AnyUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "D.E.R.F. Backend"
    DATABASE_URL: AnyUrl = "postgresql+asyncpg://derf_user:change_me@localhost:5432/derf"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "please-change-this-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    MEDIA_ROOT: str = "/srv/derf_media"
    STATIC_ROOT: str = "/srv/derf_static"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()