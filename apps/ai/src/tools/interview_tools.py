import os
import json
import uuid
import random
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

STARTER_QUESTIONS = {
    "BEHAVIORAL": [
        "Tell me about a time when you had to manage a tight deadline. What was the situation and how did you handle it?",
        "Describe a situation where you had to work with a difficult team member. How did you resolve it?",
        "Give me an example of a time you demonstrated leadership, even without a formal title.",
        "Tell me about a project that failed. What would you do differently?",
        "Describe a time you had to learn a new technology quickly. How did you approach it?",
        "Share an example of when you received critical feedback. How did you respond?",
        "Tell me about a time you had to persuade stakeholders to adopt your idea.",
        "Describe a situation where you had to make a decision with incomplete information.",
    ],
    "TECHNICAL": [
        "Explain how you would design a system to handle 1 million concurrent users.",
        "What are the key differences between SQL and NoSQL databases? When would you choose each?",
        "Describe your approach to debugging a production issue that only occurs intermittently.",
        "How do you ensure code quality and maintainability in a fast-moving team?",
        "Walk me through how you would migrate a monolithic application to microservices.",
        "What strategies would you use to optimize the performance of a slow API endpoint?",
        "How do you approach API design? What principles do you follow?",
        "Explain how you would implement authentication and authorization for a web application.",
    ],
    "SITUATIONAL": [
        "If you had conflicting priorities from two different stakeholders, how would you handle it?",
        "Imagine you discover a significant bug in production right before a major release. What do you do?",
        "Your manager asks you to do something you disagree with technically. How would you approach this?",
        "If a team member was consistently underperforming, what steps would you take?",
        "How would you handle a situation where you don't have enough information to complete a task?",
        "What would you do if you noticed a colleague cutting corners on security practices?",
        "If you had to choose between delivering on time with lower quality vs. delaying with higher quality, what would you do?",
    ],
    "CULTURAL": [
        "What type of work environment allows you to do your best work?",
        "How do you prefer to receive feedback and how do you give it to others?",
        "What are your thoughts on work-life balance and how do you maintain it?",
        "Tell me about a time you went above and beyond for a customer or colleague.",
        "What motivates you to come to work every day?",
        "Where do you see yourself professionally in the next three to five years?",
        "How do you stay current with developments in your field?",
    ],
}


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def _evaluate_star(situation: str, task: str, action: str, result: str) -> dict:
    scores = {"situation": 0, "task": 0, "action": 0, "result": 0}

    scores["situation"] = min(100, len(situation) * 3 + 20) if situation else 30
    scores["task"] = min(100, len(task) * 3 + 20) if task else 30
    scores["action"] = min(100, len(action) * 2 + 40) if action else 40
    scores["result"] = min(100, len(result) * 2 + 30) if result else 30

    total = (
        scores["situation"] * 0.20
        + scores["task"] * 0.20
        + scores["action"] * 0.40
        + scores["result"] * 0.20
    )
    return scores, total


@tool
def select_questions(interview_type: str, role: str, difficulty: str, history: list[dict] | None = None) -> str:
    """Select interview questions based on type, role, difficulty, and history.

    Args:
        interview_type: BEHAVIORAL, TECHNICAL, SITUATIONAL, or CULTURAL
        role: Target job role
        difficulty: EASY, MEDIUM, or HARD
        history: List of previously asked questions to avoid repetition

    Returns:
        JSON string of list of question dicts with keys: question, type, difficulty
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Generate 5 interview questions for the given type, role, and difficulty level. Return JSON array of objects with question, type, difficulty keys."),
            ("human", "Type: {interview_type}, Role: {role}, Difficulty: {difficulty}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"interview_type": interview_type, "role": role, "difficulty": difficulty})
            return result.content
        except Exception:
            pass

    history = history or []
    history_qs = {h.get("question", "") for h in history if isinstance(h, dict)}

    pool = STARTER_QUESTIONS.get(interview_type.upper(), STARTER_QUESTIONS["BEHAVIORAL"])
    available = [q for q in pool if q not in history_qs]

    if len(available) < 5:
        available = pool

    selected = random.sample(available, min(5, len(available)))

    return json.dumps([
        {"question": q, "type": interview_type.upper(), "difficulty": difficulty.upper(), "id": str(uuid.uuid4())[:8]}
        for q in selected
    ])


@tool
def evaluate_answer(question: str, answer: str, question_type: str) -> str:
    """Evaluate an interview answer using the STAR framework for behavioral questions.

    Args:
        question: The question that was asked
        answer: The candidate's response
        question_type: BEHAVIORAL, TECHNICAL, SITUATIONAL, or CULTURAL

    Returns:
        JSON string with keys: score (0-100), feedback, star_scores (S/T/A/R if behavioral)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Evaluate this interview answer. For behavioral questions use STAR framework (Situation 20%, Task 20%, Action 40%, Result 20%). For others, evaluate relevance, depth, and clarity. Return JSON with score (0-100), feedback, and star_scores."),
            ("human", "QUESTION TYPE: {question_type}\nQUESTION: {question}\n\nANSWER: {answer}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"question_type": question_type, "question": question, "answer": answer})
            return result.content
        except Exception:
            pass

    answer_lower = answer.lower()
    words = len(answer.split())

    if question_type.upper() == "BEHAVIORAL":
        parts = answer.split(".")
        if len(parts) >= 4:
            situation, task = parts[0], parts[1]
            action = ". ".join(parts[2:-1])
            result_part = parts[-1]
        else:
            situation = task = action = result_part = answer

        star_scores, raw_score = _evaluate_star(situation, task, action, result_part)
    else:
        star_scores = {}
        raw_score = min(100, words * 2.5 + 20) if words > 10 else max(20, words * 3)

    feedback = ""
    if raw_score >= 80:
        feedback = "Excellent answer. You provided specific examples with clear outcomes. Great use of quantifiable results."
    elif raw_score >= 60:
        feedback = "Good answer with solid examples. Consider being more specific about your individual contributions and measurable outcomes."
    elif raw_score >= 40:
        feedback = "Decent start but consider using the STAR format more thoroughly. Provide more context and specific examples of your actions."
    else:
        feedback = "Try to structure your answer with a specific situation, your task, the actions you took, and the results achieved."

    return json.dumps({
        "score": round(raw_score, 1),
        "feedback": feedback,
        "star_scores": star_scores,
    })


@tool
def generate_report(session: dict) -> str:
    """Generate an interview session report with overall scores and recommendations.

    Args:
        session: Dict containing all questions, answers, and feedback from the session

    Returns:
        JSON string with keys: overall_score, grade (A/B/C/D/F), recommendations
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Generate an interview session report from the provided session data. Include overall_score (0-100), grade (A/B/C/D/F), and recommendations array. Return JSON."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": str(session)})
            return result.content
        except Exception:
            pass

    qa_pairs = session.get("answers", [])
    if not qa_pairs:
        return json.dumps({"overall_score": 0, "grade": "F", "recommendations": ["No answers recorded."]})

    scores = [qa.get("score", 50) for qa in qa_pairs if isinstance(qa, dict)]
    overall = sum(scores) / len(scores) if scores else 0

    grade = "A" if overall >= 90 else "B" if overall >= 75 else "C" if overall >= 60 else "D" if overall >= 40 else "F"

    recommendations = []
    low_areas = [qa for qa in qa_pairs if isinstance(qa, dict) and qa.get("score", 100) < 60]
    if low_areas:
        recommendations.append(f"Focus on improving {len(low_areas)} question(s) that scored below 60%.")
    if overall >= 80:
        recommendations.append("Great overall performance. Continue practicing to maintain your confidence.")
    if any("star" in str(qa.get("feedback", "")).lower() for qa in qa_pairs if isinstance(qa, dict)):
        recommendations.append("Practice using the STAR method more consistently for behavioral questions.")
    recommendations.append("Review the detailed feedback for each question and prepare specific examples.")

    return json.dumps({
        "overall_score": round(overall, 1),
        "grade": grade,
        "recommendations": recommendations,
    })


@tool
def generate_question(interview_type: str, role: str, difficulty: str, history: list[dict] | None = None) -> str:
    """Generate a single interview question.

    Args:
        interview_type: BEHAVIORAL, TECHNICAL, SITUATIONAL, or CULTURAL
        role: Target job role
        difficulty: EASY, MEDIUM, or HARD
        history: Previously asked questions to avoid

    Returns:
        JSON string with question details
    """
    result = select_questions.invoke({
        "interview_type": interview_type,
        "role": role,
        "difficulty": difficulty,
        "history": history or [],
    })
    questions = json.loads(result)
    if questions:
        return json.dumps(questions[0])
    return json.dumps({"question": "Tell me about yourself.", "type": interview_type, "difficulty": difficulty, "id": str(uuid.uuid4())[:8]})


@tool
def calculate_session_score(answers: list[dict]) -> str:
    """Calculate the overall session score from all answers.

    Args:
        answers: List of answer dicts with scores

    Returns:
        JSON string with session statistics
    """
    if not answers:
        return json.dumps({"total_questions": 0, "average_score": 0, "highest": 0, "lowest": 0})

    scores = [a.get("score", 0) for a in answers if isinstance(a, dict)]
    return json.dumps({
        "total_questions": len(scores),
        "average_score": round(sum(scores) / len(scores), 1) if scores else 0,
        "highest": round(max(scores), 1) if scores else 0,
        "lowest": round(min(scores), 1) if scores else 0,
    })


@tool
def generate_improvement_tips(session_results: dict) -> str:
    """Generate actionable improvement tips based on session performance.

    Args:
        session_results: Dict with session scores and feedback

    Returns:
        JSON string with prioritized improvement tips
    """
    answers = session_results.get("answers", [])
    if not answers:
        return json.dumps({"tips": ["Start practicing by answering a few questions."]})

    scores = [a.get("score", 0) for a in answers if isinstance(a, dict)]
    avg = sum(scores) / len(scores) if scores else 0

    tips = []
    if avg < 60:
        tips.append("Work on structuring your answers more clearly using the STAR method.")
        tips.append("Practice with mock interviews to build confidence.")
        tips.append("Prepare specific examples from your experience in advance.")
    if avg < 80:
        tips.append("Focus on quantifying your achievements with specific numbers and outcomes.")
        tips.append("Practice the transition between Situation, Task, Action, and Result.")
    tips.append("Review common interview questions for your target role and practice out loud.")
    tips.append("Record yourself answering questions to identify areas for improvement.")

    return json.dumps({"tips": tips[:5]})
