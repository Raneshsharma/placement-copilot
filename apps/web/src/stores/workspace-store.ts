import { create } from "zustand";
import type { ProfileStrength, ResumeDocument, AnalysisCategory, AnalysisIssue } from "@/types/analysis";
import { MOCK_PROFILE_STRENGTH, MOCK_RESUME_DOCUMENT } from "@/types/analysis.mock";

type WorkspaceStatus = "loading" | "analyzing" | "ready" | "partial" | "error";

interface WorkspaceState {
  status: WorkspaceStatus;
  profileStrength: ProfileStrength | null;
  resumeDocument: ResumeDocument | null;
  selectedCategoryId: string | null;
  selectedIssueId: string | null;
  highlightedSectionId: string | null;
  previewVisible: boolean;
  activeAiPanel: string | null;  // issue ID with open AI panel
  errorMessage: string | null;

  // Actions
  setStatus: (status: WorkspaceStatus) => void;
  setProfileStrength: (data: ProfileStrength) => void;
  setResumeDocument: (doc: ResumeDocument) => void;
  selectCategory: (categoryId: string) => void;
  selectIssue: (issueId: string) => void;
  highlightSection: (sectionId: string | null) => void;
  togglePreview: () => void;
  openAiPanel: (issueId: string) => void;
  closeAiPanel: () => void;
  setError: (message: string | null) => void;
  loadMockData: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  status: "loading",
  profileStrength: null,
  resumeDocument: null,
  selectedCategoryId: null,
  selectedIssueId: null,
  highlightedSectionId: null,
  previewVisible: true,
  activeAiPanel: null,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setProfileStrength: (data) => set({ profileStrength: data }),
  setResumeDocument: (doc) => set({ resumeDocument: doc }),
  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId, selectedIssueId: null, highlightedSectionId: null }),
  selectIssue: (issueId) => {
    const { profileStrength } = get();
    const issue = profileStrength?.categories
      .flatMap(c => c.issues)
      .find(i => i.id === issueId);
    set({
      selectedIssueId: issueId,
      highlightedSectionId: issue?.resumeSectionId ?? null,
    });
  },
  highlightSection: (sectionId) => set({ highlightedSectionId: sectionId }),
  togglePreview: () => set((state) => ({ previewVisible: !state.previewVisible })),
  openAiPanel: (issueId) => set({ activeAiPanel: issueId }),
  closeAiPanel: () => set({ activeAiPanel: null }),
  setError: (message) => set({ errorMessage: message, status: "error" }),

  loadMockData: () => {
    set({ status: "analyzing" });
    // Simulate analysis delay
    setTimeout(() => {
      set({
        status: "ready",
        profileStrength: MOCK_PROFILE_STRENGTH,
        resumeDocument: MOCK_RESUME_DOCUMENT,
        selectedCategoryId: MOCK_PROFILE_STRENGTH.categories[0].id,
      });
    }, 2000);
  },
}));
