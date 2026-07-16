from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.chat import router as chat_router
from app.routers.budget import router as budget_router
app = FastAPI(
    title="AI Agent Bootcamp",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Allows Angular port
    allow_credentials=True,
    allow_methods=["*"],                      # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],                      # Allows all headers
)

app.include_router(chat_router)
app.include_router(budget_router)