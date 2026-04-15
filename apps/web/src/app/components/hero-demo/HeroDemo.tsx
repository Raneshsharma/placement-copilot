"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, FileText, Briefcase, AlertCircle } from "lucide-react";
import styles from "./hero-demo.module.css";

// ── Data ──────────────────────────────────────────────────────────────────────

const RESUME_TITLE = "Aarav_Resume.pdf";
const ROLE_TITLE = "Product Analyst";

const WEAK_BULLETS = [
  "Worked on data analysis and reports",
  "Helped team with dashboards",
  "Participated in product discussions",
];

const IMPROVED_BULLETS = [
  "Analyzed customer funnel data to uncover drop-offs, improving conversion by 14%",
  "Built weekly KPI dashboards that cut manual reporting time by 28%",
  "Partnered with product and ops teams to prioritize insight-led feature decisions",
];

const MISSING_KEYWORDS = ["SQL", "A/B Testing", "Stakeholder Reporting"];
const MATCHED_KEYWORDS = ["SQL", "A/B Testing", "Stakeholder Reporting", "Dashboarding", "Product Analytics"];

const TOTAL_DURATION = 7000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KeywordChip({ label, state }: { label: string; state: "matched" | "missing" | "pending" }) {
  return (
    <motion.span
      className={`${styles.chip} ${styles[`chip_${state}`]}`}
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {state === "matched" && <Check size={9} color="#fff" />}
      {state === "missing" && <AlertCircle size={9} color="#d97706" />}
      {label}
    </motion.span>
  );
}

function BulletLine({ text, state, delay }: { text: string; state: "weak" | "improved"; delay: number }) {
  return (
    <motion.li
      className={`${styles.bullet} ${state === "improved" ? styles.bulletImproved : styles.bulletWeak}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      {text}
    </motion.li>
  );
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#f59e0b" : "#ef4444";
  const pct = clamp(((value - 0) / 100) * 100, 0, 100);
  return (
    <div className={styles.scoreRingWrap}>
      <div className={styles.scoreRing} style={{ "--pct": `${pct}%`, "--ring-color": color } as React.CSSProperties}>
        <span className={styles.scoreRingNum} style={{ color }}>{value}</span>
      </div>
      <span className={styles.scoreRingLabel}>{label}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

type Phase = "entering" | "reading" | "analyzing" | "transforming" | "final";

interface PhaseConfig {
  phase: Phase;
  start: number; // 0..1 fraction of TOTAL_DURATION
  end: number;
}

export default function HeroDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("entering");
  const [score, setScore] = useState(62);
  const [visibleKeywords, setVisibleKeywords] = useState<Set<string>>(new Set());
  const [improvedBulIdx, setImprovedBulIdx] = useState(-1);
  const [loopKey, setLoopKey] = useState(0);
  const prefersReduced = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced.current);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPhase("final");
      setScore(91);
      setVisibleKeywords(new Set(MATCHED_KEYWORDS));
      setImprovedBulIdx(2);
      return;
    }
    setPhase("entering");
    setScore(62);
    setVisibleKeywords(new Set());
    setImprovedBulIdx(-1);

    let animFrame: number;
    let startTime = performance.now();

    const schedulePhase = (phase: Phase, delay: number) =>
      setTimeout(() => setPhase(phase as Phase), delay);

    const t = (ms: number) => ms / TOTAL_DURATION;

    schedulePhase("entering", 0);
    schedulePhase("reading", 800);
    schedulePhase("analyzing", 2200);
    schedulePhase("transforming", 4000);
    schedulePhase("final", 5800);

    // Score count-up
    const countUp = () => {
      const elapsed = performance.now() - startTime;
      const rawScore = 62 + (29 * clamp(elapsed, 0, 3200) / 3200);
      setScore(Math.round(rawScore));
      animFrame = requestAnimationFrame(countUp);
    };
    animFrame = requestAnimationFrame(countUp);

    // Keyword reveal
    setTimeout(() => {
      setVisibleKeywords(new Set(["SQL"]));
      setTimeout(() => setVisibleKeywords(v => { const s = new Set(Array.from(v)); s.add("A/B Testing"); return s; }), 200);
      setTimeout(() => setVisibleKeywords(v => { const s = new Set(Array.from(v)); s.add("Stakeholder Reporting"); return s; }), 400);
    }, 4000);

    // Bullet improvements
    setTimeout(() => setImprovedBulIdx(0), 4200);
    setTimeout(() => setImprovedBulIdx(1), 4900);
    setTimeout(() => setImprovedBulIdx(2), 5600);

    // Loop
    const loopTimer = setTimeout(() => setLoopKey(k => k + 1), TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(loopTimer);
      [800, 2200, 4000, 5800].forEach(clearTimeout);
    };
  }, [loopKey, reducedMotion]);

  const PHASE_LABELS: Record<Phase, string> = {
    entering: "Loading resume...",
    reading: "Analyzing context...",
    analyzing: "AI analyzing...",
    transforming: "Optimizing...",
    final: "Interview Ready",
  };

  const phaseIsActive = (p: Phase) => {
    const order: Phase[] = ["entering", "reading", "analyzing", "transforming", "final"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Phase badge */}
      <div className={styles.phaseBar}>
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            className={`${styles.phaseBadge} ${phase === "final" ? styles.phaseBadgeFinal : ""}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {phase === "analyzing" || phase === "transforming" ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={styles.phaseSpinner}
              />
            ) : phase === "final" ? (
              <Check size={10} color="#fff" />
            ) : (
              <Sparkles size={10} color="#d97706" />
            )}
            {PHASE_LABELS[phase]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Main demo area */}
      <div className={styles.demoArea}>
        {/* Left: Resume card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: -40, scale: 0.9 }}
          animate={{ opacity: phaseIsActive("reading") ? 1 : 0, x: phaseIsActive("reading") ? 0 : -40, scale: phaseIsActive("reading") ? 1 : 0.9 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.cardHeader}>
            <FileText size={12} color="#d97706" />
            <span className={styles.cardTitle}>{RESUME_TITLE}</span>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardSectionLabel}>BULLETS</div>
            <ul className={styles.bulletList}>
              {WEAK_BULLETS.map((text, i) => (
                <BulletLine key={i} text={text} state={improvedBulIdx >= i ? "improved" : "weak"} delay={improvedBulIdx >= 0 ? 0 : 0} />
              ))}
            </ul>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardSectionLabel}>SKILLS</div>
            <div className={styles.chipRow}>
              <KeywordChip label="Python" state="matched" />
              <KeywordChip label="Excel" state="matched" />
              <KeywordChip label="Tableau" state="matched" />
              <AnimatePresence>
                {phaseIsActive("transforming") && MISSING_KEYWORDS.map((k, i) => (
                  <motion.span
                    key={k}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`${styles.chip} ${styles.chip_pending}`}
                  >
                    {k}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Center: Score */}
        <motion.div
          className={styles.scoreCenter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phaseIsActive("reading") ? 1 : 0, y: phaseIsActive("reading") ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <ScoreRing value={score} label="ATS Match" />
          {phase === "final" && (
            <motion.div
              className={styles.finalBadge}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.2 }}
            >
              <Check size={10} color="#fff" />
              Interview Ready
            </motion.div>
          )}
        </motion.div>

        {/* Right: Job card */}
        <motion.div
          className={`${styles.card} ${styles.cardJob}`}
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: phaseIsActive("reading") ? 1 : 0, x: phaseIsActive("reading") ? 0 : 40, scale: phaseIsActive("reading") ? 1 : 0.9 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.cardHeader}>
            <Briefcase size={12} color="#0d7377" />
            <span className={styles.cardTitle}>{ROLE_TITLE}</span>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardSectionLabel}>KEYWORDS SOUGHT</div>
            <div className={styles.chipRow}>
              {MATCHED_KEYWORDS.map((k) => (
                <KeywordChip
                  key={k}
                  label={k}
                  state={visibleKeywords.has(k) ? "matched" : "missing"}
                />
              ))}
            </div>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardSectionLabel}>PREFERRED FORMAT</div>
            <div className={styles.preferredFormat}>
              <span className={styles.formatTag}>Quantified metrics</span>
              <span className={styles.formatTag}>STAR format</span>
              <span className={styles.formatTag}>Impact statements</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transformation stream (bottom) */}
      <AnimatePresence>
        {phaseIsActive("transforming") && (
          <motion.div
            className={styles.transformStream}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {IMPROVED_BULLETS.slice(0, improvedBulIdx + 1).map((text, i) => (
              <motion.div
                key={i}
                className={styles.transformItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className={styles.transformCheck}><Check size={9} color="#22c55e" /></span>
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: "0%" }}
          animate={{ width: phase === "final" ? "100%" : "0%" }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
