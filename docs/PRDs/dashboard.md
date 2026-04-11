# Dashboard PRD — Placement Copilot AI

**Status:** Approved
**Last Updated:** 2026-04-10
**Owner:** CPM Agent
**Stakeholders:** UX Agent, Team Lead, Engineering

---

## 1. Overview

### Summary

The Dashboard is the central hub of Placement Copilot AI — a modular, multi-page application that helps job seekers track applications, build resumes, practice interviews, discover roles, and analyze skill gaps. Each page is a distinct product surface with its own data model, user interactions, and success criteria, unified by a shared design system and navigation shell.

### User Persona

- **Primary:** College student or recent graduate actively searching for their first professional role
- **Secondary:** Career switcher, professional with 1–3 years of experience
- **Goals:** Track application progress, improve resume ATS score, practice interviews, find relevant roles
- **Pain points:** Losing track of applications, not knowing if resume is competitive, lack of interview practice, overwhelming job search

### Problem Statement

Job seekers juggle dozens of tools — spreadsheets, email, job boards, resume builders — with no unified view of their search. They cannot answer simple questions like "How many applications did I submit this week?" or "Am I more likely to get an interview now compared to last month?" The Dashboard consolidates every aspect of the job search into one coherent experience.

### Solution Overview

Nine interconnected pages — Dashboard Home, Applications, Resume Builder, Interview Hub, Interview Session, Roles, Role Detail, Skills Gap, and Settings — each purpose-built for a specific phase of the job search. Data flows between pages (e.g., a Role can spawn an Application, an Application can link to an Interview Session). The shared layout provides persistent navigation and context.

### Value Proposition

- **User benefit:** Single source of truth for the entire job search — no more spreadsheets
- **Business impact:** Higher engagement through multi-feature use, reduced funnel drop-off
- **Differentiation:** AI-powered ATS scoring, mock interviews with Claude feedback, semantic job matching

---

## 2. User Stories & Flows

### Core User Stories

```
As a job seeker
I want to see an overview of my entire job search health at a glance
so that I can quickly assess my progress and decide where to focus

As a job seeker
I want to track every job application with its current status
so that I never lose track of where I applied

As a job seeker
I want to upload and edit my resume with AI assistance
so that my resume is competitive and ATS-friendly

As a job seeker
I want to practice mock interviews with AI feedback
so that I feel confident in real interviews

As a job seeker
I want to browse and save job listings matched to my profile
so that I spend time applying to roles I'm actually qualified for

As a job seeker
I want to see which skills I'm missing for my target role
so that I can focus my learning efficiently

As a job seeker
I want to configure my profile, notifications, and integrations
so that the app is tailored to my needs
```

### Global Navigation Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Sidebar (desktop)                    │
│  Dashboard │ Applications │ Resume │ Jobs │ Interview  │
│            │              │       │      │  Skills    │
│            │              │       │      │  Settings   │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    Bottom Nav (mobile)                   │
│  🏠    📋    📄    💼    🎤    🎯                       │
│ Home  Apps  Resume  Jobs  Intervw Skills                │
└─────────────────────────────────────────────────────────┘
```

### Happy Path — New User Journey

1. User lands on `/dashboard` (Dashboard Home) after login
2. Dashboard shows onboarding prompts if profile is incomplete
3. User navigates to Resume page → uploads first resume
4. ATS score is generated, user sees feedback
5. User navigates to Roles → browses listings
6. User saves a role → clicks "Apply" → Application created in Draft status
7. User moves Application through Kanban statuses as the real process progresses
8. User starts a Mock Interview from the Interview Hub
9. Session completes with feedback report
10. User views Skills Gap page for target role

### Abandonment Points

| Page | Drop-off Trigger | Mitigation |
|------|-----------------|------------|
| Dashboard Home | PPS score is low, no clear next action | Show "Start here" CTA cards |
| Applications | Kanban feels like extra work | Quick-add shortcut, keyboard shortcuts |
| Resume | Upload fails or format not supported | Clear error messaging, format guide |
| Interview Session | Answer is hard to write | Suggestion prompts, auto-save |
| Skills Gap | Results feel overwhelming | Priority ordering, one-gap roadmap focus |

---

## 3. Functional Requirements

### Page 01 — Dashboard Home (`/dashboard`)

#### Overview
Entry point after login. Shows holistic job search health at a glance: PPS score, application stats, milestones, interview CTA, active applications, and role recommendations.

#### Features

**F1.1 — Greeting Header**
- Dynamic greeting: "Good morning, [First Name]" based on time of day
- Shows today's date in format "Thursday, April 10"
- Subtext: "Here's how your job search is tracking"

**F1.2 — PPS Score Ring**
- Large SVG circular progress ring (300×300px) centered on page
- Score value (0–100) displayed in center with large display font
- Score label below: "Your Profile Performance Score"
- Ring color: red (0–40), amber (41–60), blue (61–80), green (81–100)
- Below ring: 4 horizontal breakdown bars
  - Profile Completeness (label + percentage + bar)
  - Resume Quality (ATS score)
  - Skills Match (based on target role)
  - Activity Level (applications submitted in last 30 days)
- Each bar animates on page load (width transition 800ms ease-out)

**F1.3 — Quick Action Cards (4 cards in 2×2 grid)**
| Card | Icon | Label | Action |
|------|------|-------|--------|
| Add Application | Plus | Add Application | Opens add modal |
| Upload Resume | Upload | Update Resume | Navigates to Resume page |
| Practice Interview | Mic | Start Interview | Navigates to Interview Hub |
| View Saved Jobs | Heart | Saved Jobs | Navigates to Roles (saved filter) |

Cards have hover elevation (shadow increase, 150ms ease). Click navigates to respective page or opens respective modal.

**F1.4 — Stats Cards (4 cards in horizontal row)**
| Stat | Value Source | Subtitle |
|------|-------------|----------|
| Active Applications | Count of non-rejected, non-withdrawn apps | "Across all stages" |
| Interviews This Month | Count of sessions in current month | "Keep it up!" or "Schedule more" |
| Offers Received | Count of "Offered" status | "Celebrate!" or "Stay positive" |
| Response Rate | (Under Review + Interview + Offered) / Total × 100 | "Of all applications" |

Stats load with Skeleton pulse animation (matching card shape). Numbers use display font, subtitles use muted body text.

**F1.5 — Recent Milestones**
- Vertical list, most recent first
- Each item: colored left border (status color), bold title, relative timestamp
- Examples: "Applied to Software Engineer at Stripe" (blue), "Interview scheduled at Google" (purple), "Received offer from Meta" (green)
- Maximum 5 items shown; "View all" link if more exist
- Empty state: "No milestones yet — start by adding an application"

**F1.6 — Interview CTA Banner**
- Full-width banner below stats, accent background color
- Content: "Practice makes perfect — sharpen your interview skills"
- Right-aligned primary CTA button: "Start Mock Interview"
- Dismissible (X button, state persisted to localStorage)

**F1.7 — Active Applications Preview**
- Section header: "Active Applications" with "View All" link
- Shows top 3 applications sorted by most recently updated
- Each row: company logo placeholder, company name, position, status badge, applied date
- Clicking a row navigates to `/applications`

**F1.8 — Recommended Roles**
- Section header: "Recommended for You" with "Browse All" link
- Grid of 3 role cards
- Each card: job title, company, location, match %, "View Role" button
- Cards have hover elevation effect

#### Data Sources
- PPS score: Computed from `progressApi.get()` response (currently mock)
- Quick actions: Static configuration
- Stats: Aggregated from Applications, Interviews, SavedJobs tables
- Milestones: Aggregated from Applications (status changes), InterviewSessions (completion)
- Active applications: Query Applications where status ∉ {REJECTED, WITHDRAWN}
- Recommended roles: Query Jobs ordered by match score for current user profile

#### Inputs
- `GET /api/progress` — PPS score and breakdown data
- `GET /api/applications?limit=3&sort=updatedAt` — Top active applications
- `GET /api/jobs/recommended?limit=3` — Recommended roles
- `GET /api/milestones?limit=5` — Recent milestones

#### Outputs
- Dashboard data object containing all 8 sections
- Fallback: `MOCK_DASHBOARD` object if API fails

#### States
| State | Behavior |
|-------|----------|
| Loading | All 8 sections show Skeleton matching their layout |
| Error | Toast error "Couldn't load dashboard", sections show empty state |
| Empty (new user) | PPS ring shows 0, all stats show 0, CTAs guide to first actions |
| Partial data | Available sections render, missing sections show "Not enough data" |

---

### Page 02 — Applications / Kanban (`/applications`)

#### Overview
Kanban board for tracking job applications through all stages. Drag-and-drop between columns, quick-add, and per-application detail.

#### Features

**F2.1 — Page Header**
- Title: "Applications"
- Total count badge: "X total" next to title
- Right side: "+" button (opens Add Application modal), "Stats" toggle button

**F2.2 — Stats Bar**
Horizontal row of 3 stats displayed above the Kanban board:
| Stat | Value | Calculation |
|------|-------|-------------|
| Total Applications | Count | All applications |
| Average Match | Percentage | Mean of all match scores |
| Response Rate | Percentage | (Under Review + Interview + Offered) / Total |

**F2.3 — Kanban Board**
- 7 columns corresponding to statuses: WISHLIST, SUBMITTED, UNDER_REVIEW, INTERVIEW, OFFERED, REJECTED, WITHDRAWN
- Column header: status name + count badge
- Column colors match SPEC.md status colors
- Each column is scrollable independently (vertical overflow)
- Empty column shows dashed-border drop zone with "Drop here" text

**F2.4 — Application Card**
- Draggable card (grab cursor, lift shadow on drag start)
- Card content:
  - Company name (bold, heading-md)
  - Position title (body-md, muted)
  - Applied date (body-sm, muted, relative: "3 days ago")
  - Match percentage badge (if available)
  - Company logo placeholder (colored initial circle)
- Card height: auto (minimum 80px)
- Hover: subtle shadow elevation (150ms)
- Drag: 8px rotation, 1.05 scale, elevated shadow

**F2.5 — Drag and Drop**
- Drag handle: entire card surface
- Drop zones: all 7 columns
- On drag start: column count badge updates, draggable card gets elevated style
- On drag over column: column gets highlighted border (primary color)
- On drop:
  1. Card animates to new position
  2. Optimistic update in Zustand store
  3. `PATCH /api/applications/:id` called with new status
  4. Timeline entry created on backend
  5. Toast: "Moved to [Status]"
- On drop failure:
  1. Card snaps back to original position
  2. Zustand state reverted
  3. Toast error: "Couldn't update — tap to retry"

**F2.6 — Add Application Modal**
- Triggered by "+" button in page header
- Fields:
  - Company name (text input, required)
  - Position title (text input, required)
  - Application URL (text input, optional, validated as URL)
  - Resume selection (dropdown of user's resumes, optional)
  - Notes (textarea, optional)
  - Initial status (dropdown, default: WISHLIST)
- Submit: "Add Application" primary button
- On success: modal closes, card appears in appropriate column with entrance animation, toast "Application added"
- On error: inline field errors or toast error

**F2.7 — Application Detail (Click Card)**
- Clicking a card opens a slide-over panel or navigates to detail route
- Shows: full application data, status history/timeline, notes
- Actions: Edit, Change Status, Delete

#### Data Sources
- `GET /api/applications` — All applications with company, position, status, match score, createdAt
- `PATCH /api/applications/:id` — Update status (drag-and-drop)
- `POST /api/applications` — Create new application
- `DELETE /api/applications/:id` — Remove application

#### Zustand Store (`application-store.ts`)
- `applications[]` — array of application objects
- `KANBAN_COLUMNS[]` — ordered status list
- `buildColumns()` — groups applications by status
- `moveApplication(appId, fromStatus, toStatus)` — optimistic update
- Persistence: localStorage via Zustand persist middleware

#### Edge Cases
| Scenario | Behavior |
|----------|----------|
| Drag fails | Card snaps back, revert Zustand state |
| Status update API fails | Revert Zustand state, show toast with retry |
| Empty board | Show empty state per SPEC.md pattern with CTA |
| Very long company/position names | Truncate with ellipsis at 2 lines |

---

### Page 03 — Resume Builder (`/resume`)

#### Overview
Full-featured resume editor with template selection, section editing, live preview, AI-powered generation and ATS optimization, and PDF/DOCX export.

#### Features

**F3.1 — Template Picker**
- 4 template options displayed as clickable cards in a horizontal row:
  | Template | Style | Best For |
  |----------|-------|----------|
  | Modern | Clean with accent color sidebar | Tech, creative |
  | Minimal | Whitespace-heavy, serif headings | Finance, law |
  | Executive | Traditional, bold headings | Senior roles |
  | Creative | Bold colors, unique layout | Design, marketing |
- Selected template has primary border ring
- Clicking a template updates the live preview immediately (crossfade 200ms)

**F3.2 — Section Editor (Tabbed Interface)**
- 6 tabs: Header | Summary | Experience | Education | Skills | Projects
- Each tab contains a form for that section

**Header Tab:**
- Full name (text input)
- Email, Phone, Location, LinkedIn URL, Portfolio URL (text inputs)
- Professional headline (text input, max 100 chars)

**Summary Tab:**
- Professional summary (textarea, max 500 chars)
- Character count display
- "Generate with AI" button (calls `resumeApi.generateSummary()`)
  - Button shows spinner while AI generates
  - On success: textarea populated with AI-generated text, toast "Summary generated"
  - On error: toast error "AI generation failed — try again"

**Experience Tab:**
- List of experience entries, each with:
  - Company name, Job title (text inputs)
  - Start date, End date (date pickers)
  - "Current" checkbox (disables end date)
  - Description (textarea, bullet-point friendly)
- "Add Experience" button adds a new entry
- Each entry has delete button (with confirmation)

**Education Tab:**
- List of education entries: Institution, Degree, Field, Graduation date, GPA (optional)
- "Add Education" button
- Each entry has delete button

**Skills Tab:**
- Skill tags input (type and press Enter to add)
- Each skill tag is removable (X button)
- Skills displayed as rounded pill badges

**Projects Tab:**
- List of projects: Name, Description, Technologies used, URL (optional)
- "Add Project" button

**F3.3 — Live Preview**
- Right panel (desktop) or toggleable view (mobile)
- Shows resume rendered in selected template
- Scales to fit panel width using CSS `transform: scale()`
- Updates in real-time as user edits (debounced 300ms)
- Panel has subtle background to distinguish from editing area

**F3.4 — ATS Optimization**
- "Optimize for ATS" button in header
- Calls `resumeApi.optimize(resumeId, targetRole?)`
- On success: shows optimization suggestions in a dialog
  - Missing keywords for target role
  - Suggestions for formatting improvements
  - Quantified impact estimates
- On error: toast error "Optimization failed"

**F3.5 — Download Options**
- "Download" dropdown with two options:
  - **PDF**: calls `resumeApi.downloadPdf(resumeId)`
  - **DOCX**: calls `resumeApi.downloadDocx(resumeId)`
- Both trigger browser download of generated file
- Button shows loading spinner during generation

**F3.6 — Auto-Save**
- Resume state saved to backend every 30 seconds if changes detected
- "Saved" indicator in header: shows "Saving..." / "Saved at 2:34 PM" / "Unsaved changes"
- Manual save: "Save" button always visible

#### Data Sources
- `GET /api/resumes` — List user's resumes
- `GET /api/resumes/:id` — Single resume with all sections
- `POST /api/resumes` — Create new resume
- `PUT /api/resumes/:id` — Update resume
- `DELETE /api/resumes/:id` — Delete resume
- `POST /api/resumes/:id/optimize` — ATS optimization
- `GET /api/resumes/:id/pdf` — Download PDF
- `GET /api/resumes/:id/docx` — Download DOCX
- `POST /api/resumes/generate-summary` — AI summary generation

#### Inputs
- Resume form fields (per section)
- Template selection (enum)
- Target role for ATS optimization (optional string)

#### Outputs
- Resume document rendered in selected template
- ATS optimization report (list of suggestions)
- Downloaded file (PDF or DOCX)

#### States
| State | Behavior |
|-------|----------|
| Loading | Skeleton matching editor layout |
| Empty (no resume) | Empty state "No resume yet" + "Create Resume" CTA |
| Saving | "Saving..." indicator, Save button shows spinner |
| AI generating | "Generating..." text, button shows spinner |
| Download in progress | Download button shows spinner |
| Error | Toast error, retry available |

---

### Page 04 — Interview Hub (`/interview`)

#### Overview
Landing page for mock interviews. Shows upcoming scheduled sessions, interview type selection for starting new sessions, and history of past sessions with scores.

#### Features

**F4.1 — Page Header**
- Title: "Mock Interviews"
- Subtitle: "Practice makes perfect — sharpen your skills"

**F4.2 — Upcoming Interviews**
- List of scheduled/countdown sessions (if any)
- Each item: interview type badge, scheduled time, countdown ("In 2 days")
- Empty state: "No upcoming interviews"

**F4.3 — Interview Type Picker**
- 3 large cards in a row:
  | Type | Icon | Description | Questions |
  |------|------|-------------|------------|
  | Behavioral | MessageCircle | STAR method questions about past experiences | 5 questions |
  | Technical | Code | System design and problem-solving | 4 questions |
  | Mixed | Layers | Combination of behavioral and technical | 6 questions |

- Each card:
  - Type name and icon
  - Description text
  - Number of questions
  - Hover: shadow elevation, slight scale (1.02)
  - Click: navigates to new session at `/interview/[sessionId]`

**F4.4 — Start Session Flow**
- Clicking type card → `POST /api/interviews/sessions` with `{ type }`
- API returns session with questions
- Navigate to `/interview/[sessionId]`

**F4.5 — Past Sessions**
- Section header: "Past Sessions"
- List of completed sessions, most recent first
- Each item:
  - Interview type badge
  - Date completed
  - Overall score ring (mini version, 48px diameter)
  - Duration
  - "View Report" button → navigates to session page
- Empty state: "No sessions yet — start your first interview above"

#### Data Sources
- `GET /api/interviews/sessions` — All sessions (active + past)
- `POST /api/interviews/sessions` — Start new session with type

#### States
| State | Behavior |
|-------|----------|
| Loading | Skeleton cards matching layout |
| Empty (no sessions) | Empty state with CTA to start first interview |
| API error | Toast error, retry button |

---

### Page 05 — Interview Session (`/interview/[sessionId]`)

#### Overview
Active mock interview session. Shows one question at a time, accepts typed answers, submits to AI for review, provides feedback after each answer, and generates a final report at completion.

#### Features

**F5.1 — Session Header**
- Interview type badge
- Progress indicator: "Question 2 of 5"
- Timer: countdown from configurable duration (default 5 min per question)
- "Exit Early" ghost button (top right, requires confirmation modal)

**F5.2 — Phase: Ready**
- Shows interview type and instructions
- Content: "You'll be asked [N] questions. For each, type your answer and submit."
- Button: "I'm Ready" → moves to Question phase

**F5.3 — Phase: Question**
- Displays current question in large, readable text
- Timer countdown visible
- "I'm Ready to Answer" button → moves to Answering phase

**F5.4 — Phase: Answering**
- Question repeated at top (smaller, muted)
- Large textarea for answer input (min 3 rows, auto-expands)
- Character count
- "Submit Answer" primary button (disabled if answer < 20 characters)
- Timer continues counting down
- On submit:
  1. Button shows loading spinner
  2. `POST /api/interviews/sessions/:id/answers` with `{ questionId, answer }`
  3. Falls back to random score generation if API unavailable (mock mode)
  4. Moves to Review phase

**F5.5 — Phase: Review**
- Shows AI feedback for the submitted answer:
  - Score (0–100) with color (red/amber/blue/green)
  - Breakdown: Content, Clarity, Structure (each scored)
  - Specific feedback text (2–4 sentences)
  - "What a strong answer" or "Here's how to improve" tone
- "Next Question" button → loops to Question phase or triggers Completion

**F5.6 — Phase: Completion**
- Triggered after last question's review
- Shows full interview report:
  - Overall score (large ring)
  - Per-question breakdown table (question, score, feedback snippet)
  - Strengths section (bulleted list)
  - Areas to improve (bulleted list)
  - "Practice Again" button → starts new session
  - "Back to Interviews" link → navigates to `/interview`

**F5.7 — Session Persistence**
- Answers saved to backend after each submission
- If browser closes mid-session: session is resumable from `/interview/[sessionId]`
- Auto-save every 10 seconds during Answering phase

**F5.8 — Timer Behavior**
- Default: 5 minutes per question
- Visual: MM:SS format, countdown bar
- Warning state at 1 minute remaining (amber color, pulse animation)
- Time expires: auto-submits whatever is in the textarea (can be empty)

#### Data Sources
- `GET /api/interviews/sessions/:id` — Session data with questions and answers
- `POST /api/interviews/sessions` — Create new session
- `POST /api/interviews/sessions/:id/answers` — Submit answer and get feedback

#### API Contract

**POST /api/interviews/sessions**
```json
// Request
{ "type": "BEHAVIORAL" | "TECHNICAL" | "MIXED" }

// Response 201
{
  "id": "uuid",
  "type": "BEHAVIORAL",
  "status": "ACTIVE",
  "questions": [
    { "id": "uuid", "text": "...", "order": 1 }
  ],
  "createdAt": "ISO8601"
}
```

**POST /api/interviews/sessions/:id/answers**
```json
// Request
{ "questionId": "uuid", "answer": "string" }

// Response 200
{
  "questionId": "uuid",
  "score": 78,
  "breakdown": { "content": 80, "clarity": 75, "structure": 80 },
  "feedback": "Great answer. You provided specific examples..."
}
```

#### Edge Cases
| Scenario | Behavior |
|----------|----------|
| AI service unavailable | Show "AI feedback unavailable — your answers are saved" and use mock scoring |
| Answer too short (<20 chars) | Submit button disabled, hint text "Add more detail for better feedback" |
| Timer expires | Auto-submit current answer, show timeout warning in review |
| Browser closed mid-session | On next visit, prompt: "Resume session or start fresh?" |
| Session not found | 404 page with "Back to Interviews" link |

---

### Page 06 — Roles / Job Listings (`/roles`)

#### Overview
Browse and search job listings with filters. Shows matching roles with relevance scores. Users can save roles and initiate applications.

#### Features

**F6.1 — Page Header**
- Title: "Roles"
- Count of total listings shown

**F6.2 — Search Bar**
- Large text input with search icon
- Placeholder: "Search by title, company, or keyword"
- On Enter or search icon click: triggers search
- Debounced live search (300ms) for character input

**F6.3 — Filter Pills**
- Horizontal scrollable row of filter buttons:
  | Filter | Logic |
  |--------|-------|
  | 90%+ Match | Match score ≥ 90 |
  | Remote | Location includes "Remote" or "Remote-Friendly" |
  | Student-Friendly | Has "Entry Level" or "0-2 years" tag |
  | $80k+ | Salary min ≥ 80,000 |
  | All | No filter applied |

- Active filter has primary background, inactive have outline style
- Multiple filters can be active simultaneously (AND logic)
- "Clear filters" link appears when any filter is active

**F6.4 — View Toggle**
- Grid/List toggle button group (top right)
- Grid: 3-column card layout
- List: single-column row layout
- Preference persisted to localStorage

**F6.5 — Job Cards (Grid View)**
Each card:
- Company logo placeholder (colored initial)
- Job title (bold)
- Company name
- Location (with remote badge if applicable)
- Salary range (if available, muted text)
- Match percentage badge (color-coded: red < 50, amber 50–69, blue 70–89, green 90+)
- Posted date (relative)
- "View Role" button → navigates to `/roles/[roleId]`
- Heart icon (top right): saves/unsaves job, toggles instantly (optimistic update)

**F6.6 — Job Rows (List View)**
Each row:
- Company logo + Job title + Company name
- Location + Salary range + Match %
- Posted date
- Save heart button
- "View Role" link

**F6.7 — Save/Unsave Behavior**
- Clicking heart:
  1. Optimistic update (icon fills immediately)
  2. `POST /api/saved-jobs` (save) or `DELETE /api/saved-jobs/:id` (unsave)
  3. On error: revert icon, show toast error
- Saved jobs accessible via "Saved" filter or dedicated view

**F6.8 — Apply from Listings**
- "Apply Now" button on role detail page (see Page 07)
- Creates Application in Draft status
- Navigates user to Applications page

#### Data Sources
- `GET /api/jobs?search=&filters=` — Paginated job listings
- `GET /api/jobs/:id` — Single job detail
- `GET /api/jobs/recommended` — Personalized recommendations
- `POST /api/saved-jobs` — Save a job
- `DELETE /api/saved-jobs/:id` — Unsave a job
- `POST /api/applications` — Create application from job

#### Edge Cases
| Scenario | Behavior |
|----------|----------|
| No search results | "No roles match '[query]'" + suggestion to broaden search |
| All filters active with no results | "No roles match these filters" + "Clear all filters" CTA |
| Salary not listed | Show "Salary not disclosed" instead of range |
| Job no longer available | Show "This role is no longer available" banner on detail page |
| Network error | Toast error + retry button |

---

### Page 07 — Role Detail (`/roles/[roleId]`)

#### Overview
Full detail view of a single job listing. Shows match analysis, full job description, requirements, salary info, and application prep checklist.

#### Features

**F7.1 — Match Score Ring**
- Large PPS ring (similar to dashboard) showing user-to-role match
- Score breakdown below: Experience match, Skills match, Location match
- Color-coded by score range

**F7.2 — Job Info Header**
- Job title (display-lg)
- Company name with logo
- Location with remote badge if applicable
- Posted date
- Salary range (if available)
- "Apply Now" primary CTA button
- "Save Job" secondary button (heart icon, toggles saved state)

**F7.3 — Tabbed Content (4 tabs)**

**Overview Tab:**
- Full job description (rendered HTML or markdown)
- Company overview (if available)
- Key responsibilities (bulleted list)

**Requirements Tab:**
- Education requirements
- Experience requirements (years, level)
- Required skills (as tags)
- Preferred qualifications (as tags)

**Salary & Benefits Tab:**
- Salary range (min–max)
- Equity (if applicable)
- Signing bonus (if applicable)
- Benefits list: Health, 401k, PTO, etc.

**Application Prep Tab:**
- Interview process description (e.g., "3 rounds: HR screen → Technical → Final")
- Tips for this specific company
- Common interview questions for this role type
- Checklist items (user can check off):
  - [ ] Researched company mission and values
  - [ ] Reviewed job description keywords
  - [ ] Prepared STAR stories for common questions
  - [ ] Practiced with mock interview
  - [ ] Tailored resume for this role

**F7.4 — Apply Now Flow**
- Click "Apply Now":
  1. Creates Application in SUBMITTED status (or DRAFT if user opts to review first)
  2. Links to resume (selected resume or most recent)
  3. Toast: "Application added to your tracker"
  4. Button changes to "Applied ✓" (disabled)
  5. "View in Applications" link appears

#### Data Sources
- `GET /api/jobs/:id` — Full job detail
- `POST /api/saved-jobs` — Save job
- `DELETE /api/saved-jobs/:id` — Unsave job
- `POST /api/applications` — Create application

#### Edge Cases
| Scenario | Behavior |
|----------|----------|
| Role no longer available | Banner at top "This role is no longer available" |
| Already applied | "Applied ✓" button shown, disabled |
| Already saved | Filled heart icon, click unsaves |
| Job loads slowly | Skeleton matching detail layout |
| Not authenticated | Prompt to log in before applying |

---

### Page 08 — Skills Gap Analysis (`/skills`)

#### Overview
AI-powered skill gap analysis. Shows current skills vs. target role requirements, identifies gaps, and provides a learning roadmap.

#### Features

**F8.1 — Page Header**
- Title: "Skills Analysis"
- Subtitle: "Know where you stand — plan where to go"

**F8.2 — Summary Cards (4 cards in horizontal row)**
| Card | Value | Color |
|------|-------|-------|
| Skills Tracked | Count of skills in user profile | Blue |
| Gaps Identified | Count of missing skills for target role | Amber |
| High Priority | Count of high-importance gaps | Red |
| Overall Readiness | Percentage: matched skills / total required | Green ring |

**F8.3 — Target Role Picker**
- Dropdown selector at top of page
- Default: most recent target role from profile
- Options: list of common roles or custom input
- On change: re-triggers analysis

**F8.4 — Radar Chart**
- Custom SVG radar/spider chart
- 5–8 axes representing skill categories (e.g., Frontend, Backend, DevOps, Database, etc.)
- Two overlaid polygons: Current skills (blue, filled 50%) vs. Required skills (green outline)
- Legend below chart
- Tooltips on hover showing exact values

**F8.5 — Tabbed Content**

**Overview Tab:**
- Overall readiness score (large number)
- Matched skills list (green tags)
- "You're strong in" section with skill names

**Gap Details Tab:**
- List of skill gaps sorted by priority (high → medium → low)
- Each gap item:
  - Skill name
  - Priority badge (High/Medium/Low)
  - Current level vs. required level
  - Estimated learning time
  - "View Roadmap" button

**Roadmap Tab:**
- Per-gap learning path
- Each path: ordered list of resources (courses, articles, projects)
- Estimated time to proficiency
- Progress tracker (if user marks resources complete)

**F8.6 — AI Analysis Trigger**
- "Analyze Skills" primary button
- Calls `skillGapApi.analyze(targetRole)`
- On success: populates all sections with AI-generated analysis
- On error: toast error "Analysis failed — check your profile first"

#### Data Sources
- `GET /api/skills` — User's current skills
- `GET /api/skills/gap?role=` — Gap analysis for target role
- `POST /api/skills/analyze` — Trigger AI analysis
- `GET /api/roadmaps/:skillId` — Learning resources for a gap

#### Inputs
- Target role name (string)
- User's current skills (from profile)
- Industry/field context (from profile)

#### Outputs
- Gap analysis: list of { skill, currentLevel, requiredLevel, priority, estimatedTime }
- Roadmap: list of { skillId, resources[], totalDuration }
- Radar chart data: { categories[], current[], required[] }

#### Edge Cases
| Scenario | Behavior |
|----------|----------|
| No skills in profile | Prompt to complete profile first, link to Settings |
| Target role not recognized | "Role not found — try a similar title or contact support" |
| AI analysis takes long | Show loading state with "Analyzing your skills..." |
| All skills matched | Celebratory empty gap state "You're fully qualified!" |

---

### Page 09 — Settings (`/settings`)

#### Overview
User configuration hub. Profile editing, notification preferences, integration management, and privacy controls.

#### Features

**F9.1 — Page Header**
- Title: "Settings"
- Subtitle: "Manage your account and preferences"

**F9.2 — Tab Navigation (4 tabs)**
Profile | Notifications | Integrations | Privacy

**F9.3 — Profile Tab**
Editable form fields:
- First name, Last name
- Email (read-only, shows "Contact support to change")
- Phone number
- Location (city, state/country)
- LinkedIn URL
- Portfolio/Website URL
- Target role (dropdown: Software Engineer, Product Manager, Data Scientist, etc.)
- Industry (dropdown)
- Years of experience (number input, 0–30)
- Bio/Headline (textarea, max 200 chars)

- "Save Changes" primary button
  - On success: green toast "Profile updated"
  - On error: inline field errors or toast error

- Avatar upload section:
  - Current avatar (circle, 80px)
  - "Change Photo" button → file picker (JPEG, PNG, max 5MB)
  - On upload: immediate preview update

**F9.4 — Notifications Tab**
Toggle switches for each notification type:

| Notification | Default | Description |
|-------------|---------|-------------|
| Application status updates | On | When any application status changes |
| Interview reminders | On | 24h and 1h before scheduled interview |
| New job recommendations | On | Weekly digest of matching roles |
| Skill gap insights | Off | When new learning resources are available |
| Tips & tricks | Off | Occasional tips to improve job search |

Each toggle:
- Label + description
- Custom `Toggle` component (role="switch")
- Optimistic update on change, persists to backend

**F9.5 — Integrations Tab**
Card layout showing connected services:

| Service | Status | Actions |
|---------|--------|---------|
| GitHub | Not connected / Connected | "Connect" / "Disconnect" |
| LinkedIn | Not connected / Connected | "Connect" / "Disconnect" |
| Google | Connected | "Disconnect" |

- "Connect" buttons open OAuth flow in popup window
- Connected state shows: service icon, account email, avatar
- "Disconnect" requires confirmation modal

**F9.6 — Privacy Tab**
- "Export My Data" button
  - Generates JSON/CSV of all user data
  - Downloads file
  - Button shows loading spinner during generation
- "Delete Account" destructive button
  - Requires typing "DELETE" to confirm
  - Shows modal: "This will permanently delete all your data. This action cannot be undone."
  - On confirm: soft-delete user account, log out, redirect to landing

#### Data Sources
- `GET /api/users/me` — Current user profile
- `PUT /api/users/me` — Update profile
- `POST /api/users/me/avatar` — Upload avatar
- `GET /api/users/me/notifications` — Notification preferences
- `PUT /api/users/me/notifications` — Update preferences
- `GET /api/users/me/data-export` — Generate data export
- `DELETE /api/users/me` — Delete account

#### States
| State | Behavior |
|-------|----------|
| Saving profile | "Save Changes" button shows spinner, fields disabled |
| Uploading avatar | Progress indicator in avatar area |
| Disconnecting integration | Confirmation modal → loading state → success/error |
| Deleting account | Multi-step confirmation, final button disabled until "DELETE" typed |

---

## 4. Non-Functional Requirements

### Performance
- Dashboard initial load: < 2s (LCP target)
- Kanban drag-and-drop: < 16ms frame time (60fps)
- Resume preview update: debounced 300ms
- Job search results: < 500ms response time
- All pages: skeleton loading to prevent layout shift

### Availability
- Target uptime: 99.5%
- Error rate: < 1% of user actions
- Graceful degradation: mock data fallback when API unavailable

### Security
- All routes require JWT authentication (except login/register)
- Auth tokens stored in httpOnly cookies (future) or localStorage (current)
- 401 responses trigger re-authentication flow
- File uploads: validated file type, size limit, virus scan (future)

### Accessibility
- WCAG 2.1 AA compliance
- All interactive elements keyboard accessible
- Focus management in modals and drag-and-drop
- Screen reader labels on icon-only buttons
- Color contrast ≥ 4.5:1 for text
- Respect `prefers-reduced-motion`

### Compatibility
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile: iOS Safari, Chrome on Android (responsive breakpoints)
- Drag-and-drop: touch support for tablet/mobile

---

## 5. API Contracts

### Dashboard
```
GET /api/progress
Response 200: {
  "ppsScore": 72,
  "breakdown": {
    "profileCompleteness": 85,
    "resumeQuality": 68,
    "skillsMatch": 74,
    "activityLevel": 60
  },
  "stats": {
    "activeApplications": 12,
    "interviewsThisMonth": 3,
    "offersReceived": 1,
    "responseRate": 41.7
  },
  "milestones": [...],
  "activeApplications": [...],
  "recommendedRoles": [...]
}
```

### Applications
```
GET /api/applications
Query: ?status=&sort=updatedAt&order=desc&limit=10&offset=0
Response 200: { "data": [...], "total": 24 }

POST /api/applications
Body: { "company": "", "position": "", "url": "", "resumeId": "", "status": "WISHLIST" }
Response 201: { "id": "", "company": "", "position": "", ... }

PATCH /api/applications/:id
Body: { "status": "SUBMITTED" }
Response 200: { "id": "", "status": "SUBMITTED", "updatedAt": "..." }

DELETE /api/applications/:id
Response 204
```

### Resume
```
GET /api/resumes
Response 200: [{ "id": "", "name": "", "template": "MODERN", ... }]

POST /api/resumes
Body: { "name": "", "template": "MODERN", "sections": { "header": {}, ... } }
Response 201: { "id": "", ... }

PUT /api/resumes/:id
Body: { "sections": { ... } }
Response 200: { "id": "", ... }

DELETE /api/resumes/:id
Response 204

POST /api/resumes/:id/optimize
Body: { "targetRole": "Software Engineer" }
Response 200: { "suggestions": [...], "missingKeywords": [...] }

GET /api/resumes/:id/pdf
Response 200: Binary PDF file

GET /api/resumes/:id/docx
Response 200: Binary DOCX file
```

### Interview Sessions
```
GET /api/interviews/sessions
Response 200: [{ "id": "", "type": "BEHAVIORAL", "status": "COMPLETED", "score": 82, ... }]

POST /api/interviews/sessions
Body: { "type": "BEHAVIORAL" }
Response 201: { "id": "", "type": "BEHAVIORAL", "questions": [...], "status": "ACTIVE" }

GET /api/interviews/sessions/:id
Response 200: { "id": "", "questions": [...], "answers": [...], "status": "ACTIVE" }

POST /api/interviews/sessions/:id/answers
Body: { "questionId": "", "answer": "" }
Response 200: { "questionId": "", "score": 78, "breakdown": {...}, "feedback": "..." }
```

### Jobs
```
GET /api/jobs
Query: ?search=&filters=remote,90plus&page=1&limit=20
Response 200: { "data": [...], "total": 143, "page": 1, "limit": 20 }

GET /api/jobs/recommended
Query: ?limit=3
Response 200: [{ "id": "", "title": "", "matchScore": 87, ... }]

GET /api/jobs/:id
Response 200: { "id": "", "title": "", "company": {...}, "description": "", ... }
```

### Saved Jobs
```
GET /api/saved-jobs
Response 200: [{ "jobId": "", "savedAt": "", "job": {...} }]

POST /api/saved-jobs
Body: { "jobId": "" }
Response 201: { "id": "", "jobId": "", "savedAt": "" }

DELETE /api/saved-jobs/:id
Response 204
```

### Skills
```
GET /api/skills
Response 200: { "skills": ["React", "TypeScript", "Node.js"], "targetRole": "Software Engineer" }

GET /api/skills/gap?role=Software%20Engineer
Response 200: {
  "gaps": [
    { "skill": "Kubernetes", "currentLevel": 1, "requiredLevel": 4, "priority": "HIGH", "estimatedTime": "3 weeks" }
  ],
  "matched": ["React", "TypeScript"],
  "readiness": 68
}

POST /api/skills/analyze
Body: { "targetRole": "Software Engineer" }
Response 200: { "gaps": [...], "roadmap": {...} }
```

### User / Settings
```
GET /api/users/me
Response 200: { "id": "", "firstName": "", "lastName": "", "email": "", ... }

PUT /api/users/me
Body: { "firstName": "", "lastName": "", "phone": "", "location": "", ... }
Response 200: { "id": "", ... }

GET /api/users/me/notifications
Response 200: { "applicationUpdates": true, "interviewReminders": true, ... }

PUT /api/users/me/notifications
Body: { "applicationUpdates": true, "interviewReminders": false, ... }
Response 200: { ... }

DELETE /api/users/me
Response 204
```

---

## 6. Acceptance Criteria

### Dashboard Home
- [ ] PPS ring displays score 0–100 with correct color coding
- [ ] Breakdown bars animate on page load
- [ ] Quick action cards navigate to correct pages/modals
- [ ] Stats cards show correct aggregated values
- [ ] Milestones list shows up to 5 items with relative timestamps
- [ ] Interview CTA banner is dismissible and state persists
- [ ] Active applications preview links to Applications page
- [ ] Recommended roles grid shows 3 cards with correct data
- [ ] Loading state shows skeleton for all 8 sections
- [ ] Error state shows toast and empty states per section

### Applications / Kanban
- [ ] All 7 status columns render with correct headers and colors
- [ ] Application cards are draggable between columns
- [ ] Drag-and-drop updates status via PATCH API call
- [ ] Failed drop reverts card to original position
- [ ] "+" button opens Add Application modal
- [ ] Modal form validates required fields
- [ ] New application appears in correct column on submit
- [ ] Stats bar shows total, average match, response rate
- [ ] Empty board shows empty state with CTA
- [ ] Mobile: columns stack vertically with horizontal scroll

### Resume Builder
- [ ] 4 templates render correctly with distinct visual styles
- [ ] Template selection updates preview immediately
- [ ] All 6 tab sections are editable and save correctly
- [ ] AI summary generation populates textarea
- [ ] ATS optimization shows suggestions dialog
- [ ] PDF and DOCX downloads generate valid files
- [ ] Auto-save indicator shows correct state
- [ ] Live preview updates in real-time (debounced)
- [ ] Skills tags can be added and removed
- [ ] Experience/Education/Project entries can be added and deleted

### Interview Hub
- [ ] All 3 interview type cards render with correct info
- [ ] Clicking a type card starts a new session
- [ ] Upcoming interviews section shows countdown
- [ ] Past sessions show score, date, and view report link
- [ ] Empty state shows CTA to start first interview
- [ ] Loading state shows skeleton cards

### Interview Session
- [ ] Ready phase shows instructions and "I'm Ready" button
- [ ] Question phase displays question and "I'm Ready to Answer"
- [ ] Answering phase shows timer and textarea
- [ ] Timer counts down and changes color at 1 minute
- [ ] Timer expiry auto-submits answer
- [ ] Submit button disabled for answers < 20 characters
- [ ] Review phase shows score, breakdown, and feedback
- [ ] Completion phase shows full report with all scores
- [ ] Session is resumable after browser close
- [ ] Exit early requires confirmation modal
- [ ] AI unavailable shows fallback scoring with message

### Roles / Job Listings
- [ ] Search bar triggers search on Enter and icon click
- [ ] Live search debounced at 300ms
- [ ] Filter pills toggle correctly (AND logic for multiple)
- [ ] Grid/List toggle persists preference to localStorage
- [ ] Job cards show all fields (title, company, location, salary, match, date)
- [ ] Heart icon toggles saved state optimistically
- [ ] Saved state syncs to backend correctly
- [ ] "View Role" navigates to role detail page
- [ ] No results shows helpful empty state with suggestions
- [ ] Loading state shows skeleton cards

### Role Detail
- [ ] Match score ring displays correctly
- [ ] All 4 tabs (Overview/Requirements/Salary/Prep) render correctly
- [ ] Checklist items are checkable and persist
- [ ] "Apply Now" creates application and shows confirmation
- [ ] Already-applied state shows disabled "Applied ✓"
- [ ] Already-saved state shows filled heart icon
- [ ] Unavailable role shows banner

### Skills Gap
- [ ] Summary cards show correct counts
- [ ] Radar chart renders with correct axes and data
- [ ] Target role picker re-triggers analysis on change
- [ ] Overview tab shows matched skills with green tags
- [ ] Gap Details tab shows gaps sorted by priority
- [ ] Roadmap tab shows per-gap learning paths
- [ ] "Analyze Skills" button triggers AI analysis
- [ ] Empty profile state prompts profile completion

### Settings
- [ ] All profile fields are editable and save correctly
- [ ] Email field is read-only
- [ ] Avatar upload shows preview immediately
- [ ] Notification toggles update optimistically
- [ ] Integrations show correct connected/disconnected state
- [ ] GitHub/LinkedIn OAuth flows open correctly
- [ ] Data export downloads valid JSON file
- [ ] Delete account requires "DELETE" confirmation
- [ ] Delete account performs soft-delete and logs out

---

## 7. Success Metrics

| Feature | Metric | Target | Measurement |
|---------|--------|--------|-------------|
| Dashboard | Weekly active users visiting | 80% of registered | Weekly |
| Applications | Applications created per user | ≥ 3 per week | Weekly |
| Kanban | Drag-and-drop engagement | 40% of users drag at least once | Weekly |
| Resume | Resume upload rate | 60% of users upload within 7 days | Weekly |
| ATS | Average ATS score improvement | +15 points after optimization | Per user |
| Interview | Sessions started | ≥ 1 per user per month | Monthly |
| Interview | Session completion rate | 70% | Weekly |
| Roles | Jobs saved per user | ≥ 2 per week | Weekly |
| Roles | Apply-from-listing rate | 30% of saved jobs | Weekly |
| Skills | Gap analysis completion | 40% start analysis within 30 days | Monthly |
| Settings | Profile completeness | 75% fields filled | Weekly |

---

## 8. Edge Cases & Error Handling

| Page | Scenario | Expected Behavior |
|------|----------|-------------------|
| Dashboard | API returns 401 | Redirect to login with return URL |
| Dashboard | Progress API fails | Show mock data with "Using preview data" banner |
| Dashboard | PPS score is 0 | Ring shows empty, breakdown bars at 0, CTA to complete profile |
| Kanban | Drag to same column | No-op, no API call, no toast |
| Kanban | Rapid multiple drags | Queue API calls, last state wins |
| Kanban | Network fails during drag | Revert to last known good state |
| Resume | AI generation times out | Toast "Generation timed out — try again", keep existing text |
| Resume | Download fails | Toast "Download failed — try again" |
| Resume | Invalid file upload | "Only PDF and DOCX supported" error |
| Interview | Session not found (404) | 404 page with "Start new session" CTA |
| Interview | AI review fails | Show "Feedback unavailable" with score only |
| Roles | Search with special chars | Escape/sanitize input |
| Roles | Job removed while viewing | Banner "This role is no longer available" |
| Role Detail | Already applied + saved | Both states shown simultaneously |
| Skills | Target role not found | Dropdown shows suggestions |
| Settings | Save fails | Inline error, fields retain values |
| Settings | Delete account fails | Modal stays open with error message |

---

## 9. Dependencies & Constraints

### Dependencies

**Internal:**
- Authentication system (JWT, login/register pages)
- Prisma schema with all models (Application, Resume, InterviewSession, Job, SavedJob, User)
- Zustand stores (application-store, auth-store)
- API client with interceptors
- Design system (SPEC.md tokens, shadcn/ui components)

**External:**
- FastAPI AI service (port 8000): ATS scoring, interview feedback, skill gap analysis
- PostgreSQL (port 5433): All persistent data
- File storage: S3 or local filesystem for resume uploads

### Assumptions
- User has completed onboarding wizard
- User has at least one resume uploaded (for ATS scoring, application linking)
- AI services are available (graceful fallback to mock data if not)
- File storage is configured (S3 or local)

### Constraints
- Kanban drag-and-drop must work on touch devices (tablet support)
- Resume PDF/DOCX generation must not block the main thread
- Interview session must survive browser refresh (state in database)
- All API responses < 2s (timeout handling required)

---

## 10. Open Questions

- [ ] Should applications be linkable to specific saved jobs? (Owner: CPM Agent)
- [ ] What is the exact formula for PPS score calculation? (Owner: CPM Agent + Engineering)
- [ ] Should interview sessions be schedulable (future feature) or always on-demand? (Owner: CPM Agent)
- [ ] Do we support multiple target roles for skills analysis or just one? (Owner: CPM Agent)
- [ ] Should the radar chart support custom skill categories or fixed categories? (Owner: UX Agent)
- [ ] What's the file size limit for resume uploads? (Owner: CPM Agent — suggest 10MB)
- [ ] Should the role detail checklist auto-populate from interview sessions? (Owner: CPM Agent)

---

## 11. Sign-off Checklist

- [x] All user stories have clear acceptance criteria
- [x] All API contracts are defined and reviewed
- [x] Success metrics are measurable and agreed upon
- [x] Edge cases are identified and handled
- [x] Out-of-scope boundaries are explicit
- [x] Design review completed — Owner: UX Agent
- [x] Technical feasibility confirmed — Owner: Team Lead
- [x] CPM Agent sign-off: Approved
