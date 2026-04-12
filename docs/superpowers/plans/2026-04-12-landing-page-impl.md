# Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely redesign the landing page (`apps/web/src/app/page.tsx`) — navy-first, layered ambient motion, before/after hero transformation, job seeker journey narrative arc.

**Architecture:** Landing page as a composition of section components. Shared CSS module for all landing page styles. CSS variables for color system. Framer Motion for all animations (already installed). IntersectionObserver-based scroll triggers. Responsive from mobile-first perspective.

**Tech Stack:** Next.js App Router, Tailwind CSS (existing config), Framer Motion, Lucide React icons.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `apps/web/src/app/globals.css` | Add landing page CSS variables (navy, cyan, amber, emerald color tokens) |
| `apps/web/src/app/landing.module.css` | Create — shared CSS for all landing page sections (no layout, all style) |
| `apps/web/src/app/page.tsx` | Rewrite — compose all section components, wire animations |

---

## Task 1: Landing Page CSS Variables

**Files:**
- Modify: `apps/web/src/app/globals.css:42-50` (after existing variable blocks)

- [ ] **Step 1: Add landing page CSS variables**

Add this block after the existing `--ws-*` variables, before `html {`:

```css
/* Landing page color system */
--lp-navy: #003178;
--lp-navy-dark: #00215c;
--lp-cyan: #006879;
--lp-cyan-light: #008aa3;
--lp-amber: #D97706;
--lp-amber-hover: #B45309;
--lp-emerald: #059669;
--lp-emerald-light: #10b981;
--lp-surface: #ffffff;
--lp-bg: #f9f9ff;
--lp-bg-alt: #f0f0f8;
--lp-text-primary: #111827;
--lp-text-secondary: #6b7280;
--lp-text-muted: #9ca3af;
--lp-border: #e5e7eb;
```

- [ ] **Step 2: Verify no conflicts**

Read the full globals.css to confirm no existing `--lp-*` variables conflict with the additions above.

---

## Task 2: Landing CSS Module

**Files:**
- Create: `apps/web/src/app/landing.module.css`

- [ ] **Step 1: Write the complete CSS module**

Write the following to `apps/web/src/app/landing.module.css`:

```css
/* ═══════════════════════════════════════
   LANDING PAGE — All Sections
   ═══════════════════════════════════════ */

/* ── Navbar ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(249, 249, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--lp-border);
}
.navbarInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbarLogo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logoMark {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--lp-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 49, 120, 0.25);
}
.logoName {
  font-family: var(--font-manrope), sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--lp-navy);
}
.navbarLinks {
  display: flex;
  align-items: center;
  gap: 32px;
}
.navbarLink {
  font-size: 14px;
  font-weight: 500;
  color: var(--lp-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.navbarLink:hover { color: var(--lp-navy); }
.navbarCta {
  padding: 9px 20px;
  border-radius: 8px;
  background: var(--lp-navy);
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 49, 120, 0.2);
}
.navbarCta:hover {
  background: var(--lp-navy-dark);
  box-shadow: 0 4px 16px rgba(0, 49, 120, 0.3);
}

@media (max-width: 767px) {
  .navbarInner { padding: 0 20px; }
  .navbarLinks { display: none; }
}

/* ── Hero ── */
.hero {
  min-height: 100vh;
  background: var(--lp-navy);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 120px 32px 80px;
}
.heroBg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.heroGlow {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 104, 121, 0.3) 0%, transparent 70%);
  border-radius: 50%;
}
.heroDotPattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 32px 32px;
}
.heroFloat {
  position: absolute;
  opacity: 0.08;
  animation: float 8s ease-in-out infinite;
}
.heroFloat:nth-child(3) {
  top: 20%;
  left: 10%;
  width: 120px;
  height: 120px;
  border: 2px solid white;
  border-radius: 24px;
  transform: rotate(15deg);
  animation-delay: 0s;
}
.heroFloat:nth-child(4) {
  bottom: 25%;
  right: 15%;
  width: 80px;
  height: 80px;
  border: 2px solid white;
  border-radius: 50%;
  animation-delay: -3s;
}
.heroFloat:nth-child(5) {
  top: 60%;
  left: 5%;
  width: 60px;
  height: 60px;
  border: 2px solid white;
  border-radius: 12px;
  transform: rotate(-20deg);
  animation-delay: -5s;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(15deg); }
  50% { transform: translateY(-16px) rotate(15deg); }
}
.heroInner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}
.heroContent {}
.heroPill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(0, 104, 121, 0.25);
  border: 1px solid rgba(0, 104, 121, 0.4);
  color: #67d4e3;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}
.heroTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin: 0 0 20px;
}
.heroSubtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin: 0 0 36px;
  max-width: 480px;
}
.heroActions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.heroCtaPrimary {
  padding: 14px 28px;
  border-radius: 10px;
  background: var(--lp-amber);
  color: white;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.heroCtaPrimary:hover {
  background: var(--lp-amber-hover);
  box-shadow: 0 6px 24px rgba(217, 119, 6, 0.45);
  transform: translateY(-2px);
}
.heroCtaSecondary {
  padding: 14px 28px;
  border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.3);
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.heroCtaSecondary:hover {
  border-color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.05);
}
.heroCtaNote {
  margin-top: 12px;
  font-size: 13px;
  color: rgba(255,255,255,0.45);
}

/* Hero Transformation Card */
.heroTransform {
  position: relative;
  perspective: 1000px;
}
.transformCards {
  position: relative;
  width: 100%;
}
.cardBefore, .cardAfter {
  border-radius: 16px;
  padding: 24px;
  background: white;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.cardBefore {
  border: 1px solid rgba(239,68,68,0.3);
  opacity: 1;
  transform: translateX(0);
}
.cardAfter {
  position: absolute;
  top: 0;
  right: 0;
  border: 1px solid rgba(5,150,105,0.3);
  opacity: 0;
  transform: translateX(20px);
}
.cardAfter.isVisible {
  opacity: 1;
  transform: translateX(0);
}
.cardLabel {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: inline-block;
}
.cardBefore .cardLabel {
  background: #fef2f2;
  color: #dc2626;
}
.cardAfter .cardLabel {
  background: #ecfdf5;
  color: #059669;
}
.cardMeta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.cardName {
  font-size: 15px;
  font-weight: 700;
  color: var(--lp-text-primary);
  margin: 0 0 2px;
}
.cardRole {
  font-size: 12px;
  color: var(--lp-text-muted);
  margin: 0;
}
.atsScore {
  margin-left: auto;
  text-align: right;
}
.scoreNum {
  font-size: 22px;
  font-weight: 800;
  display: block;
}
.cardBefore .scoreNum { color: #dc2626; }
.cardAfter .scoreNum { color: #059669; }
.scoreLabel {
  font-size: 10px;
  color: var(--lp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.cardBullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cardBullet {
  font-size: 13px;
  color: var(--lp-text-secondary);
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid transparent;
}
.cardBefore .cardBullet { border-left-color: #e5e7eb; }
.cardAfter .cardBullet { border-left-color: #059669; }
.keyword {
  background: rgba(0,104,121,0.08);
  color: var(--lp-cyan);
  font-weight: 600;
  padding: 0 2px;
  border-radius: 2px;
}
.transformArrow {
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: var(--lp-amber);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(217,119,6,0.4);
  opacity: 0;
  transition: opacity 0.4s 0.3s;
}
.transformArrow.isVisible { opacity: 1; }

@media (max-width: 1023px) {
  .heroInner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .heroTransform { max-width: 480px; margin: 0 auto; }
}

/* ── Metrics Strip ── */
.metrics {
  background: var(--lp-navy);
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 48px 32px;
}
.metricsInner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.metricItem {
  text-align: center;
  padding: 0 32px;
}
.metricItem + .metricItem {
  border-left: 1px solid rgba(255,255,255,0.1);
}
.metricValue {
  font-family: var(--font-manrope), sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--lp-cyan-light);
  line-height: 1;
  margin-bottom: 6px;
}
.metricLabel {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
}

@media (max-width: 767px) {
  .metricsInner { grid-template-columns: 1fr; }
  .metricItem + .metricItem { border-left: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; margin-top: 24px; }
}

/* ── Section Wrapper ── */
.section {
  padding: 96px 32px;
}
.sectionAlt {
  background: var(--lp-bg);
}
.sectionInner {
  max-width: 1200px;
  margin: 0 auto;
}
.sectionEyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lp-cyan);
  margin-bottom: 12px;
}
.sectionTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: var(--lp-text-primary);
  margin: 0 0 16px;
  line-height: 1.2;
}
.sectionSubtitle {
  font-size: 18px;
  color: var(--lp-text-secondary);
  max-width: 560px;
  line-height: 1.6;
  margin: 0;
}
.sectionHeader {
  margin-bottom: 56px;
}

/* ── How It Works ── */
.stepsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}
.stepCard {
  background: white;
  border: 1px solid var(--lp-border);
  border-radius: 16px;
  padding: 28px 24px;
  transition: box-shadow 0.3s, transform 0.3s;
}
.stepCard:hover {
  box-shadow: 0 8px 32px rgba(0,49,120,0.08);
  transform: translateY(-4px);
}
.stepNum {
  font-size: 11px;
  font-weight: 700;
  color: var(--lp-text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}
.stepIcon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0,49,120,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--lp-navy);
}
.stepTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--lp-text-primary);
  margin: 0 0 8px;
}
.stepDesc {
  font-size: 14px;
  color: var(--lp-text-secondary);
  line-height: 1.5;
  margin: 0;
}
.stepsConnector {
  position: absolute;
  top: 40px;
  left: calc(25% + 12px);
  right: calc(25% + 12px);
  height: 1px;
  background: linear-gradient(90deg, var(--lp-border) 0%, var(--lp-cyan) 50%, var(--lp-border) 100%);
  z-index: 0;
}

@media (max-width: 1023px) {
  .stepsGrid { grid-template-columns: repeat(2, 1fr); }
  .stepsConnector { display: none; }
}
@media (max-width: 639px) {
  .stepsGrid { grid-template-columns: 1fr; }
}

/* ── Features Grid ── */
.featuresGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.featureCard {
  background: white;
  border: 1px solid var(--lp-border);
  border-radius: 14px;
  padding: 24px;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}
.featureCard:hover {
  box-shadow: 0 4px 24px rgba(0,49,120,0.08);
  transform: translateY(-2px);
  border-color: rgba(0,49,120,0.15);
}
.featureIcon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0,49,120,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  color: var(--lp-navy);
}
.featureTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--lp-text-primary);
  margin: 0 0 6px;
}
.featureDesc {
  font-size: 13px;
  color: var(--lp-text-secondary);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1023px) {
  .featuresGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .featuresGrid { grid-template-columns: 1fr; }
}

/* ── Testimonials ── */
.testimonialsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.testimonialCard {
  background: white;
  border: 1px solid var(--lp-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: box-shadow 0.3s;
}
.testimonialCard:hover { box-shadow: 0 4px 24px rgba(0,49,120,0.06); }
.testimonialBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 16px;
  align-self: flex-start;
}
.testimonialQuote {
  font-size: 14px;
  color: var(--lp-text-secondary);
  line-height: 1.6;
  font-style: italic;
  margin: 0 0 20px;
  flex: 1;
}
.testimonialAuthor {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--lp-border);
  padding-top: 16px;
}
.testimonialAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0,49,120,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--lp-navy);
  flex-shrink: 0;
}
.testimonialName {
  font-size: 14px;
  font-weight: 600;
  color: var(--lp-text-primary);
  margin: 0 0 2px;
}
.testimonialRole {
  font-size: 12px;
  color: var(--lp-text-muted);
  margin: 0;
}

@media (max-width: 1023px) {
  .testimonialsGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .testimonialsGrid { grid-template-columns: 1fr; }
}

/* ── Pricing ── */
.pricingGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.pricingCard {
  background: white;
  border: 1px solid var(--lp-border);
  border-radius: 20px;
  padding: 36px 32px;
  position: relative;
}
.pricingCardHighlight {
  border-color: var(--lp-cyan);
  box-shadow: 0 0 0 4px rgba(0,104,121,0.08), 0 8px 32px rgba(0,104,121,0.12);
}
.pricingBadge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  border-radius: 20px;
  background: var(--lp-navy);
  color: white;
  font-size: 12px;
  font-weight: 700;
}
.pricingTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--lp-text-primary);
  margin: 0 0 8px;
}
.pricingPrice {
  font-family: var(--font-manrope), sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: var(--lp-navy);
  margin: 0 0 4px;
  line-height: 1;
}
.pricingPriceSub {
  font-size: 14px;
  color: var(--lp-text-muted);
  margin-bottom: 24px;
}
.pricingFeatures {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pricingFeature {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--lp-text-secondary);
}
.pricingFeatureIcon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.pricingCta {
  display: block;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.pricingCtaOutline {
  border: 1.5px solid var(--lp-border);
  color: var(--lp-text-primary);
}
.pricingCtaOutline:hover { border-color: var(--lp-navy); }
.pricingCtaPrimary {
  background: var(--lp-navy);
  color: white;
  box-shadow: 0 2px 12px rgba(0,49,120,0.2);
}
.pricingCtaPrimary:hover { background: var(--lp-navy-dark); }
.pricingNote {
  text-align: center;
  font-size: 13px;
  color: var(--lp-text-muted);
  margin-top: 24px;
}

@media (max-width: 639px) {
  .pricingGrid { grid-template-columns: 1fr; }
}

/* ── FAQ ── */
.faqInner {
  max-width: 720px;
  margin: 0 auto;
}
.faqList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.faqItem {
  background: white;
  border: 1px solid var(--lp-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.faqItem:hover { border-color: rgba(0,49,120,0.2); }
.faqItem.isOpen { border-color: rgba(0,49,120,0.2); }
.faqQuestion {
  width: 100%;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: var(--lp-text-primary);
  font-family: var(--font-manrope), sans-serif;
}
.faqChevron {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--lp-text-muted);
  transition: transform 0.3s, color 0.3s;
}
.faqItem.isOpen .faqChevron {
  transform: rotate(180deg);
  color: var(--lp-navy);
}
.faqAnswer {
  padding: 0 24px 20px;
  font-size: 14px;
  color: var(--lp-text-secondary);
  line-height: 1.7;
}

/* ── Final CTA ── */
.finalCta {
  background: var(--lp-navy);
  padding: 96px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.finalCtaBg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.finalCtaGlow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(0,104,121,0.2) 0%, transparent 70%);
}
.finalCtaFloat {
  position: absolute;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  opacity: 0.5;
}
.finalCtaFloat:nth-child(2) {
  top: 15%;
  left: 8%;
  width: 80px;
  height: 80px;
  animation: float 10s ease-in-out infinite;
}
.finalCtaFloat:nth-child(3) {
  bottom: 20%;
  right: 10%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  animation: float 12s ease-in-out infinite reverse;
}
.finalCtaDivider {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}
.dividerLine {
  width: 80px;
  height: 1px;
  background: rgba(255,255,255,0.15);
}
.dividerIcon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(217,119,6,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.finalCtaTitle {
  font-family: var(--font-manrope), sans-serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  color: white;
  margin: 0 0 16px;
  position: relative;
}
.finalCtaSubtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 36px;
  position: relative;
}
.finalCtaBtn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: 12px;
  background: var(--lp-amber);
  color: white;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 24px rgba(217,119,6,0.4);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.finalCtaBtn:hover {
  background: var(--lp-amber-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(217,119,6,0.5);
}
.finalCtaNote {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin-top: 12px;
  position: relative;
}

/* ── Footer ── */
.footer {
  background: var(--lp-bg);
  border-top: 1px solid var(--lp-border);
  padding: 40px 32px;
}
.footerInner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.footerBrand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.footerLogo {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: var(--lp-navy);
  display: flex;
  align-items: center;
  justify-content: center;
}
.footerName {
  font-family: var(--font-manrope), sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--lp-navy);
}
.footerLinks {
  display: flex;
  align-items: center;
  gap: 24px;
}
.footerLink {
  font-size: 13px;
  color: var(--lp-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.footerLink:hover { color: var(--lp-navy); }
.footerCopy {
  font-size: 13px;
  color: var(--lp-text-muted);
}

@media (max-width: 767px) {
  .footerInner { flex-direction: column; align-items: flex-start; }
  .footerLinks { flex-wrap: wrap; gap: 16px; }
}
```

---

## Task 3: Hero Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — replace the Hero section

- [ ] **Step 1: Write the Hero component code**

Add this to `page.tsx` inside the main component, before the return:

```tsx
// Hero section with before/after transformation
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShowAfter(true), 600);
        }
      },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background elements */}
      <div className={styles.heroBg}>
        <div className={styles.heroGlow} />
        <div className={styles.heroDotPattern} />
        <div className={styles.heroFloat} />
        <div className={styles.heroFloat} />
        <div className={styles.heroFloat} />
      </div>

      <div className={styles.heroInner} ref={heroRef}>
        {/* Left: content */}
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>
            <Zap size={13} />
            AI-Powered Career Placement
          </div>
          <h1 className={styles.heroTitle}>
            Stop sending resumes<br />
            that don&apos;t get callbacks
          </h1>
          <p className={styles.heroSubtitle}>
            AI-powered resume building, ATS optimization, and role-based tailoring —
            so every application is your best shot.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className={styles.heroCtaPrimary}>
              Start for free <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className={styles.heroCtaSecondary}>
              See how it works <ChevronDown size={18} />
            </Link>
          </div>
          <p className={styles.heroCtaNote}>No credit card. Takes 6 minutes.</p>
        </div>

        {/* Right: transformation card */}
        <div className={styles.heroTransform}>
          <div className={styles.transformCards}>
            {/* Before card */}
            <div className={styles.cardBefore}>
              <span className={styles.cardLabel}>Before</span>
              <div className={styles.cardMeta}>
                <div>
                  <p className={styles.cardName}>Alex Thompson</p>
                  <p className={styles.cardRole}>Software Engineer</p>
                </div>
                <div className={styles.atsScore}>
                  <span className={styles.scoreNum}>34%</span>
                  <span className={styles.scoreLabel}>ATS Score</span>
                </div>
              </div>
              <ul className={styles.cardBullets}>
                <li className={styles.cardBullet}>Worked on software projects</li>
                <li className={styles.cardBullet}>Helped team with tasks</li>
                <li className={styles.cardBullet}>Used Python and JavaScript</li>
              </ul>
            </div>

            {/* After card */}
            <div className={`${styles.cardAfter} ${showAfter ? styles.isVisible : ""}`}>
              <span className={styles.cardLabel}>After</span>
              <div className={styles.cardMeta}>
                <div>
                  <p className={styles.cardName}>Alex Thompson</p>
                  <p className={styles.cardRole}>Software Engineer</p>
                </div>
                <div className={styles.atsScore}>
                  <span className={styles.scoreNum}>91%</span>
                  <span className={styles.scoreLabel}>ATS Score</span>
                </div>
              </div>
              <ul className={styles.cardBullets}>
                <li className={styles.cardBullet}>Built and shipped <span className={styles.keyword}>REST APIs</span> serving 50K+ daily requests</li>
                <li className={styles.cardBullet}><span className={styles.keyword}>Led</span> migration of legacy monolith to microservices, cutting latency by 45%</li>
                <li className={styles.cardBullet}>Reduced test suite runtime by <span className={styles.keyword}>60%</span> through parallel execution optimization</li>
              </ul>
            </div>

            {/* Arrow indicator */}
            <div className={`${styles.transformArrow} ${showAfter ? styles.isVisible : ""}`}>
              <ArrowRight size={16} color="white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add imports**

Ensure these are at the top of `page.tsx`:
- `useRef`, `useState`, `useEffect` from `"react"`
- `Zap`, `ArrowRight`, `ChevronDown` from `"lucide-react"` (ArrowRight may be `ArrowRight` or `ArrowUpRight`)

---

## Task 4: Metrics Strip Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add MetricsStrip component

- [ ] **Step 1: Write the MetricsStrip component**

Add before the main component:

```tsx
// Metrics strip with count-up animation
function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  const targets = [47, 10000, 6];
  const suffix = ["%", "+", " min"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          targets.forEach((target, i) => {
            const duration = 1500;
            const steps = 40;
            const increment = target / steps;
            let current = 0;
            const interval = setInterval(() => {
              current = Math.min(current + increment, target);
              setCounts(prev => {
                const next = [...prev];
                next[i] = Math.round(current);
                return next;
              });
              if (current >= target) clearInterval(interval);
            }, duration / steps);
          });
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  const labels = ["average callback increase", "resumes optimized", "average build time"];

  return (
    <div className={styles.metrics} ref={ref}>
      <div className={styles.metricsInner}>
        {counts.map((count, i) => (
          <div key={i} className={styles.metricItem}>
            <div className={styles.metricValue}>
              {i === 1 ? count.toLocaleString() + "+" : count + suffix[i]}
            </div>
            <div className={styles.metricLabel}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Task 5: How It Works Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add HowItWorks section

- [ ] **Step 1: Write the HowItWorks component**

```tsx
import { UploadCloud, Sparkles, Target, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UploadCloud,
    title: "Upload or import",
    desc: "Drop your resume or paste a LinkedIn URL. AI reads it in seconds.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI builds your profile",
    desc: "We analyze your experience, match keywords, and write bullets that ATS systems love.",
  },
  {
    num: "03",
    icon: Target,
    title: "Tailor for any role",
    desc: "Select a target job. We optimize your resume for that specific posting.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Apply with confidence",
    desc: "Get your ATS score, interview prep tips, and track every application.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>How It Works</p>
          <h2 className={styles.sectionTitle}>From confused to confident in 4 steps</h2>
          <p className={styles.sectionSubtitle}>
            Stop applying blind. Every step is designed to move you closer to your next interview.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          <div className={styles.stepsConnector} />
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <p className={styles.stepNum}>{step.num}</p>
              <div className={styles.stepIcon}>
                <step.icon size={22} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 6: Features Grid Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add FeaturesGrid section

- [ ] **Step 1: Write the FeaturesGrid component**

```tsx
import { Sparkles, Search, Target, Link, MessageCircle, Kanban, BarChart2, Users } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Resume Builder", desc: "Describe your experience in plain words. Our AI transforms it into ATS-optimized bullets." },
  { icon: Search, title: "ATS Keyword Scanner", desc: "Compare your resume against any job posting. See exactly which keywords you're missing." },
  { icon: Target, title: "Role-Based Tailoring", desc: "Pick a target job. We rewrite your profile to match what they're looking for." },
  { icon: Link, title: "LinkedIn Import", desc: "One click. Your LinkedIn becomes a structured resume draft." },
  { icon: MessageCircle, title: "Interview Prep", desc: "Based on your target role, we generate practice questions and model answers." },
  { icon: Kanban, title: "Application Tracker", desc: "Log every job you apply to. Track callbacks, interviews, and offers in one place." },
  { icon: BarChart2, title: "Skill Gap Analysis", desc: "See which skills are missing from your profile compared to your target role." },
  { icon: Users, title: "AI Consulting", desc: "Work with a career expert who uses AI insights to guide your strategy." },
];

function FeaturesGrid() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Features</p>
          <h2 className={styles.sectionTitle}>Everything you need to land faster</h2>
          <p className={styles.sectionSubtitle}>
            A complete toolkit built for active job seekers — from first draft to signed offer.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
            >
              <div className={styles.featureIcon}>
                <f.icon size={18} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 7: Testimonials Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add Testimonials section

- [ ] **Step 1: Write the Testimonials component**

```tsx
const testimonials = [
  {
    name: "Sarah Chen",
    initials: "SC",
    role: "Software Engineer",
    quote: "I applied to 40 jobs and heard nothing. After Placement Copilot rewrote my bullets with ATS keywords, I got 5 callbacks in two weeks.",
    badge: "+5 callbacks in 14 days",
  },
  {
    name: "Marcus Rodriguez",
    initials: "MR",
    role: "Product Manager",
    quote: "Mid-career switcher here. The AI builder helped me reframe my marketing experience into PM language. Landed an interview at a fintech startup within a month.",
    badge: "+1 dream role in 28 days",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    role: "Data Analyst",
    quote: "The ATS scanner was a game-changer. After fixing keywords, my callback rate tripled. I didn't realize 'data analysis' vs 'analytics' scored completely differently.",
    badge: "3x callback rate increase",
  },
  {
    name: "James Park",
    initials: "JP",
    role: "UX Designer",
    quote: "I thought my portfolio was enough. Turns out my resume was killing me. Got 3 interviews at companies I actually wanted after fixing my ATS keywords.",
    badge: "+3 targeted interviews",
  },
];

function Testimonials() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Testimonials</p>
          <h2 className={styles.sectionTitle}>People who stopped guessing and started landing</h2>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className={styles.testimonialBadge}>
                <TrendingUp size={10} /> {t.badge}
              </span>
              <p className={styles.testimonialQuote}>"{t.quote}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.initials}</div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 8: Pricing Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add Pricing section

- [ ] **Step 1: Write the Pricing component**

```tsx
import { Check } from "lucide-react";

const freeFeatures = [
  "Build your first resume",
  "ATS keyword scanning (3 jobs/month)",
  "Basic templates",
  "LinkedIn import",
];

const premiumFeatures = [
  "Unlimited AI resume builder",
  "Role-based tailoring (unlimited)",
  "Unlimited ATS scans",
  "Application tracker",
  "Interview prep questions",
  "Priority support",
];

function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader} style={{ textAlign: "center" }}>
          <p className={styles.sectionEyebrow}>Pricing</p>
          <h2 className={styles.sectionTitle}>Start free. Upgrade when you&apos;re ready.</h2>
          <p className={styles.sectionSubtitle} style={{ margin: "0 auto" }}>
            No contracts. No commitment. Your first resume is always free.
          </p>
        </div>
        <div className={styles.pricingGrid}>
          {/* Free tier */}
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingTitle}>Free</h3>
            <p className={styles.pricingPrice}>$0</p>
            <p className={styles.pricingPriceSub}>per month</p>
            <ul className={styles.pricingFeatures}>
              {freeFeatures.map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <span className={styles.pricingFeatureIcon}><Check size={10} color="#059669" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className={`${styles.pricingCta} ${styles.pricingCtaOutline}`}>
              Get started free
            </Link>
          </div>

          {/* Premium tier */}
          <div className={`${styles.pricingCard} ${styles.pricingCardHighlight}`}>
            <span className={styles.pricingBadge}>Most Popular</span>
            <h3 className={styles.pricingTitle}>Premium</h3>
            <p className={styles.pricingPrice}>$12</p>
            <p className={styles.pricingPriceSub}>per month</p>
            <ul className={styles.pricingFeatures}>
              {premiumFeatures.map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <span className={styles.pricingFeatureIcon}><Check size={10} color="#059669" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className={`${styles.pricingCta} ${styles.pricingCtaPrimary}`}>
              Start Premium
            </Link>
          </div>
        </div>
        <p className={styles.pricingNote}>Cancel anytime. No contracts, no cancellation fees.</p>
      </div>
    </section>
  );
}
```

---

## Task 9: FAQ Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add FAQ section

- [ ] **Step 1: Write the FAQ component**

```tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the AI actually improve my resume?",
    a: "We analyze successful resumes in your target field and apply ATS optimization patterns — keyword density, action verb variety, quantified impact statements. You can review and approve every change before saving.",
  },
  {
    q: "Will this work for my industry or role?",
    a: "Yes — we have specialized templates and keyword sets for tech, finance, healthcare, consulting, creative roles, and more. If we don't have a template for your field yet, our AI adapts to generic best practices while you wait.",
  },
  {
    q: "How is my data handled? Is my resume private?",
    a: "Your resume is private and encrypted. We never share your data with third parties. You can delete your account and all data at any time from your settings.",
  },
  {
    q: "Do I need to start from scratch?",
    a: "No — you can import an existing resume (PDF or paste text), or import directly from LinkedIn. Our AI reads what you have and builds from there, not from a blank page.",
  },
  {
    q: "What's the difference between free and premium?",
    a: "Free gives you one resume, basic ATS scanning, and access to all templates. Premium unlocks unlimited AI rewrites, unlimited ATS scans, application tracking, interview prep, and role-based tailoring.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — monthly or annual. Cancel anytime with no contracts and no cancellation fees.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader} style={{ textAlign: "center" }}>
          <p className={styles.sectionEyebrow}>FAQ</p>
          <h2 className={styles.sectionTitle}>Questions people actually ask</h2>
        </div>
        <div className={styles.faqInner}>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openIndex === i ? styles.isOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={styles.faqChevron} size={20} />
                </button>
                {openIndex === i && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 10: Final CTA Component

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add FinalCTA section

- [ ] **Step 1: Write the FinalCTA component**

```tsx
import { Sparkles } from "lucide-react";

function FinalCTA() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalCtaBg}>
        <div className={styles.finalCtaGlow} />
        <div className={styles.finalCtaFloat} />
        <div className={styles.finalCtaFloat} />
      </div>
      <div className={styles.finalCtaDivider}>
        <div className={styles.dividerLine} />
        <div className={styles.dividerIcon}>
          <Sparkles size={14} color="#D97706" />
        </div>
        <div className={styles.dividerLine} />
      </div>
      <h2 className={styles.finalCtaTitle}>
        Your next interview starts with one resume.
      </h2>
      <p className={styles.finalCtaSubtitle}>
        Join 10,000+ job seekers who've stopped guessing and started landing callbacks.
      </p>
      <Link href="/register" className={styles.finalCtaBtn}>
        Build your free resume <ArrowRight size={20} />
      </Link>
      <p className={styles.finalCtaNote}>No credit card. Takes 6 minutes.</p>
    </section>
  );
}
```

---

## Task 11: Footer and Navbar

**Files:**
- Modify: `apps/web/src/app/page.tsx` — add Footer and Navbar

- [ ] **Step 1: Write the Navbar and Footer components**

```tsx
function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <a href="/" className={styles.navbarLogo}>
          <div className={styles.logoMark}>
            <TrendingUp size={18} color="white" />
          </div>
          <span className={styles.logoName}>Placement Copilot</span>
        </a>
        <div className={styles.navbarLinks}>
          <a href="#features" className={styles.navbarLink}>Features</a>
          <a href="#how-it-works" className={styles.navbarLink}>How It Works</a>
          <a href="#pricing" className={styles.navbarLink}>Pricing</a>
          <Link href="/login" className={styles.navbarLink}>Sign In</Link>
          <Link href="/register" className={styles.navbarCta}>Get Started Free</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <TrendingUp size={16} color="white" />
          </div>
          <span className={styles.footerName}>Placement Copilot</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="#features" className={styles.footerLink}>Features</a>
          <a href="#pricing" className={styles.footerLink}>Pricing</a>
          <a href="#" className={styles.footerLink}>Blog</a>
          <a href="#" className={styles.footerLink}>Careers</a>
        </div>
        <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} Placement Copilot. Made for job seekers, by people who've been there.</p>
      </div>
    </footer>
  );
}
```

---

## Task 12: Compose page.tsx

**Files:**
- Rewrite: `apps/web/src/app/page.tsx` — compose all sections

- [ ] **Step 1: Replace the entire page.tsx**

Write the complete new `page.tsx` replacing the current content. Import all sections as inline components (no separate files needed for this plan). Use `motion` from framer-motion for scroll animations. Import `styles` from `./landing.module.css`.

The final `page.tsx` structure should be:

```tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, ChevronDown, TrendingUp,
  UploadCloud, Sparkles, Target, Rocket,
  Search, Link as LinkIcon, MessageCircle, Kanban, BarChart2, Users,
  Check,
} from "lucide-react";
import styles from "./landing.module.css";

// [Paste all components: Navbar, HeroSection, MetricsStrip, HowItWorks,
//  FeaturesGrid, Testimonials, Pricing, FAQ, FinalCTA, Footer]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MetricsStrip />
        <HowItWorks />
        <FeaturesGrid />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
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
Expected: Page loads at localhost:3000, all sections visible, animations fire

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Hero (navy + transformation) | Task 3 |
| Metrics Strip (count-up) | Task 4 |
| How It Works (4-step) | Task 5 |
| Features Grid (8 cards) | Task 6 |
| Testimonials (4 cards) | Task 7 |
| Pricing (2-tier) | Task 8 |
| FAQ (6 questions) | Task 9 |
| Final CTA | Task 10 |
| Footer + Navbar | Task 11 |
| Page composition | Task 12 |
| Build verification | Task 13 |

**All 9 spec sections covered. No gaps.**