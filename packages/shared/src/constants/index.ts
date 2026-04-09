// ============================================================
// Skill Taxonomy
// ============================================================

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'DevOps & Cloud',
  'Data & ML',
  'Mobile',
  'Security',
  'Soft Skills',
  'Tools & Platforms',
] as const;

export const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Frontend: [
    'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
    'HTML/CSS', 'Tailwind CSS', 'SASS', 'Redux', 'GraphQL', 'REST APIs',
  ],
  Backend: [
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Ruby', 'PHP',
    'Express.js', 'FastAPI', 'NestJS', 'Django', 'Spring Boot', 'GraphQL',
  ],
  'DevOps & Cloud': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'CI/CD',
    'GitHub Actions', 'Jenkins', 'Linux', 'Nginx', 'Prometheus', 'Grafana',
  ],
  'Data & ML': [
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka',
    'Apache Spark', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'dbt',
  ],
  Mobile: [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
  ],
  Security: [
    'OWASP', 'SAST', 'DAST', 'Penetration Testing', 'Security Auditing',
  ],
  'Soft Skills': [
    'Communication', 'Problem Solving', 'Team Leadership', 'Agile/Scrum',
    'Project Management', 'Technical Writing', 'Presentation',
  ],
  'Tools & Platforms': [
    'Git', 'Jira', 'Confluence', 'Figma', 'Postman', 'Datadog', 'Splunk',
  ],
};

export const ALL_SKILLS = Object.values(SKILLS_BY_CATEGORY).flat();

// ============================================================
// Role Categories
// ============================================================

export const ROLE_CATEGORIES = [
  'Software Engineering',
  'Data Science & Analytics',
  'Product Management',
  'Design & UX',
  'DevOps & SRE',
  'Security',
  'Sales & Marketing',
  'Operations',
] as const;

// ============================================================
// Interview Types
// ============================================================

export const INTERVIEW_TYPES = [
  { id: 'TECHNICAL', label: 'Technical Interview', description: 'Algorithms, system design, and domain-specific questions' },
  { id: 'BEHAVIORAL', label: 'Behavioral Interview', description: 'STAR method questions about past experiences' },
  { id: 'SYSTEM_DESIGN', label: 'System Design', description: 'Design scalable distributed systems' },
  { id: 'CASE_STUDY', label: 'Case Study', description: 'Business problem solving scenarios' },
  { id: 'CULTURE_FIT', label: 'Culture Fit', description: 'Team dynamics and company values alignment' },
  { id: 'LEETCODE', label: 'Coding Challenge', description: 'LeetCode-style algorithm problems' },
  { id: 'MIXED', label: 'Mixed Format', description: 'Combination of technical and behavioral questions' },
] as const;

// ============================================================
// Onboarding Steps
// ============================================================

export const ONBOARDING_STEPS = [
  {
    id: 'account',
    title: 'Create Account',
    description: 'Sign up with email or Google',
    estimatedTime: '2 min',
  },
  {
    id: 'profile',
    title: 'Build Profile',
    description: 'Add your headline, summary, and contact info',
    estimatedTime: '5 min',
  },
  {
    id: 'experience',
    title: 'Work Experience',
    description: 'Add your professional experience',
    estimatedTime: '10 min',
  },
  {
    id: 'skills',
    title: 'Skills & Education',
    description: 'List your technical and soft skills',
    estimatedTime: '7 min',
  },
  {
    id: 'target',
    title: 'Target Roles',
    description: 'Select your target job titles and locations',
    estimatedTime: '5 min',
  },
] as const;

// ============================================================
// Kanban Columns
// ============================================================

export const KANBAN_COLUMNS = [
  { id: 'SAVED', label: 'Saved', color: '#6B7280', emoji: 'bookmark' },
  { id: 'APPLIED', label: 'Applied', color: '#3B82F6', emoji: 'send' },
  { id: 'SCREENING', label: 'Screening', color: '#8B5CF6', emoji: 'phone' },
  { id: 'INTERVIEW', label: 'Interview', color: '#F59E0B', emoji: 'calendar' },
  { id: 'OFFER', label: 'Offer', color: '#10B981', emoji: 'trophy' },
  { id: 'REJECTED', label: 'Rejected', color: '#EF4444', emoji: 'x' },
  { id: 'WITHDRAWN', label: 'Withdrawn', color: '#9CA3AF', emoji: 'minus' },
] as const;

// ============================================================
// Application Status Flow
// ============================================================

export const STATUS_TRANSITIONS: Record<string, string[]> = {
  SAVED: ['APPLIED', 'WITHDRAWN'],
  APPLIED: ['SCREENING', 'REJECTED', 'WITHDRAWN'],
  SCREENING: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['OFFER', 'REJECTED'],
  OFFER: ['REJECTED', 'WITHDRAWN'],
  REJECTED: [],
  WITHDRAWN: [],
};
