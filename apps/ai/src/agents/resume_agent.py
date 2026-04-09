import os
from langchain.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.resume_agent import system_prompt as resume_system_prompt
from src.tools.resume_tools import parse_resume, score_ats, optimize_keywords

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_resume_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", resume_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
