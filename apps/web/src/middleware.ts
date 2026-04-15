import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/roles/:path*", "/resume/:path*", "/settings/:path*", "/skills/:path*", "/interview/:path*"],
};
