import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isOnboardingEntry = pathname === "/onboarding/entry";
  const isOnboardingConfirm = pathname === "/onboarding/confirm";
  const isWorkspace = pathname === "/workspace";
  const isDemoLogin = pathname === "/auth/demo-login";

  if (!token && !isAuthPage && !isOnboardingEntry && !isOnboardingConfirm && !isWorkspace && pathname !== "/" && !isDemoLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
