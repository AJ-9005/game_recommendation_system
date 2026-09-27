from typing import Optional, List
from pydantic import BaseModel, Field

class Game(BaseModel):
    rawg_id: int
    title: str
    slug: str
    released: Optional[str] = None
    background_image: Optional[str] = None
    rating: float = 0.0
    metacritic: Optional[int] = None
    genres: List[str] = []
    tags: List[str] = []
    developers: List[str] = []
    publishers: List[str] = []
    platforms: List[str] = []
    summary: Optional[str] = None
    feature_text: Optional[str] = None

class GameInDB(Game):
    id: str = Field(..., alias="_id")

class GameSearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 20