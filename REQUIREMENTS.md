# Placement Copilot AI - Requirements Specification

> **Version:** 1.0
> **Date:** 2026-04-10
> **Status:** Requirements Baseline
> **Author:** Requirements Agent

---

## Table of Contents

1. [Overview](#1-overview)
2. [Feature List (Complete)](#2-feature-list-complete)
3. [User Stories](#3-user-stories)
4. [Dashboard Pages - Detailed Specs](#4-dashboard-pages---detailed-specs)
5. [API Endpoints Reference](#5-api-endpoints-reference)
6. [Edge Cases and Error Handling](#6-edge-cases-and-error-handling)
7. [Missing Features and Gaps](#7-missing-features-and-gaps)
8. [AI Integration Points](#8-ai-integration-points)

---

## 1. Overview

### 1.1 System Purpose

Placement Copilot AI is a full-stack monorepo platform that guides job seekers through every stage of their career placement journey using a multi-agent AI system. The platform has three main layers:

- **Web App** (`apps/web`) — Next.js 14 frontend with App Router, TypeScript, Tailwind CSS, shadcn/ui components, and Zustand state management
- **API Server** (`apps/api`) — NestJS 10 backend with Prisma ORM, PostgreSQL, JWT auth, and BullMQ
- **AI Service** (`apps/ai`) — FastAPI Python service with LangGraph, LangChain, and Claude 4 (Anthropic)

### 1.2 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand, Framer Motion |
| Backend API | NestJS 10, TypeScript, Prisma ORM, PostgreSQL, BullMQ |
| AI Service | FastAPI (Python 3.11), LangGraph, LangChain, Claude 4 (Anthropic) |
| Cache | Redis 7 |
| Search | Elasticsearch 8.12 |
| Vector Store | Weaviate 1.23 |
| Auth | JWT, Google OAuth |
| Containerization | Docker, Docker Compose |
| Monorepo | Turborepo 2 |

### 1.3 Data Model Summary

The system manages the following core entities:

- **User** — Authentication, profile ownership
- **Profile** — Multi-dimensional career profile (skills, education, experience, certifications, languages, projects)
- **Resume** — Multiple resume versions with parsed data, ATS scores, and file storage
- **JobListing** — Job postings from various sources with requirements, keywords, and benefits
- **Application** — Job applications tied to a user, job listing, and resume, with Kanban status
- **MockInterview** — Interview sessions with questions, answers, scores, and feedback
- **SkillGapAnalysis** — Gap analysis results with roadmap and recommendations
- **Notification** — User notifications of various types
- **AnalyticsEvent** — User activity tracking events
- **SavedJob** — User-saved job listings

---

## 2. Feature List (Complete)

### 2.1 Landing Page
- [x] Marketing landing page with hero section
- [x] Feature grid (7 features described)
- [x] How It Works (3-step flow)
- [x] Testimonials section (3 entries)
- [x] FAQ accordion (5 questions)
- [x] Stats banner (placeholder numbers)
- [x] CTA signup section
- [x] Navbar with Sign In / Get Started Free links

### 2.2 Authentication
- [x] Email/password registration with validation
- [x] Email/password login with validation
- [x] Password visibility toggle
- [x] JWT access token + refresh token mechanism
- [x] Token refresh on 401 intercept
- [x] Google OAuth login flow (frontend initiates, backend handles callback)
- [x] Logout (invalidate refresh token)
- [x] Error handling for 409 (duplicate email), 400 (validation), 401 (auth failures)

### 2.3 Onboarding
- [x] 5-step wizard: Intent → About You → Target Roles → Resume Upload → Preferences
- [x] Intent selection (Student / Switching Careers / Level Up)
- [x] Experience level selector
- [x] Education level selector
- [x] Target roles multi-select (10 options)
- [x] Industries multi-select (10 options)
- [x] Resume file upload (PDF, DOCX)
- [x] Notification preferences toggles
- [x] Progress bar across all steps
- [x] Navigation (Back / Next / Finish)
- [x] POST to `/api/profile` on completion
- [x] Redirects to `/dashboard` regardless of API success (graceful degradation)

### 2.4 Dashboard (Home)
- [x] Personalized greeting based on time of day + user first name
- [x] Streak indicator
- [x] Weekly activity bar chart
- [x] Quick action cards (Build Resume, Mock Interview, Find Roles, Skill Gap)
- [x] PPS (Placement Potential Score) ring display with breakdown
- [x] Stats cards (Active Applications, Interviews Scheduled, Match Score, Skills Gap Closed)
- [x] Journey milestones tracker
- [x] CTA banner for upcoming interviews
- [x] Active applications list (3 items)
- [x] Role recommendations (3 items)
- [x] API integration with mock data fallback

### 2.5 Resume Builder
- [x] Template picker (Modern, Minimal, Executive, Creative)
- [x] Section tabs: Header, Summary, Experience, Education, Skills, Projects
- [x] Header editor (name, email, phone, location, LinkedIn, GitHub)
- [x] Summary editor with AI generation button
- [x] Experience section with company, title, period, bullet points
- [x] Education section with institution, degree, year, GPA
- [x] Skills section with add/remove tags
- [x] Projects section
- [x] Live preview panel
- [x] ATS Optimization button
- [x] PDF and DOCX download buttons
- [x] Mock resume data for preview
- [x] API integration (loads existing resume, generates summary, optimizes, downloads)

### 2.6 Mock Interviews
- [x] Interview type selector (Behavioral, Technical, Mixed)
- [x] Type cards with description, duration, question count
- [x] Start interview flow with API call
- [x] Interview session page (`/interview/[sessionId]`)
- [x] Past sessions list with score ring, role, company, date, duration
- [x] Upcoming interviews section
- [x] Tips card
- [x] Session interface component (question cards, answer input, feedback panel)
- [x] Score ring component
- [x] API integration with mock fallback

### 2.7 Skill Gap Analysis
- [x] Summary stat cards (Skills Tracked, Gaps Identified, High Priority, Overall Readiness)
- [x] Skill radar chart (SVG-based, comparing user vs. target)
- [x] Top priority gaps display
- [x] Gap details tab with per-skill cards (type, severity, current vs. target)
- [x] Learning roadmap tab with week-by-week resource lists
- [x] "Run AI Analysis" button with API call
- [x] Mock data fallback

### 2.8 Application Tracker
- [x] Kanban board with 7 columns: Wishlist, Submitted, Under Review, Interview, Offer, Rejected, Withdrawn
- [x] Drag-and-drop between columns (via `moveApplication` in Zustand)
- [x] StatusColumn component per stage
- [x] ApplicationCard component with company, role, match %, status badge
- [x] Application stats (total, avg match, response rate)
- [x] "Add" button (visual only — no modal)
- [x] Zustand store with localStorage persistence
- [x] API integration (attempts to load from API, falls back to localStorage)

### 2.9 Role Discovery
- [x] Search bar with client-side filtering by role/company name
- [x] Filter chips (90%+ Match, Remote, Student, Entry Level, >$80k)
- [x] Grid/list view toggle
- [x] Role cards with company logo, match %, location, salary, skills
- [x] Save/heart toggle (local state)
- [x] Quick Apply / Apply button linking to role detail
- [x] Loading skeleton state
- [x] API integration with mock fallback

### 2.10 Role Detail Page
- [x] Back button
- [x] Role header with company initial avatar
- [x] Share and bookmark buttons (visual only)
- [x] Match score ring
- [x] Quick info card (location, salary, company, employees)
- [x] Company info card (founded year, Glassdoor rating, Fortune 100 badge)
- [x] Tabs: Overview, Requirements, Salary & Benefits, Application Prep
- [x] Overview tab with role description and "Why You Match" section
- [x] Requirements tab with required vs. nice-to-have skills
- [x] Salary & Benefits tab with benefits grid
- [x] Application Prep tab with AI tips, resume match, checklist, Apply Now button
- [x] Mock data fallback (role data is hardcoded for `roleId: "1"`)

### 2.11 Settings Page
- [x] Placeholder settings page exists

### 2.12 Backend API (NestJS)
- [x] Auth module (register, login, refresh, logout, Google OAuth)
- [x] Users module (CRUD, profile linkage)
- [x] Profiles module (CRUD, onboarding data)
- [x] Resumes module (upload, list, get, delete, set primary, analyze, optimize)
- [x] Jobs module (list, get, search, recommendations, saved)
- [x] Applications module (CRUD, status transitions, stats)
- [x] Interviews module (list, start, submit answer, complete, get feedback)
- [x] Skill Gaps module (analyze, roadmap)
- [x] Progress module (dashboard stats, PPS, streak, activity)
- [x] Notifications module (list, mark read, register)
- [x] AI module (HTTP client to AI service)
- [x] Prisma service with PostgreSQL
- [x] JWT auth guard
- [x] Roles guard
- [x] Throttling (100 requests/minute)
- [x] Logging interceptor
- [x] Transform interceptor
- [x] HTTP exception filter
- [x] Swagger API docs

### 2.13 AI Service (FastAPI)
- [x] Orchestrator endpoint (intent routing, streaming)
- [x] Profile analyzer agent
- [x] Scoring agent (PPS calculation)
- [x] Resume agent (parse, score ATS, optimize)
- [x] Interview agent (start session, select questions, evaluate answers)
- [x] Skill Gap agent (detect gaps, find resources)
- [x] Application agent (company research, timeline, cover letter, connections)
- [x] Tracking agent (analytics, milestones, motivational messages)
- [x] 7 LangGraph agents with tools
- [x] Pydantic schemas for all request/response types
- [x] In-memory interview session store (UUID-based)

---

## 3. User Stories

### 3.1 Authentication

**US-001: User Registration**
> As a new visitor, I want to create an account so that I can access the placement copilot features.
- Given: I am on the registration page
- When: I fill in first name, last name, email, password, confirm password and submit
- Then: An account is created, I receive JWT tokens, and I am redirected to the onboarding page
- Acceptance: Form validates all fields; duplicate email returns 409; tokens are stored in localStorage

**US-002: User Login**
> As a returning user, I want to log in so that I can continue my placement journey.
- Given: I am on the login page
- When: I enter my email and password and submit
- Then: I am authenticated with JWT tokens and redirected to the dashboard
- And: The access token is added to all subsequent API requests via the axios interceptor
- Acceptance: Invalid credentials return 401; Google OAuth flow completes successfully

**US-003: Token Refresh**
> As a logged-in user, when my access token expires, I want to automatically get a new one so that my session continues uninterrupted.
- Given: I have a valid refresh token but an expired access token
- When: I make an API request that returns 401
- Then: The axios interceptor attempts to refresh using the stored refresh token
- And: If successful, the new access token is stored and the original request is retried
- Acceptance: Expired access token does not redirect to login if refresh succeeds

### 3.2 Onboarding

**US-004: Complete Onboarding**
> As a new user, I want to complete an onboarding wizard so that the platform understands my career goals.
- Given: I just registered and am on the onboarding page
- When: I complete all 5 steps and click Finish Setup
- Then: My profile data is submitted to the API and I am redirected to the dashboard
- Acceptance: Progress bar shows correct step; intent is required to proceed past step 1; onboarding POST is made to `/api/profile`

### 3.3 Dashboard

**US-005: View Dashboard**
> As a logged-in user, I want to see my dashboard so that I can track my placement progress at a glance.
- Given: I am logged in and navigate to `/dashboard`
- When: The page loads
- Then: It fetches progress data from the API and displays my PPS score, stats, applications, and recommendations
- Acceptance: Dashboard renders within 3 seconds; if API fails, mock data is shown as fallback; personalized greeting uses user first name

**US-006: Quick Navigation**
> As a user on the dashboard, I want quick access cards so that I can navigate to any feature in one click.
- Given: I am on the dashboard
- When: I click "Build Resume", "Mock Interview", "Find Roles", or "Skill Gap"
- Then: I am taken to the corresponding page
- Acceptance: All four quick action cards navigate correctly

### 3.4 Resume Builder

**US-007: Create and Preview Resume**
> As a user, I want to build my resume so that I can present myself professionally to employers.
- Given: I am on the Resume Builder page
- When: I edit any section (Header, Summary, Experience, etc.)
- Then: The live preview updates in real time
- Acceptance: All 6 section tabs are functional; preview renders correctly at reduced scale; changes persist during the session

**US-008: AI Summary Generation**
> As a user, I want AI to generate my professional summary so that I save time writing it.
- Given: I am on the Summary tab of the Resume Builder
- When: I click "AI Generate"
- Then: A POST is made to `/api/resume/generate-summary` and the summary field is populated
- Acceptance: Loading state shown during generation; error toast on failure; success toast on completion

**US-009: ATS Optimization**
> As a user, I want my resume optimized for ATS so that I pass automated screening.
- Given: I am on the Resume Builder page
- When: I click "Optimize for ATS"
- Then: A POST is made to `/api/resume/optimize` with the target role
- Acceptance: Optimizing state shown; success toast on completion; resume data updated

**US-010: Download Resume**
> As a user, I want to download my resume as PDF or DOCX so that I can submit it to employers.
- Given: I have built my resume
- When: I click PDF or DOCX download
- Then: A GET request fetches the file blob and triggers a browser download
- Acceptance: Correct file format downloaded with correct filename

### 3.5 Mock Interviews

**US-011: Start Interview Session**
> As a user, I want to start a mock interview so that I can practice for real interviews.
- Given: I am on the Mock Interviews page
- When: I select an interview type (Behavioral, Technical, or Mixed) and click Start Interview
- Then: A POST is made to `/api/interviews/start` and I am redirected to the session page
- Acceptance: Selected type is passed to API; session ID is extracted from response; navigation to session page works

**US-012: View Past Sessions**
> As a user, I want to see my past interview sessions so that I can track my improvement over time.
- Given: I am on the Mock Interviews page
- When: The page loads
- Then: Past sessions are fetched from the API and displayed as cards with scores
- Acceptance: Loading skeletons shown during fetch; empty state shown if no sessions; API failure falls back to mock data

### 3.6 Skill Gap Analysis

**US-013: View Skill Gaps**
> As a user, I want to see my skill gaps so that I know what to learn next.
- Given: I am on the Skill Gap page
- When: The page loads
- Then: I see the radar chart, gap list, and learning roadmap populated from mock data
- Acceptance: Radar chart renders with correct SVG; gaps sorted by priority; roadmap organized by week

**US-014: Run AI Skill Gap Analysis**
> As a user, I want AI to analyze my skill gaps so that the analysis is personalized to my target role.
- Given: I am on the Skill Gap page
- When: I click "Run AI Analysis"
- Then: A POST is made to `/api/skills/analyze` with the target role
- Acceptance: Analyzing state shown; success toast on completion; data updated with API response

### 3.7 Application Tracker

**US-015: View Application Kanban**
> As a user, I want to see my applications in a Kanban board so that I can track their status visually.
- Given: I am on the Applications page
- When: The page loads
- Then: Applications are grouped into 7 status columns
- Acceptance: All 7 columns render; applications are distributed correctly by status; empty columns show no cards

**US-016: Move Application Between Stages**
> As a user, I want to drag applications between columns so that I can update their status.
- Given: I am on the Applications page
- When: I drag an application card from one column to another
- Then: The application's status is updated in the Zustand store and persisted to localStorage
- Acceptance: Card moves to the correct column; store state is updated; data persists across page refreshes

**US-017: Add New Application**
> As a user, I want to add a new application so that I can track it in the Kanban board.
- Given: I am on the Applications page
- When: I click the "Add" button
- Then: (No modal opens — this is a known gap)
- Acceptance: Add button should open a dialog/modal to enter company, role, and initial status

### 3.8 Role Discovery

**US-018: Search and Filter Roles**
> As a user, I want to search and filter job roles so that I find relevant opportunities.
- Given: I am on the Roles page
- When: I type in the search bar or click filter chips
- Then: The displayed roles are filtered client-side in real time
- Acceptance: Search matches role name and company name (case-insensitive); multiple filters can be active simultaneously; results count updates

**US-019: Toggle Grid/List View**
> As a user, I want to switch between grid and list views so that I can browse roles in my preferred format.
- Given: I am on the Roles page
- When: I click the grid or list icon
- Then: The view mode changes between card grid and compact list
- Acceptance: Both views render correctly; view mode persists during session

### 3.9 Role Detail

**US-020: View Role Details**
> As a user, I want to see detailed information about a role so that I can decide whether to apply.
- Given: I am on the Roles page
- When: I click on a role card or Quick Apply
- Then: I am taken to the role detail page showing all information
- Acceptance: All 4 tabs render correctly; data loads from API with mock fallback; "Apply Now" button is present

---

## 4. Dashboard Pages - Detailed Specs

### 4.1 Dashboard Home (`/dashboard`)

**Intended Functionality:**
- Display a personalized dashboard aggregating all placement data
- Show PPS (Placement Potential Score) with per-dimension breakdown
- Display key metrics: active applications, interviews scheduled, match score, skills gap closed
- Show weekly activity chart
- Display streak counter
- List active applications with status badges
- Show role recommendations with match percentages
- Track journey milestones
- CTA for upcoming interviews

**Currently Implemented:**
- All above UI elements are rendered with mock data
- API call to `/api/progress` attempts to load real data
- On API failure, falls back to `MOCK_DASHBOARD` constant
- Quick action cards link to correct pages
- PPS ring animates on load

**API Endpoints Expected:**
- `GET /api/progress` — Returns dashboard stats, weekly activity, milestones, recent events
- Response shape: `{ streak, weeklyApplications, ppsScore, ppsBreakdown, stats, activeApplications, upcomingInterview, roleRecommendations, weeklyActivity, milestones }`

**Issues/Gaps:**
- The `MOCK_DASHBOARD` data is hardcoded with static dates (e.g., "2026-04-05") and hardcoded company names (Google, Stripe, Notion)
- Role recommendations link to `/roles` but pass no context
- The "Interview with Google in 2 days" CTA is static mock data

### 4.2 Resume Builder (`/resume`)

**Intended Functionality:**
- Build resumes with structured sections
- AI-powered summary generation
- ATS scoring against target job descriptions
- Keyword optimization with AI suggestions
- Multiple resume versions per target role
- PDF and DOCX export

**Currently Implemented:**
- Template picker UI with 4 templates
- Section editor with 6 tabs (Header, Summary, Experience, Education, Skills, Projects)
- Live preview panel (scaled-down resume render)
- AI Generate button calls `/api/resume/generate-summary`
- ATS Optimization button calls `/api/resume/optimize`
- PDF/DOCX download buttons call `/api/resume/pdf` and `/api/resume/docx`
- Resume data is loaded from `/api/resume` on mount
- Falls back to hardcoded `mockResume` constant on API failure

**API Endpoints Expected:**
- `GET /api/resume` — Returns current user's primary resume
- `POST /api/resume/generate-summary` — Body: `{ prompt }` → Returns `{ summary }`
- `POST /api/resume/optimize` — Body: `{ targetRole }` → Returns optimized resume JSON
- `GET /api/resume/pdf` → Returns PDF file blob
- `GET /api/resume/docx` → Returns DOCX file blob

**Issues/Gaps:**
- The `mockResume` data is hardcoded with placeholder user "Alex Johnson"
- Resume changes in the editor are not saved back to the API
- Template selection has no effect on the preview rendering
- The "Add Experience" and "Add Project" buttons are visual only
- Skills tag removal (the × button) is visual only and doesn't update state
- PDF/DOCX download may not work without a real document generation service

### 4.3 Mock Interviews (`/interview`)

**Intended Functionality:**
- Select from multiple interview types (Behavioral, Technical, Mixed, System Design, etc.)
- Start AI-led interview sessions
- Submit answers and receive real-time feedback
- View full session reports with scores and improvement suggestions
- Track score trends across sessions
- View upcoming scheduled interviews

**Currently Implemented:**
- Interview type selector with 3 types (Behavioral, Technical, Mixed)
- Start button calls `interviewApi.startSession(type)` and navigates to session page
- Past sessions list loads from `GET /api/interviews` with mock fallback
- Score ring component for visual score display
- Session interface components exist (`session-interface.tsx`, `interview-session.tsx`, `feedback-panel.tsx`, `question-card.tsx`)
- Upcoming interviews section with mock data
- Tips card

**API Endpoints Expected:**
- `GET /api/interviews` — Returns list of past interview sessions
- `POST /api/interviews/start` — Body: `{ type, targetRole?, difficulty?, applicationId? }` → Returns `{ sessionId, firstQuestion, questionCount, estimatedDuration }`
- `POST /api/interviews/sessions/{id}/answers` — Body: `{ questionId, answer }` → Returns `{ feedback, score, nextQuestion?, isComplete }`
- `POST /api/interviews/sessions/{id}/end` — Ends session, returns full report
- `GET /api/interviews/sessions/{id}/report` — Returns detailed session report

**Issues/Gaps:**
- The session interface page (`/interview/[sessionId]`) reads the session ID from URL but may not correctly load the session from the API
- Question navigation (next/previous) is not fully implemented in the UI
- Real-time streaming of AI responses is not implemented
- The `handleStartInterview` function on API failure navigates to `/interview/new?type=X` which may not be a valid route
- Upcoming interviews section uses static mock data
- The interview session WebSocket gateway (`interviews.gateway.ts`) exists in the NestJS code but is not used by the frontend

### 4.4 Skills / Skill Gap Analysis (`/skills`)

**Intended Functionality:**
- Display current skills vs. target role requirements
- Radar chart visualization of skill coverage
- Gap prioritization with severity scores
- Personalized learning roadmap with resources
- Track skill progress over time
- Run AI-powered analysis for specific target roles

**Currently Implemented:**
- Radar chart (SVG-based, comparing current vs. target levels)
- Summary stat cards (Skills Tracked, Gaps Identified, High Priority, Overall Readiness)
- Gap details tab with per-skill cards showing gap type, severity, current vs. target levels
- Learning roadmap tab with week-by-week resource lists
- "Run AI Analysis" button calls `POST /api/skills/analyze`
- All data uses hardcoded mock constants (`SKILL_DATA`, `GAPS`, `RESOURCES`, `RADAR_DATA`)

**API Endpoints Expected:**
- `POST /api/skills/analyze` — Body: `{ targetRole, currentSkills? }` → Returns `{ skills, gaps, radar, overallPriorityScore, roadmap }`

**Issues/Gaps:**
- All skill data, gap data, and resources are hardcoded mock data
- The radar chart always uses `RADAR_DATA` instead of actual user data
- Resources have static `#` URLs (not real links)
- Roadmap is entirely static with no connection to actual learning platforms
- Skill progress tracking (marking resources as completed) is visual only
- "Start" button on resources does nothing

### 4.5 Applications (`/applications`)

**Intended Functionality:**
- Kanban board with all application pipeline stages
- Add new applications with company, role, salary, etc.
- Drag-and-drop between stages
- View application details
- Calculate response rate, conversion funnel metrics
- Link applications to interview sessions
- Store application notes

**Currently Implemented:**
- Kanban board renders with 7 status columns
- Zustand store with localStorage persistence
- `addApplication`, `moveApplication`, `updateApplication`, `deleteApplication` actions
- API call attempts to load from `GET /api/applications`
- Falls back to empty board (or localStorage data if previously cached)
- Stats display (total, avg match, response rate)
- Skeleton loading state

**API Endpoints Expected:**
- `GET /api/applications` — Returns all user applications
- `POST /api/applications` — Body: `{ company, position, jobListingId?, resumeId?, status? }` → Returns created application
- `PATCH /api/applications/{id}` — Body: `{ status?, notes?, ... }` → Returns updated application
- `DELETE /api/applications/{id}` — Removes application
- `GET /api/applications/stats` — Returns pipeline stats

**Issues/Gaps:**
- "Add" button is visually present but does nothing (no modal/dialog)
- `applicationApi.getAll()` returns no data (API not populating applications)
- Therefore, the Kanban board starts empty and all data is lost on localStorage clear
- The `Application` interface fields (`match`, `interviewDate`, `notes`) are not displayed on cards
- Drag-and-drop visual feedback may need refinement
- No application detail view when clicking a card

### 4.6 Roles (`/roles`)

**Intended Functionality:**
- Browse and search job listings
- Filter by match score, location, experience level, salary
- View detailed role information
- Save roles to a wishlist
- Apply directly to roles (creating an application in the tracker)
- View match percentage based on user profile

**Currently Implemented:**
- Role search with client-side filtering
- Filter chips (activeFilters state managed)
- Grid and list view toggle
- Role cards with company, role, location, salary, skills, match %
- Save/heart toggle (local state only — not persisted)
- Quick Apply link to role detail page
- API call to `GET /api/jobs` with mock fallback
- Loading skeletons

**API Endpoints Expected:**
- `GET /api/jobs` — Returns paginated job listings
- `GET /api/jobs/search?q=` — Search by query
- `GET /api/jobs/recommendations` — Personalized recommendations
- `GET /api/jobs/{id}` — Returns single job listing detail
- `GET /api/jobs/saved` — Returns user's saved job IDs
- `POST /api/jobs/{id}/save` — Save a job
- `DELETE /api/jobs/{id}/save` — Unsave a job

**Issues/Gaps:**
- Saved roles are not persisted across page reloads (local useState only)
- The "Quick Apply" link navigates to `/roles/{role.id}` which renders mock data
- Filter chips (Remote, Entry Level, >$80k) filter client-side against mock data but the API call is not made with filters
- No "Load More" / pagination UI
- Role data is entirely mock (Google, Stripe, Notion, etc.) from `MOCK_ROLES`

### 4.7 Role Detail (`/roles/[roleId]`)

**Intended Functionality:**
- Show comprehensive role details
- Display personalized match score
- Show company research (culture, interview process, benefits)
- Show required vs. nice-to-have skills
- Display salary range and benefits
- Provide AI-generated application tips
- Allow user to create an application from this role
- Track application checklist progress

**Currently Implemented:**
- Back button, share, bookmark buttons (visual only)
- Match score ring with PPSRing component
- Quick info and company info cards with mock data
- 4 tabs: Overview, Requirements, Salary & Benefits, Application Prep
- "Apply Now" button (visual only — does not create application)
- Application checklist with static items
- Static "Why You Match" section
- Static "AI Application Tips" section

**API Endpoints Expected:**
- `GET /api/jobs/{roleId}` — Returns job listing detail
- `POST /api/applications` — Body: `{ jobListingId: roleId, company, position }` → Creates application

**Issues/Gaps:**
- Role detail page uses `roles[roleId]` lookup which only has `roleId: "1"` in mock data — all other IDs show no data or error
- "Apply Now" button does not trigger the application creation API
- Share and bookmark buttons do nothing
- All company info (founded year, Glassdoor rating, Fortune 100) is hardcoded
- "Why You Match" is static text
- "AI Application Tips" is static text

---

## 5. API Endpoints Reference

### 5.1 Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register new user |
| POST | `/auth/login` | None | Login with credentials |
| POST | `/auth/refresh` | None | Refresh access token |
| GET | `/auth/google` | None | Initiate Google OAuth |
| GET | `/auth/google/callback` | None | Handle Google OAuth callback |
| POST | `/auth/logout` | JWT | Logout and invalidate token |

### 5.2 Profiles (`/api/profile`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | JWT | Get current user's profile |
| POST | `/profile` | JWT | Create profile (onboarding) |
| PATCH | `/profile` | JWT | Update profile |
| POST | `/profile/resume` | JWT | Upload resume to profile |
| GET | `/profile/resume` | JWT | Get profile's resume |

### 5.3 Resumes (`/api/resumes`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/resumes/upload` | JWT | Upload resume file |
| GET | `/resumes` | JWT | List all user resumes |
| GET | `/resumes/{id}` | JWT | Get resume by ID |
| DELETE | `/resumes/{id}` | JWT | Delete resume |
| POST | `/resumes/{id}/primary` | JWT | Set as primary resume |
| POST | `/resumes/{id}/analyze` | JWT | AI analyze resume |
| POST | `/resumes/{id}/optimize` | JWT | AI optimize for target role |

Single resume endpoints (not RESTful, but in API client):
| GET | `/resume` | JWT | Get primary resume |
| PATCH | `/resume` | JWT | Update resume |
| POST | `/resume/generate-summary` | JWT | AI generate summary |
| GET | `/resume/pdf` | JWT | Download as PDF |
| GET | `/resume/docx` | JWT | Download as DOCX |

### 5.4 Jobs (`/api/jobs`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | JWT | List job listings |
| GET | `/jobs/search` | JWT | Search jobs |
| GET | `/jobs/recommendations` | JWT | Get recommended jobs |
| GET | `/jobs/saved` | JWT | Get saved jobs |
| GET | `/jobs/{id}` | JWT | Get job detail |

### 5.5 Applications (`/api/applications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/applications` | JWT | List all applications |
| POST | `/applications` | JWT | Create application |
| PATCH | `/applications/{id}` | JWT | Update application |
| DELETE | `/applications/{id}` | JWT | Delete application |
| GET | `/applications/stats` | JWT | Get pipeline statistics |

### 5.6 Interviews (`/api/interviews`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/interviews` | JWT | List interview sessions |
| POST | `/interviews/start` | JWT | Start new interview |
| GET | `/interviews/{id}` | JWT | Get session details |
| POST | `/interviews/{id}/answer` | JWT | Submit answer |
| POST | `/interviews/{id}/complete` | JWT | Complete session |
| GET | `/interviews/{id}/feedback` | JWT | Get feedback report |

### 5.7 Skill Gaps (`/api/skills`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/skills/analyze` | JWT | Run skill gap analysis |
| GET | `/skills/roadmap/{role}` | JWT | Get learning roadmap |
| PATCH | `/skills/{id}/progress` | JWT | Update skill progress |

### 5.8 Progress (`/api/progress`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/progress` | JWT | Get dashboard stats |
| GET | `/progress/pps` | JWT | Get PPS score |
| GET | `/progress/streak` | JWT | Get streak info |
| POST | `/progress/activity` | JWT | Log activity event |

### 5.9 Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | JWT | List notifications |
| PATCH | `/notifications/{id}/read` | JWT | Mark as read |
| PATCH | `/notifications/read-all` | JWT | Mark all as read |
| POST | `/notifications/register` | JWT | Register push subscription |

---

## 6. Edge Cases and Error Handling

### 6.1 Authentication

| Scenario | Expected Behavior |
|---|---|
| Duplicate email registration | Return 409 with message "Email already exists" |
| Invalid credentials | Return 401 with message "Invalid credentials" |
| Missing required fields | Return 400 with validation errors per field |
| Google OAuth not configured | Show error message in login page |
| Refresh token expired | Clear localStorage and redirect to login |
| Network error during login | Show generic "Registration failed" error |
| Token refresh fails | Clear tokens and redirect to `/login` |

### 6.2 API Client

| Scenario | Expected Behavior |
|---|---|
| 401 response | Attempt token refresh, retry request |
| Refresh token also 401 | Clear tokens, redirect to `/login` |
| Network timeout (15s) | Show error toast, fallback to mock data |
| Server 500 error | Show error toast, fallback to mock data |
| Malformed response (no data field) | Fall back to root response object |

### 6.3 Dashboard

| Scenario | Expected Behavior |
|---|---|
| No applications yet | Show empty Kanban board with "Add your first application" prompt |
| API fails on load | Show `MOCK_DASHBOARD` data with silent toast |
| User has no first name | Show "Good morning, there" |

### 6.4 Resume Builder

| Scenario | Expected Behavior |
|---|---|
| No existing resume | Show empty form with mock preview |
| AI generation fails | Show error toast, keep current data |
| ATS optimization fails | Show error toast, keep current data |
| Resume upload fails | Show error toast |
| PDF download fails | Show error toast |
| Empty required fields | Show validation error messages |

### 6.5 Applications

| Scenario | Expected Behavior |
|---|---|
| No applications | Show 7 empty columns with subtle prompts |
| Drag to invalid column | Prevent drop, snap back |
| Delete last application | Show empty state |
| localStorage cleared | Kanban resets to empty |

### 6.6 Interviews

| Scenario | Expected Behavior |
|---|---|
| Session not found | Navigate to `/interview` with error toast |
| Empty answer submission | Show "Your answer was empty" prompt |
| API fails during session | Show error, allow retry |
| Session timeout | Save partial session state |

---

## 7. Missing Features and Gaps

### 7.1 Authentication & Session

1. **No persistent session on server** — Tokens are client-side only (localStorage). No HTTP-only cookie option, making XSS token theft possible.
2. **Refresh token not invalidated on logout** — `logout()` in auth service returns a success message but does not actually blacklist the refresh token.
3. **Google OAuth URL hardcoded in frontend** — `login/page.tsx` hardcodes `window.location.protocol//localhost:3001` which is incorrect (should be port 4000). Same in `api.ts` baseURL.

### 7.2 Onboarding

1. **No resume parsing on upload** — Step 4 shows an upload area but the uploaded file is not actually parsed or sent to the AI service. The "Analyze My Resume" button shows an alert with a placeholder message.
2. **Onboarding always redirects to dashboard** — Even if the API call fails, the user is redirected. No retry mechanism.
3. **No skip option** — Users must complete onboarding to proceed.

### 7.3 Resume Builder

1. **No save functionality** — Changes to resume sections are not persisted to the API. The `PATCH /api/resume` endpoint exists in the API client but is never called.
2. **No multi-version support** — The spec calls for role-tailored versions, but the UI only supports a single resume.
3. **No actual PDF/DOCX generation** — The download endpoints may not actually generate valid documents. No document library is integrated.
4. **Template selection has no effect** — The 4 templates (Modern, Minimal, Executive, Creative) are displayed as pickers but don't change the resume preview styling.
5. **Add Experience/Project buttons do nothing** — No modal or inline form opens.
6. **Skill tag removal is not wired** — The × button doesn't update the `data.skills` array.

### 7.4 Mock Interviews

1. **Interview session interface incomplete** — The `/interview/[sessionId]` page exists but its actual functionality (asking questions, receiving feedback) is not fully wired to the AI service.
2. **No question navigation** — Previous/Next question buttons may not be implemented.
3. **No real-time streaming** — AI responses should stream token-by-token, but the implementation is likely polling-based or not implemented.
4. **WebSocket gateway unused** — `interviews.gateway.ts` (Socket.IO/WebSocket support) exists in NestJS but the frontend doesn't connect to it.
5. **Upcoming interviews are static** — The `UPCOMING` array is hardcoded with fake future interviews.

### 7.5 Skill Gap Analysis

1. **All data is static mock** — The `SKILL_DATA`, `GAPS`, `RESOURCES`, and `RADAR_DATA` constants are hardcoded. The AI analysis button calls the API but the mock data is still used (the response updates state but the fallback is hardcoded).
2. **Resource links are `#`** — Learning resource URLs are placeholders.
3. **No progress tracking** — The "Start" buttons on resources and the progress bars on individual resources are visual only.
4. **Roadmap is static** — Week 1-6 structure is hardcoded, not generated by the AI.

### 7.6 Application Tracker

1. **Add button does nothing** — No dialog/modal to enter application details.
2. **Application cards have limited detail** — Notes, salary, location from the Application interface are not shown on cards.
3. **No application detail page** — Clicking a card doesn't navigate anywhere.
4. **No drag-and-drop implementation** — The Kanban board renders columns but the actual drag-and-drop behavior is not implemented (no `@dnd-kit` or similar library).
5. **No API integration for writes** — `moveApplication`, `updateApplication`, `deleteApplication` update Zustand/localStorage only, not the API.

### 7.7 Role Discovery

1. **No saved roles persistence** — Heart/save toggle is local state only.
2. **Filter chips don't call API** — All filtering is client-side against mock data.
3. **No pagination** — No "Load More" or infinite scroll.
4. **Role data entirely mock** — All role listings are from `MOCK_ROLES` constant.
5. **No actual job search integration** — Elasticsearch integration is planned but not wired to the UI.

### 7.8 Role Detail

1. **Only role ID "1" has mock data** — All other role IDs show no content or error.
2. **"Apply Now" does nothing** — No application creation API call.
3. **Share/Bookmark buttons are visual only**.
4. **Company info is hardcoded** — Founded year, Glassdoor rating, Fortune 100 badge are static.
5. **"Why You Match" and "AI Tips" are static text**.

### 7.9 Backend

1. **No email service** — No password reset, email verification, or notification emails.
2. **No rate limiting per-user** — Global throttling at 100 req/min applies to all users combined.
3. **File upload storage is disk** — Resume uploads go to `./uploads/resumes` on the server filesystem. No cloud storage (S3/GCS).
4. **In-memory interview session store** — AI service stores interview sessions in a Python dict, not Redis. Sessions are lost on restart.
5. **No background job processing** — BullMQ is in the stack but no queue producers/consumers are implemented.
6. **No Elasticsearch integration** — Job search uses mock data, not Elasticsearch.
7. **No Weaviate integration** — Vector store for job-resume matching is not wired.
8. **No Redis integration** — Caching and session management fallbacks are not implemented.

### 7.10 Settings Page

1. **Settings page is a placeholder** — No actual settings functionality implemented.

---

## 8. AI Integration Points

### 8.1 AI Service Endpoints (FastAPI, port 8000)

| Endpoint | Purpose |
|---|---|
| `POST /api/v1/orchestrate` | Main intent routing to agents |
| `POST /api/v1/orchestrate/stream` | Streaming variant |
| `POST /api/v1/profile/analyze` | Parse and enrich user profile |
| `POST /api/v1/scoring/calculate` | Calculate PPS score |
| `POST /api/v1/resume/analyze` | Parse resume, score ATS |
| `POST /api/v1/resume/optimize` | Rewrite resume for JD |
| `POST /api/v1/interview/start` | Start interview session |
| `POST /api/v1/interview/answer` | Evaluate answer, return feedback |
| `POST /api/v1/skill-gap/analyze` | Detect skill gaps |
| `POST /api/v1/application/guidance` | Company research, cover letter |
| `POST /api/v1/tracking/dashboard` | Analytics, milestones, motivation |

### 8.2 Backend-to-AI Integration (NestJS `AiService`)

The NestJS `AiModule` acts as an HTTP client calling the FastAPI service. The `ai.service.ts` should proxy requests and transform responses. All AI calls should:
- Include user authentication context
- Handle AI service unavailability gracefully
- Retry on transient failures (up to 3 times with exponential backoff)
- Log request/response for debugging

### 8.3 Multi-Agent Architecture (LangGraph)

The AI service uses 7 LangGraph agents orchestrated by a central orchestrator:
1. **Profile Agent** — Profile parsing, skill normalization, completeness scoring
2. **Scoring Agent** — PPS calculation, gap analysis, match scoring
3. **Resume Agent** — ATS scoring, keyword injection, content rewriting
4. **Interview Agent** — Question selection, STAR evaluation, scoring
5. **Skill Gap Agent** — Gap detection, resource matching, roadmap generation
6. **Application Agent** — Company research, cover letter, networking suggestions
7. **Tracking Agent** — Analytics computation, milestone detection, motivational messages

Communication patterns: Request-Response (simple queries), Fan-Out (gap analysis), Fan-In (session reports), Event-Driven (status changes).

### 8.4 AI Integration Gaps

1. **NestJS `AiService` not fully implemented** — The `ai.service.ts` exists but the full HTTP client to FastAPI may not be wired end-to-end.
2. **No streaming integration** — SSE/streaming from FastAPI to Next.js frontend not implemented.
3. **In-memory sessions** — Interview sessions stored in Python dict, lost on restart.
4. **Claude API key not validated** — No startup check that `ANTHROPIC_API_KEY` is present.
5. **No LLM response caching** — Repeated identical requests hit Claude every time.
6. **No prompt versioning** — Prompts are in Python files without version control.

---

## Appendix: Known Issues Summary

| # | Area | Issue | Severity |
|---|---|---|---|
| 1 | Auth | Login page hardcodes wrong API URL (3001 instead of 4000) | High |
| 2 | Auth | Tokens stored in localStorage (not HTTP-only cookies) | High |
| 3 | Resume | No save/update of resume edits to API | High |
| 4 | Resume | Template picker has no effect on preview | Medium |
| 5 | Applications | Add button does nothing | High |
| 6 | Applications | No drag-and-drop implementation | High |
| 7 | Applications | Write operations (move, update, delete) not persisted to API | High |
| 8 | Roles | Role detail page only works for ID "1" | High |
| 9 | Roles | Filter chips are client-side against mock data only | Medium |
| 10 | Interviews | Session interface (`/interview/[sessionId]`) not fully wired | High |
| 11 | Interviews | WebSocket gateway unused | Medium |
| 12 | Skills | All skill/gap/roadmap data is static mock | High |
| 13 | Settings | Settings page is placeholder | Low |
| 14 | Backend | File uploads go to disk, not cloud storage | Medium |
| 15 | Backend | No background job processing (BullMQ unused) | Medium |
| 16 | Backend | No Elasticsearch integration | Medium |
| 17 | Backend | No Redis integration | Medium |
| 18 | AI | In-memory interview sessions (lost on restart) | Medium |
| 19 | AI | No streaming from AI to frontend | Medium |
| 20 | Onboarding | Resume upload is not parsed/analyzed | Medium |
