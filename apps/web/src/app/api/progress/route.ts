import { NextResponse } from "next/server";

const MOCK_PROGRESS = {
  streak: 3,
  weeklyApplications: 5,
  ppsScore: 78,
  ppsBreakdown: { profile: 80, skills: 65, resume: 85, interview: 72 },
  stats: [
    { label: "Active Applications", value: 5, trend: "+2" },
    { label: "Interviews Scheduled", value: 1, trend: "+1" },
    { label: "Match Score", value: "78%", trend: "+5%" },
    { label: "Skills Gap Closed", value: "3/10", trend: "+2" },
  ],
  weeklyActivity: [40, 65, 45, 80, 55, 70, 90],
};

export async function GET() {
  return NextResponse.json({ data: MOCK_PROGRESS });
}
