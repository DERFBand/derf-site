from typing import Optional, List
from sqlmodel import select
from app.models import User, Release, ReleaseTranslation, Event, EventTranslation, MediaItem
from app.db.session import AsyncSessionLocal

# USER helpers
async def get_user_by_username(username: str) -> Optional[User]:
    async with AsyncSessionLocal() as session:
        q = select(User).where(User.username == username)
        r = await session.exec(q)
        return r.first()

async def create_user(user: User) -> User:
    async with AsyncSessionLocal() as session:
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

# RELEASE helpers
async def create_release_with_translation(slug: str, release_date, title: str, description: str, lang: str) -> Release:
    async with AsyncSessionLocal() as session:
        rel = Release(slug=slug, release_date=release_date)
        session.add(rel)
        await session.commit()
        await session.refresh(rel)
        tr = ReleaseTranslation(release_id=rel.id, lang=lang, title=title, description=description)
        session.add(tr)
        await session.commit()
        await session.refresh(tr)
        return rel

# EVENTS
async def list_events() -> List[Event]:
    async with AsyncSessionLocal() as session:
        q = select(Event).order_by(Event.start_at.desc())
        r = await session.exec(q)
        return r.all()

async def create_event(title: str, venue: str, city: str, start_at, metadata_json: str = None) -> Event:
    async with AsyncSessionLocal() as session:
        e = Event(title=title, venue=venue, city=city, start_at=start_at, metadata_json=metadata_json)
        session.add(e)
        await session.commit()
        await session.refresh(e)
        return e

# MEDIA
async def save_media_item(item: MediaItem) -> MediaItem:
    async with AsyncSessionLocal() as session:
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item