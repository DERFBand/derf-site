from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app import models
from app.core.config import settings

engine = create_async_engine(str(settings.DATABASE_URL), echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    # Create tables if they don't exist (for dev/testing). In prod use alembic migrations.
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
