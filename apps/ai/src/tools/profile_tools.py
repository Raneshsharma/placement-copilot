import os
import json
import re
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

SKILL_CATEGORIES = ["TECHNICAL", "SOFT", "DOMAIN", "TOOL"]

SKILL_KEYWORDS = {
    "TECHNICAL": ["python", "javascript", "typescript", "java", "go", "rust", "sql", "react", "node", "docker", "kubernetes", "aws", "gcp", "azure", "machine learning", "deep learning", "nlp", "api", "graphql", "rest", "microservices"],
    "SOFT": ["leadership", "communication", "teamwork", "problem solving", "critical thinking", "adaptability", "creativity"],
    "DOMAIN": ["finance", "healthcare", "e-commerce", "fintech", "saas", "data science", "product management", "marketing"],
    "TOOL": ["git", "jira", "slack", "figma", "notion", "salesforce", "tableau", "looker", "snowflake", "dbt"],
}

MOCK_SKILLS = {
    "python": {"level": 4, "category": "TECHNICAL"},
    "javascript": {"level": 3, "category": "TECHNICAL"},
    "react": {"level": 4, "category": "TECHNICAL"},
    "docker": {"level": 3, "category": "TECHNICAL"},
    "sql": {"level": 4, "category": "TECHNICAL"},
    "aws": {"level": 3, "category": "TOOL"},
    "git": {"level": 4, "category": "TOOL"},
    "leadership": {"level": 3, "category": "SOFT"},
    "communication": {"level": 4, "category": "SOFT"},
    "teamwork": {"level": 4, "category": "SOFT"},
    "problem solving": {"level": 5, "category": "SOFT"},
}


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


@tool
def extract_skills(text: str) -> str:
    """Extract skills from raw text and normalize to canonical taxonomy.

    Args:
        text: Raw text containing skill mentions (resume, job description, etc.)

    Returns:
        JSON string of list of dicts with keys: skill, level (1-5), category (TECHNICAL/SOFT/DOMAIN/TOOL)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Extract skills from the following text. Categorize each as TECHNICAL, SOFT, DOMAIN, or TOOL. Assign a proficiency level 1-5 based on context. Return a JSON array of objects with keys: skill, level, category."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": text})
            return result.content
        except Exception:
            pass

    # Fallback: rule-based extraction
    text_lower = text.lower()
    found = {}
    for category, keywords in SKILL_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                if kw not in found:
                    found[kw] = {"skill": kw, "level": 3, "category": category}

    if not found:
        # Try common patterns
        words = re.findall(r'\b[a-z]{3,30}\b', text_lower)
        for word in words:
            if word in MOCK_SKILLS:
                found[word] = MOCK_SKILLS[word].copy()
                found[word]["skill"] = word

    return json.dumps(list(found.values()))


@tool
def score_personality(responses: dict) -> str:
    """Score personality traits from questionnaire responses using the Big Five model.

    Args:
        responses: Dict mapping trait names to response scores

    Returns:
        JSON string mapping Big Five traits to scores 1-10
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Score personality traits using the Big Five model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism). Return a JSON object mapping each trait to a score 1-10."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": str(responses)})
            return result.content
        except Exception:
            pass

    # Fallback: simple averaging
    traits = {
        "Openness": sum(responses.get(k, 5) for k in ["openness", "creativity", "curiosity", "imagination"]) / 4,
        "Conscientiousness": sum(responses.get(k, 5) for k in ["conscientiousness", "organization", "diligence", "discipline"]) / 4,
        "Extraversion": sum(responses.get(k, 5) for k in ["extraversion", "sociability", "energy", "assertiveness"]) / 4,
        "Agreeableness": sum(responses.get(k, 5) for k in ["agreeableness", "cooperation", "trust", "empathy"]) / 4,
        "Neuroticism": sum(responses.get(k, 5) for k in ["neuroticism", "anxiety", "moodiness", "instability"]) / 4,
    }
    return json.dumps(traits)


@tool
def generate_profile_summary(profile: dict) -> str:
    """Generate a natural language summary of a professional profile.

    Args:
        profile: Dict containing skills, experience, education, and personality data

    Returns:
        A concise paragraph summarizing the user's professional identity and career direction
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a professional profile writer. Generate a concise 2-3 sentence professional summary from the provided profile data."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": str(profile)})
            return result.content
        except Exception:
            pass

    skills = profile.get("skills", [])
    skill_names = [s.get("skill", s) if isinstance(s, dict) else s for s in skills[:5]]
    headline = profile.get("headline", "a versatile professional")
    return f"{headline} with expertise in {', '.join(skill_names)}. Demonstrated track record of delivering impactful results across multiple projects."


@tool
def update_profile_summary(user_id: str, summary: str) -> str:
    """Update a user's profile summary.

    Args:
        user_id: The user's ID
        summary: The new summary text

    Returns:
        Confirmation message
    """
    return json.dumps({"status": "updated", "user_id": user_id, "field": "summary"})


@tool
def add_skill(user_id: str, skill: str, level: int, category: str) -> str:
    """Add a skill to a user's profile.

    Args:
        user_id: The user's ID
        skill: Skill name
        level: Proficiency level 1-5
        category: TECHNICAL, SOFT, DOMAIN, or TOOL

    Returns:
        Confirmation message
    """
    return json.dumps({"status": "added", "user_id": user_id, "skill": skill, "level": level, "category": category})


@tool
def remove_skill(user_id: str, skill: str) -> str:
    """Remove a skill from a user's profile.

    Args:
        user_id: The user's ID
        skill: Skill name to remove

    Returns:
        Confirmation message
    """
    return json.dumps({"status": "removed", "user_id": user_id, "skill": skill})


@tool
def add_experience(user_id: str, experience: dict) -> str:
    """Add a work experience entry to a user's profile.

    Args:
        user_id: The user's ID
        experience: Dict with company, title, duration, description

    Returns:
        Confirmation message
    """
    return json.dumps({"status": "added", "user_id": user_id, "type": "experience", "experience": experience})


@tool
def add_education(user_id: str, education: dict) -> str:
    """Add an education entry to a user's profile.

    Args:
        user_id: The user's ID
        education: Dict with institution, degree, field, year

    Returns:
        Confirmation message
    """
    return json.dumps({"status": "added", "user_id": user_id, "type": "education", "education": education})
