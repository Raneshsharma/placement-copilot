import { NextRequest, NextResponse } from "next/server";

const MOCK_USERS: Record<string, { id: string; email: string; firstName: string; lastName: string; role: string }> = {
  "demo-user-id": { id: "demo-user-id", email: "demo@placementcopilot.com", firstName: "Demo", lastName: "User", role: "USER" },
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ statusCode: 401, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: MOCK_USERS["demo-user-id"] });
}
