import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const score = Math.floor(60 + Math.random() * 35);
    return NextResponse.json({ data: { questionId: body.questionId, answer: body.answer, score } });
  } catch {
    return NextResponse.json({ data: { score: 75 } });
  }
}
