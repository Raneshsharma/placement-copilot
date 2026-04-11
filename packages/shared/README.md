# @placementcopilot/shared

Shared TypeScript types, validation schemas, constants, and utilities used across the Placement Copilot monorepo (web, api, and ai apps).

## Installation

This package is internal to the monorepo. It is published as a workspace package and imported via the workspace name.

```typescript
import { User, Application, LoginSchema } from '@placementcopilot/shared';
```

## Exports

### Types (`src/types/index.ts`)

TypeScript interfaces that mirror the Prisma schema exactly.

#### Enums

```typescript
import { UserRole, ApplicationStatus, InterviewType, SkillGapSeverity } from '@placementcopilot/shared';
```

| Enum | Values |
|------|--------|
| `UserRole` | `USER`, `PREMIUM`, `ADMIN` |
| `LocationType` | `ONSITE`, `REMOTE`, `HYBRID` |
| `JobSource` | `LINKEDIN`, `INDEED`, `INTERNAL`, `SCRAPED` |
| `ApplicationStatus` | `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `INTERVIEW`, `OFFERED`, `REJECTED`, `WITHDRAWN` |
| `InterviewType` | `BEHAVIORAL`, `TECHNICAL`, `CASE_STUDY`, `SYSTEM_DESIGN`, `HYBRID` |
| `InterviewStatus` | `SETUP`, `IN_PROGRESS`, `COMPLETED`, `FEEDBACK_READY` |
| `NotificationType` | `APPLICATION_STATUS`, `INTERVIEW_READY`, `SKILL_ALERT`, `SYSTEM` |
| `SkillGapSeverity` | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `GapType` | `MISSING`, `WEAK`, `STALE` |

#### Entity Types

| Type | Description |
|------|-------------|
| `User` | User account with email, name, and role |
| `Profile` | Extended user profile with headline, summary, skills, experience, education, etc. |
| `Resume` | Resume with parsed data, ATS score, and versioning |
| `JobListing` | Job posting with company, location, salary, requirements |
| `Application` | Job application with status and timeline |
| `MockInterview` | Interview session with questions, answers, and scores |
| `SkillGapAnalysis` | Gap analysis result with roadmap |
| `Notification` | User notification |
| `AnalyticsEvent` | Analytics tracking event |

#### Composite Types

```typescript
interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

interface Project {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

interface TimelineEntry {
  status: ApplicationStatus;
  timestamp: Date;
  note?: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

interface SkillGap {
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

interface LearningResource {
  title: string;
  url: string;
  type: 'course' | 'article' | 'video' | 'book' | 'project';
  duration?: string;
  cost?: 'free' | 'paid';
}

interface RoadmapStep {
  title: string;
  duration: string;
  resources: string[];
  completed?: boolean;
}
```

#### API Response Types

```typescript
// Standard API response
interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  meta?: { page?: number; limit?: number; total?: number; };
}

// Paginated response
interface PaginatedResponse<T = unknown> {
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

// Dashboard types
interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  avgResponseRate: number;
  ppsScore: number;
}
```

### Schemas (`src/schemas/index.ts`)

Zod validation schemas for API request/response validation.

#### Auth Schemas

```typescript
LoginSchema         // { email: string.email(), password: string.min(8) }
RegisterSchema     // { email, password: min(8), firstName, lastName }
RefreshTokenSchema // { refreshToken: string }
```

#### User Schemas

```typescript
UserRoleSchema  // z.enum(['USER', 'PREMIUM', 'ADMIN'])
UserSchema     // Full user object validation
```

#### Profile Schemas

```typescript
ExperienceSchema   // Experience object validation
EducationSchema    // Education object validation
UpdateProfileSchema // Partial profile update validation
```

#### Resume Schemas

```typescript
ResumeUploadSchema   // { title: string }
ResumeOptimizeSchema // { resumeId?, resumeText?, jobDescription, targetRole }
```

#### Job Schemas

```typescript
LocationTypeSchema // z.enum(['ONSITE', 'REMOTE', 'HYBRID'])
JobSourceSchema    // z.enum(['LINKEDIN', 'INDEED', 'INTERNAL', 'SCRAPED'])
JobSearchSchema    // { query?, location?, locationType?, salaryMin?, salaryMax?, skills?, page, limit }
```

#### Application Schemas

```typescript
ApplicationStatusSchema      // z.enum([all statuses])
CreateApplicationSchema      // { jobListingId?, resumeId?, company, position, status: 'DRAFT', notes? }
UpdateApplicationStatusSchema // { status, note? }
```

#### Interview Schemas

```typescript
InterviewTypeSchema    // z.enum([all types])
InterviewStatusSchema  // z.enum([all statuses])
StartInterviewSchema   // { applicationId?, interviewType, difficulty: 'medium' }
SubmitAnswerSchema     // { sessionId, questionId, answer }
```

#### Skill Gap Schemas

```typescript
SkillGapSeveritySchema // z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
GapTypeSchema          // z.enum(['MISSING', 'WEAK', 'STALE'])
AnalyzeSkillGapSchema  // { currentSkills: string[], targetRole }
```

#### Pagination

```typescript
PaginationSchema // { page: coerce to number, limit: coerce to number, sortBy?, sortOrder: 'asc'|'desc' }
```

### Constants (`src/constants/index.ts`)

#### Skill Categories

Organized taxonomy of skills across 8 categories:

```typescript
SKILL_CATEGORIES = {
  programming:   { label: 'Programming Languages', skills: ['Python', 'JavaScript', ...] },
  frontend:      { label: 'Frontend Development', skills: ['React', 'Next.js', ...] },
  backend:       { label: 'Backend Development', skills: ['Node.js', 'Express', ...] },
  database:      { label: 'Databases', skills: ['PostgreSQL', 'MongoDB', ...] },
  cloud:         { label: 'Cloud & DevOps', skills: ['AWS', 'Docker', ...] },
  data:          { label: 'Data & ML', skills: ['SQL', 'TensorFlow', ...] },
  soft:          { label: 'Soft Skills', skills: ['Communication', 'Leadership', ...] },
  domain:        { label: 'Domain Knowledge', skills: ['System Design', 'Agile', ...] },
}
```

#### Interview Types

```typescript
INTERVIEW_TYPES = [
  { value: 'BEHAVIORAL', label: 'Behavioral', description: 'STAR-method questions', icon: '...' },
  { value: 'TECHNICAL', label: 'Technical', description: 'Coding problems', icon: '...' },
  { value: 'CASE_STUDY', label: 'Case Study', description: 'Business problems', icon: '...' },
  { value: 'SYSTEM_DESIGN', label: 'System Design', description: 'Scalable systems', icon: '...' },
  { value: 'HYBRID', label: 'Hybrid', description: 'Multiple types', icon: '...' },
]
```

#### Kanban Columns

```typescript
KANBAN_COLUMNS = [
  { id: 'DRAFT', label: 'Draft', color: '#94a3b8', icon: '...' },
  { id: 'SUBMITTED', label: 'Submitted', color: '#3b82f6', icon: '...' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: '#f59e0b', icon: '...' },
  { id: 'INTERVIEW', label: 'Interview', color: '#8b5cf6', icon: '...' },
  { id: 'OFFERED', label: 'Offered', color: '#10b981', icon: '...' },
  { id: 'REJECTED', label: 'Rejected', color: '#ef4444', icon: '...' },
  { id: 'WITHDRAWN', label: 'Withdrawn', color: '#6b7280', icon: '...' },
]
```

#### Status Transitions

```typescript
STATUS_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'WITHDRAWN'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'WITHDRAWN'],
  UNDER_REVIEW: ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW: ['OFFERED', 'REJECTED', 'WITHDRAWN'],
  OFFERED: ['WITHDRAWN'],
  REJECTED: [],
  WITHDRAWN: [],
}
```

#### Onboarding Steps

```typescript
ONBOARDING_STEPS = [
  { id: 1, title: 'Your Intent', description: 'What are your career goals?', fields: ['intent'] },
  { id: 2, title: 'About You', description: 'Tell us about yourself', fields: ['firstName', 'lastName', 'headline', 'summary'] },
  { id: 3, title: 'Target Roles', description: 'What jobs are you targeting?', fields: ['targetRoles'] },
  { id: 4, title: 'Resume', description: 'Upload your resume', fields: ['resume'] },
  { id: 5, title: 'Preferences', description: 'Set your preferences', fields: ['notifications'] },
]
```

#### Scoring Weights

```typescript
// PPS (Placement Profile Score) weights
PPS_WEIGHTS = {
  skillsMatch: 0.30,
  experienceRelevance: 0.25,
  educationFit: 0.20,
  marketDemand: 0.15,
  locationFactor: 0.10,
}

// Skill gap priority weights
GAP_PRIORITY_WEIGHTS = {
  roleCriticality: 0.40,
  marketDemand: 0.20,
  learningEase: 0.15,
  timeInvestment: 0.15,
  careerLift: 0.10,
}
```

### Utilities (`src/utils/index.ts`)

#### Date Formatters

```typescript
formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string
formatRelativeDate(date: Date | string): string  // "Today", "Yesterday", "3 days ago"
daysSince(date: Date | string): number
```

#### Score Formatters

```typescript
formatPPS(score: number): string     // "78"
formatPercentage(value: number, decimals?: number): string  // "85.5%"
```

#### Status Helpers

```typescript
getStatusColor(status: string): string   // Hex color code
getMatchColor(percentage: number): string  // Green >=70, Yellow >=40, Red <40
```

#### Profile Helpers

```typescript
calculateProfileCompleteness(profile: Record<string, unknown>): number  // 0-100
```

#### API Response Helpers

```typescript
createApiResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T>
createApiError(statusCode: number, message: string, error: string): ApiResponse<never>
createPaginatedResponse<T>(data: T[], page, pageSize, totalItems): PaginatedResponse<T>
```

#### Misc Utilities

```typescript
slugify(text: string): string           // "Hello World!" → "hello-world"
formatCurrency(amount: number, currency?: string): string  // "$120,000"
```

## Build

The package uses [tsup](https://tsup.egoist.dev/) for fast TypeScript bundling with both ESM and CJS output.

```bash
npm run build --workspace=@placementcopilot/shared
```

Output is generated in `packages/shared/dist/` as both ESM (`.js` + `.d.ts`) and CJS bundles.

## Adding New Types

When adding new Prisma models or API features:

1. Add the TypeScript type in `src/types/index.ts`
2. Add the corresponding Zod schema in `src/schemas/index.ts`
3. Add relevant constants in `src/constants/index.ts`
4. Add utility functions in `src/utils/index.ts`
5. Export from `src/index.ts`
