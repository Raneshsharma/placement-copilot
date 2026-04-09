import os
from langchain.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.profile_agent import system_prompt as profile_system_prompt
from src.tools.profile_tools import extract_skills, score_personality, generate_profile_summary

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_profile_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", profile_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
