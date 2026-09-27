import os
import logging
import httpx
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

rawg_api_key = os.getenv("RAWG_API_KEY")

def clean_game_payload(item: Dict[str, Any]) -> Dict[str, Any]:
    genres = [g["name"] for g in item.get("genres", []) if "name" in g]
    tags = [t["name"] for t in item.get("tags", [])[:10] if "name" in t]  # Top 10 tags
    developers = [d["name"] for d in item.get("developers", []) if "name" in d]
    publishers = [p["name"] for p in item.get("publishers", []) if "name" in p]
    platforms = [p["platform"]["name"] for p in item.get("platforms", []) if "platform" in p and "name" in p["platform"]]
    feature_components = genres + tags + developers + publishers
    feature_text = " ".join(feature_components).lower()
    return {
        "rawg_id": item.get("id"),
        "title": item.get("name"),
        "slug": item.get("slug"),
        "released": item.get("released"),
        "background_image": item.get("background_image"),
        "rating": float(item.get("rating", 0.0)),
        "metacritic": item.get("metacritic"),
        "genres": genres,
        "tags": tags,
        "developers": developers,
        "publishers": publishers,
        "platforms": platforms,
        "summary": item.get("description_raw") or item.get("description", ""),
        "feature_text": feature_text
    }

async def fetch_games_by_genre(genre_slug: str, page_size: int = 30) -> List[Dict[str, Any]]:
    if not rawg_api_key:
        raise ValueError("RAWG_API_KEY not found!")
    params = {
        "key": rawg_api_key,
        "genres": genre_slug,
        "page_size": page_size,
        "ordering": "-added",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get("https://api.rawg.io/api/games", params=params)
        response.raise_for_status()
        data = response.json()
        return [clean_game_payload(item) for item in data.get("results", [])]

async def search_games_from_rawg(search_query: str, page_size: int = 20) -> List[Dict[str, Any]]:
    if not rawg_api_key:
        raise ValueError("RAWG_API_KEY is not configured in .env file.")
    params = {
        "key": rawg_api_key,
        "search": search_query,
        "page_size": page_size,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get("https://api.rawg.io/api/games", params=params)
        response.raise_for_status()
        data = response.json()
        
        return [clean_game_payload(item) for item in data.get("results", [])]