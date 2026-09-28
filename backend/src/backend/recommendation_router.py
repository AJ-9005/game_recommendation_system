from fastapi import APIRouter, HTTPException, Query, status
from typing import List
from backend.ml.content import recommender

recommendation_router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@recommendation_router.get("/content/{rawg_id}", response_model=List[dict])
async def get_content_recommendations(
    rawg_id: int, 
    limit: int = Query(10, ge=1, le=50)
):
    """
    Returns top N content-based game recommendations using TF-IDF and Cosine Similarity.
    """
    results = recommender.recommend_similar_games(rawg_id=rawg_id, top_n=limit)
    print(results)
    
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Game not found in recommendation matrix or insufficient catalog data."
        )
    return results

@recommendation_router.post("/reload", status_code=status.HTTP_200_OK)
async def reload_recommender():
    """
    Endpoint to trigger a matrix rebuild after running batch seeds or live searches.
    """
    await recommender.fit()
    return {"status": "success", "message": "Content Recommender matrix retrained successfully."}