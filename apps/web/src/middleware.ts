import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check cookie-based auth (set by login/register flows)
  const token = request.cookies.get("auth-token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isOnboardingEntry = request.nextUrl.pathname === "/onboarding/entry";
  const isOnboardingConfirm = request.nextUrl.pathname === "/onboarding/confirm";
  const isWorkspace = request.nextUrl.pathname === "/workspace";
  const isDemoLogin = request.nextUrl.pathname.startsWith("/api/auth/demo-login");

  // Allow auth pages and onboarding entry through; protected pages require auth token cookie
  if (!token && !isAuthPage && !isOnboardingEntry && !isOnboardingConfirm && !isWorkspace && !isDemoLogin && request.nextUrl.pathname !== "/") {
    // Redirect to demo login to set cookie server-side, then return to intended page
    const redirectUrl = new URL("/api/auth/demo-login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
