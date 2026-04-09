"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Heart, Zap } from "lucide-react";

interface RoleCardProps {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  salary?: string;
  postedAt?: string;
  match: number;
  skills: string[];
  type?: string;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
}

export function RoleCard({ id, company, logo, role, location, salary, postedAt, match, skills, type, onToggleSave, isSaved }: RoleCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-sm">
          {logo}
        </div>
        <Badge variant={match >= 85 ? "success" : match >= 70 ? "warning" : "default"} className="text-xs">
          {match}%
        </Badge>
      </div>
      <h3 className="font-semibold text-[#1A1A2E] mb-1">{role}</h3>
      <p className="text-sm text-[#5C5C6D] mb-2">{company}</p>

      <div className="flex items-center gap-1 text-xs text-[#5C5C6D] mb-1">
        <MapPin className="w-3 h-3" />
        {location}
      </div>

      {salary && (
        <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium mb-3">
          <DollarSign className="w-3 h-3" />
          {salary}
        </div>
      )}

      {postedAt && (
        <div className="flex items-center gap-1 text-xs text-[#9B9BAA] mb-2">
          <Clock className="w-3 h-3" />
          {postedAt}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-[#F4F4F2] text-[#5C5C6D]">
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#F4F4F2] text-[#9B9BAA]">
            +{skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(id)}
            className="p-1.5 rounded-md hover:bg-[#F4F4F2] transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#EF4444] text-[#EF4444]" : "text-[#9B9BAA]"}`} />
          </button>
        )}
        <Link href={`/roles/${id}`} className="ml-auto">
          <Button variant="accent" size="sm">Quick Apply</Button>
        </Link>
      </div>
    </Card>
  );
}
