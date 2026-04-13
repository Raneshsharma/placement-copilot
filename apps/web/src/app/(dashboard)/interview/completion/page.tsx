"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/interview-store";
import styles from "../interview.module.css";

export default function CompletionPage() {
  const router = useRouter();
  const { activeSession, clearActiveSession } = useInterviewStore();

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'COMPLETED') {
      router.replace('/interview');
    }
  }, [activeSession, router]);

  if (!activeSession) return null;

  const handleViewReport = () => {
    router.push(`/interview/report/${activeSession.id}`);
  };

  const handleBack = () => {
    clearActiveSession();
    router.push('/interview');
  };

  const elapsed = activeSession.durationMinutes ? `${activeSession.durationMinutes} min` : '—';

  return (
    <div className={styles.completionScreen}>
      <div className={styles.completionCard}>
        <div className={styles.completionCheck}>✓</div>
        <h1 className={styles.completionTitle}>Interview Complete</h1>
        <p className={styles.completionSummary}>
          You answered {activeSession.answers.length} questions in {elapsed} for the{' '}
          <strong>{activeSession.role}</strong> position at{' '}
          <strong>{activeSession.company}</strong>. Your performance report is ready.
        </p>
        <div className={styles.completionActions}>
          <button className={styles.reportBtn} onClick={handleViewReport}>View Your Report →</button>
          <button className={styles.backLink} onClick={handleBack}>Back to Interview Catalog</button>
        </div>
      </div>
    </div>
  );
}
