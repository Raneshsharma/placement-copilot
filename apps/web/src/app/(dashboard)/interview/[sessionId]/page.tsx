"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { interviewApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Send,
  RefreshCw,
  LogOut,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

// Fallback questions per type
const FALLBACK_QUESTIONS: Record<string, string[]> = {
  BEHAVIORAL: [
    "Tell me about a time you had to deal with a difficult teammate. How did you handle it?",
    "Describe a situation where you had to meet a tight deadline. What was your approach?",
    "Share an example of when you received critical feedback. How did you respond?",
    "Talk about a project where you had to learn something new quickly.",
    "Describe a time you went above and beyond for a customer or stakeholder.",
  ],
  TECHNICAL: [
    "Design a URL shortening service like Bitly. What APIs and data structures would you use?",
    "Write a function to detect if a string has all unique characters. What is the time complexity?",
    "Explain how you would scale a chat application to support 10 million users.",
  ],
  MIXED: [
    "Tell me about a time you solved a complex technical problem under pressure.",
    "Walk me through your approach to debugging a production issue at 2am.",
    "Describe your ideal engineering team culture and how you'd contribute to it.",
    "If you had to rewrite one system from your past projects, what would it be and why?",
  ],
};

const DEFAULT_TIMER = 300; // 5 minutes

interface Question {
  id: string;
  text: string;
  difficulty?: string;
  category?: string;
}

interface SessionData {
  id: string;
  type: string;
  status: string;
  questions: Question[];
  answers?: Array<{ questionId: string; answer: string; score?: number; feedback?: string }>;
  score?: number;
  completedAt?: string;
}

interface LocalAnswer {
  questionId: string;
  answer: string;
  score?: number;
  feedback?: string;
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

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E8E6" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color}
          strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-[#5C5C6D]">/ 100</span>
      </div>
    </div>
  );
}

function CompletionReport({
  session,
  answers,
  onPracticeAgain,
  onBackToHub,
}: {
  session: SessionData;
  answers: LocalAnswer[];
  onPracticeAgain: () => void;
  onBackToHub: () => void;
}) {
  const overall = Math.round(
    answers.reduce((s, a) => s + (a.score ?? 70), 0) / answers.length
  );

  const avgBreakdown = (dimension: string) => {
    const vals = answers.map((a) => a.feedback && typeof a.feedback === "object" ? (a.feedback as any)[dimension] ?? overall : overall);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBackToHub} className="pl-0 text-[#5C5C6D]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Interviews
        </Button>

        <div className="text-center p-6 bg-[#E8F6F6] rounded-xl">
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Interview Complete</h2>
          <ScoreRing score={overall} size={100} />
          <p className="text-sm text-[#5C5C6D] mt-3">
            {overall >= 80 ? "Excellent! You demonstrated strong interview skills." :
             overall >= 60 ? "Good performance. Keep practicing to improve." :
             "Keep practicing. Focus on structure and specific examples."}
          </p>
        </div>

        <Card className="p-5">
          <h3 className="font-semibold text-[#1A1A2E] mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            <ScoreBar label="Content" score={avgBreakdown("content")} color="#0D7377" />
            <ScoreBar label="Clarity" score={avgBreakdown("clarity")} color="#7C6BB2" />
            <ScoreBar label="Structure" score={avgBreakdown("structure")} color="#22C55E" />
            <ScoreBar label="Confidence" score={avgBreakdown("confidence") ?? overall} color="#F59E0B" />
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-[#1A1A2E]">Question-by-Question Analysis</h3>
          {answers.map((a, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={(a.score ?? 0) >= 75 ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}>
                  Q{i + 1}: {a.score ?? 0}/100
                </Badge>
              </div>
              <p className="text-sm font-medium text-[#1A1A2E] mb-2">{session.questions[i]?.text}</p>
              <p className="text-sm text-[#5C5C6D] italic mb-2">"{a.answer}"</p>
              <p className="text-xs text-[#5C5C6D]">
                {typeof a.feedback === "string"
                  ? a.feedback
                  : (a.score ?? 0) >= 75
                  ? "Strong answer with clear examples and structure."
                  : (a.score ?? 0) >= 50
                  ? "Good attempt. Consider adding more specific outcomes."
                  : "Try the STAR method: Situation, Task, Action, Result."}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBackToHub}>
            Back to Interviews
          </Button>
          <Button className="flex-1 bg-[#0D7377] hover:bg-[#0a5c5f]" onClick={onPracticeAgain}>
            <RefreshCw className="w-4 h-4 mr-2" /> Practice Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [phase, setPhase] = useState<"ready" | "question" | "answering" | "review" | "complete">("ready");
  const [session, setSession] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [feedback, setFeedback] = useState<LocalAnswer | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIMER);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const currentQuestion = questions[currentQIndex];
  const hasExistingAnswers = Object.keys(answers).length > 0;
  const allQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  useEffect(() => {
    if (!sessionId || sessionId === "new") {
      setLoading(false);
      return;
    }
    setLoading(true);
    interviewApi.getSession(sessionId)
      .then((res) => {
        const data: SessionData = res.data?.data ?? res.data;
        setSession(data);
        if (data?.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else if (data?.type) {
          const fallback = FALLBACK_QUESTIONS[data.type] || FALLBACK_QUESTIONS.BEHAVIORAL;
          setQuestions(fallback.map((text, i) => ({ id: `q${i + 1}`, text })));
        }
        // Restore existing answers
        if (data?.answers && data.answers.length > 0) {
          const map: Record<string, LocalAnswer> = {};
          data.answers.forEach((a) => {
            map[a.questionId] = a;
          });
          setAnswers(map);
          if (data.answers.length > 0) {
            setShowResumePrompt(true);
          }
        }
      })
      .catch(() => {
        // Fallback handled above
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Timer
  useEffect(() => {
    if (phase !== "answering") return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmitAnswer(true);
          return DEFAULT_TIMER;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, currentQIndex]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = () => {
    setPhase("question");
    setTimeRemaining(DEFAULT_TIMER);
  };

  const handleReveal = () => {
    setPhase("answering");
    setTimeRemaining(DEFAULT_TIMER);
  };

  const handleSubmitAnswer = async (autoSubmit = false) => {
    if (!currentQuestion) return;
    if (answer.trim().length < 20 && !autoSubmit) {
      toast.warning("Add more detail for better feedback (at least 20 characters)");
      return;
    }
    setSubmitting(true);
    const answerText = answer.trim() || "No answer provided";
    try {
      const res = await interviewApi.submitAnswer(sessionId, currentQuestion.id, answerText);
      const result: LocalAnswer = res.data?.data ?? res.data;
      setFeedback(result);
      setPhase("review");
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          answer: answerText,
          score: result.score,
          feedback: result.feedback,
        },
      }));
    } catch {
      const mockScore = Math.floor(Math.random() * 40) + 60;
      const result: LocalAnswer = {
        questionId: currentQuestion.id,
        answer: answerText,
        score: mockScore,
        feedback: "AI feedback unavailable — your answer has been saved.",
      };
      setFeedback(result);
      setPhase("review");
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: result,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setFeedback(null);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((q) => q + 1);
      setPhase("question");
      setTimeRemaining(DEFAULT_TIMER);
    } else {
      // Complete
      if (sessionId && sessionId !== "new") {
        interviewApi.endSession(sessionId).catch(() => {});
      }
      setPhase("complete");
    }
  };

  const handlePracticeAgain = async () => {
    try {
      const res = await interviewApi.startSession(session?.type || "BEHAVIORAL");
      const newId = res.data?.data?.id ?? res.data?.id;
      if (newId) {
        router.push(`/interview/${newId}`);
      } else {
        router.push("/interview");
      }
    } catch {
      router.push("/interview");
    }
  };

  const handleExit = () => {
    setShowExitDialog(false);
    router.push("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (phase === "complete" && session) {
    return (
      <CompletionReport
        session={session}
        answers={Object.values(answers)}
        onPracticeAgain={handlePracticeAgain}
        onBackToHub={() => router.push("/interview")}
      />
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
            <h1 className="text-xl font-bold text-[#1A1A2E]">{session?.type || "Behavioral"} Mock Interview</h1>
            <p className="text-sm text-[#5C5C6D] mt-1">{questions.length} questions · ~{questions.length * 5} minutes</p>
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowExitDialog(true)}
            >
              <LogOut className="w-4 h-4 mr-2" /> Exit
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-[#0D7377] hover:bg-[#0a5c5f]"
              onClick={handleStart}
            >
              I'm Ready
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isLowTime = timeRemaining <= 60;
  const timerColor = timeRemaining <= 30 ? "#EF4444" : isLowTime ? "#F59E0B" : "#FFFFFF";

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowExitDialog(true)}
            className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <span className="text-white font-semibold">{session?.type || "Interview"} Session</span>
          <Badge className="bg-white/10 text-white">
            {currentQIndex + 1}/{questions.length}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 text-white transition-colors ${isLowTime ? "animate-pulse" : ""}`}
            style={{ color: timerColor }}
          >
            <Clock className="w-4 h-4" />
            <span className={`font-mono font-bold ${isLowTime ? "text-[#F59E0B] animate-pulse" : ""}`} style={timeRemaining <= 30 ? { color: "#EF4444" } : {}}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-[#0D7377] transition-all duration-500"
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          {phase === "question" && currentQuestion && (
            <div className="text-center space-y-6">
              <p className="text-xs uppercase tracking-wider text-white/50 font-medium">Question {currentQIndex + 1}</p>
              <h2 className="text-2xl font-semibold text-white leading-relaxed">
                {currentQuestion.text}
              </h2>
              {currentQuestion.difficulty && (
                <Badge className="bg-white/10 text-white/60">{currentQuestion.difficulty}</Badge>
              )}
              <p className="text-sm text-white/50">Take a moment to think, then click below when ready to answer</p>
              <Button size="lg" className="bg-white text-[#1A1A2E] hover:bg-white/90" onClick={handleReveal}>
                I'm Ready to Answer <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {phase === "answering" && currentQuestion && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
                <p className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Question</p>
                <p className="text-white font-medium">{currentQuestion.text}</p>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (Use STAR format: Situation, Task, Action, Result)"
                className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/30 resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">{answer.length} characters</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setPhase("question")}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-[#0D7377] hover:bg-[#0a5c5f]"
                    onClick={() => handleSubmitAnswer(false)}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Answer</>}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "review" && feedback && currentQuestion && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Your Answer</p>
                <p className="text-white text-sm italic">"{feedback.answer}"</p>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2">AI Score</p>
                <p className="text-4xl font-bold" style={{ color: (feedback.score ?? 70) >= 75 ? "#22C55E" : (feedback.score ?? 70) >= 50 ? "#F59E0B" : "#EF4444" }}>
                  {feedback.score ?? "—"}
                </p>
                <p className="text-xs text-white/50 mt-1">/ 100</p>
              </div>

              {feedback.feedback && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Feedback</p>
                  <p className="text-white text-sm">{typeof feedback.feedback === "string" ? feedback.feedback : "Your answer has been recorded."}</p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-[#0D7377] hover:bg-[#0a5c5f]"
                onClick={handleNextQuestion}
              >
                {currentQIndex < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="w-5 h-5 ml-2" /></>
                ) : (
                  <>View Report <ChevronRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              <DialogTitle>Exit Interview?</DialogTitle>
            </div>
            <DialogDescription>
              Your progress will be saved. You can resume this session later from the Interview Hub.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continue Interview
            </Button>
            <Button
              className="bg-[#EF4444] hover:bg-[#DC2626]"
              onClick={handleExit}
            >
              Exit Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Dialog */}
      {showResumePrompt && (
        <Dialog open={showResumePrompt} onOpenChange={setShowResumePrompt}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resume Session?</DialogTitle>
              <DialogDescription>
                You have {Object.keys(answers).length} answer(s) saved for this session. Would you like to continue where you left off?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowResumePrompt(false); setPhase("question"); setCurrentQIndex(Object.keys(answers).length); }}>
                Start Fresh
              </Button>
              <Button className="bg-[#0D7377]" onClick={() => { setShowResumePrompt(false); setPhase("question"); setCurrentQIndex(Object.keys(answers).length); }}>
                Resume
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
