from .orchestrator import system_prompt as orchestrator_prompt
from .profile_agent import system_prompt as profile_agent_prompt
from .scoring_agent import system_prompt as scoring_agent_prompt
from .resume_agent import system_prompt as resume_agent_prompt
from .interview_agent import system_prompt as interview_agent_prompt
from .skill_gap_agent import system_prompt as skill_gap_agent_prompt
from .application_agent import system_prompt as application_agent_prompt
from .tracking_agent import system_prompt as tracking_agent_prompt

__all__ = [
    "orchestrator_prompt",
    "profile_agent_prompt",
    "scoring_agent_prompt",
    "resume_agent_prompt",
    "interview_agent_prompt",
    "skill_gap_agent_prompt",
    "application_agent_prompt",
    "tracking_agent_prompt",
]
