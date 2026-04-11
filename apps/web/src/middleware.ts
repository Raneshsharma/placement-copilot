import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check cookie-based auth (set by login/register flows)
  const token = request.cookies.get("auth-token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isOnboardingEntry = request.nextUrl.pathname === "/onboarding/entry";
  const isOnboardingConfirm = request.nextUrl.pathname === "/onboarding/confirm";
  const isWorkspace = request.nextUrl.pathname === "/workspace";

  // Allow auth pages and onboarding entry through; protected pages require auth token cookie
  if (!token && !isAuthPage && !isOnboardingEntry && !isOnboardingConfirm && !isWorkspace && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
