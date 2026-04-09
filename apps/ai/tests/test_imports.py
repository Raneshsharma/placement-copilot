"""
AI Service Tests — verify imports and schema validation
"""
import pytest
import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


class TestMainImport:
    """Test that src/main.py can be imported without errors."""

    def test_main_module_imports(self):
        """Verify main.py can be imported (FastAPI app creation)."""
        import src.main
        assert hasattr(src.main, "app")
        assert src.main.app.title == "Placement Copilot AI Service"

    def test_health_endpoint(self):
        """Verify health endpoint is defined."""
        import src.main
        # Health route should exist on the app
        routes = [r.path for r in src.main.app.routes]
        assert "/health" in routes

    def test_lifespan_defined(self):
        """Verify lifespan context manager is set on the app."""
        import src.main
        assert src.main.app.router.lifespan_context is not None


class TestAgentState:
    """Test that AgentState TypedDict is valid."""

    def test_agent_state_imports(self):
        """Verify AgentState can be imported."""
        from src.state.agent_state import AgentState
        assert AgentState.__name__ == "AgentState"

    def test_agent_state_fields(self):
        """Verify AgentState has expected fields."""
        from src.state.agent_state import AgentState
        annotations = AgentState.__annotations__
        assert "user_id" in annotations
        assert "session_id" in annotations
        assert "intent" in annotations
        assert "messages" in annotations
        assert "pending_tasks" in annotations
        assert "agent_results" in annotations

    def test_agent_state_is_typeddict(self):
        """Verify AgentState is a TypedDict."""
        from src.state.agent_state import AgentState
        from typing import get_origin, TypedDict
        # TypedDict classes have __annotations__
        assert hasattr(AgentState, "__annotations__")
        assert hasattr(AgentState, "__required_keys__")


class TestSchemas:
    """Test that all Pydantic schemas in src/schemas/ can be imported."""

    def test_schemas_init_imports_all(self):
        """Verify schemas/__init__.py re-exports everything."""
        from src.schemas import (
            OrchestratorInput,
            OrchestratorOutput,
            AgentEvent,
            ProfileInput,
            ProfileOutput,
            ScoringInput,
            ScoringOutput,
            GapAnalysis,
            ResumeInput,
            ResumeOutput,
            InterviewInput,
            InterviewOutput,
            InterviewQuestion,
            SkillGapInput,
            SkillGapOutput,
            Gap,
            ApplicationInput,
            ApplicationOutput,
            CoverLetter,
            TrackingInput,
            TrackingOutput,
            Milestone,
            Analytics,
        )
        # If we get here without ImportError, all schemas imported successfully
        assert OrchestratorInput is not None
        assert OrchestratorOutput is not None
        assert ProfileOutput is not None

    def test_orchestrator_schemas(self):
        """Verify OrchestratorInput and OrchestratorOutput work."""
        from src.schemas import OrchestratorInput, OrchestratorOutput

        inp = OrchestratorInput(
            user_id="user-1",
            session_id="sess-1",
            intent="PROFILE",
            payload={"questionnaire": {"skills": ["Python"]}},
        )
        assert inp.user_id == "user-1"
        assert inp.intent == "PROFILE"

        out = OrchestratorOutput(summary="Done", next_actions=["resume"], results={})
        assert out.summary == "Done"
        assert "resume" in out.next_actions

    def test_profile_schema(self):
        """Verify ProfileInput and ProfileOutput work."""
        from src.schemas import ProfileInput, ProfileOutput
        from src.schemas.profile import Skill, PersonalityTrait

        inp = ProfileInput(user_id="u1", session_id="s1", text="I am a developer")
        assert inp.text == "I am a developer"

        out = ProfileOutput(
            skills=[Skill(skill="Python", level=8, category="technical")],
            personality=[PersonalityTrait(trait="Extraverted", score=0.7)],
            summary="Experienced developer",
        )
        assert len(out.skills) == 1
        assert out.skills[0].skill == "Python"

    def test_resume_schema(self):
        """Verify ResumeInput and ResumeOutput work."""
        from src.schemas import ResumeInput, ResumeOutput
        from src.schemas.resume import ResumeSection

        inp = ResumeInput(user_id="u1", resume_text="John Doe\nSoftware Engineer", job_description="Python, React")
        assert inp.user_id == "u1"

        out = ResumeOutput(
            sections=[ResumeSection(name="Experience", content="Built web apps")],
            keywords=["Python", "React"],
            format_score=85.0,
        )
        assert out.format_score == 85.0
        assert len(out.keywords) == 2

    def test_scoring_schema(self):
        """Verify ScoringInput and ScoringOutput work."""
        from src.schemas import ScoringInput, ScoringOutput

        inp = ScoringInput(user_id="u1", profile={"skills": ["Python"]}, role_requirements={"skills": ["Go"]})
        out = ScoringOutput(pps_score=72.5, breakdown={}, confidence=0.85, gaps=[])
        assert out.pps_score == 72.5
        assert out.confidence == 0.85

    def test_skill_gap_schema(self):
        """Verify SkillGapInput and SkillGapOutput work."""
        from src.schemas import SkillGapInput, SkillGapOutput
        from src.schemas.skill_gap import Gap, LearningResource

        inp = SkillGapInput(user_id="u1", current_skills=["Python"], required_skills=["Go", "Docker"])
        gap = Gap(skill="Go", gap_type="hard", severity="high", priority=1)
        resource = LearningResource(skill="Go", title="Go for Beginners", url="https://example.com", duration_hours=20)
        out = SkillGapOutput(gaps=[gap], resources=[resource], roadmap=["Learn Go basics", "Build a project"])
        assert len(out.gaps) == 1
        assert len(out.resources) == 1

    def test_application_schema(self):
        """Verify ApplicationInput and ApplicationOutput work."""
        from src.schemas import ApplicationInput, ApplicationOutput
        from src.schemas.application import CompanyBrief, ApplicationTimelineTask, CoverLetter

        inp = ApplicationInput(user_id="u1", company_name="Acme", role="SWE", profile={})
        brief = CompanyBrief(name="Acme", culture="Innovative", interview_process="3 rounds", benefits=["health", "401k"])
        tl = ApplicationTimelineTask(task="Submit application", days_before_deadline=3)
        cl = CoverLetter(company_name="Acme", role="SWE", content="I am excited to apply...")
        out = ApplicationOutput(company_brief=brief, timeline=[tl], cover_letter=cl, networking_suggestions=["LinkedIn"])
        assert out.company_brief.name == "Acme"
        assert len(out.timeline) == 1

    def test_interview_schema(self):
        """Verify InterviewInput and InterviewOutput work."""
        from src.schemas import InterviewInput, InterviewOutput, InterviewQuestion
        from src.schemas.interview import STARScores, InterviewFeedback

        inp = InterviewInput(user_id="u1", session_id="s1", interview_type="behavioral", role="SWE", difficulty="medium")
        assert inp.interview_type == "behavioral"

        q = InterviewQuestion(question="Tell me about yourself", type="behavioral", difficulty="easy")
        stars = STARScores(situation=3, task=3, action=3, result=3)
        fb = InterviewFeedback(score=8, star_scores=stars, feedback="Good structure")
        out = InterviewOutput(questions=[q], feedback=fb, overall_score=8.0, grade="B+", recommendations=["Speak slower"])
        assert out.grade == "B+"
        assert len(out.recommendations) == 1

    def test_tracking_schema(self):
        """Verify TrackingInput and TrackingOutput work."""
        from src.schemas import TrackingInput, TrackingOutput, Milestone, Analytics

        inp = TrackingInput(user_id="u1", events=[{"type": "application_submitted"}], time_range_days=30)
        analytics = Analytics(
            applications_count=5,
            interviews_count=2,
            offers_count=0,
            response_rate=0.4,
            avg_time_to_interview_days=14.0,
        )
        milestone = Milestone(milestone_type="first_interview", achieved_at="2024-03-01", description="Reached interview stage")
        out = TrackingOutput(milestones=[milestone], analytics=analytics, motivational_message="Keep going!")
        assert out.analytics.applications_count == 5
        assert len(out.milestones) == 1
