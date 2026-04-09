from langchain.tools import tool


@tool
def research_company(name: str) -> dict:
    """Research a company and generate a brief.

    Args:
        name: Company name to research

    Returns:
        Dict with keys: name, culture, interview_process, benefits (list)
    """
    pass


@tool
def generate_timeline(deadline: str, requirements: dict) -> list[dict]:
    """Generate an application timeline working backward from the deadline.

    Args:
        deadline: Application deadline in ISO date format
        requirements: Dict with requirements for the application

    Returns:
        List of task dicts with keys: task, days_before_deadline
    """
    pass


@tool
def write_cover_letter(profile: dict, role: str, company: str) -> dict:
    """Write a cover letter following the 3-paragraph structure.

    Args:
        profile: User's profile data
        role: Target job role
        company: Target company name

    Returns:
        Dict with keys: company_name, role, content (the cover letter text)
    """
    pass


@tool
def find_connections(user_connections: list[str], target_company: str) -> list[dict]:
    """Find networking suggestions from user connections at a target company.

    Args:
        user_connections: List of connection names or companies
        target_company: The company the user is applying to

    Returns:
        List of networking suggestion dicts with keys: name, relationship, approach
    """
    pass
