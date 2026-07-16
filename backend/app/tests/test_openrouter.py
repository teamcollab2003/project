from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

response = client.chat.completions.create(
    model="google/gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Say hello."
        }
    ]
)

print(response.model)
print(response.choices[0].message.content)