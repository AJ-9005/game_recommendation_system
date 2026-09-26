from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import auth_router

origins = ["http://localhost:5173"]

app = FastAPI(title = "GameVault")

app.include_router(auth_router)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def signal():
    return "Server running"