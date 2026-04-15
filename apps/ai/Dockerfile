# Placement Copilot AI Service - Optimized for Free Tier
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV MALLOC_TRIM_THRESHOLD_=0
ENV PYTHON_GC_HEAP_GROWTH_MAX_BLOCK=1048576

# Install only runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Reduce memory footprint
RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser && \
    chown -R appuser:appgroup /app

USER appuser
EXPOSE 8000

# Health check with longer start period for slow-starting langchain
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["python", "-m", "gunicorn", "src.main:app", "--worker-class", "uvicorn.workers.UvicornWorker", "--workers", "1", "--bind", "0.0.0.0:8000", "--timeout", "120"]
