from fastapi import APIRouter, HTTPException
from app.schemas import UserCreate, UserRead, Token
from app.models import User
from app.core.security import get_password_hash, create_access_token, verify_password
from app.crud import get_user_by_username, create_user

router = APIRouter()

@router.post('/register', response_model=UserRead)
async def register(data: UserCreate):
    existing = await get_user_by_username(data.username)
    if existing:
        raise HTTPException(status_code=400, detail='Username already taken')
    u = User(username=data.username, email=data.email, hashed_password=get_password_hash(data.password))
    user = await create_user(u)
    return UserRead(id=user.id, username=user.username, email=user.email, is_active=user.is_active)

@router.post('/login', response_model=Token)
async def login(data: UserCreate):
    user = await get_user_by_username(data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_access_token(str(user.id))
    return Token(access_token=token)