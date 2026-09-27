import logging
from backend.utils.rawgapi import fetch_games_by_genre
from backend.connect import db

logger = logging.getLogger(__name__)
CORE_GENRES = ["action", "indie", "adventure", "role-playing-games-rpg", "strategy", "shooter", "casual", "simulation", "puzzle", "arcade", "platformer", "racing", "sports", "massively-multiplayer", "fighting", "family", "board-games"]

async def genrewise_import(games_per_genre: int = 30) -> dict:
    total_processed = 0
    total_inserted = 0
    for genre in CORE_GENRES:
        try:
            games = await fetch_games_by_genre(genre, games_per_genre)
            for game in games:
                result = await db.games.update_one({"rawg_id": game["rawg_id"]}, {"$set": game}, upsert=True)
                total_processed += 1
                if result.upserted_id:
                    total_inserted += 1
        except Exception as e:
            logger.error(f"Failed to seed genre '{genre}': {str(e)}")
            continue
    return {
        "status": "success",
        "genres_processed": len(CORE_GENRES),
        "total_games_processed": total_processed,
        "new_games_inserted": total_inserted
    }