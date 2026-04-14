from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from app.crud import create_release_with_translation, list_events, list_media, list_press_items, list_releases
from app.schemas import EventRead, HomeContent, MediaItemRead, PressItemRead, ReleaseCreate, ReleaseRead

router = APIRouter()


def _release_read(item: dict) -> ReleaseRead:
    return ReleaseRead(**item)


def _event_read(item: dict) -> EventRead:
    return EventRead(**item)


def _press_read(item: dict) -> PressItemRead:
    return PressItemRead(**item)


@router.get('/releases', response_model=list[ReleaseRead])
async def api_get_releases(lang: Optional[str] = Query(default=None)):
    return [_release_read(item) for item in await list_releases(lang=lang)]


@router.post('/releases', response_model=ReleaseRead)
async def post_release(data: ReleaseCreate):
    release = await create_release_with_translation(
        slug=data.slug,
        release_date=data.release_date,
        title=data.title,
        description=data.description,
        lang=data.lang,
        external_url=data.external_url,
        cover_url=data.cover_url,
        sort_order=data.sort_order,
    )
    items = await list_releases(lang=data.lang)
    for item in items:
        if item['id'] == release.id:
            return ReleaseRead(**item)
    return ReleaseRead(
        id=release.id,
        slug=release.slug,
        external_url=release.external_url,
        cover_url=release.cover_url,
        release_date=release.release_date,
        title=data.title,
        description=data.description,
        sort_order=release.sort_order,
    )


@router.get('/press', response_model=list[PressItemRead])
async def api_get_press(lang: Optional[str] = Query(default=None)):
    return [_press_read(item) for item in await list_press_items(lang=lang)]


@router.get('/home', response_model=HomeContent)
async def home_content(lang: Optional[str] = Query(default=None)):
    releases = await list_releases(lang=lang)
    events = await list_events(lang=lang)
    media = await list_media(featured_only=True)
    press = await list_press_items(lang=lang)
    latest_release = ReleaseRead(**releases[0]) if releases else None
    next_event = None
    now = datetime.utcnow()
    for event in events:
        start_at = event.get('start_at')
        if not start_at:
            continue
        try:
            event_dt = datetime.fromisoformat(start_at)
        except ValueError:
            continue
        if event_dt >= now and not event.get('is_cancelled'):
            next_event = EventRead(**event)
            break
    return HomeContent(
        latest_release=latest_release,
        next_event=next_event,
        featured_media=[MediaItemRead(**item) for item in media[:6]],
        press_items=[PressItemRead(**item) for item in press[:4]],
    )
