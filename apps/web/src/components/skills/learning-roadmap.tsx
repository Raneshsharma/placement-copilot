"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Award, Clock } from "lucide-react";

export type ResourceType = "Course" | "Book" | "Certification" | "Article";

interface Resource {
  title: string;
  platform: string;
  type: ResourceType;
  duration: string;
  url?: string;
  progress?: number;
}

interface RoadmapStep {
  weeks: string;
  title: string;
  description: string;
  color: string;
  resources: Resource[];
}

interface LearningRoadmapProps {
  steps: RoadmapStep[];
}

const typeIcon = (type: ResourceType) => {
  switch (type) {
    case "Course": return <Play className="w-3.5 h-3.5 text-primary" />;
    case "Book": return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
    case "Certification": return <Award className="w-3.5 h-3.5 text-orange-400" />;
    default: return <Clock className="w-3.5 h-3.5 text-text-tertiary" />;
  }
};

export function LearningRoadmap({ steps }: LearningRoadmapProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="border-l-2 pl-6 space-y-3" style={{ borderColor: step.color }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color }} />
            <span className="font-semibold text-text-primary">{step.weeks}: {step.title}</span>
          </div>
          <p className="text-sm text-text-secondary">{step.description}</p>
          <div className="space-y-2">
            {step.resources.map((r) => (
              <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-surfaceContainer border border-border hover:border-primary/20 transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: step.color + "20" }}
                >
                  {typeIcon(r.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{r.title}</p>
                  <p className="text-xs text-text-tertiary">{r.platform} &middot; {r.type} &middot; {r.duration}</p>
                </div>
                {r.progress !== undefined && r.progress > 0 ? (
                  <div className="flex items-center gap-2 w-24">
                    <Progress value={r.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-text-tertiary">{r.progress}%</span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">Start</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
