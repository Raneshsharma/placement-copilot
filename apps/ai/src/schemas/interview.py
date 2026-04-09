from pydantic import BaseModel
from typing import Optional


class InterviewInput(BaseModel):
    user_id: str
    session_id: str
    interview_type: str
    role: str
    difficulty: str
    question: Optional[str] = None
    answer: Optional[str] = None


class STARScores(BaseModel):
    situation: int
    task: int
    action: int
    result: int


class InterviewQuestion(BaseModel):
    question: str
    type: str
    difficulty: str


class InterviewFeedback(BaseModel):
    score: int
    star_scores: STARScores
    feedback: str


class InterviewOutput(BaseModel):
    questions: list[InterviewQuestion] = []
    feedback: Optional[InterviewFeedback] = None
    overall_score: Optional[float] = None
    grade: Optional[str] = None
    recommendations: list[str] = []
