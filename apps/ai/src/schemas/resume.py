from pydantic import BaseModel
from typing import Optional


class ResumeInput(BaseModel):
    user_id: str
    resume_text: str
    job_description: Optional[str] = None


class ResumeSection(BaseModel):
    name: str
    content: str


class ResumeOutput(BaseModel):
    sections: list[ResumeSection]
    keywords: list[str]
    format_score: float
    ats_score: Optional[float] = None
    missing_keywords: Optional[list[str]] = None
    optimized_bullets: Optional[list[str]] = None
