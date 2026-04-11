"""
HTTP client for communicating with the NestJS backend API.
"""
import os
import httpx
from typing import Any, Optional


class NestJSAPIClient:
    """Async HTTP client for Placement Copilot NestJS API."""

    def __init__(self, base_url: str | None = None, api_key: str | None = None):
        self.base_url = base_url or os.getenv("NESTJS_API_URL", "http://localhost:3001")
        self.api_key = api_key or os.getenv("NESTJS_API_KEY", "")
        self._client: httpx.AsyncClient | None = None

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def __aenter__(self):
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=self._headers(),
            timeout=30.0,
        )
        return self

    async def __aexit__(self, *args):
        if self._client:
            await self._client.aclose()

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None:
            raise RuntimeError("Client not initialized. Use 'async with NestJSAPIClient()'")
        return self._client

    # ------------------------------------------------------------------
    # User data
    # ------------------------------------------------------------------

    async def get_user(self, user_id: str) -> dict[str, Any]:
        """Fetch user profile data from the backend."""
        resp = await self.client.get(f"/api/users/{user_id}")
        resp.raise_for_status()
        return resp.json()

    async def update_user(self, user_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update user profile data on the backend."""
        resp = await self.client.patch(f"/api/users/{user_id}", json=data)
        resp.raise_for_status()
        return resp.json()

    async def get_user_profile(self, user_id: str) -> dict[str, Any]:
        """Get the user's professional profile."""
        resp = await self.client.get(f"/api/profiles/{user_id}")
        resp.raise_for_status()
        return resp.json()

    async def save_user_profile(self, user_id: str, profile_data: dict[str, Any]) -> dict[str, Any]:
        """Save the user's professional profile."""
        resp = await self.client.post(f"/api/profiles/{user_id}", json=profile_data)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Resumes
    # ------------------------------------------------------------------

    async def get_user_resume(self, user_id: str) -> dict[str, Any]:
        """Fetch a user's resume."""
        resp = await self.client.get(f"/api/resumes/{user_id}")
        resp.raise_for_status()
        return resp.json()

    async def save_user_resume(self, user_id: str, resume_data: dict[str, Any]) -> dict[str, Any]:
        """Save a user's resume."""
        resp = await self.client.post(f"/api/resumes/{user_id}", json=resume_data)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Applications
    # ------------------------------------------------------------------

    async def get_applications(self, user_id: str, limit: int = 50) -> list[dict[str, Any]]:
        """Fetch user's job applications."""
        resp = await self.client.get(f"/api/applications/{user_id}", params={"limit": limit})
        resp.raise_for_status()
        return resp.json()

    async def create_application(self, application_data: dict[str, Any]) -> dict[str, Any]:
        """Create a new job application."""
        resp = await self.client.post("/api/applications", json=application_data)
        resp.raise_for_status()
        return resp.json()

    async def update_application(self, application_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update an existing application."""
        resp = await self.client.patch(f"/api/applications/{application_id}", json=data)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Tracking events
    # ------------------------------------------------------------------

    async def log_tracking_event(self, user_id: str, event_type: str, details: dict[str, Any] | None = None) -> dict[str, Any]:
        """Log a tracking event to the backend."""
        payload = {"user_id": user_id, "type": event_type, "details": details or {}}
        resp = await self.client.post("/api/tracking/events", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def get_tracking_events(self, user_id: str, days: int = 30) -> list[dict[str, Any]]:
        """Fetch tracking events for a user."""
        resp = await self.client.get(f"/api/tracking/events/{user_id}", params={"days": days})
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Sessions
    # ------------------------------------------------------------------

    async def get_session(self, session_id: str) -> dict[str, Any]:
        """Fetch an interview session from the backend."""
        resp = await self.client.get(f"/api/sessions/{session_id}")
        resp.raise_for_status()
        return resp.json()

    async def save_session(self, session_data: dict[str, Any]) -> dict[str, Any]:
        """Save an interview session to the backend."""
        resp = await self.client.post("/api/sessions", json=session_data)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Health check
    # ------------------------------------------------------------------

    async def health_check(self) -> bool:
        """Check if the NestJS API is reachable."""
        try:
            resp = await self.client.get("/health")
            return resp.status_code == 200
        except Exception:
            return False


# Singleton instance
_api_client: NestJSAPIClient | None = None


def get_api_client() -> NestJSAPIClient:
    """Get the singleton API client instance."""
    global _api_client
    if _api_client is None:
        _api_client = NestJSAPIClient()
    return _api_client


async def close_api_client():
    """Close the singleton API client."""
    global _api_client
    if _api_client is not None:
        _api_client._client = None
        _api_client = None
