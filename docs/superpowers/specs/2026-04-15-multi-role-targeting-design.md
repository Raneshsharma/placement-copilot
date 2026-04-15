# Multi-Role Targeting — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users target 2-4 related roles simultaneously, maintain one master resume, and generate customized application materials for each role — without managing multiple documents. Discovery (Exploration A) + Narrative Management (Storytelling C).

**Architecture:** Role-Augmented Existing Pages — no new hub. Existing pages are each "role-aware," surfacing role context inline. Roles are managed through a persistent Role Panel drawer (slide-in from right, 320px wide) accessible from any page. Active role is global context via Zustand store. Resume variants use a separate overlay table model (master bullets untouched, overlay stores custom summary + bullet priority map + keywords + custom bullets). LinkedIn enriches the master resume only; never directly influences targeting.

**Tech Stack:** Next.js App Router, Prisma ORM, NestJS API, Zustand global state, Playwright E2E.

---

## 1. Product Framing

**What we're building:** A multi-role targeting system that lets users explore related career directions, maintain one master resume, and generate customized application materials for each role — without managing multiple documents.

**Core insight:** Most job seekers aren't one-dimensional. They have 2-4 roles they're genuinely targeting simultaneously, and each role requires a different story about the same person. The platform's job is to make managing those different stories effortless, not laborious.

**How it fits EliteStack:** "Stop guessing. Start targeting." — EliteStack already helps users optimize resumes and prepare for interviews. Multi-role targeting extends that by making *what you're targeting* a first-class, intentional choice — with AI tailoring everything downstream.

---

## 2. User Personas

**Primary — The Career Explorer**
Sarah, 26, graduating with a Political Science degree and 2 years of analyst experience. Skills transfer across three directions: Business Analyst, Data Analyst, and Product Analyst. Uses LinkedIn to research each path, finds the inconsistency exhausting, and wants one place where her experience gets reframed for each audience. Uses the role panel frequently and wants smart defaults.

**Primary — The Story Teller**
Marcus, 34, senior consultant targeting three very different audiences: FAANG companies (leads with strategy), boutique consultancies (leads with delivery depth), and government agencies (leads with compliance and scale). His master resume tells the full truth; his role overlays tell the right story for each audience.

**Secondary — The Focused Applicant**
Priya, 29, knows she wants to be a Data Analyst. Adds one primary role, uses the overlay to customize her resume, and barely touches the role panel. Benefits from multi-role targeting without needing the exploration aspect.

---

## 3. Product Concept & Core Experience

### Role Panel
The central UI atom — a slide-in drawer accessible from any dashboard page, showing:
- All target roles with ranked priority (primary role highlighted with amber badge)
- Each role's overlay summary: title, keyword count, skill gap score
- Quick actions per role: Edit Overlay, Set as Primary, Remove
- "Add Role" button at top (search + free text input)
- Bottom: "Active Role: [dropdown]" for quick switching — always visible
- Empty state: "Add your first target role" with search input

### Active Role
Global context stored in Zustand auth session. Surfaced throughout the platform:
- Resume Builder header: "Building for: [Business Analyst ▾]"
- Interview Practice: "Want to practice BA-specific questions?" dismissible prompt
- Dashboard: active role's overlay stats in widget
- Apply flow: smart-match reads active role context

### Role Overlay
Role-specific customization layered on top of the master resume:
- **customSummary**: text that overrides master's summary for this role
- **bulletPriorityMap**: JSON map of sectionId → ordered array of bulletIds with priority scores
- **keywordSet**: string[] of ATS-optimized keywords specific to this role's postings
- **customBullets**: role-specific achievements not in the master resume

### Apply Flow Smart-Match
1. User clicks "Apply to this job"
2. System analyzes job posting keywords against each active role's overlay
3. Auto-selects best-matching role's variant
4. Shows preview: "Applying with [Business Analyst] overlay — highlights your SQL and stakeholder management experience"
5. User confirms or picks a different role variant
6. Application recorded as primary, linked to that role overlay

---

## 4. Information Architecture

**New surface: Role Panel drawer** — slide-in from right, 320px wide, accessible via header icon (target icon) from any dashboard page. Not a route.

**Existing surfaces, role-aware:**
- `/roles` — Role listing grid with overlay previews inline. Primary role badge.
- `/resume` — Resume list with role overlay indicators. Role selector in builder header. Role variants shown as tabs within the builder.
- `/applications` — Primary vs variant applications per job posting.
- `/interview` — Contextual role-specific prompts as dismissible prompts.
- `/skills` — Per-role tabs + cross-role priority sidebar.

**Data flow:**
```
Role Panel → Active Role Context (Zustand) → All role-aware surfaces
Master Resume + Role Overlay → Resume Renderer → Preview/Export/Apply
Job Posting → Keyword Analyzer → Best Role Match → Apply Flow Preview
```

**URL structure:** No new top-level routes. Roles are data, not pages. `/roles` is the role browser (enriched). Role Panel is the management interface.

---

## 5. Key Features

### V1 — Foundation (Week 1-6)

**5.1 Role Panel drawer**
- Slide-in drawer from right (320px wide), accessible via header icon + floating FAB on dashboard
- Add role via search (job database) or free text
- Edit, delete, rank, set primary role per role
- Quick-switch active role dropdown at bottom, always visible
- Empty state with illustration and inline search

**5.2 Role overlays**
- Separate `RoleOverlay` table: customSummary, bulletPriorityMap, keywordSet, customBullets
- Inline overlay editor accessible from Role Panel (edit button per role)
- AI-assisted summary generation from master summary + role keywords
- AI-assisted keyword set generation from job database

**5.3 Resume builder with role context**
- Role selector dropdown in builder header: "Building for: [Business Analyst ▾]"
- Role overlay editor as a right panel tab: "[Sections] | [BA Overlay] | [DA Overlay]"
- When editing overlay tab: shows summary editor, bullet priority sliders, keyword tag input, custom bullets list
- Resume renderer merges master + active overlay at display/export time

**5.4 Apply flow smart-match**
- Job keyword analyzer: extracts keywords from posting description
- Match scorer: scores each active role's overlay against posting keywords
- Apply modal: shows recommended role with preview text explaining the match
- User can override with role selector showing ATS match scores per role
- Application linked to role via `linkedRoleTitle` string field on Application (free-text, denormalized — no FK needed)

**5.5 Per-role application tracking**
- Primary application per job posting linked to one role overlay
- Variant applications ("also applied as DA") stored as separate records
- Application list shows role badge per application
- Application detail shows which role overlay was used

### V2 — Differentiation (Week 7-12)

**5.6 Guided role discovery**
- Post-onboarding mini-wizard: analyze resume + LinkedIn → suggest 2-4 role families with confidence scores
- Three steps: suggestions → rank → name your story
- Skippable; returning users go straight to self-directed flow

**5.7 Role Stories**
- Short 2-3 sentence positioning statement per role
- AI-generated from overlay data + LinkedIn data
- Used in cover letter drafts and interview prep warmup

**5.8 Cross-role skill priority**
- Skills module sidebar: "Skills shared by N active roles" with leverage scores
- Highlighted skills are the highest-leverage investments

**5.9 Interview prep role prompts**
- More contextual role-specific question banks with difficulty levels
- Non-blocking prompts — user can always proceed without selecting a role

**5.10 LinkedIn profile export**
- Separate output track from role overlay
- Generates LinkedIn-optimized headline + summary from master resume

---

## 6. UX Flow

### First-time user flow
1. User completes onboarding (resume upload / LinkedIn connect / build-from-scratch)
2. Lands on dashboard → Profile Setup Banner → "Import Now"
3. Goes to `/onboarding/entry` → selects path → lands on dashboard
4. Dashboard shows empty Role Panel prompt: "Ready to target your first role?"
5. User opens Role Panel → adds first role via search → sets as primary → optionally customizes overlay
6. V1: self-directed. V2: if not yet done, onboarding wizard suggests roles.

### Returning user flow
1. Lands on dashboard → active role's overlay stats in dashboard widget
2. Works in Resume Builder → role selector in header shows active role
3. Browses jobs → clicks Apply → smart-match preview shown → confirms → application tracked

### Adding a second role
1. User opens Role Panel from any page
2. Clicks "Add Role" → search modal → finds "Data Analyst" → adds it
3. System prompts: "Want to customize how your resume looks for this role?" → Yes → inline overlay editor in panel
4. Role gets ranked second. User can drag to reorder or set as primary.

---

## 7. UI/UX Recommendations

### Role Panel drawer
- Slide-in from right, 320px wide, accessible via header icon + floating FAB on dashboard
- Header: "My Roles" + "Add Role" button
- Each role card: title, priority badge (#1 / #2), keyword count, skill gap ring, three-dot menu (edit / set primary / remove)
- Primary role: bold amber "PRIMARY" badge
- Bottom: "Active: [dropdown]" quick-switcher, always visible
- Empty state: illustration + "Add your first target role" with inline search

### Resume Builder with role context
- Header bar: role selector dropdown ("Building for: [Business Analyst ▾]")
- Left panel: section editor (contact, summary, experience, education, skills)
- Right panel: tab bar "[All Sections] | [BA Overlay] | [DA Overlay]" — tabs switch which overlay is being edited
- When "All Sections" selected: right panel shows master resume in read mode with "customize" button per section
- When overlay tab selected: right panel shows overlay editor (summary, bullet priorities, keywords, custom bullets)

### Apply flow with smart-match
- Step 1: "Apply" button on job card
- Step 2: modal with recommended role variant + preview: "This variant highlights your SQL experience for this Data Analyst role"
- Step 3: role selector if user wants to override (active role overlays with ATS match scores)
- Step 4: confirm → application created → redirected to application tracker

### Role-aware surfaces
- `/roles`: grid/list with overlay preview inline on each card
- `/skills`: per-role tabs + cross-role priority sidebar (V1 shows per-role tabs, V2 adds sidebar)
- `/interview`: dismissible prompt "Practice [Role]-specific questions?" on session start

---

## 8. Data & Logic Model

### New tables

```prisma
model RoleOverlay {
  id             String   @id @default(cuid())
  userId         String
  roleTitle      String   // free-text role title (e.g., "Business Analyst")
  isPrimary      Boolean  @default(false)
  customSummary  String?
  bulletPriorityMap Json? // { "experience": ["bullet-1", "bullet-3", "bullet-2"], "projects": [...] }
  keywordSet     String[] // ATS keywords for this role
  customBullets  Json?    // [{ sectionId, text }]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([userId, roleTitle])
}

model UserRole {
  id        String       @id @default(cuid())
  userId    String
  roleTitle String       // free-text or linked to job database title
  overlayId String?
  priority  Int          @default(0) // lower = higher priority
  isActive  Boolean     @default(false)
  createdAt DateTime     @default(now())

  @@unique([userId, roleTitle])
}
```

### Changes to existing tables
- `Application`: add nullable `linkedRoleTitle String` field

### Logic
- `getActiveRole(userId)` → returns UserRole with `isActive: true` or highest `priority`
- `getMasterResume(userId)` + `getOverlay(userId, roleTitle)` → resume renderer
- `analyzeJobMatch(jobKeywords, userOverlays[])` → returns scored overlay match
- Resume renderer: merge master bullets ordered by `bulletPriorityMap`, substitute `customSummary`, inject `keywordSet` into ATS optimization

---

## 9. AI Opportunities

**9.1 Guided role discovery (V2)**
Analyze resume text + LinkedIn headline → suggest 2-4 role families with confidence scores.
Prompt: "Based on resume content and LinkedIn headline, suggest 2-4 role families this person might target. Return role title + match score + reasoning."

**9.2 Overlay summary generation (V1)**
Given master resume summary + target role keywords → generate a role-specific summary.
User edits, not just accepts.

**9.3 Smart-match ATS scoring (V1)**
Score each active role's overlay against job posting keywords.
Return: match percentage, missing keywords, highlighted strengths. Powers apply flow recommendation.

**9.4 Custom bullet suggestions (V1)**
Given role context + industry → suggest 2-3 custom bullets.
"Try adding: Presented quarterly metrics dashboards to C-suite executives, reducing decision latency by 40%."

**9.5 Role Story generation (V2)**
Given overlay data → generate a 2-3 sentence positioning statement.
"I bridge the gap between data and decisions — translating complex datasets into actionable insights for business stakeholders."

---

## 10. Risks

**Overwhelm risk** — Users with 3-4 active overlays may feel paralyzed. Mitigation: strong visual hierarchy in Role Panel, "active role" always prominent, overlay diffs shown explicitly on each role card.

**Overlay maintenance fatigue** — When master resume updates, overlays can go stale. Mitigation: overlay editor warns when master resume changed since last overlay update. Keywords auto-refreshable from job database.

**"Which resume am I using?" confusion** — Smart-match is powerful but opaque. Mitigation: recommendation preview explicitly shows reasoning ("matches 8/12 keywords from Data Analyst overlay").

**Engineering complexity of distributed role context** — Role-aware surfaces across 5-6 modules. Mitigation: global Zustand role context store with a single `useActiveRole()` hook that any component subscribes to. Role context flows through one hook, not prop-drilled.

**Schema migration risk** — Adding `RoleOverlay` and `UserRole` tables, modifying `Application`. Mitigation: feature-flagged rollout. Role features disabled for users who haven't been migrated.

---

## 11. Implementation Phases

### Phase 1 — Foundation (Week 1-2)
- Prisma migration: add `RoleOverlay` and `UserRole` tables, add `linkedRoleTitle` to `Application`
- Build Role Panel drawer component (global, accessible via header icon + floating FAB)
- Add role search and CRUD in Role Panel
- Primary role ranking, switcher, Zustand store
- `useActiveRole()` hook

### Phase 2 — Resume Integration (Week 3-4)
- Role overlay editor within Resume Builder
- Resume renderer that merges master + overlay
- Role selector dropdown in Resume Builder header
- Role variant tabs: "[Sections] | [BA Overlay] | [DA Overlay]"
- Overlay save flow

### Phase 3 — Apply Flow & Tracking (Week 5-6)
- Job keyword analyzer API endpoint
- Smart-match algorithm and scoring
- Apply modal with recommendation preview
- Application → Role linkage
- Primary + variant application model

### Phase 4 — Skills + Interview (Week 7)
- Per-role skill gap tabs in Skills module
- Cross-role priority sidebar (V2)
- Interview practice role prompts (non-blocking)
- Dashboard widget showing active role overlay stats

### Testing
- E2E: Role Panel CRUD (add, edit, delete, rank, set primary, switch active)
- E2E: Apply flow with smart-match recommendation
- E2E: Resume builder with role overlay editing and preview
- Unit: Overlay merge logic (bullet ordering, summary substitution, keyword injection)
- Unit: Keyword match scoring algorithm

---

## Appendix: Component Inventory

| Component | Description | States |
|-----------|-------------|--------|
| `RolePanel` | Slide-in drawer, global | open, closed, empty |
| `RoleCard` | Role item in panel | default, primary, editing, hover |
| `RoleOverlayEditor` | Right panel in Resume Builder | editing-summary, editing-bullets, editing-keywords, editing-custom |
| `RoleSelector` | Dropdown in builder header | closed, open, selected |
| `ApplyModal` | Apply confirmation with smart-match | recommended, override, confirming |
| `SkillGapTabs` | Per-role tab bar in Skills | tab-per-role, active-tab |
| `CrossRoleSidebar` | V2: shared skills sidebar | empty, populated |
| `RolePrompt` | Dismissible interview prompt | shown, dismissed |
