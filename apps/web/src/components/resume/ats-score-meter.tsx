"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSScoreMeterProps {
  score: number;
  showZones?: boolean;
  className?: string;
}

const zones = [
  { max: 40, label: "Needs Work", colorClass: "text-error" },
  { max: 60, label: "Below Avg", colorClass: "text-warning" },
  { max: 80, label: "Good", colorClass: "text-warning" },
  { max: 90, label: "Great", colorClass: "text-success" },
  { max: 100, label: "Excellent", colorClass: "text-success" },
];

function getZoneColorClass(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-error";
}

export function ATSScoreMeter({ score, showZones = false, className }: ATSScoreMeterProps) {
  const colorClass = getZoneColorClass(score);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-on-surface">ATS Score</span>
        </div>
        <span className={cn("text-2xl font-bold font-display", colorClass)}>
          {score}
        </span>
      </div>
      <div className="relative h-3 bg-surface-container-low rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", colorClass)}
          style={{ width: `${score}%`, backgroundColor: "currentColor" }}
        />
      </div>
      {showZones && (
        <div className="flex justify-between">
          {zones.map((zone) => (
            <span key={zone.max} className={cn("text-[9px]", zone.colorClass)}>
              {zone.label}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-on-surface-variant">
        {score >= 80 ? "Highly optimized for ATS systems" :
         score >= 60 ? "Good ATS compatibility, minor improvements possible" :
         "Needs optimization to pass ATS screening"}
      </p>
    </div>
  );
}