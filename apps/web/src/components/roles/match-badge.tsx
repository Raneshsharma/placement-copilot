"use client";

import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface MatchBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchBadge({ score, size = "sm" }: MatchBadgeProps) {
  const color = score >= 85 ? "#22C55E" : score >= 70 ? "#F59E0B" : "#9CA3AF";
  const bg = score >= 85 ? "bg-[#22C55E]/10" : score >= 70 ? "bg-[#F59E0B]/10" : "bg-[#F4F4F2]";
  const textColor = score >= 85 ? "text-[#22C55E]" : score >= 70 ? "text-[#F59E0B]" : "text-[#9CA3AF]";

  return (
    <Badge className={`${bg} ${textColor} ${size === "lg" ? "text-sm px-3" : "text-xs"} gap-1`}>
      {score >= 85 && <Zap className="w-3 h-3" />}
      {score}% match
    </Badge>
  );
}
