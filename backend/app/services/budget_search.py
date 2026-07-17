import json
import os
import re
from typing import Any

# -------------------------------------------------------------------
# Load all JSON files once when the server starts
# -------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

with open(os.path.join(DATA_DIR, "budget_data_clean.json"), encoding="utf-8") as f:
    BUDGET_DATA = json.load(f)

with open(os.path.join(DATA_DIR, "annex_data_clean.json"), encoding="utf-8") as f:
    ANNEX_DATA = json.load(f)

with open(os.path.join(DATA_DIR, "synonyms.json"), encoding="utf-8") as f:
    SYNONYMS = json.load(f)

with open(os.path.join(DATA_DIR, "section_keywords.json"), encoding="utf-8") as f:
    SECTION_KEYWORDS = json.load(f)


FIELD_WEIGHTS = {
    "purpose_description": 5,
    "description": 5,
    "key_initiative": 4,
    "target_goal": 4,
    "product": 4,
    "ministry_or_department": 3,
    "sector_name": 3,
    "category": 2,
    "spending_id": 1
}

# -------------------------------------------------------------------
# Convert a sentence into searchable words
# -------------------------------------------------------------------

def tokenize(text: str):

    text = text.lower()

    return re.findall(r"[a-zA-Z0-9]+", text)


# -------------------------------------------------------------------
# Expand words using synonyms
# -------------------------------------------------------------------

def expand_keywords(keywords):

    expanded = set()

    for keyword in keywords:

        expanded.add(keyword)

        if keyword in SYNONYMS:

            expanded.update(
                word.lower()
                for word in SYNONYMS[keyword]
            )

    return list(expanded)


# -------------------------------------------------------------------
# Add keywords related to the current budget section
# -------------------------------------------------------------------

def add_section_keywords(section, keywords):

    if section in SECTION_KEYWORDS:

        keywords.extend(
            SECTION_KEYWORDS[section]
        )

    return list(set(keywords))


# -------------------------------------------------------------------
# Recursive JSON search
# -------------------------------------------------------------------

def recursive_search(obj: Any, keywords, results):

    FIELD_WEIGHTS = {
        "purpose_description": 5,
        "description": 5,
        "key_initiative": 4,
        "target_goal": 4,
        "product": 4,
        "ministry_or_department": 3,
        "sector_name": 3,
        "category": 2,
        "spending_id": 1
    }

    if isinstance(obj, dict):

        score = 0

        for key, value in obj.items():

            if isinstance(value, (dict, list)):
                continue

            text = str(value).lower()

            weight = FIELD_WEIGHTS.get(key, 1)

            for keyword in keywords:

                if keyword.lower() in text:
                    score += weight

        if score > 0:

            results.append({
                "score": score,
                "data": obj
            })

        for value in obj.values():

            recursive_search(
                value,
                keywords,
                results
            )

    elif isinstance(obj, list):

        for item in obj:

            recursive_search(
                item,
                keywords,
                results
            )


# -------------------------------------------------------------------
# Search both budget files
# -------------------------------------------------------------------

def search_budget(section, question, top_k=3):

    keywords = tokenize(question)

    keywords = expand_keywords(keywords)

    keywords = add_section_keywords(
        section,
        keywords
    )

    results = []

    recursive_search(
        BUDGET_DATA,
        keywords,
        results
    )

    recursive_search(
        ANNEX_DATA,
        keywords,
        results
    )

    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return results[:top_k]


# -------------------------------------------------------------------
# Convert retrieved measures into readable context
# -------------------------------------------------------------------

def build_context(results):

    if not results:

        return (
            "No relevant budget measure was found in the official "
            "Budget 2026–2027 documents."
        )

    context = "Relevant Budget Measures\n\n"

    for index, result in enumerate(results, start=1):

        context += f"Measure {index}\n"

        for key, value in result["data"].items():

            context += f"{key}: {value}\n"

        context += "\n----------------------------------------\n\n"

    return context


# -------------------------------------------------------------------
# Main function used by the chatbot
# -------------------------------------------------------------------

def retrieve_context(section, question):

    matches = search_budget(
        section,
        question
    )

    return build_context(matches)