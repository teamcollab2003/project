import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from openai import OpenAI  # 🚀 We utilize OpenAI SDK to route to OpenRouter
from dotenv import load_dotenv

# Load all variables from .env (forcing override)
load_dotenv(override=True)

router = APIRouter(
    prefix="/api/budget",
    tags=["Budget Analysis"]
)

# Fetch variables from .env
openrouter_key = os.getenv("OPENROUTER_API_KEY")
model_name = os.getenv("LLM_MODEL", "google/gemini-2.5-flash")
temperature = float(os.getenv("LLM_TEMPERATURE", "0.2"))
max_tokens = int(os.getenv("LLM_MAX_TOKENS", "300"))

# Ensure we keep the "google/" prefix for OpenRouter routing
if not model_name.startswith("google/"):
    model_name = f"google/{model_name}"

print("\n=================== SYSTEM ENVIRONMENT DEBUG ===================")
if openrouter_key:
    print(f"✅ SUCCESS: OPENROUTER_API_KEY Loaded!")
    print(f"🤖 API CLIENT: Routing Gemini via OpenRouter.")
else:
    print("❌ ERROR: OPENROUTER_API_KEY is missing from .env!")
print(f"🎯 Target Model: {model_name}")
print("================================================================\n")

# Initialize OpenRouter Client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key
)

class BudgetPayload(BaseModel):
    persona: str
    parameters: Dict[str, Any]

def load_budget_facts(persona: str) -> str:
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(base_dir, "data", "budget_measures.json")
        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        persona_data = data.get(persona.lower(), {})
        measures = persona_data.get("key_measures", [])
        return "\n".join([f"- {measure}" for measure in measures])
    except Exception as e:
        print(f"Error loading local budget JSON: {e}")
        return ""

@router.post("/analyze")
async def analyze_budget(payload: BudgetPayload):
    try:
        # 1. Fetch the relevant facts from your JSON file
        ground_truth_facts = load_budget_facts(payload.persona)
        
        system_instruction = (
            "You are 'Smart Budget Moris', an expert Mauritian financial analyst assistant. "
            "Your sole task is to explain how the provided Mauritian National Budget measures affect the user. "
            "IMPORTANT: Use ONLY the provided Ground Truth measures to formulate your analysis. "
            "Do not invent policies outside of what is explicitly given to you. "
            "Be empathetic, highly practical, and deliver the report using clean bullet points."
        )

        user_profile = f"User Persona: {payload.persona.upper()}\nProfile Details:\n"
        for key, val in payload.parameters.items():
            if val is not None and val != "":
                user_profile += f"- {key}: {val}\n"

        prompt = (
            f"--- GROUND TRUTH MAURITIAN BUDGET MEASURES ---\n"
            f"{ground_truth_facts}\n\n"
            f"--- USER PROFILE ---\n"
            f"{user_profile}\n\n"
            f"Please analyze my profile against the ground truth measures and tell me exactly how my pocket is impacted."
        )

        # 2. Query Gemini via OpenRouter
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )

        analysis_text = response.choices[0].message.content

        return {"status": "success", "analysis": analysis_text}

    except Exception as e:
        print(f"Error running analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))