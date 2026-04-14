from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import create_access_token, get_current_user, get_password_hash, verify_password
from app.crud import create_user, get_user_by_username
from app.models import User
from app.schemas import Token, UserCreate, UserLogin, UserRead

router = APIRouter()


def _to_user_read(user: User) -> UserRead:
    return UserRead(id=user.id, username=user.username, email=user.email, is_active=user.is_active, is_superuser=user.is_superuser)


@router.post("/register", response_model=UserRead)
async def register(data: UserCreate):
    existing = await get_user_by_username(data.username)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    user = User(username=data.username, email=data.email, hashed_password=get_password_hash(data.password))
    created = await create_user(user)
    return _to_user_read(created)


@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    user = await get_user_by_username(data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return _to_user_read(current_user)
