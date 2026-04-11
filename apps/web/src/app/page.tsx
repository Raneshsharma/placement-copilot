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
  Check,
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

// ── Metrics Strip ──
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
        {/* more sections will be added by other tasks */}
      </main>
      <Footer />
    </>
  );
}
