from fastapi import APIRouter, Depends, HTTPException, status
from backend.connect import db
from backend.dependencies import get_user
from bson import ObjectId

interaction_router = APIRouter(prefix="/users/me/library", tags=["User Library"])

@interaction_router.post("/{rawg_id}", status_code=status.HTTP_200_OK)
async def add_to_library(rawg_id: int, current_user: dict = Depends(get_user)):
    await db.users.update_one({"_id": ObjectId(current_user["_id"])}, {"$addToSet": {"library": int(rawg_id)}})
    return {"status": "success", "message": f"Game {rawg_id} added to library."}

@interaction_router.delete("/{rawg_id}", status_code=status.HTTP_200_OK)
async def remove_from_library(rawg_id: int, current_user: dict = Depends(get_user)):
    await db.users.update_one({"_id": current_user["_id"]}, {"$pull": {"library": rawg_id}})
    return {"status": "success", "message": f"Game {rawg_id} removed from library."}