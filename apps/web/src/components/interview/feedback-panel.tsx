"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "./score-ring";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface FeedbackAnswer {
  q: string;
  a: string;
  score: number;
  feedback?: string;
}

interface FeedbackPanelProps {
  answers: FeedbackAnswer[];
  overall: number;
  onPracticeAgain?: () => void;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary w-28">{label}</span>
      <div className="flex-1 h-2 bg-surfaceContainer rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export function FeedbackPanel({ answers, overall, onPracticeAgain }: FeedbackPanelProps) {
  const dimensions = [
    { label: "Clarity", score: Math.min(overall + 5, 98), color: "#f2ca50" },
    { label: "Structure", score: Math.max(overall - 3, 10), color: "#7C6BB2" },
    { label: "Specificity", score: Math.min(overall + 2, 98), color: "#22C55E" },
    { label: "Confidence", score: Math.max(overall - 5, 10), color: "#f2cc00" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center p-6 bg-surface rounded-xl border border-border">
        <div className="flex justify-center mb-3">
          <ScoreRing score={overall} size={120} label="Overall" />
        </div>
        <p className="text-4xl font-bold text-primary">{overall}</p>
        <p className="text-sm text-text-secondary">Overall Score</p>
        <p className="text-xs text-text-tertiary mt-2">
          {overall >= 80 ? "Excellent! You demonstrated strong interview skills." :
           overall >= 60 ? "Good performance. Keep practicing to improve." :
           "Keep practicing. Focus on structure and specific examples."}
        </p>
      </div>

      <Card className="p-4 border-border shadow-card">
        <h3 className="font-semibold text-text-primary mb-4">Score Breakdown</h3>
        <div className="space-y-3">
          {dimensions.map((d) => (
            <ScoreBar key={d.label} label={d.label} score={d.score} color={d.color} />
          ))}
        </div>
      </Card>

      <Card className="p-4 border-border shadow-card">
        <h3 className="font-semibold text-text-primary mb-4">Question Analysis</h3>
        <div className="space-y-4">
          {answers.map((a, i) => (
            <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={a.score >= 75 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                  Q{i + 1}: {a.score}/100
                </Badge>
              </div>
              <p className="text-sm font-medium text-text-primary mb-1">{a.q}</p>
              {a.a && <p className="text-sm text-text-secondary italic mb-2">"{a.a}"</p>}
              <p className="text-xs text-text-tertiary">
                {a.feedback || (
                  a.score >= 75 ? "Strong answer with clear examples and structure." :
                  a.score >= 50 ? "Good attempt. Consider adding more specific outcomes." :
                  "Try the STAR method: Situation, Task, Action, Result."
                )}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/interview"}>
          Back to Hub
        </Button>
        <Button className="flex-1" onClick={onPracticeAgain}>
          <RefreshCw className="w-4 h-4 mr-2" /> Practice Again
        </Button>
      </div>
    </div>
  );
}
