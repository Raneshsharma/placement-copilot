import axios from "axios";

// For server-side API routes (auth, profile, etc.), use relative URLs
// For external services (AI), use NEXT_PUBLIC_API_URL
const getBaseURL = (path: string) => {
  // Auth and internal API routes should use relative URLs (handled by Next.js)
  if (path.startsWith("/api/auth") || path.startsWith("/api/profile") ||
      path.startsWith("/api/resume") || path.startsWith("/api/jobs") ||
      path.startsWith("/api/applications") || path.startsWith("/api/skills") ||
      path.startsWith("/api/progress") || path.startsWith("/api/notifications") ||
      path.startsWith("/api/saved") || path.startsWith("/api/milestones")) {
    return ""; // Use relative URL (Next.js API routes)
  }
  // External services use NEXT_PUBLIC_API_URL or NEXT_PUBLIC_AI_URL
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_AI_URL || "";
};

const apiClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 15000,
});

// Custom request interceptor to set baseURL per request
apiClient.interceptors.request.use(
  (config) => {
    // Set baseURL based on the request path
    if (!config.baseURL || config.baseURL === "") {
      config.baseURL = getBaseURL(config.url || "");
    }

    if (typeof window !== "undefined") {
      let token: string | null = null;
      try {
        const raw = localStorage.getItem("auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.state?.token ?? parsed?.state?.accessToken ?? null;
        }
      } catch {
        // ignore
      }
      if (!token) {
        token = localStorage.getItem("accessToken");
      }
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
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        let refreshToken: string | null = null;
        try {
          const raw = localStorage.getItem("auth-storage");
          if (raw) {
            const parsed = JSON.parse(raw);
            refreshToken = parsed?.state?.refreshToken ?? null;
          }
        } catch {
          // ignore
        }
        if (!refreshToken) {
          refreshToken = localStorage.getItem("refreshToken");
        }
        if (refreshToken && !error.config._retry) {
          error.config._retry = true;
          try {
            const res = await axios.post("/api/auth/refresh", { refreshToken });
            const { accessToken: newToken, refreshToken: newRefreshToken } = res.data?.data ?? res.data;
            try {
              const raw = localStorage.getItem("auth-storage");
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.state) {
                  parsed.state.token = newToken;
                  parsed.state.refreshToken = newRefreshToken ?? parsed.state.refreshToken;
                  parsed.state.accessToken = newToken;
                  localStorage.setItem("auth-storage", JSON.stringify(parsed));
                }
              }
            } catch { /* ignore storage errors */ }
            localStorage.setItem("accessToken", newToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(error.config);
          } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            try {
              const raw = localStorage.getItem("auth-storage");
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.state) {
                  parsed.state.token = null;
                  parsed.state.refreshToken = null;
                  parsed.state.accessToken = null;
                  parsed.state.isAuthenticated = false;
                  localStorage.setItem("auth-storage", JSON.stringify(parsed));
                }
              }
            } catch { /* ignore */ }
            window.location.href = "/login";
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          try {
            const raw = localStorage.getItem("auth-storage");
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed?.state) {
                parsed.state.token = null;
                parsed.state.refreshToken = null;
                parsed.state.accessToken = null;
                parsed.state.isAuthenticated = false;
                localStorage.setItem("auth-storage", JSON.stringify(parsed));
              }
            }
          } catch { /* ignore */ }
          window.location.href = "/login";
        }
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
    apiClient.post("/api/auth/refresh", { refreshToken: token }),
  logout: () => apiClient.post("/api/auth/logout"),
  googleAuth: (token: string) =>
    apiClient.post("/api/auth/google", { token }),
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
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAll: () => apiClient.get("/api/resumes"),
  getById: (id: string) => apiClient.get(`/api/resumes/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/api/resumes", data),
  duplicate: (id: string) => apiClient.post(`/api/resumes/${id}/duplicate`),
  optimize: (data: { resumeId?: string; jobDescription?: string; targetRole?: string }) =>
    apiClient.post("/api/resumes/optimize", data),
  delete: (id: string) => apiClient.delete(`/api/resumes/${id}`),
  get: () => apiClient.get("/api/resume"),
  update: (data: Record<string, unknown>) => apiClient.patch("/api/resume", data),
  updateById: (id: string, data: Record<string, unknown>) => apiClient.patch(`/api/resumes/${id}`, data),
  generateSummary: (data: { prompt: string; currentSummary?: string; resumeData?: unknown }) =>
    apiClient.post("/api/resume/generate-summary", data),
  suggestTitle: (data: { title: string }) =>
    apiClient.post("/api/resume/ai-suggest-title", data),
  suggestAchievements: (data: { jobTitle: string; company: string; bullets?: string[]; existingAchievements?: string[] }) =>
    apiClient.post("/api/resume/suggest-achievements", data),
  matchSkills: (data: { jobTitle: string; experience?: string; skills?: string[] }) =>
    apiClient.post("/api/resume/match-skills", data),
  describeProject: (data: { projectName: string; technologies?: string[] }) =>
    apiClient.post("/api/resume/ai-describe-project", data),
  autoOptimize: (data: { resumeId?: string; roleId?: string; resumeData?: unknown; jobDescription?: string }) =>
    apiClient.post("/api/resume/auto-optimize", data),
  getAtsScore: (data: { resumeId?: string; roleId?: string; jobDescription?: string; resumeData?: unknown }) =>
    apiClient.post("/api/resume/ats-score", data),
  importPdf: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/resume/import-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  downloadPdf: () => apiClient.get("/api/resume/pdf", { responseType: "blob" }),
  downloadPdfById: (id: string) => apiClient.get(`/api/resumes/${id}/pdf`, { responseType: "blob" }),
  downloadDocx: () => apiClient.get("/api/resume/docx", { responseType: "blob" }),
  downloadDocxById: (id: string) => apiClient.get(`/api/resumes/${id}/docx`, { responseType: "blob" }),
  downloadTxt: (id: string) => apiClient.get(`/api/resumes/${id}/txt`, { responseType: "blob" }),
  getVersions: (id: string) => apiClient.get(`/api/resumes/${id}/versions`),
  restoreVersion: (id: string, versionId: string) => apiClient.post(`/api/resumes/${id}/restore/${versionId}`, {}),
};

export const jobApi = {
  search: (query: string, params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/search", { params: { q: query, ...params } }),
  getById: (id: string) => apiClient.get(`/api/jobs/${id}`),
  getRecommended: (params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/recommendations", { params }),
  list: (params?: Record<string, unknown>) => apiClient.get("/api/jobs", { params }),
  getSaved: () => apiClient.get("/api/saved-jobs"),
  recommendations: (params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/recommendations", { params }),
  save: (jobId: string) => apiClient.post("/api/saved-jobs", { jobId }),
  unsave: (savedJobId: string) => apiClient.delete(`/api/saved-jobs/${savedJobId}`),
};

export const applicationApi = {
  getAll: () => apiClient.get("/api/applications"),
  create: (data: Record<string, unknown>) => apiClient.post("/api/applications", data),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.patch(`/api/applications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/applications/${id}`),
  getStats: () => apiClient.get("/api/applications/stats"),
};

export const skillApi = {
  get: () => apiClient.get("/api/skills"),
};

export const skillGapApi = {
  analyze: (targetRole: string) =>
    apiClient.post("/api/skills/analyze", { targetRole }),
  getRoadmap: (role: string) => apiClient.get(`/api/skills/roadmap/${role}`),
  trackProgress: (skillId: string, progress: number) =>
    apiClient.patch(`/api/skills/${skillId}/progress`, { progress }),
};

export const progressApi = {
  getDashboardStats: () => apiClient.get("/api/progress"),
  get: () => apiClient.get("/api/progress"),
  getPPS: () => apiClient.get("/api/progress/pps"),
  getStreak: () => apiClient.get("/api/progress/streak"),
  updateActivity: (activity: string) =>
    apiClient.post("/api/progress/activity", { activity }),
};

export const milestonesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/api/milestones", { params }),
};

export const recommendedJobsApi = {
  getRecommended: (params?: Record<string, unknown>) =>
    apiClient.get("/api/jobs/recommended", { params }),
};

export const notificationApi = {
  getAll: () => apiClient.get("/api/notifications"),
  markRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
  markAllRead: () => apiClient.patch("/api/notifications/read-all"),
  register: (data: Record<string, unknown>) =>
    apiClient.post("/api/notifications/register", data),
};

export default apiClient;