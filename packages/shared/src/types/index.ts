// ============================================================
// User & Authentication Types
// ============================================================

export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Profile Types
// ============================================================

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  certifications?: string[];
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
}

export interface Profile {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  targetRoles: string[];
  targetLocations: string[];
  preferredWorkType: ('remote' | 'hybrid' | 'onsite')[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  completenessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Resume Types
// ============================================================

export interface ParsedResumeData {
  rawText: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  summary?: string;
}

export interface ResumeVersion {
  versionNumber: number;
  s3Key: string;
  atsScore?: number;
  keywordMatchScore?: number;
  createdAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  name: string;
  currentS3Key: string;
  parsedData: ParsedResumeData;
  atsScore?: number;
  keywordMatchScore?: number;
  versions: ResumeVersion[];
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Job Listing Types
// ============================================================

export enum LocationType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
  ANY = 'ANY',
}

export enum JobSource {
  LINKEDIN = 'LINKEDIN',
  INDEED = 'INDEED',
  GLASSDOOR = 'GLASSDOOR',
  COMPANY_CAREERS = 'COMPANY_CAREERS',
  OTHER = 'OTHER',
}

export interface JobListing {
  id: string;
  externalId?: string;
  source: JobSource;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: LocationType;
  salary?: {
    min: number;
    max: number;
    currency: string;
    interval: 'yearly' | 'monthly' | 'hourly';
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  keywords: string[];
  embedding?: number[];
  applicationUrl?: string;
  postedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Application Types
// ============================================================

export enum ApplicationStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface ApplicationTimelineEvent {
  date: Date;
  status: ApplicationStatus;
  note?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobListingId?: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  status: ApplicationStatus;
  appliedAt?: Date;
  notes?: string;
  coverLetterS3Key?: string;
  resumeId?: string;
  interviewDate?: Date;
  offerDetails?: {
    salary: number;
    currency: string;
    startDate: Date;
    bonuses?: string[];
  };
  timeline: ApplicationTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Mock Interview Types
// ============================================================

export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  CASE_STUDY = 'CASE_STUDY',
  CULTURE_FIT = 'CULTURE_FIT',
  LEETCODE = 'LEETCODE',
  MIXED = 'MIXED',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

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

export interface InterviewScore {
  overall: number;
  clarity: number;
  depth: number;
  relevance: number;
  confidence: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  aiFeedback: string;
}

export interface MockInterview {
  id: string;
  userId: string;
  type: InterviewType;
  status: InterviewStatus;
  targetRole?: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  scores?: InterviewScore;
  transcript?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Skill Gap Analysis Types
// ============================================================

export enum GapSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum GapType {
  TECHNICAL_SKILL = 'TECHNICAL_SKILL',
  SOFT_SKILL = 'SOFT_SKILL',
  CERTIFICATION = 'CERTIFICATION',
  EXPERIENCE = 'EXPERIENCE',
  TOOL = 'TOOL',
}

export interface SkillGap {
  skillName: string;
  gapType: GapType;
  severity: GapSeverity;
  currentLevel: string;
  requiredLevel: string;
  description: string;
  learningResources?: {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'book' | 'project';
    duration?: string;
    cost?: 'free' | 'paid';
  }[];
  estimatedTimeToAcquire?: string;
}

export interface SkillGapAnalysis {
  id: string;
  userId: string;
  targetRole: string;
  gaps: SkillGap[];
  overallScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Notification Types
// ============================================================

export enum NotificationType {
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  INTERVIEW_REMINDER = 'INTERVIEW_REMINDER',
  SKILL_GAP_ALERT = 'SKILL_GAP_ALERT',
  RESUME_FEEDBACK = 'RESUME_FEEDBACK',
  JOB_RECOMMENDATION = 'JOB_RECOMMENDATION',
  ONBOARDING = 'ONBOARDING',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

// ============================================================
// Analytics Types
// ============================================================

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventName: string;
  eventData: Record<string, unknown>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================================
// PPS Score Types
// ============================================================

export interface PPSScore {
  overall: number;
  technicalSkills: number;
  softSkills: number;
  experience: number;
  education: number;
  marketAlignment: number;
  breakdown: {
    component: string;
    score: number;
    maxScore: number;
  }[];
  calculatedAt: Date;
}

// ============================================================
// Onboarding Types
// ============================================================

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  profileCompleteness: number;
  resumeUploaded: boolean;
  targetRolesSelected: boolean;
}

export interface OnboardingData {
  email: string;
  password?: string;
  googleToken?: string;
  profile?: Partial<Profile>;
  targetRoles?: string[];
  resumeData?: ParsedResumeData;
  preferredWorkType?: ('remote' | 'hybrid' | 'onsite')[];
  salaryExpectation?: { min: number; max: number; currency: string };
}

// ============================================================
// API Response Envelopes
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
