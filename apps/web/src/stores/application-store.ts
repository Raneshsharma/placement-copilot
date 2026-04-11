import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppStatus =
  | "WISHLIST"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export const KANBAN_COLUMNS: { id: AppStatus; label: string; color: string }[] = [
  { id: "WISHLIST", label: "Wishlist", color: "#94A3B8" },
  { id: "SUBMITTED", label: "Submitted", color: "#0D7377" },
  { id: "UNDER_REVIEW", label: "Under Review", color: "#7C6BB2" },
  { id: "INTERVIEW", label: "Interview", color: "#F59E0B" },
  { id: "OFFERED", label: "Offer", color: "#22C55E" },
  { id: "REJECTED", label: "Rejected", color: "#EF4444" },
  { id: "WITHDRAWN", label: "Withdrawn", color: "#9CA3AF" },
];

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
  match?: number;
  interviewDate?: string;
}

interface KanbanColumn {
  id: AppStatus;
  label: string;
  color: string;
  apps: Application[];
}

interface ApplicationState {
  columns: KanbanColumn[];
  isLoading: boolean;
  setColumns: (columns: KanbanColumn[]) => void;
  setLoading: (loading: boolean) => void;
  addApplication: (app: Application) => void;
  moveApplication: (appId: string, fromStatus: AppStatus, toStatus: AppStatus) => void;
  updateApplication: (id: string, data: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  setApplications: (apps: Application[]) => void;
}

const buildColumns = (apps: Application[]): KanbanColumn[] =>
  KANBAN_COLUMNS.map((col) => ({
    ...col,
    apps: apps.filter((a) => a.status === col.id),
  }));

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      columns: buildColumns([]),
      isLoading: false,
      setColumns: (columns) => set({ columns }),
      setLoading: (loading) => set({ isLoading: loading }),
      addApplication: (app) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === app.status ? { ...col, apps: [...col.apps, app] } : col
          ),
        })),
      moveApplication: (appId, fromStatus, toStatus) =>
        set((state) => {
          const fromCol = state.columns.find((c) => c.id === fromStatus);
          const app = fromCol?.apps.find((a) => a.id === appId);
          if (!app) return state;
          const updatedApp = { ...app, status: toStatus };
          return {
            columns: state.columns.map((col) => {
              if (col.id === fromStatus) return { ...col, apps: col.apps.filter((a) => a.id !== appId) };
              if (col.id === toStatus) return { ...col, apps: [...col.apps, updatedApp] };
              return col;
            }),
          };
        }),
      updateApplication: (id, data) =>
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            apps: col.apps.map((a) => (a.id === id ? { ...a, ...data } : a)),
          })),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            apps: col.apps.filter((a) => a.id !== id),
          })),
        })),
      setApplications: (apps) => set({ columns: buildColumns(apps) }),
      getByStatus: (status: AppStatus) => {
        const col = get().columns.find((c) => c.id === status);
        return col?.apps ?? [];
      },
    }),
    { name: "application-storage" }
  )
);
