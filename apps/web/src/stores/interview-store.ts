import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InterviewPhase = "ready" | "question" | "answering" | "review" | "complete";

export interface Answer {
  questionId: string;
  text: string;
  score?: number;
  feedback?: string;
  answeredAt: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
}

export interface InterviewSession {
  id: string;
  type: string;
  questions: InterviewQuestion[];
  startedAt: string;
  endedAt?: string;
}

interface InterviewState {
  sessions: InterviewSession[];
  activeSession: InterviewSession | null;
  currentPhase: InterviewPhase;
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  timeRemaining: number;
  startSession: (session: InterviewSession) => void;
  setPhase: (phase: InterviewPhase) => void;
  nextQuestion: () => void;
  saveAnswer: (questionId: string, text: string, feedback?: string, score?: number) => void;
  setTimeRemaining: (seconds: number) => void;
  clearSession: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      currentPhase: "ready",
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 120,
      startSession: (session) =>
        set({
          activeSession: session,
          currentPhase: "question",
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 120,
        }),
      setPhase: (phase) => set({ currentPhase: phase }),
      nextQuestion: () => {
        const { currentQuestionIndex, activeSession } = get();
        const totalQuestions = activeSession?.questions.length ?? 0;
        if (currentQuestionIndex < totalQuestions - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
          set({ currentPhase: "complete" });
        }
      },
      saveAnswer: (questionId, text, feedback, score) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              text,
              score,
              feedback,
              answeredAt: new Date().toISOString(),
            },
          },
        })),
      setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),
      clearSession: () =>
        set({
          activeSession: null,
          currentPhase: "ready",
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 120,
        }),
    }),
    {
      name: "interview-storage",
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
);
