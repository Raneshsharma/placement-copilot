import { NextResponse } from "next/server";

// Returns a JSON blob of all demo user data for export
export async function GET() {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    user: {
      id: "demo-user-id",
      email: "demo@placementcopilot.com",
      firstName: "Demo",
      lastName: "User",
    },
    profile: {
      headline: "Demo User",
      summary: "",
      location: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      targetRole: "",
      yearsExperience: 0,
    },
    resumes: [],
    applications: [],
    skills: [],
    savedJobs: [],
    milestones: [],
    notifications: [],
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="placement-copilot-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
