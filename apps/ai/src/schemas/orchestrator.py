from pydantic import BaseModel
from typing import Optional, Any


class OrchestratorInput(BaseModel):
    user_id: str
    session_id: str
    intent: str
    payload: dict[str, Any]
    streaming: bool = True


class AgentEvent(BaseModel):
    agent: str
    phase: str
    progress: float = 0.0
    message: str = ""


class OrchestratorOutput(BaseModel):
    summary: str
    next_actions: list[str]
    results: dict[str, Any]
    pps_score: Optional[float] = None
