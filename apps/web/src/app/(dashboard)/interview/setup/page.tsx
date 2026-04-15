"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Mic, Check, X, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import { CATEGORY_META, DIFFICULTY_META } from "@/types/interview";
import styles from "../interview.module.css";

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#D97706', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const DIFFICULTY_NOTES: Record<string, string> = {
  Beginner:    'Foundational questions at a slower pace. More time to think and structure your answers.',
  Amateur:     'Standard interview questions at typical pace. Expect follow-up clarifying questions.',
  Expert:     'Challenging questions with follow-ups and time pressure. Be ready to think on your feet.',
  'Real-life': 'Mimics the exact company format. Tight timing, no hints. This is as close to real as it gets.',
};

export default function SetupPage() {
  const router = useRouter();
  const {
    selectedEntry,
    selectedDifficulty,
    cameraPermissionGranted,
    micPermissionGranted,
    setCameraPermission,
    setMicPermission,
    selectInterview,
    startSession,
  } = useInterviewStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [step, setStep] = useState<'summary' | 'permissions'>('summary');
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (!selectedEntry) {
      router.replace('/interview');
    }
  }, [selectedEntry, router]);

  useEffect(() => {
    if (step !== 'permissions') return;

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animId: number;

    async function initMedia() {
      let mediaStream: MediaStream | null = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraPermission(true);
        setMicPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }

        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(Math.min(100, avg * 1.2));
          animId = requestAnimationFrame(updateLevel);
        }
        updateLevel();
      } catch {
        setCameraError(true);
        setCameraPermission(false);
        setMicPermission(false);
      }
    }

    initMedia();

    return () => {
      cancelAnimationFrame(animId);
      if (audioCtx) audioCtx.close();
    };
  }, [step, setCameraPermission, setMicPermission]);

  if (!selectedEntry) return null;

  const color = getCompanyColor(selectedEntry.company);
  const catMeta = CATEGORY_META[selectedEntry.category];
  const diffMeta = DIFFICULTY_META[selectedDifficulty];
  const allPermissionsOk = cameraPermissionGranted || micPermissionGranted;

  const handleBegin = () => {
    startSession();
    const activeSession = useInterviewStore.getState().activeSession;
    if (activeSession) {
      router.push(`/interview/${activeSession.id}`);
    } else {
      // No active session — create a text-only session
      router.push(`/interview`);
    }
  };

  const handleContinueWithoutCamera = () => {
    // Proceed with text-only interview (no camera/mic)
    startSession();
    const activeSession = useInterviewStore.getState().activeSession;
    if (activeSession) {
      router.push(`/interview/${activeSession.id}`);
    } else {
      router.push(`/interview`);
    }
  };
    startSession();
    const activeSession = useInterviewStore.getState().activeSession;
    if (activeSession) {
      router.push(`/interview/${activeSession.id}`);
    } else {
      router.push('/interview');
    }
  };

  return (
    <div className={styles.setupPage}>
      <div className={styles.setupCard}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div className={`${styles.setupStepNum} ${step === 'permissions' ? styles.setupStepNumDone : ''}`}>
            {step === 'permissions' ? <Check size={12} /> : '1'}
          </div>
          <span className={`${styles.setupStepLabel} ${step === 'summary' ? styles.setupStepLabelActive : ''}`}>Summary</span>
          <div className={styles.setupDivider} />
          <div className={styles.setupStepNum}>2</div>
          <span className={`${styles.setupStepLabel} ${step === 'permissions' ? styles.setupStepLabelActive : ''}`}>Prepare</span>
        </div>

        {step === 'summary' && (
          <>
            {/* Interview summary card */}
            <div className={styles.setupInterviewCard}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>
                {selectedEntry.company.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>{selectedEntry.company}</div>
                <div style={{ fontSize: '13px', color: '#57534e' }}>{selectedEntry.role}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: `${catMeta.color}20`, color: catMeta.color }}>
                    {catMeta.label}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#fafaf5', border: '1px solid #e7e5e4', color: '#57534e' }}>
                    {selectedEntry.interviewType}
                  </span>
                </div>
              </div>
            </div>

            {/* Difficulty selector */}
            {selectedEntry.difficulties.length > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a8a29e', marginBottom: '8px' }}>
                  Select Difficulty
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedEntry.difficulties.map(d => {
                    const meta = DIFFICULTY_META[d];
                    const isActive = d === selectedDifficulty;
                    return (
                      <button
                        key={d}
                        onClick={() => selectInterview(selectedEntry, d)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: `2px solid ${isActive ? '#d97706' : '#e7e5e4'}`,
                          background: isActive ? '#fffbeb' : 'white',
                          color: isActive ? '#d97706' : '#57534e',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Difficulty explanation */}
            <div className={styles.setupDifficultyNote}>
              <strong>{diffMeta.label}:</strong> {DIFFICULTY_NOTES[selectedDifficulty] ?? ''}
            </div>

            {/* Instructions */}
            <div className={styles.setupInstructions}>
              <strong>How it works:</strong>
              <ul style={{ paddingLeft: '16px', margin: '8px 0 0' }}>
                <li>The AI will ask you {selectedEntry.questionCount} questions for the {selectedEntry.role} role at {selectedEntry.company}</li>
                <li>Answer as you would in a real interview. Take your time to structure responses.</li>
                <li>Your answers are transcribed in real time for scoring.</li>
                <li>You can end the interview anytime and view your report immediately.</li>
              </ul>
            </div>

            <div className={styles.setupTrustNote}>
              <Lock size={11} />
              <span>Your camera and audio are only active during this session. Nothing is stored permanently without your consent.</span>
            </div>

            <button className={styles.beginBtn} onClick={() => setStep('permissions')}>
              Continue to Setup <ArrowRight size={14} />
            </button>
          </>
        )}

        {step === 'permissions' && (
          <>
            {/* Camera preview */}
            <div className={styles.cameraPreview}>
              {cameraPermissionGranted ? (
                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              ) : (
                <div className={styles.cameraPlaceholder}>
                  <Camera size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <div>Camera not available</div>
                </div>
              )}
            </div>

            {/* Permission checklist */}
            <div className={styles.permissionCheck}>
              {[
                { label: 'Camera access', granted: cameraPermissionGranted },
                { label: 'Microphone access', granted: micPermissionGranted },
              ].map(item => (
                <div key={item.label} className={styles.permissionItem}>
                  {item.granted ? (
                    <Check size={14} className={`${styles.permissionIcon} ${styles.permissionGranted}`} />
                  ) : (
                    <X size={14} className={`${styles.permissionIcon} ${styles.permissionDenied}`} />
                  )}
                  <span style={{ color: item.granted ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                    {item.granted ? '✓' : '✗'}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
              {/* Mic meter */}
              <div style={{ marginLeft: '22px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', color: '#57534e', marginBottom: '4px' }}>Microphone level</div>
                <div className={styles.micMeter}>
                  <div className={styles.micMeterFill} style={{ width: `${micLevel}%` }} />
                </div>
              </div>
            </div>

            {/* Permission errors */}
            {!cameraPermissionGranted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>
                <AlertCircle size={14} />
                <span>Camera access is needed for the full experience. Enable in browser settings.</span>
              </div>
            )}

            <div className={styles.setupTrustNote}>
              <Lock size={11} />
              <span>Your camera and audio are only active during this session. Transcripts are generated in real time and used only to score your performance.</span>
            </div>

            <div className={styles.setupActions}>
              <button
                className={styles.beginBtn}
                onClick={handleBegin}
                disabled={!allPermissionsOk}
              >
                <Camera size={14} /> Begin Interview
              </button>
              <button className={styles.skipBtn} onClick={handleContinueWithoutCamera}>
                Continue without camera
              </button>
              <button
                onClick={() => setStep('summary')}
                style={{ background: 'none', border: 'none', fontSize: '12px', color: '#a8a29e', cursor: 'pointer', marginTop: '8px' }}
              >
                ← Back to summary
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
