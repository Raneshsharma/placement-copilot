"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, TrendingUp, Target, Briefcase, MapPin, DollarSign, Calendar, ChevronRight, Sparkles, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { progressApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const MOCK_DASHBOARD = {
  streak: 3,
  weeklyApplications: 5,
  ppsScore: 78,
  ppsBreakdown: { profile: 80, skills: 65, resume: 85, interview: 72 },
  stats: [
    { label: "Active Applications", value: 5, trend: "+2", icon: Briefcase, color: "#0D7377" },
    { label: "Interviews Scheduled", value: 1, trend: "+1", icon: Calendar, color: "#7C6BB2" },
    { label: "Match Score", value: "78%", trend: "+5%", icon: Target, color: "#22C55E" },
    { label: "Skills Gap Closed", value: "3/10", trend: "+2", icon: TrendingUp, color: "#F59E0B" },
  ],
  activeApplications: [
    { id: "1", company: "Google", role: "Software Engineer", status: "INTERVIEW", logo: "G", appliedAt: "2026-04-05", match: 92 },
    { id: "2", company: "Stripe", role: "Product Manager", status: "UNDER_REVIEW", logo: "S", appliedAt: "2026-04-07", match: 88 },
    { id: "3", company: "Notion", role: "UX Designer", status: "SUBMITTED", logo: "N", appliedAt: "2026-04-08", match: 85 },
  ],
  upcomingInterview: { date: "April 11, 2026", role: "Software Engineer", company: "Google" },
  roleRecommendations: [
    { id: "r1", company: "Meta", role: "Frontend Engineer", location: "Menlo Park, CA", salary: "$95k - $140k", match: 91, logo: "M" },
    { id: "r2", company: "Stripe", role: "Backend Engineer", location: "Remote", salary: "$100k - $150k", match: 89, logo: "S" },
    { id: "r3", company: "Notion", role: "Full Stack Engineer", location: "San Francisco, CA", salary: "$90k - $130k", match: 87, logo: "N" },
  ],
  weeklyActivity: [40, 65, 45, 80, 55, 70, 90],
  milestones: [
    { id: "m1", label: "Profile created", done: true, date: "Apr 1" },
    { id: "m2", label: "First application sent", done: true, date: "Apr 3" },
    { id: "m3", label: "First interview scheduled", done: true, date: "Apr 5" },
    { id: "m4", label: "First offer received", done: false, date: "TBD" },
  ],
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function PPSRing({ score }: { score: number }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle stroke="#E8E8E6" fill="#fafafa" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        stroke="#0D7377"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

function WeeklyBarChart({ data }: { data: number[] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-16">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(val / max) * 48}px`,
              backgroundColor: i === data.length - 1 ? "#0D7377" : "#0D737730",
            }}
          />
          <span className="text-[10px] text-text-tertiary">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<typeof MOCK_DASHBOARD | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi.get()
      .then((res) => setData(res.data))
      .catch(() => setData(MOCK_DASHBOARD))
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    SUBMITTED: "yellow",
    UNDER_REVIEW: "blue",
    INTERVIEW: "default",
    SCREENING: "warning",
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {getGreeting()}, {user?.firstName || "there"}
          </h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF6B35]" />
            <span className="font-medium">{data.streak}-day streak</span>
            <span className="text-text-tertiary">
              &bull; {data.weeklyApplications} applications this week
            </span>
          </p>
        </div>
        {/* Weekly Activity Chart */}
        <div className="hidden md:block">
          <p className="text-xs text-text-tertiary mb-2 text-right">This week</p>
          <WeeklyBarChart data={data.weeklyActivity} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Build Resume", href: "/resume", icon: Briefcase, color: "#0D7377", desc: "Optimize with AI" },
          { label: "Mock Interview", href: "/interview", icon: Zap, color: "#7C6BB2", desc: "Practice now" },
          { label: "Find Roles", href: "/roles", icon: Target, color: "#22C55E", desc: "Match & apply" },
          { label: "Skill Gap", href: "/skills", icon: TrendingUp, color: "#FF6B35", desc: "Level up" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: action.color + "15" }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <p className="font-semibold text-sm text-text-primary">{action.label}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{action.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* PPS Card */}
      <Card className="p-6">
        <div className="flex items-center gap-8">
          <div className="relative flex items-center justify-center flex-shrink-0">
            <PPSRing score={data.ppsScore} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold text-text-primary">{data.ppsScore}</span>
              <span className="text-xs text-text-tertiary">PPS</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-3">Your Placement Potential Score</h3>
            <div className="space-y-2">
              {Object.entries(data.ppsBreakdown).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-20 capitalize">{key}</span>
                  <div className="flex-1 h-2 bg-[#E8E8E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0D7377] rounded-full transition-all" style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-sm font-medium text-text-primary w-10 text-right">{val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/skills" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline">
          Update your profile to improve <ChevronRight className="w-4 h-4" />
        </Link>
      </Card>

      {/* Two column: Stats + Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {data.stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + "20" }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-[#22C55E]">{stat.trend}</span>
              </div>
              <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
              <p className="text-xs text-text-tertiary mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Milestones */}
        <Card className="p-5">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
            Journey Milestones
          </h3>
          <div className="space-y-3">
            {data.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? "bg-[#22C55E]/15" : "bg-[#E8E8E6]"}`}>
                  {m.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#C0C0BC]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${m.done ? "text-text-primary font-medium" : "text-text-secondary"}`}>{m.label}</p>
                  <p className="text-xs text-text-tertiary">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CTA Banner */}
      <div className="bg-[#FF6B35] rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-lg">Interview with {data.upcomingInterview.company} in 2 days</p>
            <p className="text-white/80 text-sm">{data.upcomingInterview.role} &bull; {data.upcomingInterview.date}</p>
          </div>
        </div>
        <Link href="/interview">
          <Button variant="default" className="bg-white text-[#FF6B35] hover:bg-white/90">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Practice
          </Button>
        </Link>
      </div>

      {/* Active Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">Active Applications</h2>
          <Link href="/applications" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {data.activeApplications.map((app) => (
            <Card key={app.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-sm flex-shrink-0">
                {app.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">{app.role}</p>
                <p className="text-sm text-text-secondary">{app.company}</p>
              </div>
              <Badge variant={statusColors[app.status] as any || "default"}>{app.status.replace("_", " ")}</Badge>
              <span className="text-xs text-text-tertiary">{Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)}d ago</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">Role Recommendations</h2>
          <Link href="/roles" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.roleRecommendations.map((role) => (
            <Link key={role.id} href="/roles" className="group">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-sm">
                    {role.logo}
                  </div>
                  <Badge variant="success" className="text-xs">{role.match}% match</Badge>
                </div>
                <p className="font-semibold text-text-primary">{role.role}</p>
                <p className="text-sm text-text-secondary mb-2">{role.company}</p>
                <div className="flex items-center gap-1 text-xs text-text-tertiary mb-2">
                  <MapPin className="w-3 h-3" />
                  {role.location}
                </div>
                {role.salary && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium">
                      <DollarSign className="w-3 h-3" />
                      {role.salary}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-primary transition-colors" />
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
