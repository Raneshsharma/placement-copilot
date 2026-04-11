"use client";

import { Card } from "@/components/ui/card";
import { Target, AlertTriangle, TrendingUp } from "lucide-react";

interface CriticalGap {
  skill: string;
  gap: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

interface SkillGapSummaryProps {
  totalGaps: number;
  priorityScore: number;
  criticalGaps: CriticalGap[];
  topCategory?: string;
}

export function SkillGapSummary({ totalGaps, priorityScore, criticalGaps, topCategory }: SkillGapSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 text-center border-border shadow-card">
        <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-glow-sm">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold font-display text-text-primary">{totalGaps}</p>
        <p className="text-xs text-text-tertiary">Total Gaps</p>
      </Card>

      <Card className="p-4 text-center border-border shadow-card">
        <div className="w-10 h-10 rounded-[6px] bg-error/10 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle className="w-5 h-5 text-error" />
        </div>
        <p className="text-2xl font-bold font-display text-text-primary">{priorityScore}</p>
        <p className="text-xs text-text-tertiary">Priority Score</p>
      </Card>

      <Card className="p-4 text-center border-border shadow-card">
        <div className="w-10 h-10 rounded-[6px] bg-success/10 flex items-center justify-center mx-auto mb-2">
          <TrendingUp className="w-5 h-5 text-success" />
        </div>
        <p className="text-2xl font-bold font-display text-text-primary">{criticalGaps.length}</p>
        <p className="text-xs text-text-tertiary">Critical Gaps</p>
      </Card>

      <Card className="p-4 text-center border-border shadow-card">
        <div className="w-10 h-10 rounded-[6px] bg-accent/10 flex items-center justify-center mx-auto mb-2">
          <Target className="w-5 h-5 text-accent" />
        </div>
        <p className="text-sm font-bold font-display text-text-primary truncate px-1">{topCategory || "All"}</p>
        <p className="text-xs text-text-tertiary">Top Category</p>
      </Card>
    </div>
  );
}
