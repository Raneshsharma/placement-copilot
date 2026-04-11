import os
from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, END

from src.state.agent_state import AgentState
from src.prompts.orchestrator import system_prompt as orchestrator_system_prompt
from src.agents.profile_agent import create_profile_agent as _create_profile_agent
from src.agents.scoring_agent import create_scoring_agent as _create_scoring_agent
from src.agents.resume_agent import create_resume_agent as _create_resume_agent
from src.agents.interview_agent import create_interview_agent as _create_interview_agent
from src.agents.skill_gap_agent import create_skill_gap_agent as _create_skill_gap_agent
from src.agents.application_agent import create_application_agent as _create_application_agent
from src.agents.tracking_agent import create_tracking_agent as _create_tracking_agent

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def _classify_intent(input_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system", orchestrator_system_prompt),
        ("human", "{input}"),
    ])
    chain = prompt | llm
    result = chain.invoke({"input": input_text})
    content = result.content if hasattr(result, "content") else str(result)
    return content.strip().upper()


def router_node(state: AgentState) -> dict:
    """Classify user intent from the input message."""
    messages = state.get("messages", [])
    if not messages:
        return {"intent": "GENERAL", "agent": "synthesize"}

    last_message = messages[-1]
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))

    intent = _classify_intent(content)

    intent_map = {
        "PROFILE": "profile_agent",
        "RESUME": "resume_agent",
        "INTERVIEW": "interview_agent",
        "APPLICATION": "application_agent",
        "SKILL_GAP": "skill_gap_agent",
        "SCORING": "scoring_agent",
        "RESEARCH": "synthesize",
    }
    agent = intent_map.get(intent, "synthesize")

    return {"intent": intent, "agent": agent}


def route_based_on_intent(state: AgentState) -> Literal[
    "profile_agent",
    "scoring_agent",
    "resume_agent",
    "interview_agent",
    "skill_gap_agent",
    "application_agent",
    "tracking_agent",
    "synthesize",
]:
    """Route to the appropriate agent based on classified intent."""
    return state.get("agent", "synthesize")


def _call_agent_sync(create_fn, content: str) -> str:
    """Call an agent synchronously (blocking). For use within async context."""
    agent = create_fn()
    result = agent.invoke({"input": content})
    return result.content if hasattr(result, "content") else str(result)


def profile_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_profile_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "profile": result}}


def scoring_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_scoring_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "scoring": result}}


def resume_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_resume_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "resume": result}}


def interview_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_interview_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "interview": result}}


def skill_gap_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_skill_gap_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "skill_gap": result}}


def application_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_application_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "application": result}}


def tracking_node(state: AgentState) -> dict:
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else ""
    content = last_message if isinstance(last_message, str) else getattr(last_message, "content", str(last_message))
    result = _call_agent_sync(_create_tracking_agent, content)
    return {"agent_results": {**state.get("agent_results", {}), "tracking": result}}


def synthesize_node(state: AgentState) -> dict:
    """Synthesize results from all agents into a final summary."""
    agent_results = state.get("agent_results", {})
    if not agent_results:
        summary = "No agents were invoked. How can I help you with your career placement?"
        return {
            "summary": summary,
            "next_actions": ["PROFILE", "RESUME", "INTERVIEW", "APPLICATION"],
            "results": {},
            "intent": state.get("intent", "GENERAL"),
            "agent": "synthesize",
        }

    summary_parts = []
    next_actions = set()
    results = {}

    for agent_name, result_content in agent_results.items():
        summary_parts.append(f"[{agent_name.upper()}] {result_content}")
        results[agent_name] = result_content
        if agent_name == "profile":
            next_actions.update(["scoring", "resume"])
        elif agent_name == "scoring":
            next_actions.update(["skill_gap", "application"])
        elif agent_name == "skill_gap":
            next_actions.update(["resume"])
        elif agent_name == "application":
            next_actions.update(["tracking"])

    summary = "\n\n".join(summary_parts)
    return {
        "summary": summary,
        "next_actions": list(next_actions),
        "results": results,
        "intent": state.get("intent", "GENERAL"),
        "agent": "synthesize",
    }


def create_orchestrator():
    workflow = StateGraph(AgentState)

    workflow.add_node("router", router_node)
    workflow.add_node("profile_agent", profile_node)
    workflow.add_node("scoring_agent", scoring_node)
    workflow.add_node("resume_agent", resume_node)
    workflow.add_node("interview_agent", interview_node)
    workflow.add_node("skill_gap_agent", skill_gap_node)
    workflow.add_node("application_agent", application_node)
    workflow.add_node("tracking_agent", tracking_node)
    workflow.add_node("synthesize", synthesize_node)

    workflow.set_entry_point("router")

    workflow.add_conditional_edges(
        "router",
        route_based_on_intent,
        {
            "profile_agent": "profile_agent",
            "scoring_agent": "scoring_agent",
            "resume_agent": "resume_agent",
            "interview_agent": "interview_agent",
            "skill_gap_agent": "skill_gap_agent",
            "application_agent": "application_agent",
            "tracking_agent": "tracking_agent",
            "synthesize": "synthesize",
        },
    )

    for agent in ["profile_agent", "scoring_agent", "resume_agent", "interview_agent",
                  "skill_gap_agent", "application_agent", "tracking_agent"]:
        workflow.add_edge(agent, "synthesize")

    workflow.add_edge("synthesize", END)

    return workflow.compile()
