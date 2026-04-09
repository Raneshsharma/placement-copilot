from langchain.tools import tool


@tool
def extract_skills(text: str) -> list[dict]:
    """Extract skills from raw text and normalize to canonical taxonomy.

    Args:
        text: Raw text containing skill mentions (resume, job description, etc.)

    Returns:
        List of dicts with keys: skill, level (1-5), category (TECHNICAL/SOFT/DOMAIN/TOOL)
    """
    pass


@tool
def score_personality(responses: dict) -> dict:
    """Score personality traits from questionnaire responses using the Big Five model.

    Args:
        responses: Dict mapping trait names to response scores

    Returns:
        Dict mapping each Big Five trait (Openness, Conscientiousness, Extraversion,
        Agreeableness, Neuroticism) to a score from 1-10
    """
    pass


@tool
def generate_profile_summary(profile: dict) -> str:
    """Generate a natural language summary of a professional profile.

    Args:
        profile: Dict containing skills, experience, education, and personality data

    Returns:
        A concise paragraph summarizing the user's professional identity and career direction
    """
    pass
