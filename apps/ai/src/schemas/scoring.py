from pydantic import BaseModel
from typing import Optional


class ScoringRequest(BaseModel):
    user_id: str
    profile_data: dict
    job_target: dict


class ScoringBreakdown(BaseModel):
    skills_match: float
    experience_relevance: float
    education_fit: float
    market_demand: float
    location_factor: float


class ScoringResponse(BaseModel):
    pps_score: float
    breakdown: ScoringBreakdown
    percentile: Optional[float] = None
