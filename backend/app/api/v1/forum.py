from fastapi import APIRouter, HTTPException
from app.models import Thread, Post
from app.db.session import AsyncSessionLocal
from sqlmodel import select

router = APIRouter()

@router.post('/threads')
async def create_thread(title: str, created_by_id: int):
    async with AsyncSessionLocal() as session:
        t = Thread(title=title, created_by_id=created_by_id)
        session.add(t)
        await session.commit()
        await session.refresh(t)
        return t

@router.post('/threads/{thread_id}/posts')
async def create_post(thread_id: int, author_id: int, content: str):
    async with AsyncSessionLocal() as session:
        p = Post(thread_id=thread_id, author_id=author_id, content=content)
        session.add(p)
        await session.commit()
        await session.refresh(p)
        return p

@router.get('/threads')
async def list_threads():
    async with AsyncSessionLocal() as session:
        q = select(Thread)
        r = await session.exec(q)
        return r.all()