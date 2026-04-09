import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.application_agent import system_prompt as application_system_prompt
from src.tools.application_tools import research_company, generate_timeline, write_cover_letter, find_connections

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_application_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", application_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
