import { create } from "zustand";
import type { ProfileStrength, ResumeDocument, AnalysisCategory, AnalysisIssue } from "@/types/analysis";
import { MOCK_PROFILE_STRENGTH, MOCK_RESUME_DOCUMENT } from "@/types/analysis.mock";

type WorkspaceStatus = "loading" | "analyzing" | "ready" | "partial" | "error";

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getMockResponse(
  prompt: string,
  category: AnalysisCategory | null,
  issue: AnalysisIssue | null
): string {
  const p = prompt.toLowerCase();

  if (p.includes("rewrite") || p.includes("action verb")) {
    if (issue) {
      const original = issue.context.split("\n").pop() ?? "";
      return `Here's a stronger version:\n\n"${original}"\n\n→ "Led the design and implementation of microservices architecture, improving system throughput by 45% and reducing latency from 800ms to 440ms."\n\nKey improvements: specific verb ("Led"), quantified impact (45%), concrete metrics.`;
    }
    return `Strong action verbs show ownership and impact:\n\n• "Led" or "Spearheaded" instead of "helped with"\n• "Built" or "Designed" instead of "worked on"\n• "Delivered" or "Achieved" instead of "assisted"\n\nTry the STAR method: Situation → Task → Action → Result.`;
  }

  if (p.includes("impact") || p.includes("metric") || p.includes("quantify")) {
    return `Adding metrics makes your achievements concrete and 40% more likely to get a callback:\n\n• % improvement (e.g., "reduced latency by 45%")\n• $ amount (e.g., "saved $12K monthly")\n• # users/customers (e.g., "served 50K users")\n• Time saved (e.g., "cut deployment from 2hrs to 10min")\n\nIf you don't have exact numbers, use reasonable estimates or ranges.`;
  }

  if (p.includes("ats") || p.includes("keyword")) {
    return `ATS systems scan for keyword matches against job descriptions. Key strategies:\n\n1. Mirror exact phrases from the job posting\n2. Include both acronyms and full terms ("SEO" AND "Search Engine Optimization")\n3. Add industry-standard skills (React, Python, SQL, etc.)\n4. Place keywords naturally in context, not just a skills list\n\nTip: Use the job description as a checklist — if a term appears 3+ times, it's critical.`;
  }

  if (p.includes("summary") || p.includes("overview")) {
    return `A strong summary should answer: What do you do? What scale? What problems do you solve?\n\nReplace generic: "Experienced software engineer..."\nWith specific: "Backend engineer specializing in high-throughput APIs and distributed systems. 4 years building payment infrastructure processing $2M+ daily."\n\nInclude: specialty + years + scale + specific domain.`;
  }

  if (p.includes("prioritize") || p.includes("first")) {
    if (category) {
      return `Based on your resume, start with "${category.name}" — it has ${category.issueCount} issues that have the highest impact on recruiter and ATS decisions. Fixing these will give you the biggest improvement in callback rates.`;
    }
    return `Priority order:\n\n1. Action verbs + quantified results (biggest ATS weight)\n2. ATS keywords matching your target roles\n3. Summary statement specificity\n4. Structure and scannability\n\nFocus on your most recent role first — recruiters read top-to-bottom.`;
  }

  return `Great question! Here's my coaching advice:\n\nFor your resume, focus on showing results, not just responsibilities. Every bullet should answer: "So what?" What changed because of your work?\n\nUse the PAR method: Problem → Action → Result.\n\nWould you like me to help rewrite a specific section?`;
}

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

  // AI Assistant state
  aiHelpOpen: boolean;
  aiMessages: AiMessage[];
  aiInput: string;
  aiIsLoading: boolean;

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
  toggleAiHelp: () => void;
  setAiInput: (text: string) => void;
  sendAiMessage: (text: string) => void;
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

  // AI Assistant state
  aiHelpOpen: false,
  aiMessages: [],
  aiInput: "",
  aiIsLoading: false,

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
  toggleAiHelp: () => set((state) => ({ aiHelpOpen: !state.aiHelpOpen })),
  setAiInput: (text) => set({ aiInput: text }),
  sendAiMessage: (text: string) => {
    const { profileStrength, selectedCategoryId, selectedIssueId } = get();

    // Find the selected category and issue
    const selectedCategory = profileStrength?.categories.find(c => c.id === selectedCategoryId) ?? null;
    const selectedIssue = selectedCategory?.issues.find(i => i.id === selectedIssueId) ?? null;

    // Add user message
    const userMessage: AiMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    set((state) => ({
      aiMessages: [...state.aiMessages, userMessage],
      aiInput: "",
      aiIsLoading: true,
    }));

    // Simulate AI response delay
    setTimeout(() => {
      const response = getMockResponse(text, selectedCategory, selectedIssue);
      const assistantMessage: AiMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };

      set((state) => ({
        aiMessages: [...state.aiMessages, assistantMessage],
        aiIsLoading: false,
      }));
    }, 1500);
  },

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
