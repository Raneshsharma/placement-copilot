"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface FeedbackAnswer {
  q: string;
  a: string;
  score: number;
}

interface FeedbackReportProps {
  answers: FeedbackAnswer[];
  overall: number;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#5C5C6D] w-28">{label}</span>
      <div className="flex-1 h-2 bg-[#E8E8E6] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export function FeedbackReport({ answers, overall }: FeedbackReportProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center p-6 bg-[#E8F6F6] rounded-xl">
        <div className="flex justify-center mb-3">
          <ScoreRing score={overall} size={100} />
        </div>
        <p className="text-4xl font-bold text-[#0D7377]">{overall}</p>
        <p className="text-sm text-[#5C5C6D]">Overall Score</p>
        <p className="text-xs text-[#5C5C6D] mt-2">
          {overall >= 80 ? "Excellent! You demonstrated strong interview skills." :
           overall >= 60 ? "Good performance. Keep practicing to improve." :
           "Keep practicing. Focus on structure and specific examples."}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#1A1A2E]">Score Breakdown</h3>
        <ScoreBar label="Clarity" score={overall + 5} color="#0D7377" />
        <ScoreBar label="Structure" score={overall - 3} color="#7C6BB2" />
        <ScoreBar label="Specificity" score={overall + 2} color="#22C55E" />
        <ScoreBar label="Confidence" score={overall - 5} color="#F59E0B" />
      </div>

      {/* Per question */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[#1A1A2E]">Question-by-Question Analysis</h3>
        {answers.map((a, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3 mb-2">
              <Badge className={a.score >= 75 ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}>
                Q{i + 1}: {a.score}/100
              </Badge>
            </div>
            <p className="text-sm font-medium text-[#1A1A2E] mb-1">{a.q}</p>
            <p className="text-sm text-[#5C5C6D] italic mb-2">"{a.a}"</p>
            <p className="text-xs text-[#5C5C6D]">
              {a.score >= 75 ? "Strong answer with clear examples and structure." :
               a.score >= 50 ? "Good attempt. Consider adding more specific outcomes." :
               "Try the STAR method: Situation, Task, Action, Result."}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/interview"}>
          Back to Hub
        </Button>
        <Button className="flex-1 bg-[#0D7377] hover:bg-[#0a5c5f]">
          <RefreshCw className="w-4 h-4 mr-2" /> Practice Again
        </Button>
      </div>
    </div>
  );
}
