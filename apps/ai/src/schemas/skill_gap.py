from pydantic import BaseModel
from typing import Optional, Literal


class SkillGapStep(BaseModel):
    title: str
    duration: str
    resources: list[str]


class SkillGapRoadmapItem(BaseModel):
    skill: str
    steps: list[SkillGapStep]


GapType = Literal["MISSING", "WEAK", "STALE"]
Severity = Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]


class SkillGapItem(BaseModel):
    skill: str
    gap_type: GapType
    severity: Severity
    gap_percent: float
    priority_score: float


class SkillGapAnalyzeRequest(BaseModel):
    user_id: str
    current_skills: list[str]
    target_role: str


class SkillGapAnalyzeResponse(BaseModel):
    gaps: list[SkillGapItem]
    roadmap: list[SkillGapRoadmapItem]
    overall_priority_score: float
