from fastapi import FastAPI

from app.routers.chat import router as chat_router

app = FastAPI(
    title="AI Agent Bootcamp",
    version="1.0.0"
)

app.include_router(chat_router)