"use client";

import { Card } from "@/components/ui/card";
import { MapPin, DollarSign, Clock, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchBadge } from "./match-badge";
import Link from "next/link";

interface RoleCardProps {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location: string;
  salary?: string;
  postedAt?: string;
  match: number;
  skills: string[];
  type?: string;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
  viewMode?: "grid" | "list";
}

export function RoleCard({
  id, company, logo, role, location, salary, postedAt, match, skills, type, onToggleSave, isSaved, viewMode = "grid"
}: RoleCardProps) {
  const initials = logo ?? (company?.slice(0, 2).toUpperCase() ?? "?");

  if (viewMode === "list") {
    return (
      <Card className="p-4 flex items-center gap-4 bg-surface-container-highest shadow-ambient-sm hover:shadow-ambient-md surface-shift">
        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-on-surface">{role}</h3>
            <MatchBadge score={match} />
          </div>
          <p className="text-sm text-on-surface-variant">{company} &bull; {location}</p>
        </div>
        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button onClick={() => onToggleSave(id)} className="p-1.5 rounded hover:bg-surface-container-low surface-shift">
              <Heart className={`w-4 h-4 ${isSaved ? "fill-error text-error" : "text-on-surface-disabled"}`} />
            </button>
          )}
          <Link href={`/roles/${id}`}><Button size="sm" variant="secondary">View Role</Button></Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-surface-container-highest shadow-ambient-sm hover:shadow-ambient-md surface-shift">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm">
          {initials}
        </div>
        <MatchBadge score={match} />
      </div>
      <h3 className="font-semibold text-on-surface mb-1">{role}</h3>
      <p className="text-sm text-on-surface-variant mb-2">{company}</p>

      <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-1">
        <MapPin className="w-3 h-3" />
        {location}
      </div>

      {salary && (
        <div className="flex items-center gap-1 text-xs text-success font-medium mb-3">
          <DollarSign className="w-3 h-3" />
          {salary}
        </div>
      )}

      {postedAt && (
        <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-2">
          <Clock className="w-3 h-3" />
          {postedAt}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-surface-dim text-on-surface-variant">
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-surface-dim text-on-surface-disabled">
            +{skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {onToggleSave && (
          <button onClick={() => onToggleSave(id)} className="p-1.5 rounded hover:bg-surface-container-low surface-shift">
            <Heart className={`w-4 h-4 ${isSaved ? "fill-error text-error" : "text-on-surface-disabled"}`} />
          </button>
        )}
        <Link href={`/roles/${id}`} className="ml-auto group">
          <Button size="sm" variant="secondary">
            View Role <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}