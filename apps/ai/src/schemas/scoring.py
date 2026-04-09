from pydantic import BaseModel
from typing import Optional


class ScoringInput(BaseModel):
    user_id: str
    profile: dict
    role_requirements: dict
    market_data: Optional[dict] = None


class GapAnalysis(BaseModel):
    skill: str
    gap_type: str
    severity: str


class ScoringOutput(BaseModel):
    pps_score: float
    breakdown: dict
    confidence: float
    gaps: list[GapAnalysis]
