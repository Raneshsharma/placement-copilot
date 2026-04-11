import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: { id: params.id, ended: true, score: Math.floor(60 + Math.random() * 35) } });
}
