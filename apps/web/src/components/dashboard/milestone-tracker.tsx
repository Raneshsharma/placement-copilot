"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface Milestone {
  id: string;
  label: string;
  done: boolean;
  date?: string;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
}

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const completedCount = milestones.filter((m) => m.done).length;
  const progress = (completedCount / milestones.length) * 100;

  return (
    <Card className="p-5 border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Journey Milestones</h3>
        <span className="text-xs text-text-tertiary">{completedCount}/{milestones.length} complete</span>
      </div>

      <div className="h-2 bg-surfaceContainer rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {milestones.map((m, i) => (
          <div key={m.id} className="flex items-center gap-1.5 flex-shrink-0">
            {i > 0 && (
              <div className={`w-8 h-0.5 ${m.done ? "bg-primary" : "bg-border"}`} />
            )}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.done ? "bg-primary/15 shadow-glow-sm" : "bg-surfaceContainer"
            }`}>
              {m.done ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-text-tertiary" />
              )}
            </div>
            <span className={`text-xs font-medium ${m.done ? "text-text-primary" : "text-text-tertiary"}`}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
