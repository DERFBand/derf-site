from app.core.config import settings
from pathlib import Path
from uuid import uuid4
import aiofiles
from PIL import Image

async def save_upload_file(upload_file) -> dict:
    root = Path(settings.MEDIA_ROOT)
    root.mkdir(parents=True, exist_ok=True)
    ext = Path(upload_file.filename).suffix or ''
    uid = uuid4().hex
    filename = f"{uid}{ext}"
    dest = root / filename
    async with aiofiles.open(dest, 'wb') as f:
        while chunk := await upload_file.read(64 * 1024):
            await f.write(chunk)
    # Create thumbnail synchronously (for now)
    thumb_name = None
    try:
        img = Image.open(dest)
        img.thumbnail((1200, 1200))
        thumb_name = f"{uid}_thumb.jpg"
        img.convert('RGB').save(root / thumb_name, 'JPEG', quality=85)
    except Exception:
        thumb_name = None
    return {'url': f"/media/{filename}", 'thumbnail': (f"/media/{thumb_name}" if thumb_name else None)}