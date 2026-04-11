"use client";

import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface MatchBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchBadge({ score, size = "sm" }: MatchBadgeProps) {
  const variant = score >= 90 ? "success" : score >= 70 ? "warning" : "default";
  const showZap = score >= 70;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded font-medium",
        size === "lg" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5",
        variant === "success" && "bg-success/12 text-success",
        variant === "warning" && "bg-warning/12 text-warning",
        variant === "default" && "bg-surface-container-low text-on-surface-variant"
      )}
    >
      {showZap && <Zap className="w-3 h-3" />}
      {score}% match
    </span>
  );
}