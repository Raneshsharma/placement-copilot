// LinkedIn profile data model
export interface LinkedInProfile {
  linkedinUrl?: string;
  headline?: string;
  about?: string;
  experience: ExperienceEntry[];
  skills: string[];
  endorsements: Record<string, number>;
  photoUrl?: string;
  bannerUrl?: string;
  customUrl?: string;
  creatorMode: boolean;
  connectionCount?: number;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

// Optimization sections
export type DimensionStatus = 'complete' | 'in-progress' | 'missing';
export type CardSeverity = 'critical' | 'opportunity' | 'strength';

export interface OptimizationSection {
  id: string;
  groupId: string;
  name: string;
  status: DimensionStatus;
  issueCount: number;
  icon: string;
}

export interface RailGroup {
  id: string;
  name: string;
  icon: string;
  sections: OptimizationSection[];
  overallStatus: DimensionStatus;
}

// Coaching cards
export interface AIAction {
  id: string;
  label: string;
  type: 'rewrite' | 'suggest' | 'improve' | 'tailor' | 'add';
  isPremium: boolean;
}

export interface CoachingCard {
  id: string;
  sectionId: string;
  severity: CardSeverity;
  headline: string;
  body: string;
  linkedSection: string;
  actions: AIAction[];
  priority: number;
}

// Role targeting
export interface RoleTarget {
  id: string;
  title: string;
  keywords: string[];
  industry?: string;
}

// Status dimension
export interface StatusDimension {
  id: string;
  label: string;
  icon: string;
  status: DimensionStatus;
  subLabel: string;
}

// Profile preview section
export interface PreviewSection {
  id: string;
  label: string;
  content: string;
  isEmpty: boolean;
  highlightedKeywords?: string[];
}
