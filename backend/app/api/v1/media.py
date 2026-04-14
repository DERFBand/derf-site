from __future__ import annotations

from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import settings
from app.crud import list_media, save_media_item
from app.models import MediaItem
from app.schemas import MediaItemRead

router = APIRouter()


@router.post('/media/upload', response_model=MediaItemRead)
async def upload_media(
    file: UploadFile = File(...),
    media_type: str = Form(default='photo'),
    source: str = Form(default='local'),
    title: str | None = Form(default=None),
    alt_text: str | None = Form(default=None),
    caption: str | None = Form(default=None),
    lang: str | None = Form(default=None),
    is_featured: bool = Form(default=False),
):
    root = Path(settings.MEDIA_ROOT)
    root.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename or '').suffix or ''
    fname = f'{uuid4().hex}{ext}'
    dest = root / fname
    try:
        async with aiofiles.open(dest, 'wb') as out:
            while True:
                chunk = await file.read(64 * 1024)
                if not chunk:
                    break
                await out.write(chunk)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    item = MediaItem(
        media_type=media_type,
        source=source,
        url=f'/media/{fname}',
        title=title,
        alt_text=alt_text,
        caption=caption,
        lang=lang,
        is_featured=is_featured,
    )
    saved = await save_media_item(item)
    return MediaItemRead(
        id=saved.id,
        media_type=saved.media_type,
        source=saved.source,
        source_id=saved.source_id,
        url=saved.url,
        thumbnail_url=saved.thumbnail_url,
        title=saved.title,
        alt_text=saved.alt_text,
        caption=saved.caption,
        lang=saved.lang,
        is_featured=saved.is_featured,
        uploaded_at=saved.uploaded_at,
    )


@router.get('/media/list', response_model=list[MediaItemRead])
async def api_list_media(media_type: str | None = None, featured_only: bool = False):
    return [MediaItemRead(**item) for item in await list_media(media_type=media_type, featured_only=featured_only)]
