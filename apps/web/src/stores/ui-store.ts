import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeRoute: string;
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveRoute: (route: string) => void;
  toggleSidebarOpen: () => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeRoute: "/dashboard",
      notifications: [],
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveRoute: (route) => set({ activeRoute: route }),
      toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarOpen: state.sidebarOpen,
        notifications: state.notifications,
      }),
    }
  )
);
