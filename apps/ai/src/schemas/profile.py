from pydantic import BaseModel
from typing import Optional


class ProfileAnalyzeRequest(BaseModel):
    user_id: str
    profile_data: dict


class ProfileAnalyzeResponse(BaseModel):
    headline: str
    summary: str
    skills: list[str]
    experience: list[dict]
    education: list[dict]
    certifications: list[str]
    completeness: float
