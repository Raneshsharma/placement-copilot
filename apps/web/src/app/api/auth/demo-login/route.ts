import { NextRequest, NextResponse } from "next/server";

// Server-side demo login — sets auth cookie before middleware runs.
// Used by the dashboard layout to establish auth without going through login.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const response = NextResponse.redirect(new URL(redirectTo, request.url), 302);

  // Set auth cookie (like the real login flow does)
  response.cookies.set("auth-token", "demo-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
