# =============================================
# Stage 1: Base
# =============================================
FROM python:3.11-slim AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# =============================================
# Stage 2: Dependencies
# =============================================
FROM base AS deps
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =============================================
# Stage 3: Builder (for any compilation steps)
# =============================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin
COPY . .

# =============================================
# Stage 4: Production Runner
# =============================================
FROM base AS runner
WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Create non-root user for security
RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

# Copy application code
COPY --from=builder /app /app

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check handled by docker-compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
