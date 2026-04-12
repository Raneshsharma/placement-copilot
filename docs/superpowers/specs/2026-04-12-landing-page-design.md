# Landing Page Redesign — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the landing page for the AI-powered resume builder and career growth platform. Modern, premium, light-first, energetic. Confident & Professional visual direction. Job seeker journey narrative arc.

**Architecture:** Navy-first color system (#003178 hero, #006879 accents, #D97706 CTAs, #059669 success signals). Full-viewport hero with before/after transformation animation. Layered ambient motion throughout. Confident editorial feel — Stripe/Bloomberg quality, not generic SaaS.

**Tech Stack:** Next.js App Router, Tailwind CSS (existing config), Framer Motion (already available), Lucide React icons, CSS Modules where appropriate.

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-navy` | #003178 | Hero backgrounds, primary text |
| `--brand-cyan` | #006879 | Accents, interactive elements, secondary highlights |
| `--warm-amber` | #D97706 | CTA buttons, highlights |
| `--success-emerald` | #059669 | Success signals, metrics, growth indicators |
| `--surface-light` | #f9f9ff | Page base, card backgrounds |
| `--surface-white` | #ffffff | Card surfaces |
| `--text-primary` | #111827 | Body text on light backgrounds |
| `--text-secondary` | #6b7280 | Secondary text, labels |

---

## Section Structure

### 1. Hero Block

**Layout:** Full-viewport. Left half: headline + subheadline + two CTAs. Right half: animated before/after transformation card.

**Headline:** "Stop sending resumes that don't get callbacks"

**Subheadline:** "AI-powered resume building, ATS optimization, and role-based tailoring — so every application is your best shot."

**CTAs:**
- Primary: "Start for free" (amber button, large)
- Secondary: "See how it works" (ghost button, scrolls to journey section)

**Right panel:** Animated transformation. Left card: bare, generic resume with low ATS score ("34%"). Right card: optimized version with richer bullets, highlighted keywords, high score ("91%"). Left card appears first on load, right card animates in as a fade + slide on scroll trigger.

**Background:** Deep navy (#003178) with subtle layered depth — very soft radial glow from bottom-right, optional subtle dot pattern at very low opacity. Crisp, not busy.

**Float elements:** 1-2 subtle floating geometric shapes in the background at low opacity (10-15%), matching ambient motion brief.

**Animation:**
- Hero content fades in on load (staggered: headline → subheadline → CTAs)
- Before/after transformation plays on scroll trigger (IntersectionObserver)
- Floating elements have a slow float animation (8-12s loop)

**Responsive:** On tablet, stack vertically (headline + CTAs above, transformation below). On mobile, transformation below CTA, reduced visual complexity.

---

### 2. Metrics Strip

**Layout:** Full-width horizontal strip. Dark navy background. Three metrics separated by subtle vertical dividers.

**Metrics:**
- "47%" — "average callback increase"
- "10,000+" — "resumes optimized"
- "6 min" — "average build time"

**Animation:** Numbers count up when section scrolls into view. Staggered: first metric counts, then second, then third. Count animation uses spring easing.

**Style:** Large bold numbers in cyan (#006879) or white, small label text in muted white below each. Clean, credible. No decorative elements.

**Responsive:** On mobile, metrics stack vertically or wrap 2+1.

---

### 3. How It Works — Journey Steps

**Layout:** 4-step horizontal card row on desktop, 2x2 grid on tablet, stacked on mobile. Subtle connecting line between steps.

**Steps:**

1. **Upload or Import**
   - Icon: upload cloud (Lucide `upload-cloud`)
   - Title: "Upload or import"
   - Description: "Drop your resume or paste a LinkedIn URL. AI reads it in seconds."

2. **AI Builds Your Profile**
   - Icon: sparkles (Lucide `sparkles`)
   - Title: "AI builds your profile"
   - Description: "We analyze your experience, match keywords, and write bullets that ATS systems love."

3. **Tailor for Any Role**
   - Icon: target (Lucide `target`)
   - Title: "Tailor for any role"
   - Description: "Select a target job. We optimize your resume for that specific posting — keywords, tone, impact."

4. **Apply with Confidence**
   - Icon: rocket (Lucide `rocket`)
   - Title: "Apply with confidence"
   - Description: "Get your ATS score, interview prep tips, and track every application."

**Animation:** Each step card slides in from below on scroll, staggered. Connecting line draws on scroll.

**Style:** Alternating section backgrounds (navy/light). Icon in a small navy circle, step number in muted text above title, bold title, short description below. Clean, not cluttered.

**Responsive:** Desktop 4-column row, tablet 2x2 grid, mobile stacked.

---

### 4. Features Grid

**Layout:** 2 rows of 4 cards on desktop, 2-column on tablet, 1-column on mobile. Visual rhythm via alternating card layouts (icon left on some, preview right on others).

**Features:**

1. **AI Resume Builder** — "Describe your experience in plain words. Our AI transforms it into ATS-optimized bullets." (Lucide `sparkles`)

2. **ATS Keyword Scanner** — "Compare your resume against any job posting. See exactly which keywords you're missing." (Lucide `search`)

3. **Role-Based Tailoring** — "Pick a target job. We rewrite your profile to match what they're looking for." (Lucide `target`)

4. **LinkedIn Import** — "One click. Your LinkedIn becomes a structured resume draft." (Lucide `link`)

5. **Interview Prep** — "Based on your target role, we generate practice questions and model answers." (Lucide `message-circle`)

6. **Application Tracker** — "Log every job you apply to. Track callbacks, interviews, and offers in one place." (Lucide `kanban`)

7. **Skill Gap Analysis** — "See which skills are missing from your profile compared to your target role." (Lucide `bar-chart-2`)

8. **AI Consulting** — "Work with a career expert who uses AI insights to guide your strategy." (Lucide `users`)

**Animation:** Cards fade in with staggered timing on scroll. Hover: subtle lift (translateY -2px) + shadow deepens.

**Style:** White card with subtle border, icon in small navy circle top-left, bold title, one-line description. Clean, not cluttered.

---

### 5. Testimonials

**Layout:** Grid of 4 cards on desktop, 2-column on tablet, 1-column on mobile.

**Cards:**

1. **Sarah Chen — Software Engineer**
   - Quote: "I applied to 40 jobs and heard nothing. After Placement Copilot rewrote my bullets with ATS keywords, I got 5 callbacks in two weeks. The role tailoring feature alone was worth it."
   - Badge: "+5 callbacks in 14 days"
   - Avatar: neutral placeholder

2. **Marcus Rodriguez — Product Manager**
   - Quote: "Mid-career switcher here. My resume was all over the place. The AI builder helped me reframe my marketing experience into PM language. Landed an interview at a fintech startup within a month."
   - Badge: "+1 dream role in 28 days"
   - Avatar: neutral placeholder

3. **Priya Nair — Data Analyst**
   - Quote: "The ATS scanner was a game-changer. I didn't realize 'data analysis' vs 'analytics' vs 'data science' scored completely differently. After fixing keywords, my callback rate tripled."
   - Badge: "3x callback rate increase"
   - Avatar: neutral placeholder

4. **James Park — UX Designer**
   - Quote: "I thought my portfolio was enough. Turns out my resume was killing me. Placement Copilot helped me connect my portfolio work to the actual job description keywords. Got 3 interviews at companies I actually wanted."
   - Badge: "+3 targeted interviews"
   - Avatar: neutral placeholder

**Animation:** Cards fade in with staggered timing on scroll. No fancy transitions — clean, credible.

**Style:** White card with subtle border and shadow. Photo circle top-left or centered above text. Name + role in small text. Quote in slightly larger font. Metric badge in corner using emerald green to signal success.

---

### 6. Pricing

**Layout:** Two cards side by side with a gap. Centered.

**Free Tier:**
- Title: "Free"
- Price: "$0 / month"
- CTA: "Get started free" (outlined button)
- Items: Build your first resume, ATS keyword scanning (3 jobs/month), Basic templates, LinkedIn import

**Premium Tier (highlighted):**
- Badge: "Most Popular" or "Best for active job seekers" — small pill at top
- Title: "Premium"
- Price: TBD (placeholder, suggested $12-15/month)
- CTA: "Start Premium" (amber button)
- Items: Unlimited AI resume builder, Role-based tailoring (unlimited), Unlimited ATS scans, Application tracker, Interview prep questions, Priority support

**Style:** Free tier = white card, subtle border. Premium tier = same white card with subtle cyan glow shadow, physically elevated more via shadow. Amber "Most popular" pill at top of premium card.

**Below cards:** "Cancel anytime. No commitment. Your first resume is always free."

**Animation:** Cards slide in from below on scroll, staggered.

---

### 7. FAQ

**Layout:** Clean accordion list, centered, max-width (720px).

**Questions:**

1. **"How does the AI actually improve my resume?"**
   - Answer: "We analyze successful resumes in your target field and apply ATS optimization patterns — keyword density, action verb variety, quantified impact statements. You can review and approve every change before saving."

2. **"Will this work for my industry/role?"**
   - Answer: "Yes — we have specialized templates and keyword sets for tech, finance, healthcare, consulting, creative roles, and more. If we don't have a template for your field yet, our AI adapts to generic best practices while you wait."

3. **"How is my data handled? Is my resume private?"**
   - Answer: "Your resume is private and encrypted. We never share your data with third parties. You can delete your account and all data at any time from your settings."

4. **"Do I need to start from scratch?"**
   - Answer: "No — you can import an existing resume (PDF or paste text), or import directly from LinkedIn. Our AI reads what you have and builds from there, not from a blank page."

5. **"What's the difference between the free and premium tiers?"**
   - Answer: "Free gives you one resume, basic ATS scanning, and access to all templates. Premium unlocks unlimited AI rewrites, unlimited ATS scans, application tracking, interview prep, and role-based tailoring."

6. **"Can I cancel anytime?"**
   - Answer: "Yes, monthly or annual. Cancel anytime — no contracts, no cancellation fees."

**Animation:** Each answer expands with smooth height transition. Chevron rotates. No page jump.

**Style:** Alternating section background. Question text bold, answer in regular weight with good line-height.

---

### 8. Final CTA

**Layout:** Full-width section, deep navy background, centered.

**Headline:** "Your next interview starts with one resume."

**Subheadline:** "Join 10,000+ job seekers who've stopped guessing and started landing callbacks."

**CTA:** "Build your free resume" — amber primary button, large, centered.

**Subtext:** "No credit card. Takes 6 minutes."

**Animation:** On scroll into view: headline fades in first, then subheadline, then button slides up with subtle spring.

**Background:** Deep navy with very subtle radial glow from center, soft ambient floating shapes (same style as hero).

**Optional divider:** Thin horizontal line above CTA with small spark/checkmark icon in center.

---

### 9. Footer

**Layout:** Two rows. Top: logo left, nav links right. Bottom: copyright + legal.

**Top row:** Logo left. Links right: Features, Pricing, FAQ, Blog, Careers. Small text, light color.

**Bottom row:** Copyright center, "Privacy Policy | Terms" right-aligned. Muted text throughout.

**Extras:** Optional tagline — "Made for job seekers, by people who've been there."

---

## Animation Summary

| Section | Animation |
|---------|-----------|
| Hero | Staggered fade-in on load + scroll-triggered before/after transformation |
| Metrics | Count-up numbers on scroll (staggered) |
| Journey Steps | Staggered slide-in from below |
| Features | Staggered fade-in on scroll, hover lift |
| Testimonials | Staggered fade-in on scroll |
| Pricing | Staggered slide-in from below |
| FAQ | Accordion expand/collapse with chevron rotation |
| Final CTA | Staggered fade-in + button spring slide-up |
| Global | Ambient floating shapes in hero and final CTA sections |

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | Full design as specified |
| Tablet (768-1024px) | 2-column grids, stacked hero |
| Mobile (<768px) | Single column, simplified hero, stacked metrics |