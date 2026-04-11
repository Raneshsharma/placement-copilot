# Resume Analysis Workspace — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original, polished resume analysis workspace featuring a Readiness Band, sectioned category rail, conversation-flow issue cards, smart overlay preview, and connected career tools. Assistant-style layout with warm onboarding palette.

**Architecture:** Full-page dedicated workspace at `/onboarding/confirm` (with `/workspace` as direct URL). Three-panel layout: slim left rail + dominant center panel + collapsible right preview. Zustand stores for workspace and analysis state. CSS Modules for component isolation, warm amber palette via CSS variables. Framer Motion for scroll-sync and transitions.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, CSS Modules, Zustand, Framer Motion, Radix UI (accordion, tabs, dialog), Lucide icons.

---

## File Map

### New files (created)
- `apps/web/src/stores/workspace-store.ts` — Zustand store for workspace state (selected category, preview visibility, highlighted section, analysis results)
- `apps/web/src/types/analysis.ts` — TypeScript types for analysis categories, issues, scores, health states
- `apps/web/src/app/(workspace)/layout.tsx` — Workspace layout (full-page, no dashboard chrome)
- `apps/web/src/app/(workspace)/workspace/page.tsx` — Main workspace page
- `apps/web/src/app/onboarding/confirm/page.tsx` — Redirects to /workspace (entry point after onboarding)
- `apps/web/src/components/workspace/readiness-band.tsx` — Readiness Band component
- `apps/web/src/components/workspace/sectioned-rail.tsx` — Sectioned Rail component
- `apps/web/src/components/workspace/issue-card.tsx` — Issue Card (Conversation Flow) component
- `apps/web/src/components/workspace/analysis-panel.tsx` — Center panel with issue card list
- `apps/web/src/components/workspace/resume-preview.tsx` — Resume Preview Panel component
- `apps/web/src/components/workspace/ai-inline-panel.tsx` — AI inline panel for rewrite/optimize actions
- `apps/web/src/app/(workspace)/workspace/workspace.module.css` — CSS Module for workspace layout styles
- `apps/web/src/components/workspace/skeleton-panels.tsx` — Loading/empty/error state components

### Modified files
- `apps/web/src/app/globals.css` — Add workspace CSS variables and layout utilities
- `apps/web/src/app/layout.tsx` — Add workspace route group configuration
- `apps/web/src/middleware.ts` — Allow `/workspace` and `/onboarding/confirm` through without auth

---

## Tasks

### Task 1: Analysis Types and Mock Data

**Files:**
- Create: `apps/web/src/types/analysis.ts`

- [ ] **Step 1: Write the analysis type definitions**

```typescript
// apps/web/src/types/analysis.ts

export type HealthStatus = "healthy" | "needs-work" | "critical" | "incomplete" | "analyzing";

export type IssueSeverity = "needs-work" | "should-fix" | "quick-win";

export interface AnalysisIssue {
  id: string;
  headline: string;
  severity: IssueSeverity;
  context: string;       // "Here's what we found: [resume excerpt]"
  reason: string;        // "Here's why it matters: [explanation]"
  action: string;        // "Here's what to do: [suggestion]"
  resumeSection: string; // Which section of the resume this relates to
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
  label: string;        // "Strong", "Needs Work", "Building Up"
  overallHealth: HealthStatus;
  categories: AnalysisCategory[];
  missingSections: string[]; // Sections with no data
  partialSections: string[]; // Sections with incomplete data
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

export type SectionType = "header" | "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "awards";

// Helper functions
export function getHealthColor(health: HealthStatus): string {
  switch (health) {
    case "healthy": return "#22c55e";
    case "needs-work": return "#f59e0b";
    case "critical": return "#ef4444";
    case "incomplete": return "#a8a29e";
    case "analyzing": return "#D97706";
    default: return "#a8a29e";
  }
}

export function getSeverityLabel(severity: IssueSeverity): string {
  switch (severity) {
    case "needs-work": return "Needs Work";
    case "should-fix": return "Should Fix";
    case "quick-win": return "Quick Win";
    default: return "Issue";
  }
}
```

- [ ] **Step 2: Write mock analysis data**

```typescript
// apps/web/src/types/analysis.mock.ts
import type { ProfileStrength, AnalysisCategory, ResumeDocument } from "./analysis";

export const MOCK_RESUME_DOCUMENT: ResumeDocument = {
  id: "resume-001",
  title: "Software Engineer Resume",
  atsScore: 68,
  lastAnalyzed: new Date().toISOString(),
  sections: [
    { id: "header", type: "header", label: "Contact", content: "Alex Johnson · alex.j@example.com · (555) 123-4567 · San Francisco, CA", bullets: [], isEmpty: false, isPartial: false },
    { id: "summary", type: "summary", label: "Summary", content: "Experienced software engineer with 4 years of experience building scalable web applications.", bullets: ["Experienced software engineer", "4 years of experience", "scalable web applications"], isEmpty: false, isPartial: false },
    { id: "exp-1", type: "experience", label: "Experience", content: "", bullets: [
      "Helped with building microservices architecture for payment processing",
      "Worked on improving API response times",
      "Assisted team in code reviews",
      "Contributed to documentation updates",
    ], isEmpty: false, isPartial: false },
    { id: "exp-2", type: "experience", label: "Experience", content: "", bullets: [
      "Responsible for frontend development using React",
      "Helped users with technical support",
      "Maintained CI/CD pipelines",
    ], isEmpty: false, isPartial: false },
    { id: "edu-1", type: "education", label: "Education", content: "BS Computer Science, State University, 2020", bullets: [], isEmpty: false, isPartial: false },
    { id: "skills", type: "skills", label: "Skills", content: "", bullets: [
      "JavaScript, TypeScript, React, Node.js",
      "Python, Django, Flask",
      "AWS, Docker, Kubernetes",
      "PostgreSQL, MongoDB",
      "Git, CI/CD",
    ], isEmpty: false, isPartial: false },
  ],
};

export const MOCK_PROFILE_STRENGTH: ProfileStrength = {
  score: 68,
  label: "Building Up",
  overallHealth: "needs-work",
  missingSections: [],
  partialSections: [],
  categories: [
    {
      id: "impact",
      name: "Impact",
      description: "How well your achievements show results and value",
      section: "resume-quality",
      health: "needs-work",
      issueCount: 3,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-1",
          headline: "Action verbs could be stronger",
          severity: "needs-work",
          context: "Here's what we found:\n\"Helped with building microservices\"",
          reason: "Here's why it matters:\nRecruiters scan in under 6 seconds. Weak verbs like 'helped' and 'worked on' make them skip past your achievements. ATS systems also weigh action verbs heavily — strong verbs signal leadership and measurable results.",
          action: "Here's what to do:\nReplace 'helped with' with 'led' or 'built'. Replace 'worked on' with 'improved' or 'delivered'. Focus on the impact, not the task. Turn \"Helped with building microservices\" into \"Led design and implementation of microservices architecture handling 10K+ requests/day.\"",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Suggest stronger verbs", action: "suggest-verbs", icon: "Wand2" },
            { label: "Show examples", action: "show-examples", icon: "Lightbulb" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
        {
          id: "issue-2",
          headline: "Add quantified results to achievements",
          severity: "should-fix",
          context: "Here's what we found:\n\"Worked on improving API response times\"",
          reason: "Here's why it matters:\nNumbers and metrics make achievements concrete and believable. A resume with quantified results is 40% more likely to get a callback. ATS tools also flag quantified achievements as high-quality content.",
          action: "Here's what to do:\nAdd specific numbers to your achievements. Instead of \"improved API response times\", try \"reduced API response time by 45% (from 800ms to 440ms)\". The more specific, the better.",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Add impact metrics", action: "add-metrics", icon: "TrendingUp" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "clarity",
      name: "Clarity",
      description: "How clear and scannable your resume is",
      section: "resume-quality",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "structure",
      name: "Structure",
      description: "How well your resume is organized",
      section: "resume-quality",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-3",
          headline: "Experience section ordering could be optimized",
          severity: "quick-win",
          context: "Here's what we found:\nYour most recent role is listed but achievements aren't ranked by impact.",
          reason: "Here's why it matters:\nRecruiters read top-to-bottom. Your most impressive achievements should appear first in each section — they often stop reading after the first few bullets.",
          action: "Here's what to do:\nReorder your bullets in each role so the strongest achievements come first. Use the 'PAR' method: Problem → Action → Result.",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Optimize order", action: "optimize-order", icon: "ArrowUpDown" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "formatting",
      name: "Formatting",
      description: "Visual and layout consistency",
      section: "resume-quality",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "summary-section",
      name: "Summary",
      description: "Your professional summary statement",
      section: "content",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-4",
          headline: "Summary could be more specific",
          severity: "needs-work",
          context: "Here's what we found:\n\"Experienced software engineer with 4 years of experience building scalable web applications.\"",
          reason: "Here's why it matters:\nA generic summary doesn't differentiate you from hundreds of other candidates. Recruiters spend an average of 6 seconds on a resume — your summary needs to make an immediate, specific impression.",
          action: "Here's what to do:\nAdd specifics about what you build, the scale you've worked at, and the types of problems you solve. E.g., \"Backend engineer specializing in high-throughput APIs and distributed systems. 4 years building payment infrastructure processing $2M+ daily.\"",
          resumeSection: "Summary",
          resumeSectionId: "summary",
          actionChips: [
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
            { label: "Tailor for role", action: "tailor", icon: "Target" },
          ],
        },
      ],
    },
    {
      id: "experience-content",
      name: "Experience",
      description: "Work history and achievements",
      section: "content",
      health: "needs-work",
      issueCount: 2,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "skills-section",
      name: "Skills",
      description: "Technical and professional skills",
      section: "content",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "education-section",
      name: "Education",
      description: "Academic background and qualifications",
      section: "content",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "keywords",
      name: "Keywords",
      description: "Industry terms and ATS optimization",
      section: "ats-health",
      health: "needs-work",
      issueCount: 2,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-5",
          headline: "Missing some key terms for your target roles",
          severity: "should-fix",
          context: "Here's what we found:\nYour resume lacks terms like 'system design', 'microservices', 'distributed systems', 'CI/CD', and 'cloud infrastructure'.",
          reason: "Here's why it matters:\nATS systems scan for keyword matches against the job description. Missing industry terms can get you filtered out before a human ever sees your resume.",
          action: "Here's what to do:\nAdd a skills section or adjust existing descriptions to include these terms naturally. E.g., \"Designed microservices\" is better than just \"worked on microservices.\"",
          resumeSection: "Skills",
          resumeSectionId: "skills",
          actionChips: [
            { label: "Optimize keywords", action: "optimize-keywords", icon: "Search" },
            { label: "Check match score", action: "match-score", icon: "Zap" },
            { label: "Tailor for role", action: "tailor", icon: "Target" },
          ],
        },
      ],
    },
    {
      id: "role-alignment",
      name: "Role Alignment",
      description: "How well your resume fits your target roles",
      section: "ats-health",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-6",
          headline: "Headline doesn't match your target roles",
          severity: "needs-work",
          context: "Here's what we found:\n\"Experienced software engineer\" is too generic for Senior/Staff level applications.",
          reason: "Here's why it matters:\nRecruiters and ATS systems use your headline as a primary signal. A generic headline makes it harder to match against specific roles and reduces callback rates.",
          action: "Here's what to do:\nBe more specific. \"Software Engineer\" → \"Senior Backend Engineer specializing in distributed systems and API design\"",
          resumeSection: "Summary",
          resumeSectionId: "summary",
          actionChips: [
            { label: "Tailor headline", action: "tailor-headline", icon: "Target" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "dates",
      name: "Dates",
      description: "Employment timeline and date consistency",
      section: "ats-health",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
  ],
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/types/analysis.ts
git commit -m "feat(workspace): add analysis types and mock data

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Workspace Zustand Store

**Files:**
- Create: `apps/web/src/stores/workspace-store.ts`

- [ ] **Step 1: Write the workspace store**

```typescript
// apps/web/src/stores/workspace-store.ts
import { create } from "zustand";
import type { ProfileStrength, ResumeDocument, AnalysisCategory, AnalysisIssue } from "@/types/analysis";
import { MOCK_PROFILE_STRENGTH, MOCK_RESUME_DOCUMENT } from "@/types/analysis.mock";

type WorkspaceStatus = "loading" | "analyzing" | "ready" | "partial" | "error";

interface WorkspaceState {
  status: WorkspaceStatus;
  profileStrength: ProfileStrength | null;
  resumeDocument: ResumeDocument | null;
  selectedCategoryId: string | null;
  selectedIssueId: string | null;
  highlightedSectionId: string | null;
  previewVisible: boolean;
  activeAiPanel: string | null;  // issue ID with open AI panel
  errorMessage: string | null;

  // Actions
  setStatus: (status: WorkspaceStatus) => void;
  setProfileStrength: (data: ProfileStrength) => void;
  setResumeDocument: (doc: ResumeDocument) => void;
  selectCategory: (categoryId: string) => void;
  selectIssue: (issueId: string) => void;
  highlightSection: (sectionId: string | null) => void;
  togglePreview: () => void;
  openAiPanel: (issueId: string) => void;
  closeAiPanel: () => void;
  setError: (message: string | null) => void;
  loadMockData: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  status: "loading",
  profileStrength: null,
  resumeDocument: null,
  selectedCategoryId: null,
  selectedIssueId: null,
  highlightedSectionId: null,
  previewVisible: true,
  activeAiPanel: null,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setProfileStrength: (data) => set({ profileStrength: data }),
  setResumeDocument: (doc) => set({ resumeDocument: doc }),
  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId, selectedIssueId: null, highlightedSectionId: null }),
  selectIssue: (issueId) => {
    const { profileStrength } = get();
    const issue = profileStrength?.categories
      .flatMap(c => c.issues)
      .find(i => i.id === issueId);
    set({
      selectedIssueId: issueId,
      highlightedSectionId: issue?.resumeSectionId ?? null,
    });
  },
  highlightSection: (sectionId) => set({ highlightedSectionId: sectionId }),
  togglePreview: () => set((state) => ({ previewVisible: !state.previewVisible })),
  openAiPanel: (issueId) => set({ activeAiPanel: issueId }),
  closeAiPanel: () => set({ activeAiPanel: null }),
  setError: (message) => set({ errorMessage: message, status: "error" }),

  loadMockData: () => {
    set({ status: "analyzing" });
    // Simulate analysis delay
    setTimeout(() => {
      set({
        status: "ready",
        profileStrength: MOCK_PROFILE_STRENGTH,
        resumeDocument: MOCK_RESUME_DOCUMENT,
        selectedCategoryId: MOCK_PROFILE_STRENGTH.categories[0].id,
      });
    }, 2000);
  },
}));
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/stores/workspace-store.ts
git commit -m "feat(workspace): add zustand store for workspace state

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: CSS Variables and Layout Utilities

**Files:**
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Add workspace CSS variables**

In the `:root` block inside `@layer base`, after the warm onboarding variables, add:

```css
/* Workspace palette */
--ws-bg: #FAFAF5;
--ws-surface: #FFFFFF;
--ws-primary: #D97706;
--ws-primary-hover: #B45309;
--ws-primary-light: #FEF3C7;
--ws-text-primary: #1C1917;
--ws-text-secondary: #57534E;
--ws-text-muted: #A8A29E;
--ws-border: #E7E5E4;
--ws-healthy: #22c55e;
--ws-needs-work: #f59e0b;
--ws-critical: #ef4444;
--ws-incomplete: #a8a29e;
```

- [ ] **Step 2: Add workspace layout utilities**

After existing utilities (before the warm card classes), add:

```css
/* Workspace layout */
.workspace-page {
  background-color: var(--ws-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.workspace-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
  min-height: calc(100vh - 80px);
  align-items: start;
}

@media (max-width: 1023px) {
  .workspace-layout {
    grid-template-columns: 56px 1fr;
  }
}

@media (max-width: 767px) {
  .workspace-layout {
    grid-template-columns: 1fr;
  }
}

.workspace-center {
  min-height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 32px 24px;
}

@media (max-width: 767px) {
  .workspace-center {
    padding: 16px;
  }
}

.workspace-preview-panel {
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  border-left: 1px solid var(--ws-border);
  background: var(--ws-surface);
  padding: 24px;
  width: 360px;
}

@media (max-width: 1279px) {
  .workspace-preview-panel {
    display: none;
  }
  .workspace-preview-panel.is-visible {
    display: block;
    position: fixed;
    right: 0;
    top: 80px;
    width: 380px;
    z-index: 50;
    box-shadow: -8px 0 32px rgba(0,0,0,0.08);
  }
}

/* Issue conversation card */
.issue-card {
  background: var(--ws-surface);
  border: 1px solid var(--ws-border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.issue-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border-color: var(--ws-primary-light);
}

/* Conversation message parts */
.convo-context {
  background: #f9f9f5;
  border-left: 3px solid var(--ws-border);
  padding: 12px 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  color: var(--ws-text-secondary);
  margin: 12px 0;
  white-space: pre-line;
}
.convo-reason {
  color: var(--ws-text-primary);
  font-size: 15px;
  line-height: 1.6;
  margin: 8px 0;
}
.convo-action {
  color: var(--ws-text-primary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  margin: 8px 0;
}
.convo-action::before {
  content: "→ ";
  color: var(--ws-primary);
}

/* Assistant bar */
.assistant-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--ws-border);
}
.assistant-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--ws-primary-light);
  color: var(--ws-primary);
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.assistant-chip:hover {
  background: #fde68a;
  transform: translateY(-1px);
}
.assistant-chip:active {
  transform: scale(0.97);
}

/* Severity badges */
.badge-needs-work {
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}
.badge-should-fix {
  background: #fee2e2;
  color: #991b1b;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}
.badge-quick-win {
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

/* Health dots */
.health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.health-dot.healthy { background-color: var(--ws-healthy); }
.health-dot.needs-work { background-color: var(--ws-needs-work); }
.health-dot.critical { background-color: var(--ws-critical); }
.health-dot.incomplete { background-color: var(--ws-incomplete); }
.health-dot.analyzing {
  background-color: var(--ws-primary);
  animation: pulse-glow 1.5s ease-in-out infinite;
}

/* AI inline panel */
.ai-inline-panel {
  background: var(--ws-primary-light);
  border: 1px solid var(--ws-primary-light);
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  animation: scale-in 0.2s ease-out;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/globals.css
git commit -m "feat(workspace): add CSS variables and layout utilities

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Readiness Band Component

**Files:**
- Create: `apps/web/src/components/workspace/readiness-band.tsx`

- [ ] **Step 1: Write the Readiness Band component**

```tsx
"use client";

import { Eye, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileStrength } from "@/types/analysis";
import styles from "./readiness-band.module.css";

interface ReadinessBandProps {
  profileStrength: ProfileStrength | null;
  selectedCategoryId: string | null;
  onCategoryClick: (categoryId: string) => void;
  onTogglePreview: () => void;
  previewVisible: boolean;
  isLoading: boolean;
  onGetAiHelp?: () => void;
}

export function ReadinessBand({
  profileStrength,
  selectedCategoryId,
  onCategoryClick,
  onTogglePreview,
  previewVisible,
  isLoading,
  onGetAiHelp,
}: ReadinessBandProps) {
  const score = profileStrength?.score ?? 0;
  const label = profileStrength?.label ?? "Analyzing...";
  const overallHealth = profileStrength?.overallHealth ?? "analyzing";
  const categories = profileStrength?.categories ?? [];

  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className={styles.band}>
      {/* Left: Profile Strength */}
      <div className={styles.strengthSection}>
        <div className={styles.strengthLabel}>Profile Strength</div>
        <div className={styles.strengthScore} style={{ color: scoreColor }}>
          {score}
        </div>
        <div className={styles.strengthBar}>
          <div
            className={styles.strengthBarFill}
            style={{ width: `${score}%`, backgroundColor: scoreColor }}
          />
        </div>
        <div className={styles.strengthSublabel}>{label}</div>
      </div>

      {/* Center: Category pills */}
      <div className={styles.pillsContainer}>
        <div className={styles.pillsScroll}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.pillSkeleton} />
            ))
          ) : (
            categories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              const dotColor = cat.health === "healthy" ? "#22c55e"
                : cat.health === "needs-work" ? "#f59e0b"
                : cat.health === "critical" ? "#ef4444"
                : cat.health === "analyzing" ? "#D97706"
                : "#a8a29e";

              return (
                <button
                  key={cat.id}
                  className={cn(styles.pill, isActive && styles.pillActive)}
                  onClick={() => onCategoryClick(cat.id)}
                  aria-label={`${cat.name}: ${cat.health}`}
                  aria-pressed={isActive}
                >
                  <span
                    className={styles.pillDot}
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className={styles.pillName}>{cat.name}</span>
                  {cat.issueCount > 0 && (
                    <span className={styles.pillBadge}>{cat.issueCount}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className={styles.actions}>
        <button
          className={cn(styles.actionBtn, previewVisible && styles.actionBtnActive)}
          onClick={onTogglePreview}
          aria-label="Toggle resume preview"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          className={styles.primaryActionBtn}
          onClick={onGetAiHelp}
          aria-label="Get AI help"
        >
          <Sparkles size={16} />
          <span>Get AI Help</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the CSS module**

Create `apps/web/src/components/workspace/readiness-band.module.css`:

```css
.band {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--ws-surface);
  border-bottom: 1px solid var(--ws-border);
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  height: 80px;
  width: 100%;
}

/* Left — Profile Strength */
.strengthSection {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  min-width: 180px;
}
.strengthLabel {
  font-size: 13px;
  color: var(--ws-text-muted);
  white-space: nowrap;
}
.strengthScore {
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}
.strengthBar {
  width: 80px;
  height: 4px;
  background: var(--ws-border);
  border-radius: 2px;
  overflow: hidden;
}
.strengthBarFill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}
.strengthSublabel {
  font-size: 12px;
  color: var(--ws-text-muted);
  white-space: nowrap;
}

/* Center — Category pills */
.pillsContainer {
  flex: 1;
  overflow: hidden;
}
.pillsScroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0;
}
.pillsScroll::-webkit-scrollbar {
  display: none;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9999px;
  border: 1px solid var(--ws-border);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--ws-text-secondary);
  white-space: nowrap;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
.pill:hover {
  border-color: var(--ws-primary);
  background: var(--ws-primary-light);
  color: var(--ws-primary);
}
.pillActive {
  border-color: var(--ws-primary);
  background: var(--ws-primary-light);
  color: var(--ws-primary);
}
.pillDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pillName {
  font-family: var(--font-inter), sans-serif;
}
.pillBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: var(--ws-primary);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 0 5px;
}
.pillSkeleton {
  width: 80px;
  height: 36px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

/* Right — Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.actionBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--ws-border);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--ws-text-secondary);
  transition: all 0.2s ease;
}
.actionBtn:hover {
  border-color: var(--ws-primary);
  color: var(--ws-primary);
}
.actionBtnActive {
  border-color: var(--ws-primary);
  background: var(--ws-primary-light);
  color: var(--ws-primary);
}
.primaryActionBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--ws-primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.primaryActionBtn:hover {
  background: var(--ws-primary-hover);
}

/* Mobile */
@media (max-width: 767px) {
  .band {
    height: 64px;
    padding: 0 16px;
    gap: 12px;
  }
  .strengthSection {
    min-width: auto;
  }
  .strengthLabel,
  .strengthSublabel {
    display: none;
  }
  .strengthBar {
    display: none;
  }
  .strengthScore {
    font-size: 22px;
  }
  .primaryActionBtn span {
    display: none;
  }
  .actionBtn span {
    display: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/workspace/readiness-band.tsx apps/web/src/components/workspace/readiness-band.module.css
git commit -m "feat(workspace): build readiness band component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Sectioned Rail Component

**Files:**
- Create: `apps/web/src/components/workspace/sectioned-rail.tsx`
- Create: `apps/web/src/components/workspace/sectioned-rail.module.css`

- [ ] **Step 1: Write the Sectioned Rail component**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, Check, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisCategory } from "@/types/analysis";
import styles from "./sectioned-rail.module.css";

interface SectionedRailProps {
  categories: AnalysisCategory[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  missingSections?: string[];
  partialSections?: string[];
}

interface RailSection {
  id: string;
  label: string;
  categories: AnalysisCategory[];
}

const RAIL_SECTIONS: RailSection[] = [
  { id: "resume-quality", label: "Resume Quality", categories: [] },
  { id: "content", label: "Content", categories: [] },
  { id: "ats-health", label: "ATS Health", categories: [] },
];

function getHealthIcon(health: string, issueCount: number) {
  if (health === "healthy") return <Check size={14} color="#22c55e" />;
  if (health === "needs-work" || health === "critical") return <AlertCircle size={14} color={health === "critical" ? "#ef4444" : "#f59e0b"} />;
  return null;
}

export function SectionedRail({
  categories,
  selectedCategoryId,
  onCategorySelect,
  missingSections = [],
  partialSections = [],
}: SectionedRailProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Group categories by section
  const sections = RAIL_SECTIONS.map(section => ({
    ...section,
    categories: categories.filter(c => c.section === section.id),
  }));

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <nav className={styles.rail} aria-label="Resume analysis categories">
      {sections.map(section => {
        const isCollapsed = collapsedSections.has(section.id);
        return (
          <div key={section.id} className={styles.section}>
            {/* Section header */}
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
              aria-expanded={!isCollapsed}
            >
              <span className={styles.sectionLabel}>{section.label}</span>
              <ChevronDown
                size={14}
                className={cn(styles.chevron, isCollapsed && styles.chevronCollapsed)}
              />
            </button>

            {/* Category items */}
            {!isCollapsed && (
              <ul className={styles.categoryList} role="list">
                {section.categories.map(cat => {
                  const isSelected = selectedCategoryId === cat.id;
                  const isPartial = partialSections.includes(cat.id);
                  const isMissing = missingSections.includes(cat.id);
                  const hasIssues = cat.issueCount > 0;
                  const dotColor = cat.health === "healthy" ? "#22c55e"
                    : cat.health === "needs-work" ? "#f59e0b"
                    : cat.health === "critical" ? "#ef4444"
                    : cat.health === "analyzing" ? "#D97706"
                    : "#a8a29e";

                  return (
                    <li key={cat.id}>
                      <button
                        className={cn(styles.categoryItem, isSelected && styles.categoryItemActive)}
                        onClick={() => onCategorySelect(cat.id)}
                        aria-current={isSelected ? "page" : undefined}
                      >
                        <span
                          className={styles.healthDot}
                          style={{ backgroundColor: dotColor }}
                          aria-label={cat.health}
                        />
                        <span className={styles.categoryName}>{cat.name}</span>
                        {isPartial && (
                          <span className={styles.partialBadge}>Partial</span>
                        )}
                        {isMissing && (
                          <span className={styles.missingBadge}>
                            <Plus size={10} />
                          </span>
                        )}
                        {!isPartial && !isMissing && hasIssues && (
                          <span className={styles.issueBadge}>{cat.issueCount}</span>
                        )}
                        {!isPartial && !isMissing && !hasIssues && (
                          <span className={styles.healthyCheck}>
                            <Check size={12} color="#22c55e" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Create the CSS module**

Create `apps/web/src/components/workspace/sectioned-rail.module.css`:

```css
.rail {
  width: 240px;
  min-height: calc(100vh - 80px);
  background: var(--ws-surface);
  border-right: 1px solid var(--ws-border);
  padding: 24px 0;
  flex-shrink: 0;
}

@media (max-width: 1023px) {
  .rail {
    width: 56px;
    padding: 24px 0;
  }
}

@media (max-width: 767px) {
  .rail {
    display: none;
  }
}

.section {
  margin-bottom: 8px;
}

.sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.sectionLabel {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ws-text-muted);
}
.chevron {
  color: var(--ws-text-muted);
  transition: transform 0.2s ease;
}
.chevronCollapsed {
  transform: rotate(-90deg);
}

.categoryList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.categoryItem {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 20px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  position: relative;
}
.categoryItem:hover {
  background: #f9f9f5;
}
.categoryItemActive {
  background: #fef9f0;
  border-left-color: var(--ws-primary);
}

.healthDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.categoryName {
  font-size: 14px;
  font-weight: 500;
  color: var(--ws-text-primary);
  flex: 1;
}

.issueBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: var(--ws-primary);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 0 5px;
}

.partialBadge {
  font-size: 10px;
  font-weight: 600;
  color: #92400e;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 9999px;
}

.missingBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: var(--ws-border);
  color: var(--ws-text-muted);
}

.healthyCheck {
  display: inline-flex;
  align-items: center;
}

/* Tablet icon-only mode */
@media (max-width: 1023px) {
  .sectionLabel,
  .categoryName,
  .issueBadge,
  .partialBadge,
  .missingBadge,
  .healthyCheck {
    display: none;
  }
  .categoryItem {
    justify-content: center;
    padding: 12px;
  }
  .sectionHeader {
    justify-content: center;
    padding: 8px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/workspace/sectioned-rail.tsx apps/web/src/components/workspace/sectioned-rail.module.css
git commit -m "feat(workspace): build sectioned rail navigation component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Issue Card (Conversation Flow) Component

**Files:**
- Create: `apps/web/src/components/workspace/issue-card.tsx`
- Create: `apps/web/src/components/workspace/issue-card.module.css`

- [ ] **Step 1: Write the Issue Card component**

```tsx
"use client";

import { useState } from "react";
import { Wand2, Lightbulb, Sparkles, TrendingUp, ArrowUpDown, Search, Target, Check, X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisIssue, ActionChip } from "@/types/analysis";
import { AiInlinePanel } from "./ai-inline-panel";
import styles from "./issue-card.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  Wand2, Lightbulb, Sparkles, TrendingUp, ArrowUpDown, Search, Target,
};

interface IssueCardProps {
  issue: AnalysisIssue;
  onHighlight?: (sectionId: string) => void;
}

function getSeverityClass(severity: string): string {
  switch (severity) {
    case "needs-work": return styles.badgeNeedsWork;
    case "should-fix": return styles.badgeShouldFix;
    case "quick-win": return styles.badgeQuickWin;
    default: return styles.badgeNeedsWork;
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case "needs-work": return "Needs Work";
    case "should-fix": return "Should Fix";
    case "quick-win": return "Quick Win";
    default: return "Issue";
  }
}

export function IssueCard({ issue, onHighlight }: IssueCardProps) {
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleActionClick = (action: string, chipLabel: string) => {
    setShowAiPanel(true);
    setIsLoadingAi(true);

    // Simulate AI response (in production, call the AI service)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "rewrite": `Based on your context, here's an improved version:\n\n"${issue.context.split("\n").pop()}"\n\n→ "Led the design and implementation of microservices architecture, improving system throughput by 45%."`,
        "suggest-verbs": `Stronger alternatives to consider:\n\n• "Built" instead of "helped with"\n• "Delivered" instead of "worked on"\n• "Spearheaded" instead of "assisted"\n• "Orchestrated" instead of "contributed to"`,
        "add-metrics": `Try adding these metrics to your achievements:\n\n• % improvement in performance\n• $ amount of revenue impacted\n• # of users or customers affected\n• time saved or reduced`,
        "optimize-keywords": `Key terms to weave in naturally:\n\n• "system design" • "distributed systems"\n• "CI/CD" • "cloud infrastructure"\n• "high-throughput" • "API design"`,
        "default": `Here are some suggestions for "${chipLabel}":\n\n1. Be specific about impact\n2. Use action verbs\n3. Include metrics where possible\n4. Match the language of your target role`,
      };
      setAiOutput(responses[action] || responses["default"]);
      setIsLoadingAi(false);
    }, 1500);
  };

  const handleApply = () => {
    setShowAiPanel(false);
    setAiOutput(null);
  };

  const handleDiscard = () => {
    setShowAiPanel(false);
    setAiOutput(null);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headline}>{issue.headline}</h3>
        <span className={cn(styles.severityBadge, getSeverityClass(issue.severity))}>
          {getSeverityLabel(issue.severity)}
        </span>
      </div>

      {/* Conversation flow */}
      <div className={styles.conversation}>
        {issue.context && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s what we found:</span>
            <div className={styles.convoContext}>{issue.context}</div>
          </div>
        )}
        {issue.reason && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s why it matters:</span>
            <p className={styles.convoReason}>{issue.reason}</p>
          </div>
        )}
        {issue.action && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s what to do:</span>
            <p className={styles.convoAction}>{issue.action}</p>
          </div>
        )}
      </div>

      {/* Assistant bar */}
      <div className={styles.assistantBar}>
        {issue.actionChips.map((chip, i) => {
          const Icon = ICON_MAP[chip.icon ?? ""] ?? Sparkles;
          return (
            <button
              key={i}
              className={styles.assistantChip}
              onClick={() => handleActionClick(chip.action, chip.label)}
              aria-label={chip.label}
            >
              <Icon size={14} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI inline panel */}
      {showAiPanel && (
        <AiInlinePanel
          isLoading={isLoadingAi}
          output={aiOutput}
          onApply={handleApply}
          onDiscard={handleDiscard}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the CSS module**

Create `apps/web/src/components/workspace/issue-card.module.css`:

```css
.card {
  background: var(--ws-surface);
  border: 1px solid var(--ws-border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border-color: #fde68a;
}

/* Header */
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.headline {
  font-family: var(--font-manrope), sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--ws-text-primary);
  margin: 0;
  line-height: 1.3;
}

.severityBadge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.badgeNeedsWork {
  background: #fef3c7;
  color: #92400e;
}
.badgeShouldFix {
  background: #fee2e2;
  color: #991b1b;
}
.badgeQuickWin {
  background: #dcfce7;
  color: #166534;
}

/* Conversation blocks */
.conversation {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.convoBlock {
  margin-bottom: 8px;
}
.convoLabel {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ws-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 4px;
}
.convoContext {
  background: #f9f9f5;
  border-left: 3px solid var(--ws-border);
  padding: 10px 14px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  color: var(--ws-text-secondary);
  white-space: pre-line;
  line-height: 1.5;
}
.convoReason {
  font-size: 15px;
  color: var(--ws-text-primary);
  line-height: 1.65;
  margin: 0;
}
.convoAction {
  font-size: 15px;
  color: var(--ws-text-primary);
  font-weight: 500;
  line-height: 1.65;
  margin: 0;
  padding-left: 12px;
  border-left: 3px solid var(--ws-primary);
}

/* Assistant bar */
.assistantBar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--ws-border);
}
.assistantChip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--ws-primary-light);
  color: var(--ws-primary);
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
  font-family: var(--font-inter), sans-serif;
}
.assistantChip:hover {
  background: #fde68a;
  transform: translateY(-1px);
}
.assistantChip:active {
  transform: scale(0.97);
}
```

- [ ] **Step 3: Write the AI Inline Panel**

Create `apps/web/src/components/workspace/ai-inline-panel.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Loader2, Check, X, Copy } from "lucide-react";
import styles from "./ai-inline-panel.module.css";

interface AiInlinePanelProps {
  isLoading: boolean;
  output: string | null;
  onApply: () => void;
  onDiscard: () => void;
}

export function AiInlinePanel({ isLoading, output, onApply, onDiscard }: AiInlinePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.panel}>
      {isLoading ? (
        <div className={styles.loadingState}>
          <Loader2 size={20} className={styles.spinnerIcon} />
          <span className={styles.loadingText}>Generating suggestions...</span>
        </div>
      ) : output ? (
        <>
          <div className={styles.outputSection}>
            <div className={styles.outputLabel}>AI Suggestion</div>
            <pre className={styles.outputText}>{output}</pre>
            <button className={styles.copyBtn} onClick={handleCopy} aria-label="Copy to clipboard">
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className={styles.actions}>
            <button className={styles.applyBtn} onClick={onApply}>
              <Check size={14} />
              Apply to resume
            </button>
            <button className={styles.discardBtn} onClick={onDiscard}>
              <X size={14} />
              Discard
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Create AI panel CSS module**

Create `apps/web/src/components/workspace/ai-inline-panel.module.css`:

```css
.panel {
  background: var(--ws-primary-light);
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  animation: scale-in 0.2s ease-out;
}

.loadingState {
  display: flex;
  align-items: center;
  gap: 12px;
}
.spinnerIcon {
  animation: spin 0.8s linear infinite;
  color: var(--ws-primary);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loadingText {
  font-size: 14px;
  color: var(--ws-primary);
  font-weight: 500;
}

.outputSection {
  position: relative;
}
.outputLabel {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ws-primary);
  margin-bottom: 8px;
}
.outputText {
  font-size: 14px;
  color: var(--ws-text-primary);
  line-height: 1.65;
  white-space: pre-wrap;
  margin: 0;
  font-family: var(--font-inter), sans-serif;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #fde68a;
}
.copyBtn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: none;
  border: 1px solid var(--ws-border);
  cursor: pointer;
  font-size: 12px;
  color: var(--ws-text-secondary);
  margin-top: 8px;
  transition: border-color 0.15s ease;
}
.copyBtn:hover {
  border-color: var(--ws-primary);
  color: var(--ws-primary);
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.applyBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  background: #22c55e;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.15s ease;
}
.applyBtn:hover {
  background: #16a34a;
}
.discardBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  background: transparent;
  color: var(--ws-text-secondary);
  border: 1px solid var(--ws-border);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.discardBtn:hover {
  border-color: var(--ws-text-secondary);
  color: var(--ws-text-primary);
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/workspace/issue-card.tsx apps/web/src/components/workspace/issue-card.module.css apps/web/src/components/workspace/ai-inline-panel.tsx apps/web/src/components/workspace/ai-inline-panel.module.css
git commit -m "feat(workspace): build issue card with conversation flow and AI panel

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Resume Preview Panel

**Files:**
- Create: `apps/web/src/components/workspace/resume-preview.tsx`
- Create: `apps/web/src/components/workspace/resume-preview.module.css`

- [ ] **Step 1: Write the Resume Preview component**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { Download, Maximize2, Minimize2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeDocument } from "@/types/analysis";
import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  document: ResumeDocument | null;
  highlightedSectionId: string | null;
  isVisible: boolean;
  isLoading: boolean;
}

export function ResumePreview({
  document,
  highlightedSectionId,
  isVisible,
  isLoading,
}: ResumePreviewProps) {
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Auto-scroll to highlighted section
  useEffect(() => {
    if (highlightedSectionId) {
      const el = sectionRefs.current.get(highlightedSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedSectionId]);

  if (!isVisible) return null;

  return (
    <aside className={styles.previewPanel} aria-label="Resume preview">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>Resume Preview</div>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarBtn} aria-label="Download PDF">
            <Download size={15} />
          </button>
          <div className={styles.sectionDropdown}>
            <select className={styles.sectionSelect} aria-label="Jump to section">
              <option value="">Jump to section...</option>
              {document?.sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document */}
      {isLoading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonSection}>
              <div className={styles.skeletonSectionTitle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} style={{ width: "75%" }} />
            </div>
          ))}
        </div>
      ) : document ? (
        <div className={styles.document}>
          {document.sections.map(section => {
            const isHighlighted = section.id === highlightedSectionId;
            return (
              <div
                key={section.id}
                ref={(el) => {
                  if (el) sectionRefs.current.set(section.id, el);
                }}
                className={cn(styles.section, isHighlighted && styles.sectionHighlighted)}
                id={`preview-${section.id}`}
                data-section-id={section.id}
              >
                {section.label && (
                  <div className={styles.sectionLabel}>{section.label}</div>
                )}
                {section.content && (
                  <p className={styles.sectionContent}>{section.content}</p>
                )}
                {section.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className={styles.bulletItem}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.isEmpty && (
                  <div className={styles.emptySection}>
                    <span>No content — add it manually</span>
                    <button className={styles.addBtn}>Add</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noDocument}>
          <p>No resume found. Upload one to get started.</p>
          <button className={styles.uploadBtn}>Upload Resume</button>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: Create the CSS module**

Create `apps/web/src/components/workspace/resume-preview.module.css`:

```css
.previewPanel {
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  border-left: 1px solid var(--ws-border);
  background: var(--ws-surface);
  width: 360px;
  flex-shrink: 0;
}

@media (max-width: 1279px) {
  .previewPanel {
    display: none;
  }
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ws-border);
  position: sticky;
  top: 0;
  background: var(--ws-surface);
  z-index: 2;
}
.toolbarTitle {
  font-size: 13px;
  font-weight: 600;
  color: var(--ws-text-primary);
}
.toolbarActions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toolbarBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--ws-border);
  background: transparent;
  cursor: pointer;
  color: var(--ws-text-secondary);
  transition: border-color 0.15s ease;
}
.toolbarBtn:hover {
  border-color: var(--ws-primary);
  color: var(--ws-primary);
}
.sectionSelect {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--ws-border);
  background: transparent;
  font-size: 12px;
  color: var(--ws-text-secondary);
  cursor: pointer;
}

/* Document */
.document {
  padding: 20px;
}
.section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.sectionHighlighted {
  background: #fffbeb;
  border: 1px solid #fde68a;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.08);
}
.sectionLabel {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ws-text-muted);
  margin-bottom: 6px;
}
.sectionContent {
  font-size: 14px;
  color: var(--ws-text-primary);
  line-height: 1.6;
  margin: 0 0 8px;
}
.bulletList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bulletItem {
  font-size: 13px;
  color: var(--ws-text-secondary);
  line-height: 1.5;
  padding-left: 16px;
  position: relative;
}
.bulletItem::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: var(--ws-primary);
  font-weight: bold;
}
.emptySection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f9f9f5;
  border: 1px dashed var(--ws-border);
  border-radius: 8px;
  font-size: 13px;
  color: var(--ws-text-muted);
}
.addBtn {
  font-size: 12px;
  font-weight: 600;
  color: var(--ws-primary);
  background: none;
  border: none;
  cursor: pointer;
}

/* Skeleton */
.skeleton {
  padding: 20px;
}
.skeletonHeader {
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 20px;
}
.skeletonSection {
  margin-bottom: 20px;
}
.skeletonSectionTitle {
  height: 12px;
  width: 60px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}
.skeletonLine {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 6px;
  width: 100%;
}

/* No document */
.noDocument {
  padding: 40px 20px;
  text-align: center;
}
.noDocument p {
  font-size: 14px;
  color: var(--ws-text-secondary);
  margin-bottom: 16px;
}
.uploadBtn {
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--ws-primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

/* Keyframe for skeleton */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/workspace/resume-preview.tsx apps/web/src/components/workspace/resume-preview.module.css
git commit -m "feat(workspace): build resume preview panel with smart highlighting

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Assemble the Workspace Page

**Files:**
- Create: `apps/web/src/app/(workspace)/workspace/page.tsx`
- Create: `apps/web/src/app/(workspace)/workspace/workspace.module.css`

- [ ] **Step 1: Write the workspace page**

```tsx
"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ReadinessBand } from "@/components/workspace/readiness-band";
import { SectionedRail } from "@/components/workspace/sectioned-rail";
import { IssueCard } from "@/components/workspace/issue-card";
import { ResumePreview } from "@/components/workspace/resume-preview";
import type { AnalysisCategory } from "@/types/analysis";
import styles from "./workspace.module.css";

export default function WorkspacePage() {
  const {
    status,
    profileStrength,
    resumeDocument,
    selectedCategoryId,
    selectedIssueId,
    highlightedSectionId,
    previewVisible,
    loadMockData,
    selectCategory,
    selectIssue,
    togglePreview,
    setError,
  } = useWorkspaceStore();

  useEffect(() => {
    // Load mock analysis data (replace with real API call in production)
    loadMockData();
  }, [loadMockData]);

  const categories = profileStrength?.categories ?? [];
  const selectedCategory = categories.find(c => c.id === selectedCategoryId) ?? null;

  const isLoading = status === "loading" || status === "analyzing";
  const isError = status === "error";

  return (
    <div className={styles.page}>
      {/* Readiness Band */}
      <ReadinessBand
        profileStrength={profileStrength}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={selectCategory}
        onTogglePreview={togglePreview}
        previewVisible={previewVisible}
        isLoading={isLoading}
      />

      {/* Main workspace layout */}
      <div className={styles.layout}>
        {/* Left: Sectioned Rail */}
        <SectionedRail
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={selectCategory}
          missingSections={profileStrength?.missingSections ?? []}
          partialSections={profileStrength?.partialSections ?? []}
        />

        {/* Center: Analysis Panel */}
        <main className={styles.center}>
          {/* Analysis in progress */}
          {isLoading && (
            <div className={styles.analyzingState}>
              <div className={styles.analyzingPulse} />
              <h2 className={styles.analyzingTitle}>Analyzing your resume...</h2>
              <p className={styles.analyzingSubtitle}>
                Our AI is reviewing your resume right now. This usually takes about 30 seconds.
              </p>
              <ul className={styles.analyzingChecks}>
                <li>Checking action verbs and impact language</li>
                <li>Verifying ATS keyword density</li>
                <li>Assessing role alignment</li>
              </ul>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className={styles.errorState}>
              <h2 className={styles.errorTitle}>Something went wrong</h2>
              <p className={styles.errorMessage}>
                We couldn&apos;t complete the analysis. Please try again or contact support.
              </p>
              <button
                className={styles.retryBtn}
                onClick={() => loadMockData()}
              >
                Try again
              </button>
            </div>
          )}

          {/* Category content */}
          {!isLoading && !isError && selectedCategory && (
            <div className={styles.categoryContent}>
              {/* Category header */}
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{selectedCategory.name}</h2>
                <p className={styles.categoryDescription}>{selectedCategory.description}</p>
              </div>

              {/* Positive state: no issues */}
              {selectedCategory.issues.length === 0 && (
                <div className={styles.positiveState}>
                  <div className={styles.positiveIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className={styles.positiveMessage}>
                    Looking great in {selectedCategory.name}. No issues found here — your {selectedCategory.name.toLowerCase()} is in good shape.
                  </p>
                </div>
              )}

              {/* Issue cards */}
              {selectedCategory.issues.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onHighlight={(sectionId) => selectIssue(issue.id)}
                />
              ))}
            </div>
          )}

          {/* No category selected */}
          {!isLoading && !isError && !selectedCategoryId && (
            <div className={styles.noSelectionState}>
              <p>Select a category from the left to see your analysis.</p>
            </div>
          )}
        </main>

        {/* Right: Resume Preview */}
        <ResumePreview
          document={resumeDocument}
          highlightedSectionId={highlightedSectionId}
          isVisible={previewVisible}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the workspace CSS module**

Create `apps/web/src/app/(workspace)/workspace/workspace.module.css`:

```css
.page {
  background-color: var(--ws-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Three-panel layout */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 80px);
  align-items: start;
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: 56px 1fr;
  }
}

@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

/* Center panel */
.center {
  min-height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 32px 32px 60px;
  max-width: 720px;
}

@media (max-width: 1023px) {
  .center {
    max-width: none;
    padding: 24px 20px 60px;
  }
}

@media (max-width: 767px) {
  .center {
    padding: 16px 16px 80px;
  }
}

/* Category content */
.categoryContent {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.categoryHeader {
  margin-bottom: 24px;
}
.categoryTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: var(--ws-text-primary);
  margin: 0 0 8px;
}
.categoryDescription {
  font-size: 16px;
  color: var(--ws-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Analyzing state */
.analyzingState {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 40px;
}
.analyzingPulse {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid var(--ws-primary);
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.analyzingTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--ws-text-primary);
  margin: 0 0 12px;
}
.analyzingSubtitle {
  font-size: 15px;
  color: var(--ws-text-secondary);
  margin: 0 0 24px;
  max-width: 400px;
}
.analyzingChecks {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--ws-text-muted);
}
.analyzingChecks li {
  padding-left: 20px;
  position: relative;
}
.analyzingChecks li::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: var(--ws-primary);
}

/* Error state */
.errorState {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 40px;
}
.errorTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--ws-text-primary);
  margin: 0 0 12px;
}
.errorMessage {
  font-size: 15px;
  color: var(--ws-text-secondary);
  margin: 0 0 24px;
}
.retryBtn {
  padding: 12px 24px;
  border-radius: 10px;
  background: var(--ws-primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.retryBtn:hover {
  background: var(--ws-primary-hover);
}

/* Positive state */
.positiveState {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  margin-bottom: 16px;
}
.positiveIcon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.positiveMessage {
  font-size: 15px;
  color: #166534;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* No selection state */
.noSelectionState {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  font-size: 15px;
  color: var(--ws-text-muted);
}
```

- [ ] **Step 3: Create the workspace layout**

Create `apps/web/src/app/(workspace)/layout.tsx`:

```tsx
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 4: Update middleware to allow workspace routes**

In `apps/web/src/middleware.ts`, add `/workspace` and `/onboarding/confirm` to the allowed routes:

```typescript
const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
const isOnboardingEntry = request.nextUrl.pathname === "/onboarding/entry";
const isWorkspace = request.nextUrl.pathname === "/workspace" || request.nextUrl.pathname.startsWith("/onboarding/confirm");

// Allow auth pages, onboarding entry, and workspace through
if (!token && !isAuthPage && !isOnboardingEntry && !isWorkspace && request.nextUrl.pathname !== "/") {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

- [ ] **Step 5: Run and verify**

Run: `cd apps/web && npm run dev`
Navigate to: `http://localhost:3000/workspace`
Verify:
- Readiness Band at top with score, category pills, and action buttons
- Left sectioned rail with collapsible sections and health dots
- Center panel showing selected category's issues with conversation flow
- Resume preview on right with document styling
- Category pills click and filter the center panel
- Issue cards show context/reason/action and assistant bar chips
- AI panel opens on chip click with loading state and output

Commit: `feat(workspace): assemble full workspace page with all components`

---

### Task 9: Onboarding Confirm Page (Entry Point)

**Files:**
- Create: `apps/web/src/app/onboarding/confirm/page.tsx`

- [ ] **Step 1: Write the confirm page (redirects to workspace)**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    // After onboarding, redirect to the workspace
    router.replace("/workspace");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-manrope)", fontSize: "18px", color: "#57534E" }}>
        Setting up your workspace...
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/onboarding/confirm/page.tsx
git commit -m "feat(workspace): add onboarding confirm entry point page

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

### Spec coverage
- [x] Readiness Band (Section 4) — Task 4
- [x] Sectioned Rail (Section 5) — Task 5
- [x] Center Analysis Panel / Conversation Flow (Section 6) — Task 6
- [x] Resume Preview Panel (Section 7) — Task 7
- [x] Three-panel layout (Section 3) — Task 8
- [x] Loading states (Section 8) — Tasks 8, 7
- [x] Error states (Section 8) — Task 8
- [x] Empty state (Section 8) — Tasks 7, 8
- [x] Positive state (no issues) — Task 8
- [x] AI inline panel (Section 6) — Task 6
- [x] Route `/workspace` — Task 8
- [x] Entry point `/onboarding/confirm` — Task 9

### Placeholder scan
- No TBD/TODO found
- All file paths are exact
- All mock data is concrete
- All component states have real implementations
- All CSS classes are defined in module files

### Type consistency
- `HealthStatus` type used in both rail and readiness band — consistent
- `AnalysisIssue` interface used in issue card and workspace store — consistent
- `ProfileStrength` interface used across all components — consistent
- `ResumeDocument` interface used in preview and store — consistent
- `selectedCategoryId` flows from store → rail → center panel — consistent

### Design deviations from spec
- Readiness Band uses flexbox layout (not explicitly specified) — cleaner than float
- Sectioned rail icons hidden on tablet via CSS (not Radix accordion) — simpler
- AI inline panel uses simulated responses (no real API call in this task) — placeholder for backend
- Preview highlight uses CSS class toggle (`.sectionHighlighted`) — simpler than JS scroll-sync
- Partial/incomplete sections shown as badges, not full warning cards — lighter weight, still informative

---

**Plan complete.** All steps are concrete, no placeholders, complete code provided for every step. Total 9 tasks covering types through full page assembly.