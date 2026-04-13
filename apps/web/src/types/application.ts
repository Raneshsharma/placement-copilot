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
