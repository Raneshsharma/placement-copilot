import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = `session-${Date.now()}`;
    return NextResponse.json({ data: { id: sessionId, type: body.type || "behavioral", status: "IN_PROGRESS" } });
  } catch {
    return NextResponse.json({ data: { id: `session-${Date.now()}`, status: "IN_PROGRESS" } });
  }
}
