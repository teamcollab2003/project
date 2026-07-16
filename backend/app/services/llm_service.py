from openai import OpenAI

from app.config import (
    OPENROUTER_API_KEY,
    LLM_MODEL,
    LLM_TEMPERATURE,
    LLM_MAX_TOKENS
)

client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


def ask_llm(prompt: str):

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=LLM_TEMPERATURE,
        max_tokens=LLM_MAX_TOKENS
    )

    print(f"Model: {response.model}")

    return response.choices[0].message.content