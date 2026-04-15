"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  ChevronDown,
  ArrowRight,
  UploadCloud,
  Sparkles,
  Search,
  Target,
  Rocket,
  Link as LinkIcon,
  FileText,
  MessageCircle,
  Kanban,
  BarChart2,
  Users,
  Check,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./landing.module.css";
import HeroDemo from "./components/hero-demo/HeroDemo";

// ── Navbar ──
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="#features" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#pricing" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Pricing</a>
          <Link href="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link href="/register" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>Get Started Free</Link>
        </div>
      )}
    </nav>
  );
}

// ── Hero Section ──
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

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

        {/* Right: animated product demo */}
        <div className={styles.heroTransform}>
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}

// ── Live Resume Optimizer Widget ──
function LiveOptimizerWidget({ visible }: { visible: boolean }) {
  const [score, setScore] = useState(34);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const improvements = [
      "Quantified achievements with metrics",
      "Added ATS-optimized keywords",
      "Restructured with STAR format",
    ];

    let current = 34;
    const totalDuration = 3200;
    const fps = 60;
    const steps = (totalDuration / 1000) * fps;
    const increment = (91 - 34) / steps;
    const interval = setInterval(() => {
      current = Math.min(current + increment, 91);
      setScore(Math.round(current));
      setProgress(((current - 34) / 57) * 100);
      if (current >= 91) {
        clearInterval(interval);
        setDone(true);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [visible]);

  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      className={styles.optimizerWidget}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className={styles.optimizerHeader}>
        <div className={styles.optimizerTitle}>
          <Sparkles size={14} color="#d97706" />
          <span>AI Optimizing Resume</span>
          <motion.span
            className={styles.optimizerDot}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
        {done && <span className={styles.optimizerBadge}>Complete</span>}
      </div>

      {/* Score ring */}
      <div className={styles.optimizerScoreArea}>
        <div className={styles.optimizerRing} style={{ '--progress': `${progress}%`, '--color': scoreColor } as React.CSSProperties}>
          <span className={styles.optimizerScoreNum} style={{ color: scoreColor }}>{score}</span>
          <span className={styles.optimizerScoreLabel}>ATS Score</span>
        </div>
      </div>

      {/* Improvements list */}
      <div className={styles.optimizerImprovements}>
        {[
          "Quantified achievements with metrics",
          "Added ATS-optimized keywords",
          "Restructured with STAR format",
        ].map((text, i) => (
          <motion.div
            key={i}
            className={styles.optimizerItem}
            initial={{ opacity: 0, x: -12 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.25, duration: 0.4 }}
          >
            <span className={styles.optimizerItemCheck}>
              <Check size={10} color="#fff" />
            </span>
            <span>{text}</span>
          </motion.div>
        ))}
      </div>

      {/* Footer score */}
      <div className={styles.optimizerFooter}>
        <div className={styles.optimizerFooterLeft}>
          <span className={styles.optimizerOldScore}>34%</span>
          <ArrowRight size={12} color="#a8a29e" />
          <span className={styles.optimizerNewScore} style={{ color: scoreColor }}>{score}%</span>
        </div>
        <motion.div
          className={styles.optimizerProgressBar}
          initial={{ width: '0%' }}
          animate={{ width: done ? '100%' : `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Floating particles */}
      {visible && (
        <>
          <motion.div
            className={styles.optimizerParticle1}
            animate={{ y: [-6, 6, -6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={styles.optimizerParticle2}
            animate={{ y: [6, -8, 6], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.div
            className={styles.optimizerParticle3}
            animate={{ y: [-4, 8, -4], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}
    </motion.div>
  );
}

// ── Metrics Strip ──
interface StatConfig {
  value: number;
  display: string;
  label: string;
  suffix: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  animType: "count" | "timer" | "ticker";
}

const STATS: StatConfig[] = [
  {
    value: 18,
    display: "0%",
    label: "average callback lift",
    suffix: "%",
    icon: TrendingUp,
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.1)",
    animType: "count",
  },
  {
    value: 2300,
    display: "0+",
    label: "resumes optimized",
    suffix: "+",
    icon: FileText,
    iconColor: "#d97706",
    iconBg: "rgba(217,119,6,0.1)",
    animType: "ticker",
  },
  {
    value: 8,
    display: "0 min",
    label: "average first draft time",
    suffix: " min",
    icon: Rocket,
    iconColor: "#0d7377",
    iconBg: "rgba(13,115,119,0.1)",
    animType: "timer",
  },
];

function StatCard({
  stat,
  phase,
  delay,
}: {
  stat: StatConfig;
  phase: number;
  delay: number;
}) {
  const [display, setDisplay] = useState(stat.display);
  const [barWidth, setBarWidth] = useState(0);
  const [timerDeg, setTimerDeg] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const startedRef = useRef(false);

  // Count-up for 18%
  useEffect(() => {
    if (phase < delay || startedRef.current || stat.animType !== "count") return;
    startedRef.current = true;
    const duration = 1600;
    const start = performance.now();
    const from = 0;
    const to = stat.value;
    const raf = requestAnimationFrame(function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current + stat.suffix);
      if (progress < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [phase, delay, stat]);

  // Ticker for 2300+
  useEffect(() => {
    if (phase < delay || startedRef.current || stat.animType !== "ticker") return;
    startedRef.current = true;
    const duration = 2000;
    const start = performance.now();
    const from = 0;
    const to = stat.value;
    const raf = requestAnimationFrame(function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current + stat.suffix);
      setBarWidth(Math.round(progress * 100));
      if (progress < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [phase, delay, stat]);

  // Timer ring for 8 min
  useEffect(() => {
    if (phase < delay || startedRef.current || stat.animType !== "timer") return;
    startedRef.current = true;
    const totalMs = 2000;
    const fromDeg = -90;
    const toDeg = 270;
    const start = performance.now();
    const raf = requestAnimationFrame(function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const deg = Math.round(fromDeg + (toDeg - fromDeg) * eased);
      setTimerDeg(deg);
      const targetVal = Math.round(stat.value * progress);
      setDisplay(targetVal + stat.suffix);
      if (progress < 1) requestAnimationFrame(step);
      else {
        setDisplay(stat.value + stat.suffix);
        setPulsing(true);
        setTimeout(() => setPulsing(false), 1200);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [phase, delay, stat]);

  const Icon = stat.icon;
  const visible = phase >= delay;

  return (
    <motion.div
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Icon bubble */}
      <motion.div
        className={styles.statIcon}
        style={{ background: stat.iconBg }}
        animate={pulsing ? { scale: [1, 1.12, 1], boxShadow: [`0 0 0 0 ${stat.iconColor}40`, `0 0 0 6px transparent`, `0 0 0 0 ${stat.iconColor}40`] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Icon size={18} color={stat.iconColor} strokeWidth={2} />
      </motion.div>

      {/* Number */}
      <motion.div
        className={styles.statValue}
        animate={pulsing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        {display}
      </motion.div>

      {/* Label */}
      <div className={styles.statLabel}>{stat.label}</div>

      {/* Bar (ticker only) */}
      {stat.animType === "ticker" && (
        <div className={styles.statBarTrack}>
          <motion.div
            className={styles.statBarFill}
            initial={{ width: "0%" }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.1 }}
            style={{ background: stat.iconColor }}
          />
        </div>
      )}

      {/* Timer ring (timer only) */}
      {stat.animType === "timer" && (
        <div className={styles.statTimerWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(13,115,119,0.1)" strokeWidth="2" />
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#0d7377"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="87.96"
              animate={{ strokeDashoffset: 87.96 - (87.96 * (timerDeg + 90)) / 360 }}
              transition={{ duration: 0.05 }}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(-1);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced.current) {
      setPhase(3);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase(0);
          setTimeout(() => setPhase(1), 100);
          setTimeout(() => setPhase(2), 200);
          setTimeout(() => setPhase(3), 300);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.metrics} ref={ref}>
      <div className={styles.metricsInner}>
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} phase={phase} delay={i} />
        ))}
      </div>
    </div>
  );
}

// ── How It Works ──
const steps = [
  {
    num: "01",
    icon: UploadCloud,
    animType: "upload" as const,
    title: "Upload your resume",
    desc: "Drop in your resume or import your LinkedIn profile. We turn your experience into a clean starting draft in seconds.",
  },
  {
    num: "02",
    icon: Sparkles,
    animType: "rewrite" as const,
    title: "Strengthen your profile",
    desc: "We improve weak bullets, add role-relevant keywords, and rewrite your experience into ATS-friendlier language.",
  },
  {
    num: "03",
    icon: Target,
    animType: "match" as const,
    title: "Tailor for the job",
    desc: "Paste any job description and get a version of your resume aligned to that role, skills, and expectations.",
  },
  {
    num: "04",
    icon: Rocket,
    animType: "complete" as const,
    title: "Apply with clarity",
    desc: "Review your match score, fix gaps, prep for interviews, and track each application in one place.",
  },
];

function StepCard({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: number;
}) {
  const isActive = progress >= index + 1;
  const isPast = progress > index + 1;
  const Icon = step.icon;

  return (
    <motion.div
      className={`${styles.stepCard} ${isPast ? styles.stepCardPast : ""} ${isActive ? styles.stepCardActive : ""}`}
      initial={{ opacity: 0.4, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Icon */}
      <motion.div
        className={`${styles.stepIcon} ${isPast ? styles.stepIconPast : ""}`}
        animate={step.animType === "upload" && isActive && !isPast ? { y: [-2, 2, -2] } : {}}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={22} strokeWidth={1.75} />
      </motion.div>

      {/* Title + desc */}
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepDesc}>{step.desc}</p>

      {/* Step-specific animation element */}
      {step.animType === "rewrite" && isActive && !isPast && (
        <motion.div
          className={styles.stepShimmer}
          animate={{ x: [-80, 200] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />
      )}
      {step.animType === "match" && isActive && !isPast && (
        <div className={styles.stepChips}>
          {["SQL", "A/B", "Stakeholder"].map((k, ci) => (
            <motion.span
              key={k}
              className={styles.stepChip}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ci * 0.2, duration: 0.3 }}
            >
              {k}
            </motion.span>
          ))}
        </div>
      )}
      {step.animType === "complete" && isPast && (
        <motion.div
          className={styles.stepDonePill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Check size={9} color="#22c55e" />
          Ready to apply
        </motion.div>
      )}
    </motion.div>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(-1);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced.current) {
      setProgress(4);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgress(0);
          [1, 2, 3, 4].forEach((n, i) => setTimeout(() => setProgress(n), 300 + i * 350));
        }
      },
      { threshold: 0.35 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const connectorProgress = Math.max(0, Math.min(4, progress)) / 4;

  return (
    <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderCentered}`}>
          <p className={styles.sectionEyebrow}>How It Works</p>
          <h2 className={styles.sectionTitle}>
            Go from draft resume to job-ready application<br className={styles.brDesktop} /> in 4 steps
          </h2>
          <p className={styles.sectionSubtitle}>
            Upload your resume, let AI strengthen it, tailor it to a real job, and apply with a clearer shot at interviews.
          </p>
        </div>

        {/* Animated connector track */}
        <motion.div
          className={styles.stepsTrack}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.stepsTrackBg} />
          <motion.div
            className={styles.stepsTrackFill}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
          {/* Step nodes — numbers removed, nodes are visual markers only */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`${styles.stepsTrackNode} ${progress > i ? styles.stepsTrackNodeDone : ""} ${progress === i + 1 ? styles.stepsTrackNodeActive : ""}`}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.3, duration: 0.35, type: "spring", stiffness: 400, damping: 25 }}
            />
          ))}
        </motion.div>

        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Grid ──
const features = [
  { icon: Sparkles, title: "AI Resume Builder", desc: "Start with rough experience or a LinkedIn profile. We turn it into a clearer, ATS-friendly resume draft." },
  { icon: Search, title: "ATS Keyword Scanner", desc: "Compare your resume against a job description and spot the keywords and requirements you're missing." },
  { icon: Target, title: "Role-Based Tailoring", desc: "Create a version of your resume that fits the role, language, and priorities of a specific posting." },
  { icon: LinkIcon, title: "LinkedIn Import", desc: "Import your LinkedIn profile in one click and turn it into a structured resume draft." },
  { icon: MessageCircle, title: "Interview Prep", desc: "Get role-specific practice questions and sharper talking points based on the jobs you're targeting." },
  { icon: Kanban, title: "Application Tracker", desc: "Keep track of applications, callbacks, interviews, and offers without using a separate spreadsheet." },
  { icon: BarChart2, title: "Skill Gap Analysis", desc: "See which skills or signals are missing from your profile so you know what to improve next." },
  { icon: Kanban, title: "Resume Versioning", desc: "Save tailored resume versions for different roles and switch between them without rewriting from scratch." },
];

function FeaturesGrid() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Features</p>
          <h2 className={styles.sectionTitle}>Everything you need to move from draft to offer</h2>
          <p className={styles.sectionSubtitle}>
            A focused toolkit for job seekers who want stronger resumes, better targeting, and a clearer path to interviews.
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

// ── FAQ ──
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
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {faq.q}
                  <ChevronDown className={styles.faqChevron} size={20} />
                </button>
                {openIndex === i && (
                  <div className={styles.faqAnswer} id={`faq-answer-${i}`}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──
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
        <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} Placement Copilot. Made for job seekers, by people who&apos;ve been there.</p>
      </div>
    </footer>
  );
}

// ── Testimonials ──
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

// ── Pricing ──
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
                  <span className={styles.pricingFeatureIcon}><Check size={12} color="var(--lp-emerald)" /></span>
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
                  <span className={styles.pricingFeatureIcon}><Check size={12} color="var(--lp-emerald)" /></span>
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

// ── Final CTA ──
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

// ── Page Export ──
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
