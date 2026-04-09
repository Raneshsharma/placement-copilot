"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Award, Clock } from "lucide-react";

interface Resource {
  title: string;
  platform: string;
  type: "Course" | "Book" | "Certification" | "Article";
  duration: string;
  url: string;
  progress: number;
}

interface RoadmapStep {
  weeks: string;
  title: string;
  description: string;
  color: string;
  resources: Resource[];
}

interface RoadmapProps {
  steps: RoadmapStep[];
}

const typeIcon = (type: Resource["type"]) => {
  switch (type) {
    case "Course": return <Play className="w-3.5 h-3.5 text-[#0D7377]" />;
    case "Book": return <BookOpen className="w-3.5 h-3.5 text-[#7C6BB2]" />;
    case "Certification": return <Award className="w-3.5 h-3.5 text-[#FF6B35]" />;
    default: return <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />;
  }
};

export function Roadmap({ steps }: RoadmapProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="border-l-2 pl-6 space-y-3" style={{ borderColor: step.color }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color }} />
            <span className="font-semibold text-[#1A1A2E]">{step.weeks}: {step.title}</span>
          </div>
          <p className="text-sm text-[#5C5C6D]">{step.description}</p>
          <div className="space-y-2">
            {step.resources.map((r) => (
              <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: step.color + "20" }}>
                  {typeIcon(r.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A2E] truncate">{r.title}</p>
                  <p className="text-xs text-[#5C5C6D]">{r.platform} · {r.type} · {r.duration}</p>
                </div>
                {r.progress > 0 ? (
                  <div className="flex items-center gap-2 w-24">
                    <Progress value={r.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-[#5C5C6D]">{r.progress}%</span>
                  </div>
                ) : (
                  <Button size="sm" variant="outline">Start</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
