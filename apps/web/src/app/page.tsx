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
  MessageCircle,
  Kanban,
  BarChart2,
  Users,
} from "lucide-react";
import styles from "./landing.module.css";

// ── Navbar ──
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

// ── Hero Section ──
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

// ── How It Works ──
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

// ── Features Grid ──
const features = [
  { icon: Sparkles, title: "AI Resume Builder", desc: "Describe your experience in plain words. Our AI transforms it into ATS-optimized bullets." },
  { icon: Search, title: "ATS Keyword Scanner", desc: "Compare your resume against any job posting. See exactly which keywords you're missing." },
  { icon: Target, title: "Role-Based Tailoring", desc: "Pick a target job. We rewrite your profile to match what they're looking for." },
  { icon: LinkIcon, title: "LinkedIn Import", desc: "One click. Your LinkedIn becomes a structured resume draft." },
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

// ── Page Export ──
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Testimonials />
        {/* more sections will be added by other tasks */}
      </main>
      <Footer />
    </>
  );
}
