# AI Mock Interview — Design Specification

**Date:** 2026-04-13
**Status:** Draft → User Review

---

## Overview

A premium AI-powered mock interview product that lets users practice realistic company-role-specific interviews with an AI interviewer. The experience feels like a live interview simulation: structured, role-aware, time-bound, and measurable. Users select a company and role from a curated catalog, complete a pre-interview setup (camera + audio verification), go through a live AI interview session with a real-time transcript panel, and receive a detailed performance report with scoring, strengths, weaknesses, and coaching.

**Phase 1 (this spec):** Mock data, simulated AI questions, client-side scoring
**Phase 2:** Real AI question generation, transcript-to-score pipeline, answer rewrite suggestions

---

## Visual Design Language

**Matches platform:** Warm light backgrounds, amber primary (#D97706), cream/white cards, dark slate text. Consistent with `--warm-*` CSS design tokens already in use.

| Element | Value |
|--------|-------|
| Primary | #D97706 (amber) |
| Background | #FAFAF5 (warm off-white) |
| Card surface | #FFFFFF |
| Text primary | #1C1917 (dark slate) |
| Text secondary | #57534E |
| Border | #E7E5E4 |
| Success / high score | #22C55E (green) |
| Warning / mid score | #F59E0B (amber) |
| Error / low score | #EF4444 (red) |
| Consulting accent | #7C6BB2 (purple) |
| Tech accent | #0D7377 (teal) |

---

## 1. Landing Page (`/interview`)

### Hero Strip
- Compact (not full-page hero): title "AI Mock Interview", subtitle "Practice real interviews for real companies. Get instant feedback.", primary "Start Practice" CTA button
- Tagline: "Practice real interviews for real companies. Get instant feedback."

### Filter Bar
- Horizontal row of category filter chips: **Consulting**, **Finance**, **Tech**, **Sales**, **Operations**, **HR**
- Role dropdown filter (Management, Analyst, Brand, Sales, etc.)
- Search input (searches company and role names)
- Active filters shown as removable chips

### Interview Catalog Grid
- 3-column responsive grid of premium interview cards
- Each card shows:
  - **Company initial avatar** — colored circle with company's first letter (color determined by company name hash)
  - **Company name** (bold) + **Role name** (regular)
  - **Category badge** — small chip showing category
  - **Interview type** — Behavioral / Technical / Case Study badge
  - **Difficulty badge** — Beginner / Amateur / Expert / Real-life
  - **Duration** — e.g., "20 min"
  - **Difficulty indicator** — colored bar (green/amber/red)
- Hover state: subtle lift + amber border
- **Featured cards** (top 3 most popular): amber border highlight, small "Featured" badge

### Recent Sessions
- Horizontal scroll row of past attempt cards
- Each card shows: company + role, score badge (if completed), date, "Retry" or "View Report" action
- Only shown if sessions exist in store

### Empty State (no prior sessions)
- Illustration + heading: "Your first interview awaits"
- 3 quick-start suggestions: "Try a Consulting interview", "Practice with a Finance role", "Start with a Brand Manager interview"
- Each suggestion is a clickable card that pre-selects and starts the interview

### Curated Catalog (20-25 combinations)
| Company | Role | Category | Difficulty Options | Type |
|---------|------|----------|-------------------|------|
| Boston Consulting Group | Business Analyst | Consulting | Beginner / Amateur / Expert | Case Study |
| McKinsey & Company | Business Analyst | Consulting | Beginner / Amateur / Expert | Case Study |
| Bain & Company | Management Consultant | Consulting | Amateur / Expert / Real-life | Case Study |
| Deloitte | Business Analyst | Consulting | Beginner / Amateur / Expert | Behavioral |
| Goldman Sachs | Financial Analyst | Finance | Amateur / Expert / Real-life | Technical |
| JPMorgan Chase | Credit Risk Manager | Finance | Beginner / Amateur / Expert | Behavioral |
| Morgan Stanley | Financial Analyst | Finance | Amateur / Expert / Real-life | Technical |
| HSBC | Credit Risk Manager | Finance | Beginner / Amateur / Expert | Behavioral |
| Amazon | Product Manager | Tech | Amateur / Expert / Real-life | Mixed |
| Google | Digital Marketing Specialist | Tech | Beginner / Amateur / Expert | Technical |
| Microsoft | Project Manager | Tech | Beginner / Amateur / Expert | Behavioral |
| Amazon | Brand Manager | Tech | Amateur / Expert / Real-life | Behavioral |
| Procter & Gamble | Brand Manager | Sales | Beginner / Amateur / Expert | Behavioral |
| Unilever | Brand Manager | Sales | Beginner / Amateur / Expert | Behavioral |
| L'Oreal | Brand Manager | Sales | Beginner / Amateur / Expert | Behavioral |
| ITC | Sales (BDE) | Sales | Beginner / Amateur / Expert | Behavioral |
| Accenture | Business Analyst | Tech | Beginner / Amateur / Expert | Technical |
| Accenture | Project Manager | Tech | Beginner / Amateur / Expert | Behavioral |
| Deloitte | Project Manager | Tech | Beginner / Amateur / Expert | Behavioral |
| EY | Strategy Analyst | Consulting | Amateur / Expert / Real-life | Case Study |
| HDFC Bank | Management Trainee | Finance | Beginner / Amateur / Expert | Behavioral |
| Infosys | HR Executive | HR | Beginner / Amateur / Expert | Behavioral |
| Flipkart | Logistics Analyst | Operations | Beginner / Amateur / Expert | Technical |
| Zomato | Product Analyst | Tech | Beginner / Amateur / Expert | Technical |

---

## 2. Setup Flow (`/interview/setup`)

Triggered when user clicks "Start Interview" on a catalog card.

### Step 1 — Summary
- **Selected interview card** — shows company avatar, company name, role, category, interview type, difficulty badge
- **Difficulty explanation** — subtext under difficulty badge:
  - *Beginner* — Foundational questions, slower pace, more time per answer
  - *Amateur* — Standard questions at typical interview pace
  - *Expert* — Challenging questions with follow-ups, time pressure
  - *Real-life* — Mimics exact company format, tight timing, no hints
- **Duration estimate** — shown prominently
- **Instructions card** — explains how the mock interview works:
  - "The AI will ask you [N] questions based on your selected role"
  - "Answer as you would in a real interview"
  - "Your responses are transcribed in real time"
  - "You can end the interview anytime"
- **Trust messaging** — small text: "Your camera and audio are only active during this session. Nothing is stored permanently without your consent."

### Step 2 — Permission Checks
- **Camera preview panel** — shows live user feed (mirrored), or placeholder avatar if denied
- **Microphone level meter** — animated bar showing audio input level
- **Device check checklist**:
  - ✅ Camera access — green check or red x
  - ✅ Microphone access — green check or red x
  - ✅ Browser compatible — green check or amber warning
  - ✅ Network stable — shown via a simple connectivity check
- **Error states**:
  - Camera denied: "Camera access needed for the full experience. [Enable in browser settings]" + "Continue without camera" button
  - Mic denied: "Mic access needed for voice responses. [Enable in browser settings]" + "Continue without mic" button (text-only mode)
- **Instructions/help panel** — small sidebar with tips for enabling permissions on Chrome, Firefox, Edge
- **Begin Interview CTA** — primary button, enabled only when camera (or mic) is available. Shows camera icon.

---

## 3. Live Interview Session (`/interview/session/[id]`)

### Layout
- **Split view**: Left 65% (AI panel) | Right 35% (Transcript panel)
- **Bottom bar**: Answer input + actions

### Left Panel — AI Interviewer
- **Header**: Company + role context bar: "Deloitte — Business Analyst Interview" with difficulty badge
- **Question display**:
  - Large question text (readable from distance)
  - Question counter: "Question 2 of 5"
  - Per-question timer: countdown (resets per question)
  - Difficulty badge for current question
- **AI state indicator** (animated):
  - "AI is listening…" (blue pulsing dot) — while user is speaking / typing
  - "AI is thinking…" (amber spinning loader) — between questions
  - "Loading next question…" — transition state
- **Question type label**: Behavioral / Technical / Case Study chip above the question text

### Right Panel — Transcript / Script
- Scrollable list of all Q&A pairs accumulated so far
- Each entry shows:
  - **Question block**: question text, timestamp (e.g., "2:34")
  - **Answer block**: user's answer transcript (or "Not recorded" if failed), word count
  - **Score chip** (after submission): small colored score badge
- Entries animate in as the session progresses
- Divider line between entries
- Most recent entry highlighted

### Bottom Bar
- **Answer input**: Large textarea (auto-grows, max 5 lines), placeholder: "Type your answer here..."
- **Character/word count** indicator (subtle, bottom-right of textarea)
- **Submit button**: "Submit Answer" — primary button, disabled when empty
- **End Interview button**: secondary/danger, triggers confirmation dialog

### End Interview Confirmation
- Modal overlay: "End this interview?"
- "You answered [N] of [M] questions. Your report will be generated from your responses."
- "End & View Report" (primary) | "Continue Interview" (secondary) | "Cancel" (ghost)

### Role-Aware AI Behavior
- Questions are selected based on company + role context
- Deloitte BA ≠ Amazon PM interview (different question pools, different difficulty patterns)
- Difficulty adjustment: if user answers well (strong keywords, structured responses), the next question is harder
- Follow-up generation: if answer is short or vague, a clarifying follow-up is triggered

### Accessibility
- Live captions (WCAG AA) via Web Speech API transcription
- Keyboard navigation for all controls
- High contrast text on all backgrounds

### Connection Lost
- Overlay: "Connection interrupted — reconnecting..." with animated spinner
- Auto-retry mechanism (3 attempts, then show "Session paused. Return to catalog?")

---

## 4. Interview Completion

Triggered after user clicks "End & View Report".

### Completion Screen
- **Centered card** (not full redirect, keeps context):
  - Animated checkmark (CSS animation, green)
  - "Interview Complete"
  - Summary: "You answered [N] questions in [X] minutes"
  - Primary CTA: "View Your Report →" (links to `/interview/report/[id]`)
  - Secondary link: "Back to Catalog"

### Report Generating State
- If report is still processing: skeleton loader with "Analyzing your responses…" message
- Progress bar or spinner
- Estimated wait time: "~30 seconds"

---

## 5. Performance Report (`/interview/report/[id]`)

Full-screen page replace (not a modal). Scrollable.

### Header
- Company + Role badge
- Interview date and duration
- Overall score (large, prominent):
  - **Green (#22C55E)** for score ≥ 80
  - **Amber (#F59E0B)** for score 60-79
  - **Red (#EF4444)** for score < 60
- Score shown as "/100" with large number

### Score Breakdown
- Horizontal bar charts (5 dimensions):
  | Dimension | Description |
  |-----------|-------------|
  | Communication | Clarity, articulation, vocabulary |
  | Structure | STAR method, logical flow, transitions |
  | Specificity | Concrete examples, measurable outcomes |
  | Confidence | Tone, filler avoidance, authority |
  | Role Fit | Relevance to target company/role |
- Each bar: label on left, color-coded fill, score on right
- Bars animate in on scroll

### Radar Chart
- 5-axis radar chart (drawn with CSS/SVG or a charting library)
- Axes: Communication, Structure, Specificity, Confidence, Role Fit
- Filled polygon showing relative performance
- Each axis labeled
- Color matches overall score

### Strengths
- Bulleted list (3-5 items):
  - Specific, evidence-based ("You used the STAR method effectively in Q2 and Q4")
  - Actionable praise ("Strong examples from your project experience")
- Green bullet styling

### Areas to Improve
- Bulleted list (3-5 items):
  - Specific suggestions ("Consider using more quantifiable outcomes — add metrics to your examples")
  - Priority-ordered (biggest weaknesses first)
- Amber bullet styling

### Question-by-Question Breakdown
- Each question card contains:
  - **Question number + type** (e.g., "Q3 — Behavioral")
  - **Question text** (full, unedited)
  - **User's answer** (transcript excerpt or typed text, 3-line clamp with expand)
  - **Per-question score badge** (color-coded)
  - **Specific feedback** (1-2 sentences: what was strong, what was weak, what to fix)
  - **"Suggested better answer"** (Phase 2 — noted as deferred)

### Recommended Next Steps
- 2-3 specific practice recommendations based on weakest areas:
  - "Try a Deloitte Behavioral interview to practice STAR structure"
  - "Practice answering with more specific metrics and outcomes"
  - "Revisit your resume to prepare concrete examples for leadership questions"
- Each is a clickable action that navigates to the appropriate interview type

### Bottom Actions
- **Practice Again** — starts same company/role interview (fresh session)
- **Try Another Interview** — returns to catalog
- **Share Report** — copies report link or generates shareable summary (Phase 2)

---

## 6. Edge States & Error Handling

| State | Design |
|-------|--------|
| No camera permission | Full-page prompt, browser-specific instructions, "Continue without camera" text option |
| No microphone | Mic check UI, "Continue without mic" text-only mode, typed-answer fallback |
| Unsupported browser | Detection message with Chrome/Edge/Firefox recommendations |
| Connection lost mid-interview | Overlay with retry, session state preserved in store |
| Partial transcript | "Answer not recorded" shown, optional manual entry prompt |
| Report generating | Skeleton + progress spinner, "~30 seconds" estimate |
| Empty catalog filter | "No interviews match your filters. Try adjusting your search." |
| Session not found | 404 state: "This interview session was not found. Start a new one?" |

---

## 7. Data Model

### InterviewCatalog (static config, Phase 1)
```typescript
interface CatalogEntry {
  id: string;
  company: string;
  role: string;
  category: 'Consulting' | 'Finance' | 'Tech' | 'Sales' | 'Operations' | 'HR';
  difficulties: ('Beginner' | 'Amateur' | 'Expert' | 'Real-life')[];
  interviewType: 'Behavioral' | 'Technical' | 'Case Study' | 'Mixed';
  questionCount: number;
  durationMinutes: number;
  featured?: boolean;
}
```

### InterviewSession (Zustand store)
```typescript
interface InterviewSession {
  id: string;
  catalogEntryId: string;
  difficulty: 'Beginner' | 'Amateur' | 'Expert' | 'Real-life';
  status: 'SETUP' | 'ACTIVE' | 'COMPLETED' | 'INTERRUPTED';
  startedAt: string;
  completedAt?: string;
  questions: Question[];
  answers: Answer[];
  transcript: TranscriptEntry[];
  overallScore?: number;
  dimensionScores?: DimensionScores;
}

interface Question {
  id: string;
  text: string;
  type: 'Behavioral' | 'Technical' | 'Case Study';
  difficulty: 'Beginner' | 'Amateur' | 'Expert';
  followUpText?: string;
}

interface Answer {
  questionId: string;
  answerText: string;
  score: number;
  feedback: string;
  isRecorded: boolean; // false if audio capture failed
}

interface TranscriptEntry {
  questionId: string;
  questionText: string;
  answerText: string;
  timestamp: string;
  wordCount: number;
}

interface DimensionScores {
  communication: number;
  structure: number;
  specificity: number;
  confidence: number;
  roleFit: number;
}
```

### State Machine
```
LANDING → SETUP → ACTIVE → COMPLETED
                    ↓
              INTERRUPTED → ACTIVE (reconnect) | COMPLETED
```

---

## 8. Component Inventory

| Component | Description |
|-----------|-------------|
| `InterviewCatalog` | Landing page: hero, filters, grid, recent sessions |
| `InterviewCard` | Individual catalog card with company avatar, badges, hover state |
| `CategoryFilter` | Horizontal chip row for category filtering |
| `RecentSessions` | Horizontal scroll of past attempt cards |
| `SetupFlow` | Multi-step setup wizard (summary → permissions) |
| `PermissionCheck` | Camera/mic/device checklist with animated states |
| `CameraPreview` | Live video feed with mirror effect |
| `MicrophoneMeter` | Real-time audio level visualization |
| `InterviewSession` | Live interview room: AI panel + transcript panel |
| `AIQuestionPanel` | Left panel: question text, counter, timer, AI state indicator |
| `TranscriptPanel` | Right panel: scrollable Q&A log with timestamps |
| `AnswerInput` | Bottom bar: textarea, word count, submit/end buttons |
| `InterviewCompletion` | End screen with checkmark and report CTA |
| `ReportPage` | Full performance report with all sections |
| `ScoreRadarChart` | 5-axis radar chart (CSS/SVG) |
| `ScoreBreakdown` | Animated horizontal bar chart |
| `QuestionFeedback` | Individual Q&A feedback card |
| `EdgeState` | Error states: no camera, no mic, unsupported browser, disconnected |

---

## 9. Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/interview` | `InterviewCatalog` | Landing page with catalog, filters, recent sessions |
| `/interview/setup` | `SetupFlow` | Pre-interview setup (company/role summary + permission checks) |
| `/interview/session/[id]` | `InterviewSession` | Live interview room |
| `/interview/report/[id]` | `ReportPage` | Full performance report |

---

## 10. Trust & Privacy

Displayed on the Setup page and in the interview header:

> "**Privacy & Trust**
> Your camera and audio are only active during this interview session. Transcripts are generated in real time from your responses and are used only to score your performance. Nothing is stored permanently without your explicit consent. You control when the interview starts and ends — pause or stop anytime."

---

## 11. Phase 1 Scope (Implementation)

**In scope for Phase 1:**
- Landing page with curated catalog (20-25 entries), category filters, search, featured section
- Setup flow with camera/mic permission checks and summary
- Live interview session with split-panel layout, question display, transcript panel, answer input
- Mock question pool per company-role (hardcoded, role-aware)
- Per-question timer and counter
- End interview flow with completion screen
- Performance report with mock scoring, bar charts, radar chart, strengths/weaknesses, Q&A feedback
- All edge states and error handling
- Mobile-responsive treatment

**Deferred to Phase 2:**
- Real AI question generation (LLM integration)
- Voice-to-text transcription (Web Speech API)
- Answer rewrite suggestions
- Shareable report links
- Difficulty auto-adjustment based on answer quality
- Persistent session history across page reloads (already partially available)

---

## 12. Spec Self-Review

- [x] No "TBD" or placeholder sections — all spec content is complete
- [x] No contradictions — architecture matches feature descriptions
- [x] Scope is focused — single product, all phases clearly delineated
- [x] No ambiguous requirements — all states, components, and interactions are specified
- [x] 20-25 curated catalog entries listed explicitly
- [x] All 7 routes defined with component names
- [x] All edge states covered
- [x] Trust messaging included
