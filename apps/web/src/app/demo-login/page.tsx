"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DemoLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/dashboard";
    // Set cookie client-side (less secure but works with Vercel protection)
    document.cookie = "auth-token=demo-token; path=/; max-age=604800; SameSite=Lax";
    // Also set in localStorage for client-side auth store
    localStorage.setItem("accessToken", "demo-token");
    localStorage.setItem("user", JSON.stringify({
      id: "demo-user-id",
      email: "demo@placementcopilot.com",
      firstName: "Demo",
      lastName: "User",
      role: "USER",
    }));
    router.replace(redirect);
  }, [router, searchParams]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#09090b", color: "#fafaf9" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #d97706", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontFamily: "system-ui", fontSize: "14px" }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
