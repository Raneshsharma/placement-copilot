import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.interview_agent import system_prompt as interview_system_prompt
from src.tools.interview_tools import select_questions, evaluate_answer, generate_report

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_interview_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", interview_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
