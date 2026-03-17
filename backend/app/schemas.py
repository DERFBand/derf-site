from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr]
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr]
    is_active: bool

class ReleaseCreate(BaseModel):
    slug: str
    release_date: Optional[datetime]
    title: str
    description: Optional[str]
    lang: str