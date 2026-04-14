from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import models
from app.api.v1 import auth, chat, content, events, forum, media
from app.core.config import settings
from app.crud import seed_default_content
from app.db.session import init_db

os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
os.makedirs(settings.STATIC_ROOT, exist_ok=True)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=settings.MEDIA_ROOT), name="media")
app.mount("/static", StaticFiles(directory=settings.STATIC_ROOT), name="static")


@app.on_event("startup")
async def startup_event() -> None:
    await init_db()
    await seed_default_content()


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])
app.include_router(events.router, prefix="/api/v1", tags=["events"])
app.include_router(media.router, prefix="/api/v1", tags=["media"])
app.include_router(forum.router, prefix="/api/v1/forum", tags=["forum"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
