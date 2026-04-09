from langchain.tools import tool


@tool
def detect_gaps(current_skills: list[str], required_skills: list[str]) -> list[dict]:
    """Detect skill gaps by comparing current skills against required skills.

    Args:
        current_skills: List of skills the user currently has
        required_skills: List of skills required for the target role

    Returns:
        List of gap dicts with keys: skill, gap_type (MISSING/WEAK/STALE), severity
    """
    pass


@tool
def rank_gaps(gaps: list[dict], market_data: dict) -> list[dict]:
    """Rank skill gaps by priority using market data and impact scores.

    Args:
        gaps: List of gap dicts from detect_gaps
        market_data: Market demand data from get_market_data

    Returns:
        List of gaps sorted by priority, each with an added priority rank
    """
    pass


@tool
def find_resources(skill: str, preferences: dict) -> list[dict]:
    """Find learning resources for a specific skill.

    Args:
        skill: The skill name to find resources for
        preferences: Dict with preferences like learning_format, time_budget

    Returns:
        List of up to 3 resource dicts with keys: title, url, duration_hours
    """
    pass
