from dotenv import load_dotenv
import os

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

LLM_MODEL = os.getenv("LLM_MODEL")

LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE"))

LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS"))

# assert OPENROUTER_API_KEY, "OPENROUTER_API_KEY is not set"

# MODEL = "qwen/qwen3-coder" #excellent and cheap when building code 

# MODEL = "deepseek/deepseek-chat" #excellent and cheap for general purpose