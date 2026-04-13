from typing import Optional

from fastapi import APIRouter

from app.crud import create_release_with_translation, get_releases

router = APIRouter()


@router.post("/releases")
async def post_release(
    slug: str, release_date: Optional[str] = None, title: str = None, description: str = None, lang: str = "ru"
):
    rel = await create_release_with_translation(slug, release_date, title, description, lang)
    return {"id": rel.id}


@router.get("/releases")
async def api_get_releases():
    return await get_releases()
