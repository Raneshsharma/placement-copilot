from pydantic import BaseModel
from typing import Optional


class SkillGapInput(BaseModel):
    user_id: str
    current_skills: list[str]
    required_skills: list[str]
    weekly_hours: float = 10.0


class Gap(BaseModel):
    skill: str
    gap_type: str
    severity: str
    priority: int


class LearningResource(BaseModel):
    skill: str
    title: str
    url: str
    duration_hours: float


class SkillGapOutput(BaseModel):
    gaps: list[Gap]
    resources: list[LearningResource]
    roadmap: list[str]
