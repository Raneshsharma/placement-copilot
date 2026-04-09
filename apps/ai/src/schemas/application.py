from pydantic import BaseModel
from typing import Optional


class ApplicationInput(BaseModel):
    user_id: str
    company_name: str
    role: str
    profile: dict
    deadline: Optional[str] = None


class CompanyBrief(BaseModel):
    name: str
    culture: str
    interview_process: str
    benefits: list[str]


class ApplicationTimelineTask(BaseModel):
    task: str
    days_before_deadline: int


class CoverLetter(BaseModel):
    company_name: str
    role: str
    content: str


class ApplicationOutput(BaseModel):
    company_brief: CompanyBrief
    timeline: list[ApplicationTimelineTask]
    cover_letter: CoverLetter
    networking_suggestions: list[str]
