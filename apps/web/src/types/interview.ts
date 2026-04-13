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
  Beginner:    { label: 'Beginner',    color: '#22C55E' },
  Amateur:     { label: 'Amateur',     color: '#F59E0B' },
  Expert:     { label: 'Expert',     color: '#EF4444' },
  'Real-life': { label: 'Real-life', color: '#7C6BB2' },
};

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  Consulting:  { label: 'Consulting',  color: '#7C6BB2' },
  Finance:     { label: 'Finance',    color: '#0D7377' },
  Tech:        { label: 'Tech',       color: '#0D7377' },
  Sales:       { label: 'Sales',       color: '#D97706' },
  Operations:  { label: 'Operations', color: '#D97706' },
  HR:          { label: 'HR',          color: '#D97706' },
};