import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      data: {
        summary: "Results-driven software engineer with a strong track record of delivering high-quality, scalable solutions. Skilled in modern web technologies and committed to continuous learning and improvement.",
      },
    });
  } catch {
    return NextResponse.json({ data: { summary: "Professional summary could not be generated." } });
  }
}
