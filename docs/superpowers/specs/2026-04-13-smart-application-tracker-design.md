# Smart Application Tracker — Design Spec

**Goal:** Transform the Applications page from a manual Kanban board into an AI-powered job-application command center with Gmail integration, automatic email detection, smart card matching, and rich application management.

**Date:** 2026-04-13

---

## 1. Gmail Onboarding

### Unconnected State
When the user lands on `/applications` without Gmail connected, the page shows a centered onboarding card (not a modal) with a soft gradient background:

- **Header**: "📧 Connect Your Gmail"
- **Subtext**: "Track job applications automatically through the email you actually use to apply — without lifting a finger."
- **Primary CTA**: "Sign in with Google" button (Google brand styling)
- **What we scan list**: Inbox + Sent emails, with ✓ icons
- **What we skip list**: Personal emails, Newsletters, Calendar invites, with ✗ icons
- **Trust section**: "🔒 Only job-related emails. Disconnect anytime. Review all detected applications before they appear."
- **Divider**: "── or ──"
- **Secondary CTA**: "Use manually — add applications yourself"

### Connected State
- Top header shows connected email with green checkmark + "Last synced: X min ago"
- "Disconnect" option available in settings
- "🔄 Syncing..." indicator during background scans
- "Review detected applications" banner appears before first board population

### Privacy Design
- Every onboarding state includes explicit "what we scan / what we skip" breakdown
- "Disconnect anytime" is prominent, not buried in settings
- "Review before they appear" reassures users they have control
- No emails are shown as applications — only parsed company + role + status

---

## 2. Kanban Board — Columns

### Stage Definitions

| Stage | Color | Trigger |
|-------|-------|---------|
| Wishlist | Slate #94A3B8 | User adds manually only |
| Applied | Teal #0D7377 | User marks as pre-submission tracking |
| Submitted | Teal #0D7377 | "Application received", "confirmation", "we've received" |
| Under Review | Purple #7C6BB2 | "Under review", "being reviewed" |
| Shortlisted | Amber #F59E0B | "Shortlisted", "moving forward", "selected" |
| Interview | Amber #F59E0B | "Interview", "schedule", "call", "meeting", "invite" |
| Offer | Green #22C55E | "Offer", "extend an offer", "compensation", "start date" |
| Rejected | Red #EF4444 | "Not moving forward", "another candidate", "decided not to proceed", "regret" |
| Archived | Gray #9CA3AF | User action only |

### Auto-Population Behavior
- First Gmail sync scans last 90 days of inbox + sent emails
- Loading state: "🔍 Scanning your emails... found X applications so far"
- "Review detected applications" banner before any cards appear on board
- User reviews each detected app (accept / edit / dismiss) before board populates
- After review, board fully populated and normal sync begins

### Board UX
- Horizontal scroll on desktop, vertical on mobile
- Column headers show stage color dot, label, card count
- Each column has "+" button for manual add
- Drag-and-drop still works for manual override
- Empty columns show dashed placeholder "Drop here"

---

## 3. Application Cards

### Card Display
- Company initial in colored circle (top-left, 32px)
- Role title (bold, 13px) + Company name below
- Location + salary range (if available)
- "Applied X days ago" + "N emails" badge
- Interview date if scheduled (highlighted in amber)
- AI-detected badge (🤖) + ATS match percentage
- Latest email snippet (1 line, clipped)

### Card States
- **AI-detected** (auto-created): 🤖 badge, "Review" option visible on hover
- **Manually added**: Clean card, no badge, user controls
- **Needs review** (low-confidence match): Yellow border + ⚠️ icon — must be confirmed by user
- **Stale** (14+ days no update): Muted card + ⏰ icon + "Follow up?" suggestion
- **Interview scheduled**: Amber highlight border, calendar icon prominent

### Quick Actions (hover menu)
- View emails
- Add note
- Set reminder
- Change stage
- Archive
- Delete

---

## 4. Email → Application Matching

### The 3-Pass Matching Engine

Each new job-related email runs through 3 passes in order:

**Pass 1 — Thread ID Match** (highest confidence: 95–99%)
- Gmail thread ID of new email matches thread ID stored on existing application
- Most reliable for recruiter-initiated multi-email conversations
- Always attempted first

**Pass 2 — Recruiter Domain Match** (confidence: 80–90%)
- Sender email domain (e.g., `@accenture.com`) matches domain associated with existing application
- Strong signal for company-initiated contact
- If multiple apps from same company exist, refine by role title similarity

**Pass 3 — Fuzzy Text Match** (confidence: 60–85%)
- Company name extracted from email body/subject
- Role title extracted from subject/body
- Matched against stored application company + role with Levenshtein distance
- Handles vague sender info or forward/reply chains

### Confidence Scoring
- Each pass produces a confidence score (0–100%)
- Pass 1 > Pass 2 > Pass 3 (first match above threshold wins)
- **Below 75% confidence**: Email goes to "Needs Review" queue — not auto-matched
- User reviews queue and confirms / corrects / dismisses each item

### Duplicate Prevention
- Before creating a new application, check if company + role combination already exists
- If exists with different stage, update stage instead of creating duplicate
- Merge emails into existing application's timeline

### Edge Cases
- **Multiple roles at same company**: Use role title similarity to disambiguate
- **Missing / vague role title**: Rely on Pass 1 + Pass 2, flag for review if none available
- **Forward/reply email chains**: Pass 3 fuzzy match handles these (extract quoted original content)
- **Recruiter name changes**: Domain match is stable across recruiter personnel changes

---

## 5. Email → Status Classification

### Keyword Mapping

| Stage | Trigger Keywords (case-insensitive) |
|-------|-------------------------------------|
| Submitted | "application received", "received your application", "confirming receipt", "we've received", "application submitted", "thank you for applying" |
| Under Review | "under review", "reviewing your application", "profile is being reviewed", "in the hiring process", "moving forward" |
| Shortlisted | "shortlisted", "selected for", "moving forward in the process", "you've been selected" |
| Interview | "interview", "invite you to", "schedule a call", "would like to meet", "technical assessment", "phone screen", "video call", "first round" |
| Offer | "offer", "extend an offer", "pleased to offer", "compensation", "start date", "offer letter", "delighted to offer" |
| Rejected | "not moving forward", "decided not to proceed", "another candidate", "going with", "regret to inform", "position has been filled", "not selected" |

### Classification Rules
- Multiple keywords can fire — system picks the **most advanced stage** (Offer > Shortlisted > Interview > Under Review > Submitted)
- Keyword matching is phrase-aware to avoid false positives ("we are excited" inside a rejection email)
- Email must be matched to an existing application before status is detected — no orphan status changes
- User can reclassify any auto-detected status via the detail drawer
- Manual status changes take precedence over auto-detection

---

## 6. Application Detail Drawer

### Layout: Side Drawer (400px wide, slides from right)

**Header section:**
- Company initial + full name
- Role title
- Location + salary range
- Status badge (editable)
- "Applied: [date] (X days ago)"
- ATS match percentage

**AI Summary section:**
- One-paragraph AI-generated summary of the application timeline
- Generated on-demand when drawer opens
- Shows: what happened when, current stage, what to expect next

**Email Timeline section:**
- Reverse-chronological list of all matched emails
- Each entry: Type badge (📧 confirmation / 📊 status / 🎯 interview / 💼 offer / ❌ rejection), date, email subject, body snippet (3 lines)
- "View full email →" expands inline or links to email
- "Auto-moved to [stage]" annotation on status-change emails
- "Auto-created from [sent/inbox] email" annotation on first email
- "+ Add note" button to add manual notes

**Follow-up Suggestions section:**
- AI-powered, triggered by time-in-stage thresholds (14+ days)
- Shows: what to do, why it matters, suggested action
- Buttons: "Draft follow-up email" (opens AI composer) / "Set reminder"

**Actions section:**
- [Update stage] — dropdown to manually change stage
- [Archive] — moves card to Archived, removes from board
- [Delete] — removes application and all matched emails
- Footer: "Connected to recruiter@[company].com · N emails matched"

---

## 7. AI Assistance Layer

### Features
1. **Auto-status summaries**: One-line AI summary on card hover
2. **Follow-up reminders**: Cards in same stage >14 days get "Follow up?" nudge in drawer
3. **Sentiment detection**: Email badges show 🟢 Positive / 🟡 Neutral / 🔴 Negative
4. **Email drafting**: "Draft follow-up" button pre-fills AI composer with company/role/context
5. **Missing info detection**: Cards missing salary/location/contact show "Add missing details" nudge
6. **Next steps**: After Interview stage, AI suggests "Send thank-you note" / "Ask about timeline"

### AI Composer
- Triggered from drawer "Draft follow-up" or "Draft thank-you"
- Pre-filled with: company name, role, recruiter name if known, what was last communicated
- User can edit before sending
- Sends via user's Gmail (not through the app's sending infrastructure)
- Draft is saved in the email timeline

---

## 8. Metrics Dashboard

### Top-of-page metrics (8 cards, horizontal row)

| Metric | Icon | Description |
|--------|------|-------------|
| Tracked | 📋 | Total applications in board (all stages) |
| Responses | ✉️ | Applications with at least one company reply |
| Response Rate | 📊 | Responses ÷ Tracked as percentage |
| Interviews | 🎯 | Cards currently in Interview stage |
| Offers | 💼 | Cards currently in Offer stage |
| Avg Stage Time | ⏱️ | Average days in current stage across all non-archived cards |
| Added this week | + | New cards (AI + manual) added in last 7 days |
| Last synced | 🔄 | Relative time since last Gmail scan |

- Each metric shows a trend arrow (↑/↓) comparing to last week
- Metrics update in real-time as cards move or new emails sync

---

## 9. Loading, Empty & Error States

### States to design for:

1. **First-time empty (no Gmail)**: Onboarding card centered on page, no board visible
2. **Syncing (first scan)**: Full-page loading state — "🔍 Scanning your emails..." with progress count
3. **Review queue (pre-population)**: List of detected applications waiting for user review before going live
4. **No job emails found**: Friendly empty state — "No job applications found in your Gmail. Try applying to jobs or add applications manually."
5. **Gmail disconnected**: Board visible but cards are stale — amber banner "Gmail disconnected. Reconnect to resume auto-tracking."
6. **Sync error**: Error banner with "Retry sync" button
7. **Manual-only mode**: Board works normally, no Gmail indicator, user adds everything manually
8. **Low-confidence queue**: Notification badge on board "⚠️ 3 emails need review" — clicking opens review drawer

---

## 10. Gmail OAuth Integration

### OAuth Flow
- Uses existing Google OAuth pattern from the codebase (same as login page)
- Scopes: `gmail.readonly`, `gmail.send` (for draft compose only)
- Callback route: `/api/auth/google/callback`
- Token stored in user's auth session (same as existing auth pattern)
- User can disconnect from settings or directly from the Applications page

### Sync Behavior
- **On connect**: Initial scan of last 90 days (background job, user sees progress)
- **Ongoing**: Polling every 15 minutes for new job-related emails
- **Manual sync**: "Sync now" button available in header
- **Disconnect**: All Gmail data purged from the app; board keeps manual cards

### Data Storage
- Matched emails stored in backend with application reference
- Thread IDs stored for Pass 1 matching
- Sender domains stored for Pass 2 matching
- No email content is stored — only metadata (from, subject, date, type, snippet)
- Full email body fetched on-demand when user opens detail drawer

---

## 11. Technical Architecture

### Route
`apps/web/src/app/(dashboard)/applications/page.tsx`

### New Files to Create
- `apps/web/src/app/(dashboard)/applications/applications.module.css` — CSS module for page
- `apps/web/src/components/applications/gmail-connect-banner.tsx` — Onboarding CTA
- `apps/web/src/components/applications/metrics-dashboard.tsx` — 8-metric row
- `apps/web/src/components/applications/review-queue.tsx` — Pre-population review UI
- `apps/web/src/components/applications/application-drawer.tsx` — Detail side drawer
- `apps/web/src/components/applications/email-timeline.tsx` — Timeline in drawer
- `apps/web/src/components/applications/ai-summary.tsx` — AI summary in drawer
- `apps/web/src/components/applications/ai-composer.tsx` — Follow-up email composer
- `apps/web/src/stores/applications-store.ts` — Enhanced Zustand store with Gmail state
- `apps/web/src/types/application.ts` — Extended type definitions
- `apps/web/src/app/api/applications/stats/route.ts` — Stats API route
- `apps/web/src/app/api/gmail/sync/route.ts` — Gmail sync endpoint
- `apps/web/src/app/api/gmail/match/route.ts` — Email matching endpoint
- `apps/web/src/app/api/gmail/classify/route.ts` — Email classification endpoint
- `apps/web/src/app/api/auth/google/callback/route.ts` — Google OAuth callback
- `apps/web/src/app/onboarding/entry/page.tsx` — Add Gmail connection option (modify)

### Existing Files to Modify
- `apps/web/src/app/(dashboard)/applications/page.tsx` — Full redesign
- `apps/web/src/components/applications/kanban-board.tsx` — Add AI badges, stale indicators
- `apps/web/src/components/applications/application-card.tsx` — Rich card redesign
- `apps/web/src/components/applications/status-column.tsx` — Update styling
- `apps/web/src/app/onboarding/entry/page.tsx` — Add Gmail connect card
- `apps/web/src/app/(dashboard)/layout.tsx` — Handle Gmail auth callback

### Data Model

```typescript
interface Application {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  status: AppStatus;
  appliedAt: string;
  lastUpdateAt: string;
  matchScore?: number;
  interviewDate?: string;
  recruiterEmail?: string;
  recruiterName?: string;
  source: 'auto' | 'manual';
  confidenceScore?: number; // 0-100, only for auto-detected
  needsReview: boolean;
  isStale: boolean;
  emails: MatchedEmail[];
  notes: ApplicationNote[];
  archivedAt?: string;
}

interface MatchedEmail {
  id: string;
  threadId: string;
  from: string;
  fromDomain: string;
  subject: string;
  snippet: string;
  date: string;
  type: 'confirmation' | 'status' | 'interview' | 'offer' | 'rejection' | 'followup' | 'other';
  sentiment: 'positive' | 'neutral' | 'negative';
  detectedStatus?: AppStatus;
  isRead: boolean;
}

interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
}

type AppStatus =
  | 'WISHLIST' | 'APPLIED' | 'SUBMITTED'
  | 'UNDER_REVIEW' | 'SHORTLISTED'
  | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ARCHIVED';

interface GmailConnection {
  email: string;
  connectedAt: string;
  lastSyncedAt: string;
  syncEnabled: boolean;
}
```

### Mock Data
All email classification and matching uses mock data initially. Real Gmail API integration is a future phase. Mock data should include:
- 3–5 applications with realistic company/role combos
- 2–6 matched emails per application
- Mix of stages (Submitted, Under Review, Interview, Offer, Rejected)
- Mix of source types (auto + manual)
- One application flagged as "needsReview"
- One stale application (no update in 14+ days)

---

## 12. Component Inventory

| Component | Description | States |
|-----------|-------------|--------|
| `GmailConnectBanner` | Onboarding prompt for Gmail connection | default, connected, loading |
| `MetricsDashboard` | 8-metric stats row at top of page | loading, ready, error |
| `KanbanBoard` (updated) | Drag-and-drop board with AI-enhanced columns | loading, empty, ready, syncing |
| `StatusColumn` (updated) | Single column with enhanced header | default, drag-over, empty |
| `ApplicationCard` (updated) | Rich card with AI badges, stale indicators | default, hover, needs-review, stale, interview-scheduled |
| `ReviewQueue` | Pre-population review list | empty, has-items |
| `ApplicationDrawer` | Side drawer with full detail view | closed, open, loading-emails |
| `EmailTimeline` | Chronological list of matched emails | loading, empty, has-emails |
| `AISummary` | AI-generated application summary | loading, ready |
| `AIComposer` | Follow-up email drafting interface | closed, open, drafting, sent |
| `SyncIndicator` | Gmail sync status in header | idle, syncing, error, disconnected |
| `ConfidenceBadge` | Shows AI match confidence | high (>85%), medium (75-85%), low (<75%) |

---

## 13. UX Principles

1. **Automation by default, control always** — AI does the work, but user can override, correct, or disable at any moment
2. **Trust through transparency** — always show what was auto-detected vs manually added, what was scanned, what matched
3. **No surprises** — the board never auto-populates without user review. First sync goes to a review queue.
4. **Rich but not overwhelming** — detail drawer has depth but is navigable. Metrics are meaningful, not vanity numbers.
5. **Smart without being creepy** — email data stays private. Only metadata is stored. No email content stored.
6. **Actionable at every step** — follow-up suggestions, AI summaries, and status recommendations are the product's main value

---

## 14. Verification Checklist

- [ ] Gmail connect button triggers OAuth flow
- [ ] First sync shows loading + progress count
- [ ] Review queue appears with detected applications before board populates
- [ ] User can accept/edit/dismiss each detected application
- [ ] Board populates after review with correct stages
- [ ] New email arrives → card moves to correct stage
- [ ] Click card → side drawer opens with timeline
- [ ] AI summary generates on drawer open
- [ ] Follow-up suggestion appears for stale cards
- [ ] Manual add works alongside auto-detected cards
- [ ] Drag-and-drop still works for manual override
- [ ] Metrics update when cards move or new emails sync
- [ ] "Disconnect Gmail" removes all Gmail data
- [ ] Manual-only mode works without Gmail
- [ ] All loading/empty/error states render correctly
- [ ] Build clean with no TypeScript errors
