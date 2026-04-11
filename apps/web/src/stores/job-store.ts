import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FilterType = "90plus" | "remote" | "student" | "salary";
export type ViewMode = "grid" | "list";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  type: string;
  postedAt: string;
  match?: number;
  remote?: boolean;
  tags?: string[];
  description?: string;
  applyUrl?: string;
}

interface JobState {
  jobs: Job[];
  savedJobIds: string[];
  searchQuery: string;
  activeFilters: FilterType[];
  viewMode: ViewMode;
  setJobs: (jobs: Job[]) => void;
  toggleSave: (jobId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFilter: (filter: FilterType) => void;
  clearFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      jobs: [],
      savedJobIds: [],
      searchQuery: "",
      activeFilters: [],
      viewMode: "grid",
      setJobs: (jobs) => set({ jobs }),
      toggleSave: (jobId) =>
        set((state) => ({
          savedJobIds: state.savedJobIds.includes(jobId)
            ? state.savedJobIds.filter((id) => id !== jobId)
            : [...state.savedJobIds, jobId],
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleFilter: (filter) =>
        set((state) => ({
          activeFilters: state.activeFilters.includes(filter)
            ? state.activeFilters.filter((f) => f !== filter)
            : [...state.activeFilters, filter],
        })),
      clearFilters: () => set({ activeFilters: [] }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "job-storage",
      partialize: (state) => ({
        savedJobIds: state.savedJobIds,
        viewMode: state.viewMode,
      }),
    }
  )
);
