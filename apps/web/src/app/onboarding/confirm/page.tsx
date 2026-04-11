"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    // After onboarding, redirect to the workspace
    router.replace("/workspace");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-manrope)", fontSize: "18px", color: "#57534E" }}>
        Setting up your workspace...
      </div>
    </div>
  );
}
