from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from pathlib import Path
from uuid import uuid4
import aiofiles
from app.core.config import settings
from app.crud import save_media_item
from app.models import MediaItem

router = APIRouter()

def secure_filename(name: str) -> str:
    import re
    return re.sub(r'[^A-Za-z0-9._-]', '_', name)

@router.post('/media/upload')
async def upload_media(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    # Save file to MEDIA_ROOT
    root = Path(settings.MEDIA_ROOT)
    root.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename).suffix or ''
    uid = uuid4().hex
    fname = f"{uid}{ext}"
    dest = root / fname
    try:
        async with aiofiles.open(dest, 'wb') as out:
            while chunk := await file.read(1024 * 64):
                await out.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # Optionally enqueue thumbnail generation as background task
    # Save metadata in DB
    mi = MediaItem(media_type='photo', source='local', source_id=None, url=f"/media/{fname}")
    saved = await save_media_item(mi)
    return {'id': saved.id, 'url': saved.url}

@router.get('/media/list')
async def list_media():
    # Simple listing (for frontend). In production add pagination.
    async with AsyncSessionLocal() as session:
        q = select(MediaItem).order_by(MediaItem.uploaded_at.desc())
        r = await session.exec(q)
        return r.all()