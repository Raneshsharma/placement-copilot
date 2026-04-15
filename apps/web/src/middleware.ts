import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware: pass ALL requests through without redirecting.
// Client-side auth is handled in dashboard layout via useEffect with mock user.
// Vercel deployment protection blocks all redirects to /login.
export function middleware(request: NextRequest) {
  // Allow /login through normally — don't redirect to /login from /login
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
