from pydantic import BaseModel
from typing import Optional


class ProfileInput(BaseModel):
    user_id: str
    session_id: str
    text: Optional[str] = None
    questionnaire_responses: Optional[dict] = None


class Skill(BaseModel):
    skill: str
    level: int
    category: str


class PersonalityTrait(BaseModel):
    trait: str
    score: float


class ProfileOutput(BaseModel):
    skills: list[Skill]
    personality: list[PersonalityTrait]
    summary: str
