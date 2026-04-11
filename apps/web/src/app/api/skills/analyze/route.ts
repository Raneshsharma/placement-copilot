import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      data: {
        skills: [
          { name: "React", level: 85, target: 90, category: "Frontend" },
          { name: "TypeScript", level: 78, target: 85, category: "Frontend" },
          { name: "Node.js", level: 65, target: 80, category: "Backend" },
        ],
        gaps: [
          { skill: "System Design", gap: 30, priority: "High" },
          { skill: "AWS", gap: 30, priority: "High" },
        ],
      },
    });
  } catch {
    return NextResponse.json({ data: {} });
  }
}
