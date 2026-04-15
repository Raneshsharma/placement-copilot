import axios from "axios";

// Supabase project reference
const SUPABASE_PROJECT_REF = "drhbfttubncvlhljqnsy";
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
const SUPABASE_EDGE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

// For server-side API routes (auth, profile, etc.), use relative URLs
const getBaseURL = (path: string) => {
  // Auth endpoints - use Next.js API routes (Supabase Auth is client-side)
  if (path.startsWith("/api/auth")) {
    return ""; // Use relative URL
  }
  // Edge Functions - use Supabase Edge Functions
  if (path.startsWith("/api/profile")) {
    return `${SUPABASE_EDGE_FUNCTIONS_URL}/profile`;
  }
  if (path.startsWith("/api/resume")) {
    return `${SUPABASE_EDGE_FUNCTIONS_URL}/resume`;
  }
  if (path.startsWith("/api/skills")) {
    return `${SUPABASE_EDGE_FUNCTIONS_URL}/skills`;
  }
  if (path.startsWith("/api/jobs") || path.startsWith("/api/applications")) {
    return `${SUPABASE_EDGE_FUNCTIONS_URL}/jobs`;
  }
  if (path.startsWith("/api/progress") || path.startsWith("/api/notifications")) {
    return `${SUPABASE_EDGE_FUNCTIONS_URL}/jobs`; // Reuse jobs function
  }
  // External services
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_AI_URL || "";
};

const apiClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 30000,
});

// Custom request interceptor to set baseURL per request
apiClient.interceptors.request.use(
  (config) => {
    const path = config.url || "";

    // Set baseURL based on the request path
    if (path.startsWith("/api/auth")) {
      config.baseURL = ""; // Use relative URL for auth
    } else if (path.startsWith("/api/profile")) {
      config.baseURL = `${SUPABASE_EDGE_FUNCTIONS_URL}/profile`;
    } else if (path.startsWith("/api/resume")) {
      config.baseURL = `${SUPABASE_EDGE_FUNCTIONS_URL}/resume`;
    } else if (path.startsWith("/api/skills")) {
      config.baseURL = `${SUPABASE_EDGE_FUNCTIONS_URL}/skills`;
    } else if (path.startsWith("/api/jobs") || path.startsWith("/api/applications")) {
      config.baseURL = `${SUPABASE_EDGE_FUNCTIONS_URL}/jobs`;
    } else if (path.startsWith("/api/progress") || path.startsWith("/api/notifications")) {
      config.baseURL = `${SUPABASE_EDGE_FUNCTIONS_URL}/jobs`;
    }

    // Get token from localStorage
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
    apiClient.post("/api/auth/refresh", { refreshToken: token }),
  logout: () => apiClient.post("/api/auth/logout"),
  googleAuth: (token: string) =>
    apiClient.post("/api/auth/google", { token }),
};

export const profileApi = {
  get: () => apiClient.get("/api/profile"),
  create: (data: Record<string, unknown>) => apiClient.post("/api/profile", data),
  update: (data: Record<string, unknown>) => apiClient.patch("/api/profile", data),
};

export const resumeApi = {
  getAll: () => apiClient.get("/api/resume"),
  getById: (id: string) => apiClient.get(`/api/resume/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/api/resume", data),
  update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/api/resume/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/resume/${id}`),
  generateSummary: (data: { prompt: string; currentSummary?: string; resumeData?: unknown }) =>
    apiClient.post("/api/resume/generate-summary", data),
  suggestAchievements: (data: { jobTitle: string; company: string; bullets?: string[]; existingAchievements?: string[] }) =>
    apiClient.post("/api/resume/suggest-achievements", data),
  getAtsScore: (data: { resumeId?: string; roleId?: string; jobDescription?: string; resumeData?: unknown }) =>
    apiClient.post("/api/resume/ats-score", data),
  optimize: (data: { resumeId?: string; jobDescription?: string; targetRole?: string; resumeData?: unknown }) =>
    apiClient.post("/api/resume/optimize", data),
};

export const jobApi = {
  list: () => apiClient.get("/api/jobs"),
  getById: (id: string) => apiClient.get(`/api/jobs/${id}`),
  search: (query: string) => apiClient.get("/api/jobs/search", { params: { q: query } }),
};

export const applicationApi = {
  getAll: () => apiClient.get("/api/applications"),
  create: (data: Record<string, unknown>) => apiClient.post("/api/applications", data),
  update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/api/applications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/applications/${id}`),
};

export const skillApi = {
  get: () => apiClient.get("/api/skills"),
  add: (data: { name: string; category?: string; proficiency?: number }) =>
    apiClient.post("/api/skills", data),
  analyze: (targetRole: string, currentSkills?: string[]) =>
    apiClient.post("/api/skills/analyze", { targetRole, currentSkills }),
};

export const progressApi = {
  get: () => apiClient.get("/api/progress"),
};

export const notificationApi = {
  getAll: () => apiClient.get("/api/notifications"),
};

export default apiClient;
