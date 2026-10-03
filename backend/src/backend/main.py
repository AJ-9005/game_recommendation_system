from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import auth_router
from contextlib import asynccontextmanager
from backend.connect import init_indexes
from backend.games_router import games_router
from backend.ml.content import recommender
from backend.recommendation_router import recommendation_router
from backend.dashboard_router import dashboard_router
from backend.interaction_router import interaction_router

origins = ["http://localhost:5173"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_indexes()
    await recommender.fit()
    yield

app = FastAPI(title = "GameVault", lifespan=lifespan)
    
app.include_router(auth_router)
app.include_router(games_router)
app.include_router(recommendation_router)
app.include_router(dashboard_router)
app.include_router(interaction_router)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def signal():
    return "Server running"