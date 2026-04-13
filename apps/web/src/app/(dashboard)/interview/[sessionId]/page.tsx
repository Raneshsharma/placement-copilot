"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Send } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import styles from "../interview.module.css";

function getScoreClass(score: number): string {
  if (score >= 80) return styles.scoreHigh;
  if (score >= 60) return styles.scoreMid;
  return styles.scoreLow;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const {
    activeSession,
    currentQuestionIndex,
    answerText,
    aiStatus,
    setAnswerText,
    submitAnswer,
    endSession,
  } = useInterviewStore();

  const [showEndModal, setShowEndModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!activeSession || activeSession.id !== params.sessionId) {
      const store = useInterviewStore.getState();
      if (!store.activeSession || store.activeSession.id !== params.sessionId) {
        router.replace('/interview');
      }
    }
  }, [activeSession, params.sessionId, router]);

  useEffect(() => {
    setWordCount(answerText.trim().split(/\s+/).filter(Boolean).length);
  }, [answerText]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeSession?.transcript.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        if (answerText.trim()) submitAnswer();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answerText, submitAnswer]);

  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!activeSession) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading...
      </div>
    );
  }

  const currentQ = activeSession.questions[currentQuestionIndex];
  const totalQuestions = activeSession.questions.length;

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    submitAnswer();
    textareaRef.current?.focus();
  };

  const handleEnd = () => {
    const sessionId = activeSession?.id;
    endSession();
    if (sessionId) {
      router.push(`/interview/report/${sessionId}`);
    } else {
      router.push('/interview');
    }
  };

  return (
    <div className={styles.sessionPage}>
      {/* Header */}
      <div className={styles.sessionHeader}>
        <div className={styles.sessionContext}>
          {activeSession.company} — {activeSession.role} Interview
          <span style={{ marginLeft: '8px', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
            {activeSession.interviewType}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={styles.sessionTimer}>
            {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
          </div>
          <button
            onClick={() => setShowEndModal(true)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600 }}
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className={styles.sessionMain}>
        {/* AI Panel */}
        <div className={styles.aiPanel}>
          <div className={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>

          {currentQ && (
            <>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                {currentQ.type}
              </div>
              <div className={styles.questionText}>{currentQ.text}</div>
              {currentQ.followUpText && (
                <div className={styles.questionFollowUp}>Follow-up: {currentQ.followUpText}</div>
              )}
            </>
          )}

          <div className={styles.aiStatusIndicator}>
            <div className={`${styles.statusDot} ${
              aiStatus === 'asking' ? styles.statusAsking :
              aiStatus === 'thinking' ? styles.statusThinking :
              aiStatus === 'listening' ? styles.statusListening : ''
            }`} />
            <span>
              {aiStatus === 'asking' ? 'Question ready' :
               aiStatus === 'thinking' ? 'AI is thinking...' :
               aiStatus === 'listening' ? 'Listening...' :
               aiStatus === 'loading' ? 'Loading...' :
               'Ready for your answer'}
            </span>
          </div>
        </div>

        {/* Transcript Panel */}
        <div className={styles.transcriptPanel} ref={transcriptRef}>
          <div className={styles.transcriptPanelTitle}>Transcript</div>

          {activeSession.transcript.length === 0 ? (
            <div className={styles.transcriptEmpty}>
              Your answers will appear here as you respond...
            </div>
          ) : (
            activeSession.transcript.map((entry, i) => {
              const answer = activeSession.answers[i];
              return (
                <div key={entry.questionId} className={styles.transcriptEntry}>
                  <div className={styles.transcriptQuestion}>{entry.questionText}</div>
                  <div className={styles.transcriptAnswer}>{entry.answerText}</div>
                  <div className={styles.transcriptTimestamp}>{entry.timestamp} · {entry.wordCount} words</div>
                  {answer && (
                    <span className={`${styles.transcriptScore} ${getScoreClass(answer.score)}`}>
                      {answer.score}/100
                    </span>
                  )}
                  {i < activeSession.transcript.length - 1 && (
                    <div className={styles.transcriptDivider} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Answer bar */}
      <div className={styles.answerBar}>
        <div style={{ flex: 1 }}>
          <textarea
            ref={textareaRef}
            className={styles.answerTextarea}
            placeholder="Type your answer here... (Ctrl+Enter to submit)"
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            rows={1}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
          />
          <div className={styles.wordCount}>{wordCount} words</div>
        </div>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!answerText.trim()}
        >
          <Send size={13} /> Submit
        </button>
        <button className={styles.endBtn} onClick={() => setShowEndModal(true)}>
          <X size={13} /> End
        </button>
      </div>

      {/* End confirmation modal */}
      {showEndModal && (
        <div className={styles.endModal}>
          <div className={styles.endModalCard}>
            <div className={styles.endModalTitle}>End this interview?</div>
            <div className={styles.endModalSub}>
              You answered {activeSession.answers.length} of {totalQuestions} questions.
              Your report will be generated from your responses.
            </div>
            <div className={styles.endModalActions}>
              <button className={styles.reportBtn} onClick={handleEnd}>
                End & View Report
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                style={{ background: 'white', color: '#1c1917', border: '1.5px solid #e7e5e4', borderRadius: '10px', padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
