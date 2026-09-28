from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from backend.connect import db
from backend.utils.seed_games import genrewise_import
from backend.utils.rawgapi import search_games_from_rawg
from backend.dependencies import get_user
from backend.ml.content import recommender

games_router = APIRouter(prefix="/games", tags=["games"])

@games_router.post("/seed", status_code=201)
async def seed_games(games_per_genre: int = Query(30, ge=5, le=50), current_user: dict = Depends(get_user)):
    summary = await genrewise_import(games_per_genre)
    await recommender.fit()
    return summary

@games_router.get("/", response_model=List[dict])
async def list_games(limit: int = Query(20, ge=1, le=100), skip: int = Query(0, ge=0), genre: Optional[str] = None):
    query = {}
    if genre:
        query["genres"] = {"$regex": f"^{genre}$", "$options": "i"}
    cursor = db.games.find(query).skip(skip).limit(limit)
    games = await cursor.to_list(length=limit)
    for game in games:
        game["_id"] = str(game["_id"])
    return games

@games_router.get("/search", response_model=List[dict])
async def search_games(q: str = Query(..., min_length=2)):
    local_cursor = db.games.find({
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"genres": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}}
        ]
    }).limit(20)
    local_games = await local_cursor.to_list(length=20)
    if len(local_games) >= 5:
        for game in local_games:
            game["_id"] = str(game["_id"])
        return local_games
    try:
        rawg_results = await search_games_from_rawg(search_query=q, page_size=15)
        for game in rawg_results:
            await db.games.update_one(
                {"rawg_id": game["rawg_id"]},
                {"$set": game},
                upsert=True
            )
        updated_cursor = db.games.find({
            "$or": [
                {"title": {"$regex": q, "$options": "i"}},
                {"genres": {"$regex": q, "$options": "i"}},
                {"tags": {"$regex": q, "$options": "i"}}
            ]
        }).limit(20)
        merged_games = await updated_cursor.to_list(length=20)
        for game in merged_games:
            game["_id"] = str(game["_id"])
            
        return merged_games
    except Exception as e:
        for game in local_games:
            game["_id"] = str(game["_id"])
        return local_games