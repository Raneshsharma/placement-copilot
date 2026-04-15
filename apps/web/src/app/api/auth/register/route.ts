import { NextRequest, NextResponse } from "next/server";

const DEMO_USERS: Record<string, { id: string; email: string; firstName: string; lastName: string; role: string; password: string }> = {
  "demo@placementcopilot.com": { id: "demo-user-id", email: "demo@placementcopilot.com", firstName: "Demo", lastName: "User", role: "USER", password: "Demo1234!" },
};

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { statusCode: 400, message: "All fields are required", error: { message: "All fields are required" } },
        { status: 400 }
      );
    }

    const existingUser = DEMO_USERS[email.toLowerCase()];
    if (existingUser) {
      return NextResponse.json(
        { statusCode: 409, message: "Email already in use", error: { message: "An account with this email already exists" } },
        { status: 409 }
      );
    }

    const userId = `user_${Date.now()}`;
    const accessToken = generateToken();
    const refreshToken = generateToken();

    DEMO_USERS[email.toLowerCase()] = { id: userId, email, firstName, lastName, role: "USER", password };

    const response = NextResponse.json({
      data: {
        user: { id: userId, email, firstName, lastName, role: "USER" },
        accessToken,
        refreshToken,
      },
    });

    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 86400 });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("auth-token", accessToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 86400 });

    return response;
  } catch {
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error", error: { message: "Registration failed. Please try again." } },
      { status: 500 }
    );
  }
}
