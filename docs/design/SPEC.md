# Design System — Placement Copilot AI

**Status:** In Progress
**Last Updated:** 2026-04-11
**Owner:** UX Agent

---

## Overview

This document is the authoritative reference for all visual and interaction design decisions in Placement Copilot AI. It covers the design system, component library, and implementation guidelines.

---

## 1. Brand & Visual Identity

### Product Vision
Placement Copilot AI is a professional, trustworthy, and modern AI-powered career platform. The visual language should convey: **competence, clarity, and encouragement**. It's not a social network — it's a serious tool that helps people make career-defining decisions.

### Brand Attributes
- **Professional** — clean, structured, no-nonsense
- **Trustworthy** — clear hierarchy, honest feedback, reliable actions
- **Modern** — contemporary UI patterns, smooth motion, smart defaults
- **Encouraging** — progress-focused, celebrate wins, supportive tone

### Tone of Voice
- Write like a helpful colleague, not a corporate robot
- Progress over perfection: celebrate small wins
- Be specific: "Your PPS is 68 — here's how to reach 80" not "You're doing great!"
- Error messages: clear + actionable ("Upload failed — file must be under 10MB" not "Error occurred")

---

## 2. Color System

### Core Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `#f8fafc` (slate-50) | `#0f172a` (slate-950) | Page background |
| `foreground` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | Primary text |
| `primary` | `#2563eb` (blue-600) | `#3b82f6` (blue-500) | Primary actions, links |
| `primary-foreground` | `#ffffff` | `#ffffff` | Text on primary |
| `secondary` | `#f1f5f9` (slate-100) | `#1e293b` (slate-800) | Secondary surfaces |
| `secondary-foreground` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | Text on secondary |
| `muted` | `#f1f5f9` (slate-100) | `#1e293b` (slate-800) | Muted backgrounds |
| `muted-foreground` | `#64748b` (slate-500) | `#94a3b8` (slate-400) | Secondary text |
| `accent` | `#f1f5f9` (slate-100) | `#334155` (slate-700) | Hover states, highlights |
| `accent-foreground` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | Text on accent |
| `destructive` | `#ef4444` (red-500) | `#f87171` (red-400) | Destructive actions |
| `destructive-foreground` | `#ffffff` | `#ffffff` | Text on destructive |
| `border` | `#e2e8f0` (slate-200) | `#334155` (slate-700) | Borders, dividers |
| `input` | `#e2e8f0` (slate-200) | `#334155` (slate-700) | Input borders |
| `ring` | `#2563eb` (blue-600) | `#3b82f6` (blue-500) | Focus rings |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22c55e` (green-500) | Success states, positive metrics |
| `warning` | `#f59e0b` (amber-500) | Warnings, pending states |
| `error` | `#ef4444` (red-500) | Error states, rejected applications |
| `info` | `#3b82f6` (blue-500) | Informational highlights |

### Status Colors (Application Tracker)

| Status | Color | Hex |
|--------|-------|-----|
| Draft | Gray | `#94a3b8` |
| Submitted | Blue | `#3b82f6` |
| Under Review | Amber | `#f59e0b` |
| Interview | Purple | `#a855f7` |
| Offered | Green | `#22c55e` |
| Rejected | Red | `#ef4444` |
| Withdrawn | Slate | `#64748b` |

---

## 3. Typography

### Font Stack
- **Display/Headings**: Inter or system-ui stack — bold weights
- **Body**: Inter or system-ui stack — regular/medium weights
- **Mono**: JetBrains Mono or monospace — for code, IDs, technical data

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| `display-xl` | 3rem (48px) | 700 | 1.1 | Hero headlines |
| `display-lg` | 2.25rem (36px) | 700 | 1.15 | Page titles |
| `display-md` | 1.875rem (30px) | 600 | 1.2 | Section headers |
| `heading-xl` | 1.5rem (24px) | 600 | 1.3 | Card titles, modals |
| `heading-lg` | 1.25rem (20px) | 600 | 1.35 | Subsection headers |
| `heading-md` | 1.125rem (18px) | 500 | 1.4 | List item titles |
| `body-lg` | 1rem (16px) | 400 | 1.5 | Body text |
| `body-md` | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| `body-sm` | 0.75rem (12px) | 400 | 1.4 | Captions, metadata |
| `label` | 0.875rem (14px) | 500 | 1.4 | Form labels |
| `badge` | 0.75rem (12px) | 500 | 1.2 | Badges, tags |

### Responsive Typography
- Mobile: Body at 16px minimum (no zoom on focus)
- Headings scale down ~15% on mobile
- Line lengths capped at 75ch for body text

---

## 4. Spacing System

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon gaps, tight padding |
| `space-2` | 8px | Inline gaps, small padding |
| `space-3` | 12px | Input padding, small gaps |
| `space-4` | 16px | Standard padding, gaps |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Large gaps |
| `space-10` | 40px | Page section padding |
| `space-12` | 48px | Major section dividers |
| `space-16` | 64px | Hero sections |

---

## 5. Layout & Structure

### Page Architecture
- **Sidebar** (desktop only, 240px collapsed to 64px): Navigation
- **Header** (fixed, 64px height): Page title, user menu, notifications
- **Main content**: Scrollable, max-width 1280px, centered
- **Bottom nav** (mobile only, 64px): 5-item navigation

### Sidebar Items
1. Dashboard (home icon)
2. Applications (kanban icon)
3. Resume (document icon)
4. Jobs/Roles (briefcase icon)
5. Interview (mic icon)
6. Skills (target icon)
7. Settings (gear icon, bottom)

### Responsive Strategy
- **Desktop (>1024px)**: Sidebar + header + main content
- **Tablet (640-1024px)**: Collapsible sidebar + header + main content
- **Mobile (<640px)**: No sidebar, header with hamburger, main content, bottom nav

### Content Max-Widths
- **Reading content**: 75ch
- **Dashboard cards**: 1280px
- **Forms**: 480px
- **Dialogs**: 560px

---

## 6. Components

### Button

| Variant | Usage |
|---------|-------|
| `primary` | Main CTA — "Save", "Submit Application", "Start Interview" |
| `secondary` | Secondary actions — "Cancel", "Back", "Edit" |
| `ghost` | Tertiary actions — "Skip", "Learn more" |
| `destructive` | Danger actions — "Delete", "Withdraw" |
| `outline` | Toggle states, filters |

**Sizes**: `sm` (h-8), `md` (h-10, default), `lg` (h-12)
**States**: default, hover, active, disabled, loading (spinner)

### Badge

| Variant | Usage |
|---------|-------|
| `default` | Neutral tags |
| `success` | "Offered", "Completed" |
| `warning` | "Under Review", "Pending" |
| `error` | "Rejected", "Failed" |
| `info` | "New", "Updated" |

### Input
- Height: 40px
- Border radius: 8px
- Focus ring: 2px primary with 2px offset
- Error state: red border + error message below
- Disabled: 50% opacity, cursor-not-allowed

### Card
- Background: secondary surface
- Border radius: 12px
- Padding: space-5 (20px)
- Shadow: subtle on hover (elevation transition)
- Variants: default, elevated (shadow), bordered (1px border)

### Dialog/Modal
- Centered with backdrop blur
- Max-width: 560px
- Border radius: 16px
- Padding: space-6 (24px)
- Animation: scale + fade in (framer-motion)
- Close: X button top-right + Escape key + backdrop click

### Skeleton/Loading
- Pulse animation (slate-200/800)
- Matches exact shape of content being loaded
- Never show empty space during loading

---

## 7. Motion & Animation

### Principles
- **Purposeful**: every animation communicates something (state change, spatial relationship, feedback)
- **Subtle**: enhances clarity, doesn't distract
- **Fast**: most animations under 200ms
- **Consistent**: same patterns throughout

### Standard Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|---------|-------|
| Page transition | 200ms | ease-out | Route changes (fade + y-translate) |
| Modal open | 200ms | ease-out | Dialog entrance (scale + fade) |
| Modal close | 150ms | ease-in | Dialog exit |
| Sidebar collapse | 300ms | spring | Sidebar toggle |
| Card hover | 150ms | ease | Shadow elevation |
| Button press | 100ms | ease | Scale 0.98 |
| Skeleton pulse | 1.5s | ease-in-out | Loading shimmer (infinite) |
| Toast | 300ms | spring | Slide in from bottom-right |

### Responsive Motion
- Respect `prefers-reduced-motion` — disable all motion
- Use `useReducedMotion` hook from framer-motion

---

## 8. Accessibility

### Standards
- **WCAG 2.1 AA** compliance required
- Color contrast: minimum 4.5:1 for text, 3:1 for large text
- Never rely on color alone — always use icons + text + color

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order (top-to-bottom, left-to-right)
- Visible focus indicators (ring)
- Escape closes modals/dropdowns
- Enter/Space activates buttons

### Screen Readers
- Semantic HTML (button, nav, main, article)
- ARIA labels on icon-only buttons
- Live regions for dynamic updates (toasts, notifications)
- Alt text on all images

### Focus Management
- Focus trapped in modals when open
- Focus returns to trigger on modal close
- Skip-to-content link on every page

---

## 9. Empty States

Every feature must have a designed empty state:

### Empty State Pattern
1. **Icon/illustration** — relevant, not generic
2. **Headline** — what is empty (e.g., "No applications yet")
3. **Body text** — why this matters, what to do next
4. **CTA button** — primary action to fill the empty state

### Empty State Examples
- No applications: "Start tracking your job search" + "Add Application" button
- No resume: "Upload your resume to get ATS scoring" + "Upload Resume" button
- No interviews: "Practice makes perfect" + "Start Mock Interview" button
- No jobs saved: "Save jobs you love" + "Browse Jobs" button

---

## 10. Error States

### Error Patterns
1. **Form errors**: Red border + error message below field + summary at top
2. **API errors**: Toast notification (top-right) with retry action
3. **Page errors**: Full-page error with "Try again" button + support link
4. **Empty search**: "No results for '[query]'" + suggestions

### Error Message Rules
- Be specific: "Email already registered" not "An error occurred"
- Be actionable: "Upload failed — file too large (max 10MB)" not "Upload failed"
- Never blame the user: "Session expired — please log in again" not "You were logged out"

---

## 11. Implementation Notes

### Tailwind Config
All tokens map to Tailwind utilities via `tailwind.config.ts` using CSS variables from `globals.css`.

### Key Tailwind Patterns
```tsx
// Colors via CSS variables
<div className="bg-background text-foreground">

// Spacing via Tailwind
<div className="p-4 space-y-2 gap-4">

// Typography
<h1 className="font-display text-display-lg">
<p className="font-body text-body-lg">

// Components via shadcn/ui
<Button variant="primary" size="md">
<Badge variant="success">
<Card className="p-5">
```

### shadcn/ui Components to Use
- Button, Input, Label, Card, Badge, Tabs, Dialog, DropdownMenu, Select
- Toast (Sonner), Skeleton, Progress, Avatar, Separator, Tooltip
- Form (React Hook Form + Zod), Table, Sheet (mobile sidebar)

### Custom Components
- Sidebar — custom in `components/layout/sidebar.tsx`
- BottomNav — custom in `components/layout/bottom-nav.tsx`
- Header — custom in `components/layout/header.tsx`
- KanbanBoard — custom in `components/applications/kanban-board.tsx`

---

## 12. Design Review Checklist

Before handing off for development, every design must pass:

- [ ] Happy path flow documented
- [ ] Error/empty/loading states designed
- [ ] Mobile-first responsive behavior specified
- [ ] Accessibility (ARIA, keyboard nav, contrast) verified
- [ ] Interaction details (hover, click, drag, transitions) documented
- [ ] Component variants mapped to design system
- [ ] All copy finalized (no placeholder text)
- [ ] Spacing and sizing use design tokens
- [ ] Dark mode compatibility checked
- [ ] Component variants cover all states (default, hover, active, disabled, loading, error, empty)
