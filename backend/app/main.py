import os

from app.api.v1 import auth, chat, content, events, forum, media
from app.core.config import settings
from app.db.session import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ensure MEDIA_ROOT and STATIC_ROOT exist (for dev)
os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
os.makedirs(settings.STATIC_ROOT, exist_ok=True)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount dev static
app.mount("/media", StaticFiles(directory=settings.MEDIA_ROOT), name="media")
app.mount("/static", StaticFiles(directory=settings.STATIC_ROOT), name="static")


@app.on_event("startup")
async def startup_event():
    await init_db()


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])
app.include_router(events.router, prefix="/api/v1", tags=["events"])
app.include_router(media.router, prefix="/api/v1", tags=["media"])
app.include_router(forum.router, prefix="/api/v1", tags=["forum"])
app.include_router(chat.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
