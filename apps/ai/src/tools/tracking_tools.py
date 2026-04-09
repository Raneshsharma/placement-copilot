from langchain.tools import tool


@tool
def detect_milestones(events: list[dict]) -> list[dict]:
    """Detect new milestones from a list of user activity events.

    Args:
        events: List of activity event dicts with type, timestamp, and details

    Returns:
        List of newly detected milestone dicts with keys: milestone_type, achieved_at, description
    """
    pass


@tool
def compute_analytics(events: list[dict], time_range_days: int) -> dict:
    """Compute analytics metrics from user activity events.

    Args:
        events: List of activity event dicts
        time_range_days: Number of days to include in the analysis window

    Returns:
        Dict with keys: applications_count, interviews_count, offers_count,
        response_rate, avg_time_to_interview_days
    """
    pass


@tool
def generate_motivational_message(context: dict, engagement_level: str) -> str:
    """Generate a personalized motivational message.

    Args:
        context: Dict with recent events and user sentiment
        engagement_level: LOW, MEDIUM, or HIGH

    Returns:
        A motivational message string tailored to the user's situation
    """
    pass
