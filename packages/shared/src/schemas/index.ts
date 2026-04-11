import { z } from 'zod';

// ============================================================
// Auth Schemas
// ============================================================

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// ============================================================
// User Schemas
// ============================================================

export const UserRoleSchema = z.enum(['USER', 'PREMIUM', 'ADMIN']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: UserRoleSchema,
  isActive: z.boolean(),
  deletedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================
// Profile Schemas
// ============================================================

export const ExperienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string(),
});

export const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startYear: z.number().int().min(1950).max(2030),
  endYear: z.number().int().min(1950).max(2030).optional(),
});

export const UpdateProfileSchema = z.object({
  headline: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    technologies: z.array(z.string()),
  })).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  phone: z.string().optional(),
});

// ============================================================
// Resume Schemas
// ============================================================

export const ResumeUploadSchema = z.object({
  title: z.string().min(1).max(200),
});

export const ResumeOptimizeSchema = z.object({
  resumeId: z.string().uuid().optional(),
  resumeText: z.string().optional(),
  jobDescription: z.string(),
  targetRole: z.string(),
});

// ============================================================
// Job Schemas
// ============================================================

export const LocationTypeSchema = z.enum(['ONSITE', 'REMOTE', 'HYBRID']);
export const JobSourceSchema = z.enum(['LINKEDIN', 'INDEED', 'INTERNAL', 'SCRAPED']);

export const JobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  locationType: LocationTypeSchema.optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  skills: z.array(z.string()).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================
// Application Schemas
// ============================================================

export const ApplicationStatusSchema = z.enum([
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN',
]);

export const CreateApplicationSchema = z.object({
  jobListingId: z.string().uuid().optional(),
  resumeId: z.string().uuid().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  status: z.enum(['DRAFT']).default('DRAFT'),
  notes: z.string().optional(),
});

export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatusSchema,
  note: z.string().optional(),
});

// ============================================================
// Interview Schemas
// ============================================================

export const InterviewTypeSchema = z.enum(['BEHAVIORAL', 'TECHNICAL', 'CASE_STUDY', 'SYSTEM_DESIGN', 'HYBRID']);
export const InterviewStatusSchema = z.enum(['SETUP', 'IN_PROGRESS', 'COMPLETED', 'FEEDBACK_READY']);

export const StartInterviewSchema = z.object({
  applicationId: z.string().uuid().optional(),
  interviewType: InterviewTypeSchema,
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

export const SubmitAnswerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  answer: z.string().min(1),
});

// ============================================================
// Skill Gap Schemas
// ============================================================

export const SkillGapSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const GapTypeSchema = z.enum(['MISSING', 'WEAK', 'STALE']);

export const AnalyzeSkillGapSchema = z.object({
  currentSkills: z.array(z.string()),
  targetRole: z.string(),
});

// ============================================================
// Pagination
// ============================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});