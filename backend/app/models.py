from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Release(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    external_url: Optional[str] = Field(default=None, index=True)
    cover_url: Optional[str] = None
    release_date: Optional[datetime] = Field(default=None, index=True)
    sort_order: int = Field(default=0, index=True)
    translations: list["ReleaseTranslation"] = Relationship(
        back_populates="release"
    )


class ReleaseTranslation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    release_id: int = Field(foreign_key="release.id", index=True)
    lang: str = Field(index=True)
    title: Optional[str] = None
    description: Optional[str] = None
    release: Optional[Release] = Relationship(back_populates="translations")


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    venue: Optional[str] = Field(default=None, index=True)
    city: Optional[str] = Field(default=None, index=True)
    start_at: datetime = Field(index=True)
    ticket_url: Optional[str] = None
    source_url: Optional[str] = None
    is_cancelled: bool = Field(default=False, index=True)
    translations: List["EventTranslation"] = Relationship(back_populates="event")


class EventTranslation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="event.id", index=True)
    lang: str = Field(index=True)
    title: Optional[str] = None
    description: Optional[str] = None
    event: Optional[Event] = Relationship(back_populates="translations")


class MediaItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    media_type: str = Field(index=True)  # photo | video | audio
    source: str = Field(default="local", index=True)  # local | vk | youtube | bandlink
    source_id: Optional[str] = Field(default=None, index=True)
    url: str
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    lang: Optional[str] = Field(default=None, index=True)
    is_featured: bool = Field(default=False, index=True)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class PressItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: Optional[str] = Field(default=None, index=True)
    url: str = Field(index=True)
    kind: str = Field(default="article", index=True)
    source: Optional[str] = Field(default=None, index=True)
    published_at: Optional[datetime] = Field(default=None, index=True)
    description: Optional[str] = None
    translations: List["PressItemTranslation"] = Relationship(back_populates="press_item")


class PressItemTranslation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    press_item_id: int = Field(foreign_key="pressitem.id", index=True)
    lang: str = Field(index=True)
    title: Optional[str] = None
    description: Optional[str] = None
    press_item: Optional[PressItem] = Relationship(back_populates="translations")


class SiteLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True)
    label: str = Field(index=True)
    url: str
    sort_order: int = Field(default=0, index=True)
    is_active: bool = Field(default=True, index=True)


class SiteSetting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True)
    lang: Optional[str] = Field(default=None, index=True)
    value: str
    is_active: bool = Field(default=True, index=True)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: Optional[str] = Field(default=None, index=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class Thread(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    created_by_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: int = Field(foreign_key="thread.id", index=True)
    author_id: int = Field(foreign_key="user.id", index=True)
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room: str = Field(index=True)
    sender_id: Optional[int] = Field(default=None, index=True)
    content: str
    sent_at: datetime = Field(default_factory=datetime.utcnow, index=True)
