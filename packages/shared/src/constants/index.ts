// ============================================================
// Skill Taxonomy
// ============================================================

export const SKILL_CATEGORIES = {
  programming: {
    label: 'Programming Languages',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'C#'],
  },
  frontend: {
    label: 'Frontend Development',
    skills: ['React', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind', 'SASS', 'Webpack', 'Vite'],
  },
  backend: {
    label: 'Backend Development',
    skills: ['Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', 'Rails', 'Laravel', 'GraphQL', 'REST APIs'],
  },
  database: {
    label: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Prisma'],
  },
  cloud: {
    label: 'Cloud & DevOps',
    skills: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Linux'],
  },
  data: {
    label: 'Data & ML',
    skills: ['SQL', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Analysis', 'NLP', 'Computer Vision'],
  },
  soft: {
    label: 'Soft Skills',
    skills: ['Communication', 'Problem Solving', 'Leadership', 'Teamwork', 'Adaptability', 'Time Management', 'Critical Thinking'],
  },
  domain: {
    label: 'Domain Knowledge',
    skills: ['System Design', 'Agile', 'Scrum', 'Product Management', 'UI/UX Design', 'Security', 'Performance Optimization'],
  },
} as const;

// ============================================================
// Interview Types
// ============================================================

export const INTERVIEW_TYPES = [
  { value: 'BEHAVIORAL', label: 'Behavioral', description: 'Questions about past experiences and soft skills', icon: '💬' },
  { value: 'TECHNICAL', label: 'Technical', description: 'Coding problems and technical knowledge', icon: '💻' },
  { value: 'CASE_STUDY', label: 'Case Study', description: 'Business problem solving scenarios', icon: '📊' },
  { value: 'SYSTEM_DESIGN', label: 'System Design', description: 'Design scalable systems and architectures', icon: '🏗️' },
  { value: 'HYBRID', label: 'Hybrid', description: 'Combination of multiple interview types', icon: '🎭' },
] as const;

// ============================================================
// Kanban Columns
// ============================================================

export const KANBAN_COLUMNS = [
  { id: 'DRAFT', label: 'Draft', color: '#94a3b8', icon: '📝' },
  { id: 'SUBMITTED', label: 'Submitted', color: '#3b82f6', icon: '📤' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: '#f59e0b', icon: '👀' },
  { id: 'INTERVIEW', label: 'Interview', color: '#8b5cf6', icon: '🎤' },
  { id: 'OFFERED', label: 'Offered', color: '#10b981', icon: '🎉' },
  { id: 'REJECTED', label: 'Rejected', color: '#ef4444', icon: '❌' },
  { id: 'WITHDRAWN', label: 'Withdrawn', color: '#6b7280', icon: '🚪' },
] as const;

// ============================================================
// Valid Status Transitions
// ============================================================

export const STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED', 'WITHDRAWN'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'WITHDRAWN'],
  UNDER_REVIEW: ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW: ['OFFERED', 'REJECTED', 'WITHDRAWN'],
  OFFERED: ['WITHDRAWN'],
  REJECTED: [],
  WITHDRAWN: [],
} as const;

// ============================================================
// Onboarding Steps
// ============================================================

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Your Intent', description: 'What are your career goals?', fields: ['intent'] },
  { id: 2, title: 'About You', description: 'Tell us about yourself', fields: ['firstName', 'lastName', 'headline', 'summary'] },
  { id: 3, title: 'Target Roles', description: 'What jobs are you targeting?', fields: ['targetRoles'] },
  { id: 4, title: 'Resume', description: 'Upload your resume', fields: ['resume'] },
  { id: 5, title: 'Preferences', description: 'Set your preferences', fields: ['notifications'] },
] as const;

// ============================================================
// PPS Scoring Weights
// ============================================================

export const PPS_WEIGHTS = {
  skillsMatch: 0.30,
  experienceRelevance: 0.25,
  educationFit: 0.20,
  marketDemand: 0.15,
  locationFactor: 0.10,
} as const;

// ============================================================
// Gap Priority Weights
// ============================================================

export const GAP_PRIORITY_WEIGHTS = {
  roleCriticality: 0.40,
  marketDemand: 0.20,
  learningEase: 0.15,
  timeInvestment: 0.15,
  careerLift: 0.10,
} as const;