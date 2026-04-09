import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.skill_gap_agent import system_prompt as skill_gap_system_prompt
from src.tools.skill_gap_tools import detect_gaps, rank_gaps, find_resources

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_skill_gap_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", skill_gap_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
