"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BookOpen } from "lucide-react";

interface GapCardProps {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: "High" | "Medium" | "Low";
  reason: string;
  category?: string;
  resourcesCount: number;
}

export function GapCard({ skill, currentLevel, targetLevel, priority, reason, category, resourcesCount }: GapCardProps) {
  const gap = targetLevel - currentLevel;
  const priorityColor = priority === "High" ? "#EF4444" : priority === "Medium" ? "#F59E0B" : "#22C55E";
  const priorityBg = priority === "High" ? "bg-[#EF4444]/10" : priority === "Medium" ? "bg-[#F59E0B]/10" : "bg-[#22C55E]/10";
  const priorityText = priority === "High" ? "text-[#EF4444]" : priority === "Medium" ? "text-[#F59E0B]" : "text-[#22C55E]";

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-[#1A1A2E]">{skill}</h3>
            <Badge className={`${priorityBg} ${priorityText} text-xs`}>{priority} Priority</Badge>
            {category && <Badge className="bg-[#E8E8E6] text-[#5C5C6D] text-xs">{category}</Badge>}
          </div>
          <p className="text-sm text-[#5C5C6D] mb-3">{reason}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#5C5C6D]">Current: {currentLevel}%</span>
                <span className="text-xs text-[#5C5C6D]">Target: {targetLevel}%</span>
              </div>
              <div className="h-2 bg-[#E8E8E6] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#0D7377]" style={{ width: `${(currentLevel / targetLevel) * 100}%` }} />
                <div className="h-full bg-[#E8E8E6] flex-1" />
              </div>
            </div>
            <span className="text-sm font-bold text-[#EF4444] shrink-0">-{gap}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-10 h-10 rounded-lg bg-[#7C6BB2]/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#7C6BB2]" />
          </div>
          <span className="text-xs text-[#5C5C6D]">{resourcesCount} resources</span>
        </div>
      </div>
    </Card>
  );
}
