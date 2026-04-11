"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame, TrendingUp, Target, Briefcase, MapPin, DollarSign,
  Calendar, ChevronRight, Sparkles, Zap, CheckCircle2, ArrowRight, X
} from "lucide-react";
import { toast } from "sonner";
import { progressApi, applicationApi, milestonesApi, recommendedJobsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/motion-card";
import { useAuthStore } from "@/stores/auth-store";

// --- Types ---
interface ProgressStats {
  activeApplications: number;
  interviewsThisMonth: number;
  offersReceived: number;
  responseRate: number;
}

interface ProgressBreakdown {
  profileCompleteness: number;
  resumeQuality: number;
  skillsMatch: number;
  activityLevel: number;
}

interface ProgressData {
  ppsScore: number;
  breakdown: ProgressBreakdown;
  stats: ProgressStats;
}

interface Application {
  id: string;
  job?: { title?: string; company?: string };
  company?: string;
  role?: string;
  status: string;
  appliedAt?: string;
  updatedAt?: string;
  match?: number;
  logo?: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
}

interface RecommendedJob {
  id: string;
  title?: string;
  role?: string;
  company?: string;
  location?: string;
  salary?: string;
  matchScore?: number;
  logo?: string;
}

// --- Helpers ---
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getPPSColor(score: number) {
  if (score <= 40) return "#ef4444";
  if (score <= 60) return "#f59e0b";
  if (score <= 80) return "#3b82f6";
  return "#22c55e";
}

function getPPSRingColor(score: number) {
  if (score <= 40) return "#ef4444";
  if (score <= 60) return "#f59e0b";
  if (score <= 80) return "#3b82f6";
  return "#22c55e";
}

function PPSRing({ score }: { score: number }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const ringColor = getPPSRingColor(score);
  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle stroke="#353534" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        stroke={ringColor}
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

function WeeklyBarChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [40, 65, 45, 80, 55, 70, 90];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-16">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all duration-300"
            style={{
              height: `${(val / max) * 48}px`,
              backgroundColor: i === data.length - 1 ? "#f2ca50" : "#353534",
            }}
          />
          <span className="text-[10px] text-text-tertiary">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function getRelativeTime(dateStr?: string): string {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function getMilestoneColor(index: number): string {
  const colors = ["#f2ca50", "#f2cc00", "#e9c349", "#f59e0b", "#3b82f6"];
  return colors[index % colors.length];
}

const BREAKDOWN_LABELS: Record<string, string> = {
  profileCompleteness: "Profile",
  resumeQuality: "Resume",
  skillsMatch: "Skills",
  activityLevel: "Activity",
};

const statusColors: Record<string, string> = {
  SUBMITTED: "gold",
  UNDER_REVIEW: "secondary",
  INTERVIEW: "accent",
  SCREENING: "warning",
  OFFERED: "accent",
};

// --- Skeleton Components ---
function PPSSkeleton() {
  return (
    <Card className="p-6 border-border shadow-card">
      <div className="flex items-center gap-8">
        <div className="relative flex items-center justify-center flex-shrink-0">
          <Skeleton className="w-[120px] h-[120px] rounded-full" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-28 rounded-lg" />
      ))}
    </div>
  );
}

function MilestonesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-5 h-5 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
}

function RolesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}

// --- Main Component ---
export default function DashboardPage() {
  const { user } = useAuthStore();

  // Progress state
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(false);

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  // Recommended jobs state
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Interview banner dismiss
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Determine if any critical section is loading
  const isInitialLoad = progressLoading;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("dismissedInterviewBanner");
      if (dismissed === "true") setBannerDismissed(true);
    }
  }, []);

  // Fetch progress
  useEffect(() => {
    progressApi.get()
      .then((res) => {
        setProgressData(res.data?.data ?? res.data ?? {});
        setProgressError(false);
      })
      .catch(() => {
        setProgressError(true);
      })
      .finally(() => setProgressLoading(false));
  }, []);

  // Fetch milestones
  useEffect(() => {
    milestonesApi.getAll({ limit: 5 })
      .then((res) => setMilestones(res.data?.milestones ?? res.data ?? []))
      .catch(() => setMilestones([]))
      .finally(() => setMilestonesLoading(false));
  }, []);

  // Fetch active applications
  useEffect(() => {
    applicationApi.getAll()
      .then((res) => {
        const apps = res.data?.applications ?? res.data ?? [];
        const active = apps.filter((a: Application) =>
          ["SUBMITTED", "UNDER_REVIEW", "INTERVIEW", "OFFERED"].includes(a.status)
        );
        setApplications(active.slice(0, 3));
      })
      .catch(() => setApplications([]))
      .finally(() => setApplicationsLoading(false));
  }, []);

  // Fetch recommended jobs
  useEffect(() => {
    recommendedJobsApi.getRecommended({ limit: 3 })
      .then((res) => {
        const jobs = res.data?.jobs ?? res.data?.recommendedRoles ?? res.data ?? [];
        setRecommendedJobs(Array.isArray(jobs) ? jobs.slice(0, 3) : []);
      })
      .catch(() => setRecommendedJobs([]))
      .finally(() => setJobsLoading(false));
  }, []);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("dismissedInterviewBanner", "true");
    }
  };

  if (isInitialLoad) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <PPSSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
          </div>
          <MilestonesSkeleton />
        </div>
        <Skeleton className="h-24 rounded-lg" />
        <ApplicationsSkeleton />
        <RolesSkeleton />
      </div>
    );
  }

  // Build stats cards from progress data
  const statsCards = progressData?.stats ? [
    {
      label: "Active Applications",
      value: progressData.stats.activeApplications ?? 0,
      trend: null,
      icon: Briefcase,
      color: "#f2ca50",
    },
    {
      label: "Interviews This Month",
      value: progressData.stats.interviewsThisMonth ?? 0,
      trend: null,
      icon: Calendar,
      color: "#f2cc00",
    },
    {
      label: "Offers Received",
      value: progressData.stats.offersReceived ?? 0,
      trend: null,
      icon: Target,
      color: "#e9c349",
    },
    {
      label: "Response Rate",
      value: `${Math.round(progressData.stats.responseRate ?? 0)}%`,
      trend: null,
      icon: TrendingUp,
      color: "#c6c6c6",
    },
  ] : [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {getGreeting()}, {user?.firstName || "there"}
          </h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-medium text-text-primary">
              {progressData?.ppsScore != null ? `${progressData.ppsScore} PPS Score` : "Loading score..."}
            </span>
          </p>
        </div>
        <div className="hidden md:block">
          <p className="text-xs text-text-tertiary mb-2 text-right">This week</p>
          <WeeklyBarChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Build Resume", href: "/resume", icon: Briefcase, color: "#f2ca50", desc: "Optimize with AI" },
          { label: "Mock Interview", href: "/interview", icon: Zap, color: "#f2cc00", desc: "Practice now" },
          { label: "Find Roles", href: "/roles", icon: Target, color: "#e9c349", desc: "Match & apply" },
          { label: "Skill Gap", href: "/skills", icon: TrendingUp, color: "#c6c6c6", desc: "Level up" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <MotionCard className="p-4 hover:shadow-glow cursor-pointer group border-border">
              <div className="w-10 h-10 rounded-[6px] flex items-center justify-center mb-3 shadow-glow-sm" style={{ backgroundColor: action.color + "20" }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <p className="font-semibold text-sm text-text-primary">{action.label}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{action.desc}</p>
            </MotionCard>
          </Link>
        ))}
      </div>

      {/* PPS Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 border-border shadow-card">
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <PPSRing score={progressData?.ppsScore ?? 0} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: progressData ? getPPSColor(progressData.ppsScore) : "#f2ca50" }}
                >
                  {progressData?.ppsScore ?? 0}
                </span>
                <span className="text-xs text-text-tertiary">PPS</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-3">Your Placement Potential Score</h3>
              {progressData && progressData.breakdown ? (
                <div className="space-y-2">
                  {Object.entries(progressData.breakdown).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-text-secondary w-20">
                        {BREAKDOWN_LABELS[key] ?? key}
                      </span>
                      <div className="flex-1 h-2 bg-surfaceContainer rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${val}%`,
                            backgroundColor: getPPSColor(val),
                            transition: "width 800ms ease-out, background-color 0.3s ease",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary w-10 text-right">{val}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-2 flex-1 rounded-full" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Link href="/skills" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:text-primary/80 transition-colors">
            Update your profile to improve <ChevronRight className="w-4 h-4" />
          </Link>
        </Card>
      </motion.div>

      {/* Two column: Stats + Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="md:col-span-2">
          {progressLoading ? <StatsSkeleton /> : (
            <div className="grid grid-cols-2 gap-4">
              {statsCards.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Card className="p-4 border-border shadow-card hover:shadow-glow-sm transition-all duration-200 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-[6px] flex items-center justify-center" style={{ backgroundColor: stat.color + "20" }}>
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      {stat.trend && <span className="text-xs font-medium text-primary">{stat.trend}</span>}
                    </div>
                    <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
                    <p className="text-xs text-text-tertiary mt-1">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones */}
        <Card className="p-5 border-border shadow-card">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Journey Milestones
          </h3>
          {milestonesLoading ? (
            <MilestonesSkeleton />
          ) : milestones.length > 0 ? (
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${m.completed ? "bg-primary/15 shadow-glow-sm" : "bg-surfaceContainer"}`}>
                    {m.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-text-tertiary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${m.completed ? "text-text-primary font-medium" : "text-text-secondary"}`}>{m.title}</p>
                    <p className="text-xs text-text-tertiary">
                      {getRelativeTime(m.completedAt ?? m.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary text-center py-4">No milestones yet. Keep applying!</p>
          )}
        </Card>
      </div>

      {/* Interview CTA Banner */}
      {!bannerDismissed && (
        <div className="bg-primary rounded-lg p-6 flex items-center justify-between flex-wrap gap-4 shadow-glow animate-pulse-glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[6px] bg-[#3c2f00]/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#3c2f00]" />
            </div>
            <div>
              <p className="font-semibold text-[#3c2f00] text-lg">Practice for your upcoming interviews</p>
              <p className="text-[#3c2f00]/70 text-sm">Sharpen your skills with AI-powered mock interviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/interview">
              <Button variant="secondary" className="text-text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
            </Link>
            <button
              onClick={handleDismissBanner}
              className="p-2 rounded-[6px] text-[#3c2f00]/60 hover:text-[#3c2f00] hover:bg-[#3c2f00]/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">Active Applications</h2>
          <Link href="/applications" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {applicationsLoading ? (
          <ApplicationsSkeleton />
        ) : applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => {
              const company = app.company ?? app.job?.company ?? "Company";
              const role = app.role ?? app.job?.title ?? "Role";
              const initials = company.charAt(0).toUpperCase();
              const daysAgo = app.updatedAt
                ? Math.floor((Date.now() - new Date(app.updatedAt).getTime()) / 86400000)
                : app.appliedAt
                ? Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)
                : 0;
              return (
                <Card key={app.id} className="p-4 flex items-center gap-4 border-border shadow-card hover:shadow-glow-sm transition-all duration-200">
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 shadow-glow-sm">
                    {app.logo ?? initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary truncate">{role}</p>
                    <p className="text-sm text-text-secondary">{company}</p>
                  </div>
                  <Badge variant={statusColors[app.status] as any || "default"}>
                    {app.status.replace(/_/g, " ")}
                  </Badge>
                  {app.match && <Badge variant="default" className="text-xs">{app.match}% match</Badge>}
                  <span className="text-xs text-text-tertiary">{daysAgo}d ago</span>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center border-border shadow-card">
            <Briefcase className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary">No active applications yet.</p>
            <Link href="/roles" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
              Find your first role
            </Link>
          </Card>
        )}
      </div>

      {/* Role Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">Role Recommendations</h2>
          <Link href="/roles" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {jobsLoading ? (
          <RolesSkeleton />
        ) : recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((role) => {
              const company = role.company ?? "Company";
              const title = role.title ?? role.role ?? "Role";
              const initials = company.charAt(0).toUpperCase();
              return (
                <Link key={role.id} href="/roles" className="group">
                  <MotionCard className="p-4 hover:shadow-glow transition-all duration-200 cursor-pointer border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-glow-sm">
                        {role.logo ?? initials}
                      </div>
                      {role.matchScore && <Badge variant="default" className="text-xs">{role.matchScore}% match</Badge>}
                    </div>
                    <p className="font-semibold text-text-primary">{title}</p>
                    <p className="text-sm text-text-secondary mb-2">{company}</p>
                    {role.location && (
                      <div className="flex items-center gap-1 text-xs text-text-tertiary mb-2">
                        <MapPin className="w-3 h-3" />
                        {role.location}
                      </div>
                    )}
                    {role.salary && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-primary font-medium">
                          <DollarSign className="w-3 h-3" />
                          {role.salary}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-primary transition-colors" />
                      </div>
                    )}
                  </MotionCard>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center border-border shadow-card">
            <Target className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary">No recommendations yet. Complete your profile to get personalized matches.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
