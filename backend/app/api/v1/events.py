from fastapi import APIRouter, HTTPException
from typing import List
from app.crud import list_events, create_event
from datetime import datetime

router = APIRouter()

@router.get('/events')
async def get_events():
    events = await list_events()
    return events

# Useful endpoint to bulk insert the known events you provided
@router.post('/events/bulk-add')
async def bulk_add_events():
    # The list below is compiled from conversation and verified event list
    raw = [
        # date strings are ISO-like; adjust timezone if needed
        {"title":"Jam Fest — D.E.R.F. live","venue":"Money Honey","city":"Saint Petersburg","start_at":"2026-01-25T20:00:00"},
        {"title":"Underground Rock SPB — D.E.R.F.","venue":"GarazhSaray","city":"Saint Petersburg","start_at":"2026-01-03T18:00:00"},
        {"title":"Underground Metal Fest IV — D.E.R.F.","venue":"Underground Fest","city":"Saint Petersburg","start_at":"2025-12-04T18:30:00"},
        {"title":"JamFest — D.E.R.F. at MoneyHoney","venue":"Money Honey","city":"Saint Petersburg","start_at":"2025-10-26T20:20:00"},
        {"title":"Underground Metal — D.E.R.F.","venue":"Ionoteka","city":"Saint Petersburg","start_at":"2025-10-01T18:00:00"},
        {"title":"Money Honey — D.E.R.F.","venue":"Money Honey","city":"Saint Petersburg","start_at":"2025-08-24T20:20:00"},
        {"title":"Concert at GarazhSaray — D.E.R.F.","venue":"GarazhSaray","city":"Saint Petersburg","start_at":"2025-07-13T19:00:00"},
        {"title":"Money Honey — D.E.R.F. December show","venue":"Money Honey","city":"Saint Petersburg","start_at":"2024-12-15T19:30:00"},
        {"title":"Fish Fabrique — D.E.R.F.","venue":"Fish Fabrique","city":"Saint Petersburg","start_at":"2024-11-17T19:00:00"},
        {"title":"JamFest at Money Honey — D.E.R.F.","venue":"Money Honey","city":"Saint Petersburg","start_at":"2024-10-27T19:00:00"},
        {"title":"Saint Petersburg special show — D.E.R.F.","venue":"Various","city":"Saint Petersburg","start_at":"2024-05-25T19:00:00"},
        {"title":"Winter concert — D.E.R.F.","venue":"Various","city":"Saint Petersburg","start_at":"2024-02-01T19:00:00"}
    ]
    inserted = []
    for r in raw:
        e = await create_event(r["title"], r["venue"], r["city"], datetime.fromisoformat(r["start_at"]))
        inserted.append({"id": e.id, "title": e.title})
    return {"inserted": inserted}