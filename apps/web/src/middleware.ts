import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isOnboardingEntry = pathname === "/onboarding/entry";
  const isOnboardingConfirm = pathname === "/onboarding/confirm";
  const isWorkspace = pathname === "/workspace";

  // Demo-login page handler: set cookie server-side then redirect
  if (pathname === "/auth/demo-login") {
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

  if (!token && !isAuthPage && !isOnboardingEntry && !isOnboardingConfirm && !isWorkspace && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
