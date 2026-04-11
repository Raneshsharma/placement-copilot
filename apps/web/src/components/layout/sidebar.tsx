"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mic,
  ClipboardList,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/roles", icon: Briefcase, label: "Roles" },
  { href: "/resume", icon: FileText, label: "Resume" },
  { href: "/interview", icon: Mic, label: "Interview" },
  { href: "/applications", icon: ClipboardList, label: "Applications" },
  { href: "/skills", icon: Target, label: "Skills" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300",
        "bg-surface-container-low border-r border-outline-variant",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-outline-variant">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-hero flex items-center justify-center shadow-ambient-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-on-surface">Copilot</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-9 h-9 rounded-lg bg-hero flex items-center justify-center shadow-ambient-sm mx-auto">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all duration-200",
            sidebarCollapsed && "absolute -right-3.5 top-8 bg-surface-container-highest border border-outline-variant shadow-ambient-sm"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-ambient-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-outline-variant">
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-secondary-onContainer">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-on-surface truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
