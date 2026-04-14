from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from app.crud import create_event, list_events
from app.schemas import EventCreate, EventRead

router = APIRouter()


@router.get('/events', response_model=list[EventRead])
async def get_events(lang: Optional[str] = Query(default=None)):
    return [EventRead(**item) for item in await list_events(lang=lang)]


@router.post('/events/bulk-add')
async def bulk_add_events():
    raw = [
        {'title': 'D.E.R.F. in Money Honey: Jam Fest', 'venue': 'Money Honey', 'city': 'Saint Petersburg', 'start_at': '2026-01-25T20:00:00'},
        {'title': 'D.E.R.F. at Underground Rock Spb', 'venue': 'Underground Rock SPB', 'city': 'Saint Petersburg', 'start_at': '2026-01-03T18:00:00'},
        {'title': 'D.E.R.F. at Underground Metal Fest IV', 'venue': 'Underground Metal Fest IV', 'city': 'Saint Petersburg', 'start_at': '2025-12-04T18:30:00'},
        {'title': 'D.E.R.F. in MoneyHoney: JamFest', 'venue': 'MoneyHoney', 'city': 'Saint Petersburg', 'start_at': '2025-10-26T20:20:00'},
        {'title': 'D.E.R.F. in Ionoteka: Underground Metal', 'venue': 'Ionoteka', 'city': 'Saint Petersburg', 'start_at': '2025-10-01T18:00:00'},
        {'title': 'D.E.R.F. in Money Honey', 'venue': 'Money Honey', 'city': 'Saint Petersburg', 'start_at': '2025-08-24T20:20:00'},
        {'title': 'Concert by D.E.R.F. at GarazhSaray', 'venue': 'GarazhSaray', 'city': 'Saint Petersburg', 'start_at': '2025-07-13T19:00:00'},
        {'title': 'D.E.R.F. in Money Honey', 'venue': 'Money Honey', 'city': 'Saint Petersburg', 'start_at': '2024-12-15T19:30:00'},
        {'title': 'Concert by D.E.R.F. at Fish Fabrique', 'venue': 'Fish Fabrique', 'city': 'Saint Petersburg', 'start_at': '2024-11-17T19:00:00'},
        {'title': 'D.E.R.F. at JamFest in Money Honey', 'venue': 'Money Honey', 'city': 'Saint Petersburg', 'start_at': '2024-10-27T19:00:00'},
        {'title': 'Concert by D.E.R.F. in Saint Petersburg', 'venue': 'Saint Petersburg', 'city': 'Saint Petersburg', 'start_at': '2024-05-25T19:00:00'},
        {'title': 'Concert by D.E.R.F.', 'venue': 'Saint Petersburg', 'city': 'Saint Petersburg', 'start_at': '2024-02-01T19:00:00'},
    ]
    inserted = []
    for row in raw:
        event = await create_event(row['title'], row['venue'], row['city'], datetime.fromisoformat(row['start_at']), lang='en')
        inserted.append({'id': event.id, 'title': event.title})
    return {'inserted': inserted}
