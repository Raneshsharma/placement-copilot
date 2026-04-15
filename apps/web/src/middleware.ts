import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check cookie-based auth (set by login/register flows)
  const token = request.cookies.get("auth-token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isOnboardingEntry = request.nextUrl.pathname === "/onboarding/entry";
  const isOnboardingConfirm = request.nextUrl.pathname === "/onboarding/confirm";
  const isWorkspace = request.nextUrl.pathname === "/workspace";

  // For API routes (like /api/auth/demo-login), check auth-token cookie
  // and allow through even without token for public endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth/demo-login")) {
    // Set auth cookie and redirect to the intended page
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.set("auth-token", "demo-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  }

  // Allow auth pages and onboarding entry through; protected pages require auth token cookie
  if (!token && !isAuthPage && !isOnboardingEntry && !isOnboardingConfirm && !isWorkspace && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
