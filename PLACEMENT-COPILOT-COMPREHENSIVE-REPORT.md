# PLACEMENT COPILOT AI
## Comprehensive Product Report

**Document Version:** 1.0
**Date:** April 9, 2026
**Prepared by:** Multi-Agent Team (PRD Writer, System Architect, UI/UX Designer, Feature Spec Writer)
**Orchestrated by:** Claude Code

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Product Requirements Document (PRD)](#2-product-requirements-document-prd)
3. [System Architecture & Tech Stack](#3-system-architecture--tech-stack)
4. [UI/UX Design Specification](#4-ux-design-specification)
5. [Feature Specifications (Deep Dive)](#5-feature-specifications-deep-dive)
6. [Multi-Agent System Design](#6-multi-agent-system-design)
7. [Roadmap & Phasing](#7-roadmap--phasing)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Team Structure & Agent Responsibilities](#9-team-structure--agent-responsibilities)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision

Placement Copilot AI is an **end-to-end, AI-powered career execution platform** designed for students and early professionals. It acts as a personal career operating system that combines intelligent guidance, hands-on execution support, and continuous tracking to produce tangible placement outcomes.

> **Core Promise:** Shift from passive advice ("here's what you should do") to active outcome generation ("here's how we get you placed").

### 1.2 What Makes It Powerful

- **Guidance + Execution + Tracking** — all three in one unified platform
- **Personalized career coach + recruiter + mentor** — combined into one AI system
- **Placement Probability Score** — an objective, AI-generated metric showing your real likelihood of getting hired
- **Continuous feedback loop** — tracks progress and adjusts your plan dynamically
- **Stays with you until placement** — from first profile to offer letter

### 1.3 Target Users

| User Segment | Primary Needs |
|---|---|
| College Students (Final Year) | First professional role: resume optimization, interview prep, application tracking |
| College Students (Pre-Final Year) | Building toward placement: skill gaps, portfolio, early guidance |
| Early Professionals (0–2 years) | Career switching/advancement: role-specific upskilling, market positioning |
| Career Counselors / TPO Staff | Bulk progress monitoring, cohort analytics, intervention triggers |
| Parents / Guardians | Progress visibility, milestone alerts |

### 1.4 The Problem We Solve

| Pain Point | Solution |
|---|---|
| Information overload without execution | Structured AI-driven action plans, not just advice |
| Generic career guidance | Multi-dimensional profiling + role-specific scoring |
| No feedback loop | Continuous tracking with dynamic plan adjustment |
| Isolated tools (resume builder + interview prep + tracker = separate apps) | Unified career OS |
| Career anxiety & uncertainty | Placement Probability Score as objective metric |

---

## 2. PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 2.1 Product Goals & Success Metrics

**Primary Goal:** Reduce time-to-placement for users by providing structured, AI-driven support across the entire career preparation journey.

**Key Success Metrics:**
- Percentage of active users receiving at least one offer within 6 months
- Average improvement in placement probability score over 30/60/90 days
- Weekly active user rate and feature adoption depth
- 90-day return rate and funnel conversion

### 2.2 Core Capabilities (7 Pillars)

```
┌─────────────────────────────────────────────────────────────┐
│                    PLACEMENT COPILOT AI                      │
│                                                              │
│  1. STRUCTURED PROFILING                                     │
│     Multi-dimensional intake: interests, skills, academics,   │
│     personality, career goals — guided 5-step wizard          │
│                                                              │
│  2. PLACEMENT PROBABILITY SCORING (PPS)                     │
│     AI-generated 0-100 score: profile completeness + skill    │
│     alignment + market demand + resume + interview readiness │
│                                                              │
│  3. RESUME OPTIMIZER                                         │
│     ATS-compatible generation, keyword injection,             │
│     role-tailored versions, format restructuring               │
│                                                              │
│  4. MOCK INTERVIEW SYSTEM                                    │
│     Role-specific AI interviews, question bank,               │
│     real-time evaluation, detailed feedback                   │
│                                                              │
│  5. SKILL GAP ANALYZER                                       │
│     Current vs. required skills, gap quantification,          │
│     prioritized learning roadmaps                             │
│                                                              │
│  6. APPLICATION GUIDANCE ENGINE                               │
│     Company research, step planners, cover letters,           │
│     networking suggestions, interview prep triggers           │
│                                                              │
│  7. PROGRESS TRACKING + FEEDBACK LOOP                        │
│     Unified dashboard, milestone detection,                   │
│     motivational feedback, dynamic plan adjustment            │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 User Journey

```
ONBOARDING FLOW:
Landing → Account Creation → Role Selection (Student/Pro/Counselor)
→ 5-Step Profiling Wizard → Profile Score → Dashboard Reveal
→ Placement Probability Score → Personalized Roadmap

CORE WORKFLOW A — NEW USER → PLACED (90-day target):
Complete profiling → PPS Score (initial) → Skill Gap Analysis
→ Personalized Roadmap → Optimized Resume → Mock Interviews (3+)
→ Track Applications → AI Feedback + Plan Adjust → PLACEMENT

CORE WORKFLOW B — RETURNING USER → IMPROVING:
Log in → Updated PPS Score → Complete pending tasks
→ Mock Interview → Review feedback → Update profile/skills → Reassess gaps
```

### 2.4 Competitive Positioning

| Competitor | Weakness | Placement Copilot AI Advantage |
|---|---|---|
| LinkedIn Learning | Courses only, no placement | End-to-end execution platform |
| Indeed | Listings only, no guidance | Guided pathway with probability scoring |
| Interview Cake | Technical only, narrow | Full-spectrum placement (profile → offer) |
| resume.io | Standalone tool | Integrated with scoring, tracking, and AI |
| Coursera / Udemy | Learning only | Gap-to-placement pipeline |

> **Unique Value Proposition:** "Placement Copilot AI is the only platform that combines your personal profile, market intelligence, and daily guidance into a single execution system that tells you not just what to do, but tracks whether doing it actually gets you placed."

### 2.5 Pricing Model

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Basic profiling, 1 resume version, 3 mock interviews/month |
| **Pro** | $9.99/mo | Unlimited resumes, unlimited mock interviews, advanced analytics, calendar sync |
| **Institution** | Custom/seat | Counselor dashboard, LMS integration, branded portal, analytics API |

### 2.6 Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI feedback quality below expectations | High | Medium | Human review loop for first 1,000 sessions |
| Low user engagement post-onboarding | High | High | Momentum-driven UI, push notifications, milestone celebrations |
| Data privacy non-compliance | Low | High | GDPR audit, privacy-by-design architecture |
| Institutional adoption friction | High | Low | Self-serve onboarding, flexible pricing, pilot programs |
| Established platforms adding AI features | Medium | Medium | Deep vertical integration vs. broad job board approach |

---

## 3. SYSTEM ARCHITECTURE & TECH STACK

### 3.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│   Web App (Next.js 14 / React)      Mobile App (React Native)   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│           Kong Gateway (rate limiting, auth, routing)            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐
│  USER SERVICE  │  │ CORE SERVICES  │  │   AI AGENT ORCHESTRATOR │
│  (NestJS)      │  │   (NestJS)     │  │    (Python / FastAPI)   │
│  Auth/Profiles │  │ Resume/Apps/   │  │  Orchestrator + 7 AI    │
│  Subscription  │  │ Job Listings   │  │  Agents (LangGraph)     │
└────────────────┘  └────────────────┘  └────────────────────────┘
                             │                    │
        └────────────────────┴────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  PostgreSQL │ Redis │ Elasticsearch │ Weaviate │ ClickHouse     │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      FILE STORAGE LAYER                          │
│           AWS S3 + CloudFront CDN + Supabase Storage             │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                       AI/ML LAYER                                │
│  Claude 4 (Anthropic)  LangChain/LangGraph  Weaviate  Whisper   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Tech Stack by Layer

#### Frontend
| Component | Technology | Why |
|---|---|---|
| Web Framework | **Next.js 14** (App Router) | SSR/SSG, API routes, React Server Components |
| Language | **TypeScript 5.x** | Type safety across full stack |
| UI Library | **shadcn/ui + Radix UI** | Accessible, customizable primitives |
| Styling | **Tailwind CSS 3.x** | Rapid, utility-first development |
| State Management | **Zustand 4.x** | Lightweight, minimal boilerplate |
| Forms | **React Hook Form + Zod** | Schema-driven validation |
| Charts | **Recharts 2.x** | Progress tracking visualizations |
| Mobile | **React Native (Expo)** | Cross-platform iOS/Android |
| Build Tool | **Vite 5.x** | Fast HMR for development |

#### Backend
| Component | Technology | Why |
|---|---|---|
| Runtime | **Node.js 20 LTS** | Async I/O, rich ecosystem |
| Framework | **NestJS 10.x** | Modular, decorator-based, DI |
| Language | **TypeScript 5.x** | Shared types via `@placementcopilot/types` |
| ORM | **Prisma 5.x** | Type-safe queries, migrations |
| Job Queue | **BullMQ** (Redis-backed) | Async processing |
| Real-time | **Socket.IO** | Live progress updates, interview WebSocket |
| AI Service | **Python + FastAPI** | Dedicated AI agent service |

#### Database
| Purpose | Technology |
|---|---|
| Primary DB | **PostgreSQL 16** (ACID, JSONB, RLS) |
| Session Cache | **Redis 7.2** (JWT denylist, rate limiting) |
| Job Search | **Elasticsearch 8.x** (full-text indexing) |
| Vector Store | **Weaviate 1.23** (semantic job-resume matching) |
| File Metadata | **Supabase Storage** |
| Analytics | **ClickHouse 24.x** (fast OLAP for dashboards) |

#### AI/ML Layer
| Component | Technology |
|---|---|
| Primary LLM | **Claude 4** (Anthropic API) |
| Agent Framework | **LangChain + LangGraph** |
| Observability | **LangSmith** |
| Vector Search | **Weaviate** |
| Embeddings | **Claude Embeddings / Voyage AI** |
| Speech-to-Text | **Whisper large-v3** |
| Text-to-Speech | **ElevenLabs API** |

#### Infrastructure & DevOps
| Component | Technology |
|---|---|
| Cloud | **AWS** (primary) + **Vercel** (frontend) |
| Containers | **Docker + Docker Compose** |
| Orchestration | **AWS ECS Fargate** |
| IaC | **Terraform** |
| CI/CD | **GitHub Actions** |
| Secrets | **AWS Secrets Manager** |
| Monitoring | **Datadog APM + Logs** |
| Error Tracking | **Sentry** |
| Feature Flags | **LaunchDarkly** |
| Load Testing | **k6** |

### 3.3 Data Models (Core Entities)

```
User ─────────────┐
  id (PK)         │
  email           │  Profile ──────────────┐
  passwordHash    │    userId (FK→User)    │  Resume ──────────────┐
  firstName       │    skills[]            │    userId (FK→User)    │
  lastName        │    experience[]        │    fileKey (S3)        │
  role            │    education[]          │    parsedData (JSONB)  │
  mfaEnabled      │    certifications[]     │    analysisResult      │
                  │    personality         │    isPrimary           │
                  └────────────────────────┘    version history       │
                                             └───────────────────────┘

JobListing ──────────────┐
  id (PK)               │  Application ────────────────────┐
  title                 │    userId (FK→User)              │  MockInterview ────────┐
  company               │    jobId (FK→JobListing)          │    userId (FK→User)     │
  requirements[]        │    resumeId (FK→Resume)           │    questions[]          │
  salaryMin/Max        │    status                        │    answers[]            │
  keywords[]           │    timeline[]                    │    scores (JSONB)       │
  embedding (vector)    │    aiScore                      │    feedback             │
  isActive             │    submittedAt                   │    status               │
                        └──────────────────────────────────┘    transcriptKey         │
                                                                 └──────────────────────┘

SkillGapAnalysis ───────────┐
  userId (FK→User)          │  Notification ─────────────┐
  targetRole                │    userId (FK→User)         │
  currentSkills[]           │    type                     │
  requiredSkills[]         │    title                    │
  gaps[] (JSONB)           │    body                     │
  overallReadinessScore     │    data (JSONB)             │
                            │    isRead                  │
                            └─────────────────────────────┘
```

### 3.4 API Design (30+ Endpoints)

```
AUTH:     POST /auth/register  POST /auth/login  POST /auth/refresh  POST /auth/logout
USERS:    GET  /users/me  PATCH /users/me  DELETE /users/me
PROFILES: GET  /profiles/:userId  POST /profiles  PATCH /profiles/:id
RESUMES:  POST /resumes/upload  GET /resumes  POST /resumes/:id/analyze
          POST /resumes/:id/optimize
JOBS:     GET  /jobs  GET /jobs/search  POST /jobs/saved
APPS:     POST /applications  GET /applications  PATCH /applications/:id
          GET  /applications/:id/timeline
INTERVIEW: POST /interviews/start  POST /interviews/:id/answer
           GET  /interviews/:id/feedback  GET /interviews/:id/transcript
SKILLS:   POST /skill-gaps/analyze  GET /skill-gaps/recommendations
PROGRESS: GET  /progress/dashboard  GET /progress/analytics  GET /progress/timeline
ADMIN:    POST /admin/users  GET /admin/users  PATCH /admin/users/:id/role
```

### 3.5 Security & Compliance

| Measure | Implementation |
|---|---|
| Auth | JWT (15-min access) + Redis refresh token denylist + Argon2id |
| Encryption | AES-256 at rest (S3 SSE-KMS), TLS 1.3 in transit |
| CORS | Strict origin allowlist |
| Prompt Injection | Input sanitization, structured output parsing with Zod |
| GDPR | Right to access, erasure, portability; data purged 30 days post-deletion |
| SOC 2 | Target Q4 2026 |

### 3.6 Scalability

- **Next.js (Frontend):** Vercel Edge — unlimited auto-scaling
- **NestJS Services:** AWS ECS Fargate — min 2 / max 50 instances
- **Python AI Services:** AWS ECS Fargate — max 20 instances
- **PostgreSQL:** RDS Multi-AZ + 5 read replicas
- **Redis:** ElastiCache cluster mode — 3 shards × 2 replicas
- **Load Shedding:** 100 req/min (free) / 1000 req/min (premium) at API Gateway
- **Circuit Breakers:** Envoy / NestJS Clutch for downstream failures
- **Target:** 100K concurrent users at launch; 500K+ during peak (Jan–May)

---

## 4. UX DESIGN SPECIFICATION

### 4.1 Design Philosophy: "Calm Confidence"

The platform reduces career anxiety by presenting complex career decisions as **clear, manageable steps**. The design feels like a trusted mentor — warm but authoritative, encouraging but honest, modern but not intimidating.

**7 Design Principles:**
| Principle | Application |
|---|---|
| Clarity First | One primary action per screen |
| Progress Visibility | Progress bars, breadcrumbs, completion indicators always prominent |
| Warm Professionalism | Warm undertones, rounded corners (8–16px), generous whitespace |
| Conversational Tone | Second-person, active copy. "Let's find your role" not "Submit" |
| Smart Defaults | AI pre-fills as much as possible |
| Mobile-Native | Phone-first design; desktop is enhanced layout |
| Accessibility Foundation | WCAG 2.1 AA from the start; keyboard nav, screen readers, high contrast |

### 4.2 Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Deep Teal | `#0D7377` | Primary buttons, CTAs, active states |
| Primary Light | Teal Mist | `#E8F6F6` | Hover states, selected backgrounds |
| Primary Dark | Ocean Depth | `#095456` | Button hover, pressed states |
| Accent | Warm Coral | `#FF6B35` | Urgent CTAs, notifications, Apply buttons, achievements |
| Accent Light | Peach Glow | `#FFF0EB` | Accent backgrounds, tip callouts |
| Secondary | Soft Lavender | `#7C6BB2` | Tags, skill pills, "In Progress" states |
| Background | Warm White | `#FAFAF8` | Main page backgrounds |
| Surface | Pure White | `#FFFFFF` | Cards, modals, inputs |
| Text Primary | Charcoal | `#1A1A2E` | Headings, body |
| Text Secondary | Slate | `#5C5C6D` | Subtitles, captions, helper text |
| Success | Fresh Green | `#22C55E` | Completed milestones, "Matched" |
| Warning | Amber | `#F59E0B` | Warnings, expiring deadlines |
| Error | Soft Red | `#EF4444` | Errors, failed states |
| Border | Whisper | `#E8E8E6` | Card borders, dividers |

### 4.3 Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Display (H1) | Plus Jakarta Sans | 700 | 32px / 40px desktop |
| H2 | Plus Jakarta Sans | 700 | 24px / 32px desktop |
| H3 | Plus Jakarta Sans | 600 | 20px / 24px desktop |
| Body | DM Sans | 400 | 15px / 17px large |
| Body Small | DM Sans | 400 | 13px |
| Label | DM Sans | 500 | 14px |
| Button | DM Sans | 600 | 15px |
| Code | JetBrains Mono | 400 | 14px |

### 4.4 Information Architecture

```
PLACEMENT COPILOT AI
├── Dashboard (/)
│   ├── Quick Stats (Apps, Interviews, Match Score, Skills)
│   ├── Primary CTA Banner (personalized next action)
│   ├── Active Applications Widget
│   ├── Upcoming Interviews Widget
│   └── Role Recommendations Strip
├── Role Discovery (/roles)
│   ├── Search & Filters
│   ├── Role Cards (Grid/List toggle)
│   └── Saved Roles
├── Role Detail (/roles/:roleId)
│   ├── Overview Tab (description, company, match %)
│   ├── Requirements Tab (skills, education, experience)
│   ├── Salary & Benefits Tab
│   └── Application Prep Tab (AI tips, resume match, checklist)
├── Resume Lab (/resume)
│   ├── Template Picker
│   ├── Section Editor (AI-assisted)
│   ├── Keyword Optimizer
│   └── Preview & Export (PDF/DOCX)
├── Mock Interview Hub (/interview)
│   ├── Interview Types (Behavioral, Technical, Case, Peer)
│   ├── Session Interface (full-screen, distraction-free)
│   ├── Feedback Report (per-question + overall)
│   └── Session History
├── Application Tracker (/applications)
│   ├── Kanban Board (Wishlist → Applied → Screening → Interview → Offer)
│   ├── List View
│   └── Timeline View
├── Skill Gap Analyzer (/skills)
│   ├── Gap Assessment
│   ├── Radar Chart (skills vs. role requirements)
│   ├── Learning Path Builder
│   └── Resource Library
└── Settings (/settings)
    ├── Profile
    ├── Notifications
    ├── Resume & Documents
    ├── Integrations (LinkedIn, Calendar)
    ├── Privacy & Data
    └── Help & Support
```

### 4.5 Navigation

**Mobile:** Bottom navigation bar (5 items, 64px tall)
1. Dashboard (Home)
2. Roles (Briefcase)
3. Applications (Clipboard)
4. Practice (Chat bubble)
5. Profile (Person)

**Desktop:** Left sidebar (240px, collapsible to 64px icon-only)

### 4.6 Key Pages Breakdown

#### Dashboard
- Dynamic greeting: "Good morning, [Name]" + streak counter
- 4 stat cards: Applications, Interviews, Match Score, Skills progress
- Personalized CTA banner (Warm Coral)
- Active applications list + upcoming interviews + role recommendations
- Weekly progress bar chart

#### Onboarding (5-step Wizard)
| Step | Content | UX |
|---|---|---|
| 1 | Intent selector (3 illustrated cards) | Single-tap selection |
| 2 | About You (name, role, experience, education) | Floating labels, staggered entrance animation |
| 3 | Target Roles (tag input, industry chips, work style) | Multi-select with search |
| 4 | Resume/LinkedIn upload (optional) | Drag-and-drop with AI parse |
| 5 | Preferences (notifications, dashboard focus) | Toggle switches |

#### Mock Interview Session
- Full-screen, distraction-free
- Timer (mm:ss) + question counter
- Question card (large, readable)
- Text or voice input (Whisper transcription)
- Real-time feedback after each answer
- Post-session: animated score reveal + detailed breakdown + suggested follow-up

#### Application Tracker
- **Kanban columns:** Wishlist → Applied → Screening → Technical → Interviews → Offer → Rejected → Declined
- Drag-and-drop cards between columns
- Swipe gestures (right = advance, left = archive)
- Stats strip: response rate, interview rate, offer rate

### 4.7 Key User Flows

```
FLOW 1 — NEW USER:
Landing → Sign Up → Onboarding (5 steps) → AI Processing → Dashboard Reveal
→ Role Discovery → Role Detail → Apply / Save

FLOW 2 — DAILY ACTIVE USER:
App Open → Dashboard → [Check Applications / Practice Interview / Browse Roles / Close Skill Gaps]

FLOW 3 — APPLICATION PIPELINE:
Role Discovery → Role Detail → Apply → Resume Builder (auto-populated)
→ Tracker (auto-created) → Status Updates → Interview Scheduled
→ Interview Prep → Offer → Celebration

FLOW 4 — SKILL GAP CLOSURE:
Skill Analyzer → Select Target Role → Gap Assessment → Start Learning
→ Track Progress → Gap Score Increases → New Roles Unlock
```

### 4.8 States Design

| State Type | Design |
|---|---|
| **Loading** | Skeleton screens (shimmer animation on `#E8E8E6`), spinner for buttons |
| **Empty** | Illustration + headline + subtext + primary CTA |
| **Error** | Friendly illustration + headline + subtext + "Try again" CTA |
| **Success** | Animated checkmark + headline + next action CTA |
| **AI Processing** | "Generating..." inline spinner + descriptive text |

### 4.9 Accessibility (WCAG 2.1 AA)

- Contrast ratios: 4.5:1 (normal text), 3:1 (large text/UI)
- Focus indicators: 3px teal ring on all interactive elements
- Screen readers: Semantic HTML, ARIA landmarks, `aria-live` for dynamic updates
- Motion: `prefers-reduced-motion` respected; replace animations with instant transitions
- Forms: Descriptive labels, inline errors with `role="alert"`, success confirmations with `role="status"`
- Touch targets: Minimum 44×44px on mobile

---

## 5. FEATURE SPECIFICATIONS (DEEP DIVE)

### Feature 1: User Profiling System

**What it does:** Captures a comprehensive, multi-dimensional profile of each user through a guided 5-step wizard.

| Aspect | Detail |
|---|---|
| **User Flow** | Sign up → Intake questionnaire → Document upload → Skill self-assessment → Personality quiz → Interest mapping → Profile review |
| **Inputs** | Name, email, education history, work experience, certifications, uploaded transcripts, skill ratings (1-5), personality questionnaire responses |
| **Processing** | OCR + LLM academic parser, skill normalization to canonical taxonomy, Big Five personality scoring, interest heatmap generation |
| **Outputs** | Consolidated Profile Object, Profile Completeness Score (%), Normalized Skill Vector, Personality Trait Report, Interest Heatmap |
| **Success Criteria** | >= 80% completeness within 15 min of signup; >= 90% OCR extraction accuracy |
| **Edge Cases** | Missing transcripts → manual entry prompt; ambiguous OCR → user confirmation; duplicate profiles → merge prompt |

---

### Feature 2: Placement Probability Scoring Engine (PPSE)

**What it does:** Evaluates a user's likelihood of securing a specific role at a specific company, producing a 0-100% probability score with confidence indicators.

| Aspect | Detail |
|---|---|
| **User Flow** | Enter/select target role → (optional) select company → System retrieves profile → Fetches role requirements → Scoring engine computes score → Results with breakdown displayed |
| **Inputs** | User profile (skills, education, experience), target role data, target company, market data, historical placement patterns |
| **Processing** | Cosine similarity (skill vectors), company-role fit scoring, gap analysis, weighted probability formula |
| **Formula** | `Base 0.30 + Skill Match (0-0.30) + Experience (0-0.20) + Education (0-0.10) + Culture Fit (0-0.05) + Market Bonus (0-0.05)` |
| **Outputs** | Placement Probability Score (0-100%), Confidence Indicator (Low/Medium/High), Score Breakdown Card, Gap Analysis List (Critical/Important/Nice-to-Have), Comparative role bar chart, Action CTAs |
| **Success Criteria** | Score generated in < 5s; Gap analysis identifies >= 80% of role-critical skills |
| **Edge Cases** | Unknown role → LLM maps to known taxonomy; incomplete profile (<< 60%) → block scoring with guidance |

---

### Feature 3: Resume Optimizer

**What it does:** Parses uploaded resumes, scores them against ATS criteria, rewrites content with AI, and generates role-tailored versions.

| Aspect | Detail |
|---|---|
| **User Flow** | Upload resume → Parse document → Select target role/JD → ATS Scoring → Keyword optimization → Rewrite suggestions → Review (diff view) → Generate tailored version → Download |
| **Inputs** | Resume file (PDF/DOCX/TXT, max 5MB), target role/JD, user profile, ATS rules database |
| **Processing** | Section extraction (Contact, Summary, Experience, Education, Skills), ATS scoring (Header 0-30 + Keyword density 0-40 + Format 0-20 + Length 0-10), LLM rewriting, keyword injection |
| **Outputs** | ATS Score Card (0-100), Keyword Gap Report, AI Rewrite Suggestions (side-by-side diff), Role-Tailored Resume (PDF/DOCX), Format Validation Report |
| **Success Criteria** | ATS score improves >= 15 points post-optimization; Keyword coverage >= 80%; Processing <= 10s |
| **Edge Cases** | Corrupt PDF → clear error + re-upload prompt; non-English → flag + offer translation; no JD provided → general ATS best practices scoring |

---

### Feature 4: Mock Interview System

**What it does:** AI-powered mock interview platform with role-specific questions, real-time evaluation, and detailed performance feedback.

| Aspect | Detail |
|---|---|
| **User Flow** | Select interview type (Behavioral/Technical/Case/System Design) → Select role + company → Choose difficulty → Generate session → Answer questions (text or voice) → Real-time feedback per question → Full report + improvement plan → Track score trends |
| **Inputs** | Interview config (type, role, difficulty), question bank (curated + AI-generated), user profile, previous session history |
| **Processing** | Question selection (filter + pacing + spaced repetition + weakness targeting), LLM questioning with conversational tone, STAR/technical evaluation frameworks, speech-to-text (Whisper), feedback generation |
| **Scoring** | `Overall = Behavioral×0.25 + Technical×0.35 + Communication×0.20 + Confidence×0.20` |
| **Outputs** | Real-time per-question feedback, Full Session Report (score 0-100, grade A-F, per-dimension breakdown, time per question), Improvement Recommendations, Comparative Score History, Model Answer Reference |
| **Success Criteria** | Evaluation within 3s of submission; report within 5s of session end; >= 90% question relevance |
| **Edge Cases** | Voice failure → text fallback; empty answer → retry prompt; session timeout → partial save + resume; question bank gap → AI-generate dynamic question (flagged) |

---

### Feature 5: Skill Gap Analyzer

**What it does:** Maps current skills against target role requirements, quantifies gaps, and generates a prioritized learning roadmap with curated resources.

| Aspect | Detail |
|---|---|
| **User Flow** | Navigate to analyzer → Select target role → Gap detection → Gap prioritization → Resource surfacing → Review + toggle gaps → Generate learning roadmap → Track progress → Score updates |
| **Inputs** | Normalized skill vector (from Feature 1), target role requirements, market demand data, learning resource catalog (Coursera, Udemy, edX, YouTube), user availability |
| **Processing** | Diff skill vectors, gap categorization (MISSING/WEAK/STALE), severity scoring, resource matching with composite ranking, roadmap generation respecting time budget |
| **Priority Formula** | `Gap Priority = Role_Criticality×0.40 + Market_Demand×0.20 + Learning_Ease×0.15 + Time_Investment×0.15 + Career_Lift×0.10` |
| **Outputs** | Gap Dashboard (total gaps, critical count, projection), Prioritized Gap List, Resource Recommendations (top 3 per gap), Learning Roadmap (interactive timeline), Probability Impact Preview, Alternative Skill Suggestions |
| **Success Criteria** | Gap analysis <= 5s; no false negatives on critical skills; resources are valid and accessible |
| **Edge Cases** | No target role → prompt + show sample; perfect match → celebrate + suggest stretch goals; no resource match → flag as "Limited Resources" |

---

### Feature 6: Application Guidance Engine

**What it does:** End-to-end application intelligence — company research, application planning, material generation, networking, and interview prep triggers.

| Aspect | Detail |
|---|---|
| **User Flow** | Add target company → Company research brief → Application timeline generation → Cover letter generation → Networking suggestions → Interview prep triggers on status change → Reminders and nudges |
| **Inputs** | Target company name, user profile, application materials (resumes, cover letters), company database, job listing data, LinkedIn connections, event calendar |
| **Processing** | Company brief aggregation + news scraping, backward timeline from deadline, LLM cover letter generation (3-paragraph structured), LinkedIn connection scoring + outreach templates, interview prep staging on status change |
| **Outputs** | Company Brief (1-page summary), Application Timeline (Gantt/checklist), Cover Letter Draft (formatted, unique per application), Networking Shortlist + Templates, Interview Prep Trigger Card, Per-Company Checklist |
| **Success Criteria** | Brief <= 3s; cover letter unique per application; >= 1 networking suggestion where available; checklist updated within 60s of status change |
| **Edge Cases** | Company not in DB → web research; no LinkedIn → prompt to connect or skip; expired listing → flag + re-plan prompt |

---

### Feature 7: Progress Tracking System

**What it does:** Unified tracking dashboard monitoring all dimensions of the placement journey with visual summaries and motivational feedback.

| Aspect | Detail |
|---|---|
| **User Flow** | Open dashboard → Aggregate all feature data → Render visual summaries → Drill into any area → Milestone detection → Motivational messages → Periodic digest notifications → Export reports |
| **Inputs** | Application statuses, interview results, skill progress, probability score history, user engagement data |
| **Processing** | Status tracking with timestamps + conversion rates, trend visualization (line/radar/funnel charts), milestone detection (rule-based), motivational feedback engine (LLM, context-aware), analytics computation |
| **Analytics** | Response rate, offer conversion rate, avg interview score, skill coverage delta, time-to-offer projection |
| **Outputs** | Progress Dashboard (summary cards, pipeline funnel, activity timeline), Milestone Badges, Motivational Messages, Analytics Export (CSV/PDF), Goal Tracker |
| **Success Criteria** | Dashboard loads <= 3s; data reflected <= 60s of event; milestone detection <= 5s; messages are context-relevant |
| **Edge Cases** | No applications → "Getting Started" guide; all rejected → empathetic message + Resume Review trigger; disengagement detected → gentle re-engagement nudge |

---

## 6. MULTI-AGENT SYSTEM DESIGN

### 6.1 Agent Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  CENTRAL ORCHESTRATOR                       │
│  Intent Classification │ Request Routing │ Context Store    │
│  Cross-Agent Workflows │ Error Handling │ Session Manager  │
└─────────────────────────────┬───────────────────────────────┘
                              │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│   PROFILE AGENT │  │  SCORING AGENT  │  │  RESUME AGENT   │
│  (Sonnet)       │  │   (Sonnet)      │  │   (Opus)        │
│  Profile Build  │  │  PPS Scoring   │  │  ATS Optimization│
│  Skill Taxonomy │  │  Gap Analysis  │  │  Keyword Inject │
│  Document Parse │  │  Role Matching │  │  Format Rewrite │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  INTERVIEW      │  │  SKILL GAP      │  │ APPLICATION     │
│   AGENT (Opus)  │  │   AGENT (Sonnet)│  │  AGENT (Sonnet)  │
│  AI Interviewer │  │ Gap Detection   │  │ Company Research│
│  STAR Evaluation│  │ Learning Paths  │  │ Cover Letters   │
│  Feedback Gen   │  │ Resource Match  │  │ Networking      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │  TRACKING AGENT    │
                   │   (Sonnet)         │
                   │  Progress Monitor │
                   │  Milestone Detect │
                   │  Analytics Engine │
                   └───────────────────┘
```

### 6.2 Individual Agent Definitions

| Agent | Primary Role | Key Tools | Primary Output |
|---|---|---|---|
| **Profile Agent** | Build & maintain user profile | OCR, skill taxonomy mapping, personality scoring | Consolidated Profile Object, Skill Vector |
| **Scoring Agent** | Placement probability calculation | Cosine similarity, gap analysis, market data | PPS Score, Gap Analysis, Breakdown |
| **Resume Agent** | Resume parsing, scoring, rewriting | Document parser, ATS checker, LLM rewriter | ATS Score, Rewrite Suggestions, Tailored Resume |
| **Interview Agent** | Conduct & evaluate mock interviews | Question bank, Whisper STT, STAR framework | Session Report, Feedback, Score Trends |
| **Skill Gap Agent** | Identify gaps, generate learning paths | Gap detection, resource matching, roadmap gen | Gap Dashboard, Learning Roadmap |
| **Application Agent** | Guide applications, generate materials | Company research, cover letter LLM, networking | Company Brief, Cover Letter, Timeline |
| **Tracking Agent** | Monitor progress, detect milestones | Metrics engine, visualization gen, notification | Dashboard, Badges, Analytics Export |

### 6.3 Orchestrator Responsibilities

1. **Intent Classification:** Parse user request → route to correct agent(s)
2. **Context Management:** Shared context store — agents read/write user state without redundant fetches
3. **Cross-Agent Workflows:** Chain agents for complex tasks (e.g., "Apply to Google SWE" → Profile → Scoring → Skill Gap → Resume → Application → Tracking)
4. **Error Propagation:** Catch agent failures, log, return graceful error without crashing session
5. **Rate Limiting:** Prevent any single agent from being overwhelmed
6. **Session Management:** Maintain conversation history and user session state

### 6.4 Communication Patterns

| Pattern | Use Case | Mechanism |
|---|---|---|
| **Request-Response** | Simple queries ("Score my profile for X role") | REST POST with JSON |
| **Fan-Out** | Gap analysis needs Profile + Scoring + Market data simultaneously | Orchestrator → parallel agent calls |
| **Fan-In** | Full session report combines Interview + Tracking | Multiple agents → Orchestrator assembles |
| **Event-Driven** | Application status change triggers Interview Prep | Agent emits event → subscribed agents react |
| **Sequential Chain** | "Apply to company" → Profile → Scoring → Gap → Resume → App → Track | Ordered agent pipeline |

### 6.5 Agent I/O Contracts

**Orchestrator Input:**
```json
{
  "userId": "uuid",
  "intent": "RESUME_OPTIMIZE",
  "payload": {
    "resumeId": "uuid",
    "targetRole": "Senior Software Engineer",
    "targetCompanies": ["Google", "Meta"]
  },
  "sessionId": "uuid",
  "streaming": true
}
```

**Orchestrator Output (SSE stream):**
```
event: agent_start
data: {"agent": "ResumeAgent", "phase": "parsing"}

event: agent_progress
data: {"agent": "ResumeAgent", "progress": 0.3, "message": "Extracting work experience..."}

event: agent_progress
data: {"agent": "ResumeAgent", "progress": 0.7, "message": "Optimizing ATS keywords..."}

event: agent_complete
data: {"agent": "ResumeAgent", "output": {"optimizedResumeKey": "...", "score": 87}}

event: final
data: {"summary": "...", "nextActions": [...]}
```

### 6.6 Cross-Feature Integration Map

| Triggering Feature | Triggers | Condition |
|---|---|---|
| User Profiling | Placement Probability Scoring | Profile completeness >= 60% |
| Scoring Engine | Skill Gap Analyzer | Score < 70% |
| Scoring Engine | Resume Optimizer | ATS score < 80% |
| Resume Optimizer | Application Guidance | After resume version saved |
| Application Engine | Mock Interview System | Application status = "Interview" |
| Mock Interview | Progress Tracking | After every session |
| Skill Gap Analyzer | Progress Tracking | After learning milestone |
| Any Feature | Progress Tracking | On any state change |

---

## 7. ROADMAP & PHASING

### Phase 1 — Foundation (MVP) — Months 1–4

| Feature | Priority | Definition of Done |
|---|---|---|
| Onboarding & Profiling | P0 | 5-step wizard functional, completeness score working |
| Placement Probability Score | P0 | All 5 dimensions live |
| Resume Builder (Basic) | P0 | Single template, PDF export, manual editing |
| Basic Dashboard | P0 | Score card, task summary, progress overview |
| User Authentication | P0 | Email/password + Google OAuth |

### Phase 2 — Execution — Months 5–7

| Feature | Priority | Definition of Done |
|---|---|---|
| Resume Optimization Engine | P0 | ATS analysis, keyword injection, multi-version |
| Mock Interview System | P0 | 3 interview types, 200+ question bank |
| Skill Gap Analysis | P1 | Live job posting analysis, radar chart |
| Application Tracker | P0 | Kanban board, status updates, timeline view |
| Personalized Roadmaps | P1 | Auto-generated, task notifications, calendar sync |

### Phase 3 — Intelligence — Months 8–10

| Feature | Priority | Definition of Done |
|---|---|---|
| Dynamic Roadmap Adjustment | P0 | Plan updates based on PPS changes |
| Advanced Skill Gap Analysis | P0 | MOOC integration, certification tracking |
| Counselor Dashboard | P1 | Cohort analytics, at-risk flags |
| Placement Outcome Logging | P0 | Offer tracking, outcome analytics |
| Analytics & Insights Engine | P1 | Trend analysis, benchmarks |

### Phase 4 — Scale — Months 11–14

| Feature | Priority | Definition of Done |
|---|---|---|
| Mobile App (iOS + Android) | P0 | Feature parity with web |
| Institutional LMS Integration | P1 | API-based SSO with university systems |
| Premium Subscription Tiers | P0 | Free / Pro / Institution tiers |
| Community Features | P2 | Peer mock interviews, mentorship matching |
| Advanced Analytics & Reporting | P1 | Custom reports, data exports, API access |

---

## 8. SUCCESS METRICS & KPIs

### Product Metrics

| Metric | Target (6 Months Post-Launch) |
|---|---|
| Monthly Active Users (MAU) | 50,000 |
| User Retention (90-day) | 40% |
| Placement Rate (active users with offers) | 25% |
| Average PPS Improvement | +15 points in 30 days |
| Mock Interview Completion Rate | 60% complete 3+ sessions |
| Resume Download Rate | 50% export at least 1 resume |

### Operational Metrics

| Metric | Target |
|---|---|
| Platform Uptime | 99.9% |
| Support Resolution Time | < 24 hours |
| NPS Score | > 40 |
| Churn Rate (Pro tier) | < 5% monthly |

### Growth Metrics

| Metric | Target |
|---|---|
| Viral Coefficient (K-factor) | > 0.5 |
| Organic vs. Paid Mix | 60/40 |
| Institution Sign-ups | 50 by month 12 |

### Non-Functional Requirements

| Requirement | Target |
|---|---|
| Dashboard load time | < 2 seconds on 4G |
| PPS calculation | < 5 seconds |
| Resume generation | < 10 seconds per version |
| Interview evaluation | < 3 seconds per question |
| API P99 latency | < 500ms |
| Concurrent users at launch | 100,000 |
| Peak season capacity | 500,000+ |
| GDPR/CCPA compliance | Required at launch |
| SOC 2 Type II | Target Q4 2026 |

---

## 9. TEAM STRUCTURE & AGENT RESPONSIBILITIES

### Development Team Structure

```
PLACEMENT COPILOT AI — DEVELOPMENT TEAM
│
├── PRODUCT TEAM
│   ├── Product Manager (roadmap, prioritization, stakeholder alignment)
│   ├── UX/UI Designer (wireframes, design system, user flows)
│   └── Tech Writer / Technical PM (API docs, agent contracts, spec maintenance)
│
├── ENGINEERING TEAM
│   ├── Frontend Engineer(s) (Next.js 14, React Native, shadcn/ui)
│   ├── Backend Engineer(s) (NestJS, TypeScript, Prisma, PostgreSQL)
│   ├── AI/ML Engineer(s) (Python, FastAPI, LangChain, LangGraph, Claude API)
│   ├── DevOps / Platform Engineer (AWS ECS, Terraform, GitHub Actions, Datadog)
│   └── QA / Test Engineer (Playwright, unit tests, integration tests)
│
├── DATA TEAM
│   ├── Data Engineer (Elasticsearch, Weaviate, ClickHouse pipelines)
│   └── Data Analyst (metrics, dashboards, cohort analysis)
│
├── AI AGENT TEAM (Orchestrated by Orchestrator Agent)
│   ├── Profile Agent → (Multi-dimensional profiling, skill taxonomy)
│   ├── Scoring Agent → (PPS calculation, gap analysis)
│   ├── Resume Agent → (ATS optimization, rewriting)
│   ├── Interview Agent → (Mock interviews, real-time evaluation)
│   ├── Skill Gap Agent → (Gap detection, learning paths)
│   ├── Application Agent → (Company research, cover letters, networking)
│   └── Tracking Agent → (Progress monitoring, milestones, analytics)
│
└── BUSINESS / GROWTH
    ├── Growth / Marketing (user acquisition, activation, retention)
    └── Sales / Partnerships (institutional deals, university integrations)
```

### Agent → Developer Mapping (AI Features)

| AI Agent | Primary Developer | Secondary |
|---|---|---|
| Profile Agent | AI/ML Engineer | Frontend Engineer |
| Scoring Agent | AI/ML Engineer | Backend Engineer |
| Resume Agent | AI/ML Engineer + Frontend | Backend Engineer |
| Interview Agent | AI/ML Engineer | Frontend Engineer |
| Skill Gap Agent | AI/ML Engineer | Data Engineer |
| Application Agent | AI/ML Engineer | Frontend Engineer |
| Tracking Agent | Frontend Engineer | Data Analyst |
| Orchestrator | AI/ML Engineer | Backend Engineer |

---

## APPENDIX

### Glossary

| Term | Definition |
|---|---|
| **PPS** | Placement Probability Score — composite 0-100 score of placement likelihood |
| **ATS** | Applicant Tracking System — employer software for screening job applications |
| **STAR** | Situation, Task, Action, Result — structured behavioral interview technique |
| **MOOC** | Massive Open Online Course (Coursera, Udemy, LinkedIn Learning) |
| **K-factor** | Viral coefficient measuring new users per existing user |
| **BFF** | Backend-for-Frontend — API aggregation pattern |
| **RAG** | Retrieval-Augmented Generation — grounding LLM responses in external data |

### Assumptions

- Target market: English-speaking, initial launch in India, US, and UK
- Primary device: smartphone-first design
- Institutional adoption (universities) will precede individual student scaling
- AI model capability sufficient for high-quality interview feedback and resume optimization at launch

### Dependencies

- Claude API (Anthropic) — primary AI engine
- Job board data providers (Indeed, LinkedIn, Glassdoor) — job aggregation
- MOOC platform APIs — course recommendations
- University TPO systems — LMS integration targets
- Email provider (SendGrid/AWS SES) — notifications

### Out of Scope (v1.0)

- Salary negotiation coaching beyond general guidance
- Direct job application submission (no bot applications)
- Professional networking graph beyond application tracking
- Mental health / career counseling (human counselor referral only)
- Placement guarantee or financial outcome assurance

---

**End of Comprehensive Report**

*This document was collaboratively generated by a 4-agent team (PRD Writer, System Architect, UI/UX Designer, Feature Spec Writer), coordinated by an Orchestrator agent. All sections are interlinked and should be read together as a unified blueprint for implementation.*
