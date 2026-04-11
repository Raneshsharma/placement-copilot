import { NextRequest, NextResponse } from "next/server";

const QUESTIONS_BEHAVIORAL = [
  "Tell me about a time you had to deal with a difficult teammate. How did you handle it?",
  "Describe a situation where you had to meet a tight deadline. What was your approach?",
  "Share an example of when you received critical feedback. How did you respond?",
];

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (params.id === "new") {
    return NextResponse.json({ data: { id: "new", questions: QUESTIONS_BEHAVIORAL } });
  }
  return NextResponse.json({
    data: {
      id: params.id,
      type: "behavioral",
      status: "IN_PROGRESS",
      questions: QUESTIONS_BEHAVIORAL,
    },
  });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: { id: params.id, ended: true, score: Math.floor(60 + Math.random() * 35) } });
}
