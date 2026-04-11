"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import {
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleSidebar, sidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-surface/85 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-[6px] hover:bg-surfaceContainer text-text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="font-display text-lg font-bold text-text-primary hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 h-9 bg-surfaceContainer border-border text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-[6px] hover:bg-surfaceContainer text-text-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-[6px] hover:bg-surfaceContainer transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/15 text-primary text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 text-text-tertiary hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-text-tertiary font-normal">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <HelpCircle className="w-4 h-4" /> Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 cursor-pointer text-error"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
