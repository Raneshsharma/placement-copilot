from langchain.tools import tool


@tool
def calculate_pps(profile: dict, role_requirements: dict, market_data: dict) -> dict:
    """Calculate the Placement Potential Score (PPS).

    Args:
        profile: User's profile data with skills, experience, education
        role_requirements: Required qualifications for the target role
        market_data: Market context data (demand levels, salary ranges)

    Returns:
        Dict with keys: score (0-100), breakdown (per-component scores), confidence (0-1)
    """
    pass


@tool
def analyze_gaps(profile: dict, requirements: dict) -> list[dict]:
    """Perform gap analysis between a profile and role requirements.

    Args:
        profile: User's profile data
        requirements: Role requirements to compare against

    Returns:
        List of dicts with keys: skill, type (MISSING/WEAK/STALE), severity (low/medium/high)
    """
    pass


@tool
def get_market_data(role: str) -> dict:
    """Fetch market data for a given role.

    Args:
        role: Job title or role category

    Returns:
        Dict with keys: demand_level, salary_range, hiring_trends
    """
    pass
