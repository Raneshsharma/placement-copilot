from pydantic import BaseModel
from typing import Optional


class ResumeAnalyzeRequest(BaseModel):
    user_id: str
    resume_text: str
    job_description: Optional[str] = None


class ResumeAnalyzeResponse(BaseModel):
    parsed_data: dict
    ats_score: float
    keywords_found: list[str]
    missing_keywords: list[str]


class ResumeOptimizeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: str


class ResumeOptimizeResponse(BaseModel):
    optimized_text: str
    injected_keywords: list[str]
    suggestions: list[str]
