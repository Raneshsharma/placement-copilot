"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const { sidebarCollapsed } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  // Bypass auth for demo — cookie is now set server-side by /api/auth/demo-login
  useEffect(() => {
    if (!isAuthenticated) {
      const mockUser = {
        id: "demo-user-id",
        email: "demo@placementcopilot.com",
        firstName: "Demo",
        lastName: "User",
        role: "USER",
      };
      login(mockUser, "demo-token", "demo-refresh-token");
    }
  }, [isAuthenticated, login]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-display text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className={cn("flex-1 min-h-screen pb-20 lg:pb-0 lg:transition-all lg:duration-300 flex flex-col", sidebarCollapsed ? "lg:ml-16" : "lg:ml-60")}>
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
