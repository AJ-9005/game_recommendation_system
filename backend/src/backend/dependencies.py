import os, jwt
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.connect import db

secret = os.getenv("JWT_SECRET")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user!", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        user_id: str = payload.get("userid")
        if user_id is None:
            raise credentials_error
    except jwt.PyJWTError:
        raise credentials_error
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_error
    user["_id"] = str(user_id)
    return user