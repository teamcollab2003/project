from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.assistant_agent import run

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    reply = run(request.message)

    return ChatResponse(reply=reply)