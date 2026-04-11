import os
import json
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

GAP_WEIGHTS = {
    "Role_Criticality": 0.40,
    "Market_Demand": 0.20,
    "Learning_Ease": 0.15,
    "Time_Investment": 0.15,
    "Career_Lift": 0.10,
}

SKILL_LEARNING_TIME = {
    "python": 40, "javascript": 40, "typescript": 30, "react": 35, "vue": 25,
    "node": 30, "java": 50, "go": 35, "rust": 60, "sql": 20, "docker": 25,
    "kubernetes": 40, "aws": 35, "gcp": 35, "azure": 35, "git": 10,
    "ci/cd": 20, "agile": 15, "scrum": 15, "machine learning": 80,
    "deep learning": 100, "data science": 60, "product management": 40,
    "api": 15, "microservices": 30, "linux": 30, "networking": 40,
}


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def _classify_gap(skill: str, current_skills: list) -> tuple[str, str]:
    skill_lower = skill.lower()
    for cs in current_skills:
        cs_lower = str(cs).lower()
        if skill_lower == cs_lower:
            return "WEAK", "MEDIUM"
    return "MISSING", "HIGH"


def _calc_priority_score(skill: str, gap_type: str, severity: str) -> float:
    skill_lower = skill.lower()

    role_crit = {"CRITICAL": 1.0, "HIGH": 0.8, "MEDIUM": 0.5, "LOW": 0.2}.get(severity, 0.5)
    mkt_demand = {"CRITICAL": 1.0, "HIGH": 0.8, "MEDIUM": 0.5, "LOW": 0.2}.get(severity, 0.5)

    learn_time = SKILL_LEARNING_TIME.get(skill_lower, 40)
    learning_ease = max(0.1, 1.0 - (learn_time / 100))
    time_inv = max(0.1, 1.0 - (learn_time / 100))

    career_lift = 0.7 if gap_type == "MISSING" else 0.4

    score = (
        role_crit * GAP_WEIGHTS["Role_Criticality"]
        + mkt_demand * GAP_WEIGHTS["Market_Demand"]
        + learning_ease * GAP_WEIGHTS["Learning_Ease"]
        + time_inv * GAP_WEIGHTS["Time_Investment"]
        + career_lift * GAP_WEIGHTS["Career_Lift"]
    ) * 100

    return round(score, 1)


@tool
def detect_gaps(current_skills: list[str], required_skills: list[str]) -> str:
    """Detect skill gaps by comparing current skills against required skills.

    Args:
        current_skills: List of skills the user currently has
        required_skills: List of skills required for the target role

    Returns:
        JSON string list of gap dicts with keys: skill, gap_type (MISSING/WEAK/STALE), severity
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Compare current skills to required skills. Classify each gap as MISSING (not present), WEAK (present but low level), or STALE (not recently used). Assign severity: CRITICAL, HIGH, MEDIUM, LOW. Return JSON array."),
            ("human", "Current skills: {current}\nRequired skills: {required}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"current": str(current_skills), "required": str(required_skills)})
            return result.content
        except Exception:
            pass

    gaps = []
    for req in required_skills:
        gap_type, severity = _classify_gap(req, current_skills)
        priority = _calc_priority_score(req, gap_type, severity)
        gaps.append({
            "skill": req,
            "gap_type": gap_type,
            "severity": severity,
            "gap_percent": 100.0 if gap_type == "MISSING" else 50.0,
            "priority_score": priority,
        })

    gaps.sort(key=lambda x: x["priority_score"], reverse=True)
    return json.dumps(gaps)


@tool
def rank_gaps(gaps: list[dict], market_data: dict | None = None) -> str:
    """Rank skill gaps by priority using market data and impact scores.

    Args:
        gaps: List of gap dicts from detect_gaps
        market_data: Market demand data from get_market_data

    Returns:
        JSON string list of gaps sorted by priority, each with an added priority rank
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Rank these skill gaps by priority. Consider market demand, role criticality, and learning time. Return JSON array with gaps sorted by priority and each with a priority_rank field."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": json.dumps({"gaps": gaps, "market_data": market_data})})
            return result.content
        except Exception:
            pass

    ranked = []
    for i, gap in enumerate(gaps):
        gap_copy = gap.copy()
        gap_copy["priority_rank"] = i + 1
        ranked.append(gap_copy)

    ranked.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
    for i, gap in enumerate(ranked):
        gap["priority_rank"] = i + 1

    return json.dumps(ranked)


@tool
def find_resources(skill: str, preferences: dict | None = None) -> str:
    """Find learning resources for a specific skill.

    Args:
        skill: The skill name to find resources for
        preferences: Dict with preferences like learning_format, time_budget

    Returns:
        JSON string list of up to 3 resource dicts with keys: title, url, duration_hours
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Find up to 3 learning resources for the given skill. Include title, type (course, book, project, certification), and estimated hours. Return JSON array."),
            ("human", "{skill}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"skill": skill})
            return result.content
        except Exception:
            pass

    skill_lower = skill.lower()
    hours = SKILL_LEARNING_TIME.get(skill_lower, 40)

    resources = [
        {
            "skill": skill,
            "title": f"Learn {skill.title()} - Official Documentation",
            "type": "documentation",
            "url": f"https://docs.example.com/{skill_lower.replace(' ', '-')}",
            "duration_hours": hours * 0.3,
        },
        {
            "skill": skill,
            "title": f"{skill.title()} Fundamentals Course",
            "type": "course",
            "url": f"https://coursera.org/learn/{skill_lower.replace(' ', '-')}",
            "duration_hours": hours * 0.5,
        },
        {
            "skill": skill,
            "title": f"Build a {skill.title()} Project",
            "type": "project",
            "url": f"https://github.com/example/{skill_lower.replace(' ', '-')}-project",
            "duration_hours": hours * 0.7,
        },
    ]

    return json.dumps(resources)


@tool
def prioritize_gaps(gaps: list[dict], weekly_hours: float = 10.0) -> str:
    """Prioritize skill gaps based on priority score and weekly time budget.

    Args:
        gaps: List of gap dicts with priority scores
        weekly_hours: Available learning hours per week

    Returns:
        JSON string with prioritized gap list and estimated completion timeline
    """
    if not gaps:
        return json.dumps({"prioritized_gaps": [], "estimated_weeks": 0})

    prioritized = sorted(gaps, key=lambda x: x.get("priority_score", 0), reverse=True)

    total_hours = sum(SKILL_LEARNING_TIME.get(g.get("skill", "").lower(), 40) for g in prioritized)
    estimated_weeks = max(1, int(total_hours / weekly_hours))

    return json.dumps({
        "prioritized_gaps": prioritized,
        "estimated_weeks": estimated_weeks,
        "total_learning_hours": total_hours,
    })


@tool
def generate_roadmap_step(skill: str, current_level: int, target_level: int, time_budget_hours: float) -> str:
    """Generate a learning roadmap step for a specific skill.

    Args:
        skill: The skill to learn
        current_level: Current proficiency level (1-5)
        target_level: Target proficiency level (1-5)
        time_budget_hours: Hours available per week

    Returns:
        JSON string with roadmap step details
    """
    skill_lower = skill.lower()
    hours_needed = SKILL_LEARNING_TIME.get(skill_lower, 40) * (target_level - current_level) / 5
    hours_needed = max(5, hours_needed)

    steps = []
    if target_level - current_level >= 2:
        steps.append({"title": f"Foundation: {skill.title()} Basics", "duration": f"{int(hours_needed * 0.4)} hours", "resources": ["Official documentation", "Beginner tutorial"]})
    steps.append({"title": f"Practice: {skill.title()} Projects", "duration": f"{int(hours_needed * 0.4)} hours", "resources": ["Build a sample project", "Code exercises"]})
    steps.append({"title": f"Mastery: Advanced {skill.title()}", "duration": f"{int(hours_needed * 0.2)} hours", "resources": ["Advanced course", "Real-world application"]})

    return json.dumps({
        "skill": skill,
        "current_level": current_level,
        "target_level": target_level,
        "total_hours": round(hours_needed, 1),
        "weeks_needed": max(1, round(hours_needed / time_budget_hours, 1)),
        "steps": steps,
    })


@tool
def estimate_learning_time(skill: str, target_proficiency: int) -> str:
    """Estimate learning time for a skill to reach target proficiency.

    Args:
        skill: The skill name
        target_proficiency: Target level (1-5)

    Returns:
        JSON string with time estimates
    """
    skill_lower = skill.lower()
    base_hours = SKILL_LEARNING_TIME.get(skill_lower, 40)
    hours = base_hours * (target_proficiency / 5.0)
    hours = max(5, hours)

    return json.dumps({
        "skill": skill,
        "target_proficiency": target_proficiency,
        "estimated_hours": round(hours, 1),
        "estimated_days": round(hours / 2, 1),
        "estimated_weeks_10h": round(hours / 10, 1),
        "estimated_weeks_20h": round(hours / 20, 1),
    })
