import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/api/auth/login", data),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.post("/api/auth/register", data),
  refreshToken: (token: string) =>
    apiClient.post("/api/auth/refresh", { token }),
  logout: () => apiClient.post("/api/auth/logout"),
};

export const profileApi = {
  get: () => apiClient.get("/api/profile"),
  create: (data: Record<string, unknown>) => apiClient.post("/api/profile", data),
  update: (data: Record<string, unknown>) => apiClient.patch("/api/profile", data),
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getResume: () => apiClient.get("/api/profile/resume"),
};

export const resumeApi = {
  get: () => apiClient.get("/api/resume"),
  update: (data: Record<string, unknown>) => apiClient.patch("/api/resume", data),
  generateSummary: (data: { prompt: string }) =>
    apiClient.post("/api/resume/generate-summary", data),
  optimize: (data: Record<string, unknown>) =>
    apiClient.post("/api/resumes/optimize", data),
  downloadPdf: () =>
    apiClient.get("/api/resume/pdf", { responseType: "blob" }),
  downloadDocx: () =>
    apiClient.get("/api/resume/docx", { responseType: "blob" }),
};

export const jobApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/api/jobs", { params }),
  get: (id: string) => apiClient.get(`/api/jobs/${id}`),
  getSaved: () => apiClient.get("/api/jobs/saved"),
  getRecommendations: (params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/recommendations", { params }),
  recommendations: (params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/recommendations", { params }),
  search: (query: string, params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/search", { params: { q: query, ...params } }),
};

export const notificationApi = {
  list: () => apiClient.get("/api/notifications"),
  markRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
  register: (data: Record<string, unknown>) =>
    apiClient.post("/api/notifications/register", data),
};

export const applicationApi = {
  list: () => apiClient.get("/api/applications"),
  create: (data: Record<string, unknown>) => apiClient.post("/api/applications", data),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.patch(`/api/applications/${id}`, data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/applications/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/api/applications/${id}`),
  getStats: () => apiClient.get("/api/applications/stats"),
};

export const interviewApi = {
  getTypes: () => apiClient.get("/api/interviews/types"),
  getSessions: () => apiClient.get("/api/interviews"),
  startSession: (type: string, params?: Record<string, unknown>) =>
    apiClient.post("/api/interviews/sessions", { type, ...params }),
  getSession: (id: string) => apiClient.get(`/api/interviews/sessions/${id}`),
  submitAnswer: (sessionId: string, questionId: string, answer: string) =>
    apiClient.post(`/api/interviews/sessions/${sessionId}/answers`, { questionId, answer }),
  endSession: (id: string) => apiClient.post(`/api/interviews/sessions/${id}/end`),
  getReport: (id: string) => apiClient.get(`/api/interviews/sessions/${id}/report`),
};

export const skillGapApi = {
  analyze: (targetRole: string) =>
    apiClient.post("/api/skills/analyze", { targetRole }),
  getRoadmap: (role: string) => apiClient.get(`/api/skills/roadmap/${role}`),
  trackProgress: (skillId: string, progress: number) =>
    apiClient.patch(`/api/skills/${skillId}/progress`, { progress }),
};

export const progressApi = {
  get: () => apiClient.get("/api/progress"),
  getPPS: () => apiClient.get("/api/progress/pps"),
  getStreak: () => apiClient.get("/api/progress/streak"),
  updateActivity: (activity: string) =>
    apiClient.post("/api/progress/activity", { activity }),
};

export default apiClient;
