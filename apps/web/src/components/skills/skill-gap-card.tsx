"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BookOpen } from "lucide-react";

export type GapType = "MISSING" | "WEAK" | "STALE";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface SkillGapCardProps {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  gapType: GapType;
  severity: Severity;
  reason?: string;
  category?: string;
  resourcesCount?: number;
}

const gapTypeColors: Record<GapType, string> = {
  MISSING: "bg-error/10 text-error border-error/20",
  WEAK: "bg-warning/10 text-warning border-warning/20",
  STALE: "bg-surfaceContainer text-text-secondary border-border",
};

const severityColors: Record<Severity, string> = {
  CRITICAL: "bg-error/10 text-error border-error/20",
  HIGH: "bg-error/10 text-error border-error/20",
  MEDIUM: "bg-warning/10 text-warning border-warning/20",
  LOW: "bg-success/10 text-success border-success/20",
};

export function SkillGapCard({
  skill, currentLevel, targetLevel, gapType, severity, reason, category, resourcesCount,
}: SkillGapCardProps) {
  const gap = targetLevel - currentLevel;
  const fillPercent = (currentLevel / targetLevel) * 100;

  return (
    <Card className="p-4 border-border shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-text-primary">{skill}</h3>
            <Badge className={gapTypeColors[gapType]}>{gapType}</Badge>
            <Badge className={severityColors[severity]}>{severity}</Badge>
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
          {reason && <p className="text-sm text-text-secondary mb-3">{reason}</p>}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-tertiary">Current: {currentLevel}%</span>
                <span className="text-xs text-text-tertiary">Target: {targetLevel}%</span>
              </div>
              <div className="h-2 bg-surfaceContainer rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(fillPercent, 100)}%` }}
                />
                <div className="h-full bg-surfaceContainer flex-1" />
              </div>
            </div>
            <span className="text-sm font-bold text-error shrink-0">-{gap}%</span>
          </div>
        </div>
        {resourcesCount !== undefined && (
          <div className="flex flex-col items-center gap-1 text-center shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-text-tertiary">{resourcesCount}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
