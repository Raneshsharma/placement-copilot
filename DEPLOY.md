# Deployment Guide

## Stack
| Layer | Platform | URL |
|-------|----------|-----|
| Web (Next.js) | Vercel | placement-copilot.vercel.app |
| API (NestJS) | Fly.io | placement-copilot-api.flycast |
| AI (FastAPI) | Fly.io | placement-copilot-ai.flycast |
| Database | Supabase | gtzhyxigjtlmhkrebbdw.supabase.co |

## Prerequisites

1. **Fly.io account** — https://fly.io/signup
2. **Fly CLI installed** — https://fly.io/docs/flyctl/install
3. **Vercel account** — https://vercel.com (connect via GitHub)
4. **GitHub repo connected** to both platforms

## Step 1: Deploy API to Fly.io

```bash
# Login to Fly
fly auth login

# Launch the API app
cd apps/api
fly launch --no-deploy --app placement-copilot-api

# Set secrets
fly secrets set DATABASE_URL="postgres://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
fly secrets set DIRECT_URL="postgres://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
fly secrets set JWT_SECRET="your-jwt-secret"
fly secrets set JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# Run migrations and deploy
fly deploy --app placement-copilot-api

# Verify
curl https://placement-copilot-api.flycast/health
```

## Step 2: Deploy AI Service to Fly.io

```bash
cd apps/ai
fly launch --no-deploy --app placement-copilot-ai

fly secrets set ANTHROPIC_API_KEY="your-anthropic-api-key"

fly deploy --app placement-copilot-ai
```

## Step 3: Deploy Web to Vercel

1. Go to https://vercel.com → Import Project → select `placement-copilot`
2. Framework: **Next.js**
3. Root directory: `apps/web`
4. Build command: `npm run build`
5. Environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://placement-copilot-api.flycast`
6. Deploy

## Step 4: Verify

- Web: https://placement-copilot.vercel.app
- API: https://placement-copilot-api.flycast/health
- API Docs: https://placement-copilot-api.flycast/api/docs

## Database Migrations

Migrations run automatically via `fly.toml` release_command. To run manually:

```bash
cd apps/api
fly ssh console -a placement-copilot-api
npx prisma migrate deploy
```

## Updating

Push to GitHub — Vercel auto-deploys the web app. For API/AI:

```bash
fly deploy --app placement-copilot-api
fly deploy --app placement-copilot-ai
```
