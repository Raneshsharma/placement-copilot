# Placement Copilot - Architecture Documentation

> AI-powered career placement platform for students and professionals. This document describes the system architecture, data flows, and technical decisions for the Placement Copilot monorepo.

## Table of Contents

- [System Overview](#system-overview)
- [Service Responsibilities](#service-responsibilities)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Authentication Architecture](#authentication-architecture)
- [Database Schema](#database-schema)
- [API Gateway Architecture](#api-gateway-architecture)
- [Tech Stack](#tech-stack)

---

## System Overview

Placement Copilot is a Turborepo monorepo with three primary applications:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Placement Copilot Monorepo                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │
│   │  apps/web    │     │  apps/api    │     │   apps/ai    │       │
│   │  (Next.js)   │◄───►│  (NestJS)   │◄───►│  (FastAPI)   │       │
│   │  Port: 3000  │     │  Port: 3001  │     │  Port: 8000  │       │
│   └──────────────┘     └──────┬───────┘     └──────┬───────┘       │
│                              │                      │                │
│                       ┌──────▼──────────────────────▼───────┐       │
│                       │         packages/shared              │       │
│                       │  (Types, Schemas, Constants, Utils)   │       │
│                       └─────────────────────────────────────┘       │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────┐       │
│   │                    Infrastructure Layer                    │       │
│   │  PostgreSQL  │  Redis  │  Elasticsearch  │  Weaviate    │       │
│   └──────────────────────────────────────────────────────────┘       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Service Responsibilities

### apps/web (Next.js Frontend)

The web application provides the user interface for job seekers.

**Responsibilities:**
- User authentication UI (login, register, OAuth callbacks)
- Dashboard with PPS score, activity charts, milestones, and role recommendations
- Application tracker with Kanban board (drag-and-drop)
- Resume builder with live preview, template selection, and ATS optimization
- Mock interview interface with question cards, feedback panels, and score rings
- Role discovery page with search, filtering, and match scoring
- Skill gap analysis with radar charts, gap cards, and learning roadmaps
- Settings management (profile, notifications, integrations, privacy)

**Key Technologies:**
- Next.js 14 App Router with Server Components
- TypeScript
- Tailwind CSS + shadcn/ui components
- Zustand for client-side state management
- Framer Motion for animations
- Axios for API communication

**Directory Structure:**
```
apps/web/src/
├── app/
│   ├── (auth)/           # Login, register pages
│   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── applications/ # Kanban application tracker
│   │   ├── dashboard/   # Main analytics dashboard
│   │   ├── interview/    # Mock interview sessions
│   │   ├── resume/      # Resume builder
│   │   ├── roles/       # Job discovery
│   │   ├── settings/    # User preferences
│   │   ├── skills/      # Skill gap analysis
│   │   └── layout.tsx   # Dashboard shell with sidebar/bottom-nav
│   ├── onboarding/      # 5-step onboarding wizard
│   ├── layout.tsx        # Root layout with fonts and toaster
│   └── page.tsx          # Landing page
├── components/
│   ├── applications/     # KanbanBoard, StatusColumn, ApplicationCard
│   ├── dashboard/        # StatsCards, PPSCard, MilestoneTracker, etc.
│   ├── interview/        # InterviewSession, QuestionCard, FeedbackPanel
│   ├── layout/          # Sidebar, Header, BottomNav
│   ├── resume/          # ATSMeter, KeywordPanel, ResumeBuilder
│   ├── roles/           # RoleCard, FilterChips, SearchBar
│   ├── skills/          # GapCard, RadarChart, LearningRoadmap
│   └── ui/             # shadcn/ui components (Button, Card, etc.)
├── lib/
│   ├── api.ts           # Axios client with interceptors
│   └── utils.ts         # Utility functions
├── stores/
│   ├── auth-store.ts    # Zustand auth state
│   ├── application-store.ts
│   └── ui-store.ts
└── middleware.ts        # Route protection
```

### apps/api (NestJS Backend)

The API server handles all business logic, data persistence, and third-party integrations.

**Responsibilities:**
- JWT-based authentication (register, login, refresh, logout, Google OAuth)
- User and profile management with soft delete
- Resume upload, parsing, versioning, and ATS optimization
- Job listing CRUD with search and recommendation
- Application lifecycle management with status transitions
- Mock interview orchestration (start, question delivery, answer submission, feedback)
- Skill gap analysis and learning roadmaps
- Progress tracking and analytics
- Notifications (create, read, delete, unread count)
- Rate limiting (100 requests/minute per IP)
- Swagger API documentation at `/api/docs`

**Key Technologies:**
- NestJS 10 with TypeScript
- Prisma ORM with PostgreSQL
- Passport.js with JWT strategy
- Multer for file uploads
- BullMQ for job queues (optional)
- Swagger/OpenAPI for documentation

**Modules:**
```
AuthModule          - JWT + Google OAuth authentication
UsersModule         - User CRUD with soft delete
ProfilesModule      - Profile management and AI analysis
ResumesModule       - Resume upload, versioning, ATS scoring
JobsModule          - Job listings, search, recommendations
ApplicationsModule  - Application tracker with Kanban states
InterviewsModule    - Mock interview sessions + WebSocket gateway
SkillGapsModule     - Gap analysis and roadmaps
ProgressModule      - Dashboard analytics
NotificationsModule - Notification management
AiModule           - HTTP client to the AI service
PrismaModule       - Database connection singleton
```

### apps/ai (FastAPI AI Service)

The AI service provides Claude 4-powered features through a LangGraph-based agent system.

**Responsibilities:**
- Resume parsing and ATS scoring
- Interview question generation (5 types: Behavioral, Technical, Case Study, System Design, Hybrid)
- Answer evaluation and scoring
- Skill gap analysis
- Personalized learning roadmaps
- Vector-based job-resume matching

**Key Technologies:**
- FastAPI (Python 3.11)
- LangGraph for multi-agent orchestration (7 agents)
- LangChain for tool abstractions
- Claude 4 (Anthropic API)
- Weaviate for vector storage
- Elasticsearch for full-text search

### packages/shared

A shared TypeScript package exported by all apps to ensure type consistency.

**Exports:**
- TypeScript types matching Prisma models exactly
- Zod validation schemas for all DTOs
- Constants (skill taxonomy, interview types, kanban columns, PPS weights)
- Utility functions (date formatting, score formatting, API response helpers)

---

## Data Flow Diagrams

### Authentication Flow

```
User              Web App           API              Prisma
  │                  │                │                │
  │── Register ─────► │                │                │
  │                  │── POST /api/auth/register ──────► │
  │                  │                │── hash password │                │
  │                  │                │◄── create user ─│                │
  │                  │                │── create profile│──►              │
  │                  │◄─ { accessToken, refreshToken } ─┤                │
  │◄─ JWT tokens ────┤                │                │                │
  │                  │                │                │                │
  │── Login ────────► │                │                │                │
  │                  │── POST /api/auth/login ────────► │                │
  │                  │                │── verify hash ─│                │
  │                  │◄─ { user, accessToken, refreshToken } ─┤          │
  │◄─ Login OK ──────┤                │                │                │
  │                  │                │                │                │
  │── Request ─────► │                │                │                │
  │  (with Bearer)   │── API call ─────────────────────► │                │
  │                  │                │── validate JWT ─│                │
  │                  │                │── fetch user ──► │                │
  │◄─ Response ──────┤◄─ data ───────────────────────────┤                │
```

### Token Refresh Flow

```
Request fails (401)
        │
        ▼
Axios interceptor catches error
        │
        ├── No refresh token? → Redirect to /login
        │
        └── Has refresh token? → POST /api/auth/refresh
                                        │
                                        ├── Valid? → Get new accessToken
                                        │              Retry original request
                                        │
                                        └── Invalid? → Redirect to /login
```

### Application Status Transition Flow

```
User drags card: DRAFT → SUBMITTED
        │
        ▼
PATCH /api/applications/:id/status
{ "status": "SUBMITTED", "note": "Applied via email" }
        │
        ▼
isValidTransition(DRAFT, SUBMITTED)?
        │
        ├── No → 400 Bad Request
        │
        └── Yes → Update database record
                      │
                      ├── Add timeline entry
                      ├── Send notification
                      └── Return updated application
```

---

## Authentication Architecture

### JWT Strategy

The API uses Passport.js with the `passport-jwt` strategy for bearer token authentication.

**Access Token:**
- Signed with `JWT_SECRET` (env var)
- Default expiry: none (configured at runtime)
- Payload: `{ sub: userId, email: email, role: role }`

**Refresh Token:**
- Signed with `JWT_REFRESH_SECRET` (env var)
- Expiry: 7 days
- Payload: `{ sub: userId, email: email, role: role }`

**Implementation (`apps/api/src/auth/strategies/jwt.strategy.ts`):**
```typescript
new PassportStrategy(Strategy, {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET || 'dev-secret',
})
```

**Guard Application:**
All controllers (except auth) use `@UseGuards(JwtAuthGuard)` which validates the JWT on every request.

### Google OAuth Flow

```
User clicks "Sign in with Google"
        │
        ▼
GET /api/auth/google → Redirects to Google OAuth consent
        │
        ▼
User consents → Google redirects to /api/auth/google/callback?code=XXX
        │
        ▼
POST /api/auth/google/callback
  1. Exchange code for tokens via Google's token endpoint
  2. Fetch user info from Google
  3. Find or create user by email
  4. Generate JWT tokens
  5. Return tokens
```

### Middleware Protection (Web)

`apps/web/src/middleware.ts` protects all non-auth routes:
- Checks for `accessToken` cookie or `Authorization` header
- Redirects unauthenticated users to `/login`
- Public routes: `/`, `/login`, `/register`, `/onboarding`

---

## Database Schema

### Overview

PostgreSQL 16 with Prisma ORM. The schema is defined in `apps/api/prisma/schema.prisma`.

### Entity Relationship Diagram

```
User (1) ───────── (1) Profile
  │                      │
  │ (1)                  │
  ├──────────────────────┤
  │
  ├──── (M) Resume
  ├──── (M) Application ─────── (N) JobListing
  │          │
  │          └──── (M) MockInterview
  │
  ├──── (M) Notification
  └──── (M) AnalyticsEvent

User (M) ────── (M) SavedJob ────── (1) JobListing
```

### Models

#### User
| Field     | Type     | Notes                                      |
|-----------|----------|--------------------------------------------|
| id        | UUID     | Primary key, auto-generated                |
| email     | String   | Unique                                    |
| password  | String?  | Nullable (for OAuth users)                 |
| firstName | String   | Required                                   |
| lastName  | String   | Required                                   |
| role      | UserRole | USER, PREMIUM, ADMIN. Default: USER         |
| isActive  | Boolean  | Default: true                             |
| deletedAt | DateTime?| Soft delete timestamp                      |
| createdAt | DateTime | Auto-set to now                           |
| updatedAt | DateTime | Auto-updated on change                     |

#### Profile
| Field       | Type   | Notes                                       |
|-------------|--------|---------------------------------------------|
| headline    | String?| Professional tagline                         |
| summary     | String?| Bio/summary text                            |
| experience  | Json   | Array of Experience objects                 |
| education   | Json   | Array of Education objects                  |
| skills      | Json   | Array of skill strings                      |
| certifications | Json | Array of certification strings              |
| languages   | Json   | Array of language strings                  |
| projects    | Json   | Array of Project objects                   |
| ppsScore    | Float? | Placement Profile Score (0-100)             |
| completeness| Float  | Profile completion %, default: 0            |

#### Resume
| Field      | Type    | Notes                                       |
|------------|---------|---------------------------------------------|
| title      | String  | User-provided title                        |
| fileUrl    | String? | S3/storage URL                             |
| fileKey    | String? | Storage key                                 |
| parsedData | Json    | Extracted resume data                       |
| atsScore   | Float?  | ATS compatibility score                     |
| version    | Int     | Version number, default: 1                  |
| isPrimary  | Boolean | Default: false                              |

#### JobListing
| Field       | Type        | Notes                                   |
|-------------|-------------|-----------------------------------------|
| title       | String      | Job title                              |
| company     | String      | Company name                           |
| location    | String      | Job location                           |
| locationType| LocationType| ONSITE, REMOTE, HYBRID                 |
| salaryMin   | Int?        | Minimum salary                         |
| salaryMax   | Int?        | Maximum salary                         |
| source      | JobSource   | LINKEDIN, INDEED, INTERNAL, SCRAPED    |
| keywords    | Json        | Search keywords                        |
| status      | String      | ACTIVE, CLOSED, etc.                   |

#### Application
| Field          | Type              | Notes                                |
|----------------|-------------------|--------------------------------------|
| company        | String            | Application target company           |
| position       | String            | Job title                            |
| status         | ApplicationStatus | DRAFT, SUBMITTED, UNDER_REVIEW, ...   |
| appliedAt      | DateTime?         | When the application was submitted  |
| timeline       | Json              | Array of timeline entries            |
| coverLetterUrl | String?           | Link to cover letter                 |
| notes          | String?           | User notes                           |

#### MockInterview
| Field       | Type           | Notes                                 |
|-------------|----------------|---------------------------------------|
| applicationId| String?       | Optional link to an application       |
| type        | InterviewType  | BEHAVIORAL, TECHNICAL, etc.           |
| status      | InterviewStatus| SETUP, IN_PROGRESS, COMPLETED, ...    |
| questions   | Json           | Generated interview questions         |
| answers     | Json           | User's submitted answers              |
| scores      | Json           | Per-question and overall scores       |
| feedback    | String?        | AI-generated feedback                 |
| transcript  | Json           | Full interview transcript             |

#### SkillGapAnalysis
| Field           | Type   | Notes                              |
|-----------------|--------|------------------------------------|
| targetRole      | String | The role being analyzed for        |
| currentSkills   | Json   | User's current skill set           |
| gaps            | Json   | Array of SkillGap objects          |
| recommendations | Json   | Array of recommendation strings    |
| roadmap         | Json   | Array of RoadmapStep objects       |
| priorityScore   | Float? | Computed priority score            |

#### Notification
| Field   | Type             | Notes                          |
|---------|------------------|--------------------------------|
| type    | NotificationType| APPLICATION_STATUS, etc.       |
| title   | String           | Notification heading           |
| message | String           | Notification body              |
| payload | Json             | Additional structured data     |
| isRead  | Boolean          | Default: false                 |

---

## API Gateway Architecture

### Routing

All API routes are prefixed with `/api` by `app.setGlobalPrefix('api')` in `main.ts`.

```
GET  /api/health              - Health check (no auth)
GET  /api/docs                - Swagger UI (no auth)
```

### Request Pipeline

```
Incoming Request
        │
        ▼
CORS Middleware (configurable origins)
        │
        ▼
Global Prefix: /api
        │
        ▼
ValidationPipe (whitelist, transform, forbidNonWhitelisted)
        │
        ▼
JwtAuthGuard (for protected routes)
        │
        ├── Valid JWT → Set req.user → Controller
        │
        └── Invalid/missing → 401 Unauthorized
        │
        ▼
Controller
        │
        ▼
LoggingInterceptor (logs method, path, timestamp)
        │
        ▼
TransformInterceptor (wraps responses)
        │
        ▼
GlobalExceptionFilter (standardizes error responses)
        │
        ▼
Response
```

### Rate Limiting

ThrottlerModule configured at 100 requests per minute per IP:
```typescript
ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])
```

### API Response Format

All responses are wrapped by `TransformInterceptor`:
```typescript
{
  data: T,
  // or for errors:
  error: { statusCode: number, message: string, error: string }
}
```

Paginated endpoints return:
```typescript
{
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean,
  }
}
```

### Swagger Documentation

Swagger UI is available at `/api/docs`. All endpoints are documented with:
- `@ApiTags` for grouping
- `@ApiBearerAuth` for JWT requirement
- `@ApiOperation` for summaries
- `@ApiResponse` for response descriptions

---

## Tech Stack

| Layer           | Technology                                      |
|-----------------|------------------------------------------------|
| **Monorepo**    | Turborepo 2                                    |
| **Frontend**    | Next.js 14 App Router, TypeScript, Tailwind CSS |
| **UI Components**| shadcn/ui, Framer Motion                       |
| **State**       | Zustand                                        |
| **Backend API** | NestJS 10, TypeScript, Prisma ORM              |
| **Auth**        | JWT (passport-jwt), Google OAuth               |
| **Database**    | PostgreSQL 16                                  |
| **AI Service**  | FastAPI (Python 3.11), LangGraph, LangChain     |
| **AI Model**    | Claude 4 (Anthropic)                           |
| **Vector Store**| Weaviate 1.23                                 |
| **Search**      | Elasticsearch 8.12                             |
| **Cache**       | Redis 7                                        |
| **Validation**  | Zod (shared), class-validator (API)           |
| **File Upload** | Multer (disk storage)                        |
| **API Docs**    | Swagger/OpenAPI                                |
