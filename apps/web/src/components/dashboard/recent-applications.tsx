"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentApplication {
  id: string;
  company: string;
  logo?: string;
  role: string;
  companyLogo?: string;
  status: string;
  appliedAt: string;
  location?: string;
  match?: number;
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

const statusMap: Record<string, "default" | "secondary" | "success" | "warning" | "error" | "outline"> = {
  WISHLIST: "outline",
  SUBMITTED: "default",
  UNDER_REVIEW: "warning",
  INTERVIEW: "success",
  OFFERED: "success",
  REJECTED: "error",
  WITHDRAWN: "outline",
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <div className="space-y-3">
      {applications.slice(0, 5).map((app) => (
        <Card
          key={app.id}
          className="p-4 flex items-center gap-4 hover:shadow-ambient-sm surface-shift"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {app.companyLogo || app.logo || app.company?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface truncate">{app.role}</p>
            <p className="text-sm text-on-surface-variant">{app.company}</p>
          </div>
          <Badge variant={statusMap[app.status] ?? "outline"} className="shrink-0">
            {app.status.replace(/_/g, " ")}
          </Badge>
          <span className="text-xs text-on-surface-variant shrink-0">
            {Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)}d ago
          </span>
        </Card>
      ))}
    </div>
  );
}
