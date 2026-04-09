"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { interviewApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Mic,
  Video,
  Brain,
  Code,
  Users,
  ChevronRight,
  Calendar,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

const INTERVIEW_TYPES = [
  {
    id: "behavioral",
    icon: Users,
    title: "Behavioral",
    description: "STAR-method questions about your past experiences and soft skills",
    duration: "20 min",
    questions: 5,
    color: "#7C6BB2",
    bg: "bg-[#7C6BB2]/10",
    prompt: "Focus on teamwork, leadership, conflict resolution, and growth mindset",
  },
  {
    id: "technical",
    icon: Code,
    title: "Technical",
    description: "Coding challenges and system design problems relevant to your target role",
    duration: "45 min",
    questions: 3,
    color: "#0D7377",
    bg: "bg-[#0D7377]/10",
    prompt: "Algorithms, data structures, and practical coding scenarios",
  },
  {
    id: "mixed",
    icon: Brain,
    title: "Mixed",
    description: "Combination of behavioral and technical questions for comprehensive practice",
    duration: "30 min",
    questions: 4,
    color: "#FF6B35",
    bg: "bg-[#FF6B35]/10",
    prompt: "Balanced mix of real-world scenarios and technical challenges",
  },
];

const PAST_SESSIONS = [
  { id: "s1", type: "Behavioral", role: "Product Manager", company: "Stripe", score: 78, date: "2026-04-05", duration: 18 },
  { id: "s2", type: "Technical", role: "Software Engineer", company: "Google", score: 65, date: "2026-04-02", duration: 42 },
  { id: "s3", type: "Mixed", role: "Frontend Engineer", company: "Meta", score: 82, date: "2026-03-28", duration: 28 },
];

const UPCOMING = [
  { id: "u1", type: "Technical", role: "Backend Engineer", company: "Stripe", date: "April 12, 2026", ready: false },
  { id: "u2", type: "Behavioral", role: "Product Manager", company: "Google", date: "April 15, 2026", ready: true },
];

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E8E6" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444"}
          strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color: score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444" }}>
        {score}
      </span>
    </div>
  );
}

export default function InterviewPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sessions, setSessions] = useState<typeof PAST_SESSIONS>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [startingSession, setStartingSession] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    interviewApi.getSessions()
      .then((res) => {
        const data = res.data.data ?? res.data ?? [];
        const completed = Array.isArray(data)
          ? data.filter((s: any) => s.status === "COMPLETED" || s.status === "completed")
          : [];
        setSessions(completed.length > 0 ? completed : PAST_SESSIONS);
      })
      .catch(() => {
        setSessions(PAST_SESSIONS);
      })
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleStartInterview = async (type: string) => {
    setStartingSession(type);
    try {
      const res = await interviewApi.startSession(type);
      const sessionId = res.data.data?.id ?? res.data.id;
      if (sessionId) {
        router.push(`/interview/${sessionId}`);
      } else {
        router.push(`/interview/new?type=${type}`);
      }
    } catch {
      toast.error("Failed to start interview session.");
      router.push(`/interview/new?type=${type}`);
    } finally {
      setStartingSession(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Mock Interviews</h1>
        <p className="text-sm text-[#5C5C6D] mt-1">Practice with AI-powered interviews and get detailed feedback</p>
      </div>

      {/* Upcoming Interviews */}
      {UPCOMING.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1A1A2E] mb-3">Upcoming Interviews</h2>
          <div className="space-y-3">
            {UPCOMING.map((u) => (
              <Card key={u.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center text-[#0D7377] font-bold text-sm flex-shrink-0">
                  {u.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A2E]">{u.role} at {u.company}</p>
                  <p className="text-xs text-[#5C5C6D] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {u.date}
                  </p>
                </div>
                <Badge className={u.ready ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}>
                  {u.ready ? "Ready" : "Prep Needed"}
                </Badge>
                <Link href="/interview">
                  <Button size="sm" variant="accent">{u.ready ? "Start" : "Prep"}</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Interview Type Selector */}
      <div>
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-3">Choose Interview Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERVIEW_TYPES.map((type) => (
            <Card
              key={type.id}
              className={`p-5 cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id ? "ring-2 ring-offset-2" : ""
              }`}
              style={selectedType === type.id ? { ["--tw-ring-color" as string]: type.color } : {}}
              onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
            >
              <div className={`w-12 h-12 rounded-xl ${type.bg} flex items-center justify-center mb-4`}>
                <type.icon className="w-6 h-6" style={{ color: type.color }} />
              </div>
              <h3 className="font-semibold text-[#1A1A2E] mb-1">{type.title}</h3>
              <p className="text-xs text-[#5C5C6D] mb-3">{type.description}</p>
              <div className="flex items-center gap-3 text-xs text-[#5C5C6D] mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{type.duration}</span>
                <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{type.questions} questions</span>
              </div>
              <p className="text-xs text-[#5C5C6D] italic">"{type.prompt}"</p>
              {selectedType === type.id && (
                <Button
                  size="sm"
                  className="w-full mt-4"
                  style={{ backgroundColor: type.color }}
                  onClick={() => handleStartInterview(type.id)}
                  disabled={startingSession === type.id}
                >
                  {startingSession === type.id ? "Starting..." : "Start Interview"}
                  {!startingSession && <ArrowRight className="w-3 h-3 ml-1" />}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Past Sessions */}
      <div>
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-3">Past Sessions</h2>
        <div className="space-y-3">
          {loadingSessions ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-48 h-4 rounded" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
                <Skeleton className="w-24 h-8 rounded" />
              </Card>
            ))
          ) : sessions.length === 0 ? (
            <Card className="p-6 text-center text-[#5C5C6D]">
              <p className="text-sm">No past sessions yet. Start your first interview above!</p>
            </Card>
          ) : sessions.map((s) => (
            <Card key={s.id} className="p-4 flex items-center gap-4">
              <ScoreRing score={s.score} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A1A2E]">{s.role}</p>
                <p className="text-sm text-[#5C5C6D]">{s.type} · {s.company} · {s.date}</p>
              </div>
              <div className="text-right mr-2">
                <p className="text-xs text-[#5C5C6D]">Duration</p>
                <p className="text-sm font-medium text-[#1A1A2E]">{s.duration}m</p>
              </div>
              <Link href={`/interview/${s.id}`}>
                <Button size="sm" variant="outline">View Feedback</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <Card className="p-5 bg-[#E8F6F6] border-[#0D7377]/20">
        <h3 className="font-semibold text-[#1A1A2E] mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-[#FF6B35]" /> Interview Tips
        </h3>
        <ul className="space-y-1.5 text-sm text-[#5C5C6D]">
          <li>• Start with Behavioral interviews to build confidence before Technical</li>
          <li>• For STAR questions, use the format: Situation → Task → Action → Result</li>
          <li>• Review your past sessions tab for patterns in AI feedback</li>
          <li>• Practice out loud — speaking your answers helps you think clearly</li>
        </ul>
      </Card>
    </div>
  );
}
