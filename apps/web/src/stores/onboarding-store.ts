import { create } from "zustand";

export type OnboardingMethod = "resume" | "linkedin" | null;

interface ParsedProfile {
  name?: string;
  email?: string;
  headline?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  summary?: string;
}

export type OnboardingStatus =
  | "idle"
  | "uploading"
  | "parsing"
  | "success"
  | "error";

interface OnboardingState {
  method: OnboardingMethod;
  status: OnboardingStatus;
  error: string | null;
  parsedProfile: ParsedProfile | null;
  fileName: string | null;
  setMethod: (method: OnboardingMethod) => void;
  setStatus: (status: OnboardingStatus) => void;
  setError: (error: string | null) => void;
  setParsedProfile: (profile: ParsedProfile | null) => void;
  setFileName: (name: string | null) => void;
  reset: () => void;
}

const initialState = {
  method: null,
  status: "idle" as OnboardingStatus,
  error: null,
  parsedProfile: null,
  fileName: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setMethod: (method) => set({ method }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setParsedProfile: (parsedProfile) => set({ parsedProfile }),
  setFileName: (fileName) => set({ fileName }),
  reset: () => set(initialState),
}));
