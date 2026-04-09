import { z } from 'zod';

// ============================================================
// User & Auth Schemas
// ============================================================

export const UserRoleSchema = z.enum(['JOB_SEEKER', 'RECRUITER', 'ADMIN']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  role: UserRoleSchema,
  emailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Profile Schemas
// ============================================================

export const SkillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  yearsOfExperience: z.number().optional(),
  certifications: z.array(z.string()).optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()).optional(),
});

export const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional(),
});

export const SalaryExpectationSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().default('USD'),
});

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  skills: z.array(SkillSchema),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  targetRoles: z.array(z.string()),
  targetLocations: z.array(z.string()),
  preferredWorkType: z.array(z.enum(['remote', 'hybrid', 'onsite'])),
  salaryExpectation: SalaryExpectationSchema.optional(),
  completenessScore: z.number().min(0).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Resume Schemas
// ============================================================

export const ParsedResumeDataSchema = z.object({
  rawText: z.string(),
  skills: z.array(z.string()),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  summary: z.string().optional(),
});

export const ResumeVersionSchema = z.object({
  versionNumber: z.number().int().min(1),
  s3Key: z.string(),
  atsScore: z.number().optional(),
  keywordMatchScore: z.number().optional(),
  createdAt: z.string().datetime(),
});

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  currentS3Key: z.string(),
  parsedData: ParsedResumeDataSchema,
  atsScore: z.number().optional(),
  keywordMatchScore: z.number().optional(),
  versions: z.array(ResumeVersionSchema),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Job Listing Schemas
// ============================================================

export const LocationTypeSchema = z.enum(['REMOTE', 'HYBRID', 'ONSITE', 'ANY']);
export const JobSourceSchema = z.enum(['LINKEDIN', 'INDEED', 'GLASSDOOR', 'COMPANY_CAREERS', 'OTHER']);

export const SalarySchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().default('USD'),
  interval: z.enum(['yearly', 'monthly', 'hourly']),
});

export const JobListingSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().optional(),
  source: JobSourceSchema,
  title: z.string().min(1),
  company: z.string().min(1),
  companyLogo: z.string().optional(),
  location: z.string(),
  locationType: LocationTypeSchema,
  salary: SalarySchema.optional(),
  description: z.string(),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  benefits: z.array(z.string()).optional(),
  keywords: z.array(z.string()),
  embedding: z.array(z.number()).optional(),
  applicationUrl: z.string().url().optional(),
  postedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Application Schemas
// ============================================================

export const ApplicationStatusSchema = z.enum([
  'SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN',
]);

export const ApplicationTimelineEventSchema = z.object({
  date: z.string().datetime(),
  status: ApplicationStatusSchema,
  note: z.string().optional(),
});

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobListingId: z.string().uuid().optional(),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  companyLogo: z.string().optional(),
  status: ApplicationStatusSchema,
  appliedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  coverLetterS3Key: z.string().optional(),
  resumeId: z.string().uuid().optional(),
  interviewDate: z.string().datetime().optional(),
  offerDetails: z.object({
    salary: z.number().min(0),
    currency: z.string(),
    startDate: z.string().datetime(),
    bonuses: z.array(z.string()).optional(),
  }).optional(),
  timeline: z.array(ApplicationTimelineEventSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Mock Interview Schemas
// ============================================================

export const InterviewTypeSchema = z.enum([
  'TECHNICAL', 'BEHAVIORAL', 'SYSTEM_DESIGN', 'CASE_STUDY', 'CULTURE_FIT', 'LEETCODE', 'MIXED',
]);
export const InterviewStatusSchema = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

export const InterviewQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1),
  category: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().optional(),
});

export const InterviewAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  audioUrl: z.string().optional(),
  startedAt: z.string().datetime(),
  answeredAt: z.string().datetime(),
});

export const InterviewScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  clarity: z.number().min(0).max(10),
  depth: z.number().min(0).max(10),
  relevance: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10),
  categoryScores: z.record(z.string(), z.number()),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  aiFeedback: z.string(),
});

export const MockInterviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: InterviewTypeSchema,
  status: InterviewStatusSchema,
  targetRole: z.string().optional(),
  questions: z.array(InterviewQuestionSchema),
  answers: z.array(InterviewAnswerSchema),
  scores: InterviewScoreSchema.optional(),
  transcript: z.string().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Skill Gap Schemas
// ============================================================

export const GapSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const GapTypeSchema = z.enum(['TECHNICAL_SKILL', 'SOFT_SKILL', 'CERTIFICATION', 'EXPERIENCE', 'TOOL']);

export const LearningResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  type: z.enum(['course', 'article', 'video', 'book', 'project']),
  duration: z.string().optional(),
  cost: z.enum(['free', 'paid']).optional(),
});

export const SkillGapSchema = z.object({
  skillName: z.string().min(1),
  gapType: GapTypeSchema,
  severity: GapSeveritySchema,
  currentLevel: z.string(),
  requiredLevel: z.string(),
  description: z.string(),
  learningResources: z.array(LearningResourceSchema).optional(),
  estimatedTimeToAcquire: z.string().optional(),
});

export const SkillGapAnalysisSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  targetRole: z.string().min(1),
  gaps: z.array(SkillGapSchema),
  overallScore: z.number().min(0).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Notification Schemas
// ============================================================

export const NotificationTypeSchema = z.enum([
  'APPLICATION_UPDATE', 'INTERVIEW_REMINDER', 'SKILL_GAP_ALERT',
  'RESUME_FEEDBACK', 'JOB_RECOMMENDATION', 'ONBOARDING', 'SYSTEM',
]);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  title: z.string().min(1),
  message: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

// ============================================================
// Analytics Schemas
// ============================================================

export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  eventName: z.string().min(1),
  eventData: z.record(z.unknown()),
  sessionId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.string().datetime(),
});

// ============================================================
// API Response Schemas
// ============================================================

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

export function ApiResponseSchema<T extends z.ZodSchema>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    timestamp: z.string().datetime(),
  });
}

export const PaginatedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
