from pydantic import BaseModel
from typing import Optional


class ApplicationGuidanceRequest(BaseModel):
    user_id: str
    job_listing: dict
    profile: dict


class ApplicationGuidanceResponse(BaseModel):
    company_research: dict
    cover_letter_outline: dict
    networking_tips: list[str]
    application_timeline: list[dict]
    red_flags: list[str]
