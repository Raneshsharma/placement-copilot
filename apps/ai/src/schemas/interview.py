from pydantic import BaseModel
from typing import Optional


class InterviewStartRequest(BaseModel):
    user_id: str
    interview_type: str
    target_role: str
    difficulty: str = "MEDIUM"


class InterviewStartResponse(BaseModel):
    session_id: str
    first_question: str
    question_count: int
    estimated_duration: int


class InterviewAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer: str


class InterviewAnswerResponse(BaseModel):
    feedback: str
    score: float
    next_question: Optional[str] = None
    is_complete: bool = False
