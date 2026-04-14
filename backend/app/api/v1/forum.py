from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app.core.security import get_current_user
from app.db.session import AsyncSessionLocal
from app.models import Post, Thread, User
from app.schemas import PostCreate, PostRead, ThreadCreate, ThreadRead

router = APIRouter()


@router.post('/threads', response_model=ThreadRead)
async def create_thread(data: ThreadCreate, current_user: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        thread = Thread(title=data.title, created_by_id=current_user.id)
        session.add(thread)
        await session.commit()
        await session.refresh(thread)
        return ThreadRead(id=thread.id, title=thread.title, created_by_id=thread.created_by_id, created_at=thread.created_at)


@router.post('/threads/{thread_id}/posts', response_model=PostRead)
async def create_post(thread_id: int, data: PostCreate, current_user: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        thread_result = await session.exec(select(Thread).where(Thread.id == thread_id))
        thread = thread_result.first()
        if not thread:
            raise HTTPException(status_code=404, detail='Thread not found')
        post = Post(thread_id=thread_id, author_id=current_user.id, content=data.content)
        session.add(post)
        await session.commit()
        await session.refresh(post)
        return PostRead(id=post.id, thread_id=post.thread_id, author_id=post.author_id, content=post.content, created_at=post.created_at)


@router.get('/threads/{thread_id}/posts', response_model=list[PostRead])
async def list_posts(thread_id: int):
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(Post).where(Post.thread_id == thread_id).order_by(Post.created_at.asc()))
        posts = result.all()
        return [PostRead(id=post.id, thread_id=post.thread_id, author_id=post.author_id, content=post.content, created_at=post.created_at) for post in posts]


@router.get('/threads', response_model=list[ThreadRead])
async def list_threads():
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(Thread).order_by(Thread.created_at.desc()))
        threads = result.all()
        return [ThreadRead(id=t.id, title=t.title, created_by_id=t.created_by_id, created_at=t.created_at) for t in threads]
