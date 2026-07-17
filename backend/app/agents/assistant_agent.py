from app.services.budget_search import retrieve_context
from app.services.llm_service import ask_llm
from app.prompts.system_prompt import SYSTEM_PROMPT
import time

def run(section: str, user_message: str):

    start = time.time()

    context = retrieve_context(
        section,
        user_message
    )
    
    print(f"Budget Search: {time.time() - start:.3f}s")

    llm_start = time.time()
    reply = ask_llm(

        system_prompt=SYSTEM_PROMPT,

        context=context,

        user_message=user_message

    )
    
    print(f"LLM Call: {time.time() - llm_start:.3f}s")
    
    return reply