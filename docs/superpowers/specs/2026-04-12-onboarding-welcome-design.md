# Post-Login Onboarding Screen — Welcome Entry Point

**Date:** 2026-04-12
**Type:** Feature Design Spec

---

## 1. Overview

A warm, welcoming post-login screen that guides users to set up their profile by choosing one of two paths: uploading a resume or connecting their LinkedIn profile. This is the first screen a user sees after logging in (if they don't yet have a profile), and it serves as the entry point for personalized career support.

**Goals:**
- Immediate clarity — user understands in < 5 seconds what to do
- Low friction — takes < 30 seconds to start either path
- Friendly and trustworthy tone
- Distinct visual identity from the dashboard (light, warm, welcoming)

---

## 2. Visual Design

### Layout
- Full-page centered layout, no sidebar or dashboard chrome
- Background: warm off-white `#FAFAF5`
- Container max-width: ~900px, vertically centered
- Brand mark (logo + "Placement Copilot") pinned top-center — subtle, small, not the focus
- Generous vertical padding (~80px top)

### Color Palette
- Background: `#FAFAF5` (warm off-white)
- Surface (cards): `#FFFFFF` (white)
- Primary accent: `#D97706` (amber/gold)
- Accent hover: `#B45309` (darker amber)
- Text primary: `#1C1917` (warm near-black)
- Text secondary: `#57534E` (warm gray)
- Text muted: `#A8A29E` (light warm gray)
- Border: `#E7E5E4` (warm light border)
- Shadow: warm-toned, soft (e.g., `0 4px 24px rgba(0,0,0,0.06)`)

### Typography
- Heading: display size (~36px desktop, ~28px mobile), font-weight bold, warm near-black
- Subheading: ~18px, text-secondary
- Card title: ~20px, font-weight semibold
- Card description: ~15px, text-secondary
- CTA button: ~15px, font-weight medium

### Spacing & Radius
- Card padding: 32px desktop, 24px mobile
- Card border-radius: 16px
- Button border-radius: 12px
- Gap between cards: 24px

### Responsive
- Desktop (≥640px): two cards side by side, ~420px each
- Mobile (<640px): cards stack vertically, full width, 16px gap
- Touch targets: buttons min 48px height
- Padding scales: 24px desktop → 16px mobile

---

## 3. Content & Copy

### Heading
> "Let's set up your profile."

### Supporting paragraph
> "Share your resume or connect your LinkedIn. We'll use it to build your profile, improve your resume, and give you personalized career guidance — faster."

### Card 1 — Upload Resume
- **Title:** "Upload Resume"
- **Icon:** Document upload illustration (warm-colored, clean)
- **Description:** "Drop in your current resume and let our AI analyze it, strengthen your bullet points, and help you build a job-winning profile."
- **CTA Button:** "Start with Resume"

### Card 2 — Connect LinkedIn
- **Title:** "Connect LinkedIn"
- **Icon:** LinkedIn connection illustration (warm-colored, clean)
- **Description:** "Import your experience, education, and skills from LinkedIn to automatically set up your profile and get personalized career guidance."
- **CTA Button:** "Start with LinkedIn"

### Skip link
- "I'll do this later" — small, muted text below cards
- Links to `/dashboard`

---

## 4. Interactions & States

### Card Hover States
- On hover: card lifts (translateY -4px), shadow deepens, border gets subtle amber tint
- CTA button: background shifts from amber to darker amber on hover
- Cursor: pointer on entire card

### Card Click
- Brief scale-down on press (scale 0.98, 150ms)
- Immediately transitions to next step

### Resume Upload Flow
1. User clicks "Start with Resume" → inline upload UI (no modal)
2. File picker accepts PDF, DOCX (max 10MB)
3. On file selection: show file name + loading spinner + "Analyzing your resume..."
4. On parse success: brief success state ("Resume analyzed!") → redirect to profile confirmation screen
5. On parse error: inline error with retry option

### LinkedIn Flow
1. User clicks "Start with LinkedIn" → redirect to LinkedIn OAuth
2. On return: show loading state "Importing your profile..."
3. On success: profile auto-populated → redirect to profile confirmation screen
4. On error: error message with fallback option ("Import failed — try uploading a resume instead")

### Loading States
- Inline spinner + descriptive text ("Analyzing your resume..." / "Importing your profile...")
- No full-page loaders — calm and contained

### Error States
- Inline error below the relevant action
- Warm amber/orange for warnings (not harsh red)
- "Try again" always available

---

## 5. Routing & Navigation

### Routes
- `/onboarding/entry` — Welcome screen (this feature)
- `/onboarding/resume` — Resume upload & parsing flow
- `/onboarding/linkedin` — LinkedIn OAuth & import flow
- `/onboarding/confirm` — Profile confirmation screen (shared after both paths)
- `/dashboard` — Destination for skip or after completing either path

### Entry Logic
- On login, check if user has a profile (via `profileApi.get()`)
- If no profile: redirect to `/onboarding/entry`
- If profile exists: redirect to `/dashboard`

### Re-entry Prevention
- Store `hasCompletedOnboarding` flag in user profile
- Users who skip can return via a nudge in the dashboard (e.g., a banner: "Complete your profile for better recommendations")

### Downstream Convergence
- Both Resume and LinkedIn paths end at `/onboarding/confirm` (profile confirmation)
- From `/onboarding/confirm`, user can review/edit extracted data and save
- On save: update user profile, set `hasCompletedOnboarding = true`, redirect to `/dashboard`

---

## 6. Technical Notes

### API Integration
- Resume upload: use existing `/api/resume/import-pdf` route
- Profile creation/update: use existing `/api/profile` route
- LinkedIn OAuth: requires new backend endpoint to exchange code for profile data

### State Management
- Use Zustand store for onboarding flow state (selected method, parsed data)
- No persistent state needed — flow is short and stateless by nature

### Accessibility
- All interactive elements keyboard-navigable
- Sufficient contrast (WCAG AA)
- Focus states visible
- `aria-label` on icon-only buttons

### Performance
- No heavy assets — icons are inline SVG or small SVGs
- Fast initial paint
- Smooth transitions (Framer Motion or CSS transitions)

---

## 7. Out of Scope (for this spec)

- Profile confirmation/edit screen — handled in a separate spec
- LinkedIn OAuth backend implementation — handled in backend integration spec
- Resume parsing backend implementation — handled in AI service spec
- Dashboard nudge banner — separate future feature
- Existing 5-step onboarding flow — remains accessible from dashboard settings