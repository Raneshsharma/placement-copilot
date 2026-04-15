# Smart Application Tracker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete AI-powered application tracker with Gmail integration, automatic email detection, smart Kanban board, rich detail drawer, and metrics dashboard. Two phases: mock-based Phase 1, then real Gmail integration Phase 2.

**Architecture:** Next.js App Router dashboard page with Zustand store. Phase 1 uses mock data for all email scanning and classification. Phase 2 adds real Gmail OAuth, email ingestion API, and classification logic. CSS Modules for component isolation.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion, Lucide React, Zustand, `@hello-pangea/dnd` (drag-and-drop), CSS Modules.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `apps/web/src/types/application.ts` | Extended TypeScript types |
| `apps/web/src/stores/applications-store.ts` | Enhanced Zustand store |
| `apps/web/src/app/(dashboard)/applications/applications.module.css` | CSS Module |
| `apps/web/src/components/applications/gmail-connect-banner.tsx` | Gmail onboarding card |
| `apps/web/src/components/applications/metrics-dashboard.tsx` | 8-metric row |
| `apps/web/src/components/applications/application-card.tsx` | Rich card redesign |
| `apps/web/src/components/applications/status-column.tsx` | Updated column |
| `apps/web/src/components/applications/review-queue.tsx` | Pre-population review |
| `apps/web/src/components/applications/application-drawer.tsx` | Detail side drawer |
| `apps/web/src/components/applications/email-timeline.tsx` | Email list in drawer |
| `apps/web/src/components/applications/ai-summary.tsx` | AI summary block |
| `apps/web/src/app/(dashboard)/applications/page.tsx` | Main page composition |
| `apps/web/src/app/api/applications/stats/route.ts` | Stats API |
| `apps/web/src/app/api/gmail/sync/route.ts` | Gmail sync (Phase 2) |
| `apps/web/src/app/api/gmail/match/route.ts` | Email matching (Phase 2) |
| `apps/web/src/app/api/auth/google/callback/route.ts` | Google OAuth callback (Phase 2) |

---

## Task 1: TypeScript Types

**Files:**
- Create: `apps/web/src/types/application.ts`
- Modify: `apps/web/src/types/index.ts` (add re-export)

- [ ] **Step 1: Write the type definitions**

```typescript
export type AppStatus =
  | 'WISHLIST' | 'APPLIED' | 'SUBMITTED'
  | 'UNDER_REVIEW' | 'SHORTLISTED'
  | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ARCHIVED';

export type EmailType =
  | 'confirmation' | 'status' | 'interview' | 'offer' | 'rejection' | 'followup' | 'other';

export type EmailSentiment = 'positive' | 'neutral' | 'negative';

export type ApplicationSource = 'auto' | 'manual';

export interface MatchedEmail {
  id: string;
  threadId: string;
  from: string;
  fromDomain: string;
  subject: string;
  snippet: string;
  body?: string;
  date: string;
  type: EmailType;
  sentiment: EmailSentiment;
  detectedStatus?: AppStatus;
  isRead: boolean;
}

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Application {
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
  source: ApplicationSource;
  confidenceScore?: number;
  needsReview: boolean;
  isStale: boolean;
  emails: MatchedEmail[];
  notes: ApplicationNote[];
  archivedAt?: string;
}

export interface GmailConnection {
  email: string;
  connectedAt: string;
  lastSyncedAt: string;
  syncEnabled: boolean;
}

export interface ApplicationStats {
  total: number;
  responses: number;
  responseRate: number;
  interviews: number;
  offers: number;
  avgStageDays: number;
  addedThisWeek: number;
  lastSyncedAt?: string;
}

export const KANBAN_COLUMNS: { id: AppStatus; label: string; color: string }[] = [
  { id: 'WISHLIST',     label: 'Wishlist',      color: '#94A3B8' },
  { id: 'APPLIED',      label: 'Applied',       color: '#0D7377' },
  { id: 'SUBMITTED',    label: 'Submitted',     color: '#0D7377' },
  { id: 'UNDER_REVIEW', label: 'Under Review',  color: '#7C6BB2' },
  { id: 'SHORTLISTED',  label: 'Shortlisted',   color: '#F59E0B' },
  { id: 'INTERVIEW',    label: 'Interview',     color: '#F59E0B' },
  { id: 'OFFER',        label: 'Offer',         color: '#22C55E' },
  { id: 'REJECTED',     label: 'Rejected',      color: '#EF4444' },
  { id: 'ARCHIVED',     label: 'Archived',      color: '#9CA3AF' },
];
```

- [ ] **Step 2: Re-export from types index**

Add to `apps/web/src/types/index.ts`:
```typescript
export * from './application';
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/types/application.ts apps/web/src/types/index.ts
git commit -m "feat(applications): add extended TypeScript types"
```

---

## Task 2: Enhanced Zustand Store

**Files:**
- Create: `apps/web/src/stores/applications-store.ts`
- Modify: `apps/web/src/stores/index.ts` (add re-export)

- [ ] **Step 1: Write the enhanced store**

The store manages all application state, Gmail connection status, review queue, and drawer state.

```typescript
import { create } from 'zustand';
import type { Application, AppStatus, GmailConnection, MatchedEmail, ApplicationNote } from '@/types/application';

// Mock data for Phase 1 — realistic job applications with email threads
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    company: 'Accenture',
    role: 'Strategist',
    location: 'New York, NY',
    salary: '$95K–$120K',
    status: 'INTERVIEW',
    appliedAt: '2026-04-05',
    lastUpdateAt: '2026-04-12',
    matchScore: 88,
    interviewDate: '2026-04-16',
    source: 'auto',
    confidenceScore: 92,
    needsReview: false,
    isStale: false,
    recruiterEmail: 'recruiter@accenture.com',
    recruiterName: 'Sarah Chen',
    emails: [
      {
        id: 'e1', threadId: 't1', from: 'recruiter@accenture.com', fromDomain: 'accenture.com',
        subject: 'Update on your Strategist application',
        snippet: 'Thank you for your patience. We would like to invite you to interview...',
        date: '2026-04-12', type: 'interview', sentiment: 'positive',
        detectedStatus: 'INTERVIEW', isRead: true,
      },
      {
        id: 'e2', threadId: 't1', from: 'recruiter@accenture.com', fromDomain: 'accenture.com',
        subject: 'Application under review',
        snippet: 'Your application for the Strategist role is currently under review...',
        date: '2026-04-08', type: 'status', sentiment: 'neutral',
        detectedStatus: 'UNDER_REVIEW', isRead: true,
      },
      {
        id: 'e3', threadId: 't1', from: 'you@gmail.com', fromDomain: 'gmail.com',
        subject: 'Application: Strategist at Accenture',
        snippet: 'Dear Accenture Recruiting Team, I am writing to apply for the Strategist...',
        date: '2026-04-05', type: 'confirmation', sentiment: 'neutral',
        detectedStatus: 'SUBMITTED', isRead: true,
      },
    ],
    notes: [{ id: 'n1', content: 'Had a great call with Sarah. She mentioned the team is expanding.', createdAt: '2026-04-10' }],
  },
  {
    id: 'app-2',
    company: 'Boston Consulting Group',
    role: 'Associate Consultant',
    location: 'Boston, MA',
    salary: '$120K–$145K',
    status: 'SUBMITTED',
    appliedAt: '2026-04-08',
    lastUpdateAt: '2026-04-08',
    matchScore: 91,
    source: 'auto',
    confidenceScore: 88,
    needsReview: false,
    isStale: false,
    emails: [
      {
        id: 'e4', threadId: 't2', from: 'you@gmail.com', fromDomain: 'gmail.com',
        subject: 'Application: Associate Consultant',
        snippet: 'Dear BCG Recruiting, I am applying for the Associate Consultant position...',
        date: '2026-04-08', type: 'confirmation', sentiment: 'neutral',
        detectedStatus: 'SUBMITTED', isRead: true,
      },
      {
        id: 'e5', threadId: 't2', from: 'recruiting@bcg.com', fromDomain: 'bcg.com',
        subject: 'We have received your application',
        snippet: 'Thank you for your interest in BCG. We have received your application...',
        date: '2026-04-08', type: 'confirmation', sentiment: 'positive',
        detectedStatus: 'SUBMITTED', isRead: true,
      },
    ],
    notes: [],
  },
  {
    id: 'app-3',
    company: 'Stripe',
    role: 'Product Manager',
    location: 'Remote',
    salary: '$140K–$180K',
    status: 'UNDER_REVIEW',
    appliedAt: '2026-04-03',
    lastUpdateAt: '2026-04-09',
    matchScore: 85,
    source: 'manual',
    needsReview: false,
    isStale: false,
    emails: [
      {
        id: 'e6', threadId: 't3', from: 'recruiting@stripe.com', fromDomain: 'stripe.com',
        subject: 'Your application to Stripe',
        snippet: 'Hi, we have received your application and are currently reviewing...',
        date: '2026-04-09', type: 'status', sentiment: 'neutral',
        detectedStatus: 'UNDER_REVIEW', isRead: true,
      },
    ],
    notes: [{ id: 'n2', content: 'Applied directly through Stripe website.', createdAt: '2026-04-03' }],
  },
  {
    id: 'app-4',
    company: 'Notion',
    role: 'UX Designer',
    location: 'San Francisco, CA',
    status: 'OFFER',
    appliedAt: '2026-03-20',
    lastUpdateAt: '2026-04-10',
    matchScore: 78,
    salary: '$110K–$135K',
    source: 'auto',
    confidenceScore: 95,
    needsReview: false,
    isStale: false,
    recruiterEmail: 'talent@notion.so',
    emails: [
      {
        id: 'e7', threadId: 't4', from: 'talent@notion.so', fromDomain: 'notion.so',
        subject: 'We are pleased to extend an offer',
        snippet: 'We are delighted to extend an offer for the UX Designer position...',
        date: '2026-04-10', type: 'offer', sentiment: 'positive',
        detectedStatus: 'OFFER', isRead: true,
      },
      {
        id: 'e8', threadId: 't4', from: 'talent@notion.so', fromDomain: 'notion.so',
        subject: 'Interview follow-up',
        snippet: 'Great speaking with you. We would like to move forward with...',
        date: '2026-04-05', type: 'interview', sentiment: 'positive',
        detectedStatus: 'INTERVIEW', isRead: true,
      },
    ],
    notes: [],
  },
  {
    id: 'app-5',
    company: 'Datadog',
    role: 'Data Analyst',
    location: 'Remote',
    salary: '$90K–$110K',
    status: 'REJECTED',
    appliedAt: '2026-03-15',
    lastUpdateAt: '2026-03-28',
    matchScore: 72,
    source: 'manual',
    needsReview: false,
    isStale: false,
    emails: [
      {
        id: 'e9', threadId: 't5', from: 'careers@datadog.com', fromDomain: 'datadog.com',
        subject: 'Update on your Data Analyst application',
        snippet: 'We have decided not to proceed with your application at this time...',
        date: '2026-03-28', type: 'rejection', sentiment: 'negative',
        detectedStatus: 'REJECTED', isRead: true,
      },
    ],
    notes: [],
  },
  {
    id: 'app-6',
    company: 'Netflix',
    role: 'Data Analyst',
    location: 'Los Gatos, CA',
    salary: '$100K–$130K',
    status: 'WISHLIST',
    appliedAt: '',
    lastUpdateAt: '2026-04-11',
    matchScore: 68,
    source: 'manual',
    needsReview: false,
    isStale: false,
    emails: [],
    notes: [],
  },
  {
    id: 'app-7',
    company: 'McKinsey',
    role: 'Business Analyst',
    location: 'Chicago, IL',
    salary: '$95K–$115K',
    status: 'SHORTLISTED',
    appliedAt: '2026-03-28',
    lastUpdateAt: '2026-04-11',
    matchScore: 82,
    source: 'auto',
    confidenceScore: 78,
    needsReview: true, // flagged for review
    isStale: false,
    recruiterEmail: 'recruiting@mckinsey.com',
    emails: [
      {
        id: 'e10', threadId: 't6', from: 'recruiting@mckinsey.com', fromDomain: 'mckinsey.com',
        subject: 'Shortlisted for Business Analyst',
        snippet: 'Congratulations! You have been shortlisted for the Business Analyst role...',
        date: '2026-04-11', type: 'status', sentiment: 'positive',
        detectedStatus: 'SHORTLISTED', isRead: true,
      },
    ],
    notes: [],
  },
];

interface ApplicationsState {
  applications: Application[];
  gmailConnection: GmailConnection | null;
  selectedAppId: string | null;
  drawerOpen: boolean;
  reviewQueue: Application[]; // apps that need review before going live
  isSyncing: boolean;
  isLoading: boolean;

  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  moveApplication: (id: string, newStatus: AppStatus) => void;
  archiveApplication: (id: string) => void;
  setSelectedApp: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setGmailConnection: (conn: GmailConnection | null) => void;
  addEmailToApp: (appId: string, email: MatchedEmail) => void;
  addNoteToApp: (appId: string, note: ApplicationNote) => void;
  acceptReviewQueueApp: (id: string) => void;
  dismissReviewQueueApp: (id: string) => void;
  markAsStale: (id: string) => void;
  setIsSyncing: (syncing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  getStats: () => { total: number; responses: number; responseRate: number; interviews: number; offers: number; avgStageDays: number; addedThisWeek: number };
  loadMockData: () => void;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  gmailConnection: null,
  selectedAppId: null,
  drawerOpen: false,
  reviewQueue: [],
  isSyncing: false,
  isLoading: true,

  setApplications: (apps) => set({ applications: apps }),

  addApplication: (app) => set((s) => ({ applications: [app, ...s.applications] })),

  updateApplication: (id, updates) => set((s) => ({
    applications: s.applications.map(a => a.id === id ? { ...a, ...updates } : a),
  })),

  deleteApplication: (id) => set((s) => ({
    applications: s.applications.filter(a => a.id !== id),
  })),

  moveApplication: (id, newStatus) => set((s) => ({
    applications: s.applications.map(a =>
      a.id === id ? { ...a, status: newStatus, lastUpdateAt: new Date().toISOString() } : a
    ),
  })),

  archiveApplication: (id) => set((s) => ({
    applications: s.applications.map(a =>
      a.id === id ? { ...a, status: 'ARCHIVED', archivedAt: new Date().toISOString() } : a
    ),
  })),

  setSelectedApp: (id) => set({ selectedAppId: id, drawerOpen: id !== null }),

  setDrawerOpen: (open) => set({ drawerOpen: open, selectedAppId: open ? get().selectedAppId : null }),

  setGmailConnection: (conn) => set({ gmailConnection: conn }),

  addEmailToApp: (appId, email) => set((s) => ({
    applications: s.applications.map(a =>
      a.id === appId ? { ...a, emails: [...a.emails, email], lastUpdateAt: email.date } : a
    ),
  })),

  addNoteToApp: (appId, note) => set((s) => ({
    applications: s.applications.map(a =>
      a.id === appId ? { ...a, notes: [...a.notes, note] } : a
    ),
  })),

  acceptReviewQueueApp: (id) => set((s) => {
    const app = s.reviewQueue.find(a => a.id === id);
    if (!app) return s;
    return {
      reviewQueue: s.reviewQueue.filter(a => a.id !== id),
      applications: [{ ...app, needsReview: false }, ...s.applications],
    };
  }),

  dismissReviewQueueApp: (id) => set((s) => ({
    reviewQueue: s.reviewQueue.filter(a => a.id !== id),
  })),

  markAsStale: (id) => set((s) => ({
    applications: s.applications.map(a =>
      a.id === id ? { ...a, isStale: true } : a
    ),
  })),

  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  getStats: () => {
    const apps = get().applications.filter(a => a.status !== 'ARCHIVED');
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const responses = apps.filter(a => a.emails.length > 0 && a.emails.some(e => e.fromDomain !== 'gmail.com'));
    const interviews = apps.filter(a => a.status === 'INTERVIEW');
    const offers = apps.filter(a => a.status === 'OFFER');
    const addedThisWeek = apps.filter(a => new Date(a.appliedAt).getTime() > weekAgo);

    const stageDays = apps.map(a => {
      const applied = new Date(a.appliedAt || a.lastUpdateAt).getTime();
      return Math.floor((now - applied) / (24 * 60 * 60 * 1000));
    });
    const avgStageDays = stageDays.length > 0 ? Math.round(stageDays.reduce((a, b) => a + b, 0) / stageDays.length) : 0;

    return {
      total: apps.length,
      responses: responses.length,
      responseRate: apps.length > 0 ? Math.round((responses.length / apps.length) * 100) : 0,
      interviews: interviews.length,
      offers: offers.length,
      avgStageDays,
      addedThisWeek: addedThisWeek.length,
    };
  },

  loadMockData: () => {
    set({ isLoading: true });
    // Split needsReview apps into reviewQueue
    const needsReview = MOCK_APPLICATIONS.filter(a => a.needsReview);
    const ready = MOCK_APPLICATIONS.filter(a => !a.needsReview);
    setTimeout(() => {
      set({
        isLoading: false,
        applications: ready,
        reviewQueue: needsReview,
        gmailConnection: {
          email: 'user@gmail.com',
          connectedAt: '2026-04-10',
          lastSyncedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          syncEnabled: true,
        },
      });
    }, 1500);
  },
}));
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/stores/applications-store.ts apps/web/src/stores/index.ts
git commit -m "feat(applications): add enhanced Zustand store with mock data"
```

---

## Task 3: CSS Module — Applications Page

**Files:**
- Create: `apps/web/src/app/(dashboard)/applications/applications.module.css`

- [ ] **Step 1: Write the complete CSS module**

```css
/* ═══════════════════════════════════════
   SMART APPLICATION TRACKER
   ═══════════════════════════════════════ */

/* ── Page wrapper ── */
.page {
  background: var(--warm-bg, #fafaf8);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Page header ── */
.pageHeader {
  padding: 20px 28px 16px;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
  background: white;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.pageHeaderLeft {}
.pageTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  margin: 0 0 2px;
}
.pageSubtitle {
  font-size: 13px;
  color: var(--warm-text-secondary, #6b6b6b);
  margin: 0;
}

/* ── Gmail sync indicator ── */
.gmailBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.gmailBadgeDisconnected {
  background: #fef9c3;
  color: #a16207;
  border-color: #fde047;
}
.syncSpinner {
  width: 12px;
  height: 12px;
  border: 2px solid #bbf7d0;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Metrics dashboard ── */
.metricsRow {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  padding: 16px 28px;
  background: white;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
}
@media (max-width: 1100px) { .metricsRow { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 640px) { .metricsRow { grid-template-columns: repeat(2, 1fr); } }

.metricCard {
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--warm-border, #e5e5e4);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.metricValue {
  font-family: var(--font-display, sans-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  line-height: 1;
}
.metricLabel {
  font-size: 10px;
  color: var(--warm-text-muted, #9a9a9a);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.metricTrend {
  font-size: 10px;
  font-weight: 600;
}
.metricTrendUp { color: #22c55e; }
.metricTrendDown { color: #ef4444; }

/* ── Gmail connect banner ── */
.connectBanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
}
.connectBannerIcon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #fef9c3, #fef3c7);
  border: 1px solid #fde047;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
}
.connectTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 24px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  margin: 0 0 8px;
}
.connectSubtext {
  font-size: 14px;
  color: var(--warm-text-secondary, #6b6b6b);
  line-height: 1.6;
  margin: 0 0 24px;
  max-width: 380px;
}
.connectCTA {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  transition: background 0.2s, transform 0.15s;
  margin-bottom: 20px;
}
.connectCTA:hover { background: #333; transform: translateY(-1px); }

.scanList {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  text-align: left;
}
.scanItem {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--warm-text-secondary, #6b6b6b);
}
.scanItemCheck { color: #22c55e; font-size: 14px; }
.scanItemSkip { color: #ef4444; font-size: 14px; }

.trustNote {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--warm-text-muted, #9a9a9a);
  margin-bottom: 20px;
}
.trustNoteIcon { font-size: 14px; }

.connectDivider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
}
.connectDivider span {
  font-size: 12px;
  color: var(--warm-text-muted, #9a9a9a);
  flex-shrink: 0;
}
.connectDividerLine {
  flex: 1;
  height: 1px;
  background: var(--warm-border, #e5e5e4);
}

.manualCTA {
  font-size: 13px;
  color: var(--warm-text-secondary, #6b6b6b);
  cursor: pointer;
  text-decoration: underline;
  background: none;
  border: none;
}
.manualCTA:hover { color: var(--warm-primary, #d97706); }

/* ── Review queue banner ── */
.reviewBanner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  background: linear-gradient(90deg, #eff6ff, #f0f9ff);
  border-bottom: 1px solid #bae6fd;
}
.reviewBannerIcon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0ea5e9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.reviewBannerText {
  flex: 1;
}
.reviewBannerTitle {
  font-size: 13px;
  font-weight: 600;
  color: #0369a1;
}
.reviewBannerSub {
  font-size: 11px;
  color: #0284c7;
}
.reviewBannerBtn {
  padding: 6px 14px;
  border-radius: 8px;
  background: #0ea5e9;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.reviewBannerBtn:hover { background: #0284c7; }

/* ── Main content area ── */
.mainContent {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Kanban board ── */
.kanbanBoard {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 28px 24px;
  flex: 1;
  align-items: flex-start;
}
.kanbanBoard::-webkit-scrollbar { height: 6px; }
.kanbanBoard::-webkit-scrollbar-track { background: transparent; }
.kanbanBoard::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }

/* ── Kanban column ── */
.kanbanColumn {
  flex-shrink: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--warm-border, #e5e5e4);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 280px);
}
.kanbanColumnHeader {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
  flex-shrink: 0;
}
.kanbanColumnDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.kanbanColumnTitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--warm-text-primary, #1a1a1a);
  flex: 1;
}
.kanbanColumnCount {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
  background: var(--warm-bg, #fafaf8);
  color: var(--warm-text-muted, #9a9a9a);
}
.kanbanColumnAdd {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--warm-text-muted, #9a9a9a);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border: none;
  background: none;
  flex-shrink: 0;
}
.kanbanColumnAdd:hover { background: var(--warm-bg, #fafaf8); color: var(--warm-primary, #d97706); }

.kanbanColumnBody {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 80px;
}
.kanbanColumnBody::-webkit-scrollbar { width: 4px; }
.kanbanColumnBody::-webkit-scrollbar-track { background: transparent; }
.kanbanColumnBody::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

.kanbanColumnEmpty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  border: 2px dashed var(--warm-border, #e5e5e4);
  border-radius: 8px;
  margin: 8px 10px;
}
.kanbanColumnEmpty span {
  font-size: 11px;
  color: var(--warm-text-muted, #9a9a9a);
}

.columnDragOver {
  background: rgba(217, 119, 6, 0.03);
  border-color: rgba(217, 119, 6, 0.3);
}

/* ── Application card ── */
.applicationCard {
  background: var(--warm-bg, #fafaf8);
  border-radius: 10px;
  border: 1px solid var(--warm-border, #e5e5e4);
  padding: 10px 12px;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
  position: relative;
}
.applicationCard:hover {
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
  border-color: #d4d4d4;
  transform: translateY(-1px);
}
.applicationCard.isInterview {
  border-left: 3px solid #f59e0b;
  background: #fffbeb;
}
.applicationCard.isNeedsReview {
  border-color: #f59e0b40;
  background: #fffbeb;
}
.applicationCard.isStale {
  opacity: 0.7;
}

.cardHeader {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.cardCompanyLogo {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.cardTitleGroup { flex: 1; min-width: 0; }
.cardRole {
  font-size: 12px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cardCompany {
  font-size: 11px;
  color: var(--warm-text-secondary, #6b6b6b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cardBadges {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.cardBadge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 600;
}
.badgeAIDetected {
  background: rgba(0, 104, 121, 0.08);
  color: #006879;
}
.badgeNeedsReview {
  background: #fef3c7;
  color: #d97706;
}
.badgeStale {
  background: #f3f4f6;
  color: #9ca3af;
}
.badgeInterview {
  background: #fef3c7;
  color: #d97706;
}
.badgeEmailCount {
  background: var(--warm-bg, #fafaf8);
  color: var(--warm-text-muted, #9a9a9a);
  border: 1px solid var(--warm-border, #e5e5e4);
}

.cardMeta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--warm-text-muted, #9a9a9a);
  margin-bottom: 4px;
}
.cardMetaItem {
  display: flex;
  align-items: center;
  gap: 3px;
}
.cardMetaItem svg { width: 10px; height: 10px; }

.cardSnippet {
  font-size: 10px;
  color: var(--warm-text-secondary, #6b6b6b);
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-top: 4px;
}

/* ── Card hover menu ── */
.cardHoverMenu {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--warm-border, #e5e5e4);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
  color: var(--warm-text-muted, #9a9a9a);
  font-size: 12px;
}
.applicationCard:hover .cardHoverMenu { opacity: 1; }
.cardHoverMenu:hover { background: var(--warm-bg, #fafaf8); color: var(--warm-text-primary, #1a1a1a); }

/* ── Detail drawer ── */
.drawerOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  z-index: 40;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 440px;
  height: 100vh;
  background: white;
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
  z-index: 50;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.25s ease;
  overflow: hidden;
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@media (max-width: 640px) { .drawer { width: 100vw; } }

.drawerHeader {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.drawerBack {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  background: var(--warm-bg, #fafaf8);
  color: var(--warm-text-secondary, #6b6b6b);
  transition: background 0.15s;
  flex-shrink: 0;
}
.drawerBack:hover { background: var(--warm-border, #e5e5e4); }
.drawerCompany { flex: 1; }
.drawerCompanyName {
  font-family: var(--font-display, sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  margin: 0 0 2px;
}
.drawerRole {
  font-size: 13px;
  color: var(--warm-text-secondary, #6b6b6b);
}
.drawerMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
  background: #fafaf8;
}
.drawerMetaItem {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--warm-text-secondary, #6b6b6b);
}
.drawerMetaItem svg { width: 12px; height: 12px; }
.drawerMetaLabel { font-weight: 600; color: var(--warm-text-primary, #1a1a1a); }

/* ── Drawer sections ── */
.drawerBody {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 24px;
}
.drawerBody::-webkit-scrollbar { width: 4px; }
.drawerBody::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

.drawerSection {
  padding: 16px 24px;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
}
.drawerSectionTitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--warm-text-muted, #9a9a9a);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawerSectionAction {
  font-size: 11px;
  font-weight: 600;
  color: var(--warm-primary, #d97706);
  cursor: pointer;
  background: none;
  border: none;
}
.drawerSectionAction:hover { color: #b45309; }

/* AI Summary */
.aiSummary {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 12px;
  color: #92400e;
  line-height: 1.6;
}

/* Email timeline */
.emailTimeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.emailItem {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--warm-border, #e5e5e4);
  position: relative;
}
.emailItem:last-child { border-bottom: none; }
.emailItem::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 1px;
  background: var(--warm-border, #e5e5e4);
}
.emailItem:last-child::before { display: none; }

.emailIcon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background: white;
  border: 2px solid white;
}
.emailIconConfirmation { background: #f0fdf4; color: #22c55e; }
.emailIconStatus { background: #eff6ff; color: #0ea5e9; }
.emailIconInterview { background: #fffbeb; color: #f59e0b; }
.emailIconOffer { background: #f0fdf4; color: #22c55e; }
.emailIconRejection { background: #fef2f2; color: #ef4444; }
.emailIconFollowup { background: #f8fafc; color: #6b7280; }

.emailContent { flex: 1; min-width: 0; }
.emailHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
}
.emailSubject {
  font-size: 12px;
  font-weight: 600;
  color: var(--warm-text-primary, #1a1a1a);
  line-height: 1.3;
  flex: 1;
}
.emailDate {
  font-size: 10px;
  color: var(--warm-text-muted, #9a9a9a);
  flex-shrink: 0;
}
.emailSnippet {
  font-size: 11px;
  color: var(--warm-text-secondary, #6b6b6b);
  line-height: 1.5;
  margin-bottom: 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.emailAnnotation {
  font-size: 10px;
  color: #22c55e;
  font-weight: 500;
}
.emailViewLink {
  font-size: 10px;
  color: var(--warm-primary, #d97706);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.emailViewLink:hover { color: #b45309; }

/* Follow-up suggestion */
.followupSuggestion {
  background: linear-gradient(135deg, #eff6ff, #f0f9ff);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.followupIcon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0ea5e9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.followupText { flex: 1; }
.followupTitle {
  font-size: 12px;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 3px;
}
.followupDesc {
  font-size: 11px;
  color: #0284c7;
  line-height: 1.5;
  margin-bottom: 8px;
}
.followupActions {
  display: flex;
  gap: 6px;
}
.followupBtn {
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.followupBtnPrimary {
  background: #0ea5e9;
  color: white;
}
.followupBtnPrimary:hover { background: #0284c7; }
.followupBtnSecondary {
  background: white;
  color: #0ea5e9;
  border: 1px solid #0ea5e9;
}
.followupBtnSecondary:hover { background: #eff6ff; }

/* Drawer footer actions */
.drawerActions {
  padding: 16px 24px;
  border-top: 1px solid var(--warm-border, #e5e5e4);
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  background: white;
}
.drawerActionBtn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--warm-border, #e5e5e4);
  background: white;
  color: var(--warm-text-secondary, #6b6b6b);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.drawerActionBtn:hover { background: var(--warm-bg, #fafaf8); border-color: #d4d4d4; color: var(--warm-text-primary, #1a1a1a); }
.drawerActionBtnDanger:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

/* ── Loading / empty states ── */
.loadingState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
}
.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--warm-border, #e5e5e4);
  border-top-color: var(--warm-primary, #d97706);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
.loadingTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--warm-text-primary, #1a1a1a);
  margin: 0 0 6px;
}
.loadingText {
  font-size: 13px;
  color: var(--warm-text-secondary, #6b6b6b);
  margin: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/(dashboard)/applications/applications.module.css
git commit -m "feat(applications): add CSS module for Smart Tracker"
```

---

## Task 4: Gmail Connect Banner + Metrics Dashboard

**Files:**
- Create: `apps/web/src/components/applications/gmail-connect-banner.tsx`
- Create: `apps/web/src/components/applications/metrics-dashboard.tsx`

- [ ] **Step 1: Write GmailConnectBanner**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { Check, X, Lock } from "lucide-react";
import styles from "@/app/(dashboard)/applications/applications.module.css";

interface GmailConnectBannerProps {
  onConnect: () => void;
  onManualMode: () => void;
}

export function GmailConnectBanner({ onConnect, onManualMode }: GmailConnectBannerProps) {
  return (
    <div className={styles.connectBanner}>
      <div className={styles.connectBannerIcon}>📧</div>
      <h2 className={styles.connectTitle}>Connect Your Gmail</h2>
      <p className={styles.connectSubtext}>
        Track job applications automatically through the email you actually use to apply — without lifting a finger.
      </p>

      <button className={styles.connectCTA} onClick={onConnect}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 12 2.09 12 5.38c0 1.68.64 3.24 1.68 4.39l3.42-3.42c-.18-.57-.45-1.16-.83-1.67-.57-.77-1.4-1.55-2.6-2.28" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <div className={styles.scanList}>
        <div className={styles.scanItem}><Check size={14} className={styles.scanItemCheck} /> Application confirmations (inbox + sent)</div>
        <div className={styles.scanItem}><Check size={14} className={styles.scanItemCheck} /> Status updates from recruiters</div>
        <div className={styles.scanItem}><Check size={14} className={styles.scanItemCheck} /> Interview invitations and offers</div>
        <div className={styles.scanItem}><X size={14} className={styles.scanItemSkip} /> Personal emails</div>
        <div className={styles.scanItem}><X size={14} className={styles.scanItemSkip} /> Newsletters and promotional</div>
        <div className={styles.scanItem}><X size={14} className={styles.scanItemSkip} /> Calendar invites</div>
      </div>

      <div className={styles.trustNote}>
        <Lock size={12} className={styles.trustNoteIcon} />
        Only job-related emails. Disconnect anytime. Review all detected applications before they appear.
      </div>

      <div className={styles.connectDivider}>
        <div className={styles.connectDividerLine} />
        <span>or</span>
        <div className={styles.connectDividerLine} />
      </div>

      <button className={styles.manualCTA} onClick={onManualMode}>
        Use manually — add applications yourself
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write MetricsDashboard**

```tsx
"use client";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import type { ApplicationStats } from "@/types/application";
import styles from "@/app/(dashboard)/applications/applications.module.css";

interface MetricsDashboardProps {
  stats: ApplicationStats;
  isSyncing: boolean;
  lastSyncedAt?: string;
  onSync: () => void;
}

function MetricCard({ label, value, trend }: { label: string; value: string | number; trend?: 'up' | 'down' | null }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
      {trend === 'up' && <TrendingUp size={10} className={`${styles.metricTrend} ${styles.metricTrendUp}`} />}
      {trend === 'down' && <TrendingDown size={10} className={`${styles.metricTrend} ${styles.metricTrendDown}`} />}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function MetricsDashboard({ stats, isSyncing, lastSyncedAt, onSync }: MetricsDashboardProps) {
  return (
    <div className={styles.metricsRow}>
      <MetricCard label="Tracked" value={stats.total} />
      <MetricCard label="Responses" value={stats.responses} />
      <MetricCard label="Resp Rate" value={`${stats.responseRate}%`} />
      <MetricCard label="Interviews" value={stats.interviews} />
      <MetricCard label="Offers" value={stats.offers} />
      <MetricCard label="Avg Stage" value={`${stats.avgStageDays}d`} />
      <MetricCard label="This Week" value={`+${stats.addedThisWeek}`} />
      <div className={styles.metricCard} style={{ cursor: 'pointer' }} onClick={onSync}>
        <div className={styles.metricValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isSyncing ? (
            <RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            '🔄'
          )}
        </div>
        <div className={styles.metricLabel}>Synced</div>
        <div style={{ fontSize: '10px', color: '#9a9a9a', marginTop: '2px' }}>
          {lastSyncedAt ? timeAgo(lastSyncedAt) : '—'}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/applications/gmail-connect-banner.tsx apps/web/src/components/applications/metrics-dashboard.tsx
git commit -m "feat(applications): add GmailConnectBanner and MetricsDashboard components"
```

---

## Task 5: Rich Application Card

**Files:**
- Create: `apps/web/src/components/applications/application-card.tsx`

- [ ] **Step 1: Write the rich application card**

```tsx
"use client";
import { MapPin, DollarSign, Calendar, Clock, Mail, MoreHorizontal, AlertCircle, Archive, Trash2, StickyNote, Target } from "lucide-react";
import type { Application } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface ApplicationCardProps {
  app: Application;
  onClick: (id: string) => void;
  onMenuAction: (action: string, id: string) => void;
}

export function ApplicationCard({ app, onClick, onMenuAction }: ApplicationCardProps) {
  const color = getCompanyColor(app.company);
  const daysAgo = app.appliedAt
    ? Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / (24 * 60 * 60 * 1000))
    : null;

  const emailCount = app.emails.length;
  const hasInterview = !!app.interviewDate;

  const cardClasses = [
    styles.applicationCard,
    hasInterview ? styles.isInterview : '',
    app.needsReview ? styles.isNeedsReview : '',
    app.isStale ? styles.isStale : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={() => onClick(app.id)}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardCompanyLogo} style={{ backgroundColor: color }}>
          {app.company.charAt(0)}
        </div>
        <div className={styles.cardTitleGroup}>
          <div className={styles.cardRole}>{app.role}</div>
          <div className={styles.cardCompany}>{app.company}</div>
        </div>
        <button
          className={styles.cardHoverMenu}
          onClick={(e) => { e.stopPropagation(); onMenuAction('menu', app.id); }}
          title="More actions"
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Badges */}
      <div className={styles.cardBadges}>
        {app.source === 'auto' && (
          <span className={`${styles.cardBadge} ${styles.badgeAIDetected}`}>🤖 Auto-detected</span>
        )}
        {app.needsReview && (
          <span className={`${styles.cardBadge} ${styles.badgeNeedsReview}`}>
            <AlertCircle size={9} /> Review
          </span>
        )}
        {app.isStale && (
          <span className={`${styles.cardBadge} ${styles.badgeStale}`}>
            <Clock size={9} /> Stale
          </span>
        )}
        {emailCount > 0 && (
          <span className={`${styles.cardBadge} ${styles.badgeEmailCount}`}>
            <Mail size={9} /> {emailCount} email{emailCount !== 1 ? 's' : ''}
          </span>
        )}
        {hasInterview && (
          <span className={`${styles.cardBadge} ${styles.badgeInterview}`}>
            <Calendar size={9} /> Interview scheduled
          </span>
        )}
      </div>

      {/* Meta info */}
      <div className={styles.cardMeta}>
        {app.location && (
          <span className={styles.cardMetaItem}>
            <MapPin />
            {app.location}
          </span>
        )}
        {app.salary && (
          <span className={styles.cardMetaItem}>
            <DollarSign />
            {app.salary}
          </span>
        )}
        {daysAgo !== null && (
          <span className={styles.cardMetaItem}>
            <Clock />
            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
        )}
      </div>

      {/* Interview date */}
      {hasInterview && (
        <div className={styles.cardMeta} style={{ color: '#d97706' }}>
          <Target size={10} />
          <span>Interview: {new Date(app.interviewDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      )}

      {/* Email snippet */}
      {app.emails.length > 0 && (
        <div className={styles.cardSnippet}>
          "{app.emails[app.emails.length - 1].snippet}"
        </div>
      )}

      {/* ATS match */}
      {app.matchScore && (
        <div className={styles.cardMeta} style={{ marginTop: '4px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: app.matchScore >= 85 ? '#d97706' : app.matchScore >= 70 ? '#6b7280' : '#9a9a9a',
          }}>
            {app.matchScore}% match
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/applications/application-card.tsx
git commit -m "feat(applications): add rich ApplicationCard with AI badges"
```

---

## Task 6: Application Detail Drawer + Email Timeline

**Files:**
- Create: `apps/web/src/components/applications/application-drawer.tsx`
- Create: `apps/web/src/components/applications/email-timeline.tsx`

- [ ] **Step 1: Write EmailTimeline**

```tsx
"use client";
import { MapPin, DollarSign, Calendar, Target } from "lucide-react";
import type { MatchedEmail, EmailType } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

const TYPE_ICONS: Record<EmailType, string> = {
  confirmation: '✉️',
  status: '📊',
  interview: '🎯',
  offer: '💼',
  rejection: '❌',
  followup: '💬',
  other: '📧',
};

const TYPE_LABELS: Record<EmailType, string> = {
  confirmation: 'Confirmation',
  status: 'Status Update',
  interview: 'Interview',
  offer: 'Offer',
  rejection: 'Rejection',
  followup: 'Follow-up',
  other: 'Email',
};

interface EmailTimelineProps {
  emails: MatchedEmail[];
  onViewEmail: (email: MatchedEmail) => void;
}

export function EmailTimeline({ emails, onViewEmail }: EmailTimelineProps) {
  if (emails.length === 0) {
    return (
      <div style={{ padding: '16px 0', fontSize: '12px', color: '#9a9a9a', textAlign: 'center' }}>
        No emails matched to this application yet.
      </div>
    );
  }

  return (
    <div className={styles.emailTimeline}>
      {[...emails].reverse().map((email) => {
        const iconClass = {
          confirmation: styles.emailIconConfirmation,
          status: styles.emailIconStatus,
          interview: styles.emailIconInterview,
          offer: styles.emailIconOffer,
          rejection: styles.emailIconRejection,
          followup: styles.emailIconFollowup,
          other: styles.emailIconFollowup,
        }[email.type];

        const showAnnotation = !!email.detectedStatus && email.type !== 'other';

        return (
          <div key={email.id} className={styles.emailItem}>
            <div className={`${styles.emailIcon} ${iconClass}`}>
              {TYPE_ICONS[email.type]}
            </div>
            <div className={styles.emailContent}>
              <div className={styles.emailHeader}>
                <div className={styles.emailSubject}>{email.subject}</div>
                <div className={styles.emailDate}>
                  {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className={styles.emailSnippet}>{email.snippet}</div>
              {showAnnotation && (
                <div className={styles.emailAnnotation}>
                  → Auto-moved to {email.detectedStatus?.replace('_', ' ')}
                </div>
              )}
              <div
                className={styles.emailViewLink}
                onClick={() => onViewEmail(email)}
              >
                View full email →
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write ApplicationDrawer**

```tsx
"use client";
import { X, MapPin, DollarSign, Calendar, ArrowLeft, Archive, Trash2, ChevronDown, Plus, Lightbulb } from "lucide-react";
import type { Application } from '@/types/application';
import { EmailTimeline } from "./email-timeline";
import styles from "@/app/(dashboard)/applications/applications.module.css";
import { useApplicationsStore } from '@/stores/applications-store';

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface ApplicationDrawerProps {
  app: Application;
  onClose: () => void;
  onAddNote: (content: string) => void;
}

export function ApplicationDrawer({ app, onClose, onAddNote }: ApplicationDrawerProps) {
  const { moveApplication, archiveApplication, deleteApplication } = useApplicationsStore();
  const color = getCompanyColor(app.company);

  const daysInStage = app.appliedAt
    ? Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / (24 * 60 * 60 * 1000))
    : 0;

  const isStale = daysInStage >= 14;

  // AI summary mock (Phase 1 — in Phase 2 this calls the AI API)
  const aiSummary = `You applied for the ${app.role} role at ${app.company}${app.location ? ` (${app.location})` : ''}. ` +
    `Your application ${app.emails.length > 0 ? `has received ${app.emails.length} email${app.emails.length > 1 ? 's' : ''}` : 'has not received a reply yet'}. ` +
    `Current stage: ${app.status.replace('_', ' ')}. ` +
    (app.recruiterName ? `Recruiter contact: ${app.recruiterName}. ` : '') +
    `Your match score is ${app.matchScore ?? 'unknown'}%.`;

  return (
    <>
      {/* Overlay */}
      <div className={styles.drawerOverlay} onClick={onClose} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <button className={styles.drawerBack} onClick={onClose}>
            <ArrowLeft size={16} />
          </button>
          <div className={styles.drawerCompany}>
            <div className={styles.drawerCompanyName}>
              <span style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: color,
                color: 'white',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: '24px',
                marginRight: '8px',
              }}>{app.company.charAt(0)}</span>
              {app.company}
            </div>
            <div className={styles.drawerRole}>{app.role}</div>
          </div>
        </div>

        {/* Meta */}
        <div className={styles.drawerMeta}>
          {app.location && (
            <div className={styles.drawerMetaItem}>
              <MapPin /> <span className={styles.drawerMetaLabel}>{app.location}</span>
            </div>
          )}
          {app.salary && (
            <div className={styles.drawerMetaItem}>
              <DollarSign /> <span className={styles.drawerMetaLabel}>{app.salary}</span>
            </div>
          )}
          {app.appliedAt && (
            <div className={styles.drawerMetaItem}>
              <Calendar />
              <span>Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({daysInStage}d)</span>
            </div>
          )}
          {app.interviewDate && (
            <div className={styles.drawerMetaItem}>
              <Target />
              <span style={{ color: '#d97706', fontWeight: 600 }}>
                Interview: {new Date(app.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          )}
          {app.matchScore && (
            <div className={styles.drawerMetaItem}>
              <span style={{ fontWeight: 600 }}>{app.matchScore}% ATS match</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          {/* AI Summary */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>
              🤖 AI Summary
            </div>
            <div className={styles.aiSummary}>{aiSummary}</div>
          </div>

          {/* Timeline */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>
              Email Timeline
              <button
                className={styles.drawerSectionAction}
                onClick={() => {
                  const note = prompt('Add a note:');
                  if (note) onAddNote(note);
                }}
              >
                <Plus size={11} style={{ marginRight: '3px' }} /> Add note
              </button>
            </div>
            <EmailTimeline
              emails={app.emails}
              onViewEmail={(email) => alert(`Full email: ${email.subject}\n\n${email.snippet}`)}
            />
          </div>

          {/* Follow-up suggestion */}
          {isStale && (
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>💡 Follow-up Suggestion</div>
              <div className={styles.followupSuggestion}>
                <div className={styles.followupIcon}><Lightbulb size={14} /></div>
                <div className={styles.followupText}>
                  <div className={styles.followupTitle}>It's been {daysInStage} days since your last update</div>
                  <div className={styles.followupDesc}>
                    No response from {app.company} yet. A follow-up email can keep you top of mind.
                  </div>
                  <div className={styles.followupActions}>
                    <button className={`${styles.followupBtn} ${styles.followupBtnPrimary}`}>
                      Draft follow-up ✨
                    </button>
                    <button className={`${styles.followupBtn} ${styles.followupBtnSecondary}`}>
                      Set reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {app.notes.length > 0 && (
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>Notes</div>
              {app.notes.map(note => (
                <div key={note.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0ef' }}>
                  <div style={{ fontSize: '12px', color: '#1a1a1a', lineHeight: 1.5 }}>{note.content}</div>
                  <div style={{ fontSize: '10px', color: '#9a9a9a', marginTop: '3px' }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={styles.drawerActions}>
          <button
            className={styles.drawerActionBtn}
            onClick={() => {
              const statuses = ['WISHLIST', 'APPLIED', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED'];
              const next = statuses[Math.min(statuses.indexOf(app.status) + 1, statuses.length - 1)];
              moveApplication(app.id, next);
            }}
          >
            Update stage
          </button>
          <button
            className={styles.drawerActionBtn}
            onClick={() => { archiveApplication(app.id); onClose(); }}
          >
            <Archive size={12} style={{ marginRight: '4px' }} /> Archive
          </button>
          <button
            className={`${styles.drawerActionBtn} ${styles.drawerActionBtnDanger}`}
            onClick={() => { deleteApplication(app.id); onClose(); }}
          >
            <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/applications/application-drawer.tsx apps/web/src/components/applications/email-timeline.tsx
git commit -m "feat(applications): add ApplicationDrawer with EmailTimeline"
```

---

## Task 7: Review Queue + Main Page Composition

**Files:**
- Create: `apps/web/src/components/applications/review-queue.tsx`
- Modify: `apps/web/src/app/(dashboard)/applications/page.tsx`

- [ ] **Step 1: Write ReviewQueue**

```tsx
"use client";
import { Check, X, AlertCircle } from "lucide-react";
import type { Application } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

interface ReviewQueueProps {
  apps: Application[];
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function ReviewQueue({ apps, onAccept, onDismiss }: ReviewQueueProps) {
  if (apps.length === 0) return null;

  return (
    <div className={styles.reviewBanner}>
      <div className={styles.reviewBannerIcon}>
        <AlertCircle size={16} />
      </div>
      <div className={styles.reviewBannerText}>
        <div className={styles.reviewBannerTitle}>AI detected {apps.length} new application{apps.length > 1 ? 's' : ''}</div>
        <div className={styles.reviewBannerSub}>Review them before they appear on your board</div>
      </div>
    </div>
  );
}

export function ReviewQueueModal({ apps, onAccept, onDismiss }: ReviewQueueProps) {
  if (apps.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth: '560px', width: '100%',
        maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e4' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Review detected applications</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b6b6b' }}>
            AI found these job applications in your emails. Accept to add them to your board.
          </p>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {apps.map(app => {
            const color = getCompanyColor(app.company);
            return (
              <div key={app.id} style={{
                border: '1px solid #e5e5e4', borderRadius: '10px', padding: '12px 14px',
                display: 'flex', gap: '10px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', background: color,
                  color: 'white', fontSize: '14px', fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>{app.company.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{app.role}</div>
                  <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{app.company} · {app.location || 'Location unknown'}</div>
                  <div style={{ fontSize: '11px', color: '#9a9a9a', marginTop: '3px' }}>
                    {app.emails.length} email{app.emails.length !== 1 ? 's' : ''} matched · {app.confidenceScore}% confidence
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => onAccept(app.id)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: '#f0fdf4', color: '#22c55e', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Accept"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => onDismiss(app.id)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e5e4' }}>
          <button
            onClick={() => apps.forEach(a => onDismiss(a.id))}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e5e4',
              background: 'white', color: '#6b6b6b', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Dismiss all
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the main page composition**

Read the existing `page.tsx` first, then rewrite it completely:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useApplicationsStore } from "@/stores/applications-store";
import { applicationApi } from "@/lib/api";
import { GmailConnectBanner } from "@/components/applications/gmail-connect-banner";
import { MetricsDashboard } from "@/components/applications/metrics-dashboard";
import { ApplicationCard } from "@/components/applications/application-card";
import { ApplicationDrawer } from "@/components/applications/application-drawer";
import { ReviewQueue, ReviewQueueModal } from "@/components/applications/review-queue";
import { KANBAN_COLUMNS } from "@/types/application";
import type { Application, AppStatus } from "@/types/application";
import styles from "./applications.module.css";

export default function ApplicationsPage() {
  const {
    applications,
    gmailConnection,
    selectedAppId,
    drawerOpen,
    reviewQueue,
    isSyncing,
    isLoading,
    loadMockData,
    setSelectedApp,
    setDrawerOpen,
    moveApplication,
    acceptReviewQueueApp,
    dismissReviewQueueApp,
    addNoteToApp,
    getStats,
  } = useApplicationsStore();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [gmailMode, setGmailMode] = useState<'connected' | 'unconnected' | 'manual'>('connected');

  const stats = getStats();
  const selectedApp = applications.find(a => a.id === selectedAppId) ?? null;

  useEffect(() => {
    loadMockData();
  }, []);

  useEffect(() => {
    if (reviewQueue.length > 0 && !showReviewModal) {
      setShowReviewModal(true);
    }
  }, [reviewQueue.length]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as AppStatus;
    moveApplication(draggableId, newStatus);
    applicationApi.update(draggableId, { status: newStatus }).catch(() => {
      toast.error("Couldn't update — tap to retry");
    });
  };

  const handleCardClick = (id: string) => {
    setSelectedApp(id);
  };

  const handleMenuAction = (action: string, id: string) => {
    toast.info(`Action: ${action} on ${id}`);
  };

  const handleAddNote = (content: string) => {
    if (!selectedAppId) return;
    addNoteToApp(selectedAppId, {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
    });
    toast.success("Note added");
  };

  // Gmail not connected
  if (gmailMode === 'unconnected') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Application Tracker</h1>
            <p className={styles.pageSubtitle}>Smart tracking powered by your Gmail inbox</p>
          </div>
        </div>
        <GmailConnectBanner
          onConnect={() => setGmailMode('connected')}
          onManualMode={() => setGmailMode('manual')}
        />
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Application Tracker</h1>
          </div>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <h3 className={styles.loadingTitle}>Reading your emails...</h3>
          <p className={styles.loadingText}>Scanning for job applications. This takes a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Application Tracker</h1>
          <p className={styles.pageSubtitle}>Smart tracking powered by your Gmail inbox</p>
        </div>
        {gmailConnection && (
          <div className={styles.gmailBadge}>
            <span>📧</span>
            {gmailConnection.email}
            {isSyncing && <div className={styles.syncSpinner} />}
          </div>
        )}
      </div>

      {/* Metrics */}
      <MetricsDashboard
        stats={stats}
        isSyncing={isSyncing}
        lastSyncedAt={gmailConnection?.lastSyncedAt}
        onSync={() => toast.info("Sync triggered (mock)")}
      />

      {/* Review queue banner */}
      {reviewQueue.length > 0 && !showReviewModal && (
        <ReviewQueue
          apps={reviewQueue}
          onAccept={(id) => acceptReviewQueueApp(id)}
          onDismiss={(id) => dismissReviewQueueApp(id)}
        />
      )}

      {/* Main content */}
      <div className={styles.mainContent}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.kanbanBoard}>
            {KANBAN_COLUMNS.map((column) => {
              const columnApps = applications.filter(a => a.status === column.id);
              return (
                <div key={column.id} className={styles.kanbanColumn}>
                  <div className={styles.kanbanColumnHeader}>
                    <div className={styles.kanbanColumnDot} style={{ backgroundColor: column.color }} />
                    <span className={styles.kanbanColumnTitle}>{column.label}</span>
                    <span className={styles.kanbanColumnCount}>{columnApps.length}</span>
                    <button className={styles.kanbanColumnAdd} title="Add application">
                      <Plus size={14} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${styles.kanbanColumnBody} ${snapshot.isDraggingOver ? styles.columnDragOver : ''}`}
                      >
                        {columnApps.length === 0 ? (
                          <div className={styles.kanbanColumnEmpty}>
                            <span>Empty</span>
                          </div>
                        ) : (
                          columnApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ApplicationCard
                                    app={app}
                                    onClick={handleCardClick}
                                    onMenuAction={handleMenuAction}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Detail drawer */}
      {drawerOpen && selectedApp && (
        <ApplicationDrawer
          app={selectedApp}
          onClose={() => setDrawerOpen(false)}
          onAddNote={handleAddNote}
        />
      )}

      {/* Review modal */}
      {showReviewModal && reviewQueue.length > 0 && (
        <ReviewQueueModal
          apps={reviewQueue}
          onAccept={(id) => { acceptReviewQueueApp(id); }}
          onDismiss={(id) => { dismissReviewQueueApp(id); }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(dashboard\)/applications/page.tsx apps/web/src/components/applications/review-queue.tsx
git commit -m "feat(applications): add ReviewQueue and main page composition"
```

---

## Task 8: Verify Build

- [ ] **Step 1: Run build**

```bash
cd apps/web && npm run build
```
Expected: Clean build, no TypeScript errors, no console errors.

- [ ] **Step 2: Check dev server**

```bash
cd apps/web && npm run dev -- --port 3000
```
Expected: Page loads at localhost:3000/applications with:
- Metrics row with 8 cards
- Gmail connection banner
- Review queue banner
- 9 Kanban columns with mock data
- Click card → drawer opens
- Drag-and-drop still works

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Gmail onboarding (connect banner) | Task 4, Task 7 |
| 9 Kanban stages | Tasks 1, 7 |
| Rich cards (badges, snippets, stale) | Tasks 5, 7 |
| 3-pass matching engine (mock data) | Tasks 1, 2 |
| Email → status classification | Tasks 1, 2 |
| Side drawer with timeline | Task 6 |
| AI summary in drawer | Task 6 |
| Follow-up suggestions | Task 6 |
| Metrics dashboard | Task 4 |
| Review queue (modal + banner) | Task 7 |
| Loading / empty / error states | Tasks 3, 7 |
| Store with mock data | Task 2 |
| TypeScript types | Task 1 |
| Build verification | Task 8 |

**All spec sections covered. No gaps.**

---

## Phase 2: Real Gmail Integration (separate plan)

Once Phase 1 is complete, real Gmail integration adds:

| Task | Description |
|------|-------------|
| 9A | Google OAuth callback route |
| 9B | Gmail sync API (scan inbox + sent, job email filter) |
| 9C | Email matching API (3-pass engine with real data) |
| 9D | Email classification API (keyword + sentiment detection) |
| 9E | Continuous background sync (polling) |
| 9F | Privacy controls (disconnect, purge data) |

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-smart-application-tracker-impl.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
