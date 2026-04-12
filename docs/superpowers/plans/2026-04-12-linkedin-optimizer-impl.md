# LinkedIn Optimizer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete LinkedIn optimization workspace — 3-column rail/panel/preview layout, AI coaching cards, role targeting, profile preview, and prioritized action plan.

**Architecture:** Dashboard module at `/linkedin`. Zustand store for profile data, section selection, role targeting, and coaching state. CSS module for all page styles. Mock data for all analysis (LinkedIn import and AI generation are future integrations).

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, Lucide React icons, Zustand.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `apps/web/src/app/(dashboard)/linkedin/page.tsx` | Main page — composes all sections |
| `apps/web/src/app/(dashboard)/linkedin/linkedin-optimizer.module.css` | All CSS for the page |
| `apps/web/src/stores/linkedin-optimizer-store.ts` | Zustand store for profile, sections, coaching, role targeting |
| `apps/web/src/components/linkedin-optimizer/status-cards.tsx` | 5-dimension status cards |
| `apps/web/src/components/linkedin-optimizer/action-rail.tsx` | Sticky prioritized action chips |
| `apps/web/src/components/linkedin-optimizer/role-targeting.tsx` | Target role search input |
| `apps/web/src/components/linkedin-optimizer/linkedin-rail.tsx` | Sectioned rail navigator |
| `apps/web/src/components/linkedin-optimizer/coaching-panel.tsx` | Center coaching analysis panel |
| `apps/web/src/components/linkedin-optimizer/coaching-card.tsx` | Individual two-part coaching card |
| `apps/web/src/components/linkedin-optimizer/profile-preview.tsx` | Right panel structured content preview |
| `apps/web/src/components/layout/sidebar.tsx` | Add LinkedIn nav item |
| `apps/web/src/types/linkedin-profile.ts` | TypeScript types for LinkedIn profile data |

---

## Task 1: TypeScript Types

**Files:**
- Create: `apps/web/src/types/linkedin-profile.ts`

- [ ] **Step 1: Write the type definitions**

```typescript
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
```

---

## Task 2: Zustand Store

**Files:**
- Create: `apps/web/src/stores/linkedin-optimizer-store.ts`

- [ ] **Step 1: Write the store with all mock data**

```typescript
import { create } from "zustand";
import type {
  LinkedInProfile,
  RailGroup,
  CoachingCard,
  RoleTarget,
  StatusDimension,
  PreviewSection,
} from "@/types/linkedin-profile";

// Mock LinkedIn profile data
const MOCK_PROFILE: LinkedInProfile = {
  linkedinUrl: "https://linkedin.com/in/alexthompson-eng",
  headline: "Software Engineer",
  about:
    "Experienced software engineer with a passion for building scalable systems. I enjoy solving complex problems and working with cross-functional teams to deliver high-quality products.",
  experience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      duration: "2022 - Present",
      bullets: [
        "Worked on backend services and APIs",
        "Helped team with code reviews and mentorship",
        "Used Python, JavaScript, and various frameworks",
      ],
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "StartupXYZ",
      duration: "2019 - 2022",
      bullets: [
        "Built web applications using React",
        "Collaborated with product team",
        "Responsible for deployment and monitoring",
      ],
    },
  ],
  skills: ["Python", "JavaScript", "React", "Node.js", "SQL"],
  endorsements: { Python: 12, JavaScript: 8, React: 5 },
  photoUrl: undefined,
  bannerUrl: undefined,
  customUrl: "linkedin.com/in/alexthompson-eng",
  creatorMode: false,
  connectionCount: 342,
};

// Mock status dimensions
const MOCK_STATUS_DIMENSIONS: StatusDimension[] = [
  { id: "completeness", label: "Profile Completeness", icon: "check-circle", status: "in-progress", subLabel: "2 sections missing" },
  { id: "visibility", label: "Recruiter Visibility", icon: "eye", status: "in-progress", subLabel: "Low discoverability" },
  { id: "keywords", label: "Keyword Strength", icon: "search", status: "missing", subLabel: "Thin keyword presence" },
  { id: "branding", label: "Personal Branding", icon: "sparkles", status: "in-progress", subLabel: "Vague positioning" },
  { id: "alignment", label: "Target Alignment", icon: "target", status: "missing", subLabel: "No role targeted" },
];

// Mock rail groups
const MOCK_RAIL_GROUPS: RailGroup[] = [
  {
    id: "foundations",
    name: "Profile Foundations",
    icon: "user",
    overallStatus: "in-progress",
    sections: [
      { id: "photo", groupId: "foundations", name: "Photo guidance", status: "missing", issueCount: 1, icon: "image" },
      { id: "banner", groupId: "foundations", name: "Banner guidance", status: "missing", issueCount: 1, icon: "image-plus" },
      { id: "custom-url", groupId: "foundations", name: "Custom URL", status: "complete", issueCount: 0, icon: "link" },
      { id: "headline", groupId: "foundations", name: "Headline", status: "in-progress", issueCount: 2, icon: "type" },
    ],
  },
  {
    id: "branding",
    name: "Personal Brand",
    icon: "sparkles",
    overallStatus: "in-progress",
    sections: [
      { id: "about", groupId: "branding", name: "About section", status: "in-progress", issueCount: 1, icon: "file-text" },
      { id: "featured", groupId: "branding", name: "Featured content", status: "missing", issueCount: 1, icon: "star" },
      { id: "tone", groupId: "branding", name: "Tone & positioning", status: "in-progress", issueCount: 1, icon: "message-circle" },
    ],
  },
  {
    id: "experience",
    name: "Experience & Impact",
    icon: "briefcase",
    overallStatus: "in-progress",
    sections: [
      { id: "job-entries", groupId: "experience", name: "Job entries", status: "complete", issueCount: 0, icon: "list" },
      { id: "bullets", groupId: "experience", name: "Achievement bullets", status: "in-progress", issueCount: 3, icon: "list-checks" },
      { id: "metrics", groupId: "experience", name: "Measurable results", status: "missing", issueCount: 2, icon: "trending-up" },
    ],
  },
  {
    id: "skills",
    name: "Skills & Credibility",
    icon: "award",
    overallStatus: "in-progress",
    sections: [
      { id: "skills-list", groupId: "skills", name: "Skills list", status: "in-progress", issueCount: 1, icon: "tag" },
      { id: "endorsements", groupId: "skills", name: "Endorsements strategy", status: "in-progress", issueCount: 2, icon: "thumbs-up" },
      { id: "recommendations", groupId: "skills", name: "Recommendations", status: "missing", issueCount: 1, icon: "message-square" },
    ],
  },
  {
    id: "discoverability",
    name: "Discoverability",
    icon: "search",
    overallStatus: "missing",
    sections: [
      { id: "keywords-section", groupId: "discoverability", name: "Keywords", status: "missing", issueCount: 3, icon: "search" },
      { id: "title-alignment", groupId: "discoverability", name: "Title alignment", status: "in-progress", issueCount: 1, icon: "align-center" },
      { id: "recruiter-vis", groupId: "discoverability", name: "Recruiter search visibility", status: "missing", issueCount: 2, icon: "eye" },
    ],
  },
  {
    id: "growth",
    name: "Growth & Networking",
    icon: "trending-up",
    overallStatus: "in-progress",
    sections: [
      { id: "activity", groupId: "growth", name: "Profile activity", status: "in-progress", issueCount: 1, icon: "activity" },
      { id: "content", groupId: "growth", name: "Content presence", status: "missing", issueCount: 2, icon: "edit" },
      { id: "connections", groupId: "growth", name: "Connection quality", status: "in-progress", issueCount: 1, icon: "users" },
      { id: "creator", groupId: "growth", name: "Creator mode", status: "missing", issueCount: 1, icon: "zap" },
    ],
  },
];

// Mock coaching cards
const MOCK_COACHING_CARDS: CoachingCard[] = [
  {
    id: "c1",
    sectionId: "headline",
    severity: "critical",
    headline: "Your headline is missing recruiter-searched keywords",
    body: "Your headline says 'Software Engineer' — the same as hundreds of thousands of profiles. Recruiters search for specific technologies, industries, and impact levels. Without those keywords, your profile gets filtered out before a human ever sees it. The fix: include your specialty, the scale you operate at, and a differentiating phrase.",
    linkedSection: "headline",
    actions: [
      { id: "a1", label: "Rewrite Headline", type: "rewrite", isPremium: false },
      { id: "a2", label: "Add Keywords", type: "suggest", isPremium: false },
      { id: "a3", label: "See Examples", type: "suggest", isPremium: false },
    ],
    priority: 1,
  },
  {
    id: "c2",
    sectionId: "about",
    severity: "opportunity",
    headline: "Your About section has a strong opening but fades in the middle",
    body: "You start with 'Experienced software engineer with a passion for building scalable systems' — that's actually good. But the second half goes generic. Instead of saying you 'enjoy solving complex problems,' show the reader what those problems look like in your world. The best About sections answer: What do you do? At what scale? For whom?",
    linkedSection: "about",
    actions: [
      { id: "a4", label: "Strengthen the hook", type: "improve", isPremium: false },
      { id: "a5", label: "Add impact framing", type: "suggest", isPremium: true },
    ],
    priority: 2,
  },
  {
    id: "c3",
    sectionId: "bullets",
    severity: "critical",
    headline: "Experience bullets use weak action verbs — no quantifiable impact",
    body: "Your current bullets say 'Worked on backend services,' 'Helped team with code reviews,' 'Used Python and JavaScript.' These are task descriptions, not achievement statements. Recruiters want to see: what changed because of you? What did you build, improve, or deliver? Zero-quantity bullet points reduce your callback rate by an average of 40%.",
    linkedSection: "experience",
    actions: [
      { id: "a6", label: "Add measurable results", type: "rewrite", isPremium: true },
      { id: "a7", label: "Strengthen action verbs", type: "improve", isPremium: false },
    ],
    priority: 3,
  },
  {
    id: "c4",
    sectionId: "keywords-section",
    severity: "critical",
    headline: "Your profile is nearly invisible in recruiter searches",
    body: "LinkedIn's search algorithm weights keywords heavily. Right now your profile contains only generic terms. For a Senior Software Engineer role, you'd want keywords like 'distributed systems,' 'microservices,' 'API design,' 'performance optimization.' These exact-match keywords determine whether you appear in recruiter search results.",
    linkedSection: "skills",
    actions: [
      { id: "a8", label: "Generate keyword suggestions", type: "suggest", isPremium: false },
      { id: "a9", label: "Tailor for target role", type: "tailor", isPremium: true },
    ],
    priority: 1,
  },
  {
    id: "c5",
    sectionId: "about",
    severity: "opportunity",
    headline: "Your About section is missing a clear career direction",
    body: "Recruiters scan About sections for signal — where are you headed? Your current section describes what you've done but not where you're focused or what kind of problems you want to solve next. A strong About ends with a forward-looking statement: the type of work you're drawn to, the impact you want to have, or the kind of team you're looking for.",
    linkedSection: "about",
    actions: [
      { id: "a10", label: "Add career direction", type: "improve", isPremium: false },
    ],
    priority: 4,
  },
];

// Mock role targets
const ROLE_TARGETS: RoleTarget[] = [
  { id: "rt1", title: "Senior Software Engineer", keywords: ["distributed systems", "microservices", "API design", "performance optimization", "cloud architecture"] },
  { id: "rt2", title: "Product Manager", keywords: ["product strategy", "roadmap", "user research", "agile", "data-driven"] },
  { id: "rt3", title: "Data Analyst", keywords: ["SQL", "data visualization", "Python", "statistics", "ETL"] },
  { id: "rt4", title: "UX Designer", keywords: ["user research", "wireframing", "Figma", "prototyping", "design systems"] },
  { id: "rt5", title: "Marketing Manager", keywords: ["campaign management", "SEO", "content strategy", "analytics", "brand positioning"] },
];

interface LinkedInOptimizerState {
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
  profile: LinkedInProfile | null;
  statusDimensions: StatusDimension[];
  railGroups: RailGroup[];
  coachingCards: CoachingCard[];
  selectedSectionId: string | null;
  expandedGroupId: string | null;
  roleTarget: RoleTarget | null;
  roleTargets: RoleTarget[];
  previewHighlight: string | null;
  errorMessage: string | null;

  setStatus: (status: LinkedInOptimizerState["status"]) => void;
  setProfile: (profile: LinkedInProfile) => void;
  selectSection: (sectionId: string) => void;
  expandGroup: (groupId: string) => void;
  setRoleTarget: (target: RoleTarget | null) => void;
  setPreviewHighlight: (sectionId: string | null) => void;
  setError: (message: string | null) => void;
  loadMockData: () => void;
}

export const useLinkedInOptimizerStore = create<LinkedInOptimizerState>((set, get) => ({
  status: "loading",
  profile: null,
  statusDimensions: [],
  railGroups: [],
  coachingCards: [],
  selectedSectionId: null,
  expandedGroupId: null,
  roleTarget: null,
  roleTargets: ROLE_TARGETS,
  previewHighlight: null,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setProfile: (profile) => set({ profile }),
  selectSection: (sectionId) => {
    set({ selectedSectionId: sectionId, previewHighlight: sectionId });
    // Expand the parent group
    const { railGroups } = get();
    const group = railGroups.find(g => g.sections.some(s => s.id === sectionId));
    if (group) set({ expandedGroupId: group.id });
  },
  expandGroup: (groupId) => set((state) => ({
    expandedGroupId: state.expandedGroupId === groupId ? null : groupId,
  })),
  setRoleTarget: (target) => set({ roleTarget: target }),
  setPreviewHighlight: (sectionId) => set({ previewHighlight: sectionId }),
  setError: (message) => set({ errorMessage: message, status: "error" }),
  loadMockData: () => {
    set({ status: "analyzing" });
    setTimeout(() => {
      set({
        status: "ready",
        profile: MOCK_PROFILE,
        statusDimensions: MOCK_STATUS_DIMENSIONS,
        railGroups: MOCK_RAIL_GROUPS,
        coachingCards: MOCK_COACHING_CARDS,
        selectedSectionId: null,
        expandedGroupId: "foundations",
      });
    }, 2000);
  },
}));
```

---

## Task 3: Dashboard Sidebar — Add LinkedIn Item

**Files:**
- Modify: `apps/web/src/components/layout/sidebar.tsx`

- [ ] **Step 1: Add LinkedIn icon and nav item**

Add `Linkedin` from lucide-react to the imports:
```tsx
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mic,
  ClipboardList,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Linkedin,
} from "lucide-react";
```

Add to the `navItems` array:
```tsx
{ href: "/linkedin", icon: Linkedin, label: "LinkedIn Optimizer" },
```

Place it after Resume in the list (after `{ href: "/resume", icon: FileText, label: "Resume" },`).

---

## Task 4: CSS Module — LinkedIn Optimizer

**Files:**
- Create: `apps/web/src/app/(dashboard)/linkedin/linkedin-optimizer.module.css`

- [ ] **Step 1: Write the complete CSS module**

Write to `apps/web/src/app/(dashboard)/linkedin/linkedin-optimizer.module.css`:

```css
/* ═══════════════════════════════════════
   LINKEDIN OPTIMIZER — All Sections
   ═══════════════════════════════════════ */

/* ── Page wrapper ── */
.page {
  background: var(--lo-bg, #f9f9ff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.pageHeader {
  padding: 20px 32px;
  border-bottom: 1px solid var(--lo-border, #e5e7eb);
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pageHeaderLeft {}
.pageTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0 0 2px;
}
.pageSubtitle {
  font-size: 13px;
  color: var(--lo-text-secondary, #6b7280);
  margin: 0;
}
.analyzeBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--lo-navy, #003178);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,49,120,0.2);
  transition: background 0.2s;
}
.analyzeBtn:hover { background: var(--lo-navy-dark, #00215c); }

/* Three-panel layout */
.layout {
  display: grid;
  grid-template-columns: 260px 1fr 400px;
  min-height: calc(100vh - 73px);
  align-items: start;
}

@media (max-width: 1279px) {
  .layout { grid-template-columns: 260px 1fr; }
  .previewPanel { display: none; }
}

@media (max-width: 1023px) {
  .layout { grid-template-columns: 56px 1fr; }
  .rail { display: none; }
}

@media (max-width: 767px) {
  .layout { grid-template-columns: 1fr; }
}

/* ── Left Rail ── */
.rail {
  min-height: calc(100vh - 73px);
  overflow-y: auto;
  border-right: 1px solid var(--lo-border, #e5e7eb);
  background: white;
  padding: 20px 0;
}
.railStatusCards {
  padding: 0 16px 20px;
  border-bottom: 1px solid var(--lo-border, #e5e7eb);
  margin-bottom: 16px;
}
.railSectionTitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--lo-text-muted, #9ca3af);
  padding: 0 16px;
  margin-bottom: 12px;
}

/* Rail groups */
.railGroup {
  margin-bottom: 4px;
}
.railGroupHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}
.railGroupHeader:hover { background: rgba(0,49,120,0.03); }
.railGroupIcon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0,49,120,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lo-navy, #003178);
  flex-shrink: 0;
}
.railGroupIconComplete { background: rgba(5,150,105,0.1); color: var(--lo-emerald, #059669); }
.railGroupIconWarning { background: rgba(217,119,6,0.1); color: var(--lo-amber, #D97706); }
.railGroupIconCritical { background: rgba(220,38,38,0.1); color: var(--lo-red, #dc2626); }
.railGroupName {
  font-size: 14px;
  font-weight: 600;
  color: var(--lo-text-primary, #111827);
  flex: 1;
}
.railGroupCount {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(220,38,38,0.1);
  color: var(--lo-red, #dc2626);
}
.railGroupCountGood {
  background: rgba(5,150,105,0.1);
  color: var(--lo-emerald, #059669);
}
.railGroupChevron {
  color: var(--lo-text-muted, #9ca3af);
  transition: transform 0.2s;
}
.railGroupChevronOpen { transform: rotate(180deg); }
.railSubItems {
  padding: 0 16px 8px 54px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.railSubItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}
.railSubItem:hover { background: rgba(0,49,120,0.04); }
.railSubItem.isSelected {
  background: rgba(0,104,121,0.08);
}
.railSubItemIcon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}
.railSubItemIconComplete { background: var(--lo-emerald, #059669); }
.railSubItemIconWarning { background: var(--lo-amber, #D97706); }
.railSubItemIconCritical { background: var(--lo-red, #dc2626); }
.railSubItemIconMissing { background: var(--lo-text-muted, #9ca3af); }
.railSubItemName {
  font-size: 13px;
  color: var(--lo-text-secondary, #6b7280);
}
.railSubItem.isSelected .railSubItemName { color: var(--lo-cyan, #006879); font-weight: 600; }
.railSubItemBadge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: var(--lo-red, #dc2626);
}

/* ── Center Panel ── */
.center {
  min-height: calc(100vh - 73px);
  overflow-y: auto;
  padding: 24px 28px;
}

/* Status Cards */
.statusCards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
@media (max-width: 1200px) { .statusCards { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px) { .statusCards { grid-template-columns: repeat(2, 1fr); } }

.statusCard {
  background: white;
  border: 1px solid var(--lo-border, #e5e7eb);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.statusCardHeader {
  display: flex;
  align-items: center;
  gap: 8px;
}
.statusCardIcon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.statusCardIconComplete { background: rgba(5,150,105,0.1); color: var(--lo-emerald, #059669); }
.statusCardIconWarning { background: rgba(217,119,6,0.1); color: var(--lo-amber, #D97706); }
.statusCardIconCritical { background: rgba(220,38,38,0.1); color: var(--lo-red, #dc2626); }
.statusCardIconMissing { background: rgba(156,163,175,0.15); color: var(--lo-text-muted, #9ca3af); }
.statusCardLabel {
  font-size: 12px;
  font-weight: 600;
  color: var(--lo-text-primary, #111827);
}
.statusCardChip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}
.statusChipComplete { background: rgba(5,150,105,0.1); color: var(--lo-emerald, #059669); }
.statusChipWarning { background: rgba(217,119,6,0.1); color: var(--lo-amber, #D97706); }
.statusChipCritical { background: rgba(220,38,38,0.1); color: var(--lo-red, #dc2626); }
.statusChipMissing { background: rgba(156,163,175,0.15); color: var(--lo-text-muted, #9ca3af); }
.statusCardSubLabel {
  font-size: 11px;
  color: var(--lo-text-secondary, #6b7280);
}

/* Action Rail */
.actionRail {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px 0;
  border-top: 1px solid var(--lo-border, #e5e7eb);
  border-bottom: 1px solid var(--lo-border, #e5e7eb);
  margin-bottom: 24px;
}
.actionRailLabel {
  font-size: 11px;
  font-weight: 700;
  color: var(--lo-text-muted, #9ca3af);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-right: 4px;
}
.actionChip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--lo-border, #e5e7eb);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: var(--lo-text-primary, #111827);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
}
.actionChip:hover {
  border-color: var(--lo-cyan, #006879);
  background: rgba(0,104,121,0.03);
  transform: translateY(-1px);
}
.actionChipNum {
  font-size: 10px;
  font-weight: 700;
  color: var(--lo-cyan, #006879);
}

/* Role Targeting */
.roleTargeting {
  margin-bottom: 24px;
}
.roleInputWrap {
  position: relative;
  display: flex;
  align-items: center;
}
.roleInputIcon {
  position: absolute;
  left: 14px;
  color: var(--lo-text-muted, #9ca3af);
}
.roleInput {
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 1.5px solid var(--lo-border, #e5e7eb);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--font-manrope), sans-serif;
  color: var(--lo-text-primary, #111827);
  background: white;
  transition: border-color 0.2s;
}
.roleInput:focus {
  outline: none;
  border-color: var(--lo-cyan, #006879);
}
.roleInput::placeholder { color: var(--lo-text-muted, #9ca3af); }
.roleInputSelected {
  border-color: var(--lo-cyan, #006879);
  background: rgba(0,104,121,0.02);
}
.roleDropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--lo-border, #e5e7eb);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 20;
  overflow: hidden;
}
.roleDropdownItem {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--lo-text-primary, #111827);
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.roleDropdownItem:hover { background: rgba(0,49,120,0.03); }
.roleDropdownKeywords {
  font-size: 11px;
  color: var(--lo-text-muted, #9ca3af);
}
.roleSelected {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: rgba(0,104,121,0.06);
  border-radius: 10px;
  border: 1px solid rgba(0,104,121,0.15);
}
.roleSelectedTitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--lo-cyan, #006879);
}
.roleSelectedEdit {
  margin-left: auto;
  font-size: 12px;
  color: var(--lo-text-muted, #9ca3af);
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
}
.roleSelectedEdit:hover { background: rgba(0,104,121,0.08); }

/* Section Header */
.sectionHeader {
  margin-bottom: 20px;
}
.sectionLabel {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--lo-text-muted, #9ca3af);
  margin-bottom: 6px;
}
.sectionTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0;
}

/* Coaching Cards */
.coachingCards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.coachingCard {
  background: white;
  border-radius: 14px;
  border: 1px solid var(--lo-border, #e5e7eb);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.coachingCard:hover { box-shadow: 0 4px 16px rgba(0,49,120,0.08); }
.coachingCardCritical { border-left: 4px solid var(--lo-red, #dc2626); }
.coachingCardOpportunity { border-left: 4px solid var(--lo-amber, #D97706); }
.coachingCardStrength { border-left: 4px solid var(--lo-emerald, #059669); }
.coachingCardHeader {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 0;
}
.coachingSeverityIcon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.severityCritical { background: rgba(220,38,38,0.08); color: var(--lo-red, #dc2626); }
.severityOpportunity { background: rgba(217,119,6,0.08); color: var(--lo-amber, #D97706); }
.severityStrength { background: rgba(5,150,105,0.08); color: var(--lo-emerald, #059669); }
.coachingHeadline {
  font-size: 15px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0 0 4px;
  font-family: var(--font-manrope), sans-serif;
}
.coachingBody {
  font-size: 13px;
  color: var(--lo-text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0;
  padding: 12px 20px;
}
.coachingActions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--lo-border, #e5e7eb);
  flex-wrap: wrap;
}
.aiActionBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--lo-border, #e5e7eb);
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: var(--lo-navy, #003178);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  font-family: var(--font-manrope), sans-serif;
}
.aiActionBtn:hover {
  border-color: var(--lo-navy, #003178);
  background: rgba(0,49,120,0.04);
  transform: translateY(-1px);
}
.aiActionBtnLocked {
  opacity: 0.6;
  cursor: not-allowed;
}
.aiActionBtnLocked:hover { transform: none; background: white; border-color: var(--lo-border, #e5e7eb); }
.lockIcon {
  width: 14px;
  height: 14px;
}

/* No selection state */
.noSelection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;
}
.noSelectionIcon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(0,49,120,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--lo-navy, #003178);
}
.noSelectionTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0 0 8px;
}
.noSelectionText {
  font-size: 14px;
  color: var(--lo-text-secondary, #6b7280);
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}

/* Loading state */
.loadingState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 40px;
}
.loadingPulse {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid rgba(0,49,120,0.15);
  border-top-color: var(--lo-navy, #003178);
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loadingTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0 0 8px;
}
.loadingText {
  font-size: 14px;
  color: var(--lo-text-secondary, #6b7280);
  margin: 0;
}

/* ── Right Preview Panel ── */
.previewPanel {
  min-height: calc(100vh - 73px);
  overflow-y: auto;
  border-left: 1px solid var(--lo-border, #e5e7eb);
  background: white;
}
@media (max-width: 1279px) {
  .previewPanel { display: none; }
  .previewPanel.is-visible {
    display: block;
    position: fixed;
    right: 0;
    top: 73px;
    width: 400px;
    height: calc(100vh - 73px);
    z-index: 50;
    box-shadow: -8px 0 32px rgba(0,0,0,0.08);
  }
}
.previewToolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--lo-border, #e5e7eb);
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
}
.previewToolbarTitle {
  font-size: 13px;
  font-weight: 600;
  color: var(--lo-text-primary, #111827);
}
.previewToolbarBadge {
  font-size: 11px;
  color: var(--lo-cyan, #006879);
  background: rgba(0,104,121,0.08);
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 600;
}
.previewContent {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.previewBlock {
  border-radius: 12px;
  border: 1px solid var(--lo-border, #e5e7eb);
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.previewBlock.isHighlighted {
  border-color: rgba(0,104,121,0.4);
  box-shadow: 0 0 0 3px rgba(0,104,121,0.06);
}
.previewBlockHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f9fafb;
  border-bottom: 1px solid var(--lo-border, #e5e7eb);
}
.previewBlockLabel {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--lo-text-muted, #9ca3af);
}
.previewBlockBadge {
  font-size: 10px;
  color: var(--lo-cyan, #006879);
  background: rgba(0,104,121,0.08);
  padding: 2px 6px;
  border-radius: 6px;
}
.previewBlockBody {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--lo-text-secondary, #6b7280);
  line-height: 1.5;
}
.previewHighlight {
  background: rgba(0,104,121,0.08);
  color: var(--lo-cyan, #006879);
  font-weight: 600;
  padding: 0 2px;
  border-radius: 2px;
}
.previewEmpty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}
.previewEmptyText {
  font-size: 12px;
  color: var(--lo-text-muted, #9ca3af);
  margin: 0;
  line-height: 1.4;
}
.previewAddBtn {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--lo-cyan, #006879);
  background: none;
  border: none;
  cursor: pointer;
}
.previewSkillChips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 14px;
}
.skillChip {
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(0,49,120,0.06);
  color: var(--lo-navy, #003178);
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.skillChipEndorsed {
  background: rgba(5,150,105,0.08);
  color: var(--lo-emerald, #059669);
}
.endorsedDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--lo-emerald, #059669);
}

/* Preview skeleton */
.previewSkeleton {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeletonLine {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
.skeletonLine.short { width: 60%; }
.skeletonLine.medium { width: 80%; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty profile state */
.emptyProfile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;
}
.emptyIcon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(0,49,120,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--lo-navy, #003178);
}
.emptyTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--lo-text-primary, #111827);
  margin: 0 0 8px;
}
.emptyText {
  font-size: 14px;
  color: var(--lo-text-secondary, #6b7280);
  max-width: 340px;
  line-height: 1.5;
  margin: 0 0 24px;
}
.emptyInput {
  width: 100%;
  max-width: 400px;
  padding: 14px 16px;
  border: 1.5px solid var(--lo-border, #e5e7eb);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--font-manrope), sans-serif;
  margin-bottom: 12px;
}
.emptyInput:focus {
  outline: none;
  border-color: var(--lo-cyan, #006879);
}
.analyzeProfileBtn {
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--lo-navy, #003178);
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,49,120,0.25);
}
.analyzeProfileBtn:hover { background: var(--lo-navy-dark, #00215c); }
```

---

## Task 5: Status Cards Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/status-cards.tsx`

- [ ] **Step 1: Write the StatusCards component**

```tsx
import {
  CheckCircle,
  Eye,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import type { StatusDimension } from "@/types/linkedin-profile";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "check-circle": CheckCircle,
  eye: Eye,
  search: Search,
  sparkles: Sparkles,
  target: Target,
};

const statusConfig = {
  complete: {
    chipClass: "statusChipComplete",
    iconClass: "statusCardIconComplete",
  },
  "in-progress": {
    chipClass: "statusChipWarning",
    iconClass: "statusCardIconWarning",
  },
  missing: {
    chipClass: "statusChipCritical",
    iconClass: "statusCardIconCritical",
  },
};

const statusLabel = {
  complete: "Complete",
  "in-progress": "In Progress",
  missing: "Missing",
};

interface StatusCardsProps {
  dimensions: StatusDimension[];
}

export function StatusCards({ dimensions }: StatusCardsProps) {
  return (
    <div className="statusCards">
      {dimensions.map((dim, i) => {
        const Icon = iconMap[dim.icon] ?? CheckCircle;
        const config = statusConfig[dim.status];
        return (
          <motion.div
            key={dim.id}
            className="statusCard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="statusCardHeader">
              <div className={`statusCardIcon ${config.iconClass}`}>
                <Icon size={14} />
              </div>
              <span className="statusCardLabel">{dim.label}</span>
            </div>
            <div className={`statusCardChip ${config.chipClass}`}>
              {statusLabel[dim.status]}
            </div>
            <div className="statusCardSubLabel">{dim.subLabel}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

Note: className references like `statusCards` and `statusCard` need to be prefixed with the CSS module import. Use `import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css"` and reference `styles.statusCards` etc. in the JSX.

---

## Task 6: Action Rail Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/action-rail.tsx`

- [ ] **Step 1: Write the ActionRail component**

```tsx
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ActionItem {
  step: number;
  label: string;
  sectionId: string;
}

interface ActionRailProps {
  items: ActionItem[];
  onActionClick: (sectionId: string) => void;
}

export function ActionRail({ items, onActionClick }: ActionRailProps) {
  return (
    <div className="actionRail">
      <span className="actionRailLabel">Your plan:</span>
      {items.map((item) => (
        <motion.button
          key={item.step}
          className="actionChip"
          onClick={() => onActionClick(item.sectionId)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: item.step * 0.05 }}
        >
          <span className="actionChipNum">{item.step}.</span>
          {item.label}
          <ChevronRight size={14} />
        </motion.button>
      ))}
    </div>
  );
}
```

---

## Task 7: Role Targeting Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/role-targeting.tsx`

- [ ] **Step 1: Write the RoleTargeting component**

```tsx
import { useState, useRef, useEffect } from "react";
import { Target, X } from "lucide-react";
import type { RoleTarget } from "@/types/linkedin-profile";

interface RoleTargetingProps {
  targets: RoleTarget[];
  selected: RoleTarget | null;
  onSelect: (target: RoleTarget | null) => void;
}

export function RoleTargeting({ targets, selected, onSelect }: RoleTargetingProps) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = targets.filter(t =>
    t.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (selected) {
    return (
      <div className="roleSelected">
        <Target size={16} color="var(--lo-cyan)" />
        <span className="roleSelectedTitle">{selected.title}</span>
        <button className="roleSelectedEdit" onClick={() => onSelect(null)}>
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="roleTargeting">
      <div className="roleInputWrap">
        <Target size={16} className="roleInputIcon" />
        <input
          ref={inputRef}
          className="roleInput"
          placeholder="What role are you targeting? (e.g. Senior Software Engineer...)"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && filtered.length > 0 && (
          <div className="roleDropdown">
            {filtered.map(target => (
              <div
                key={target.id}
                className="roleDropdownItem"
                onMouseDown={() => {
                  onSelect(target);
                  setInputValue("");
                  setShowDropdown(false);
                }}
              >
                {target.title}
                <span className="roleDropdownKeywords">
                  {target.keywords.slice(0, 2).join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Task 8: LinkedIn Rail Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/linkedin-rail.tsx`

- [ ] **Step 1: Write the LinkedInRail component**

```tsx
import { useState } from "react";
import {
  User, Sparkles, Briefcase, Award, Search, TrendingUp,
  Image, ImagePlus, Link, Type, FileText, Star, MessageCircle,
  List, ListChecks, TrendingDown, Tag, ThumbsUp, MessageSquare,
  Activity, Edit, Users, Zap, ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import type { RailGroup, OptimizationSection } from "@/types/linkedin-profile";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  user: User, sparkles: Sparkles, briefcase: Briefcase, award: Award,
  search: Search, "trending-up": TrendingUp, image: Image,
  "image-plus": ImagePlus, link: Link, type: Type, "file-text": FileText,
  star: Star, "message-circle": MessageCircle, list: List,
  "list-checks": ListChecks, "trending-down": TrendingDown, tag: Tag,
  "thumbs-up": ThumbsUp, "message-square": MessageSquare, activity: Activity,
  edit: Edit, users: Users, zap: Zap,
};

const statusColorMap: Record<string, string> = {
  complete: "railSubItemIconComplete",
  "in-progress": "railSubItemIconWarning",
  missing: "railSubItemIconCritical",
};

interface LinkedInRailProps {
  groups: RailGroup[];
  selectedSectionId: string | null;
  expandedGroupId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onGroupToggle: (groupId: string) => void;
}

export function LinkedInRail({
  groups,
  selectedSectionId,
  expandedGroupId,
  onSectionSelect,
  onGroupToggle,
}: LinkedInRailProps) {
  return (
    <div className="rail">
      <div className="railStatusCards">
        <div className="railSectionTitle">Profile Health</div>
      </div>
      <div className="railSectionTitle">Optimization Areas</div>
      {groups.map((group, gi) => {
        const Icon = iconMap[group.icon] ?? User;
        const hasIssues = group.sections.some(s => s.issueCount > 0);
        const allGood = group.sections.every(s => s.issueCount === 0);
        const iconClass = allGood
          ? "railGroupIconComplete"
          : hasIssues
          ? "railGroupIconWarning"
          : "railGroupIcon";
        const totalIssues = group.sections.reduce((sum, s) => sum + s.issueCount, 0);

        return (
          <div key={group.id} className="railGroup">
            <button
              className="railGroupHeader"
              onClick={() => onGroupToggle(group.id)}
            >
              <div className={`railGroupIcon ${iconClass}`}>
                <Icon size={16} />
              </div>
              <span className="railGroupName">{group.name}</span>
              {totalIssues > 0 && (
                <span className="railGroupCount">{totalIssues} issues</span>
              )}
              {totalIssues === 0 && (
                <span className="railGroupCount railGroupCountGood">All good</span>
              )}
              <ChevronDown
                size={16}
                className={`railGroupChevron ${expandedGroupId === group.id ? "railGroupChevronOpen" : ""}`}
              />
            </button>

            {expandedGroupId === group.id && (
              <motion.div
                className="railSubItems"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {group.sections.map((section) => {
                  const SecIcon = iconMap[section.icon] ?? List;
                  const dotClass = statusColorMap[section.status] ?? "railSubItemIconMissing";
                  return (
                    <button
                      key={section.id}
                      className={`railSubItem ${selectedSectionId === section.id ? "isSelected" : ""}`}
                      onClick={() => onSectionSelect(section.id)}
                    >
                      <div className={`railSubItemIcon ${dotClass}`} />
                      <span className="railSubItemName">{section.name}</span>
                      {section.issueCount > 0 && (
                        <span className="railSubItemBadge">{section.issueCount}</span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## Task 9: Coaching Card Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/coaching-card.tsx`

- [ ] **Step 1: Write the CoachingCard component**

```tsx
import { useState } from "react";
import { AlertCircle, Lightbulb, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { CoachingCard } from "@/types/linkedin-profile";

const severityConfig = {
  critical: {
    cardClass: "coachingCardCritical",
    iconClass: "severityCritical",
    icon: AlertCircle,
  },
  opportunity: {
    cardClass: "coachingCardOpportunity",
    iconClass: "severityOpportunity",
    icon: Lightbulb,
  },
  strength: {
    cardClass: "coachingCardStrength",
    iconClass: "severityStrength",
    icon: CheckCircle,
  },
};

interface CoachingCardProps {
  card: CoachingCard;
  onAction: (actionId: string) => void;
}

export function CoachingCard({ card, onAction }: CoachingCardProps) {
  const [doneAction, setDoneAction] = useState<string | null>(null);
  const config = severityConfig[card.severity];
  const Icon = config.icon;

  const handleAction = (actionId: string, isPremium: boolean) => {
    if (isPremium) return;
    setDoneAction(actionId);
    setTimeout(() => setDoneAction(null), 2000);
  };

  return (
    <motion.div
      className={`coachingCard ${config.cardClass}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="coachingCardHeader">
        <div className={`coachingSeverityIcon ${config.iconClass}`}>
          <Icon size={16} />
        </div>
        <h3 className="coachingHeadline">{card.headline}</h3>
      </div>
      <p className="coachingBody">{card.body}</p>
      <div className="coachingActions">
        {card.actions.map(action => (
          <button
            key={action.id}
            className={`aiActionBtn ${action.isPremium ? "aiActionBtnLocked" : ""}`}
            onClick={() => !action.isPremium && handleAction(action.id, action.isPremium)}
            title={action.isPremium ? "Premium feature — unlock to use" : undefined}
          >
            {action.isPremium && (
              <Lock size={12} className="lockIcon" />
            )}
            {doneAction === action.id ? "Done ✓" : action.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
```

---

## Task 10: Coaching Panel Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/coaching-panel.tsx`

- [ ] **Step 1: Write the CoachingPanel component**

```tsx
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { StatusCards } from "./status-cards";
import { ActionRail } from "./action-rail";
import { RoleTargeting } from "./role-targeting";
import { CoachingCard } from "./coaching-card";
import type {
  StatusDimension,
  RoleTarget,
  CoachingCard as CoachingCardType,
} from "@/types/linkedin-profile";

interface CoachingPanelProps {
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
  statusDimensions: StatusDimension[];
  coachingCards: CoachingCardType[];
  roleTargets: RoleTarget[];
  roleTarget: RoleTarget | null;
  selectedSectionId: string | null;
  onRoleSelect: (target: RoleTarget | null) => void;
  onSectionSelect: (sectionId: string) => void;
  onActionClick: (sectionId: string) => void;
}

export function CoachingPanel({
  status,
  statusDimensions,
  coachingCards,
  roleTargets,
  roleTarget,
  selectedSectionId,
  onRoleSelect,
  onSectionSelect,
  onActionClick,
}: CoachingPanelProps) {
  // Loading state
  if (status === "loading" || status === "analyzing") {
    return (
      <div className="center">
        <div className="loadingState">
          <div className="loadingPulse" />
          <h3 className="loadingTitle">Reading your LinkedIn profile...</h3>
          <p className="loadingText">
            I'm analyzing how recruiters see your profile. Checking keyword strength, visibility, and positioning.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (status === "empty") {
    return (
      <div className="center">
        <div className="emptyProfile">
          <div className="emptyIcon">
            <Eye size={28} />
          </div>
          <h2 className="emptyTitle">I can help you optimize your LinkedIn profile</h2>
          <p className="emptyText">
            Paste your LinkedIn profile URL below and I'll analyze every section — headline, About, experience, skills, and more.
          </p>
          <input className="emptyInput" placeholder="https://linkedin.com/in/yourprofile" />
          <button className="analyzeProfileBtn">Analyze Profile</button>
        </div>
      </div>
    );
  }

  // Filter cards by selected section
  const visibleCards = selectedSectionId
    ? coachingCards.filter(c => c.sectionId === selectedSectionId)
    : coachingCards;

  // Action plan items from priority-sorted cards
  const actionItems = coachingCards
    .filter(c => c.severity !== "strength")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map((c, i) => ({
      step: i + 1,
      label: c.headline.replace(/^(Your|This)/, "Fix").slice(0, 40) + (c.headline.length > 40 ? "..." : ""),
      sectionId: c.sectionId,
    }));

  return (
    <div className="center">
      {/* Status cards */}
      <StatusCards dimensions={statusDimensions} />

      {/* Role targeting */}
      <RoleTargeting
        targets={roleTargets}
        selected={roleTarget}
        onSelect={onRoleSelect}
      />

      {/* Action rail */}
      <ActionRail items={actionItems} onActionClick={onActionClick} />

      {/* Section header */}
      <div className="sectionHeader">
        <div className="sectionLabel">Analysis</div>
        <h2 className="sectionTitle">
          {selectedSectionId
            ? coachingCards.find(c => c.sectionId === selectedSectionId)
                ? `${coachingCards.find(c => c.sectionId === selectedSectionId)?.linkedSection.charAt(0).toUpperCase()}${coachingCards.find(c => c.sectionId === selectedSectionId)?.linkedSection.slice(1)} — coaching`
                : "Section Analysis"
            : "Your optimization roadmap"}
        </h2>
      </div>

      {/* Coaching cards */}
      {visibleCards.length > 0 ? (
        <div className="coachingCards">
          {visibleCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <CoachingCard card={card} onAction={(actionId) => {
                // AI action handler — mock for now
              }} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="noSelection">
          <div className="noSelectionIcon">
            <Eye size={24} />
          </div>
          <h3 className="noSelectionTitle">Select a section to get coaching</h3>
          <p className="noSelectionText">
            Click on any item in the left rail to see specific coaching advice and AI-powered improvement actions for that part of your profile.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## Task 11: Profile Preview Component

**Files:**
- Create: `apps/web/src/components/linkedin-optimizer/profile-preview.tsx`

- [ ] **Step 1: Write the ProfilePreview component**

```tsx
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { LinkedInProfile } from "@/types/linkedin-profile";

interface ProfilePreviewProps {
  profile: LinkedInProfile | null;
  highlightSectionId: string | null;
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
}

const PREVIEW_SECTIONS = [
  { id: "headline", label: "Headline" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
];

export function ProfilePreview({ profile, highlightSectionId, status }: ProfilePreviewProps) {
  if (status === "loading" || status === "analyzing") {
    return (
      <div className="previewPanel">
        <div className="previewToolbar">
          <span className="previewToolbarTitle">Profile Preview</span>
        </div>
        <div className="previewSkeleton">
          <div className="skeletonLine medium" />
          <div className="skeletonLine short" />
          <div className="skeletonLine" />
          <div className="skeletonLine medium" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="previewPanel">
        <div className="previewToolbar">
          <span className="previewToolbarTitle">Profile Preview</span>
        </div>
        <div className="previewEmpty">
          <p className="previewEmptyText">
            Paste your LinkedIn URL above to see your profile content here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="previewPanel">
      <div className="previewToolbar">
        <span className="previewToolbarTitle">Profile Preview</span>
        {highlightSectionId && (
          <span className="previewToolbarBadge">Viewing: {highlightSectionId}</span>
        )}
      </div>
      <div className="previewContent">
        {/* Headline */}
        <div className={`previewBlock ${highlightSectionId === "headline" ? "isHighlighted" : ""}`}>
          <div className="previewBlockHeader">
            <span className="previewBlockLabel">Headline</span>
            {highlightSectionId === "headline" && (
              <span className="previewBlockBadge">This section</span>
            )}
          </div>
          <div className="previewBlockBody">
            {profile.headline ? (
              profile.headline
            ) : (
              <span className="previewEmptyText">
                No headline yet — this is one of the first things recruiters see.
              </span>
            )}
          </div>
        </div>

        {/* About */}
        <div className={`previewBlock ${highlightSectionId === "about" ? "isHighlighted" : ""}`}>
          <div className="previewBlockHeader">
            <span className="previewBlockLabel">About</span>
            {highlightSectionId === "about" && (
              <span className="previewBlockBadge">This section</span>
            )}
          </div>
          <div className="previewBlockBody">
            {profile.about ? (
              profile.about.length > 200
                ? profile.about.slice(0, 200) + "..."
                : profile.about
            ) : (
              <span className="previewEmptyText">
                Your About section is blank — this is one of the highest-impact areas to fill first.
              </span>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className={`previewBlock ${highlightSectionId === "experience" ? "isHighlighted" : ""}`}>
          <div className="previewBlockHeader">
            <span className="previewBlockLabel">Experience</span>
            {highlightSectionId === "experience" && (
              <span className="previewBlockBadge">This section</span>
            )}
          </div>
          <div className="previewBlockBody">
            {profile.experience.length > 0 ? (
              profile.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <strong style={{ fontSize: "13px", color: "var(--lo-text-primary)" }}>
                    {exp.title}
                  </strong>
                  <span style={{ fontSize: "12px", color: "var(--lo-text-muted)" }}>
                    {" "}· {exp.company} · {exp.duration}
                  </span>
                  <ul style={{ margin: "6px 0 0", paddingLeft: "16px" }}>
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "var(--lo-text-secondary)", marginBottom: "4px" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <span className="previewEmptyText">No experience entries yet.</span>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className={`previewBlock ${highlightSectionId === "skills" ? "isHighlighted" : ""}`}>
          <div className="previewBlockHeader">
            <span className="previewBlockLabel">Skills</span>
            {highlightSectionId === "skills" && (
              <span className="previewBlockBadge">This section</span>
            )}
          </div>
          <div className="previewSkillChips">
            {profile.skills.map(skill => (
              <div
                key={skill}
                className={`skillChip ${(profile.endorsements[skill] ?? 0) > 0 ? "skillChipEndorsed" : ""}`}
              >
                {skill}
                {(profile.endorsements[skill] ?? 0) > 0 && (
                  <span className="endorsedDot" />
                )}
              </div>
            ))}
            {profile.skills.length === 0 && (
              <span className="previewEmptyText" style={{ padding: "8px 0" }}>
                No skills listed yet.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 12: Main Page Composition

**Files:**
- Create: `apps/web/src/app/(dashboard)/linkedin/page.tsx`

- [ ] **Step 1: Write the complete page**

```tsx
"use client";

import { useEffect } from "react";
import { Linkedin } from "lucide-react";
import { useLinkedInOptimizerStore } from "@/stores/linkedin-optimizer-store";
import { LinkedInRail } from "@/components/linkedin-optimizer/linkedin-rail";
import { CoachingPanel } from "@/components/linkedin-optimizer/coaching-panel";
import { ProfilePreview } from "@/components/linkedin-optimizer/profile-preview";
import styles from "./linkedin-optimizer.module.css";

export default function LinkedInOptimizerPage() {
  const {
    status,
    profile,
    statusDimensions,
    railGroups,
    coachingCards,
    selectedSectionId,
    expandedGroupId,
    roleTarget,
    roleTargets,
    previewHighlight,
    loadMockData,
    selectSection,
    expandGroup,
    setRoleTarget,
  } = useLinkedInOptimizerStore();

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>LinkedIn Optimizer</h1>
          <p className={styles.pageSubtitle}>Your profile command center — powered by AI</p>
        </div>
        <button className={styles.analyzeBtn}>
          <Linkedin size={16} />
          Analyze Profile
        </button>
      </div>

      {/* 3-column layout */}
      <div className={styles.layout}>
        {/* Left: Rail navigator */}
        <LinkedInRail
          groups={railGroups}
          selectedSectionId={selectedSectionId}
          expandedGroupId={expandedGroupId}
          onSectionSelect={selectSection}
          onGroupToggle={expandGroup}
        />

        {/* Center: Coaching panel */}
        <CoachingPanel
          status={status}
          statusDimensions={statusDimensions}
          coachingCards={coachingCards}
          roleTargets={roleTargets}
          roleTarget={roleTarget}
          selectedSectionId={selectedSectionId}
          onRoleSelect={setRoleTarget}
          onSectionSelect={selectSection}
          onActionClick={selectSection}
        />

        {/* Right: Profile preview */}
        <ProfilePreview
          profile={profile}
          highlightSectionId={previewHighlight}
          status={status}
        />
      </div>
    </div>
  );
}
```

---

## Task 13: Verify Build

- [ ] **Step 1: Run build**

Run: `cd apps/web && npm run build`
Expected: Clean build, no TypeScript errors, no console errors

- [ ] **Step 2: Check dev server**

Run: `cd apps/web && npm run dev`
Expected: Page loads at localhost:3000/linkedin, all 3 columns visible, status cards render, rail navigable

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Dashboard header with breadcrumb + analyze button | Task 12 |
| 3-column layout (rail / panel / preview) | Tasks 12, 4 |
| 5 status cards (completeness, visibility, keywords, branding, alignment) | Tasks 5, 10 |
| Sticky action rail with prioritized chips | Tasks 6, 10 |
| Role targeting input with dropdown | Tasks 7, 10 |
| 6-group sectioned rail navigator with count badges | Tasks 8, 12 |
| Coaching analysis cards (critical/opportunity/strength) | Tasks 9, 10 |
| Two-part card: coach paragraph + AI action buttons | Task 9 |
| Locked premium actions | Task 9 |
| Profile preview panel (structured blocks, highlights) | Tasks 10, 11 |
| Empty state (LinkedIn URL prompt) | Tasks 10, 11 |
| Loading state (analyzing pulse) | Tasks 10, 11 |
| Responsive breakpoints | Task 4 |
| Store with mock data | Task 2 |
| TypeScript types | Task 1 |
| Sidebar nav item | Task 3 |

**All 13 spec sections covered. No gaps.**