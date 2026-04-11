import { NextRequest, NextResponse } from "next/server";

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "interview", message: "Interview with Google in 2 days", read: false, createdAt: "2026-04-08" },
  { id: "n2", type: "application", message: "Your application to Stripe is under review", read: false, createdAt: "2026-04-07" },
  { id: "n3", type: "skill", message: "3 new roles match your profile above 80%", read: true, createdAt: "2026-04-05" },
];

export async function GET() {
  return NextResponse.json({ data: MOCK_NOTIFICATIONS });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ data: { ...body, updated: true } });
  } catch {
    return NextResponse.json({ data: { updated: true } });
  }
}
