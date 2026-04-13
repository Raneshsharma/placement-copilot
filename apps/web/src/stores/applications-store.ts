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
    const addedThisWeek = apps.filter(a => a.appliedAt && new Date(a.appliedAt).getTime() > weekAgo);

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
