# LinkedIn Optimizer — Design Spec

**Goal:** Build a complete LinkedIn optimization workspace in the dashboard. A premium, AI-powered product that helps users improve every meaningful part of their LinkedIn profile through coaching, rewriting, keyword optimization, role targeting, and prioritized improvement planning.

**Entry point:** Dashboard module — accessible from the existing dashboard sidebar. Part of the broader career platform, not a standalone destination.

---

## Color System

Uses existing `--lp-*` landing page variables where appropriate, plus product-specific tokens:

| Token | Hex | Usage |
|-------|-----|-------|
| `--lo-navy` | #003178 | Primary brand, headers, buttons |
| `--lo-cyan` | #006879 | Accents, interactive elements, highlights |
| `--lo-amber` | #D97706 | CTAs, action buttons |
| `--lo-emerald` | #059669 | Success states, strong sections, "good" indicators |
| `--lo-amber-light` | #fef3c7 | Warning backgrounds, opportunity states |
| `--lo-red` | #dc2626 | Critical issue borders, error states |
| `--lo-bg` | #f9f9ff | Page background |
| `--lo-surface` | #ffffff | Card surfaces |
| `--lo-text-primary` | #111827 | Primary text |
| `--lo-text-secondary` | #6b7280 | Secondary text, labels |
| `--lo-text-muted` | #9ca3af | Placeholder text, metadata |
| `--lo-border` | #e5e7eb | Card borders, dividers |

---

## Layout: 3-Column Rail + Panel + Preview

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard header (breadcrumb → LinkedIn Optimizer)             │
├───────────┬──────────────────────────────────────┬──────────────┤
│ LEFT RAIL │ CENTER PANEL                        │ RIGHT PREVIEW│
│  240px     │ flex: 1                             │  380px       │
│            │                                      │              │
│ [Status    │ [Role targeting input bar]            │ Profile      │
│  Cards]    │ [Action rail chips — sticky]         │ content      │
│            │                                      │ blocks       │
│ [6 grouped │ [Coaching analysis cards]            │ (highlighted │
│  nav       │   — Issue #1: paragraph               │  per         │
│  sections   │              + [AI Action buttons]   │  selection)  │
│  w/counts] │   — Issue #2: paragraph              │              │
│            │              + [AI Action buttons]    │              │
│            │   — ...                               │              │
└───────────┴──────────────────────────────────────┴──────────────┘
```

Responsive breakpoints:
- Desktop (>1200px): Full 3-column
- Tablet (768-1200px): Rail collapses to icon strip, preview hidden (toggle), center full width
- Mobile (<768px): Rail becomes bottom sheet, preview hidden, center stacked, status cards 2-column

---

## Section 1: Dashboard Header

- Breadcrumb: Dashboard → LinkedIn Optimizer
- Page title: "LinkedIn Optimizer"
- Subtitle: "Your profile command center — powered by AI"
- Right side: "Analyze Profile" button (to refresh/scan a new LinkedIn URL)

---

## Section 2: Status Cards

5 horizontal dimension cards at the top of the center panel. Row layout, wraps to 2-column on tablet, stacks on mobile.

Each card:
- Icon (from Lucide React)
- Dimension label
- Status chip: Complete (emerald) / In Progress (amber) / Missing (red)
- One-line sub-label explaining current state

Dimensions:
1. **Profile Completeness** — icon: `CheckCircle` — "All sections filled" / "2 sections missing"
2. **Recruiter Visibility** — icon: `Eye` — "High recruiter reach" / "Low discoverability"
3. **Keyword Strength** — icon: `Search` — "Strong ATS keywords" / "Thin keyword presence"
4. **Personal Branding** — icon: `Sparkles` — "Clear brand positioning" / "Vague personal brand"
5. **Target Alignment** — icon: `Target` — "Aligned with [Role]" / "Not targeted yet"

---

## Section 3: Sticky Action Rail

Immediately below status cards. Horizontal row of 3-5 clickable action chips.

Each chip: "1. Fix your headline" / "2. Strengthen About section" / "3. Add metrics to experience" etc.

Click behavior: expands the relevant rail group + scrolls center panel to that section's coaching cards.

Style: pill chips with step number prefix, subtle border, `chevron-right` icon on each chip.

---

## Section 4: Role Targeting Input

Search/input bar below the action rail.

- Icon: `Target` at left of input
- Placeholder: "What role are you targeting? (e.g. Product Manager, Senior Software Engineer...)"
- On focus: dropdown of popular roles (Software Engineer, Product Manager, Data Analyst, UX Designer, Marketing Manager, etc.) + recent selections
- On select: input shows selected role with edit icon
- Behavior: all coaching cards, keyword suggestions, and profile scoring re-filter around the target role
- No role selected: general optimization shown. "Not targeting a specific role yet — enter one above to get personalized suggestions."

---

## Section 5: Sectioned Rail Navigator (left rail)

6 expandable groups, each with status icon and count badge.

| Group | Icon | Sub-sections |
|-------|------|--------------|
| **Profile Foundations** | `User` | Photo guidance, Banner guidance, Custom URL, Headline |
| **Personal Brand** | `Sparkles` | About section, Featured content, Tone & positioning |
| **Experience & Impact** | `Briefcase` | Job entries, Achievement bullets, Measurable results |
| **Skills & Credibility** | `Award` | Skills list, Endorsements strategy, Recommendations |
| **Discoverability & Relevance** | `Search` | Keywords, Title alignment, Recruiter search visibility |
| **Growth & Networking** | `TrendingUp` | Profile activity, Content presence, Connection quality, Creator mode |

Each group:
- Group header: name, status icon (green/amber/red based on worst sub-section), count badge ("3 issues" / "All good")
- Expand on click: reveals sub-items as a list within the rail
- Sub-item click: selects that section, center panel shows coaching cards, right preview highlights the section

---

## Section 6: Coaching Analysis Cards (center panel)

Two-part card structure for each issue/opportunity:

**Top half — coach narrative:**
- Written in first-person coaching voice ("Your headline uses generic words...")
- Plain English, no corporate jargon
- Explains: what was found, why it matters to recruiters/visibility, how it affects them
- Length: 2-4 sentences. Scannable, not a wall of text.
- Color-coded left border: red for critical, amber for opportunity, emerald for strength

**Bottom half — AI action buttons:**
- 2-3 specific action buttons per card
- Examples: [Rewrite Headline] [Add Keywords] [See Examples]
- Premium actions show a lock icon and tooltip: "Premium feature — unlock to rewrite with AI"

**Card states:**
- Critical issue: red left border, alert icon
- Opportunity: amber left border, lightbulb icon
- Strength: emerald left border, checkmark icon

**Card layout:**
- Coach paragraph with icon and severity indicator
- Expandable "Show more context" for longer explanations
- Action buttons row at bottom
- Linked preview section highlighted in the right panel

---

## Section 7: Profile Preview Panel (right rail)

**Structured content blocks** — not a LinkedIn screenshot mockup.

Layout: vertical stack of labeled sections.

| Section | Content shown |
|---------|---------------|
| **Headline** | Current headline text with keyword highlights underlined in cyan |
| **About** | About section text, truncated at 4 lines with "Read more" expand |
| **Experience** | 2-3 most recent roles, each with bullet summary. Expandable per role. |
| **Skills** | Skill chips, endorsed skills marked with checkmark |
| **Banner** | If banner image detected, show a small thumbnail |
| **Photo** | If photo detected, show circular avatar thumbnail |

**Highlights:** When a coaching card is selected in the center panel, the corresponding preview block gets a subtle left-border highlight and a "This section" label. Keywords mentioned in coaching cards are underlined in the preview.

**Empty states:** Each section shows a soft placeholder if no content:
> "Your About section is blank — this is one of the highest-impact areas to fill first."

**Preview toggle:** On tablet/mobile, a floating button to show/hide the preview panel.

---

## Section 8: States

### Loading State
- Status cards: animated skeleton bars
- Action rail: skeleton chips
- Coaching cards: 3 skeleton cards with pulsing placeholder text
- Preview: skeleton content blocks
- Coach message at top: "Reading your LinkedIn profile... I'm analyzing how recruiters see you."

### Empty Profile State (no LinkedIn URL provided)
- Center panel: friendly prompt card with input to paste LinkedIn profile URL
- Coach message: "I can help you optimize your LinkedIn profile. Paste your profile URL below and I'll analyze every section."
- "Paste your LinkedIn URL" input with "Analyze" button
- Below: quick-start suggestions if they don't have a URL yet

### Incomplete Profile State
- Status cards reflect missing sections with amber/red indicators
- Each blank section gets a soft improvement prompt in the preview panel
- Coach message per section: encouraging, not punishing ("Your About section is missing — this is a high-impact area. Recruiters read this before anything else.")

### Success States
- When a coaching action is taken, the card shows a brief "Done" state (e.g., "Headline rewritten ✓") before reverting
- Profile preview updates with the change (highlight animation)
- Status cards update if the change affects a dimension score

### Premium / Locked Actions
- AI rewrite buttons that are premium-only show a lock icon overlay
- Hover tooltip: "Premium feature — unlock to rewrite with AI"
- No separate paywall modal — just the locked state and a subtle upsell prompt below the action buttons

---

## Component Inventory

| Component | Description | States |
|-----------|-------------|--------|
| `StatusCard` | Single dimension card with icon, label, status chip, sub-label | loading, complete, in-progress, missing |
| `ActionRail` | Sticky row of prioritized action chips | default, chip-selected |
| `RoleTargetingInput` | Search input with role suggestions | empty, focused, selected, editing |
| `RailGroup` | Expandable nav group with count badge | collapsed, expanded, has-issues, all-good |
| `RailSubItem` | Individual nav item within a group | default, selected |
| `CoachingCard` | Two-part coaching card | critical, opportunity, strength, loading |
| `AIActionButton` | Action button in coaching card | default, loading, done, locked |
| `ProfilePreview` | Right panel structured content viewer | default, section-highlighted, empty |
| `ProfileBlock` | Single section within preview | default, highlighted, empty |
| `AnalyzePrompt` | Empty state prompt to paste LinkedIn URL | idle, loading, error |
| `LinkedInOptimizerPage` | Main page composition | loading, empty, analyzing, ready |

---

## Navigation Flow

1. User opens `/dashboard` → clicks "LinkedIn Optimizer" in sidebar
2. Page loads with loading state
3. Status cards appear (dimension health at a glance)
4. Action rail shows prioritized improvement sequence
5. User clicks an action chip (e.g., "Fix your headline first") → rail group expands, coaching cards for Headline appear, preview highlights Headline
6. User clicks a coaching card → expanded view with AI actions, preview keeps Headline highlighted
7. User clicks [Rewrite Headline] → AI generates a rewrite → card shows Done state → preview updates headline with highlight animation
8. User sets a target role in the input → all cards and suggestions re-filter to that role's keywords and positioning

---

## Technical Architecture

**Route:** `apps/web/src/app/(dashboard)/linkedin/page.tsx`

**Store:** Create `linkedin-optimizer-store.ts` — manages profile data, selected section, role target, AI analysis state, coaching cards.

**Data model:**

```typescript
interface LinkedInProfile {
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
}

interface OptimizationSection {
  id: string;
  group: string;
  name: string;
  status: 'complete' | 'in-progress' | 'missing';
  issueCount: number;
  coachingCards: CoachingCard[];
}

interface CoachingCard {
  id: string;
  severity: 'critical' | 'opportunity' | 'strength';
  headline: string; // short label
  body: string;     // coach paragraph
  linkedSection: string; // which profile section this affects
  actions: AIAction[];
  priority: number;
}

interface AIAction {
  label: string;      // "Rewrite Headline"
  type: 'rewrite' | 'suggest' | 'improve' | 'tailor';
  isPremium: boolean;
}

interface RoleTarget {
  id: string;
  title: string; // "Product Manager"
  keywords: string[];
  industry?: string;
}
```

**Mock data:** All analysis uses mock data initially (similar to `workspace-store.ts`). Real LinkedIn import and AI generation are future integrations.

**CSS module:** `linkedin-optimizer.module.css` — all styles for the page.

**Responsiveness:** CSS grid with `grid-template-columns: 240px 1fr 380px`, breakpoints at 1200px, 768px.

---

## UX Principles

1. **Coaching, not criticizing** — every message sounds like a supportive career strategist, not an audit report
2. **Actionable, not overwhelming** — users see a clear next step, not 30 problems at once
3. **Context always visible** — the preview panel means coaching always has a real-world reference
4. **Goal-driven** — role targeting filters everything so the product always knows what the user is optimizing toward
5. **Premium without coldness** — the product feels high-end and polished, but warm and encouraging, not corporate