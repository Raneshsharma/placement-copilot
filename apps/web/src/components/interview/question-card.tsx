"use client";

import { Badge } from "@/components/ui/badge";

type Difficulty = "Easy" | "Medium" | "Hard";

interface QuestionCardProps {
  question: string;
  difficulty: Difficulty;
  category?: string;
  number: number;
  total: number;
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-error/10 text-error border-error/20",
};

export function QuestionCard({ question, difficulty, category, number, total }: QuestionCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-text-tertiary font-medium">
          Question {number} of {total}
        </span>
        <Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>
        {category && (
          <Badge variant="secondary">{category}</Badge>
        )}
      </div>
      <p className="text-text-primary font-medium leading-relaxed">{question}</p>
    </div>
  );
}
