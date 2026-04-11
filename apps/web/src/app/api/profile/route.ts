import { NextRequest, NextResponse } from "next/server";

const MOCK_PROFILE = {
  id: "demo-user-id",
  email: "demo@placementcopilot.com",
  firstName: "Demo",
  lastName: "User",
  role: "USER",
  headline: "Software Engineer | React & TypeScript | Building at scale",
  location: "San Francisco, CA",
  linkedIn: "linkedin.com/in/demo",
  github: "github.com/demo",
  targetRoles: ["Software Engineer", "Frontend Engineer"],
};

export async function GET() {
  return NextResponse.json({ data: MOCK_PROFILE });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ data: { ...MOCK_PROFILE, ...body } });
  } catch {
    return NextResponse.json({ data: MOCK_PROFILE });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ data: { ...MOCK_PROFILE, ...body } });
  } catch {
    return NextResponse.json({ data: MOCK_PROFILE });
  }
}
