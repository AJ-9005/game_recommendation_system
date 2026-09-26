from fastapi import APIRouter, HTTPException, status
from backend.models.user import User, UserResponse, TokenResponse, UserLogin
from backend.connect import db
from backend.utils.encrypter import encrypt_password, verify_password
import os
from datetime import datetime, timedelta, timezone
import jwt

secret = os.getenv("JWT_SECRET")

def encode_token(data: dict) -> str:
    payload = data.copy()
    expiry = datetime.now(timezone.utc) + timedelta(minutes=60*24)
    payload.update({"exp": expiry})
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def createUser(user: User):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")
    user_dict = user.model_dump()
    user_dict["password"] = encrypt_password(user.password)
    result = await db.users.insert_one(user_dict)
    return UserResponse(id = str(result.inserted_id), username = user.username, email = user.email)

@auth_router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found!")
    if not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials!")
    token = encode_token({"userid": user["_id"]})
    return TokenResponse(token)