# Dashboard

The protected dashboard section of the Placement Copilot web application. All routes under `(dashboard)/` require authentication and render inside the dashboard shell layout.

## Routes

```
(dashboard)/
├── dashboard/          # Main analytics dashboard
├── applications/      # Kanban application tracker
├── interview/         # Mock interview sessions
│   └── [sessionId]/   # Individual interview session
├── resume/           # Resume builder
├── roles/            # Job discovery and search
│   └── [roleId]/     # Individual role details
├── skills/           # Skill gap analysis
└── settings/        # User preferences
```

## Dashboard Layout (`layout.tsx`)

The dashboard shell wraps all dashboard pages with:

- **Sidebar** (`components/layout/sidebar.tsx`) - Navigation sidebar for desktop. Collapsible via UI store.
- **Header** (`components/layout/header.tsx`) - Top bar with user menu and notifications.
- **BottomNav** (`components/layout/bottom-nav.tsx`) - Mobile bottom tab navigation.
- **Mock Auth Bypass** - Demo mode auto-logs in a mock user when `isAuthenticated` is false.

### Auth Flow

1. `middleware.ts` checks for `accessToken` cookie or `Authorization` header
2. If missing on a protected route, redirects to `/login`
3. On login, the API returns JWT tokens stored in `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. On 401 responses, interceptor attempts token refresh
6. If refresh fails, redirects to `/login`

## Pages

### Dashboard (`/dashboard`)

The main landing page after login. Displays:

- **Greeting header** with time-of-day message and streak counter
- **Quick action cards** linking to Build Resume, Mock Interview, Find Roles, Skill Gap
- **PPS Score card** with circular progress ring and breakdown bars (profile, skills, resume, interview)
- **Stats grid** with Active Applications, Interviews Scheduled, Match Score, Skills Gap Closed
- **Milestone tracker** showing progress journey
- **CTA banner** for upcoming interviews
- **Active applications list** with company logo, role, status badge, and days since applied
- **Role recommendations** grid with match percentage badges

**Data Source:** `progressApi.get()` (falls back to `MOCK_DASHBOARD`)

### Applications (`/applications`)

Kanban board for managing job applications across 7 status columns:

| Column | Color | Transitions |
|--------|-------|-------------|
| Draft | Gray | Submitted, Withdrawn |
| Submitted | Blue | Under Review, Rejected, Withdrawn |
| Under Review | Amber | Interview, Rejected, Withdrawn |
| Interview | Purple | Offered, Rejected, Withdrawn |
| Offered | Green | Withdrawn |
| Rejected | Red | (terminal) |
| Withdrawn | Gray | (terminal) |

**Components:**
- `KanbanBoard` - Horizontal scrolling board with all columns
- `StatusColumn` - Individual column with droppable cards
- `ApplicationCard` - Card showing company, role, status, match score

**Data Source:** `applicationApi.getAll()` with Zustand `application-store`

### Interview (`/interview`)

Mock interview hub with three sections:

1. **Upcoming Interviews** - Scheduled interviews with readiness status
2. **Interview Type Selector** - Three card-based type picker:
   - Behavioral (20 min, 5 questions, purple)
   - Technical (45 min, 3 questions, teal)
   - Mixed (30 min, 4 questions, orange)
3. **Past Sessions** - Completed interviews with score rings and feedback links

Starting an interview navigates to `/interview/<sessionId>`.

**Data Source:** `interviewApi.getSessions()` (falls back to `PAST_SESSIONS`)

### Interview Session (`/interview/<sessionId>`)

Full-screen interview interface with:

- Question cards with category, difficulty, and timer
- Answer input area
- Real-time scoring
- Feedback panel after completion

### Resume (`/resume`)

Resume builder with split-pane editor and live preview:

1. **Template Picker** - Horizontal scroll of 4 templates (Modern, Minimal, Executive, Creative)
2. **Section Editor** (Tabs):
   - Header (name, contact info, links)
   - Summary (with AI generate button)
   - Experience (company, title, period, bullets)
   - Education (school, degree, year, GPA)
   - Skills (tag-based input)
   - Projects (name, description, tech)
3. **Live Preview** - Scaled resume preview that updates in real-time
4. **Download Actions** - PDF and DOCX export buttons
5. **ATS Optimization** - "Optimize for ATS" button calls `resumeApi.optimize()`

**Data Source:** `resumeApi.get()` (falls back to `mockResume`)

### Roles (`/roles`)

Job discovery page with search and filtering:

1. **Search bar** - Full-text search across roles and companies
2. **Filter chips** - Quick filters: 90%+ Match, Remote, Student, Entry Level, >$80k
3. **View toggle** - Grid/List view switcher
4. **Role cards** - Company logo, role title, location, salary, skills tags, match badge
5. **Save/bookmark** - Heart icon to save roles
6. **Quick Apply** - CTA button linking to role details

**Data Source:** `jobApi.list()` (falls back to `MOCK_ROLES`)

### Skills (`/skills`)

Skill gap analysis with three tabs:

1. **Overview Tab**:
   - Summary cards (skills tracked, gaps identified, high priority, overall readiness)
   - Radar chart showing skill levels across 6 categories
   - Top priority gaps with progress bars
2. **Gap Details Tab**:
   - Full list of gaps with severity badges, category tags, current vs. target progress
   - Resource count per gap
3. **Learning Roadmap Tab**:
   - Week-by-week structured learning paths
   - Resource cards with platform, type, duration, and start button

**AI Analysis:** "Run AI Analysis" button calls `skillGapApi.analyze()`

**Data Source:** `skillGapApi.analyze()` (falls back to `SKILL_DATA`, `GAPS`, `RESOURCES`)

### Settings (`/settings`)

User preferences organized in 4 tabs:

1. **Profile** - Personal info, headline, social links, target roles, danger zone
2. **Notifications** - Email and push notification toggles
3. **Integrations** - Connected accounts (GitHub, LinkedIn, Google)
4. **Privacy** - Profile visibility, data export, account deletion

## State Management

Three Zustand stores:

### `auth-store.ts`
- `user` - Current user object
- `accessToken` / `refreshToken` - JWT tokens
- `isAuthenticated` - Boolean
- `login(user, accessToken, refreshToken)` - Set auth state
- `logout()` - Clear auth state

### `application-store.ts`
- `applications` - Array of applications
- `columns` - Applications grouped by status (Kanban format)
- `setApplications(apps)` - Populate from API
- `isLoading` - Loading state
- Exports `KANBAN_COLUMNS` constant

### `ui-store.ts`
- `sidebarCollapsed` - Sidebar toggle state
- `toggleSidebar()` - Toggle method

## API Client (`lib/api.ts`)

Axios-based client with:

- Base URL: `http://localhost:3001`
- Request interceptor: Attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: Auto-refreshes tokens on 401, redirects to login on refresh failure
- Timeout: 15 seconds

### API Namespaces

```typescript
authApi          // login, register, refreshToken, logout, googleAuth
profileApi       // get, create, update, uploadResume, getResume
resumeApi        // upload, getAll, getById, optimize, delete, get, update, etc.
jobApi           // search, getById, getRecommended, list, getSaved, recommendations
applicationApi   // getAll, create, update, delete, getStats
interviewApi     // getTypes, getSessions, start, getById, submitAnswer, etc.
skillGapApi      // analyze, getRoadmap, trackProgress
progressApi      // getDashboardStats, get, getPPS, getStreak, updateActivity
notificationApi  // getAll, markRead, markAllRead, register
```
