import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ data: { deleted: true, id: params.id } });
}
