import { NextRequest, NextResponse } from "next/server";

// In-memory user store for demo purposes
const DEMO_USERS: Record<string, { id: string; email: string; firstName: string; lastName: string; role: string; password: string }> = {
  "demo@placementcopilot.com": { id: "demo-user-id", email: "demo@placementcopilot.com", firstName: "Demo", lastName: "User", role: "USER", password: "demo123" },
  "alex@example.com": { id: "user-1", email: "alex@example.com", firstName: "Alex", lastName: "Johnson", role: "USER", password: "password123" },
};

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { statusCode: 400, message: "Email and password are required", error: { message: "Email and password are required" } },
        { status: 400 }
      );
    }

    const user = DEMO_USERS[email.toLowerCase()];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { statusCode: 401, message: "Invalid credentials", error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    const accessToken = generateToken();
    const refreshToken = generateToken();

    const response = NextResponse.json({
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
        accessToken,
        refreshToken,
      },
    });

    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 86400 });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("auth-token", accessToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 86400 });

    return response;
  } catch (err) {
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error", error: { message: "Login failed. Please try again." } },
      { status: 500 }
    );
  }
}
