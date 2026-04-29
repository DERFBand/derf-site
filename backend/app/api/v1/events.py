from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query

from app.crud import list_events, seed_default_content
from app.schemas import EventRead

router = APIRouter()


@router.get('/events', response_model=list[EventRead])
async def get_events(lang: Optional[str] = Query(default=None)):
    return [EventRead(**item) for item in await list_events(lang=lang)]


@router.post('/events/bulk-add')
async def bulk_add_events():
    await seed_default_content()
    return {"status": "ok"}
