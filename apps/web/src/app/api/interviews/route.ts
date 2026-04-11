import { NextRequest, NextResponse } from "next/server";

const MOCK_SESSIONS = [
  { id: "s1", type: "behavioral", status: "COMPLETED", score: 78, date: "2026-04-05", duration: 18, role: "Product Manager", company: "Stripe" },
  { id: "s2", type: "technical", status: "COMPLETED", score: 65, date: "2026-04-02", duration: 42, role: "Software Engineer", company: "Google" },
  { id: "s3", type: "mixed", status: "COMPLETED", score: 82, date: "2026-03-28", duration: 28, role: "Frontend Engineer", company: "Meta" },
];

export async function GET() {
  return NextResponse.json({ data: MOCK_SESSIONS });
}
