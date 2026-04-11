"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

interface ApplicationWidgetProps {
  applications: ApplicationListing[];
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

export function ApplicationWidget({ applications }: ApplicationWidgetProps) {
  return (
    <div className="space-y-3">
      {applications.slice(0, 5).map((app) => (
        <Link
          key={app.id}
          href="/applications"
          className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest surface-shift"
        >
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-xs font-semibold text-secondary-onContainer">
            {app.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-surface truncate">{app.role}</p>
            <p className="text-xs text-on-surface-variant truncate">{app.company}</p>
          </div>
          <Badge variant={statusMap[app.status] ?? "outline"} className="shrink-0">
            {app.status.replace(/_/g, " ")}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
