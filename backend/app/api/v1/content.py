from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from app.crud import create_release_with_translation, get_site_settings, list_events, list_media, list_press_items, list_releases, list_site_links
from app.schemas import EventRead, HomeContent, MediaItemRead, PressItemRead, ReleaseCreate, ReleaseRead, SiteLinkRead, SiteSettingsRead

router = APIRouter()


def _as_model_list(items: list[dict], model):
    return [model(**item) for item in items]


@router.get('/releases', response_model=list[ReleaseRead])
async def api_get_releases(lang: Optional[str] = Query(default=None)):
    return _as_model_list(await list_releases(lang=lang), ReleaseRead)


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
    return _as_model_list(await list_press_items(lang=lang), PressItemRead)


@router.get('/links', response_model=list[SiteLinkRead])
async def api_get_links():
    return _as_model_list(await list_site_links(), SiteLinkRead)


@router.get('/settings', response_model=SiteSettingsRead)
async def api_get_settings(lang: Optional[str] = Query(default=None)):
    return SiteSettingsRead(values=await get_site_settings(lang=lang))


@router.get('/home', response_model=HomeContent)
async def home_content(lang: Optional[str] = Query(default=None)):
    releases = await list_releases(lang=lang)
    events = await list_events(lang=lang)
    media = await list_media(featured_only=True, lang=lang)
    press = await list_press_items(lang=lang)
    site_links = await list_site_links()
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
        featured_media=_as_model_list(media[:6], MediaItemRead),
        press_items=_as_model_list(press[:4], PressItemRead),
        site_links=_as_model_list(site_links, SiteLinkRead),
    )
