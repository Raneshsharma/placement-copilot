from langchain.tools import tool


@tool
def parse_resume(text: str) -> dict:
    """Parse a resume's text into structured sections.

    Args:
        text: Raw resume text content

    Returns:
        Dict with keys: sections (list of {name, content}), keywords, format_score (0-100)
    """
    pass


@tool
def score_ats(resume: str, job_description: str) -> dict:
    """Score ATS compatibility of a resume against a job description.

    Args:
        resume: Resume text content
        job_description: Target job description text

    Returns:
        Dict with keys: total (0-100), breakdown (header, keywords, format, length scores)
    """
    pass


@tool
def optimize_keywords(resume: str, job_description: str) -> dict:
    """Suggest keyword improvements to align resume with job description.

    Args:
        resume: Resume text content
        job_description: Target job description text

    Returns:
        Dict with keys: missing (list of missing keywords), suggestions (list of improvements)
    """
    pass
