import { NextRequest, NextResponse } from "next/server";

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { statusCode: 400, message: "Refresh token required", error: { message: "Refresh token is required" } },
        { status: 400 }
      );
    }

    const newAccessToken = generateToken();
    const newRefreshToken = generateToken();

    const response = NextResponse.json({
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });

    response.cookies.set("accessToken", newAccessToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 86400 });
    response.cookies.set("refreshToken", newRefreshToken, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 604800 });

    return response;
  } catch {
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error", error: { message: "Token refresh failed" } },
      { status: 500 }
    );
  }
}
