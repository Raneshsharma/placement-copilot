# Placement Copilot AI - Future Features

> **Version:** 1.0
> **Date:** 2026-04-10
> **Status:** Planned / Not Yet Implemented
> **Author:** Requirements Agent

This document lists features that are planned per the existing documentation (README.md, FEATURES.md, comprehensive report) but have not yet been implemented in the codebase. Each entry includes the planned behavior, current status, and what is needed to implement it.

---

## Table of Contents

1. [User Profiling & Assessment](#1-user-profiling--assessment)
2. [Placement Probability Scoring Engine](#2-placement-probability-scoring-engine)
3. [Smart Resume Builder](#3-smart-resume-builder)
4. [Mock Interview Engine](#4-mock-interview-engine)
5. [Role Matching & Job Search](#5-role-matching--job-search)
6. [Application Tracker Enhancements](#6-application-tracker-enhancements)
7. [Skill Gap Analysis Enhancements](#7-skill-gap-analysis-enhancements)
8. [Progress & Analytics](#8-progress--analytics)
9. [Notifications](#9-notifications)
10. [Multi-Agent Orchestration](#10-multi-agent-orchestration)
11. [Infrastructure & DevOps](#11-infrastructure--devops)
12. [Security & Compliance](#12-security--compliance)

---

## 1. User Profiling & Assessment

### 1.1 Resume Parsing (OCR + AI)

**Planned:** Users upload PDF/image transcripts and resumes. AI parses them using OCR + LLM to extract GPA, coursework, institution ranking, degree type, graduation year, work experience entries (company, title, duration, description), certifications, and languages.

**Current Status:** Onboarding step 4 shows a file upload area but the file is stored in state only. The "Analyze My Resume" button shows a placeholder alert. No OCR or AI parsing is connected.

**Needed:**
- Connect upload to `POST /api/profile/resume`
- Wire NestJS `ResumesService.upload()` to trigger AI service `POST /api/v1/resume/analyze`
- Implement OCR preprocessing (Tesseract or cloud OCR API)
- Parse extracted text through AI service's profile agent
- Update profile with parsed data and show confirmation

### 1.2 Skill Self-Assessment

**Planned:** Interactive skill rating interface where users rate proficiency 1-5 across technical and soft skills. Ratings map to canonical taxonomy (e.g., "React.js" → `frontend_framework:react`). Aggregate duplicates and normalize to proficiency levels.

**Current Status:** No dedicated skill assessment UI. Skills are entered as free-form tags in the Resume Builder's Skills tab.

**Needed:**
- New `/assessment/skills` page with skill categories and rating UI
- Canonical skill taxonomy database
- AI-powered skill suggestions from free-text input
- Proficiency level persistence to profile

### 1.3 Personality Assessment

**Planned:** Career-personality alignment questionnaire (Big Five / OCEAN-adjacent). Results mapped to career-fit vectors. Shown as personality trait report in profile.

**Current Status:** Not started.

**Needed:**
- New questionnaire page with validated personality questions
- Scoring engine implementing OCEAN model
- Career-fit mapping (high Openness → creative roles, high Conscientiousness → structured roles)
- Visual personality trait report component

### 1.4 Interest Mapping

**Planned:** Hierarchical taxonomy for industries/roles (Tech → FinTech → Payments). Weight preferences by priority. Shown as interest heatmap in profile.

**Current Status:** Onboarding step 3 captures target roles and industries as simple arrays.

**Needed:**
- Hierarchical taxonomy database
- Drag-to-rank interest ordering UI
- Interest heatmap visualization component
- Weight and confidence score computation

---

## 2. Placement Probability Scoring Engine

### 2.1 Multi-Factor Probability Score

**Planned:** PPS = 0.30 base + Skill Match (0-0.30) + Experience Relevance (0-0.20) + Education Fit (0-0.10) + Culture Fit (0-0.05) + Market Bonus (0-0.05). Cosine similarity between user skill vector and required skill vector.

**Current Status:** Dashboard shows a PPS ring with hardcoded `ppsScore: 78` and a static `ppsBreakdown` object. No real computation.

**Needed:**
- Implement scoring algorithm in `ScoringAgent`
- Connect `GET /api/progress/pps` to real scoring engine
- Skill vector computation from user profile
- Role requirement vector retrieval from job database
- Confidence indicator based on data completeness

### 2.2 Gap Analysis Module

**Planned:** Identify missing skills, certifications, or experience gaps. Score severity (critical vs. nice-to-have). Suggest specific improvements.

**Current Status:** Skills page shows hardcoded gap list with static severity tags.

**Needed:**
- Connect gap analysis to `POST /api/v1/skill-gap/analyze`
- Severity scoring algorithm
- Gap visualization in dashboard
- CTA links to Skill Gap Analyzer and Resume Optimizer

### 2.3 Comparative Role View

**Planned:** Score comparison across multiple roles in a bar chart. Compare current profile against desired roles side-by-side.

**Current Status:** Not started.

**Needed:**
- Score comparison chart component
- Multi-role selection UI
- Real-time score updates as profile changes

---

## 3. Smart Resume Builder

### 3.1 Multi-Version Resume Management

**Planned:** Multiple resume versions tailored to specific target roles. Version history with diff view. Version comparison.

**Current Status:** Single resume in state. No versioning. Resume Builder shows all sections in one view.

**Needed:**
- `GET /api/resumes` for version list
- Version selector UI with create/delete/rename
- Version comparison (side-by-side diff)
- Role-specific version naming

### 3.2 ATS Scoring Engine

**Planned:** Score 0-100 across dimensions: Header detection (0-30), Keyword density (0-40), Format compatibility (0-20), Length optimization (0-10). Per-dimension breakdown displayed.

**Current Status:** Resume Builder has "ATS Optimization" button but it calls a basic `/optimize` endpoint. No per-dimension scoring is shown.

**Needed:**
- Full ATS scoring in `ResumeAgent`
- Per-dimension score card component
- Format validation (anti-pattern detection)
- Improvement suggestions per dimension

### 3.3 Keyword Optimization with Diff View

**Planned:** TF-IDF + synonym matching between resume and job description. Side-by-side diff showing original vs. suggested bullet points. Accept/reject per suggestion.

**Current Status:** Optimized text is returned but displayed as a full replacement, not a diff.

**Needed:**
- Diff view component (original vs. suggested bullets)
- Accept/reject individual suggestions
- Keyword gap report table
- Natural keyword injection (not just appending a keyword list)

### 3.4 PDF/DOCX Generation

**Planned:** Generate downloadable PDF and DOCX from the resume builder with proper formatting. Support all 4 templates with distinct styling.

**Current Status:** Download buttons call endpoints that may not generate actual files.

**Needed:**
- Document generation service (e.g., `docx` library for DOCX, `puppeteer` or `react-pdf` for PDF)
- Template-to-styled-document rendering
- Cloud storage for generated files (S3/GCS)
- Proper MIME types and file naming

---

## 4. Mock Interview Engine

### 4.1 Full Question Bank

**Planned:** 7 interview types: Technical, Behavioral, System Design, LeetCode, Case Study, Mixed, Situational Judgement. Curated questions with metadata (category, difficulty, role tags, company tags).

**Current Status:** 3 interview types (Behavioral, Technical, Mixed) with hardcoded cards. No question bank.

**Needed:**
- Question database with full metadata
- Dynamic question selection algorithm
- Company-specific question filtering
- Spaced repetition logic (avoid repeat questions)

### 4.2 Real-Time AI Interviewer

**Planned:** LLM-powered conversational interview. Natural follow-up questions based on user responses. Support for clarification questions from user. Dynamic pacing (easy→medium→hard).

**Current Status:** `POST /api/interviews/start` exists but the session interface is not fully wired. Questions are selected but not generated conversationally.

**Needed:**
- WebSocket connection between Next.js and NestJS (Socket.IO gateway)
- Streaming question presentation (token-by-token)
- Context-aware follow-up generation
- Dynamic question difficulty adjustment

### 4.3 Answer Evaluation with STAR Framework

**Planned:** Score behavioral answers against STAR framework (Situation, Task, Action, Result). Technical answers scored for correctness, edge cases, time complexity. Real-time per-question feedback with specific tips.

**Current Status:** `POST /api/interviews/{id}/answer` endpoint exists but evaluation logic is minimal.

**Needed:**
- Full STAR evaluation in `InterviewAgent`
- Per-dimension scoring (Behavioral, Technical, Communication, Confidence)
- Real-time feedback rendering in session interface
- Model answer reference post-session

### 4.4 Score Trend Tracking

**Planned:** Line chart showing interview scores over time. Session history with score breakdown per dimension. Improvement recommendations based on trend.

**Current Status:** Past sessions show as cards with a single score number. No trend visualization.

**Needed:**
- Time-series chart component (using Recharts or similar)
- Per-dimension score history
- Trend analysis (improving/declining/stable)
- Personalized practice recommendations based on weak dimensions

### 4.5 Interview Session History

**Planned:** View past sessions, re-attempt with new question sets, review model answers. Filter by interview type, company, date.

**Current Status:** Basic session list with score ring.

**Needed:**
- Filterable session history
- Model answer display after session end
- Session re-attempt with different questions
- Session tagging (by company, by type)

---

## 5. Role Matching & Job Search

### 5.1 Elasticsearch Integration

**Planned:** Full-text and semantic job search using Elasticsearch. Filter by location, salary, experience level, skills, company. Relevance scoring based on user profile.

**Current Status:** `GET /api/jobs` returns mock data. No Elasticsearch.

**Needed:**
- Elasticsearch cluster setup (docker-compose includes it)
- Index job listings in Elasticsearch
- Query DSL for search with filters
- Relevance scoring using user skill vector

### 5.2 Weaviate Vector Search

**Planned:** Semantic job-resume matching using Weaviate vector embeddings. Match % based on vector cosine similarity. Personalized ranking.

**Current Status:** Docker-compose includes Weaviate but it is not wired.

**Needed:**
- Weaviate schema setup
- Embed user profiles and job listings as vectors
- Cosine similarity search
- Hybrid search (keyword + vector)

### 5.3 Role Recommendations Engine

**Planned:** AI-powered personalized role recommendations. Score based on profile vs. job requirements. Exclude already-applied roles. Weekly digest of new matches.

**Current Status:** Dashboard shows 3 hardcoded role recommendation cards.

**Needed:**
- Recommendation algorithm using user profile + application history
- "New matches this week" badge
- "Why this role matches you" explanation per card
- Recommendation explanation (which skills/requirements matched)

### 5.4 Company Database

**Planned:** Structured company profiles: size, industry, culture tags, interview process, benefits, hiring history, diversity stats. Company research brief generation.

**Current Status:** Role detail page shows some hardcoded company info.

**Needed:**
- Company database model in Prisma
- Company research agent generating structured briefs
- Integration with company research data in role detail page
- Company comparison feature

---

## 6. Application Tracker Enhancements

### 6.1 Add Application Modal

**Planned:** Dialog with form fields: Company (autocomplete), Position, Job URL, Salary (optional), Location, Notes, Initial Status, Link to Job Listing, Link to Resume Version.

**Current Status:** "Add" button exists but does nothing.

**Needed:**
- Modal/dialog component
- Company autocomplete from job database
- Job URL scraping to pre-fill fields
- Resume version selector
- Initial status defaulting to "Wishlist"

### 6.2 Drag-and-Drop Kanban

**Planned:** Full drag-and-drop between Kanban columns. Visual feedback during drag. Status transition rules (e.g., can't go from Rejected back to Interview without special flag).

**Current Status:** Kanban board renders but drag-and-drop is not implemented.

**Needed:**
- `@dnd-kit/core` or `react-beautiful-dnd` integration
- Status transition validation rules
- Optimistic UI updates with API rollback on failure
- Visual drag feedback

### 6.3 Application Timeline

**Planned:** Timeline view of all status changes with timestamps. Note entries at each stage. Interview date scheduling link.

**Current Status:** Not started.

**Needed:**
- Timeline data model (array of events in `Application.timeline`)
- Timeline UI component
- Add note at any stage
- Interview scheduling integration

### 6.4 Application Metrics

**Planned:** Conversion funnel (Applied → Screening → Interview → Offer). Response rate, average time-in-stage, stale application alerts.

**Current Status:** Applications page shows basic stats (total, avg match, response rate).

**Needed:**
- Funnel visualization component
- Per-stage time tracking
- Stale application detection (no update in X days)
- Alert notification for stale applications

### 6.5 Cover Letter Generator

**Planned:** AI-generated cover letters tailored to each application. Based on user profile, target role, company values. 3-paragraph structure with hooks.

**Current Status:** Not started.

**Needed:**
- `POST /api/v1/application/guidance` (cover letter part) wired to frontend
- Cover letter editor with AI regenerate
- Per-application cover letter storage
- Download as PDF

---

## 7. Skill Gap Analysis Enhancements

### 7.1 Dynamic Skill Radar from User Profile

**Planned:** Radar chart dynamically populated from user's normalized skill vector. Compare current vs. target role requirements.

**Current Status:** Skills page uses static `RADAR_DATA` constant with "Your Skills" vs. "Target Level" comparison.

**Needed:**
- Fetch user skills from profile
- Fetch target role required skills from job database
- Generate radar data dynamically
- Real-time update when profile changes

### 7.2 AI Resource Catalog

**Planned:** Curated learning resources (courses, certifications, projects, articles) mapped to each skill gap. Filter by free/paid, format, duration, difficulty.

**Current Status:** Static `RESOURCES` array with `#` URLs. No catalog integration.

**Needed:**
- Resource catalog database
- AI-powered resource matching to skill gaps
- Real resource links (Coursera, Udemy, edX, YouTube)
- Resource rating and review integration

### 7.3 Interactive Learning Roadmap

**Planned:** Generated roadmaps with milestones. Time-ordered resource sequence. Week-by-week milestones with estimated timelines. Progress tracking integration.

**Current Status:** Static roadmap with hardcoded week labels.

**Needed:**
- AI roadmap generation from gap analysis
- Interactive milestone checkboxes
- Progress persistence to profile
- Timeline visualization (Gantt or timeline view)

### 7.4 Skill Progress Tracking

**Planned:** User marks resources as completed. Skill levels update. PPS score recalculates. Progress shown in radar chart (before/after).

**Current Status:** Resource "Start" buttons do nothing. Progress bars on resources are visual only.

**Needed:**
- Skill level update on resource completion
- Radar chart update with progress
- PPS recalculation trigger
- Achievement notifications on milestones

### 7.5 Alternative Skill Suggestions

**Planned:** Suggest skills adjacent to user's existing strengths that have lower learning curves but high placement impact.

**Current Status:** Not started.

**Needed:**
- Skill adjacency graph (which skills commonly appear together)
- Learning curve estimation per skill
- Impact scoring (placement probability lift)
- UI component for "Quick Wins"

---

## 8. Progress & Analytics

### 8.1 Weekly Activity Chart

**Planned:** Bar chart showing daily/weekly activity (applications, interviews, skill practice). 7-day moving average. Comparison to previous weeks.

**Current Status:** Dashboard has a simple `WeeklyBarChart` component using hardcoded data.

**Needed:**
- `POST /api/progress/activity` event logging on user actions
- Aggregated weekly data from database
- Multi-week trend view
- Activity type breakdown (applications vs. interviews vs. learning)

### 8.2 Application Funnel Visualization

**Planned:** Funnel chart from Applied → Screening → Interview → Offer. Conversion rates between stages. Time-to-offer projections.

**Current Status:** Not started.

**Needed:**
- Funnel chart component
- Stage transition tracking
- Conversion rate computation
- Time projection algorithm

### 8.3 Milestone Detection Engine

**Planned:** Automatic milestone detection: First Application, First Interview, First Offer, 10 Applications, Score > 80, Gap Closed. Achievement notifications and badges.

**Current Status:** Dashboard shows 4 hardcoded milestones with static done/pending status.

**Needed:**
- Milestone rule engine in `TrackingAgent`
- Badge component library
- Achievement notification system
- Milestone history

### 8.4 Motivational Feedback Engine

**Planned:** Context-aware LLM-generated messages. Tone calibration based on engagement level. Triggers: daily check-in, post-interview, streak maintenance, milestone celebration. Anti-demotivating language filter.

**Current Status:** Not started.

**Needed:**
- Motivation message generation in `TrackingAgent`
- Engagement level detection
- Message scheduling (daily digest, post-action)
- Tone safety filtering

### 8.5 Analytics Export

**Planned:** Export analytics as CSV/PDF for personal review or advisor sharing.

**Current Status:** Not started.

**Needed:**
- CSV generation for application data
- PDF report generation for full analytics
- Email delivery option
- Shareable report links

---

## 9. Notifications

### 9.1 In-App Notifications

**Planned:** Bell icon with unread count. Notification list. Click to navigate to relevant page. Mark as read / mark all as read.

**Current Status:** Notification API exists but no UI for consuming notifications.

**Needed:**
- Notification bell icon in header with unread badge
- Notification dropdown or page
- Real-time notification delivery (polling or WebSocket)
- Mark read/unread actions

### 9.2 Push Notifications

**Planned:** Browser push notification registration. Reminders for interviews, application deadlines, streak maintenance.

**Current Status:** `POST /api/notifications/register` endpoint exists but frontend doesn't call it.

**Needed:**
- Service worker registration in Next.js
- Push subscription UI (enable/disable)
- Push notification delivery
- Deep linking to relevant pages

### 9.3 Email Notifications

**Planned:** Email digest (weekly progress summary). Interview reminders. Application status change alerts. Job recommendation alerts.

**Current Status:** Not started.

**Needed:**
- Email service integration (SendGrid, Resend, or SES)
- Email template library
- Digest scheduling (weekly on Sunday)
- Unsubscribe mechanism

### 9.4 Notification Triggers

| Trigger | Notification |
|---|---|
| Application status changes | "Your application at [Company] moved to [Status]" |
| Interview scheduled | "Interview with [Company] on [Date]" — 24h and 1h reminders |
| Skill milestone completed | "You've closed the [Skill] gap! Your PPS increased by X%" |
| Application gets no response in 14 days | "Haven't heard from [Company]? Consider following up" |
| Weekly digest | Summary of week's applications, interviews, skill progress |
| New role match | "[Role] at [Company] is X% match for you" |

---

## 10. Multi-Agent Orchestration

### 10.1 Orchestrator WebSocket API

**Planned:** Real-time conversational interface where users can ask natural language questions and the orchestrator routes to the appropriate agent(s). Streaming responses.

**Current Status:** `POST /api/v1/orchestrate/stream` SSE endpoint exists but no frontend chat interface.

**Needed:**
- Chat UI component
- SSE/WebSocket client integration
- Streaming token renderer
- Multi-agent response aggregation

### 10.2 Cross-Agent Workflows

**Planned:** Chain agents for complex tasks. Example: "Help me apply to Google SWE" → Profile Agent → Scoring Agent → Skill Gap Agent → Resume Agent → Application Agent → Tracking Agent.

**Current Status:** Agents exist independently but cross-agent chains are not wired.

**Needed:**
- Workflow definition framework
- Progress indicator for multi-step workflows
- Partial result display as each agent completes
- Error recovery and retry per agent

### 10.3 Shared Context Store

**Planned:** Redis-backed context store where agents read/write user state. Prevent redundant data fetches. Cache company briefs, skill gap reports.

**Current Status:** In-memory dicts in FastAPI. Lost on restart.

**Needed:**
- Redis connection in FastAPI service
- Shared context schema (user_id, session_id, profile, active_roles, etc.)
- Cache TTL management
- Cache invalidation on profile update

### 10.4 Rate Limiting Per Agent

**Planned:** Per-agent rate limits to prevent any single agent from being overwhelmed. Queue excess requests.

**Current Status:** Not started.

**Needed:**
- Per-agent rate limit configuration
- Request queuing (BullMQ)
- Queue status visibility
- Graceful degradation under load

---

## 11. Infrastructure & DevOps

### 11.1 Redis Integration

**Planned:** Session caching, rate limiting, job queues (BullMQ), shared context store.

**Current Status:** Docker-compose includes Redis but it is not used by any service.

**Needed:**
- Redis client in NestJS and FastAPI
- Session caching middleware
- BullMQ queue producers/consumers
- Cache layer for AI responses

### 11.2 Elasticsearch Integration

**Planned:** Job listing indexing and full-text search.

**Current Status:** Docker-compose includes Elasticsearch but no indexing or querying code.

**Needed:**
- Elasticsearch client in NestJS
- Job listing indexer
- Search query builder with filters
- Relevance tuning

### 11.3 Weaviate Integration

**Planned:** Vector embeddings for semantic job-resume matching.

**Current Status:** Docker-compose includes Weaviate but not used.

**Needed:**
- Weaviate Python client setup
- Embedding model (OpenAI ada or similar)
- Vector index for jobs and profiles
- Hybrid search endpoint

### 11.4 Background Job Processing

**Planned:** BullMQ queues for: email sending, resume PDF generation, AI analysis that takes >5 seconds, notification batching.

**Current Status:** BullMQ is imported but no queue producers/consumers are implemented.

**Needed:**
- Queue definition for each job type
- Worker processes
- Job status tracking API
- Dead letter queue handling

### 11.5 Cloud Storage

**Planned:** Resume file storage in S3/GCS. Generated document storage. Profile image storage.

**Current Status:** File uploads go to `./uploads/resumes` on the server disk.

**Needed:**
- S3 or GCS bucket setup
- File upload service using cloud storage SDK
- Signed URL generation for downloads
- File deletion lifecycle

### 11.6 CI/CD Pipeline

**Planned:** GitHub Actions workflow: lint, test, build, deploy. Environment promotion (dev → staging → prod). Docker image building.

**Current Status:** Not started.

**Needed:**
- GitHub Actions workflow files
- Test suite with coverage reporting
- Docker build for each service
- Environment-specific deployments

---

## 12. Security & Compliance

### 12.1 HTTP-Only Cookie Auth

**Planned:** Store refresh tokens in HTTP-only, Secure, SameSite cookies instead of localStorage. Prevent XSS token theft.

**Current Status:** Tokens stored in localStorage, accessible to JavaScript.

**Needed:**
- NestJS auth middleware for cookie-based tokens
- CSRF protection for state-changing operations
- Removal of localStorage token storage
- Secure cookie configuration

### 12.2 Refresh Token Rotation

**Planned:** Rotate refresh tokens on each use. Store issued tokens in database. Revoke all tokens on logout or password change.

**Current Status:** `logout()` does not invalidate refresh tokens. No token rotation.

**Needed:**
- Refresh token table in Prisma
- Token rotation on every refresh
- Bulk revocation on logout/password change
- Token theft detection (if new IP/device detected)

### 12.3 Audit Logging

**Planned:** Log all significant events (login, logout, data access, data modification) for compliance and security monitoring.

**Current Status:** Basic logging interceptor exists but no structured audit log.

**Needed:**
- Audit log table in Prisma
- Decorator-based audit logging
- Log retention policy
- Audit log viewer for admin users

### 12.4 Rate Limiting Per User

**Planned:** Per-user rate limits instead of global. Different limits for different endpoint tiers (auth, read, write, AI).

**Current Status:** Global throttling at 100 req/min for all users combined.

**Needed:**
- Per-user rate limit tracking in Redis
- Tiered limits (e.g., AI endpoints: 10/min, read: 100/min)
- Rate limit response headers
- User-facing rate limit messages

### 12.5 Data Privacy

**Planned:** GDPR compliance: data export, data deletion, anonymization of analytics. Consent management for data processing.

**Current Status:** Not started.

**Needed:**
- Data export endpoint (JSON/CSV of all user data)
- Data deletion with cascade (GDPR right to erasure)
- Analytics data anonymization
- Cookie consent banner
- Privacy policy and terms of service pages

---

## Feature Priority Matrix

| Priority | Feature | Complexity | Impact |
|---|---|---|---|
| P0 | Fix login URL bug (3001 → 4000) | Low | High |
| P0 | Resume save to API | Medium | High |
| P0 | Add application modal + drag-and-drop | High | High |
| P0 | Interview session full flow | High | High |
| P1 | ATS scoring with diff view | Medium | High |
| P1 | Dynamic skill radar from profile | Medium | High |
| P1 | Role detail "Apply Now" integration | Low | High |
| P1 | Real job search (Elasticsearch) | High | High |
| P1 | Token rotation + HTTP-only cookies | Medium | High |
| P2 | PDF/DOCX generation | Medium | Medium |
| P2 | Cover letter generator | Medium | Medium |
| P2 | Weekly email digest | Medium | Medium |
| P2 | Push notifications | Medium | Medium |
| P2 | Redis/Weaviate integration | Medium | Medium |
| P3 | Multi-version resumes | Medium | Medium |
| P3 | Motivational feedback engine | Low | Medium |
| P3 | Personality assessment | Medium | Medium |
| P3 | Milestone detection engine | Medium | Medium |
| P3 | Background job processing | High | Medium |
| P4 | Multi-agent chat interface | High | High |
| P4 | Comparative role scoring | Medium | Medium |
| P4 | Audit logging | Medium | Medium |
| P4 | Data export/deletion (GDPR) | Medium | Medium |
| P5 | Cloud storage migration | Medium | Medium |
| P5 | CI/CD pipeline | Medium | Medium |
| P5 | Personality → career-fit mapping | Medium | Low |
