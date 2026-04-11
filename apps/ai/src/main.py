import os
import logging
from contextlib import asynccontextmanager
from typing import Optional

import httpx
import redis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router as api_router
from src.api.client import NestJSAPIClient, close_api_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Optional clients
_redis_client: Optional[redis.Redis] = None
_weaviate_client: Optional[object] = None


def _init_redis() -> Optional[redis.Redis]:
    """Initialize Redis connection if available."""
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    try:
        client = redis.from_url(redis_url, decode_responses=True)
        client.ping()
        logger.info("Redis connection established")
        return client
    except Exception as e:
        logger.warning(f"Redis not available: {e}. Caching disabled.")
        return None


def _init_weaviate() -> Optional[object]:
    """Initialize Weaviate client if available."""
    weaviate_url = os.getenv("WEAVIATE_URL", "http://localhost:8080")
    weaviate_key = os.getenv("WEAVIATE_API_KEY", "")

    try:
        import weaviate
        client = weaviate.Client(
            url=weaviate_url,
            auth_client_secret=weaviate.AuthApiKey(weaviate_key) if weaviate_key else None,
            timeout_config=(10, 30),
        )
        client.is_ready()
        logger.info("Weaviate connection established")
        return client
    except ImportError:
        logger.warning("weaviate-client not installed. Vector store disabled.")
        return None
    except Exception as e:
        logger.warning(f"Weaviate not available: {e}. Vector store disabled.")
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle: startup and shutdown."""
    logger.info("Placement Copilot AI Service starting up...")

    # Initialize Redis
    global _redis_client
    _redis_client = _init_redis()

    # Initialize Weaviate
    global _weaviate_client
    _weaviate_client = _init_weaviate()

    # Create shared httpx client
    nestjs_url = os.getenv("NESTJS_API_URL", "http://localhost:3001")
    timeout = httpx.Timeout(30.0, connect=5.0)
    app.state.http_client = httpx.AsyncClient(
        base_url=nestjs_url,
        timeout=timeout,
        headers={"Content-Type": "application/json"},
    )
    logger.info(f"HTTP client initialized for {nestjs_url}")

    # Verify NestJS API connectivity
    try:
        resp = await app.state.http_client.get("/health")
        if resp.status_code == 200:
            logger.info("NestJS API is reachable")
        else:
            logger.warning(f"NestJS API returned {resp.status_code}")
    except Exception as e:
        logger.warning(f"NestJS API not reachable at startup: {e}")

    logger.info("Placement Copilot AI Service ready")

    yield

    # Shutdown
    logger.info("Placement Copilot AI Service shutting down...")
    if hasattr(app.state, "http_client"):
        await app.state.http_client.aclose()
    if _redis_client:
        _redis_client.close()
    if _weaviate_client:
        try:
            _weaviate_client.close()
        except Exception:
            pass
    await close_api_client()
    logger.info("Shutdown complete")


# Determine CORS origins from environment
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
cors_origins = [o.strip() for o in cors_origins_str.split(",") if o.strip()]

app = FastAPI(
    title="Placement Copilot AI Service",
    description="Multi-agent AI orchestration for career placement powered by Claude 4 and LangGraph",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "placement-copilot-ai",
        "redis": _redis_client is not None,
        "weaviate": _weaviate_client is not None,
    }


@app.get("/health/ready")
async def readiness():
    """Readiness probe for orchestration systems."""
    return {
        "ready": True,
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("DEBUG", "false").lower() == "true",
    )
