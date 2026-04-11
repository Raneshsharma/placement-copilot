from pydantic import BaseModel
from typing import Optional, Any


class OrchestrateRequest(BaseModel):
    user_id: str
    session_id: str
    message: str
    context: Optional[dict[str, Any]] = None


class OrchestrateResponse(BaseModel):
    intent: str
    agent: str
    result: Optional[Any] = None
    next_steps: list[str]
