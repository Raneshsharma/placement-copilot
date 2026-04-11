# Placement Copilot - Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Services Overview](#docker-services-overview)
- [Database Migrations](#database-migrations)
- [Environment Variables](#environment-variables)
- [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker 24.0+ and Docker Compose v2.20+
- Node.js 22+ (for local builds)
- Python 3.11+ (for AI service development)

### Required Accounts / Credentials

| Service | Purpose | Signup |
|---------|---------|--------|
| PostgreSQL 16 | Primary database | Managed (Supabase, Neon, Railway, etc.) |
| Redis 7 | Caching & queues | Managed (Redis Cloud, Upstash) or self-hosted |
| Elasticsearch 8 | Full-text search | Managed (Elastic Cloud) or self-hosted |
| Weaviate | Vector search | Managed (Weaviate Cloud) or self-hosted |
| Anthropic | Claude AI | [console.anthropic.com](https://console.anthropic.com/) |
| Google Cloud | OAuth login | [console.cloud.google.com](https://console.cloud.google.com/) |
| AWS S3 | File storage | [aws.amazon.com](https://aws.amazon.com/) |
| Sentry | Error tracking | [sentry.io](https://sentry.io/) |
| Firebase | Auth (optional) | [console.firebase.google.com](https://console.firebase.google.com/) |

---

## Local Development

### 1. Clone and Configure

```bash
git clone <repo-url>
cd placement-copilot

# Copy environment template
cp .env.example .env
# Edit .env with your values
```

### 2. Start Infrastructure

```bash
# Start database, redis, elasticsearch, weaviate
docker compose up -d postgres redis elasticsearch weaviate

# Verify services are healthy
docker compose ps
```

### 3. Run Database Migrations

```bash
# Bash / Linux / Mac
./scripts/migrate.sh up

# Windows
scripts\migrate.bat up
```

### 4. Start All Services

```bash
docker compose up -d

# Watch logs
docker compose logs -f
```

### 5. Access Services

| Service | URL |
|---------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (NestJS) | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| AI Service (FastAPI) | http://localhost:8000 |
| AI Docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5433 |
| Redis | localhost:6379 |
| Elasticsearch | localhost:9200 |
| Weaviate | localhost:8081 |

---

## Production Deployment

### Architecture

```
                    ┌──────────────────────────────────────────┐
                    │              Nginx Reverse Proxy           │
                    │    Port 80/443                             │
                    │    /      -> Web (Next.js)                │
                    │    /api/* -> API (NestJS)                 │
                    │    /ai/*  -> AI Service (FastAPI)         │
                    └──────────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
           ▼                        ▼                        ▼
    ┌─────────────┐          ┌─────────────┐         ┌─────────────┐
    │  Next.js    │          │   NestJS     │         │  FastAPI    │
    │  (Web)      │          │   (API)      │         │  (AI)       │
    └─────────────┘          └─────────────┘         └─────────────┘
                                      │                        │
           ┌──────────────────────────┴──────────────────────────┤
           │                                                     │
    ┌──────────────┐  ┌─────────┐  ┌────────────────┐  ┌──────────────┐
    │  PostgreSQL   │  │  Redis  │  │ Elasticsearch  │  │   Weaviate   │
    └──────────────┘  └─────────┘  └────────────────┘  └──────────────┘
```

### 1. Prepare Environment

```bash
# Copy and configure production environment
cp .env.example .env
# Set production values in .env:
#   - Strong JWT secrets (openssl rand -hex 32)
#   - Real API keys (Anthropic, Google OAuth, AWS, etc.)
#   - Production domain for CORS_ORIGIN
```

### 2. Configure TLS Certificates

Uncomment TLS sections in `nginx/conf.d/placement-copilot.conf` and mount your certificates:

```yaml
# In docker-compose.prod.yml, under nginx volumes:
- /etc/letsencrypt/live/yourdomain.com/fullchain.pem:/etc/letsencrypt/live/yourdomain.com/fullchain.pem:ro
- /etc/letsencrypt/live/yourdomain.com/privkey.pem:/etc/letsencrypt/live/yourdomain.com/privkey.pem:ro
```

Or use Certbot for automatic TLS:

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Build Images

```bash
# Option A: Build from local source
./scripts/build.sh

# Option B: Pull pre-built images (if using a registry)
docker pull placement-copilot/api:latest
docker pull placement-copilot/web:latest
docker pull placement-copilot/ai:latest
```

### 4. Deploy

```bash
# Start production stack
docker compose -f docker-compose.prod.yml --env-file .env up -d

# Watch logs during startup
docker compose -f docker-compose.prod.yml logs -f
```

### 5. Run Migrations

```bash
# Inside the API container
docker compose -f docker-compose.prod.yml exec api node_modules/.bin/prisma migrate deploy

# Or use the migration script
IN_DOCKER=true ./scripts/migrate.sh deploy
```

### 6. Verify

```bash
# Check service health
curl http://localhost/health      # nginx
curl http://localhost/api/health # NestJS
curl http://localhost/ai/health  # FastAPI
```

---

## Docker Services Overview

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `postgres` | postgres:16-alpine | 5433 | Primary database |
| `redis` | redis:7-alpine | 6379 | Caching & job queues |
| `elasticsearch` | elasticsearch:8.12.0 | 9200 | Full-text search engine |
| `weaviate` | semitechnologies/weaviate:1.24.0 | 8081 | Vector database |
| `api` | placement-copilot/api:latest | 4000 | NestJS REST API |
| `ai` | placement-copilot/ai:latest | 8000 | FastAPI AI orchestration |
| `web` | placement-copilot/web:latest | 3000 | Next.js frontend |
| `nginx` | nginx:1.25-alpine | 80, 443 | Reverse proxy (prod only) |

---

## Database Migrations

### Commands

```bash
# Run pending migrations
./scripts/migrate.sh up

# Deploy (production - no check for uncommitted changes)
./scripts/migrate.sh deploy

# Check status
./scripts/migrate.sh status

# Create new migration
./scripts/migrate.sh create add_user_preferences

# Seed database
./scripts/migrate.sh seed

# Reset database (DESTRUCTIVE)
./scripts/migrate.sh reset

# Development mode
./scripts/migrate.sh dev
```

### Migrations in Docker

```bash
# Run migrations in running container
docker compose exec api npx prisma migrate deploy

# Create migration from inside container
docker compose exec api npx prisma migrate dev --name migration_name
```

---

## Environment Variables

### Complete Variable Reference

See `.env.example` for all available variables. Key ones:

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 64 chars) |
| `GOOGLE_CLIENT_ID` | For OAuth | Google OAuth client ID |
| `AWS_*` | For uploads | AWS credentials for S3 |
| `SENTRY_DSN` | Recommended | Error tracking |

### Security Notes

- Never commit `.env` files
- Use different JWT secrets per environment
- Use managed secrets (AWS Secrets Manager, etc.) for production
- Restrict `CORS_ORIGIN` to your production domain

---

## Nginx Reverse Proxy

### Routing

| Path | Backend | Purpose |
|------|---------|---------|
| `/` | web:3000 | Next.js frontend |
| `/api/*` | api:3001 | NestJS REST API |
| `/ai/*` | ai:8000 | FastAPI AI service |
| `/health` | nginx | Health check |

### Rate Limiting

| Zone | Rate | Scope |
|------|------|-------|
| `api_limit` | 30 req/s | `/api/*` endpoints |
| `general` | 10 req/s | General pages |
| `addr` | 50 conn | Per IP |

### Adding TLS

1. Obtain certificates (Let's Encrypt recommended):

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

2. Update nginx volume mounts in `docker-compose.prod.yml`
3. Uncomment TLS configuration in `nginx/conf.d/placement-copilot.conf`
4. Restart nginx: `docker compose -f docker-compose.prod.yml restart nginx`

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs <service-name>

# Check resource limits
docker stats

# Inspect container
docker inspect placement-copilot-<service>
```

### Database connection failures

```bash
# Verify postgres is running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U postgres -d placement_copilot

# Check connection string in .env
echo $DATABASE_URL
```

### Prisma migration failures

```bash
# Check migration status
./scripts/migrate.sh status

# Force reset (dev only)
./scripts/migrate.sh reset
```

### Health checks failing

```bash
# Test endpoints directly
curl http://localhost:4000/health  # API
curl http://localhost:8000/health  # AI
curl http://localhost:3000/health  # Web

# Check nginx logs
docker compose -f docker-compose.prod.yml logs nginx
```

### Rebuild from scratch

```bash
# Stop and remove all containers and volumes
docker compose -f docker-compose.prod.yml down -v

# Rebuild images
./scripts/build.sh --no-cache

# Restart
docker compose -f docker-compose.prod.yml up -d
```

### Log Aggregation

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api

# Last N lines
docker compose logs --tail=100 api
```
