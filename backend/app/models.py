from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Release(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str
    release_date: Optional[datetime]
    platforms_json: Optional[str] = None
    translations: List["ReleaseTranslation"] = Relationship(back_populates="release")

class ReleaseTranslation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    release_id: int = Field(foreign_key="release.id")
    lang: str = Field(index=True)
    title: str
    description: Optional[str]
    release: Optional[Release] = Relationship(back_populates="translations")

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    venue: str
    city: Optional[str]
    start_at: Optional[datetime]
    metadata_json: Optional[str]
    translations: List["EventTranslation"] = Relationship(back_populates="event")

class EventTranslation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="event.id")
    lang: str = Field(index=True)
    description: Optional[str]
    event: Optional[Event] = Relationship(back_populates="translations")

class MediaItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    media_type: str  # 'photo'|'video'|'audio'
    source: str      # 'local'|'vk'|'youtube'|'bandlink' etc.
    source_id: Optional[str]
    url: Optional[str]
    thumbnail_url: Optional[str]
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    alt_text: Optional[str]
    lang: Optional[str]

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: Optional[str] = Field(index=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Thread(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    created_by_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: int = Field(foreign_key="thread.id")
    author_id: int = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room: str
    sender_id: Optional[int]
    content: str
    sent_at: datetime = Field(default_factory=datetime.utcnow)