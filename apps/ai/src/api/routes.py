import os
import json
import asyncio
from typing import Any
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse

from src.schemas.orchestrator import OrchestratorInput, OrchestratorOutput
from src.schemas.profile import ProfileInput, ProfileOutput
from src.schemas.scoring import ScoringInput, ScoringOutput
from src.schemas.resume import ResumeInput, ResumeOutput
from src.schemas.interview import InterviewInput, InterviewOutput
from src.schemas.skill_gap import SkillGapInput, SkillGapOutput
from src.schemas.application import ApplicationInput, ApplicationOutput
from src.schemas.tracking import TrackingInput, TrackingOutput
from src.agents.orchestrator import create_orchestrator
from src.agents.profile_agent import create_profile_agent
from src.agents.scoring_agent import create_scoring_agent
from src.agents.resume_agent import create_resume_agent
from src.agents.interview_agent import create_interview_agent
from src.agents.skill_gap_agent import create_skill_gap_agent
from src.agents.application_agent import create_application_agent
from src.agents.tracking_agent import create_tracking_agent

router = APIRouter()
_orchestrator = create_orchestrator()


@router.post("/orchestrate")
async def orchestrate(input: OrchestratorInput) -> OrchestratorOutput:
    result = await _orchestrator.ainvoke({
        "user_id": input.user_id,
        "session_id": input.session_id,
        "intent": input.intent,
        "messages": [{"role": "user", "content": str(input.payload)}],
        "pending_tasks": [],
        "agent_results": {},
    })
    return OrchestratorOutput(
        summary=result.get("summary", ""),
        next_actions=result.get("next_actions", []),
        results=result.get("results", {}),
        pps_score=result.get("pps_score"),
    )


@router.post("/orchestrate/stream")
async def orchestrate_stream(input: OrchestratorInput):
    async def event_generator():
        try:
            async for event in _orchestrator.astream_events(
                {
                    "user_id": input.user_id,
                    "session_id": input.session_id,
                    "intent": input.intent,
                    "messages": [{"role": "user", "content": str(input.payload)}],
                    "pending_tasks": [],
                    "agent_results": {},
                }
            ):
                yield {"event": "message", "data": json.dumps(event)}
        except Exception as e:
            yield {"event": "error", "data": json.dumps({"error": str(e)})}
        finally:
            yield {"event": "done", "data": "[]"}

    return EventSourceResponse(event_generator())


# Individual agent endpoints


@router.post("/profile/analyze")
async def analyze_profile(data: dict) -> ProfileOutput:
    agent = create_profile_agent()
    input_text = data.get("text") or data.get("questionnaire_responses", {})
    result = await agent.ainvoke({"input": str(input_text)})
    return ProfileOutput(
        skills=[],
        personality=[],
        summary=result.content,
    )


@router.post("/scoring/calculate")
async def calculate_score(data: dict) -> ScoringOutput:
    agent = create_scoring_agent()
    result = await agent.ainvoke({"input": str(data)})
    return ScoringOutput(
        pps_score=0.0,
        breakdown={},
        confidence=0.0,
        gaps=[],
    )


@router.post("/resume/analyze")
async def analyze_resume(data: dict) -> ResumeOutput:
    agent = create_resume_agent()
    resume_text = data.get("resume_text", "")
    result = await agent.ainvoke({"input": resume_text})
    return ResumeOutput(
        sections=[],
        keywords=[],
        format_score=0.0,
    )


@router.post("/resume/optimize")
async def optimize_resume(data: dict) -> ResumeOutput:
    agent = create_resume_agent()
    content = f"Optimize resume for job description: {data.get('job_description', '')}\nResume: {data.get('resume_text', '')}"
    result = await agent.ainvoke({"input": content})
    return ResumeOutput(
        sections=[],
        keywords=[],
        format_score=0.0,
    )


@router.post("/interview/start")
async def start_interview(data: dict) -> InterviewOutput:
    agent = create_interview_agent()
    result = await agent.ainvoke({"input": str(data)})
    return InterviewOutput(
        questions=[],
        recommendations=[],
    )


@router.post("/skill-gap/analyze")
async def analyze_skill_gap(data: dict) -> SkillGapOutput:
    agent = create_skill_gap_agent()
    result = await agent.ainvoke({"input": str(data)})
    return SkillGapOutput(
        gaps=[],
        resources=[],
        roadmap=[],
    )


@router.post("/application/guidance")
async def generate_guidance(data: dict) -> ApplicationOutput:
    agent = create_application_agent()
    result = await agent.ainvoke({"input": str(data)})
    return ApplicationOutput(
        company_brief={"name": "", "culture": "", "interview_process": "", "benefits": []},
        timeline=[],
        cover_letter={"company_name": "", "role": "", "content": ""},
        networking_suggestions=[],
    )


@router.post("/tracking/dashboard")
async def get_dashboard(data: dict) -> TrackingOutput:
    agent = create_tracking_agent()
    result = await agent.ainvoke({"input": str(data)})
    return TrackingOutput(
        milestones=[],
        analytics={
            "applications_count": 0,
            "interviews_count": 0,
            "offers_count": 0,
            "response_rate": 0.0,
            "avg_time_to_interview_days": 0.0,
        },
        motivational_message=result.content,
    )
