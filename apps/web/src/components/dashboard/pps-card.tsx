"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PPSCardProps {
  score: number;
  breakdown: Array<{ label: string; value: number }>;
  suggestions: string[];
}

export function PPSCard({ score, breakdown, suggestions }: PPSCardProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 80 ? "#f2ca50" : score >= 60 ? "#f2ca50" : "#f2cc00";

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Score Ring */}
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="font-semibold text-text-secondary text-sm mb-4">Placement Performance Score</h2>
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#353534" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-text-primary">{score}</span>
              <span className="text-xs text-text-tertiary">out of 100</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1">
          <h3 className="font-medium text-sm text-text-secondary mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{item.label}</span>
                  <span className="font-medium text-text-primary">{item.value}%</span>
                </div>
                <div className="h-2 bg-surfaceContainer rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.value}%`, backgroundColor: scoreColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex-1">
          <h3 className="font-medium text-sm text-text-secondary mb-3">How to Improve</h3>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-primary mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ icon: Icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">{label}</p>
          <p className="text-xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={cn("text-xs", trendUp ? "text-success" : "text-text-tertiary")}>
              {trendUp ? "↑ " : ""}{trend}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ApplicationListing {
  id: string;
  company: string;
  role: string;
  companyLogo: string;
  status: string;
  appliedAt: string;
  salary?: string;
  location?: string;
}

interface ApplicationListingsProps {
  applications: ApplicationListing[];
}

export function ApplicationListings({ applications }: ApplicationListingsProps) {
  return (
    <div className="space-y-3">
      {applications.slice(0, 3).map((app) => (
        <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-surfaceContainer">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shadow-glow-sm">
            {app.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{app.role}</p>
            <p className="text-xs text-text-secondary truncate">{app.company} · {app.location}</p>
          </div>
          <Badge variant={app.status === "INTERVIEW" ? "success" : app.status === "UNDER_REVIEW" ? "warning" : "outline"}>
            {app.status.replace("_", " ")}
          </Badge>
        </div>
      ))}
    </div>
  );
}

interface InterviewItem {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  type: string;
}

interface InterviewScheduleProps {
  interviews: InterviewItem[];
}

export function InterviewSchedule({ interviews }: InterviewScheduleProps) {
  if (interviews.length === 0) {
    return <p className="text-sm text-text-tertiary">No upcoming interviews scheduled.</p>;
  }
  return (
    <div className="space-y-3">
      {interviews.map((interview) => (
        <div key={interview.id} className="flex items-center gap-3 p-3 rounded-lg bg-surfaceContainer">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shadow-glow-sm">
            {interview.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{interview.role}</p>
            <p className="text-xs text-text-secondary">{interview.type} · {interview.date} at {interview.time}</p>
          </div>
          <Badge variant="gold">{interview.type}</Badge>
        </div>
      ))}
    </div>
  );
}

interface RoleRecommendation {
  id: string;
  title: string;
  company: string;
  match: number;
  salary: string;
  location: string;
  logo: string;
}

interface RoleRecommendationsProps {
  roles: RoleRecommendation[];
}

export function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {roles.map((role) => (
        <div key={role.id} className="flex-shrink-0 w-64 p-4 rounded-lg border border-border bg-surface hover:shadow-glow transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shadow-glow-sm">
              {role.logo}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{role.title}</p>
              <p className="text-xs text-text-secondary">{role.company}</p>
            </div>
            <Badge variant={role.match >= 80 ? "gold" : role.match >= 60 ? "default" : "outline"}>
              {role.match}%
            </Badge>
          </div>
          <p className="text-xs text-text-tertiary">{role.location} · {role.salary}</p>
        </div>
      ))}
    </div>
  );
}
