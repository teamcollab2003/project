from app.services.llm_service import ask_llm


def run(user_message: str):

    reply = ask_llm(user_message)

    return reply