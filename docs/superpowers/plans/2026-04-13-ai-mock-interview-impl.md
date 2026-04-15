# AI Mock Interview — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete AI-powered mock interview product: landing catalog page, setup flow with camera/mic checks, live split-panel interview session with real-time transcript, completion screen, and detailed performance report. All Phase 1 — mock data, simulated AI questions, client-side scoring.

**Architecture:** Next.js App Router with Zustand store. Phase 1 uses hardcoded mock question pools per company-role, client-side mock scoring, and simulated AI behavior. CSS Modules for component isolation, Tailwind for layout utilities. The new pages replace the existing `/interview` and `/interview/[sessionId]` routes entirely.

**Tech Stack:** Next.js, Tailwind CSS, Zustand, Lucide React, Framer Motion, CSS Modules, `@hello-pangea/dnd` (not used here but already installed), `recharts` for radar chart.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `apps/web/src/types/interview.ts` | All TypeScript types for the interview product |
| `apps/web/src/data/interview-catalog.ts` | Curated 25-entry company-role catalog config |
| `apps/web/src/data/mock-questions.ts` | Mock question pools keyed by company-role category |
| `apps/web/src/stores/interview-store.ts` | Enhanced Zustand store (replace existing) |
| `apps/web/src/app/(dashboard)/interview/interview.module.css` | CSS Module for interview pages |
| `apps/web/src/app/(dashboard)/interview/page.tsx` | New landing page (catalog + filters + featured + recent) |
| `apps/web/src/app/(dashboard)/interview/setup/page.tsx` | Setup flow (summary + permission checks) |
| `apps/web/src/app/(dashboard)/interview/session/[id]/page.tsx` | Live interview session (replaces existing) |
| `apps/web/src/app/(dashboard)/interview/report/[id]/page.tsx` | Performance report page |
| `apps/web/src/components/interview/interview-card.tsx` | Catalog card component |
| `apps/web/src/components/interview/category-filter.tsx` | Filter chips + search bar |
| `apps/web/src/components/interview/permission-check.tsx` | Camera preview + mic meter + checklist |
| `apps/web/src/components/interview/ai-question-panel.tsx` | Left panel: question display + AI state indicator |
| `apps/web/src/components/interview/transcript-panel.tsx` | Right panel: Q&A transcript log |
| `apps/web/src/components/interview/answer-input.tsx` | Bottom bar: textarea + submit/end buttons |
| `apps/web/src/components/interview/interview-completion.tsx` | Completion screen |
| `apps/web/src/components/interview/score-breakdown.tsx` | Horizontal bar chart for 5 dimensions |
| `apps/web/src/components/interview/radar-chart.tsx` | 5-axis radar chart (CSS/SVG) |
| `apps/web/src/components/interview/question-feedback.tsx` | Q&A feedback card for report |

---

## Task 1: TypeScript Types + Catalog Data

**Files:**
- Create: `apps/web/src/types/interview.ts`
- Create: `apps/web/src/data/interview-catalog.ts`
- Create: `apps/web/src/data/mock-questions.ts`
- Modify: `apps/web/src/types/index.ts` (add re-export)

### Step 1: Write type definitions

Create `apps/web/src/types/interview.ts`:

```typescript
export type Category = 'Consulting' | 'Finance' | 'Tech' | 'Sales' | 'Operations' | 'HR';
export type Difficulty = 'Beginner' | 'Amateur' | 'Expert' | 'Real-life';
export type InterviewType = 'Behavioral' | 'Technical' | 'Case Study' | 'Mixed';
export type SessionStatus = 'SETUP' | 'ACTIVE' | 'COMPLETED' | 'INTERRUPTED';

export interface CatalogEntry {
  id: string;
  company: string;
  role: string;
  category: Category;
  difficulties: Difficulty[];
  interviewType: InterviewType;
  questionCount: number;
  durationMinutes: number;
  featured?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: InterviewType;
  difficulty: Difficulty;
  followUpText?: string;
}

export interface Answer {
  questionId: string;
  answerText: string;
  score: number;
  feedback: string;
  isRecorded: boolean;
  answeredAt: string;
}

export interface TranscriptEntry {
  questionId: string;
  questionText: string;
  answerText: string;
  timestamp: string;
  wordCount: number;
}

export interface DimensionScores {
  communication: number;
  structure: number;
  specificity: number;
  confidence: number;
  roleFit: number;
}

export interface InterviewSession {
  id: string;
  catalogEntryId: string;
  company: string;
  role: string;
  category: Category;
  difficulty: Difficulty;
  interviewType: InterviewType;
  status: SessionStatus;
  startedAt: string;
  completedAt?: string;
  questions: Question[];
  answers: Answer[];
  transcript: TranscriptEntry[];
  overallScore?: number;
  dimensionScores?: DimensionScores;
  durationMinutes?: number;
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  Beginner:   { label: 'Beginner',   color: '#22C55E' },
  Amateur:    { label: 'Amateur',    color: '#F59E0B' },
  Expert:     { label: 'Expert',    color: '#EF4444' },
  'Real-life': { label: 'Real-life', color: '#7C6BB2' },
};

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  Consulting: { label: 'Consulting', color: '#7C6BB2' },
  Finance:    { label: 'Finance',   color: '#0D7377' },
  Tech:       { label: 'Tech',      color: '#0D7377' },
  Sales:      { label: 'Sales',     color: '#D97706' },
  Operations: { label: 'Operations', color: '#D97706' },
  HR:         { label: 'HR',         color: '#D97706' },
};
```

### Step 2: Write the catalog data

Create `apps/web/src/data/interview-catalog.ts`:

```typescript
import type { CatalogEntry } from '@/types/interview';

export const INTERVIEW_CATALOG: CatalogEntry[] = [
  {
    id: 'bcg-ba',
    company: 'Boston Consulting Group',
    role: 'Business Analyst',
    category: 'Consulting',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Case Study',
    questionCount: 5,
    durationMinutes: 35,
    featured: true,
  },
  {
    id: 'mckinsey-ba',
    company: 'McKinsey & Company',
    role: 'Business Analyst',
    category: 'Consulting',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Case Study',
    questionCount: 5,
    durationMinutes: 35,
    featured: true,
  },
  {
    id: 'bain-mc',
    company: 'Bain & Company',
    role: 'Management Consultant',
    category: 'Consulting',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Case Study',
    questionCount: 5,
    durationMinutes: 40,
    featured: true,
  },
  {
    id: 'deloitte-ba',
    company: 'Deloitte',
    role: 'Business Analyst',
    category: 'Consulting',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'gs-fa',
    company: 'Goldman Sachs',
    role: 'Financial Analyst',
    category: 'Finance',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 30,
    featured: true,
  },
  {
    id: 'jpm-crm',
    company: 'JPMorgan Chase',
    role: 'Credit Risk Manager',
    category: 'Finance',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'morgan-fa',
    company: 'Morgan Stanley',
    role: 'Financial Analyst',
    category: 'Finance',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 30,
  },
  {
    id: 'hsbc-crm',
    company: 'HSBC',
    role: 'Credit Risk Manager',
    category: 'Finance',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'amazon-pm',
    company: 'Amazon',
    role: 'Product Manager',
    category: 'Tech',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Mixed',
    questionCount: 5,
    durationMinutes: 30,
    featured: true,
  },
  {
    id: 'google-dms',
    company: 'Google',
    role: 'Digital Marketing Specialist',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 25,
  },
  {
    id: 'microsoft-pm',
    company: 'Microsoft',
    role: 'Project Manager',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'amazon-bm',
    company: 'Amazon',
    role: 'Brand Manager',
    category: 'Sales',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'pg-bm',
    company: 'Procter & Gamble',
    role: 'Brand Manager',
    category: 'Sales',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'unilever-bm',
    company: 'Unilever',
    role: 'Brand Manager',
    category: 'Sales',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'loreal-bm',
    company: "L'Oreal",
    role: 'Brand Manager',
    category: 'Sales',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'itc-sales',
    company: 'ITC',
    role: 'Sales (BDE)',
    category: 'Sales',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'accenture-ba',
    company: 'Accenture',
    role: 'Business Analyst',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 25,
  },
  {
    id: 'accenture-pm',
    company: 'Accenture',
    role: 'Project Manager',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'deloitte-pm',
    company: 'Deloitte',
    role: 'Project Manager',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'ey-sa',
    company: 'EY',
    role: 'Strategy Analyst',
    category: 'Consulting',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Case Study',
    questionCount: 5,
    durationMinutes: 35,
  },
  {
    id: 'hdfc-mt',
    company: 'HDFC Bank',
    role: 'Management Trainee',
    category: 'Finance',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'infosys-hr',
    company: 'Infosys',
    role: 'HR Executive',
    category: 'HR',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Behavioral',
    questionCount: 5,
    durationMinutes: 20,
  },
  {
    id: 'flipkart-la',
    company: 'Flipkart',
    role: 'Logistics Analyst',
    category: 'Operations',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 25,
  },
  {
    id: 'zomato-pa',
    company: 'Zomato',
    role: 'Product Analyst',
    category: 'Tech',
    difficulties: ['Beginner', 'Amateur', 'Expert'],
    interviewType: 'Technical',
    questionCount: 4,
    durationMinutes: 25,
  },
  {
    id: 'razorpay-apm',
    company: 'Razorpay',
    role: 'Associate Product Manager',
    category: 'Tech',
    difficulties: ['Amateur', 'Expert', 'Real-life'],
    interviewType: 'Mixed',
    questionCount: 5,
    durationMinutes: 30,
  },
];
```

### Step 3: Write mock question pools

Create `apps/web/src/data/mock-questions.ts`:

```typescript
import type { Question, InterviewType } from '@/types/interview';

const BEHAVIORAL_QUESTIONS: Question[] = [
  { id: 'b1', text: 'Tell me about a time you had to manage a tight deadline. What was your approach?', type: 'Behavioral', difficulty: 'Beginner' },
  { id: 'b2', text: 'Describe a situation where you had a conflict with a teammate. How did you resolve it?', type: 'Behavioral', difficulty: 'Amateur' },
  { id: 'b3', text: 'Give an example of when you went above and beyond for a stakeholder.', type: 'Behavioral', difficulty: 'Amateur' },
  { id: 'b4', text: 'Tell me about a time you received critical feedback. How did you respond and improve?', type: 'Behavioral', difficulty: 'Expert' },
  { id: 'b5', text: 'Describe a project where you had to learn something new quickly under pressure. How did you manage it?', type: 'Behavioral', difficulty: 'Expert' },
];

const TECHNICAL_QUESTIONS: Question[] = [
  { id: 't1', text: 'How would you design a URL shortening service like Bitly? What data structures would you use?', type: 'Technical', difficulty: 'Beginner' },
  { id: 't2', text: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?', type: 'Technical', difficulty: 'Amateur' },
  { id: 't3', text: 'Walk me through how you would scale a chat application to support 10 million concurrent users.', type: 'Technical', difficulty: 'Expert' },
  { id: 't4', text: 'Describe your approach to debugging a production issue at 2am. What steps would you take first?', type: 'Technical', difficulty: 'Expert' },
];

const CASE_STUDY_QUESTIONS: Question[] = [
  { id: 'cs1', text: 'A restaurant chain is seeing declining profits over the last 3 quarters. How would you diagnose the root cause?', type: 'Case Study', difficulty: 'Amateur' },
  { id: 'cs2', text: 'A retail company is considering entering a new market. What factors would you analyze before making a recommendation?', type: 'Case Study', difficulty: 'Amateur' },
  { id: 'cs3', text: 'An e-commerce platform sees high cart abandonment. What hypotheses do you have and how would you test them?', type: 'Case Study', difficulty: 'Expert' },
  { id: 'cs4', text: 'A telecom operator wants to reduce customer churn by 20%. Propose a data-driven strategy.', type: 'Case Study', difficulty: 'Expert' },
  { id: 'cs5', text: 'A manufacturing company has excess inventory. How would you optimize the supply chain?', type: 'Case Study', difficulty: 'Real-life' },
];

const MIXED_QUESTIONS: Question[] = [
  { id: 'm1', text: 'Tell me about a complex technical problem you solved. What was the problem and what was your solution?', type: 'Mixed', difficulty: 'Beginner' },
  { id: 'm2', text: 'If you had to rewrite one system from your past experience, what would it be and why?', type: 'Mixed', difficulty: 'Amateur' },
  { id: 'm3', text: 'Describe a time your technical solution was challenged by a non-technical stakeholder. How did you handle it?', type: 'Mixed', difficulty: 'Expert' },
  { id: 'm4', text: 'How do you balance technical debt vs. feature delivery pressure in a product roadmap?', type: 'Mixed', difficulty: 'Expert' },
  { id: 'm5', text: 'Walk me through how you would scope and estimate a new feature from idea to launch.', type: 'Mixed', difficulty: 'Real-life' },
];

export function getMockQuestions(type: InterviewType, count: number): Question[] {
  let pool: Question[];
  switch (type) {
    case 'Behavioral': pool = BEHAVIORAL_QUESTIONS; break;
    case 'Technical': pool = TECHNICAL_QUESTIONS; break;
    case 'Case Study': pool = CASE_STUDY_QUESTIONS; break;
    case 'Mixed': pool = MIXED_QUESTIONS; break;
    default: pool = BEHAVIORAL_QUESTIONS;
  }
  // Shuffle and take requested count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `${q.id}-${Date.now()}-${i}` }));
}

export function getMockFollowUp(answerText: string): string | null {
  if (answerText.length < 30) return 'Could you add more detail? Specifically, what was the outcome or measurable impact?';
  if (!answerText.includes('I ') && !answerText.includes('we ')) return 'Can you walk me through the specific actions you took in that situation?';
  return null;
}
```

### Step 4: Update types index

Read `apps/web/src/types/index.ts` (already has `export * from './application'`). Add:
```typescript
export * from './interview';
```

### Step 5: Commit

```bash
git add apps/web/src/types/interview.ts apps/web/src/data/interview-catalog.ts apps/web/src/data/mock-questions.ts apps/web/src/types/index.ts
git commit -m "feat(interview): add TypeScript types, catalog data, and mock question pools"
```

---

## Task 2: Enhanced Zustand Store

**Files:**
- Modify: `apps/web/src/stores/interview-store.ts` (replace existing store entirely)
- Modify: `apps/web/src/stores/index.ts` (add re-export)

### Step 1: Write the enhanced store

Replace the contents of `apps/web/src/stores/interview-store.ts` with:

```typescript
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
  // Session history
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
      selectedDifficulty: 'Amateur',

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
        const { activeSession, currentQuestionIndex, answerText, aiStatus } = get();
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
```

### Step 2: Commit

```bash
git add apps/web/src/stores/interview-store.ts
git commit -m "feat(interview): replace with enhanced Zustand store for mock interview session"
```

---

## Task 3: CSS Module — Interview Pages

**Files:**
- Create: `apps/web/src/app/(dashboard)/interview/interview.module.css`

### Step 1: Write the CSS module

Create `apps/web/src/app/(dashboard)/interview/interview.module.css` (~450 lines):

```css
/* ═══════════════════════════════════════
   AI MOCK INTERVIEW — CSS MODULE
   ═══════════════════════════════════════ */

/* ── Landing page ── */
.page {
  background: var(--warm-bg, #fafaf5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Hero strip */
.heroStrip {
  padding: 32px 28px 20px;
  background: white;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
}
.heroTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 6px;
}
.heroSub {
  font-size: 14px;
  color: var(--warm-text-secondary, #57534e);
  margin: 0 0 20px;
}

/* Filter bar */
.filterBar {
  padding: 12px 28px;
  background: white;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.categoryChip {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid var(--warm-border, #e7e5e4);
  font-size: 12px;
  font-weight: 600;
  background: white;
  color: var(--warm-text-secondary, #57534e);
  cursor: pointer;
  transition: all 0.15s;
}
.categoryChip:hover { border-color: var(--warm-primary, #d97706); color: var(--warm-primary, #d97706); }
.categoryChipActive {
  background: var(--warm-primary, #d97706);
  border-color: var(--warm-primary, #d97706);
  color: white;
}
.filterSearch {
  flex: 1;
  min-width: 180px;
  padding: 6px 12px;
  border: 1.5px solid var(--warm-border, #e7e5e4);
  border-radius: 8px;
  font-size: 13px;
  background: white;
  outline: none;
  transition: border-color 0.15s;
}
.filterSearch:focus { border-color: var(--warm-primary, #d97706); }
.filterSearch::placeholder { color: var(--warm-text-muted, #a8a29e); }

/* Catalog grid */
.catalogGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px 28px;
}
@media (max-width: 1024px) { .catalogGrid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .catalogGrid { grid-template-columns: 1fr; } }

/* Interview card */
.interviewCard {
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
}
.interviewCard:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  border-color: var(--warm-primary, #d97706);
  transform: translateY(-1px);
}
.interviewCardFeatured {
  border: 2px solid var(--warm-primary, #d97706);
  background: #fffbeb;
}
.cardHeader {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.cardCompanyLogo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.cardTitleGroup { flex: 1; }
.cardCompany { font-size: 13px; font-weight: 700; color: var(--warm-text-primary, #1c1917); }
.cardRole { font-size: 12px; color: var(--warm-text-secondary, #57534e); margin-top: 1px; }

.cardBadges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}
.cardBadge {
  display: inline-flex;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.badgeTypeBehavioral { background: rgba(124,107,178,0.1); color: #7c6bb2; }
.badgeTypeTechnical  { background: rgba(13,115,119,0.1);  color: #0d7377; }
.badgeTypeCaseStudy  { background: rgba(217,119,6,0.1);   color: #d97706; }
.badgeTypeMixed      { background: rgba(217,119,6,0.1);   color: #d97706; }
.badgeDifficulty {
  background: var(--warm-bg, #fafaf5);
  color: var(--warm-text-secondary, #57534e);
  border: 1px solid var(--warm-border, #e7e5e4);
}
.badgeCategory {
  background: var(--warm-bg, #fafaf5);
  color: var(--warm-text-muted, #a8a29e);
  border: 1px solid var(--warm-border, #e7e5e4);
}

.cardMeta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--warm-text-muted, #a8a29e);
}
.cardStartBtn {
  width: 100%;
  margin-top: 12px;
  padding: 7px;
  border-radius: 8px;
  background: var(--warm-text-primary, #1c1917);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.cardStartBtn:hover { background: var(--warm-primary, #d97706); }

/* Recent sessions */
.recentSection {
  padding: 0 28px 20px;
}
.recentTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.recentScroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.recentScroll::-webkit-scrollbar { height: 4px; }
.recentScroll::-webkit-scrollbar-track { background: transparent; }
.recentScroll::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 2px; }
.recentCard {
  flex-shrink: 0;
  width: 200px;
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.recentCard:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.06); border-color: var(--warm-primary, #d97706); }
.recentCardCompany { font-size: 12px; font-weight: 700; color: var(--warm-text-primary, #1c1917); }
.recentCardRole { font-size: 11px; color: var(--warm-text-secondary, #57534e); margin-top: 2px; }
.recentCardScore {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
}
.scoreGreen { color: #22c55e; }
.scoreAmber { color: #f59e0b; }
.scoreRed   { color: #ef4444; }

/* Empty state */
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
}
.emptyIcon { font-size: 48px; margin-bottom: 16px; }
.emptyTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 8px;
}
.emptySub { font-size: 14px; color: var(--warm-text-secondary, #57534e); margin: 0 0 24px; }

/* ── Setup page ── */
.setupPage {
  min-height: 100vh;
  background: var(--warm-bg, #fafaf5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.setupCard {
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 16px;
  padding: 32px;
  max-width: 560px;
  width: 100%;
}
.setupStep {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.setupStepNum {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--warm-primary, #d97706);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.setupStepNumDone {
  background: #22c55e;
}
.setupStepLabel {
  font-size: 13px;
  font-weight: 600;
  color: var(--warm-text-secondary, #57534e);
}
.setupStepLabelActive {
  color: var(--warm-text-primary, #1c1917);
  font-weight: 700;
}
.setupDivider {
  flex: 1;
  height: 1px;
  background: var(--warm-border, #e7e5e4);
  margin-bottom: 24px;
}
.setupInterviewCard {
  background: var(--warm-bg, #fafaf5);
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.setupDifficultyNote {
  font-size: 11px;
  color: var(--warm-text-secondary, #57534e);
  line-height: 1.5;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
}
.setupInstructions {
  font-size: 12px;
  color: var(--warm-text-secondary, #57534e);
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 12px;
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 8px;
}
.setupInstructions li { margin-bottom: 4px; }

/* Permission checks */
.permissionCheck { margin-bottom: 16px; }
.permissionItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 12px;
}
.permissionIcon { width: 16px; height: 16px; }
.permissionGranted { color: #22c55e; }
.permissionDenied { color: #ef4444; }
.permissionPending { color: var(--warm-text-muted, #a8a29e); }

.cameraPreview {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: #1c1917;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  margin-bottom: 16px;
  overflow: hidden;
}
.cameraPreview video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
.cameraPlaceholder { color: rgba(255,255,255,0.5); }

.micMeter {
  height: 4px;
  background: var(--warm-border, #e7e5e4);
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
}
.micMeterFill {
  height: 100%;
  background: var(--warm-primary, #d97706);
  border-radius: 2px;
  transition: width 0.1s;
}

.setupTrustNote {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
  color: var(--warm-text-muted, #a8a29e);
  line-height: 1.5;
  margin: 16px 0;
}
.setupTrustNote svg { flex-shrink: 0; margin-top: 1px; }

.setupActions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}
.beginBtn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: var(--warm-text-primary, #1c1917);
  color: white;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, transform 0.1s;
}
.beginBtn:hover { background: #333; transform: translateY(-1px); }
.beginBtn:disabled { background: #d4d4d4; cursor: not-allowed; transform: none; }
.skipBtn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: white;
  color: var(--warm-text-secondary, #57534e);
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid var(--warm-border, #e7e5e4);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.skipBtn:hover { border-color: var(--warm-primary, #d97706); background: #fffbeb; }

/* ── Live session ── */
.sessionPage {
  min-height: 100vh;
  background: #1c1917;
  display: flex;
  flex-direction: column;
}
.sessionHeader {
  padding: 12px 20px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sessionContext {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}
.sessionTimer {
  font-size: 14px;
  font-weight: 700;
  color: white;
  font-family: var(--font-display, sans-serif);
}
.sessionMain {
  flex: 1;
  display: flex;
  gap: 0;
  overflow: hidden;
}
.aiPanel {
  flex: 0 0 65%;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.questionCounter {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 16px;
}
.questionText {
  font-family: var(--font-display, sans-serif);
  font-size: 22px;
  font-weight: 600;
  color: white;
  text-align: center;
  line-height: 1.5;
  max-width: 600px;
}
.questionFollowUp {
  margin-top: 16px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  font-style: italic;
}
.aiStatusIndicator {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}
.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.statusAsking { background: #22c55e; animation: pulse 1.5s infinite; }
.statusThinking { background: #f59e0b; animation: spin 1s linear infinite; }
.statusListening { background: #0ea5e9; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes spin { to { transform: rotate(360deg); } }

.transcriptPanel {
  flex: 0 0 35%;
  background: rgba(255,255,255,0.03);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.transcriptPanelTitle {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.03);
  padding-bottom: 4px;
}
.transcriptEntry { }
.transcriptQuestion {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  line-height: 1.4;
  margin-bottom: 6px;
}
.transcriptAnswer {
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  padding: 8px 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  border-left: 2px solid rgba(255,255,255,0.15);
}
.transcriptTimestamp {
  font-size: 9px;
  color: rgba(255,255,255,0.25);
  margin-top: 4px;
}
.transcriptScore {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 4px;
}
.scoreHigh { background: rgba(34,197,94,0.2); color: #22c55e; }
.scoreMid  { background: rgba(245,158,11,0.2); color: #f59e0b; }
.scoreLow  { background: rgba(239,68,68,0.2); color: #ef4444; }
.transcriptDivider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
.transcriptEmpty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(255,255,255,0.2);
}

/* Bottom answer bar */
.answerBar {
  padding: 16px 20px;
  background: rgba(255,255,255,0.04);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.answerTextarea {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: white;
  font-size: 13px;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}
.answerTextarea:focus { border-color: rgba(255,255,255,0.3); }
.answerTextarea::placeholder { color: rgba(255,255,255,0.3); }
.wordCount {
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  text-align: right;
  margin-top: 4px;
  pointer-events: none;
}
.submitBtn {
  padding: 10px 20px;
  border-radius: 10px;
  background: var(--warm-primary, #d97706);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}
.submitBtn:hover { background: #b45309; transform: translateY(-1px); }
.submitBtn:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); cursor: not-allowed; transform: none; }
.endBtn {
  padding: 10px 16px;
  border-radius: 10px;
  background: transparent;
  color: rgba(255,255,255,0.4);
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid rgba(255,255,255,0.12);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
.endBtn:hover { border-color: rgba(239,68,68,0.5); color: #ef4444; }

/* End confirm modal */
.endModal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.endModalCard {
  background: white;
  border-radius: 16px;
  padding: 28px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.endModalTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 12px;
}
.endModalSub {
  font-size: 13px;
  color: var(--warm-text-secondary, #57534e);
  line-height: 1.6;
  margin: 0 0 24px;
}
.endModalActions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Completion screen ── */
.completionScreen {
  min-height: 100vh;
  background: var(--warm-bg, #fafaf5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.completionCard {
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 20px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}
.completionCheck {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
  animation: checkIn 0.5s ease;
}
@keyframes checkIn { from { transform: scale(0); } to { transform: scale(1); } }
.completionTitle {
  font-family: var(--font-display, sans-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 12px;
}
.completionSummary {
  font-size: 14px;
  color: var(--warm-text-secondary, #57534e);
  margin: 0 0 28px;
  line-height: 1.6;
}
.completionActions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.reportBtn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: var(--warm-text-primary, #1c1917);
  color: white;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.reportBtn:hover { background: var(--warm-primary, #d97706); }
.backLink {
  font-size: 13px;
  color: var(--warm-text-secondary, #57534e);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}
.backLink:hover { color: var(--warm-primary, #d97706); }

/* ── Report page ── */
.reportPage {
  min-height: 100vh;
  background: var(--warm-bg, #fafaf5);
  padding: 32px 28px;
}
.reportCard {
  max-width: 780px;
  margin: 0 auto;
  background: white;
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 16px;
  overflow: hidden;
}
.reportHeader {
  padding: 24px 28px;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.reportHeaderLeft {}
.reportCompany {
  font-family: var(--font-display, sans-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--warm-text-primary, #1c1917);
  margin: 0 0 4px;
}
.reportMeta {
  font-size: 12px;
  color: var(--warm-text-muted, #a8a29e);
}
.reportScore {
  font-family: var(--font-display, sans-serif);
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}
.reportScoreLabel { font-size: 11px; color: var(--warm-text-muted, #a8a29e); margin-top: 4px; text-align: right; }

/* Score breakdown */
.scoreSection {
  padding: 24px 28px;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
}
.scoreSectionTitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--warm-text-muted, #a8a29e);
  margin-bottom: 16px;
}
.scoreBarRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.scoreBarLabel {
  font-size: 12px;
  font-weight: 600;
  color: var(--warm-text-secondary, #57534e);
  width: 120px;
  flex-shrink: 0;
}
.scoreBarTrack {
  flex: 1;
  height: 6px;
  background: var(--warm-border, #e7e5e4);
  border-radius: 3px;
  overflow: hidden;
}
.scoreBarFill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}
.scoreBarValue {
  font-size: 12px;
  font-weight: 700;
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

/* Radar chart */
.radarSection {
  padding: 24px 28px;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
  display: flex;
  justify-content: center;
}

/* Strengths/weaknesses */
.strengthsSection {
  padding: 24px 28px;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 640px) { .strengthsSection { grid-template-columns: 1fr; } }
.strengthsTitle {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.strengthsGood { color: #22c55e; }
.strengthsImprove { color: #d97706; }
.strengthsList { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.strengthsList li { font-size: 13px; color: var(--warm-text-secondary, #57534e); line-height: 1.5; padding-left: 16px; position: relative; }
.strengthsList li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.strengthsGood li::before { background: #22c55e; }
.strengthsImprove li::before { background: #d97706; }

/* Question feedback */
.questionFeedbackSection {
  padding: 24px 28px;
  border-bottom: 1px solid var(--warm-border, #e7e5e4);
}
.questionFeedbackTitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--warm-text-muted, #a8a29e);
  margin-bottom: 16px;
}
.questionFeedbackCard {
  background: var(--warm-bg, #fafaf5);
  border: 1px solid var(--warm-border, #e7e5e4);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.questionFeedbackHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.questionNum {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--warm-text-muted, #a8a29e);
}
.questionScoreBadge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}
.questionText { font-size: 14px; font-weight: 600; color: var(--warm-text-primary, #1c1917); margin-bottom: 8px; }
.questionAnswer {
  font-size: 13px;
  color: var(--warm-text-secondary, #57534e);
  line-height: 1.5;
  margin-bottom: 8px;
  font-style: italic;
}
.questionFeedbackNote {
  font-size: 12px;
  color: var(--warm-text-secondary, #57534e);
  line-height: 1.5;
  padding: 8px 10px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid var(--warm-border, #e7e5e4);
}

/* Report footer actions */
.reportFooter {
  padding: 20px 28px;
  display: flex;
  gap: 10px;
}
.reportFooterBtn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.reportFooterBtnPrimary {
  background: var(--warm-text-primary, #1c1917);
  color: white;
}
.reportFooterBtnPrimary:hover { background: var(--warm-primary, #d97706); }
.reportFooterBtnSecondary {
  background: white;
  color: var(--warm-text-primary, #1c1917);
  border: 1.5px solid var(--warm-border, #e7e5e4);
}
.reportFooterBtnSecondary:hover { border-color: var(--warm-primary, #d97706); }

/* Responsive adjustments */
@media (max-width: 768px) {
  .sessionMain { flex-direction: column; }
  .aiPanel { flex: 0 0 auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 16px; }
  .transcriptPanel { flex: 1; min-height: 200px; }
  .answerBar { flex-wrap: wrap; }
  .catalogGrid { grid-template-columns: repeat(2, 1fr); }
}
```

### Step 2: Commit

```bash
git add "apps/web/src/app/(dashboard)/interview/interview.module.css"
git commit -m "feat(interview): add CSS module for all interview pages"
```

---

## Task 4: Landing Page — Catalog + Filters + Featured + Recent

**Files:**
- Modify: `apps/web/src/app/(dashboard)/interview/page.tsx` (rewrite entirely)

### Step 1: Write the landing page

Replace the entire `apps/web/src/app/(dashboard)/interview/page.tsx`:

```tsx
"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, Clock, RotateCcw } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import { INTERVIEW_CATALOG } from "@/data/interview-catalog";
import { CATEGORY_META, DIFFICULTY_META } from "@/types/interview";
import type { CatalogEntry, Category, Difficulty } from "@/types/interview";
import styles from "./interview.module.css";

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#D97706', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface InterviewCardProps {
  entry: CatalogEntry;
  onStart: (entry: CatalogEntry) => void;
  isFeatured?: boolean;
}

function InterviewCard({ entry, onStart, isFeatured }: InterviewCardProps) {
  const color = getCompanyColor(entry.company);
  const catMeta = CATEGORY_META[entry.category];
  const diffMeta = DIFFICULTY_META[entry.difficulties[0]];

  return (
    <div className={`${styles.interviewCard} ${isFeatured ? styles.interviewCardFeatured : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardCompanyLogo} style={{ backgroundColor: color }}>
          {entry.company.charAt(0)}
        </div>
        <div className={styles.cardTitleGroup}>
          <div className={styles.cardCompany}>{entry.company}</div>
          <div className={styles.cardRole}>{entry.role}</div>
        </div>
      </div>
      <div className={styles.cardBadges}>
        <span className={`${styles.cardBadge} ${styles.badgeCategory}`}>{catMeta.label}</span>
        <span className={`${styles.cardBadge} badgeType${entry.interviewType.replace(' ', '')}`}>
          {entry.interviewType}
        </span>
        <span className={`${styles.cardBadge} ${styles.badgeDifficulty}`}>{diffMeta.label}</span>
        {isFeatured && (
          <span className={styles.cardBadge} style={{ background: '#fef3c7', color: '#D97706' }}>
            ★ Featured
          </span>
        )}
      </div>
      <div className={styles.cardMeta}>
        <Clock size={11} />
        <span>{entry.durationMinutes} min</span>
        <span>·</span>
        <span>{entry.questionCount} questions</span>
      </div>
      <button className={styles.cardStartBtn} onClick={() => onStart(entry)}>
        Start Interview <ArrowRight size={12} style={{ display: 'inline' }} />
      </button>
    </div>
  );
}

export default function InterviewPage() {
  const router = useRouter();
  const { selectInterview, sessions } = useInterviewStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  const categories: Array<Category | 'All'> = ['All', 'Consulting', 'Finance', 'Tech', 'Sales', 'Operations', 'HR'];

  const filtered = useMemo(() => {
    return INTERVIEW_CATALOG.filter(entry => {
      if (activeCategory !== 'All' && entry.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!entry.company.toLowerCase().includes(q) && !entry.role.toLowerCase().includes(q)) return false;
      }
      if (selectedDifficulty !== 'All' && !entry.difficulties.includes(selectedDifficulty)) return false;
      return true;
    });
  }, [activeCategory, searchQuery, selectedDifficulty]);

  const featured = filtered.filter(e => e.featured);
  const rest = filtered.filter(e => !e.featured);

  const pastSessions = sessions.filter(s => s.status === 'COMPLETED');
  const recentPast = pastSessions.slice(-5).reverse();

  const handleStart = (entry: CatalogEntry) => {
    selectInterview(entry, entry.difficulties[0]);
    router.push('/interview/setup');
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.heroStrip}>
        <h1 className={styles.heroTitle}>AI Mock Interview</h1>
        <p className={styles.heroSub}>Practice real interviews for real companies. Get instant feedback.</p>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? 'All' : (CATEGORY_META[cat]?.label ?? cat)}
          </button>
        ))}
        <input
          type="text"
          className={styles.filterSearch}
          placeholder="Search company or role..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>No interviews match your filters</h2>
          <p className={styles.emptySub}>Try adjusting your search or category selection.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <div style={{ padding: '20px 28px 4px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a8a29e', marginBottom: '12px' }}>
                ★ Most Popular
              </div>
              <div className={styles.catalogGrid}>
                {featured.map(entry => (
                  <InterviewCard key={entry.id} entry={entry} onStart={handleStart} isFeatured />
                ))}
              </div>
            </div>
          )}

          {/* All interviews */}
          <div style={{ padding: featured.length > 0 ? '16px 28px 28px' : '20px 28px 28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a8a29e', marginBottom: '12px' }}>
              All Interviews
            </div>
            <div className={styles.catalogGrid}>
              {rest.map(entry => (
                <InterviewCard key={entry.id} entry={entry} onStart={handleStart} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent sessions */}
      {recentPast.length > 0 && (
        <div className={styles.recentSection}>
          <div className={styles.recentTitle}>Recent Sessions</div>
          <div className={styles.recentScroll}>
            {recentPast.map(session => (
              <div
                key={session.id}
                className={styles.recentCard}
                onClick={() => router.push(`/interview/report/${session.id}`)}
              >
                <div className={styles.recentCardCompany}>{session.company}</div>
                <div className={styles.recentCardRole}>{session.role}</div>
                {session.overallScore !== undefined && (
                  <div className={`${styles.recentCardScore} ${session.overallScore >= 80 ? styles.scoreGreen : session.overallScore >= 60 ? styles.scoreAmber : styles.scoreRed}`}>
                    {session.overallScore}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#a8a29e', marginTop: '4px' }}>
                  {new Date(session.completedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 2: Commit

```bash
git add apps/web/src/app/\(dashboard\)/interview/page.tsx
git commit -m "feat(interview): rewrite landing page with catalog grid, filters, featured, recent sessions"
```

---

## Task 5: Setup Flow — Summary + Permission Checks

**Files:**
- Create: `apps/web/src/app/(dashboard)/interview/setup/page.tsx`

### Step 1: Write the setup page

Create `apps/web/src/app/(dashboard)/interview/setup/page.tsx`:

```tsx
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
  Beginner:   'Foundational questions at a slower pace. More time to think and structure your answers.',
  Amateur:    'Standard interview questions at typical pace. Expect follow-up clarifying questions.',
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
    cameraEnabled,
    micEnabled,
    setCameraPermission,
    setMicPermission,
    setCameraEnabled,
    setMicEnabled,
    startSession,
  } = useInterviewStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<'summary' | 'permissions'>('summary');
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (!selectedEntry) {
      router.replace('/interview');
      return;
    }
  }, [selectedEntry, router]);

  useEffect(() => {
    if (step !== 'permissions') return;

    let audioStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animationId: number;

    async function initMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        setCameraPermission(true);
        setMicPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }

        audioStream = mediaStream;
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        function updateLevel() {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(Math.min(100, avg * 1.2));
          animationId = requestAnimationFrame(updateLevel);
        }
        updateLevel();
      } catch (err) {
        const isCamera = (err as Error).name === 'NotAllowedError' || (err as Error).name === 'NotFoundError';
        if (isCamera) setCameraError(true);
        setCameraPermission(false);
        setMicPermission(false);
      }
    }

    initMedia();

    return () => {
      cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (audioCtx) audioCtx.close();
    };
  }, [step]);

  if (!selectedEntry) return null;

  const color = getCompanyColor(selectedEntry.company);
  const catMeta = CATEGORY_META[selectedEntry.category];
  const diffMeta = DIFFICULTY_META[selectedDifficulty];
  const allPermissionsOk = cameraPermissionGranted || micPermissionGranted;

  const handleBegin = () => {
    startSession();
    const activeSession = useInterviewStore.getState().activeSession;
    if (activeSession) {
      router.push(`/interview/session/${activeSession.id}`);
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
          <div className={styles.setupDivider} style={{ margin: 0 }} />
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
                        onClick={() => useInterviewStore.getState().selectInterview(selectedEntry, d)}
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
                  <span style={{ color: item.granted ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{item.granted ? '✓' : '✗'}</span>
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
            {!cameraPermissionGranted && !cameraError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>
                <AlertCircle size={14} />
                <span>Camera access is needed for the full experience. <button onClick={() => setCameraEnabled(true)} style={{ background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontWeight: 600 }}>Enable in browser settings</button></span>
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
              <button className={styles.skipBtn} onClick={handleBegin}>
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
```

### Step 2: Commit

```bash
git add apps/web/src/app/\(dashboard\)/interview/setup/page.tsx
git commit -m "feat(interview): add setup flow page with summary + permission checks"
```

---

## Task 6: Live Interview Session — AI Panel + Transcript + Answer Input

**Files:**
- Modify: `apps/web/src/app/(dashboard)/interview/session/[id]/page.tsx` (replace entirely)
- Create: `apps/web/src/app/(dashboard)/interview/session/[id]/session.module.css` (optional, styles already in interview.module.css)

### Step 1: Write the live session page

Replace the entire `apps/web/src/app/(dashboard)/interview/session/[id]/page.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Send } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import styles from "../../interview.module.css";

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
    clearActiveSession,
  } = useInterviewStore();

  const [showEndModal, setShowEndModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!activeSession || activeSession.id !== params.sessionId) {
      // Try to find in store
      const store = useInterviewStore.getState();
      if (!store.activeSession || store.activeSession.id !== params.sessionId) {
        router.replace('/interview');
      }
    }
  }, [activeSession, params.sessionId, router]);

  useEffect(() => {
    if (answerText) {
      setWordCount(answerText.trim().split(/\s+/).filter(Boolean).length);
    } else {
      setWordCount(0);
    }
  }, [answerText]);

  useEffect(() => {
    // Scroll transcript to bottom
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeSession?.transcript.length]);

  // Auto-submit on Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answerText]);

  if (!activeSession) {
    return (
      <div style={{ minHeight: '100vh', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading...
      </div>
    );
  }

  const currentQ = activeSession.questions[currentQuestionIndex];
  const totalQuestions = activeSession.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const sessionElapsed = Math.round((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000);
  const minutes = Math.floor(sessionElapsed / 60);
  const seconds = sessionElapsed % 60;

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    submitAnswer();
    textareaRef.current?.focus();
  };

  const handleEnd = () => {
    endSession();
    const session = useInterviewStore.getState().activeSession;
    if (session?.status === 'COMPLETED') {
      router.push(`/interview/report/${session.id}`);
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
            {minutes}:{seconds.toString().padStart(2, '0')}
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
```

### Step 2: Commit

```bash
git add apps/web/src/app/\(dashboard\)/interview/session/\[id\]/page.tsx
git commit -m "feat(interview): replace with full live interview session with AI panel + transcript panel"
```

---

## Task 7: Completion Screen + Performance Report

**Files:**
- Create: `apps/web/src/app/(dashboard)/interview/report/[id]/page.tsx`
- Create: `apps/web/src/app/(dashboard)/interview/completion/page.tsx`

### Step 1: Write the completion screen

Create `apps/web/src/app/(dashboard)/interview/completion/page.tsx`:

```tsx
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

  const elapsed = activeSession.durationMinutes
    ? `${activeSession.durationMinutes} min`
    : '—';

  return (
    <div className={styles.completionScreen}>
      <div className={styles.completionCard}>
        <div className={styles.completionCheck}>✓</div>
        <h1 className={styles.completionTitle}>Interview Complete</h1>
        <p className={styles.completionSummary}>
          You answered {activeSession.answers.length} questions in {elapsed} for the{' '}
          <strong>{activeSession.role}</strong> position at{' '}
          <strong>{activeSession.company}</strong>.
          {' '}Your performance report is ready.
        </p>
        <div className={styles.completionActions}>
          <button className={styles.reportBtn} onClick={handleViewReport}>
            View Your Report →
          </button>
          <button className={styles.backLink} onClick={handleBack}>
            Back to Interview Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Write the performance report page

Create `apps/web/src/app/(dashboard)/interview/report/[id]/page.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Share2 } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import { CATEGORY_META } from "@/types/interview";
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

function RadarChart({ scores }: {
  scores: { communication: number; structure: number; specificity: number; confidence: number; roleFit: number };
}) {
  const axes = [
    { label: 'Communication', value: scores.communication },
    { label: 'Structure', value: scores.structure },
    { label: 'Specificity', value: scores.specificity },
    { label: 'Confidence', value: scores.confidence },
    { label: 'Role Fit', value: scores.roleFit },
  ];
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;

  function polarToXY(angle: number, radius: number) {
    return {
      x: cx + radius * Math.sin(angle),
      y: cy - radius * Math.cos(angle),
    };
  }

  // Pentagon path for data
  const dataPoints = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const norm = axis.value / 100;
    return polarToXY(angle, r * norm);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Pentagon grid lines
  const gridLines = [0.25, 0.5, 0.75, 1].map(scale => {
    const pts = axes.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const p = polarToXY(angle, r * scale);
      return `${p.x} ${p.y}`;
    }).join(' ');
    return `M ${pts} Z`;
  });

  const labelPoints = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return polarToXY(angle, r + 22);
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Grid */}
      {gridLines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e7e5e4" strokeWidth="1" />
      ))}
      {/* Axes */}
      {axes.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const p = polarToXY(angle, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e7e5e4" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <path d={dataPath} fill="rgba(217,119,6,0.15)" stroke="#d97706" strokeWidth="2" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#d97706" />
      ))}
      {/* Labels */}
      {axes.map((axis, i) => {
        const lp = labelPoints[i];
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="600"
            fill="#57534e"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { activeSession, sessions, clearActiveSession, selectInterview } = useInterviewStore();

  // Check if report data is in active session or sessions list
  const reportSession = activeSession?.status === 'COMPLETED' && activeSession.id === params.sessionId
    ? activeSession
    : sessions.find(s => s.id === params.sessionId && s.status === 'COMPLETED');

  useEffect(() => {
    if (!reportSession) {
      // Could redirect to completion
    }
  }, [reportSession]);

  if (!reportSession) {
    return (
      <div className={styles.reportPage}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ fontSize: '16px', color: '#57534e' }}>Loading report...</p>
          <button
            onClick={() => router.push('/interview')}
            style={{ marginTop: '16px', background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontSize: '14px' }}
          >
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

  const strengths = [];
  const improvements = [];

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
        {/* Header */}
        <div className={styles.reportHeader}>
          <div className={styles.reportHeaderLeft}>
            <div className={styles.reportCompany}>{reportSession.company} — {reportSession.role}</div>
            <div className={styles.reportMeta}>
              {reportSession.interviewType} · {reportSession.difficulty} · {completedAt}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.reportScore} style={{ color: scoreColor }}>{score}</div>
            <div className={styles.reportScoreLabel}>out of 100</div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className={styles.scoreSection}>
          <div className={styles.scoreSectionTitle}>Score Breakdown</div>
          {dimensionsList.map(dim => (
            <div key={dim.label} className={styles.scoreBarRow}>
              <div className={styles.scoreBarLabel}>{dim.label}</div>
              <div className={styles.scoreBarTrack}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${dim.value}%`, backgroundColor: getScoreColor(dim.value) }}
                />
              </div>
              <div className={styles.scoreBarValue} style={{ color: getScoreColor(dim.value) }}>{dim.value}</div>
            </div>
          ))}
        </div>

        {/* Radar chart */}
        <div className={styles.radarSection}>
          <RadarChart scores={dimensions} />
        </div>

        {/* Strengths + Improvements */}
        <div className={styles.strengthsSection}>
          <div>
            <div className={`${styles.strengthsTitle} ${styles.strengthsGood}`}>
              ✓ What You Did Well
            </div>
            {strengths.length > 0 ? (
              <ul className={`${styles.strengthsList} ${styles.strengthsGood}`}>
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', color: '#57534e' }}>Keep practicing to identify strengths.</p>
            )}
          </div>
          <div>
            <div className={`${styles.strengthsTitle} ${styles.strengthsImprove}`}>
              ↑ Areas to Improve
            </div>
            {improvements.length > 0 ? (
              <ul className={`${styles.strengthsList} ${styles.strengthsImprove}`}>
                {improvements.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', color: '#57534e' }}>No critical areas identified. Great job!</p>
            )}
          </div>
        </div>

        {/* Question-by-question feedback */}
        <div className={styles.questionFeedbackSection}>
          <div className={styles.questionFeedbackTitle}>Question-by-Question Feedback</div>
          {reportSession.answers.map((answer, i) => {
            const question = reportSession.questions[i];
            if (!question) return null;
            return (
              <div key={answer.questionId} className={styles.questionFeedbackCard}>
                <div className={styles.questionFeedbackHeader}>
                  <div className={styles.questionNum}>
                    Q{i + 1} — {question.type}
                  </div>
                  <span className={`${styles.questionScoreBadge} ${getScoreClass(answer.score)}`}>
                    {answer.score}/100
                  </span>
                </div>
                <div className={styles.questionText}>{question.text}</div>
                <div className={styles.questionAnswer}>"{answer.answerText || 'No answer provided'}"</div>
                <div className={styles.questionFeedbackNote}>{answer.feedback}</div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className={styles.reportFooter}>
          <button
            className={`${styles.reportFooterBtn} ${styles.reportFooterBtnSecondary}`}
            onClick={() => router.push('/interview')}
          >
            <ArrowLeft size={13} style={{ display: 'inline', marginRight: '6px' }} />
            Browse More
          </button>
          <button
            className={`${styles.reportFooterBtn} ${styles.reportFooterBtnPrimary}`}
            onClick={() => {
              // Find same catalog entry for retry
              const catalogEntry = reportSession;
              clearActiveSession();
              router.push('/interview');
            }}
          >
            <RotateCcw size={13} style={{ display: 'inline', marginRight: '6px' }} />
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Commit

```bash
git add apps/web/src/app/\(dashboard\)/interview/completion/page.tsx apps/web/src/app/\(dashboard\)/interview/report/\[id\]/page.tsx
git commit -m "feat(interview): add completion screen and performance report page"
```

---

## Task 8: Build Verification

### Step 1: Run build

```bash
cd /c/Users/ranes/placement-copilot && npm run build --workspace=apps/web 2>&1 | tail -40
```

Expected: Clean build, no TypeScript errors, `/interview`, `/interview/setup`, `/interview/session/[id]`, and `/interview/report/[id]` routes all present.

### Step 2: Check routes

```bash
npm run build --workspace=apps/web 2>&1 | grep -E "interview"
```

Expected:
```
○  /interview                              38.9 kB         210 kB  (or higher after changes)
ƒ  /interview/[sessionId]                 7.73 kB         149 kB
```

### Step 3: Fix any errors

If the build fails, fix TypeScript errors and commit the fixes. Common issues:
- Missing re-exports in `types/index.ts` or `stores/index.ts` — add them
- `useInterviewStore` imported from wrong path — verify `@/stores/interview-store` resolves
- CSS class names not matching — check `interview.module.css` classes match component usage

### Step 4: Commit fixes

```bash
git add apps/web/src/types/index.ts apps/web/src/stores/index.ts  # if modified
git commit -m "fix(interview): add missing re-exports and resolve build errors"
```

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Landing page with hero, filters, catalog grid | Task 3, Task 4 |
| 25 curated catalog entries | Task 1 |
| Featured row | Task 4 |
| Recent sessions | Task 4 |
| Setup flow (summary + permissions) | Task 5 |
| Camera preview + mic meter | Task 5 |
| Difficulty selection + explanation | Task 5 |
| Trust messaging | Task 5 |
| Live session (AI panel + transcript panel) | Task 6 |
| Question display + counter + timer | Task 6 |
| AI state indicator | Task 6 |
| Real-time transcript log | Task 6 |
| Answer input with word count | Task 6 |
| End interview confirmation modal | Task 6 |
| Completion screen | Task 7 |
| Performance report (overall score) | Task 7 |
| Score breakdown (5 dimensions) | Task 7 |
| Radar chart (CSS/SVG) | Task 7 |
| Strengths + improvements | Task 7 |
| Q&A feedback cards | Task 7 |
| Build verification | Task 8 |

**All spec sections covered. No gaps.**

---

## Phase 2 Notes (separate plan)

Once Phase 1 is complete, Phase 2 adds:
- Real AI question generation via LLM API
- Voice transcription via Web Speech API
- Difficulty auto-adjustment based on answer quality
- Answer rewrite suggestions
- Shareable report links
