import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.tracking_agent import system_prompt as tracking_system_prompt
from src.tools.tracking_tools import (
    detect_milestones, compute_analytics, generate_motivational_message,
    log_event, check_milestone, get_weekly_stats,
)

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_tracking_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", tracking_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
