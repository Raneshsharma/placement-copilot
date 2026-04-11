// ============================================================
// Enums — must match Prisma schema exactly
// ============================================================

export enum UserRole {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

export enum LocationType {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum JobSource {
  LINKEDIN = 'LINKEDIN',
  INDEED = 'INDEED',
  INTERNAL = 'INTERNAL',
  SCRAPED = 'SCRAPED',
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum InterviewType {
  BEHAVIORAL = 'BEHAVIORAL',
  TECHNICAL = 'TECHNICAL',
  CASE_STUDY = 'CASE_STUDY',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  HYBRID = 'HYBRID',
}

export enum InterviewStatus {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FEEDBACK_READY = 'FEEDBACK_READY',
}

export enum NotificationType {
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  INTERVIEW_READY = 'INTERVIEW_READY',
  SKILL_ALERT = 'SKILL_ALERT',
  SYSTEM = 'SYSTEM',
}

// ============================================================
// User
// ============================================================

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Profile
// ============================================================

export interface Profile {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  languages: string[];
  projects: Project[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  location?: string;
  phone?: string;
  ppsScore?: number;
  completeness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

// ============================================================
// Resume
// ============================================================

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fileUrl?: string;
  fileKey?: string;
  parsedData: Record<string, unknown>;
  atsScore?: number;
  version: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Job Listing
// ============================================================

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: LocationType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  keywords: string[];
  source: JobSource;
  sourceUrl?: string;
  applyUrl?: string;
  status: string;
  postedAt?: Date;
  expiresAt?: Date;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Application
// ============================================================

export interface TimelineEntry {
  status: ApplicationStatus;
  timestamp: Date;
  note?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobListingId?: string;
  resumeId?: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedAt?: Date;
  timeline: TimelineEntry[];
  coverLetterUrl?: string;
  notes?: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Mock Interview
// ============================================================

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  audioUrl?: string;
  startedAt: Date;
  answeredAt: Date;
}

export interface MockInterview {
  id: string;
  applicationId?: string;
  userId: string;
  type: InterviewType;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  scores: Record<string, number>;
  feedback?: string;
  transcript: unknown[];
  duration?: number;
  startedAt?: Date;
  completedAt?: Date;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Skill Gap Analysis
// ============================================================

export enum SkillGapSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum GapType {
  MISSING = 'MISSING',
  WEAK = 'WEAK',
  STALE = 'STALE',
}

export interface SkillGap {
  skill: string;
  gapType: GapType;
  severity: SkillGapSeverity;
  currentLevel?: string;
  requiredLevel?: string;
  description?: string;
  gapPercent: number;
  learningResources?: LearningResource[];
  estimatedTimeToAcquire?: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'course' | 'article' | 'video' | 'book' | 'project';
  duration?: string;
  cost?: 'free' | 'paid';
}

export interface RoadmapStep {
  title: string;
  duration: string;
  resources: string[];
  completed?: boolean;
}

export interface SkillGapAnalysis {
  id: string;
  userId: string;
  targetRole: string;
  currentSkills: string[];
  gaps: SkillGap[];
  recommendations: string[];
  roadmap: RoadmapStep[];
  priorityScore?: number;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Notification
// ============================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  data: Record<string, unknown>;
  createdAt: Date;
}

// ============================================================
// Analytics
// ============================================================

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  sessionId?: string;
  createdAt: Date;
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================
// Dashboard
// ============================================================

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  avgResponseRate: number;
  ppsScore: number;
}

export interface WeeklyActivity {
  date: string;
  count: number;
}

export interface Milestone {
  name: string;
  achieved: boolean;
  date?: Date;
}