from typing import TypedDict, Optional, Annotated
from langgraph.graph import add_messages


class AgentState(TypedDict):
    user_id: str
    session_id: str
    intent: Optional[str]
    messages: Annotated[list, add_messages]
    active_profile: Optional[dict]
    active_resume: Optional[dict]
    current_job_target: Optional[dict]
    pending_tasks: list
    agent_results: dict
    error: Optional[str]
