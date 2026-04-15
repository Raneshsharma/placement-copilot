import { NextRequest, NextResponse } from "next/server";

// Internal route used by E2E tests to set auth state in browser localStorage.
// Not linked from anywhere — purely for test infrastructure.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const refresh = searchParams.get("refresh");
  const email = searchParams.get("email");

  const html = `<!DOCTYPE html><html><head><title>Auth Helper</title></head><body>
<script>
  try {
    if ("${token}") {
      localStorage.setItem("accessToken", "${token}");
      localStorage.setItem("refreshToken", "${refresh || ""}");
      localStorage.setItem("user", JSON.stringify({ email: "${email || ""}" }));
      // Also set the Zustand persist store shape
      localStorage.setItem("auth-storage", JSON.stringify({
        state: {
          token: "${token}",
          refreshToken: "${refresh || ""}",
          accessToken: "${token}",
          isAuthenticated: true,
          user: { email: "${email || ""}" }
        },
        version: 0
      }));
    }
    document.title = "Auth Set";
  } catch(e) {
    document.title = "Error: " + e.message;
  }
<\/script>
<p>Auth state set. You can close this tab.</p>
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html", "Cache-Control": "no-store" },
  });
}
