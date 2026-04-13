import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InterviewSession,
  Question,
  Answer,
  TranscriptEntry,
  DimensionScores,
  CatalogEntry,
  Difficulty,
  SessionStatus,
} from '@/types/interview';
import { getMockQuestions, getMockFollowUp } from '@/data/mock-questions';
import { INTERVIEW_CATALOG } from '@/data/interview-catalog';

interface InterviewState {
  // Session history (persisted)
  sessions: InterviewSession[];
  // Active session
  activeSession: InterviewSession | null;
  // Current state within a session
  currentQuestionIndex: number;
  answerText: string;
  aiStatus: 'idle' | 'asking' | 'thinking' | 'listening' | 'loading';
  // Camera/mic state
  cameraEnabled: boolean;
  micEnabled: boolean;
  cameraPermissionGranted: boolean;
  micPermissionGranted: boolean;
  // Setup state
  selectedEntry: CatalogEntry | null;
  selectedDifficulty: Difficulty;
  // Actions
  selectInterview: (entry: CatalogEntry, difficulty: Difficulty) => void;
  startSession: () => void;
  setAnswerText: (text: string) => void;
  submitAnswer: () => void;
  setAiStatus: (status: InterviewState['aiStatus']) => void;
  endSession: () => void;
  setCameraPermission: (granted: boolean) => void;
  setMicPermission: (granted: boolean) => void;
  setCameraEnabled: (on: boolean) => void;
  setMicEnabled: (on: boolean) => void;
  clearActiveSession: () => void;
  // Computed
  getReportData: () => InterviewSession | null;
}

// ── Mock scoring helpers ──────────────────────────────────────────────────────

const MOCK_SCORE_RANGE = { min: 65, max: 92 };

function mockScore(): number {
  return Math.floor(Math.random() * (MOCK_SCORE_RANGE.max - MOCK_SCORE_RANGE.min + 1)) + MOCK_SCORE_RANGE.min;
}

function mockDimensionScores(overall: number): DimensionScores {
  return {
    communication: Math.min(100, overall + Math.floor(Math.random() * 15)),
    structure: Math.min(100, overall - 5 + Math.floor(Math.random() * 15)),
    specificity: Math.min(100, overall + Math.floor(Math.random() * 10)),
    confidence: Math.min(100, Math.max(40, overall - 8 + Math.floor(Math.random() * 15))),
    roleFit: Math.min(100, overall + Math.floor(Math.random() * 12)),
  };
}

function computeOverall(dimensions: DimensionScores): number {
  const vals = Object.values(dimensions);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      currentQuestionIndex: 0,
      answerText: '',
      aiStatus: 'idle',
      cameraEnabled: false,
      micEnabled: false,
      cameraPermissionGranted: false,
      micPermissionGranted: false,
      selectedEntry: null,
      selectedDifficulty: 'Amateur' as Difficulty,

      selectInterview: (entry, difficulty) =>
        set({ selectedEntry: entry, selectedDifficulty: difficulty }),

      startSession: () => {
        const { selectedEntry, selectedDifficulty, sessions } = get();
        if (!selectedEntry) return;

        const questions = getMockQuestions(selectedEntry.interviewType, selectedEntry.questionCount);
        const session: InterviewSession = {
          id: `session-${Date.now()}`,
          catalogEntryId: selectedEntry.id,
          company: selectedEntry.company,
          role: selectedEntry.role,
          category: selectedEntry.category,
          difficulty: selectedDifficulty,
          interviewType: selectedEntry.interviewType,
          status: 'ACTIVE',
          startedAt: new Date().toISOString(),
          questions,
          answers: [],
          transcript: [],
        };

        set({
          activeSession: session,
          currentQuestionIndex: 0,
          answerText: '',
          aiStatus: 'asking',
          sessions: [...sessions, session],
        });
      },

      setAnswerText: (text) => set({ answerText: text }),

      setAiStatus: (status) => set({ aiStatus: status }),

      submitAnswer: () => {
        const { activeSession, currentQuestionIndex, answerText } = get();
        if (!activeSession) return;

        const question = activeSession.questions[currentQuestionIndex];
        const answerTextTrimmed = answerText.trim();
        const wordCount = answerTextTrimmed ? answerTextTrimmed.split(/\s+/).length : 0;
        const score = mockScore();

        // Mock feedback
        const feedback = score >= 85
          ? 'Strong answer. Good structure with a clear outcome.'
          : score >= 70
          ? 'Good attempt. Consider adding more specific metrics to your examples.'
          : 'Needs improvement. Try using the STAR method with more concrete results.';

        const entry: TranscriptEntry = {
          questionId: question.id,
          questionText: question.text,
          answerText: answerTextTrimmed || 'No answer provided',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          wordCount,
        };

        const answer: Answer = {
          questionId: question.id,
          answerText: answerTextTrimmed,
          score,
          feedback,
          isRecorded: !!answerTextTrimmed,
          answeredAt: new Date().toISOString(),
        };

        const updatedSession = {
          ...activeSession,
          answers: [...activeSession.answers, answer],
          transcript: [...activeSession.transcript, entry],
        };

        const hasMore = currentQuestionIndex < activeSession.questions.length - 1;

        if (hasMore) {
          // Check for follow-up
          const followUp = getMockFollowUp(answerTextTrimmed);
          const nextQuestions = followUp && currentQuestionIndex < activeSession.questions.length - 2
            ? [...activeSession.questions.slice(0, currentQuestionIndex + 1),
                { ...activeSession.questions[currentQuestionIndex + 1], followUpText: followUp, id: `${activeSession.questions[currentQuestionIndex + 1].id}-followup` },
                ...activeSession.questions.slice(currentQuestionIndex + 2)]
            : activeSession.questions;

          set({
            activeSession: { ...updatedSession, questions: nextQuestions },
            currentQuestionIndex: currentQuestionIndex + 1,
            answerText: '',
            aiStatus: 'asking',
          });
        } else {
          // End of interview
          const overall = mockScore();
          const dimensions = mockDimensionScores(overall);
          const final = computeOverall(dimensions);
          set({
            activeSession: {
              ...updatedSession,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
              overallScore: final,
              dimensionScores: dimensions,
              durationMinutes: Math.round(
                (Date.now() - new Date(activeSession.startedAt).getTime()) / 60000
              ),
            },
            aiStatus: 'idle',
          });
        }
      },

      endSession: () => {
        const { activeSession } = get();
        if (!activeSession) return;

        const overall = mockScore();
        const dimensions = mockDimensionScores(overall);
        const final = computeOverall(dimensions);

        set({
          activeSession: {
            ...activeSession,
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
            overallScore: final,
            dimensionScores: dimensions,
            durationMinutes: Math.round(
              (Date.now() - new Date(activeSession.startedAt).getTime()) / 60000
            ),
          },
          aiStatus: 'idle',
        });
      },

      setCameraPermission: (granted) => set({ cameraPermissionGranted: granted }),
      setMicPermission: (granted) => set({ micPermissionGranted: granted }),
      setCameraEnabled: (on) => set({ cameraEnabled: on }),
      setMicEnabled: (on) => set({ micEnabled: on }),

      clearActiveSession: () =>
        set({
          activeSession: null,
          currentQuestionIndex: 0,
          answerText: '',
          aiStatus: 'idle',
          selectedEntry: null,
        }),

      getReportData: () => get().activeSession,
    }),
    {
      name: 'interview-storage',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
