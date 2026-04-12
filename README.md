# Placement Copilot AI

> Your AI-powered job search co-pilot — from resume to offer letter.

Placement Copilot AI is a production-ready, full-stack monorepo platform that guides job seekers through every stage of the job search journey using a multi-agent AI system powered by Claude 4 and LangGraph.

---

## Architecture

For detailed architecture documentation, see:
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System overview, service responsibilities, data flows, auth architecture, database schema, and API gateway details
- **[API.md](./API.md)** - Complete API endpoint reference with request/response examples

```
┌─────────────────────────────────────────────────────────────┐
│                     Placement Copilot AI                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │    Web App    │   │   API Server │   │   AI Service │    │
│  │   (Next.js)   │◄──│   (NestJS)   │◄──│   (FastAPI)  │    │
│  │  localhost:   │   │  localhost:  │   │  localhost:  │    │
│  │    3000       │   │    3001      │   │    8000      │    │
│  └──────────────┘   └──────┬───────┘   └──────┬───────┘    │
│                            │                  │              │
│                     ┌──────▼──────────────────▼───────┐     │
│                     │         Shared Package          │     │
│                     │   (Types, Schemas, Constants)    │     │
│                     └──────────────────────────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  PostgreSQL  │  │    Redis     │  │   Elasticsearch   │   │
│  │  (Primary DB)│  │ (Cache/Sess) │  │   (Job Search)    │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Weaviate                           │   │
│  │              (Vector Store — Job-Resume Matching)     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Decision Records

Key technical decisions are documented in [docs/](docs/README.md):
- ADR-001: Why JWT for Authentication
- ADR-002: Why Prisma over Other ORMs
- ADR-003: Why Turborepo
- ADR-004: Why Next.js App Router

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand |
| **Backend API** | NestJS 10, TypeScript, Prisma ORM, PostgreSQL, BullMQ |
| **AI Service** | FastAPI (Python 3.11), LangGraph, LangChain, Claude 4 (Anthropic) |
| **Vector Store** | Weaviate 1.23 |
| **Search Engine** | Elasticsearch 8.12 |
| **Cache / Sessions** | Redis 7 |
| **Database** | PostgreSQL 16 |
| **AI Models** | Claude 4 (Anthropic) |
| **Orchestration** | LangGraph (7-agent state machine) |
| **Containerization** | Docker, Docker Compose |
| **Monorepo** | Turborepo 2 |
| **Auth** | JWT, Google OAuth via Supabase |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/placement-copilot.git
cd placement-copilot

# 2. Copy environment variables
cp .env.example .env
# Edit .env and fill in required secrets:
#   - ANTHROPIC_API_KEY (required for AI)
#   - JWT_SECRET (change this in production)
#   - DATABASE_URL (defaults to local Docker)

# 3. Start infrastructure (PostgreSQL, Redis, Elasticsearch, Weaviate)
docker compose up -d

# 4. Install dependencies
npm install

# 5. Generate Prisma client and run migrations
npm run prisma:generate --workspace=@placementcopilot/api
npm run prisma:migrate --workspace=@placementcopilot/api
npm run prisma:seed --workspace=@placementcopilot/api

# 6. Start all apps in development mode
npm run dev
```

| Service | URL |
|---|---|
| **Web App** | http://localhost:3000 |
| **API Server** | http://localhost:3001 |
| **AI Service** | http://localhost:8000 |
| **Swagger API Docs** | http://localhost:3001/api/docs |
| **AI Health Check** | http://localhost:8000/health |

### Production with Docker

```bash
# Build and run all services
docker compose up -d --build

# View logs
docker compose logs -f
```

---

## Features

- **AI Profile Builder** — Guided 5-step onboarding wizard that uses Claude 4 to parse resumes, extract skills, and build a comprehensive job seeker profile with PPS (Placement Profile Score) scoring.

- **Smart Resume Builder** — AI-powered resume creation with ATS scoring, keyword optimization, and version history. Supports multiple tailored versions per target role.

- **Mock Interview Engine** — Real-time AI interview simulation with 7 interview types (Technical, Behavioral, System Design, LeetCode, etc.), live transcription, and detailed scoring with improvement feedback.

- **Role Matching & Job Search** — Semantic job search powered by Elasticsearch and Weaviate vector embeddings. Match % scoring based on profile vs. job requirements with personalized recommendations.

- **Application Tracker** — Kanban board for managing job applications with drag-and-drop status transitions, timeline tracking, and analytics dashboard.

- **Skill Gap Analysis** — AI-driven gap detection between current skills and target role requirements, with ranked gaps, learning resources, and personalized roadmaps.

- **Analytics Dashboard** — Real-time PPS score card, application funnel metrics, interview performance trends, and market alignment insights.

---

## Repository Structure

```
placement-copilot/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # UI components
│   │   │   ├── lib/            # API client, stores, utilities
│   │   │   └── styles/         # Global styles
│   │   ├── prisma/             # Prisma schema for type generation
│   │   └── package.json
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/           # JWT + Google OAuth
│   │   │   ├── users/          # User management
│   │   │   ├── profiles/       # Profile CRUD
│   │   │   ├── resumes/        # Resume upload & versioning
│   │   │   ├── jobs/           # Job listing management
│   │   │   ├── applications/   # Application tracker
│   │   │   ├── interviews/     # Mock interview sessions
│   │   │   ├── skill-gaps/     # Gap analysis
│   │   │   ├── progress/       # Dashboard analytics
│   │   │   ├── notifications/  # Push & email notifications
│   │   │   ├── ai/             # HTTP client to AI service
│   │   │   └── common/         # Guards, DTOs, interceptors, filters
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   └── package.json
│   └── ai/                     # FastAPI AI service
│       ├── src/
│       │   ├── agents/         # LangGraph agents (7 agents)
│       │   ├── tools/          # LangChain tools per agent
│       │   ├── prompts/        # Prompt templates
│       │   ├── schemas/        # Pydantic I/O models
│       │   ├── state/          # LangGraph state definitions
│       │   └── api/            # FastAPI routes
│       ├── requirements.txt
│       └── Dockerfile
├── packages/
│   └── shared/                  # Shared TypeScript package
│       ├── src/
│       │   ├── types/          # Entity types (TypeScript)
│       │   ├── schemas/        # Zod validation schemas
│       │   ├── constants/      # Taxonomies, enums, step configs
│       │   └── utils/          # Formatting, helpers
│       └── package.json
├── docs/                         # Architecture Decision Records
│   ├── ADR-001-Why-JWT-for-Auth.md
│   ├── ADR-002-Why-Prisma-ORM.md
│   ├── ADR-003-Why-Turborepo.md
│   └── ADR-004-Why-Next.js-App-Router.md
├── ARCHITECTURE.md               # System architecture documentation
├── API.md                        # API endpoint reference
├── docker-compose.yml            # PostgreSQL, Redis, ES, Weaviate
├── turbo.json                    # Turborepo pipeline config
├── package.json                  # Root workspace manifest
└── tsconfig.base.json            # Shared TypeScript config
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, commit conventions, and PR process.

---

## License

MIT License. See [LICENSE](./LICENSE) for details.
