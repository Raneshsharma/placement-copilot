import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GapItem {
  skill: string;
  importance: number;
  currentLevel?: number;
  targetLevel?: number;
}

export interface RadarData {
  subject: string;
  current: number;
  target: number;
  fullMark?: number;
}

interface SkillsState {
  skills: string[];
  targetRole: string;
  gaps: GapItem[];
  matchedSkills: string[];
  readinessScore: number;
  radarData: RadarData[];
  isAnalyzing: boolean;
  setSkills: (skills: string[]) => void;
  setTargetRole: (role: string) => void;
  setGapAnalysis: (
    gaps: GapItem[],
    matched: string[],
    readiness: number,
    radarData: RadarData[]
  ) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
}

export const useSkillsStore = create<SkillsState>()(
  persist(
    (set) => ({
      skills: [],
      targetRole: "",
      gaps: [],
      matchedSkills: [],
      readinessScore: 0,
      radarData: [],
      isAnalyzing: false,
      setSkills: (skills) => set({ skills }),
      setTargetRole: (role) => set({ targetRole: role }),
      setGapAnalysis: (gaps, matched, readiness, radarData) =>
        set({ gaps, matchedSkills: matched, readinessScore: readiness, radarData }),
      setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    }),
    {
      name: "skills-storage",
      partialize: (state) => ({
        targetRole: state.targetRole,
      }),
    }
  )
);
