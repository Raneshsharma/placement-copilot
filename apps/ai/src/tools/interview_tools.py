from langchain.tools import tool


@tool
def select_questions(
    interview_type: str, role: str, difficulty: str, history: list[dict]
) -> list[dict]:
    """Select interview questions based on type, role, difficulty, and history.

    Args:
        interview_type: BEHAVIORAL, TECHNICAL, SITUATIONAL, or CULTURAL
        role: Target job role
        difficulty: EASY, MEDIUM, or HARD
        history: List of previously asked questions to avoid repetition

    Returns:
        List of question dicts with keys: question, type, difficulty
    """
    pass


@tool
def evaluate_answer(question: str, answer: str, question_type: str) -> dict:
    """Evaluate an interview answer using the STAR framework for behavioral questions.

    Args:
        question: The question that was asked
        answer: The candidate's response
        question_type: BEHAVIORAL, TECHNICAL, SITUATIONAL, or CULTURAL

    Returns:
        Dict with keys: score (0-100), feedback, star_scores (S/T/A/R if behavioral)
    """
    pass


@tool
def generate_report(session: dict) -> dict:
    """Generate an interview session report with overall scores and recommendations.

    Args:
        session: Dict containing all questions, answers, and feedback from the session

    Returns:
        Dict with keys: overall_score, grade (A/B/C/D/F), recommendations
    """
    pass
