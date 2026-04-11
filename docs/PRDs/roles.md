# Roles / Job Listings PRD — Placement Copilot AI
**Status:** Approved
**Owner:** CPM Agent
**Stakeholders:** UX Agent, Team Lead, Engineering
**Last Updated:** 2026-04-11
**Design System:** Sovereign Careerist (v2.0)

---

## 1. Overview & Vision

The Roles page is the **discovery engine** of Placement Copilot AI — where intent meets opportunity. It must feel less like a job board and more like a **curated private marketplace** where every role has been pre-vetted for relevance. The experience is editorial-first: generous whitespace, intentional asymmetry, and a premium tonal hierarchy that communicates authority. Users should feel they're browsing a high-end recruitment concierge, not scrolling a database dump.

The Roles page lives at **`/roles`** and its detail companion at **`/roles/[roleId]`**. Together they form the full discovery-to-application funnel: browse → filter → save → evaluate → apply.

---

## 2. User Stories

```
As a job seeker
I want to search and filter job listings with precision
so that I can find roles that match my skills, location preferences, and salary requirements

As a job seeker
I want to see a match score for each role relative to my profile
so I can quickly prioritize high-relevance opportunities

As a job seeker
I want to save roles I'm interested in for later
so I can track them across sessions without re-searching

As a job seeker
I want to switch between grid and list views
so the browsing experience fits my preference

As a job seeker
I want to apply to a role directly from the listing
so the path from discovery to application is frictionless

As a job seeker
I want to see detailed role information including salary, benefits, and interview prep
so I can make informed decisions before applying

As a job seeker
I want to check off application prep items for a role
so I can track my readiness before submitting
```

---

## 3. Design System Compliance (Sovereign Careerist v2.0)

### Color Application
| Role | Token | Hex |
|------|-------|-----|
| Primary / Brand | `primary` | `#003178` |
| AI / Secondary | `secondary` | `#006879` |
| Success / Growth | `accent` / `success` | `#2ad760` |
| Warning | `warning` | `#f59e0b` |
| Error | `error` | `#dc2626` |
| Background Canvas | `surface` / `background` | `#f9f9ff` |
| Card Surface | `surface-container-highest` | `#ffffff` |
| Section Background | `surface-container-low` | `#f1f3ff` |
| Section Mid | `surface-container-mid` | `#f5f6ff` |
| On Surface | `on-surface` | `#141b2c` |
| On Surface Variant | `on-surface-variant` | `#434652` |
| On Surface Disabled | `on-surface-disabled` | `#a0a4b0` |
| Outline Ghost | `outline-variant` | `rgba(121,122,134,0.15)` |

### Design Rules (Critical)
- **NO solid 1px borders** — boundaries via tonal shifts only (`surface-container-low` → `surface-container-highest`)
- **No pure black** — `#141b2c` is the darkest text
- **No sharp corners** — minimum `rounded-lg` (8px), prefer `rounded-xl` (16px)
- **Shadows tinted** — ambient shadows use `rgba(20,27,44,0.08)` not grey
- **Font: Manrope** (display/headlines), **Inter** (body/UI)
- **Glassmorphism** for floating elements: `glass` class (72% white + 20px backdrop blur)
- **Ghost borders** only when accessibility demands: `border border-outline-variant`

### Typography Scale
| Role | Font | Size | Weight |
|------|------|------|--------|
| Page Title | Manrope | 2xl (1.5rem) | Bold (700) |
| Card Title | Inter | base (1rem) | Semibold (600) |
| Card Subtitle | Inter | sm (0.875rem) | Normal |
| Body Text | Inter | sm (0.875rem) | Normal |
| Badge Text | Inter | xs (0.75rem) | Medium |
| Caption | Inter | xs (0.75rem) | Normal |
| Subtle Text | Inter | sm (0.875rem) | Normal |

---

## 4. Page 06 — Roles / Job Listings (`/roles`)

### Layout
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (fixed left)   │  Main Content Area        │
│  - Dashboard            │  ┌─────────────────────┐ │
│  - Roles [ACTIVE]        │  │ Discover Roles       │ │
│  - Resume               │  │ subtitle text        │ │
│  - Interview            │  ├─────────────────────┤ │
│  - Applications         │  │ [Search bar        ] │ │
│  - Skills               │  │ [Filter pills      ] │ │
│  - Settings             │  │ [Grid/List toggle  ] │ │
│  ─────────────────       │  ├─────────────────────┤ │
│  User avatar + name     │  │ Result count text   │ │
└──────────────────────────│  │ ┌────┐┌────┐┌────┐ │ │
                          │  │ │Card││Card││Card│ │ │
                          │  │ └────┘└────┘└────┘ │ │
                          │  │ ┌────┐┌────┐┌────┐ │ │
                          │  │ │Card││Card││Card│ │ │
                          │  │ └────┘└────┘└────┘ │ │
                          │  └─────────────────────┘ │
                          └──────────────────────────┘
```

### Components

#### 4.1 Page Header
- Title: **"Discover Roles"** — `font-display text-2xl font-bold text-on-surface`
- Subtitle: **"Find opportunities that match your skills and goals"** — `text-sm text-on-surface-variant`
- No card wrapper — direct tonal shift on canvas

#### 4.2 Search Bar
- Full-width input, `h-11` (44px tall)
- `bg-surface-container-low` background
- `border border-outline-variant` (15% ghost border)
- Left icon: `Search` (lucide, 20px, `text-on-surface-variant`)
- Right icon: clear button (×) appears when input has value, `text-on-surface-disabled`
- Placeholder: `"Search roles, companies..."`
- `focus-visible:ring-secondary` (cyan ring)
- **Debounce: 300ms** — triggers API call on keystroke with 300ms delay
- **Enter key** submits immediately (bypasses debounce)
- `surface-shift` transition on focus (subtle bg shift)

#### 4.3 Filter Pills Row
- Horizontal scrollable row, `flex gap-2 overflow-x-auto pb-2` (no forced wrap)
- 5 filter pills + view toggle group:
  | Label | Icon | Behavior |
  |-------|------|----------|
  | `90%+ Match` | Zap | Match score ≥ 90 |
  | `Remote` | Globe | Location includes "Remote" |
  | `Student` | Briefcase | Entry-level keywords |
  | `Entry Level` | Building2 | Entry level tags |
  | `>$80k` | DollarSign | Salary min ≥ $80k |
  | `Clear all` | X | Appears when any filter active (right-aligned) |

**Active state:** `bg-primary text-white` with primary shadow
**Inactive state:** `bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low`
**Pill shape:** `rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap`

**Filter logic:** Client-side AND — all active filters must pass. Results re-filtered on every filter toggle.

#### 4.4 View Toggle (Grid/List)
- Appears at the **right edge** of the filter row, `ml-auto flex-shrink-0`
- Container: `bg-surface-container-low rounded-lg p-1 flex gap-1`
- Two icon buttons side by side:
  - **Grid:** `Grid` icon (lucide, 16px)
  - **List:** `List` icon (lucide, 16px)
- Active: `bg-surface-container-highest shadow-ambient-sm text-primary`
- Inactive: `text-on-surface-variant`
- Preference persisted to **`job-view-mode`** key in localStorage

#### 4.5 Result Count
- Text: `"N role(s) found"` or `"Loading..."` — `text-sm text-on-surface-variant mb-4`
- Updates reactively as filters/search change
- Skeleton text during loading

#### 4.6 Job Cards — Grid View
3-column responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

Each card:
- `bg-surface-container-highest rounded-xl shadow-ambient-sm surface-shift hover:shadow-ambient-md`
- **NO border** — depth via shadow + tonal contrast only
- **Left accent bar** (4px): colored by match score — green `>=90`, amber `70-89`, blue `<70`
- Padding: `p-4`

Card anatomy (grid):
```
┌─────────────────────────────────┐
│ [90%]        ♥  ← Match badge, save heart
│ ┌──────┐                       │
│ │  G   │  ← Company initial (40×40, bg-secondary-container, rounded-lg)
│ └──────┘                       │
│ Senior Engineer                │ ← Title: `font-semibold text-on-surface`
│ Google                       │ ← Company: `text-sm text-on-surface-variant`
│ 📍 San Francisco, CA          │ ← Location with icon
│ $120k – $180k                 │ ← Salary in `text-success font-medium`
│ [React] [TypeScript] [Node]   │ ← Up to 3 skill tag badges (scrollable)
│ ┌─────────────────────────┐   │
│ │ View Role →             │   │ ← Button: full width, variant="secondary"
│ └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Match badge colors:**
- `>= 90`: `bg-success/12 text-success`
- `70–89`: `bg-warning/12 text-warning`
- `< 70`: `bg-surface-container-low text-on-surface-variant`

**Company initial circle:** 40×40, `bg-secondary-container text-secondary font-bold rounded-lg flex items-center justify-center`, shows first letter of company name

**Save heart button:**
- Position: top-right corner of card
- `p-1.5 rounded-lg hover:bg-surface-container-low surface-shift`
- Unsaved: `Heart` icon, `text-on-surface-disabled`
- Saved: `Heart` icon, `fill-error text-error` (filled red)
- Click → optimistic toggle → API call → revert on error

**View Role button:** Full-width, `h-9 text-sm`, variant `"secondary"` (cyan fill)

#### 4.7 Job Rows — List View
Single-column: `space-y-3`

Each row:
- `bg-surface-container-highest rounded-xl shadow-ambient-sm surface-shift hover:shadow-ambient-md p-4 flex items-center gap-4`
- No left accent bar in list view
- Layout:
```
┌──────────────────────────────────────────────────────────────┐
│ [G] │ Senior Engineer │ Google │ $120k–$180k │ San Francisco │ │
│ 40px│ text-on-surface│ text-on│ text-success│ text-sm muted │ │
│     │  font-semibold │surface-│  font-medium│               │ │
│     │               │variant │            │               │ │
│     │  [90%]        │  📍    │   [React]  │  ♥  │  View → │ │
│     │  badge        │        │             │heart│ btn     │ │
└──────────────────────────────────────────────────────────────┘
```
- Match badge, location, skill tags (up to 2), heart button, View Role button all in one horizontal row
- Salary shown inline after company name

#### 4.8 Empty State
- Centered in content area: `text-center py-16`
- Icon: `Briefcase` (lucide, 48px, `text-on-surface-disabled`)
- Message: `"No roles found matching your filters."` — `text-on-surface-variant mb-3`
- If filters active: `"Clear filters"` Button variant `"ghost"` below message
- If search active: shows query in message: `"No roles match '[query]'"`

#### 4.9 Loading State (Skeleton)
- 6 skeleton cards matching card dimensions
- Each skeleton card: company initial circle, title lines, subtitle lines, tags, button
- Background: `bg-surface-container-high` shimmer

---

## 5. Page 07 — Role Detail (`/roles/[roleId]`)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  Sidebar   │  ┌──────────────────────────────────────────┐  │
│            │  │ [←] [Company Logo] Job Title           │  │
│            │  │     Company Name                        │  │
│            │  ├──────────────────────────────────────────┤  │
│            │  │ [Match Ring] │ [Quick Info] │ [Details] │  │
│            │  ├──────────────────────────────────────────┤  │
│            │  │ [Apply Now — Google (full width)]        │  │
│            │  ├──────────────────────────────────────────┤  │
│            │  │ [Overview][Requirements][Salary][Prep]   │  │
│            │  │ Tab content...                           │  │
│            │  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Components

#### 5.1 Detail Header
- Back button: `←` arrow, `p-2 rounded-lg hover:bg-surface-container-low surface-shift`
- Company logo (or initial circle): 48×48, rounded-full, `bg-hero text-white`
- Job title: `font-display text-xl font-bold text-on-surface`
- Company name: `text-sm text-on-surface-variant`
- Share button: top-right of header row
- Save heart button: fills red on save, `p-2 rounded-lg hover:bg-surface-error/5 surface-shift`

#### 5.2 Match Score Card
- `bg-surface-container-highest rounded-xl shadow-ambient-sm p-4 flex flex-col items-center`
- **Match ring:** 128×128 SVG ring with score in center
  - Ring stroke: `secondary` color (`#006879`)
  - Score: large number, color-coded (red/amber/blue/green)
  - Below ring: "Your match score" label in `text-sm text-on-surface-variant`
- Ring color by score:
  - `0–40`: `#dc2626` (red)
  - `41–60`: `#f59e0b` (amber)
  - `61–80`: `#006879` (cyan)
  - `81–100`: `#2ad760` (green)

#### 5.3 Quick Info Card
- `bg-surface-container-highest rounded-xl shadow-ambient-sm p-4`
- Grid layout: location, salary, company size, founded date
- Each row: `flex items-center gap-2 text-sm`
- Remote badge: `Badge variant="secondary"` with globe icon

#### 5.4 Company Details Card
- `bg-surface-container-highest rounded-xl shadow-ambient-sm p-4`
- Fortune rank badge if applicable
- Glassdoor rating if available

#### 5.5 Apply Now Button
- **Pre-application:** Full-width, `h-14 text-lg font-semibold rounded-xl bg-primary text-white hover:bg-primary-light shadow-ambient-sm btn-hover-shift`
- Text: `"Apply Now — {Company}"` e.g. `"Apply Now — Google"`
- On click: calls `POST /api/applications`, shows toast, updates state
- **Post-application:** Full-width disabled button with emerald green:
  - `"Applied ✓"` + `CheckCircle` icon
  - `"View in Applications →"` secondary link button below

#### 5.6 Tabbed Content (4 tabs)
Uses shadcn `Tabs` component with `TabsList`, `TabsTrigger`, `TabsContent`.

**TabsList:** `bg-surface-container-low rounded-xl p-1 mb-6`
**TabsTrigger active:** `bg-surface-container-highest text-primary shadow-ambient-sm rounded-lg`
**TabsTrigger inactive:** `text-on-surface-variant hover:text-on-surface`

##### Overview Tab
- **About the Role:** `prose` rendered job description, paragraphs separated
- **Why You Match:** Bulleted list of match reasons with `CheckCircle` green icons

##### Requirements Tab
- **Required Skills:** Cards with `CheckCircle` green icon, skill name, "Required" badge (`bg-error/12 text-error`)
- **Nice to Have:** Cards with `Heart` icon, "Differentiator" badge (`bg-secondary-container text-secondary`)

##### Salary & Benefits Tab
- Large centered salary display: `text-3xl font-bold text-success`
- Benefits grid: `grid-cols-2 md:grid-cols-3 gap-3`
  - Each benefit: `p-3 rounded-lg bg-surface-container-mid flex items-center gap-2`
  - `CheckCircle` green icon + benefit name text

##### Application Prep Tab
- **AI Tips Card:** `bg-warning/5 border border-warning/20 rounded-xl p-4`
  - Title: AI Application Tips with lightbulb/warning icon
  - Bulleted list of tips
- **Resume Match:** Progress bar showing keyword coverage percentage
  - Progress value in `text-primary font-bold`
  - Caption: `"Your resume covers N% of this role's keywords"`
- **Application Checklist:** 5 checkbox items, checked state persisted to localStorage
  - Each item: `flex items-center gap-3 p-3 rounded-lg border border-outline-variant`
  - Checkbox: `accent-[#006879] rounded` custom styled
  - Checked items show strikethrough text style
  - LocalStorage key: `role-checklist-{roleId}`
  - List items:
    1. "Researched company mission and values"
    2. "Reviewed job description keywords"
    3. "Prepared STAR stories for common questions"
    4. "Practiced with mock interview"
    5. "Tailored resume for this role"

---

## 6. API Contracts

### GET /api/jobs
```
Query params:
  query?: string          // Search text (title, company, keywords)
  page?: number          // Default 1
  limit?: number          // Default 20, max 50
  filters?: string        // Comma-separated: "remote,90plus,entry_level,salary_80k"
  sort?: "relevance"|"newest"|"salary_high"|"salary_low"
  location?: string       // Filter by location
  salaryMin?: number     // Minimum salary filter

Response 200:
{
  "data": [...],         // Array of job objects
  "total": 143,          // Total matching count
  "page": 1,
  "limit": 20,
  "meta": { ... }
}

Job object shape:
{
  "id": "uuid",
  "title": "Senior Software Engineer",
  "company": {
    "name": "Google",
    "logo": "https://...",
    "size": "10,000+",
    "founded": 1998,
    "glassdoorRating": 4.4,
    "fortuneRank": 2
  },
  "location": "San Francisco, CA",
  "locationType": "HYBRID|REMOTE|FULLY_REMOTE|ONSITE",
  "salary": { "min": 120000, "max": 180000 },
  "salaryRange": "$120k – $180k",
  "postedAt": "2026-04-05T00:00:00Z",
  "matchScore": 87,
  "keywords": ["React", "TypeScript", "Node.js", "Python"],
  "description": "...",
  "matchReasons": ["Your React experience matches", "..."],
  "requirements": [
    { "name": "React", "required": true },
    { "name": "TypeScript", "required": false }
  ],
  "benefits": ["Health Insurance", "401k", "Unlimited PTO"],
  "applicationTips": ["Focus on system design", "..."],
  "isActive": true,
  "source": "linkedin"
}
```

### GET /api/jobs/recommended
```
Response 200: [...jobs]  (max 3 on dashboard, up to 20 on roles page)
```

### GET /api/jobs/:id
```
Response 200: { job object }
```

### GET /api/saved-jobs
```
Response 200: [
  {
    "id": "uuid",
    "jobId": "uuid",
    "savedAt": "ISO8601",
    "job": { ...job object }
  }
]
```

### POST /api/saved-jobs
```
Body: { "jobId": "uuid" }
Response 201: { "id": "uuid", "jobId": "uuid", "savedAt": "ISO8601" }
```

### DELETE /api/saved-jobs/:id
```
Response 204: No content
```

### POST /api/applications
```
Body: {
  "company": "Google",
  "position": "Senior Software Engineer",
  "jobId": "uuid",           // optional
  "savedJobId": "uuid",      // optional
  "resumeId": "uuid",        // optional
  "status": "SUBMITTED",
  "notes": "..."
}
Response 201: { "id": "uuid", "company": "...", "position": "...", "status": "SUBMITTED", ... }
```

---

## 7. Zustand Store

### job-store.ts
```typescript
interface JobStore {
  savedJobIds: string[];           // Set of saved job IDs
  viewMode: "grid" | "list";       // Grid or list toggle
  toggleSave: (jobId: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
}
```
- Persisted to localStorage key `job-storage`
- `savedJobIds` updated optimistically on heart toggle
- `viewMode` rehydrated from localStorage on mount

---

## 8. Data Flow

```
User types in search
  → 300ms debounce
  → GET /api/jobs?query=...&page=1&limit=20
  → unwrap res.data?.items ?? res.data?.data ?? res.data ?? []
  → setJobs(jobs)
  → filterJobs(clientSide)  ← applies active filter pills

User toggles filter pill
  → add/remove from activeFilters[]
  → filterJobs(clientSide)  ← no API call

User saves job (heart click)
  → toggleSave(jobId)       ← optimistic: add/remove from savedJobIds
  → POST /api/saved-jobs or DELETE /api/saved-jobs/:id
  → on error: toggleSave(jobId) again ← revert

User clicks "View Role"
  → router.push(`/roles/${job.id}`)

User clicks "Apply Now"
  → POST /api/applications
  → setHasApplied(true)
  → toast.success("Application added to your tracker")
```

---

## 9. State Management

| State | Location | Persistence |
|-------|----------|-------------|
| Jobs list | `useState` in RolesPage | None (refetch on mount/search) |
| Saved jobs | `jobStore.savedJobIds` | localStorage (`job-storage`) |
| View mode | `jobStore.viewMode` | localStorage (`job-storage`) |
| Active filters | `useState` | None (session only) |
| Search query | `useState` | None (debounced) |
| Checklist | `useState` with localStorage | `role-checklist-{roleId}` |

---

## 10. Acceptance Criteria

### `/roles` Page
- [ ] Search bar triggers API call on Enter and icon click
- [ ] Live search debounced at 300ms
- [ ] 5 filter pills toggle correctly (AND logic for multiple)
- [ ] Grid/List toggle persists to localStorage across sessions
- [ ] Job cards display: title, company, location, salary, match badge, skills, date
- [ ] Heart icon toggles saved state optimistically
- [ ] Saved state syncs to backend (save/unsave API calls)
- [ ] "View Role" navigates to role detail page
- [ ] No results shows helpful empty state with query-aware message
- [ ] "Clear filters" CTA resets all filters and re-fetches
- [ ] Loading state shows 6 skeleton cards
- [ ] Skeleton shimmer matches new light color scheme
- [ ] Empty board: "No roles found" centered with icon

### `/roles/[roleId]` Page
- [ ] Match score ring renders with correct color coding
- [ ] All 4 tabs (Overview/Requirements/Salary & Benefits/Prep) render correctly
- [ ] Checklist items checkable, state persisted to localStorage
- [ ] "Apply Now" creates application and shows Applied ✓ confirmation
- [ ] Already-applied state shows disabled Applied button + "View in Applications" link
- [ ] Already-saved state shows filled heart icon
- [ ] Role unavailable (isActive=false) shows banner
- [ ] Back button returns to /roles
- [ ] Share button copies URL to clipboard with toast

---

## 11. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Roles page visits per user | ≥ 2/week | Weekly |
| Saved jobs per user | ≥ 2/week | Weekly |
| Apply-from-listing rate | 30% of saved jobs | Weekly |
| Search usage | 60% of sessions use search | Weekly |
| Filter usage | 40% of sessions use ≥1 filter | Weekly |
| Role detail bounce rate | < 30% | Weekly |

---

## 12. Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Search with special chars (`<>&'\"`) | Input sanitized before API call |
| Job removed while viewing detail | Banner "This role is no longer available" at top |
| Already applied + already saved | Both states shown simultaneously |
| Salary not listed | Show `"Salary not disclosed"` instead of range |
| Match score not available | Omit badge from card |
| Very long job title | Truncate with ellipsis at 2 lines (`line-clamp-2`) |
| No jobs at all (empty DB) | Empty state "No roles available yet" |
| Network error during save | Heart reverts to previous state + toast error |
| Rapid toggle save/unsave | Debounce at 500ms to prevent race conditions |

---

## 13. Non-Functional Requirements

- **Performance:** Job search results < 500ms response time (API)
- **Performance:** Filter toggle instant (client-side, no re-fetch)
- **Performance:** Skeleton shimmer max 1.5s animation loop
- **Accessibility:** All interactive elements keyboard navigable
- **Accessibility:** Focus ring uses cyan (`secondary`) per design system
- **Compatibility:** Mobile: bottom nav present, 2-column grid collapses to 1 column
- **Responsive breakpoints:** `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px
