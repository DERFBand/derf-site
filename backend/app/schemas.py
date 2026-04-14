from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr] = None
    is_active: bool
    is_superuser: bool = False


class ReleaseCreate(BaseModel):
    slug: str
    external_url: Optional[str] = None
    cover_url: Optional[str] = None
    release_date: Optional[datetime] = None
    lang: str = "en"
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class ReleaseRead(BaseModel):
    id: int
    slug: str
    external_url: Optional[str] = None
    cover_url: Optional[str] = None
    release_date: Optional[datetime] = None
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class EventCreate(BaseModel):
    title: str
    venue: Optional[str] = None
    city: Optional[str] = None
    start_at: datetime
    ticket_url: Optional[str] = None
    source_url: Optional[str] = None
    lang: str = "en"
    description: Optional[str] = None


class EventRead(BaseModel):
    id: int
    title: str
    venue: Optional[str] = None
    city: Optional[str] = None
    start_at: datetime
    ticket_url: Optional[str] = None
    source_url: Optional[str] = None
    is_cancelled: bool = False
    description: Optional[str] = None


class MediaItemRead(BaseModel):
    id: int
    media_type: str
    source: str
    source_id: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    lang: Optional[str] = None
    is_featured: bool = False
    uploaded_at: datetime


class PressItemRead(BaseModel):
    id: int
    title: Optional[str] = None
    url: str
    kind: str
    source: Optional[str] = None
    published_at: Optional[datetime] = None
    description: Optional[str] = None


class ThreadCreate(BaseModel):
    title: str


class ThreadRead(BaseModel):
    id: int
    title: str
    created_by_id: Optional[int] = None
    created_at: datetime


class PostCreate(BaseModel):
    content: str


class PostRead(BaseModel):
    id: int
    thread_id: int
    author_id: int
    content: str
    created_at: datetime


class HomeContent(BaseModel):
    latest_release: Optional[ReleaseRead] = None
    next_event: Optional[EventRead] = None
    featured_media: list[MediaItemRead] = []
    press_items: list[PressItemRead] = []
