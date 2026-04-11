# Resume Analysis Workspace — Design Spec

**Date:** 2026-04-12
**Type:** Feature Design Spec
**Stage:** Post-login, post-onboarding. User has uploaded a resume or connected LinkedIn.

---

## 1. Overview

A smart career copilot workspace that helps users review, understand, and improve their resume through AI-driven diagnostics, contextual guidance, and interactive preview. This is not a narrow scoring tool — it's a comprehensive improvement environment that connects resume review to broader career support tools.

**Goals:**
- Show users a live, AI-driven workspace where they can review their resume, see health status, identify issues by category, and apply improvements in a guided way
- Feel more modern, spacious, and thoughtful than existing resume analyzers
- Avoid copying the sidebar-heavy, cramped score-first layout of reference products
- Leave room for connected career tools (AI rewrite, keyword optimization, role targeting, roadmap suggestions)

---

## 2. Visual Identity

### Layout
- Full-page dedicated workspace, no dashboard navigation chrome
- Background: warm off-white `#FAFAF5` (consistent with onboarding identity)
- Three panels: slim left rail (category navigation) + dominant center panel (analysis) + collapsible right preview
- Top of page: Readiness Band (horizontal progress strip)
- Assistant-style layout — preview slides in from right, keeping focus on analysis content

### Color Palette
- Background: `#FAFAF5` (warm off-white)
- Surface (cards, panels): `#FFFFFF`
- Primary accent: `#D97706` (amber/gold)
- Accent hover: `#B45309`
- Health — Healthy: `#22c55e` (green)
- Health — Needs Work: `#f59e0b` (amber)
- Health — Critical: `#ef4444` (red)
- Health — Incomplete: `#a8a29e` (muted gray)
- Text primary: `#1c1917`
- Text secondary: `#57534e`
- Text muted: `#a8a29e`
- Border: `#e7e5e4`

### Typography
- Display heading (page title): 24px, bold, Manrope
- Section headers: 18px, semibold, Manrope
- Card titles: 16px, semibold, Manrope
- Body text: 15px, regular, Inter
- Labels/badges: 13px, medium, Inter
- Minimum body size: 15px (no tiny text)

### Spacing
- Card padding: 24px
- Section gap: 20px
- Inner element gap: 12px
- Panel gap: 16px

### Responsive Strategy
- Desktop (≥1024px): Full three-panel layout
- Tablet (768-1023px): Left rail collapses to icon-only, preview as overlay
- Mobile (<768px): Left rail as slide-in drawer, preview as bottom sheet or overlay, center panel full width

---

## 3. Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  READINESS BAND (full width, ~80px tall)                         │
│  [Strength: 68] [Category pills...] [Preview toggle] [AI Help]  │
├─────────────┬─────────────────────────────────────┬──────────────┤
│             │                                     │              │
│  SECTIONED  │  CENTER PANEL                        │  RESUME      │
│  RAIL       │  (Conversation Flow per issue)       │  PREVIEW     │
│  (240px)    │  (~60% width)                        │  (~30%)      │
│             │                                     │  collapsible │
│  [Resume    │  [Issue Header]                     │              │
│   Quality]  │  [Context]                          │  [Document   │
│  [Content]  │  [Reason]                           │   preview]   │
│  [ATS       │  [Action]                           │              │
│   Health]   │  [Assistant Bar: action chips]      │  [Toolbar]   │
│             │                                     │              │
└─────────────┴─────────────────────────────────────┴──────────────┘
```

---

## 4. Component: Readiness Band

**Position:** Fixed at top of page, full width, ~80px tall
**Background:** White surface with bottom border
**Contains:**

**Left — Profile Strength:**
- Label: "Profile Strength" (13px, muted)
- Score: "68/100" (24px, bold, amber if improving, green if strong)
- Progress bar: thin horizontal bar showing score visually (not a circle)

**Center — Category Pills:**
- Horizontally scrollable strip of rounded pills
- Each pill: category name + health dot (colored circle) + issue count badge (if > 0)
- Pill states: default (muted border), active (amber border + slightly elevated), complete (green dot, no badge)
- Click behavior: scrolls to that category in the left rail, filters center panel
- Scroll-sync: as user scrolls through analysis, the corresponding pill becomes active

**Right — Actions:**
- "Preview" toggle button — shows/hides the resume preview panel
- "Get AI Help" primary button — opens AI assistant panel or context menu

**States:**
- Loading: all pills show animated shimmer
- Partial analysis: some pills show "Analyzing..." with a pulse
- Error: "Analysis paused" pill with warning icon and retry action

**Responsive:**
- Mobile: sticky compact bar with score + horizontal scrollable pills + floating preview toggle button

---

## 5. Component: Sectioned Rail (Left Navigation)

**Width:** 240px desktop, 56px tablet (icon-only), drawer on mobile
**Background:** White surface with right border

**Structure:** Collapsible sections, each containing category items.

```
Resume Quality
  ○ Impact (3)
  ○ Clarity
  ○ Structure
  ● Formatting

Content
  ● Summary (2)
  ○ Experience
  ○ Skills
  ● Education (partial)

ATS Health
  ○ Keywords
  ○ Role Alignment
  ○ Dates
```

**Section Headers:**
- 13px, semibold, uppercase, muted text
- Chevron icon on right (collapses/expands)
- Click toggles section visibility

**Category Items:**
- Health dot on left (green/amber/red/gray)
- Category name (15px, regular)
- Issue count badge on right (amber badge if > 0, hidden if 0)
- Left border accent on active (3px amber border)
- Hover: subtle background tint

**States:**
- Default: all sections collapsed (or first section open by default)
- Active: selected category has amber left border, elevated background
- Partial: amber badge "Partial" when some data couldn't be analyzed
- All healthy: green checkmark dot
- Incomplete: gray dot + "Add info" prompt

**Responsive:**
- Tablet: icon-only rail (category icons only, dot visible on hover tooltip)
- Mobile: slide-in drawer from left, triggered by hamburger menu button in top bar

---

## 6. Component: Center Analysis Panel

**Width:** ~60% of page (flex-grow)
**Background:** Warm off-white `#FAFAF5`

**Top section header:**
- Category name as large heading (e.g., "Impact")
- Subtitle: brief description of what this category covers
- "Run analysis" button if not yet analyzed

**Issue Cards — Conversation Flow:**

Each issue card has three parts, styled as a conversational message:

**Header:**
- Issue headline in bold (e.g., "Action verbs could be stronger")
- Severity badge: "Needs Work" (amber) / "Should Fix" (red) / "Quick Win" (green)

**Conversation Message (3 parts):**

1. **Context block** (subtle gray background, monospace-style font for resume excerpt)
   > "Here's what we found:"
   > [Current resume text in a subtle highlighted block]

2. **Reason block** (normal weight, warm text)
   > "Here's why it matters:"
   > [Simple English explanation — e.g., "Recruiters scan in under 6 seconds. Weak verbs make them skip past your achievements. ATS systems also weigh action verbs heavily."]

3. **Action block** (slightly bolder, amber accent)
   > "Here's what to do:"
   > [Concrete suggestion — e.g., "Replace 'helped with' with 'led' or 'automated'. Focus on the impact, not the task."]

**Assistant Bar (bottom of each card):**
- Row of 2-3 context-aware action chips
- Chips change based on issue type:
  - Impact issues: "Suggest stronger verbs", "Show examples", "Rewrite with AI"
  - ATS issues: "Optimize keywords", "Check match score", "Tailor for [role]"
  - Clarity issues: "Make it concise", "Split into bullets", "Rewrite with AI"
- Clicking a chip opens an inline AI panel below the card with generated output, before/after preview, and "Apply" / "Discard" buttons

**AI Inline Panel:**
- Slides in below the issue card
- Shows AI-generated content (rewritten text, suggestions, etc.)
- "Apply to resume" button (green) + "Discard" button (ghost)
- "Copy" button for text outputs

**Positive state (no issues):**
"Looking great in Impact. No issues found here — your impact statements are strong."

**Empty state (not yet analyzed):**
"Still analyzing your Impact section... Hang tight while our AI reviews this part."
Animated pulse indicator + bullet list of what's being checked.

**Error state:**
"Something went wrong analyzing this section. [Reason]. Try again or contact support."

---

## 7. Component: Resume Preview Panel

**Width:** ~30% of page, collapsible
**Position:** Right side, can be toggled via "Preview" button in Readiness Band
**Background:** White surface with left shadow

**Toolbar (top):**
- Section jump dropdown (navigate to sections: Header, Summary, Experience, Education, Skills, etc.)
- Zoom toggle (fit-to-view vs. readable)
- Download button (PDF export of current state)

**Document View:**
- White paper-style card with subtle shadow
- Document-like typography (slightly different from UI text — serif for headings optional)
- Section headers clearly labeled
- Resume content rendered in readable bullet/list format
- Highlighted sections: when an issue is selected in the center panel, the relevant resume section gets a warm amber left border glow (4px amber border, subtle background tint)
- Auto-scroll: when issue is selected, preview smoothly scrolls to relevant section

**Preview States:**
- Loading: skeleton matching document layout (header block, section blocks, bullet placeholders, shimmer)
- Loaded: real resume content with interactive highlighting
- Partial data: section shows placeholder card "Education info not found — add it manually" with "Add" button
- No resume: clean prompt "No resume found. Upload one to get started." with upload CTA

**Bidirectional sync (advanced):**
- Clicking a section in the preview can scroll the center panel to show relevant issues
- Implemented via data attributes or scroll anchors

**Responsive:**
- Desktop: visible as side panel
- Tablet/Mobile: slides in as overlay from right (sheet/drawer pattern)

---

## 8. Loading, Empty & Error States

**Analysis in progress:**
- Readiness Band: animated shimmer on pills
- Left rail: skeleton pills with shimmer
- Center panel: large "Analyzing your resume..." state with animated progress ring, descriptive sub-text, bullet list of what's being checked
- Right preview: skeleton document layout
- Duration message: "This usually takes about 30 seconds"

**Some sections couldn't be analyzed (partial data):**
- Affected categories in rail show "Partial" badge (amber)
- Those categories show gentle warning card:
  "We couldn't fully analyze your [Education] section. [Reason]. Add it manually or re-upload a clearer version."
- "Add Missing Info" button opens inline form (not a full editor — just quick fields)
- LinkedIn import variant: top banner "Your LinkedIn profile was imported, but some info wasn't found. [X sections missing]. Help us complete your profile."

**Error state:**
- Friendly error card in center panel (warm amber border, not red):
  "Something went wrong while analyzing your resume. [Brief reason]. Try again." + "Contact support" link
- Left rail and preview remain visible (user isn't blocked)

**Empty state (no resume):**
- Center panel: "Upload a resume to unlock your personalized analysis and improvement suggestions." + Upload button + "Connect LinkedIn instead" link
- Left rail hidden or minimal

---

## 9. Connected Career Tools

The layout should naturally support these tools without feeling bolted on:

**Tool access points:**
- "Get AI Help" button in Readiness Band → opens assistant panel
- Assistant Bar chips on each issue → "Rewrite with AI", "Optimize keywords", etc.
- Contextual prompts in cards: "Want to tailor this for a specific role?" → role selector → keyword optimization

**Tool categories:**
- "Rewrite this bullet" — AI-powered bullet point rewrites
- "Tailor for [role]" — role-specific optimization
- "Improve ATS match" — keyword density analysis and suggestions
- "Suggest stronger action verbs" — vocabulary enhancement
- "Show missing skills for [job]" — gap analysis connected to target roles

**Layout accommodation:**
- The center panel has room below issue cards for a persistent "AI Actions" section
- The Readiness Band's "Get AI Help" button opens a slide-out assistant panel
- These tools are presented as natural extensions of the analysis, not separate features

---

## 10. Routing & Entry Points

- **Route:** `/onboarding/confirm` (profile confirmation after resume/LinkedIn import) → leads to this workspace
- **Alternative route:** `/workspace` — dedicated workspace URL (can be deep-linked)
- **Entry:** User arrives after completing onboarding (upload resume or connect LinkedIn) or by clicking "My Workspace" from dashboard

---

## 11. Technical Notes

### API Integration
- Resume analysis: existing `/api/resume/ats-score` route + new `/api/resume/analyze` route (category-by-category)
- Profile data: existing `/api/profile` route
- AI rewrite: existing `/api/resume/auto-optimize` route
- Data flow: analysis results → store → component state → issue cards

### State Management
- `useResumeStore` already exists — extend for analysis state
- New `useAnalysisStore` for selected category, active issues, highlighted preview section

### Accessibility
- All interactive elements keyboard-navigable
- Focus states visible and styled
- ARIA labels on icon buttons, health dots, and status badges
- Scroll-sync between Readiness Band pills and left rail
- WCAG AA contrast on all text (4.5:1 minimum)

### Performance
- Lazy-load analysis results per category (don't load all issues at once)
- Skeleton states for smooth perceived loading
- Virtualized list for long issue sets

---

## 12. Out of Scope (for this spec)

- Full profile confirmation/edit screen (separate spec)
- LinkedIn OAuth backend (separate spec)
- AI rewrite inline editor (simplified to "Apply" / "Discard" for now)
- Role-targeting tool (connected but separate feature)
- PDF export functionality (placeholder toolbar button, implementation later)
- Mobile-optimized resume preview (full implementation later)