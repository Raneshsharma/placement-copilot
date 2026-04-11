import { NextRequest, NextResponse } from "next/server";

export async function PATCH(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: { id: params.id, updated: true } });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: { id: params.id, deleted: true } });
}
