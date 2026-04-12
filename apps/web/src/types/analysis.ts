export type HealthStatus = "healthy" | "needs-work" | "critical" | "incomplete" | "analyzing";

export type IssueSeverity = "needs-work" | "should-fix" | "quick-win";

export interface AnalysisIssue {
  id: string;
  headline: string;
  severity: IssueSeverity;
  context: string;       // "Here's what we found: [resume excerpt]"
  reason: string;       // "Here's why it matters: [explanation]"
  action: string;       // "Here's what to do: [suggestion]"
  resumeSection: SectionType; // Which section of the resume this relates to
  resumeSectionId: string; // ID for highlight targeting
  suggestedFix?: string; // AI-suggested rewrite (optional pre-loaded)
  actionChips: ActionChip[];
}

export interface ActionChip {
  label: string;
  action: string;        // "rewrite" | "optimize-keywords" | "suggest-verbs" | etc.
  icon?: string;         // Lucide icon name
}

export interface AnalysisCategory {
  id: string;
  name: string;
  description: string;  // Brief description of what this category covers
  section: "resume-quality" | "content" | "ats-health";
  health: HealthStatus;
  issueCount: number;
  isAnalyzed: boolean;
  issues: AnalysisIssue[];
}

export interface ProfileStrength {
  score: number;         // 0-100
  label: string;         // "Strong", "Needs Work", "Building Up"
  overallHealth: HealthStatus;
  categories: AnalysisCategory[];
  missingSections: string[];  // Sections with no data
  partialSections: string[];   // Sections with incomplete data
}

export interface ResumeDocument {
  id: string;
  title: string;
  sections: ResumeSection[];
  atsScore: number;
  lastAnalyzed: string | null;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  label: string;
  content: string;
  bullets: string[];
  isEmpty: boolean;
  isPartial: boolean;
}

export type SectionType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "awards";

// Helper functions
export function getHealthColor(health: HealthStatus): string {
  switch (health) {
    case "healthy":       return "#22c55e";
    case "needs-work":    return "#f59e0b";
    case "critical":      return "#ef4444";
    case "incomplete":    return "#a8a29e";
    case "analyzing":     return "#D97706";
    default:              return "#a8a29e";
  }
}

export function getSeverityLabel(severity: IssueSeverity): string {
  switch (severity) {
    case "needs-work":  return "Needs Work";
    case "should-fix":  return "Should Fix";
    case "quick-win":   return "Quick Win";
    default:            return "Issue";
  }
}
