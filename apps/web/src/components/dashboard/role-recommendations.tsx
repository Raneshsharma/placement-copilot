"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/components/roles/match-badge";
import { MapPin, DollarSign, ArrowRight } from "lucide-react";

interface RoleRecommendation {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location: string;
  salary?: string;
  match: number;
}

interface RoleRecommendationsProps {
  roles: RoleRecommendation[];
}

export function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roles.map((role) => (
        <Link key={role.id} href={`/roles/${role.id}`} className="group">
          <Card className="p-4 hover:shadow-glow transition-all duration-200 cursor-pointer border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-glow-sm">
                {role.logo || role.company?.slice(0, 1)}
              </div>
              <MatchBadge score={role.match} />
            </div>
            <p className="font-semibold text-text-primary">{role.role}</p>
            <p className="text-sm text-text-secondary mb-2">{role.company}</p>
            <div className="flex items-center gap-1 text-xs text-text-tertiary mb-2">
              <MapPin className="w-3 h-3" />
              {role.location}
            </div>
            {role.salary && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
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
  );
}
