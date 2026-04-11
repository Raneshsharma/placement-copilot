import { NextRequest, NextResponse } from "next/server";

const MOCK_APPLICATIONS = [
  { id: "app-1", company: "Google", role: "Software Engineer", status: "INTERVIEW", logo: "G", appliedAt: "2026-04-05", match: 92 },
  { id: "app-2", company: "Stripe", role: "Product Manager", status: "UNDER_REVIEW", logo: "S", appliedAt: "2026-04-07", match: 88 },
  { id: "app-3", company: "Notion", role: "UX Designer", status: "SUBMITTED", logo: "N", appliedAt: "2026-04-08", match: 85 },
];

export async function GET() {
  return NextResponse.json({ data: MOCK_APPLICATIONS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ data: { id: `app-${Date.now()}`, ...body, status: "SUBMITTED", appliedAt: new Date().toISOString().split("T")[0] } });
  } catch {
    return NextResponse.json({ data: { id: `app-${Date.now()}`, status: "SUBMITTED" } });
  }
}
