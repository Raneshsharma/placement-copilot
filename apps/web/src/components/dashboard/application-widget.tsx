"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ApplicationListing } from "@/components/dashboard/pps-card";

interface ApplicationWidgetProps {
  applications: ApplicationListing[];
}

export function ApplicationWidget({ applications }: ApplicationWidgetProps) {
  return (
    <div className="space-y-3">
      {applications.slice(0, 5).map((app) => (
        <Link
          key={app.id}
          href={`/applications`}
          className="flex items-center gap-3 p-3 rounded-lg bg-surfaceAlt hover:bg-border/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-xs font-semibold text-primary">
            {app.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{app.role}</p>
            <p className="text-xs text-text-secondary truncate">{app.company}</p>
          </div>
          <Badge
            variant={
              app.status === "INTERVIEW"
                ? "success"
                : app.status === "UNDER_REVIEW"
                ? "yellow"
                : "gray"
            }
          >
            {app.status.replace("_", " ")}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
