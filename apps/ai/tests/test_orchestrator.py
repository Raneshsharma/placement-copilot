import pytest
from src.agents.orchestrator import router_node, route_based_on_intent, synthesize_node


class TestOrchestratorRouter:
    def test_route_based_on_intent_profile(self):
        state = {"intent": "PROFILE"}
        assert route_based_on_intent(state) == "profile_agent"

    def test_route_based_on_intent_resume(self):
        state = {"intent": "RESUME"}
        assert route_based_on_intent(state) == "resume_agent"

    def test_route_based_on_intent_interview(self):
        state = {"intent": "INTERVIEW"}
        assert route_based_on_intent(state) == "interview_agent"

    def test_route_based_on_intent_application(self):
        state = {"intent": "APPLICATION"}
        assert route_based_on_intent(state) == "application_agent"

    def test_route_based_on_intent_skill_gap(self):
        state = {"intent": "SKILL_GAP"}
        assert route_based_on_intent(state) == "skill_gap_agent"

    def test_route_based_on_intent_scoring(self):
        state = {"intent": "SCORING"}
        assert route_based_on_intent(state) == "scoring_agent"

    def test_route_based_on_intent_research(self):
        state = {"intent": "RESEARCH"}
        assert route_based_on_intent(state) == "synthesize"

    def test_route_based_on_intent_general(self):
        state = {"intent": "GENERAL"}
        assert route_based_on_intent(state) == "synthesize"

    def test_route_based_on_intent_unknown(self):
        state = {"intent": "UNKNOWN_INTENT"}
        assert route_based_on_intent(state) == "synthesize"

    def test_route_based_on_intent_missing(self):
        state = {}
        assert route_based_on_intent(state) == "synthesize"


class TestSynthesizeNode:
    def test_synthesize_empty_results(self):
        state = {"agent_results": {}}
        result = synthesize_node(state)
        assert "summary" in result
        assert "next_actions" in result
        assert "results" in result
        assert "How can I help" in result["summary"]

    def test_synthesize_with_profile_result(self):
        state = {
            "agent_results": {
                "profile": "Extracted 5 technical skills and 3 soft skills.",
            }
        }
        result = synthesize_node(state)
        assert "profile" in result["summary"].lower()
        assert "scoring" in result["next_actions"] or "resume" in result["next_actions"]
        assert "profile" in result["results"]

    def test_synthesize_with_multiple_results(self):
        state = {
            "agent_results": {
                "profile": "Profile summary.",
                "scoring": "PPS score: 72.",
                "skill_gap": "Found 3 gaps.",
            }
        }
        result = synthesize_node(state)
        assert len(result["results"]) == 3
        assert "resume" in result["next_actions"]


class TestRouterNode:
    def test_router_node_empty_messages(self):
        state = {"messages": []}
        result = router_node(state)
        assert result["intent"] == "GENERAL"

    def test_router_node_no_messages_key(self):
        state = {}
        result = router_node(state)
        assert result["intent"] == "GENERAL"


class TestErrorHandling:
    def test_route_based_on_intent_none_value(self):
        state = {"intent": None}
        result = route_based_on_intent(state)
        assert result == "synthesize"

    def test_synthesize_with_empty_string_results(self):
        state = {"agent_results": {"profile": "", "scoring": ""}}
        result = synthesize_node(state)
        assert "results" in result
        assert result["results"]["profile"] == ""
