"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Send,
  RefreshCw,
} from "lucide-react";

const QUESTIONS_BEHAVIORAL = [
  "Tell me about a time you had to deal with a difficult teammate. How did you handle it?",
  "Describe a situation where you had to meet a tight deadline. What was your approach?",
  "Share an example of when you received critical feedback. How did you respond?",
  "Talk about a project where you had to learn something new quickly.",
  "Describe a time you went above and beyond for a customer or stakeholder.",
];

const QUESTIONS_TECHNICAL = [
  "Design a URL shortening service like Bitly. What APIs and data structures would you use?",
  "Write a function to detect if a string has all unique characters. What is the time complexity?",
  "Explain how you would scale a chat application to support 10 million users.",
];

const QUESTIONS_MIXED = [
  "Tell me about a time you solved a complex technical problem under pressure.",
  "Walk me through your approach to debugging a production issue at 2am.",
  "Describe your ideal engineering team culture and how you'd contribute to it.",
  "If you had to rewrite one system from your past projects, what would it be and why?",
];

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

function FeedbackReport({ answers }: { answers: { q: string; a: string; score: number }[] }) {
  const overall = Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length);
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center p-6 bg-[#E8F6F6] rounded-xl">
        <p className="text-5xl font-bold text-[#0D7377] mb-1">{overall}</p>
        <p className="text-sm text-[#5C5C6D]">Overall Score</p>
        <p className="text-xs text-[#5C5C6D] mt-2">
          {overall >= 80 ? "Excellent! You demonstrated strong interview skills." :
           overall >= 60 ? "Good performance. Keep practicing to improve." :
           "Keep practicing. Focus on structure and specific examples."}
        </p>
      </div>

      {/* Dimension Scores */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#1A1A2E]">Score Breakdown</h3>
        <ScoreBar label="Clarity" score={overall + 5} color="#0D7377" />
        <ScoreBar label="Structure" score={overall - 3} color="#7C6BB2" />
        <ScoreBar label="Specificity" score={overall + 2} color="#22C55E" />
        <ScoreBar label="Confidence" score={overall - 5} color="#F59E0B" />
      </div>

      {/* Per-question feedback */}
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

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [phase, setPhase] = useState<"ready" | "question" | "answering" | "review">("ready");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<{ q: string; a: string; score: number }[]>([]);
  const [reviewMode, setReviewMode] = useState(false);

  const questions = QUESTIONS_BEHAVIORAL;

  useEffect(() => {
    if (phase !== "question" && phase !== "answering") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = () => {
    setPhase("question");
    setTimeLeft(questions[currentQ].length > 80 ? 180 : 120);
  };

  const handleReveal = () => {
    setPhase("answering");
    setTimeLeft(180);
  };

  const handleSubmit = () => {
    const score = Math.floor(60 + Math.random() * 35);
    setAnswers((prev) => [...prev, { q: questions[currentQ], a: answer || "No answer provided", score }]);
    setAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setPhase("question");
      setTimeLeft(questions[currentQ].length > 80 ? 180 : 120);
    } else {
      setReviewMode(true);
    }
  };

  if (reviewMode) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E] mb-6">Interview Feedback</h1>
          <FeedbackReport answers={answers} />
        </div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#0D7377]/10 flex items-center justify-center mx-auto">
            <Mic className="w-8 h-8 text-[#0D7377]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">Behavioral Mock Interview</h1>
            <p className="text-sm text-[#5C5C6D] mt-1">5 questions · ~20 minutes</p>
          </div>
          <div className="text-left space-y-2">
            <p className="text-sm font-medium text-[#1A1A2A]">How it works:</p>
            <ul className="text-sm text-[#5C5C6D] space-y-1">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#22C55E]" />Read each question carefully</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#22C55E]" />Use the STAR method for behavioral answers</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#22C55E]" />Click Submit when you're done with each answer</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#22C55E]" />Get AI feedback at the end</li>
            </ul>
          </div>
          <Button size="lg" className="w-full bg-[#0D7377] hover:bg-[#0a5c5f]" onClick={handleStart}>
            Start Interview
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">Mock Interview</span>
          <Badge className="bg-white/10 text-white">{currentQ + 1}/{questions.length}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className={`font-mono font-bold ${timeLeft < 30 ? "text-[#EF4444]" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button onClick={() => setMicOn((m) => !m)} className={`p-2 rounded-lg ${micOn ? "bg-white/10" : "bg-[#EF4444]/20"}`}>
            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-[#EF4444]" />}
          </button>
          <button onClick={() => setVideoOn((v) => !v)} className={`p-2 rounded-lg ${videoOn ? "bg-white/10" : "bg-[#EF4444]/20"}`}>
            {videoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-[#EF4444]" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div className="h-full bg-[#0D7377] transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          {phase === "question" && (
            <div className="text-center space-y-6">
              <p className="text-xs uppercase tracking-wider text-white/50 font-medium">Question {currentQ + 1}</p>
              <h2 className="text-2xl font-semibold text-white leading-relaxed">
                {questions[currentQ]}
              </h2>
              <p className="text-sm text-white/50">Take a moment to think, then click below when ready to answer</p>
              <Button size="lg" className="bg-white text-[#1A1A2E] hover:bg-white/90" onClick={handleReveal}>
                I'm Ready to Answer <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {phase === "answering" && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
                <p className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Question</p>
                <p className="text-white font-medium">{questions[currentQ]}</p>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (Use STAR format: Situation, Task, Action, Result)"
                className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/30 resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">{answer.length} characters</p>
                <Button className="bg-[#0D7377] hover:bg-[#0a5c5f]" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" /> Submit Answer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
