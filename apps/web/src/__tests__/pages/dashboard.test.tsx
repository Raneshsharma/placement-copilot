import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../app/(dashboard)/dashboard/page";

// Mock dependencies
jest.mock("@/stores/auth-store", () => ({
  useAuthStore: () => ({
    user: { id: "1", email: "test@example.com", firstName: "John", lastName: "Doe", role: "user" },
  }),
}));

jest.mock("@/lib/api", () => ({
  progressApi: {
    get: jest.fn().mockResolvedValue({ data: null }),
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockProgressApi = require("@/lib/api").progressApi;

const MOCK_DASHBOARD = {
  streak: 3,
  weeklyApplications: 5,
  ppsScore: 78,
  ppsBreakdown: { profile: 80, skills: 65, resume: 85, interview: 72 },
  stats: [
    { label: "Active Applications", value: 5, trend: "+2", icon: "Briefcase", color: "#f2ca50" },
    { label: "Interviews Scheduled", value: 1, trend: "+1", icon: "Calendar", color: "#f2cc00" },
    { label: "Match Score", value: "78%", trend: "+5%", icon: "Target", color: "#e9c349" },
    { label: "Skills Gap Closed", value: "3/10", trend: "+2", icon: "TrendingUp", color: "#c6c6c6" },
  ],
  activeApplications: [
    { id: "1", company: "Google", role: "Software Engineer", status: "INTERVIEW", logo: "G", appliedAt: "2026-04-05", match: 92 },
  ],
  upcomingInterview: { date: "April 11, 2026", role: "Software Engineer", company: "Google" },
  roleRecommendations: [
    { id: "r1", company: "Meta", role: "Frontend Engineer", location: "Menlo Park, CA", salary: "$95k - $140k", match: 91, logo: "M" },
  ],
  weeklyActivity: [40, 65, 45, 80, 55, 70, 90],
  milestones: [
    { id: "m1", label: "Profile created", done: true, date: "Apr 1" },
    { id: "m2", label: "First application sent", done: true, date: "Apr 3" },
  ],
};

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard greeting", async () => {
    mockProgressApi.get.mockResolvedValue({ data: MOCK_DASHBOARD });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/good (morning|afternoon|evening)/i)).toBeInTheDocument();
    });
  });

  it("renders quick action cards", async () => {
    mockProgressApi.get.mockResolvedValue({ data: MOCK_DASHBOARD });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText("Build Resume")).toBeInTheDocument();
      expect(screen.getByText("Mock Interview")).toBeInTheDocument();
      expect(screen.getByText("Find Roles")).toBeInTheDocument();
      expect(screen.getByText("Skill Gap")).toBeInTheDocument();
    });
  });

  it("renders active applications section", async () => {
    mockProgressApi.get.mockResolvedValue({ data: MOCK_DASHBOARD });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText("Active Applications")).toBeInTheDocument();
    });
  });

  it("renders role recommendations section", async () => {
    mockProgressApi.get.mockResolvedValue({ data: MOCK_DASHBOARD });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText("Role Recommendations")).toBeInTheDocument();
    });
  });

  it("renders loading state initially", () => {
    mockProgressApi.get.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );
    render(<DashboardPage />);
    // Loading skeleton should be present
    expect(document.body.querySelector('[class*="animate-pulse"]')).toBeInTheDocument();
  });

  it("falls back to mock data when API fails", async () => {
    mockProgressApi.get.mockRejectedValue(new Error("API error"));
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/good (morning|afternoon|evening)/i)).toBeInTheDocument();
    });
  });

  it("renders milestones section", async () => {
    mockProgressApi.get.mockResolvedValue({ data: MOCK_DASHBOARD });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText("Journey Milestones")).toBeInTheDocument();
    });
  });
});
