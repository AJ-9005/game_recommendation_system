from fastapi import FastAPI, Depends, Query, APIRouter
from typing import Dict, Any, List
from backend.connect import db
from backend.ml.content import recommender
from backend.dependencies import get_user
import random

dashboard_router = APIRouter(prefix="/dashboard", tags=["Recommendations"])

@dashboard_router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard_rows(current_user: dict = Depends(get_user)):
    saved_rawg_ids = set(current_user.get("library", []))
    saved_games = []
    if saved_rawg_ids:
        saved_games = await db.games.find({"rawg_id": {"$in": list(saved_rawg_ids)}}).to_list()
        for g in saved_games:
            g["_id"] = str(g["_id"])

    row2_recommendations = []
    row3_recommendations = []
    if saved_games:
        row_2_anchor = random.choice(saved_games)
        row2_title = row_2_anchor["title"]
        row2_recommendations = recommender.recommend_similar_games(row_2_anchor["rawg_id"], exclude_ids=saved_rawg_ids)

        remaining_games = [g for g in saved_games if g["rawg_id"] != row_2_anchor["rawg_id"]]
        anchor_row3_game = random.choice(remaining_games) if remaining_games else row_2_anchor
        row3_target_genres = anchor_row3_game.get("genres", [])
        if row3_target_genres:
            row3_cursor = db.games.find({
                "genres": {"$in": row3_target_genres},
                "rawg_id": {"$nin": list(saved_rawg_ids)}
            }).sort("rating", -1)
            row3_recommendations = await row3_cursor.to_list(length=None)
            for g in row3_recommendations:
                g["_id"] = str(g["_id"])
    return {
        "row1": {
            "games": saved_games
        },
        "row2": {
            "anchor_game": row2_title,
            "games": row2_recommendations
        },
        "row3": {
            "genres": row3_target_genres,
            "games": row3_recommendations
        }
    }
