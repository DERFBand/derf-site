from fastapi import APIRouter, HTTPException
from typing import Optional
from app.crud import create_release_with_translation

router = APIRouter()

@router.post('/releases')
async def post_release(slug: str, release_date: Optional[str]=None, title: str=None, description: str=None, lang: str='ru'):
    rel = await create_release_with_translation(slug, release_date, title, description, lang)
    return {'id': rel.id}