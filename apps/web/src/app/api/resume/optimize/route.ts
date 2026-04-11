import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    data: {
      message: "Resume optimized for ATS. 95% keyword match achieved.",
      matchScore: 95,
    },
  });
}
