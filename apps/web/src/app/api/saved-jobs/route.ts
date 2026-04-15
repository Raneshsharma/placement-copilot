import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo mode
const savedJobs: Record<string, { id: string; jobId: string; savedAt: string }[]> = {};

export async function GET() {
  return NextResponse.json({ data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;
    const id = `saved_${Date.now()}`;
    const saved = { id, jobId, savedAt: new Date().toISOString() };
    return NextResponse.json({ data: saved });
  } catch {
    return NextResponse.json({ data: null }, { status: 400 });
  }
}
