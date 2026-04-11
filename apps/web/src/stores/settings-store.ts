import { create } from "zustand";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  location?: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  targetRoles?: string[];
  experience?: string;
  education?: string;
}

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  jobRecommendations: boolean;
  weeklyDigest: boolean;
}

export interface IntegrationStatus {
  linkedin: { connected: boolean; lastSync?: string };
  github: { connected: boolean; lastSync?: string };
  calendar: { connected: boolean; lastSync?: string };
}

interface SettingsState {
  profile: UserProfile | null;
  notifications: NotificationPrefs;
  integrations: IntegrationStatus;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setNotifications: (prefs: NotificationPrefs) => void;
  updateNotification: <K extends keyof NotificationPrefs>(
    key: K,
    value: NotificationPrefs[K]
  ) => void;
  setIntegrations: (integrations: IntegrationStatus) => void;
}

const defaultNotificationPrefs: NotificationPrefs = {
  email: true,
  push: true,
  applicationUpdates: true,
  interviewReminders: true,
  jobRecommendations: true,
  weeklyDigest: false,
};

const defaultIntegrations: IntegrationStatus = {
  linkedin: { connected: false },
  github: { connected: false },
  calendar: { connected: false },
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  profile: null,
  notifications: defaultNotificationPrefs,
  integrations: defaultIntegrations,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  setNotifications: (prefs) => set({ notifications: prefs }),
  updateNotification: (key, value) =>
    set((state) => ({
      notifications: { ...state.notifications, [key]: value },
    })),
  setIntegrations: (integrations) => set({ integrations }),
}));
