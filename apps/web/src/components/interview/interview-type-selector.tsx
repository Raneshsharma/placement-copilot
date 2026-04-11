"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Users, Briefcase, LayoutGrid, Globe, Heart, Star } from "lucide-react";

export type InterviewType = "behavioral" | "technical" | "case_study" | "system_design" | "situational" | "cultural_fit" | "hybrid";

interface InterviewTypeOption {
  id: InterviewType;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  questions: number;
  color: string;
  bgColor: string;
}

const TYPES: InterviewTypeOption[] = [
  {
    id: "behavioral",
    title: "Behavioral",
    description: "STAR-method questions about your past experiences and soft skills",
    icon: Users,
    duration: "20 min",
    questions: 5,
    color: "#7C6BB2",
    bgColor: "bg-[#7C6BB2]/10",
  },
  {
    id: "technical",
    title: "Technical",
    description: "Coding challenges and system design problems relevant to your target role",
    icon: Code,
    duration: "45 min",
    questions: 3,
    color: "#0D7377",
    bgColor: "bg-[#0D7377]/10",
  },
  {
    id: "case_study",
    title: "Case Study",
    description: "Business case analysis and problem-solving scenarios",
    icon: Briefcase,
    duration: "30 min",
    questions: 2,
    color: "#FF6B35",
    bgColor: "bg-[#FF6B35]/10",
  },
  {
    id: "system_design",
    title: "System Design",
    description: "Design scalable distributed systems and architecture decisions",
    icon: LayoutGrid,
    duration: "45 min",
    questions: 2,
    color: "#F59E0B",
    bgColor: "bg-[#F59E0B]/10",
  },
  {
    id: "situational",
    title: "Situational",
    description: "Hypothetical scenarios testing decision-making and judgment",
    icon: Globe,
    duration: "20 min",
    questions: 4,
    color: "#22C55E",
    bgColor: "bg-[#22C55E]/10",
  },
  {
    id: "cultural_fit",
    title: "Cultural Fit",
    description: "Questions about values, work style, and team compatibility",
    icon: Heart,
    duration: "15 min",
    questions: 4,
    color: "#EF4444",
    bgColor: "bg-[#EF4444]/10",
  },
  {
    id: "hybrid",
    title: "Hybrid",
    description: "Combination of behavioral and technical questions for comprehensive practice",
    icon: Star,
    duration: "35 min",
    questions: 4,
    color: "#f2ca50",
    bgColor: "bg-primary/10",
  },
];

interface InterviewTypeSelectorProps {
  selected?: InterviewType;
  onSelect: (type: InterviewType) => void;
}

export function InterviewTypeSelector({ selected, onSelect }: InterviewTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {TYPES.map((type) => {
        const Icon = type.icon;
        return (
          <Card
            key={type.id}
            className={`p-5 cursor-pointer transition-all hover:shadow-md ${
              selected === type.id ? "ring-2" : ""
            }`}
            style={selected === type.id ? { ["--tw-ring-color" as string]: type.color } : {}}
            onClick={() => onSelect(type.id === selected ? type.id : type.id)}
          >
            <div className={`w-12 h-12 rounded-xl ${type.bgColor} flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" style={{ color: type.color }} />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{type.title}</h3>
            <p className="text-xs text-text-secondary mb-3">{type.description}</p>
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span>{type.duration}</span>
              <span>&middot;</span>
              <span>{type.questions} questions</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
