from __future__ import annotations

from datetime import datetime
from typing import Iterable, List, Optional

from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.db.session import AsyncSessionLocal
from app.models import (
    Event,
    EventTranslation,
    MediaItem,
    PressItem,
    PressItemTranslation,
    Release,
    ReleaseTranslation,
    SiteLink,
    SiteSetting,
    User,
)
from app.core.security import get_password_hash


def _pick_translation(translations: Iterable, lang: Optional[str]):
    translations = list(translations or [])
    if not translations:
        return None
    if lang:
        for translation in translations:
            if getattr(translation, "lang", None) == lang:
                return translation
    for preferred in ("ru", "en"):
        for translation in translations:
            if getattr(translation, "lang", None) == preferred:
                return translation
    return translations[0]


async def get_user_by_username(username: str) -> Optional[User]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(User).where(User.username == username))
        return result.first()


async def get_user_by_id(user_id: int) -> Optional[User]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(User).where(User.id == user_id))
        return result.first()


async def create_user(user: User) -> User:
    async with AsyncSessionLocal() as session:
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


async def ensure_user(username: str, email: Optional[str], password: str, is_superuser: bool = False) -> User:
    existing = await get_user_by_username(username)
    if existing:
        return existing
    return await create_user(
        User(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            is_superuser=is_superuser,
        )
    )


async def create_release_with_translation(
    slug: str,
    release_date: Optional[datetime],
    title: Optional[str],
    description: Optional[str],
    lang: str,
    external_url: Optional[str] = None,
    cover_url: Optional[str] = None,
    sort_order: int = 0,
) -> Release:
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(Release).where(Release.slug == slug))
        release = result.first()
        if not release:
            release = Release(
                slug=slug,
                release_date=release_date,
                external_url=external_url,
                cover_url=cover_url,
                sort_order=sort_order,
            )
            session.add(release)
            await session.commit()
            await session.refresh(release)
        else:
            release.release_date = release_date or release.release_date
            release.external_url = external_url or release.external_url
            release.cover_url = cover_url or release.cover_url
            release.sort_order = sort_order if sort_order is not None else release.sort_order
            session.add(release)
            await session.commit()

        tr_result = await session.exec(
            select(ReleaseTranslation).where(
                ReleaseTranslation.release_id == release.id,
                ReleaseTranslation.lang == lang,
            )
        )
        translation = tr_result.first()
        if not translation:
            translation = ReleaseTranslation(release_id=release.id, lang=lang, title=title, description=description)
        else:
            translation.title = title or translation.title
            translation.description = description or translation.description
        session.add(translation)
        await session.commit()
        return release


async def list_releases(lang: Optional[str] = None) -> List[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(
            select(Release)
            .options(selectinload(Release.translations))
            .order_by(Release.release_date.desc().nullslast(), Release.id.desc())
        )
        items = []
        for release in result.all():
            translation = _pick_translation(release.translations, lang)
            items.append(
                {
                    "id": release.id,
                    "slug": release.slug,
                    "external_url": release.external_url,
                    "cover_url": release.cover_url,
                    "release_date": release.release_date.isoformat() if release.release_date else None,
                    "sort_order": release.sort_order,
                    "title": getattr(translation, "title", None),
                    "description": getattr(translation, "description", None),
                }
            )
        return items


async def create_event(
    title: str,
    venue: Optional[str],
    city: Optional[str],
    start_at: datetime,
    metadata_json: Optional[str] = None,
    ticket_url: Optional[str] = None,
    source_url: Optional[str] = None,
    lang: str = "en",
    description: Optional[str] = None,
) -> Event:
    async with AsyncSessionLocal() as session:
        event = Event(
            title=title,
            venue=venue,
            city=city,
            start_at=start_at,
            ticket_url=ticket_url,
            source_url=source_url,
            is_cancelled=False,
        )
        session.add(event)
        await session.commit()
        await session.refresh(event)

        translation = EventTranslation(event_id=event.id, lang=lang, title=title, description=description)
        session.add(translation)
        await session.commit()
        return event


async def list_events(lang: Optional[str] = None) -> List[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(
            select(Event).options(selectinload(Event.translations)).order_by(Event.start_at.asc())
        )
        items = []
        for event in result.all():
            translation = _pick_translation(event.translations, lang)
            items.append(
                {
                    "id": event.id,
                    "title": getattr(translation, "title", None) or event.title,
                    "venue": event.venue,
                    "city": event.city,
                    "start_at": event.start_at.isoformat() if event.start_at else None,
                    "ticket_url": event.ticket_url,
                    "source_url": event.source_url,
                    "is_cancelled": event.is_cancelled,
                    "description": getattr(translation, "description", None),
                }
            )
        return items


async def save_media_item(item: MediaItem) -> MediaItem:
    async with AsyncSessionLocal() as session:
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item


async def list_media(media_type: Optional[str] = None, featured_only: bool = False, lang: Optional[str] = None) -> List[dict]:
    async with AsyncSessionLocal() as session:
        stmt = select(MediaItem).order_by(MediaItem.is_featured.desc(), MediaItem.uploaded_at.desc())
        if media_type:
            stmt = stmt.where(MediaItem.media_type == media_type)
        if featured_only:
            stmt = stmt.where(MediaItem.is_featured.is_(True))
        if lang:
            stmt = stmt.where((MediaItem.lang == lang) | (MediaItem.lang.is_(None)))
        result = await session.exec(stmt)
        return [
            {
                "id": item.id,
                "media_type": item.media_type,
                "source": item.source,
                "source_id": item.source_id,
                "url": item.url,
                "thumbnail_url": item.thumbnail_url,
                "title": item.title,
                "alt_text": item.alt_text,
                "caption": item.caption,
                "lang": item.lang,
                "is_featured": item.is_featured,
                "uploaded_at": item.uploaded_at.isoformat() if item.uploaded_at else None,
            }
            for item in result.all()
        ]


async def list_site_links() -> List[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(
            select(SiteLink)
            .where(SiteLink.is_active.is_(True))
            .order_by(SiteLink.sort_order.asc(), SiteLink.id.asc())
        )
        return [
            {
                "id": item.id,
                "key": item.key,
                "label": item.label,
                "url": item.url,
                "sort_order": item.sort_order,
            }
            for item in result.all()
        ]


async def get_site_settings(lang: Optional[str] = None) -> dict[str, str]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(
            select(SiteSetting)
            .where(SiteSetting.is_active.is_(True))
            .order_by(SiteSetting.id.asc())
        )
        items = result.all()
        values: dict[str, str] = {}
        for item in items:
            if item.lang is None:
                values[item.key] = item.value
        if lang:
            for item in items:
                if item.lang == lang:
                    values[item.key] = item.value
        return values


async def create_press_item(
    url: str,
    title: Optional[str] = None,
    kind: str = "article",
    source: Optional[str] = None,
    published_at: Optional[datetime] = None,
    description: Optional[str] = None,
    lang: str = "en",
) -> PressItem:
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(PressItem).where(PressItem.url == url))
        item = result.first()
        if not item:
            item = PressItem(url=url, title=title, kind=kind, source=source, published_at=published_at, description=description)
            session.add(item)
            await session.commit()
            await session.refresh(item)
        tr_result = await session.exec(
            select(PressItemTranslation).where(
                PressItemTranslation.press_item_id == item.id,
                PressItemTranslation.lang == lang,
            )
        )
        translation = tr_result.first()
        if not translation:
            translation = PressItemTranslation(press_item_id=item.id, lang=lang, title=title, description=description)
        else:
            translation.title = title or translation.title
            translation.description = description or translation.description
        session.add(translation)
        await session.commit()
        return item


async def list_press_items(lang: Optional[str] = None) -> List[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.exec(
            select(PressItem).options(selectinload(PressItem.translations)).order_by(PressItem.published_at.desc().nullslast(), PressItem.id.desc())
        )
        items = []
        for item in result.all():
            translation = _pick_translation(item.translations, lang)
            items.append(
                {
                    "id": item.id,
                    "title": getattr(translation, "title", None) or item.title,
                    "url": item.url,
                    "kind": item.kind,
                    "source": item.source,
                    "published_at": item.published_at.isoformat() if item.published_at else None,
                    "description": getattr(translation, "description", None) or item.description,
                }
            )
        return items


async def seed_default_content() -> None:
    release_seed = [
        {
            "slug": "UXd3W",
            "external_url": "https://band.link/UXd3W",
            "title": None,
            "lang": "en",
            "description": None,
            "sort_order": 0,
        },
        {
            "slug": "SJMpv",
            "external_url": "https://band.link/SJMpv",
            "title": "D.E.R.F. -- Hideout",
            "lang": "en",
            "description": None,
            "sort_order": 1,
        },
    ]
    event_seed = [
        ("D.E.R.F. in Money Honey: Jam Fest", "Money Honey", "Saint Petersburg", "2026-01-25T20:00:00"),
        ("D.E.R.F. at Underground Rock Spb", "Underground Rock SPB", "Saint Petersburg", "2026-01-03T18:00:00"),
        ("D.E.R.F. at Underground Metal Fest IV", "Underground Metal Fest IV", "Saint Petersburg", "2025-12-04T18:30:00"),
        ("D.E.R.F. in MoneyHoney: JamFest", "MoneyHoney", "Saint Petersburg", "2025-10-26T20:20:00"),
        ("D.E.R.F. in Ionoteka: Underground Metal", "Ionoteka", "Saint Petersburg", "2025-10-01T18:00:00"),
        ("D.E.R.F. in Money Honey", "Money Honey", "Saint Petersburg", "2025-08-24T20:20:00"),
        ("Concert by D.E.R.F. at GarazhSaray", "GarazhSaray", "Saint Petersburg", "2025-07-13T19:00:00"),
        ("D.E.R.F. in Money Honey", "Money Honey", "Saint Petersburg", "2024-12-15T19:30:00"),
        ("Concert by D.E.R.F. at Fish Fabrique", "Fish Fabrique", "Saint Petersburg", "2024-11-17T19:00:00"),
        ("D.E.R.F. at JamFest in Money Honey", "Money Honey", "Saint Petersburg", "2024-10-27T19:00:00"),
        ("Concert by D.E.R.F. in Saint Petersburg", "Saint Petersburg", "Saint Petersburg", "2024-05-25T19:00:00"),
        ("Concert by D.E.R.F.", "Saint Petersburg", "Saint Petersburg", "2024-02-01T19:00:00"),
    ]
    press_seed = [
        ("https://vk.com/@derfmusic-teksty-pesen-derf", "Тексты песен D.E.R.F.", "article", "VK"),
        ("https://vk.com/@derfmusic-o-zapisi-nastoyaschego-rokametala", "О записи настоящего рокаметала", "article", "VK"),
        ("https://www.youtube.com/@D_E_R_F", "YouTube channel", "video_archive", "YouTube"),
        ("https://vkvideo.ru/@derfmusic/all", "VK Video archive", "video_archive", "VK Video"),
    ]
    media_seed = [
        {
            "media_type": "photo",
            "source": "local",
            "url": "/assets/logo-placeholder.svg",
            "thumbnail_url": "/assets/logo-placeholder.svg",
            "title": "D.E.R.F. Live",
            "alt_text": "D.E.R.F. live performance",
            "caption": "Live performance",
            "lang": "en",
            "is_featured": True,
        },
    ]
    site_link_seed = [
        {"key": "vk", "label": "VK", "url": "https://vk.com/derfmusic", "sort_order": 0},
        {"key": "youtube", "label": "YouTube", "url": "https://www.youtube.com/@D_E_R_F", "sort_order": 1},
        {"key": "vk-video", "label": "VK Video", "url": "https://vkvideo.ru/@derfmusic/all", "sort_order": 2},
        {"key": "bandlink", "label": "Band.link", "url": "https://band.link/UXd3W", "sort_order": 3},
    ]
    site_setting_seed = [
        {"key": "site_name", "lang": None, "value": "D.E.R.F."},
        {"key": "site_title_suffix", "lang": None, "value": "Official"},
        {"key": "site_description", "lang": "en", "value": "D.E.R.F. — official band website"},
        {"key": "site_description", "lang": "ru", "value": "D.E.R.F. — официальный сайт группы"},
    ]

    async with AsyncSessionLocal() as session:
        for seed in release_seed:
            result = await session.exec(select(Release).where(Release.slug == seed["slug"]))
            release = result.first()
            if not release:
                release = Release(
                    slug=seed["slug"],
                    external_url=seed["external_url"],
                    sort_order=seed["sort_order"],
                )
                session.add(release)
                await session.commit()
                await session.refresh(release)
            tr_result = await session.exec(
                select(ReleaseTranslation).where(
                    ReleaseTranslation.release_id == release.id,
                    ReleaseTranslation.lang == seed["lang"],
                )
            )
            translation = tr_result.first()
            if not translation:
                translation = ReleaseTranslation(
                    release_id=release.id,
                    lang=seed["lang"],
                    title=seed["title"],
                    description=seed["description"],
                )
                session.add(translation)
                await session.commit()

        for title, venue, city, start_at in event_seed:
            result = await session.exec(select(Event).where(Event.title == title, Event.start_at == datetime.fromisoformat(start_at)))
            event = result.first()
            if not event:
                event = Event(title=title, venue=venue, city=city, start_at=datetime.fromisoformat(start_at))
                session.add(event)
                await session.commit()
                await session.refresh(event)
            tr_result = await session.exec(
                select(EventTranslation).where(EventTranslation.event_id == event.id, EventTranslation.lang == "en")
            )
            translation = tr_result.first()
            if not translation:
                translation = EventTranslation(event_id=event.id, lang="en", title=title)
                session.add(translation)
                await session.commit()

        for url, title, kind, source in press_seed:
            result = await session.exec(select(PressItem).where(PressItem.url == url))
            item = result.first()
            if not item:
                item = PressItem(url=url, title=title, kind=kind, source=source)
                session.add(item)
                await session.commit()
                await session.refresh(item)
            tr_result = await session.exec(
                select(PressItemTranslation).where(PressItemTranslation.press_item_id == item.id, PressItemTranslation.lang == "en")
            )
            translation = tr_result.first()
            if not translation:
                translation = PressItemTranslation(press_item_id=item.id, lang="en", title=title)
                session.add(translation)
                await session.commit()

        for seed in media_seed:
            result = await session.exec(select(MediaItem).where(MediaItem.url == seed["url"], MediaItem.lang == seed["lang"]))
            item = result.first()
            if not item:
                session.add(MediaItem(**seed))
                await session.commit()

        for seed in site_link_seed:
            result = await session.exec(select(SiteLink).where(SiteLink.key == seed["key"]))
            link = result.first()
            if not link:
                link = SiteLink(**seed)
            else:
                link.label = seed["label"]
                link.url = seed["url"]
                link.sort_order = seed["sort_order"]
                link.is_active = True
            session.add(link)
            await session.commit()

        for seed in site_setting_seed:
            result = await session.exec(
                select(SiteSetting).where(SiteSetting.key == seed["key"], SiteSetting.lang == seed["lang"])
            )
            setting = result.first()
            if not setting:
                setting = SiteSetting(**seed)
            else:
                setting.value = seed["value"]
                setting.is_active = True
            session.add(setting)
            await session.commit()
