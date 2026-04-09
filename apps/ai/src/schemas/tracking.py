from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TrackingInput(BaseModel):
    user_id: str
    events: list[dict]
    time_range_days: int = 30
    engagement_level: str = "medium"


class Milestone(BaseModel):
    milestone_type: str
    achieved_at: str
    description: str


class Analytics(BaseModel):
    applications_count: int
    interviews_count: int
    offers_count: int
    response_rate: float
    avg_time_to_interview_days: float


class TrackingOutput(BaseModel):
    milestones: list[Milestone]
    analytics: Analytics
    motivational_message: str
