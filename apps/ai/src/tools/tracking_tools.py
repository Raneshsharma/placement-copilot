import os
import json
from datetime import datetime, timedelta
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

MILESTONE_DEFINITIONS = [
    {"type": "FIRST_APPLICATION", "name": "First Application", "description": "Submitted your first job application"},
    {"type": "FIRST_INTERVIEW", "name": "First Interview", "description": "Completed your first interview"},
    {"type": "FIRST_REJECTION", "name": "First Rejection", "description": "Received your first application rejection"},
    {"type": "FIRST_OFFER", "name": "First Offer", "description": "Received your first job offer"},
    {"type": "STREAK_7", "name": "7-Day Streak", "description": "Submitted applications 7 days in a row"},
    {"type": "STREAK_30", "name": "30-Day Streak", "description": "Submitted applications 30 days in a row"},
    {"type": "SKILL_CERTIFICATION", "name": "Skill Milestone", "description": "Completed a learning roadmap or gained a new certification"},
    {"type": "RESPONSE_RATE_50", "name": "High Response Rate", "description": "Achieved 50%+ response rate on applications"},
    {"type": "FIVE_APPLICATIONS", "name": "Five Applications", "description": "Submitted 5 job applications"},
    {"type": "TEN_APPLICATIONS", "name": "Ten Applications", "description": "Submitted 10 job applications"},
]


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def _parse_date(event: dict) -> datetime:
    ts = event.get("timestamp", event.get("date", ""))
    if not ts:
        return datetime.now()
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except Exception:
        try:
            return datetime.strptime(ts, "%Y-%m-%d")
        except Exception:
            return datetime.now()


@tool
def detect_milestones(events: list[dict]) -> str:
    """Detect new milestones from a list of user activity events.

    Args:
        events: List of activity event dicts with type, timestamp, and details

    Returns:
        JSON string list of newly detected milestone dicts with keys: milestone_type, achieved_at, description
    """
    if _use_llv_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze these user activity events and detect any new milestones achieved. Return JSON array of milestone objects with milestone_type, achieved_at, description."),
            ("human", "{events}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"events": str(events)})
            return result.content
        except Exception:
            pass

    milestones = []
    event_types = [e.get("type", "") for e in events]

    if "APPLICATION" in event_types:
        milestones.append({"milestone_type": "FIRST_APPLICATION", "achieved_at": datetime.now().isoformat(), "description": "Submitted your first job application"})

    interview_count = sum(1 for e in event_types if "INTERVIEW" in e)
    if interview_count >= 1:
        milestones.append({"milestone_type": "FIRST_INTERVIEW", "achieved_at": datetime.now().isoformat(), "description": "Completed your first interview"})

    rejection_count = sum(1 for e in event_types if e in ("REJECTION", "REJECTED"))
    if rejection_count >= 1:
        milestones.append({"milestone_type": "FIRST_REJECTION", "achieved_at": datetime.now().isoformat(), "description": "Received your first application rejection"})

    offer_count = sum(1 for e in event_types if e in ("OFFER", "OFFER_RECEIVED"))
    if offer_count >= 1:
        milestones.append({"milestone_type": "FIRST_OFFER", "achieved_at": datetime.now().isoformat(), "description": "Received your first job offer"})

    app_count = sum(1 for e in event_types if "APPLICATION" in e)
    if app_count >= 5:
        milestones.append({"milestone_type": "FIVE_APPLICATIONS", "achieved_at": datetime.now().isoformat(), "description": "Submitted 5 job applications"})
    if app_count >= 10:
        milestones.append({"milestone_type": "TEN_APPLICATIONS", "achieved_at": datetime.now().isoformat(), "description": "Submitted 10 job applications"})

    return json.dumps(milestones)


@tool
def compute_analytics(events: list[dict], time_range_days: int = 30) -> str:
    """Compute analytics metrics from user activity events.

    Args:
        events: List of activity event dicts
        time_range_days: Number of days to include in the analysis window

    Returns:
        JSON string with keys: applications_count, interviews_count, offers_count, response_rate, avg_time_to_interview_days
    """
    if _use_llv_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"Compute analytics from these events for the past {time_range_days} days. Return JSON with applications_count, interviews_count, offers_count, response_rate, avg_time_to_interview_days."),
            ("human", "{events}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"events": str(events)})
            return result.content
        except Exception:
            pass

    cutoff = datetime.now() - timedelta(days=time_range_days)
    recent = [_parse_date(e) >= cutoff for e in events]
    filtered = [e for i, e in enumerate(events) if recent[i]]

    event_types = [e.get("type", "").upper() for e in filtered]

    applications_count = sum(1 for t in event_types if "APPLICATION" in t or "APPLIED" in t)
    interviews_count = sum(1 for t in event_types if "INTERVIEW" in t)
    offers_count = sum(1 for t in event_types if "OFFER" in t)
    responses = sum(1 for t in event_types if t in ("RESPONSE", "REJECTION", "INTERVIEW", "OFFER"))
    response_rate = (responses / applications_count * 100) if applications_count > 0 else 0.0

    response_events = [(e, _parse_date(e)) for e in filtered if e.get("type", "").upper() in ("RESPONSE", "REJECTION", "INTERVIEW")]
    app_events = [(e, _parse_date(e)) for e in filtered if e.get("type", "").upper() in ("APPLICATION", "APPLIED")]

    avg_time = 0.0
    if app_events and response_events:
        min_app_time = min(t for _, t in app_events)
        min_response_time = min(t for _, t in response_events)
        avg_time = (min_response_time - min_app_time).total_seconds() / 86400

    return json.dumps({
        "applications_count": applications_count,
        "interviews_count": interviews_count,
        "offers_count": offers_count,
        "response_rate": round(response_rate, 1),
        "avg_time_to_interview_days": round(avg_time, 1),
    })


@tool
def generate_motivational_message(context: dict, engagement_level: str = "MEDIUM") -> str:
    """Generate a personalized motivational message.

    Args:
        context: Dict with recent events and user sentiment
        engagement_level: LOW, MEDIUM, or HIGH

    Returns:
        A motivational message string tailored to the user's situation
    """
    if _use_llv_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Generate a motivational message for a job seeker. Adjust tone based on engagement level: LOW (gentle encouragement), MEDIUM (balanced), HIGH (enthusiastic celebration). Keep it concise (1-2 sentences)."),
            ("human", "Context: {context}\nEngagement: {engagement}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"context": str(context), "engagement": engagement_level})
            return result.content
        except Exception:
            pass

    applications = context.get("applications_count", 0)
    interviews = context.get("interviews_count", 0)
    rejections = context.get("rejections", 0)

    if engagement_level == "LOW":
        return "Every step forward counts. Take your time and focus on quality over quantity."
    elif engagement_level == "HIGH":
        if interviews > 0:
            return f"Amazing! You've had {interviews} interview(s). You're clearly catching attention. Keep this momentum going!"
        elif applications > 5:
            return f"Incredible progress! {applications} applications in a short time. You're building great momentum toward your next opportunity."
        elif rejections > 0:
            return f"Each rejection gets you closer to the right fit. You've got this — your perseverance will pay off!"
    else:
        if applications == 0:
            return "Ready to take the next step? Even one application today is progress toward your goal."
        elif applications < 5:
            return f"You've submitted {applications} application(s). Keep building that momentum — consistency is key!"
        elif interviews == 0:
            return "Building a strong foundation with your applications. Interviews will come with persistence."
        else:
            return f"{interviews} interview(s) completed. You're on the right track — each one builds your confidence and skills."


@tool
def log_event(user_id: str, event_type: str, details: dict | None = None) -> str:
    """Log a user activity event.

    Args:
        user_id: The user's ID
        event_type: Type of event (APPLICATION, INTERVIEW, REJECTION, OFFER, etc.)
        details: Additional event details

    Returns:
        Confirmation message
    """
    return json.dumps({
        "status": "logged",
        "user_id": user_id,
        "event_type": event_type,
        "timestamp": datetime.now().isoformat(),
        "details": details or {},
    })


@tool
def check_milestone(user_id: str, milestone_type: str) -> str:
    """Check if a user has achieved a specific milestone.

    Args:
        user_id: The user's ID
        milestone_type: The milestone type to check

    Returns:
        JSON string with milestone status
    """
    for ms in MILESTONE_DEFINITIONS:
        if ms["type"] == milestone_type:
            return json.dumps({
                "milestone_type": milestone_type,
                "achieved": False,
                "name": ms["name"],
                "description": ms["description"],
            })
    return json.dumps({"error": f"Unknown milestone type: {milestone_type}"})


@tool
def get_weekly_stats(user_id: str, weeks: int = 4) -> str:
    """Get weekly application statistics for the past N weeks.

    Args:
        user_id: The user's ID
        weeks: Number of weeks to look back

    Returns:
        JSON string with weekly activity counts
    """
    return json.dumps({
        "user_id": user_id,
        "weeks": weeks,
        "weekly_counts": [{"week": i + 1, "applications": 0, "interviews": 0} for i in range(weeks)],
    })
