import { create } from "zustand";

export type AppStatus =
  | "WISHLIST"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  company: string;
  role: string;
  companyLogo?: string;
  status: AppStatus;
  appliedAt: string;
  salary?: string;
  location?: string;
  notes?: string;
}

interface ApplicationState {
  applications: Application[];
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateStatus: (id: string, status: AppStatus) => void;
  removeApplication: (id: string) => void;
}

export const useApplicationStore = create<ApplicationState>()((set) => ({
  applications: [],
  setApplications: (apps) => set({ applications: apps }),
  addApplication: (app) =>
    set((state) => ({ applications: [...state.applications, app] })),
  updateStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    })),
  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),
}));
