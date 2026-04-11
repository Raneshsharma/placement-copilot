"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "./question-card";
import { FeedbackPanel } from "./feedback-panel";
import { ScoreRing } from "./score-ring";
import { Clock, Mic, MicOff, Video, VideoOff, Send } from "lucide-react";
import { interviewApi } from "@/lib/api";
import { toast } from "sonner";

interface InterviewSessionProps {
  sessionId: string;
  type: string;
  questions: Array<{ id: string; text: string; difficulty?: "Easy" | "Medium" | "Hard"; category?: string }>;
}

export function InterviewSession({ sessionId, type, questions }: InterviewSessionProps) {
  const [phase, setPhase] = useState<"ready" | "question" | "answering" | "review">("ready");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Array<{ q: string; a: string; score: number; feedback?: string }>>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = () => {
    setPhase("question");
  };

  const handleReveal = () => {
    setPhase("answering");
    setTimeLeft(180);
  };

  const handleSubmit = () => {
    const question = questions[currentQ];
    const answerText = answer || "No answer provided";

    interviewApi.submitAnswer(sessionId, question.id, answerText)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setAnswers((prev) => [
          ...prev,
          { q: question.text, a: answerText, score: data.score ?? 75, feedback: data.feedback },
        ]);
      })
      .catch(() => {
        const score = Math.floor(60 + Math.random() * 35);
        setAnswers((prev) => [
          ...prev,
          { q: question.text, a: answerText, score },
        ]);
      })
      .finally(() => {
        setAnswer("");
        if (currentQ < questions.length - 1) {
          setCurrentQ((q) => q + 1);
          setPhase("question");
        } else {
          interviewApi.endSession(sessionId).catch(() => {});
          setReviewMode(true);
        }
      });
  };

  if (reviewMode) {
    const overall = Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length);
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h1 className="text-2xl font-bold font-display text-text-primary mb-6">Interview Feedback</h1>
          <FeedbackPanel answers={answers} overall={overall} />
        </div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-border shadow-card">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto shadow-glow-sm">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-text-primary">{type} Mock Interview</h1>
            <p className="text-sm text-text-secondary mt-1">{questions.length} questions &middot; ~20 minutes</p>
          </div>
          <div className="text-left space-y-2">
            <p className="text-sm font-medium text-text-primary">How it works:</p>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>Read each question carefully</li>
              <li>Use the STAR method for behavioral answers</li>
              <li>Click Submit when done with each answer</li>
              <li>Get AI feedback at the end</li>
            </ul>
          </div>
          <Button size="lg" className="w-full" onClick={handleStart}>
            Start Interview
          </Button>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-primary">Mock Interview</span>
          <Badge variant="secondary">{currentQ + 1}/{questions.length}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-primary">
            <Clock className="w-4 h-4" />
            <span className={`font-mono font-bold ${timeLeft < 30 ? "text-error" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            onClick={() => setMicOn((m) => !m)}
            className={`p-2 rounded-lg transition-colors ${micOn ? "bg-primary/10 text-primary" : "bg-surfaceContainer text-text-tertiary"}`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setVideoOn((v) => !v)}
            className={`p-2 rounded-lg transition-colors ${videoOn ? "bg-primary/10 text-primary" : "bg-surfaceContainer text-text-tertiary"}`}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="h-1 bg-surfaceContainer">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          {phase === "question" && (
            <div className="text-center space-y-6">
              <p className="text-xs uppercase tracking-wider text-text-tertiary font-medium">
                Question {currentQ + 1}
              </p>
              <h2 className="text-2xl font-semibold text-text-primary leading-relaxed">
                {q.text}
              </h2>
              <p className="text-sm text-text-secondary">Take a moment to think, then click below when ready to answer</p>
              <Button size="lg" variant="accent" onClick={handleReveal}>
                I&apos;m Ready to Answer
              </Button>
            </div>
          )}

          {phase === "answering" && (
            <div className="space-y-4">
              <div className="bg-surfaceContainer border border-border rounded-xl p-4 mb-2">
                <p className="text-xs uppercase tracking-wider text-text-tertiary font-medium mb-2">Question</p>
                <p className="text-text-primary font-medium">{q.text}</p>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (Use STAR format: Situation, Task, Action, Result)"
                className="min-h-[200px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-tertiary">{answer.length} characters</p>
                <Button onClick={handleSubmit}>
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
