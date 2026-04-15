"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import styles from "../../interview.module.css";

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getScoreClass(score: number): string {
  if (score >= 80) return styles.scoreHigh;
  if (score >= 60) return styles.scoreMid;
  return styles.scoreLow;
}

function RadarChart({ scores, inView }: {
  scores: { communication: number; structure: number; specificity: number; confidence: number; roleFit: number };
  inView: boolean;
}) {
  const axes = [
    { label: 'Communication', value: scores.communication },
    { label: 'Structure', value: scores.structure },
    { label: 'Specificity', value: scores.specificity },
    { label: 'Confidence', value: scores.confidence },
    { label: 'Role Fit', value: scores.roleFit },
  ];
  const size = 200, cx = size / 2, cy = size / 2, r = 70;
  const n = axes.length, angleStep = (2 * Math.PI) / n;

  function polarToXY(angle: number, radius: number) {
    return { x: cx + radius * Math.sin(angle), y: cy - radius * Math.cos(angle) };
  }

  const dataPoints = axes.map((axis, i) =>
    polarToXY(i * angleStep - Math.PI / 2, r * (axis.value / 100))
  );
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const gridLines = [0.25, 0.5, 0.75, 1].map(scale => {
    const pts = axes.map((_, i) => {
      const p = polarToXY(i * angleStep - Math.PI / 2, r * scale);
      return `${p.x} ${p.y}`;
    }).join(' ');
    return `M ${pts} Z`;
  });

  const labelPoints = axes.map((_, i) => polarToXY(i * angleStep - Math.PI / 2, r + 22));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
      className={`${styles.radarAnimated} ${inView ? styles.radarAnimated : ''}`}
    >
      {gridLines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e7e5e4" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const p = polarToXY(i * angleStep - Math.PI / 2, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e7e5e4" strokeWidth="1" />;
      })}
      <path
        d={dataPath}
        fill="rgba(217,119,6,0.15)"
        stroke="#d97706"
        strokeWidth="2"
        style={{ transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)', opacity: inView ? 1 : 0 }}
      />
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#d97706"
          style={{ transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${0.1 * i}s`, opacity: inView ? 1 : 0 }}
        />
      ))}
      {axes.map((axis, i) => (
        <text
          key={i}
          x={labelPoints[i].x}
          y={labelPoints[i].y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="600"
          fill="#57534e"
          style={{ transition: `opacity 0.6s ease ${0.3 + 0.05 * i}s`, opacity: inView ? 1 : 0 }}
        >
          {axis.label}
        </text>
      ))}
    </svg>
  );
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { activeSession, sessions, clearActiveSession } = useInterviewStore();
  const [barsInView, setBarsInView] = useState(false);
  const [radarInView, setRadarInView] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const scoreSectionRef = useRef<HTMLDivElement>(null);
  const radarSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === scoreSectionRef.current && entry.isIntersecting) {
            setBarsInView(true);
          }
          if (entry.target === radarSectionRef.current && entry.isIntersecting) {
            setRadarInView(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (scoreSectionRef.current) observer.observe(scoreSectionRef.current);
    if (radarSectionRef.current) observer.observe(radarSectionRef.current);
    return () => observer.disconnect();
  }, [activeSession, sessions]);

  const reportSession = activeSession?.status === 'COMPLETED' && activeSession.id === params.sessionId
    ? activeSession
    : sessions.find(s => s.id === params.sessionId && s.status === 'COMPLETED');

  // Keyboard navigation for comparison toggle
  const toggleComparison = useCallback(() => {
    if (sessions.length > 1) setShowComparison(v => !v);
  }, [sessions.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        toggleComparison();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleComparison]);

  if (!reportSession) {
    return (
      <div className={styles.reportPage}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ fontSize: '16px', color: '#57534e' }}>Loading report...</p>
          <button onClick={() => router.push('/interview')} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontSize: '14px' }}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const score = reportSession.overallScore ?? 0;
  const scoreColor = getScoreColor(score);
  const dimensions = reportSession.dimensionScores!;
  const dimensionsList = [
    { label: 'Communication', value: dimensions.communication },
    { label: 'Structure', value: dimensions.structure },
    { label: 'Specificity', value: dimensions.specificity },
    { label: 'Confidence', value: dimensions.confidence },
    { label: 'Role Fit', value: dimensions.roleFit },
  ];

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (dimensions.communication >= 75) strengths.push('Clear and articulate communication throughout the interview');
  if (dimensions.structure >= 75) strengths.push('Well-structured responses using the STAR method effectively');
  if (dimensions.specificity >= 75) strengths.push('Strong use of specific metrics and measurable outcomes in examples');
  if (dimensions.confidence >= 75) strengths.push('Confident tone with minimal filler words');
  if (dimensions.roleFit >= 75) strengths.push('Good alignment with the target company culture and role expectations');

  if (dimensions.communication < 70) improvements.push('Work on clarity — rehearse answers before the interview to reduce hesitation');
  if (dimensions.structure < 70) improvements.push('Use the STAR method more consistently: Situation → Task → Action → Result');
  if (dimensions.specificity < 70) improvements.push('Add specific numbers, outcomes, and metrics to your examples');
  if (dimensions.confidence < 70) improvements.push('Practice out loud more — record yourself to reduce filler words and pauses');
  if (dimensions.roleFit < 70) improvements.push('Research the company culture and prepare examples that reflect their values');

  const completedAt = reportSession.completedAt ? new Date(reportSession.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className={styles.reportPage}>
      <div className={styles.reportCard}>
        <div className={styles.reportHeader}>
          <div>
            <div className={styles.reportCompany}>{reportSession.company} — {reportSession.role}</div>
            <div className={styles.reportMeta}>{reportSession.interviewType} · {reportSession.difficulty} · {completedAt}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.reportScore} style={{ color: scoreColor }}>{score}</div>
            <div className={styles.reportScoreLabel}>out of 100</div>
          </div>
        </div>

        {/* Before / After toggle */}
        {sessions.length > 1 && (
          <div
            role="group"
            aria-label="Score comparison toggle — use arrow keys to switch"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '12px 28px 0', gap: '8px' }}
          >
            <span style={{ fontSize: '11px', color: '#a8a29e', fontWeight: 500 }}>{showComparison ? 'Before' : 'After'}</span>
            <div style={{ display: 'flex', background: '#f5f5f0', borderRadius: '20px', padding: '3px', gap: '2px', cursor: 'pointer' }}>
              <button
                onClick={() => setShowComparison(false)}
                style={{
                  padding: '5px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: !showComparison ? '#d97706' : 'transparent', color: !showComparison ? '#fff' : '#57534e',
                  transition: 'all 0.2s ease',
                }}
              >
                Current
              </button>
              <button
                onClick={() => setShowComparison(true)}
                style={{
                  padding: '5px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: showComparison ? '#d97706' : 'transparent', color: showComparison ? '#fff' : '#57534e',
                  transition: 'all 0.2s ease',
                }}
              >
                Compare
              </button>
            </div>
          </div>
        )}

        <div className={styles.scoreSection} ref={scoreSectionRef}>
          <div className={styles.scoreSectionTitle}>Score Breakdown</div>
          {dimensionsList.map((dim, idx) => {
            const displayValue = showComparison ? Math.round(dim.value * 0.85) : dim.value;
            return (
              <div key={dim.label} className={styles.scoreBarRow}>
                <div className={styles.scoreBarLabel}>{dim.label}</div>
                <div className={styles.scoreBarTrack}>
                  <div
                    className={`${styles.animatedBar} ${barsInView ? styles.animatedBarInView : ''}`}
                    style={{
                      width: `${dim.value}%`,
                      backgroundColor: getScoreColor(dim.value),
                      transitionDelay: `${idx * 0.12}s`,
                    }}
                  />
                  {showComparison && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${displayValue}%`,
                        backgroundColor: getScoreColor(displayValue),
                        opacity: 0.3,
                        borderRadius: '3px',
                      }}
                    />
                  )}
                </div>
                <div className={styles.scoreBarValue} style={{ color: getScoreColor(dim.value) }}>{dim.value}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.radarSection} ref={radarSectionRef}>
          <RadarChart scores={dimensions} inView={radarInView} />
        </div>

        <div className={styles.strengthsSection}>
          <div>
            <div className={`${styles.strengthsTitle} ${styles.strengthsGood}`}>✓ What You Did Well</div>
            {strengths.length > 0 ? (
              <ul className={styles.strengthsList}>
                {strengths.map((s, i) => <li key={i} style={{ paddingLeft: '16px', position: 'relative' }}><span style={{ position: 'absolute', left: '0', top: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'block' }} />{s}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', color: '#57534e' }}>Keep practicing to identify strengths.</p>
            )}
          </div>
          <div>
            <div className={`${styles.strengthsTitle} ${styles.strengthsImprove}`}>↑ Areas to Improve</div>
            {improvements.length > 0 ? (
              <ul className={styles.strengthsList}>
                {improvements.map((s, i) => <li key={i} style={{ paddingLeft: '16px', position: 'relative' }}><span style={{ position: 'absolute', left: '0', top: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', display: 'block' }} />{s}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', color: '#57534e' }}>No critical areas identified. Great job!</p>
            )}
          </div>
        </div>

        <div className={styles.questionFeedbackSection}>
          <div className={styles.questionFeedbackTitle}>Question-by-Question Feedback</div>
          {reportSession.answers.map((answer, i) => {
            const question = reportSession.questions[i];
            if (!question) return null;
            return (
              <div key={answer.questionId} className={styles.questionFeedbackCard}>
                <div className={styles.questionFeedbackHeader}>
                  <div className={styles.questionNum}>Q{i + 1} — {question.type}</div>
                  <span className={`${styles.questionScoreBadge} ${getScoreClass(answer.score)}`}>{answer.score}/100</span>
                </div>
                <div className={styles.questionText}>{question.text}</div>
                <div className={styles.questionAnswer}>"{answer.answerText || 'No answer provided'}"</div>
                <div className={styles.questionFeedbackNote}>{answer.feedback}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.reportFooter}>
          <button className={`${styles.reportFooterBtn} ${styles.reportFooterBtnSecondary}`} onClick={() => router.push('/interview')}>
            <ArrowLeft size={13} style={{ display: 'inline', marginRight: '6px' }} />Browse More
          </button>
          <button className={`${styles.reportFooterBtn} ${styles.reportFooterBtnPrimary}`} onClick={() => { clearActiveSession(); router.push('/interview'); }}>
            <RotateCcw size={13} style={{ display: 'inline', marginRight: '6px' }} />Practice Again
          </button>
        </div>
      </div>
    </div>
  );
}
