from pydantic import BaseModel
from typing import Optional


class TrackingDashboardRequest(BaseModel):
    user_id: str


class WeeklyActivity(BaseModel):
    date: str
    count: int


class Milestone(BaseModel):
    name: str
    achieved: bool
    date: Optional[str] = None


class RecentEvent(BaseModel):
    type: str
    description: str
    date: str


class TrackingDashboardResponse(BaseModel):
    total_applications: int
    response_rate: float
    interview_rate: float
    offer_rate: float
    weekly_activity: list[WeeklyActivity]
    milestones: list[Milestone]
    recent_events: list[RecentEvent]
