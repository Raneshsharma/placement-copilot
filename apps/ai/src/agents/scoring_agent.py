import os
from langchain.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

from src.prompts.scoring_agent import system_prompt as scoring_system_prompt
from src.tools.scoring_tools import calculate_pps, analyze_gaps, get_market_data

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def create_scoring_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", scoring_system_prompt),
        ("human", "{input}"),
    ])
    return prompt | llm
