import os
import json
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

WEIGHTS = {
    "skills_match": 0.30,
    "experience_relevance": 0.25,
    "education_fit": 0.20,
    "market_demand": 0.15,
    "location_factor": 0.10,
}


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def _score_skills_match(profile_skills: list, required_skills: list) -> float:
    if not required_skills:
        return 75.0
    matched = sum(1 for rs in required_skills if any(rs.lower() in str(ps).lower() for ps in profile_skills))
    return min(100.0, (matched / len(required_skills)) * 100)


def _score_experience_relevance(profile_exp: list, required_years: int) -> float:
    if not profile_exp:
        return 30.0
    total_years = sum(exp.get("years", 0) for exp in profile_exp if isinstance(exp, dict))
    if total_years >= required_years:
        return 85.0
    return max(20.0, (total_years / required_years) * 85)


def _score_education_fit(profile_edu: list, required_level: str) -> float:
    levels = {"high_school": 1, "associate": 2, "bachelor": 3, "master": 4, "phd": 5}
    req_level = levels.get(required_level.lower(), 3)
    if not profile_edu:
        return 40.0 if req_level <= 3 else 20.0
    max_level = max((levels.get(str(e.get("degree", "")).lower().split()[0], 2) for e in profile_edu if isinstance(e, dict)), default=2)
    if max_level >= req_level:
        return 85.0
    return max(20.0, 50.0 - (req_level - max_level) * 15)


def _score_market_demand(role: str) -> float:
    high_demand = ["software engineer", "data scientist", "machine learning", "devops", "cloud", "sre", "product manager", "full stack"]
    mid_demand = ["frontend", "backend", "analyst", "qa", "ux", "ui", "support", "administrator"]
    role_lower = role.lower()
    for kw in high_demand:
        if kw in role_lower:
            return 85.0
    for kw in mid_demand:
        if kw in role_lower:
            return 65.0
    return 50.0


def _score_location_factor(profile_location: str, job_locations: list) -> float:
    if not job_locations:
        return 70.0
    for loc in job_locations:
        if profile_location and loc.lower() in profile_location.lower():
            return 95.0
    if any("remote" in loc.lower() for loc in job_locations):
        return 90.0
    return 55.0


@tool
def calculate_pps(profile: dict, role_requirements: dict, market_data: dict | None = None) -> str:
    """Calculate the Placement Potential Score (PPS).

    Args:
        profile: User's profile data with skills, experience, education
        role_requirements: Required qualifications for the target role
        market_data: Market context data (demand levels, salary ranges)

    Returns:
        JSON string with keys: score (0-100), breakdown (per-component scores), confidence (0-1)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"Calculate the Placement Potential Score (PPS) using weights: skills_match 30%, experience_relevance 25%, education_fit 20%, market_demand 15%, location_factor 10%. Each component is scored 0-100. Return a JSON object with score, breakdown, and confidence."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": json.dumps({"profile": profile, "role_requirements": role_requirements})})
            return result.content
        except Exception:
            pass

    profile_skills = profile.get("skills", [])
    required_skills = role_requirements.get("skills", [])
    required_years = role_requirements.get("min_years_experience", 3)
    required_edu_level = role_requirements.get("education_level", "bachelor")
    profile_edu = profile.get("education", [])
    role_title = role_requirements.get("title", "")
    job_locations = role_requirements.get("locations", [])
    profile_location = profile.get("location", "")

    skills_match = _score_skills_match(profile_skills, required_skills)
    exp_relevance = _score_experience_relevance(profile.get("experience", []), required_years)
    edu_fit = _score_education_fit(profile_edu, required_edu_level)
    mkt_demand = market_data.get("demand_level", _score_market_demand(role_title)) if market_data else _score_market_demand(role_title)
    loc_factor = _score_location_factor(profile_location, job_locations)

    pps = (
        skills_match * WEIGHTS["skills_match"]
        + exp_relevance * WEIGHTS["experience_relevance"]
        + edu_fit * WEIGHTS["education_fit"]
        + mkt_demand * WEIGHTS["market_demand"]
        + loc_factor * WEIGHTS["location_factor"]
    )

    confidence = 0.85 if profile_skills and profile_edu else 0.6

    return json.dumps({
        "score": round(pps, 1),
        "breakdown": {
            "skills_match": round(skills_match, 1),
            "experience_relevance": round(exp_relevance, 1),
            "education_fit": round(edu_fit, 1),
            "market_demand": round(mkt_demand, 1),
            "location_factor": round(loc_factor, 1),
        },
        "confidence": round(confidence, 2),
    })


@tool
def analyze_gaps(profile: dict, requirements: dict) -> str:
    """Perform gap analysis between a profile and role requirements.

    Args:
        profile: User's profile data
        requirements: Role requirements to compare against

    Returns:
        JSON string list of dicts with keys: skill, type (MISSING/WEAK/STALE), severity (low/medium/high)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze skill gaps between a profile and role requirements. Classify each gap as MISSING, WEAK, or STALE. Assign severity: CRITICAL (missing critical skill), HIGH (weak in important skill), MEDIUM, LOW. Return a JSON array."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": json.dumps({"profile": profile, "requirements": requirements})})
            return result.content
        except Exception:
            pass

    profile_skills = {str(s).lower(): s for s in profile.get("skills", [])}
    required_skills = requirements.get("skills", [])

    gaps = []
    for req_skill in required_skills:
        req_lower = req_skill.lower()
        if req_lower not in profile_skills:
            gaps.append({"skill": req_skill, "type": "MISSING", "severity": "HIGH"})
        elif isinstance(profile_skills.get(req_lower), dict):
            level = profile_skills[req_lower].get("level", 3)
            if level < 3:
                gaps.append({"skill": req_skill, "type": "WEAK", "severity": "MEDIUM"})

    return json.dumps(gaps)


@tool
def get_market_data(role: str) -> str:
    """Fetch market data for a given role.

    Args:
        role: Job title or role category

    Returns:
        JSON string with keys: demand_level, salary_range, hiring_trends
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Provide market data for the given role including demand level (0-100), salary range, and hiring trends. Return JSON."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": role})
            return result.content
        except Exception:
            pass

    role_lower = role.lower()
    if any(k in role_lower for k in ["software", "engineer", "developer", "full stack", "frontend", "backend"]):
        demand = 88.0
        salary = {"min": 80000, "max": 180000, "median": 120000}
        trend = "growing"
    elif any(k in role_lower for k in ["data scientist", "machine learning", "ml", "ai"]):
        demand = 85.0
        salary = {"min": 100000, "max": 200000, "median": 140000}
        trend = "growing"
    elif any(k in role_lower for k in ["product manager", "pm"]):
        demand = 78.0
        salary = {"min": 90000, "max": 170000, "median": 125000}
        trend = "stable"
    elif any(k in role_lower for k in ["devops", "sre", "cloud", "platform"]):
        demand = 82.0
        salary = {"min": 95000, "max": 175000, "median": 130000}
        trend = "growing"
    else:
        demand = 60.0
        salary = {"min": 60000, "max": 120000, "median": 85000}
        trend = "stable"

    return json.dumps({
        "demand_level": demand,
        "salary_range": salary,
        "hiring_trends": trend,
    })


@tool
def calculate_pps_breakdown(profile_data: dict, job_target: dict) -> str:
    """Calculate detailed PPS breakdown with component scores.

    Args:
        profile_data: User profile data
        job_target: Target job requirements

    Returns:
        JSON string with detailed breakdown
    """
    result = calculate_pps.invoke({"profile": profile_data, "role_requirements": job_target})
    return result


@tool
def compare_to_market_average(pps_score: float, role: str) -> str:
    """Compare a PPS score to market average for a role.

    Args:
        pps_score: The calculated PPS score
        role: The target role

    Returns:
        JSON string with percentile ranking and comparison
    """
    market = json.loads(get_market_data.invoke({"role": role}))
    demand = market.get("demand_level", 60)

    avg_pps = 50 + (demand - 50) * 0.3
    percentile = min(99, max(1, ((pps_score - avg_pps) / 50) * 50 + 50))

    return json.dumps({
        "pps_score": pps_score,
        "market_average": round(avg_pps, 1),
        "percentile": round(percentile, 1),
        "comparison": "above_average" if pps_score > avg_pps else "below_average",
    })
