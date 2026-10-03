from pydantic import EmailStr, BaseModel, Field
from typing import List, Optional

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6)
    library: list[int] = Field(default_factory=list)

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str
    library: Optional[List]