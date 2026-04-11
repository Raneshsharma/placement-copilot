import os
import json
import uuid
from typing import Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from src.schemas.orchestrator import OrchestrateRequest, OrchestrateResponse
from src.schemas.profile import ProfileAnalyzeRequest, ProfileAnalyzeResponse
from src.schemas.scoring import ScoringRequest, ScoringResponse, ScoringBreakdown
from src.schemas.resume import (
    ResumeAnalyzeRequest, ResumeAnalyzeResponse,
    ResumeOptimizeRequest, ResumeOptimizeResponse,
)
from src.schemas.interview import (
    InterviewStartRequest, InterviewStartResponse,
    InterviewAnswerRequest, InterviewAnswerResponse,
)
from src.schemas.skill_gap import SkillGapAnalyzeRequest, SkillGapAnalyzeResponse, SkillGapItem, SkillGapRoadmapItem, SkillGapStep
from src.schemas.application import ApplicationGuidanceRequest, ApplicationGuidanceResponse
from src.schemas.tracking import TrackingDashboardRequest, TrackingDashboardResponse, WeeklyActivity, Milestone, RecentEvent

from src.agents.profile_agent import create_profile_agent
from src.agents.scoring_agent import create_scoring_agent
from src.agents.resume_agent import create_resume_agent
from src.agents.interview_agent import create_interview_agent
from src.agents.skill_gap_agent import create_skill_gap_agent
from src.agents.application_agent import create_application_agent
from src.agents.tracking_agent import create_tracking_agent
from src.agents.orchestrator import create_orchestrator

router = APIRouter(prefix="/api/v1", tags=["ai"])

_orchestrator = create_orchestrator()

# In-memory interview session store (replace with Redis in production)
_interview_sessions: dict[str, dict] = {}


# ------------------------------------------------------------------
# Orchestrator
# ------------------------------------------------------------------

@router.post("/orchestrate")
async def orchestrate(req: OrchestrateRequest) -> OrchestrateResponse:
    """Main orchestration endpoint that classifies intent and routes to the appropriate agent."""
    try:
        result = await _orchestrator.ainvoke({
            "user_id": req.user_id,
            "session_id": req.session_id,
            "messages": [{"role": "user", "content": req.message}],
            "pending_tasks": [],
            "agent_results": {},
            "current_job_target": req.context.get("job_target") if req.context else None,
        })

        agent_name = result.get("agent", "synthesize")
        next_steps = result.get("next_steps", [])

        return OrchestrateResponse(
            intent=result.get("intent", "GENERAL"),
            agent=agent_name,
            result=result.get("result"),
            next_steps=next_steps,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/orchestrate/stream")
async def orchestrate_stream(req: OrchestrateRequest):
    """Streaming orchestration endpoint using SSE."""
    async def event_generator():
        try:
            async for event in _orchestrator.astream_events({
                "user_id": req.user_id,
                "session_id": req.session_id,
                "messages": [{"role": "user", "content": req.message}],
                "pending_tasks": [],
                "agent_results": {},
            }):
                yield {"event": "message", "data": json.dumps({"type": event.get("event"), "data": str(event)})}
        except Exception as e:
            yield {"event": "error", "data": json.dumps({"error": str(e)})}
        finally:
            yield {"event": "done", "data": "[]"}

    return EventSourceResponse(event_generator())


# ------------------------------------------------------------------
# Profile
# ------------------------------------------------------------------

@router.post("/profile/analyze")
async def analyze_profile(req: ProfileAnalyzeRequest) -> ProfileAnalyzeResponse:
    """Analyze a user's profile data and generate a comprehensive profile."""
    agent = create_profile_agent()
    try:
        profile_json = json.dumps(req.profile_data)
        result = agent.invoke({"input": profile_json})

        # Parse structured response
        content = result.content if hasattr(result, "content") else str(result)

        # Try to parse as JSON, fall back to text extraction
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = {
                "headline": "Professional",
                "summary": content[:500] if len(content) > 500 else content,
                "skills": [],
                "experience": [],
                "education": [],
                "certifications": [],
                "completeness": 50.0,
            }

        return ProfileAnalyzeResponse(
            headline=parsed.get("headline", "Professional"),
            summary=parsed.get("summary", content[:500]),
            skills=parsed.get("skills", []),
            experience=parsed.get("experience", []),
            education=parsed.get("education", []),
            certifications=parsed.get("certifications", []),
            completeness=parsed.get("completeness", 50.0),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Scoring
# ------------------------------------------------------------------

@router.post("/scoring/calculate")
async def calculate_score(req: ScoringRequest) -> ScoringResponse:
    """Calculate the Placement Potential Score (PPS) for a profile against a job target."""
    from src.tools.scoring_tools import calculate_pps as calc_pps_tool

    try:
        result_str = calc_pps_tool.invoke({
            "profile": req.profile_data,
            "role_requirements": req.job_target,
            "market_data": None,
        })

        try:
            result = json.loads(result_str)
        except Exception:
            result = {
                "score": 50.0,
                "breakdown": {
                    "skills_match": 50.0,
                    "experience_relevance": 50.0,
                    "education_fit": 50.0,
                    "market_demand": 50.0,
                    "location_factor": 50.0,
                },
                "confidence": 0.5,
            }

        breakdown = result.get("breakdown", {})
        return ScoringResponse(
            pps_score=result.get("score", 0.0),
            breakdown=ScoringBreakdown(
                skills_match=breakdown.get("skills_match", 0.0),
                experience_relevance=breakdown.get("experience_relevance", 0.0),
                education_fit=breakdown.get("education_fit", 0.0),
                market_demand=breakdown.get("market_demand", 0.0),
                location_factor=breakdown.get("location_factor", 0.0),
            ),
            percentile=result.get("percentile"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Resume
# ------------------------------------------------------------------

@router.post("/resume/analyze")
async def analyze_resume(req: ResumeAnalyzeRequest) -> ResumeAnalyzeResponse:
    """Analyze a resume and score it for ATS compatibility."""
    from src.tools.resume_tools import parse_resume, score_ats

    try:
        parsed_str = parse_resume.invoke({"text": req.resume_text})
        ats_str = score_ats.invoke({"resume": req.resume_text, "job_description": req.job_description or ""})

        try:
            parsed = json.loads(parsed_str)
        except Exception:
            parsed = {"sections": [], "keywords": [], "format_score": 70.0}

        try:
            ats = json.loads(ats_str)
        except Exception:
            ats = {"total": 60.0, "breakdown": {}}

        keywords_found = parsed.get("keywords", [])
        job_keywords = []
        if req.job_description:
            from src.tools.resume_tools import _extract_keywords
            job_keywords = _extract_keywords(req.job_description)
        missing_keywords = [kw for kw in job_keywords if kw not in req.resume_text.lower()]

        return ResumeAnalyzeResponse(
            parsed_data={"sections": parsed.get("sections", []), "format_score": parsed.get("format_score", 70.0)},
            ats_score=ats.get("total", 60.0),
            keywords_found=keywords_found,
            missing_keywords=missing_keywords,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/resume/optimize")
async def optimize_resume(req: ResumeOptimizeRequest) -> ResumeOptimizeResponse:
    """Optimize a resume for a specific job description."""
    from src.tools.resume_tools import optimize_keywords, parse_resume

    try:
        opt_str = optimize_keywords.invoke({
            "resume": req.resume_text,
            "job_description": req.job_description,
        })

        try:
            opt = json.loads(opt_str)
        except Exception:
            opt = {"missing": [], "suggestions": ["Add more relevant keywords"]}

        injected = opt.get("missing", [])[:10]
        suggestions = opt.get("suggestions", [])

        # Build optimized text by appending missing keywords
        optimized = req.resume_text
        if injected:
            skills_section = f"\n\nKEYWORDS ALIGNED WITH ROLE: {', '.join(injected)}"
            optimized += skills_section

        return ResumeOptimizeResponse(
            optimized_text=optimized,
            injected_keywords=injected,
            suggestions=suggestions,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Interview
# ------------------------------------------------------------------

@router.post("/interview/start")
async def start_interview(req: InterviewStartRequest) -> InterviewStartResponse:
    """Start a new interview session."""
    from src.tools.interview_tools import select_questions

    try:
        session_id = str(uuid.uuid4())
        result_str = select_questions.invoke({
            "interview_type": req.interview_type.upper(),
            "role": req.target_role,
            "difficulty": req.difficulty.upper(),
            "history": [],
        })

        try:
            questions = json.loads(result_str)
        except Exception:
            questions = [{"question": "Tell me about yourself.", "type": req.interview_type, "difficulty": req.difficulty, "id": str(uuid.uuid4())[:8]}]

        _interview_sessions[session_id] = {
            "user_id": req.user_id,
            "type": req.interview_type,
            "role": req.target_role,
            "difficulty": req.difficulty,
            "questions": questions,
            "answers": [],
            "current_index": 0,
        }

        first_q = questions[0] if questions else {"question": "Tell me about yourself.", "id": "1"}

        return InterviewStartResponse(
            session_id=session_id,
            first_question=first_q.get("question", ""),
            question_count=len(questions),
            estimated_duration=len(questions) * 15,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/interview/answer")
async def submit_answer(req: InterviewAnswerRequest) -> InterviewAnswerResponse:
    """Submit an answer to an interview question and receive feedback."""
    from src.tools.interview_tools import evaluate_answer

    try:
        session = _interview_sessions.get(req.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")

        questions = session["questions"]
        current_idx = session["current_index"]

        if current_idx >= len(questions):
            return InterviewAnswerResponse(
                feedback="Interview complete!",
                score=0.0,
                next_question=None,
                is_complete=True,
            )

        current_q = questions[current_idx]
        q_type = current_q.get("type", session["type"])

        eval_str = evaluate_answer.invoke({
            "question": current_q.get("question", ""),
            "answer": req.answer,
            "question_type": q_type,
        })

        try:
            evaluation = json.loads(eval_str)
        except Exception:
            evaluation = {"score": 70.0, "feedback": "Good answer. Consider adding more specific examples.", "star_scores": {}}

        session["answers"].append({
            "question_id": req.question_id,
            "question": current_q.get("question", ""),
            "answer": req.answer,
            "score": evaluation.get("score", 70.0),
            "feedback": evaluation.get("feedback", ""),
        })
        session["current_index"] += 1

        next_idx = session["current_index"]
        is_complete = next_idx >= len(questions)

        next_q = None
        if not is_complete and next_idx < len(questions):
            next_q = questions[next_idx].get("question")

        return InterviewAnswerResponse(
            feedback=evaluation.get("feedback", ""),
            score=evaluation.get("score", 70.0),
            next_question=next_q,
            is_complete=is_complete,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Skill Gap
# ------------------------------------------------------------------

@router.post("/skill-gap/analyze")
async def analyze_skill_gap(req: SkillGapAnalyzeRequest) -> SkillGapAnalyzeResponse:
    """Analyze skill gaps between current skills and target role requirements."""
    from src.tools.skill_gap_tools import detect_gaps, find_resources

    try:
        # Get required skills for the target role (use LLM or mock)
        agent = create_skill_gap_agent()
        role_result = agent.invoke({
            "input": f"List the key skills required for a {req.target_role} position. Return a JSON array of skill names."
        })

        try:
            required_skills = json.loads(role_result.content)
        except Exception:
            required_skills = [
                "python", "sql", "system design", "communication",
                "agile", "data analysis", "cloud computing",
            ]

        gaps_str = detect_gaps.invoke({
            "current_skills": req.current_skills,
            "required_skills": required_skills,
        })

        try:
            gaps_data = json.loads(gaps_str)
        except Exception:
            gaps_data = []

        gap_items = []
        roadmap_items = []
        total_priority = 0.0

        for gap in gaps_data:
            skill = gap.get("skill", "")
            priority = gap.get("priority_score", 50.0)
            total_priority += priority

            gap_items.append(SkillGapItem(
                skill=skill,
                gap_type=gap.get("gap_type", "MISSING"),
                severity=gap.get("severity", "MEDIUM"),
                gap_percent=gap.get("gap_percent", 100.0),
                priority_score=priority,
            ))

            # Generate roadmap for this skill
            resources_str = find_resources.invoke({"skill": skill, "preferences": {}})
            try:
                resources_data = json.loads(resources_str)
            except Exception:
                resources_data = []

            steps = [
                SkillGapStep(
                    title=f"Learn {skill.title()} Fundamentals",
                    duration="1-2 weeks",
                    resources=[r.get("title", f"{skill} course") for r in resources_data[:2]],
                ),
                SkillGapStep(
                    title=f"Practice {skill.title()} in Projects",
                    duration="2-3 weeks",
                    resources=[r.get("title", f"{skill} project tutorial") for r in resources_data[1:3]],
                ),
                SkillGapStep(
                    title=f"Build {skill.title()} Portfolio Item",
                    duration="1-2 weeks",
                    resources=["Personal project", "Open source contribution"],
                ),
            ]

            roadmap_items.append(SkillGapRoadmapItem(skill=skill, steps=steps))

        overall_priority = total_priority / len(gap_items) if gap_items else 0.0

        return SkillGapAnalyzeResponse(
            gaps=gap_items,
            roadmap=roadmap_items,
            overall_priority_score=round(overall_priority, 1),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Application
# ------------------------------------------------------------------

@router.post("/application/guidance")
async def application_guidance(req: ApplicationGuidanceRequest) -> ApplicationGuidanceResponse:
    """Get comprehensive application guidance for a specific job listing."""
    from src.tools.application_tools import research_company, generate_timeline, write_cover_letter, find_connections

    try:
        company_name = req.job_listing.get("company", "Target Company")
        role = req.job_listing.get("title", req.job_listing.get("role", "Position"))
        deadline = req.job_listing.get("deadline", "")

        company_str = research_company.invoke({"name": company_name})
        timeline_str = generate_timeline.invoke({"deadline": deadline, "requirements": req.job_listing})
        cover_str = write_cover_letter.invoke({"profile": req.profile, "role": role, "company": company_name})
        connections_str = find_connections.invoke({"user_connections": [], "target_company": company_name})

        try:
            company_research = json.loads(company_str)
        except Exception:
            company_research = {"name": company_name, "culture": "", "interview_process": "", "benefits": [], "red_flags": []}

        try:
            timeline = json.loads(timeline_str)
        except Exception:
            timeline = []

        try:
            cover = json.loads(cover_str)
        except Exception:
            cover = {"content": "", "outline": {}}

        try:
            connections = json.loads(connections_str)
        except Exception:
            connections = []

        red_flags = []
        if company_research.get("interview_process", "").startswith("Unusual"):
            red_flags.append("Unusually long or informal interview process")
        if "equity" not in str(company_research.get("benefits", [])).lower():
            red_flags.append("Limited equity or compensation transparency")

        return ApplicationGuidanceResponse(
            company_research={
                "name": company_research.get("name", company_name),
                "culture": company_research.get("culture", ""),
                "interview_process": company_research.get("interview_process", ""),
                "benefits": company_research.get("benefits", []),
                "recent_news": company_research.get("recent_news", []),
            },
            cover_letter_outline={
                "hook": f"Express enthusiasm for {role} at {company_name}",
                "body_points": ["Key qualification 1", "Key qualification 2", "Cultural fit"],
                "close": "Call to action and gratitude",
            },
            networking_tips=[c.get("approach", "") for c in connections[:3]],
            application_timeline=timeline,
            red_flags=red_flags,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ------------------------------------------------------------------
# Tracking
# ------------------------------------------------------------------

@router.post("/tracking/dashboard")
async def tracking_dashboard(req: TrackingDashboardRequest) -> TrackingDashboardResponse:
    """Get the tracking dashboard with analytics, milestones, and activity data."""
    from src.tools.tracking_tools import compute_analytics, detect_milestones, generate_motivational_message, get_weekly_stats

    try:
        # In production, these would come from Redis/database
        events = []
        analytics_str = compute_analytics.invoke({"events": events, "time_range_days": 30})
        milestones_str = detect_milestones.invoke({"events": events})
        weekly_str = get_weekly_stats.invoke({"user_id": req.user_id, "weeks": 4})

        try:
            analytics = json.loads(analytics_str)
        except Exception:
            analytics = {"applications_count": 0, "interviews_count": 0, "offers_count": 0, "response_rate": 0.0, "avg_time_to_interview_days": 0.0}

        try:
            milestones_data = json.loads(milestones_str)
        except Exception:
            milestones_data = []

        try:
            weekly_data = json.loads(weekly_str)
        except Exception:
            weekly_data = {"weekly_counts": []}

        total_apps = analytics.get("applications_count", 0)
        response_rate = analytics.get("response_rate", 0.0)
        interview_rate = (analytics.get("interviews_count", 0) / total_apps * 100) if total_apps > 0 else 0.0
        offer_rate = (analytics.get("offers_count", 0) / total_apps * 100) if total_apps > 0 else 0.0

        weekly_activity = [
            WeeklyActivity(date=f"2026-W{i+1}", count=w.get("applications", 0))
            for i, w in enumerate(weekly_data.get("weekly_counts", []))
        ]

        milestone_list = [
            Milestone(name=m.get("name", m.get("milestone_type", "")), achieved=m.get("achieved", False), date=m.get("achieved_at"))
            for m in milestones_data
        ]

        # Ensure default milestones are present
        default_milestones = [
            {"name": "First Application", "achieved": total_apps >= 1, "date": None},
            {"name": "Five Applications", "achieved": total_apps >= 5, "date": None},
            {"name": "First Interview", "achieved": analytics.get("interviews_count", 0) >= 1, "date": None},
            {"name": "First Offer", "achieved": analytics.get("offers_count", 0) >= 1, "date": None},
        ]
        for dm in default_milestones:
            if not any(m.name == dm["name"] for m in milestone_list):
                milestone_list.append(Milestone(**dm))

        recent_events = [
            RecentEvent(type="APPLICATION", description=f"Applied to a new position", date="2026-04-10")
        ] if total_apps > 0 else []

        return TrackingDashboardResponse(
            total_applications=total_apps,
            response_rate=round(response_rate, 1),
            interview_rate=round(interview_rate, 1),
            offer_rate=round(offer_rate, 1),
            weekly_activity=weekly_activity,
            milestones=milestone_list,
            recent_events=recent_events,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
