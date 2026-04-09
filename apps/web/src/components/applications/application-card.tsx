"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, MoreHorizontal, Calendar } from "lucide-react";

interface ApplicationCardProps {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  salary?: string;
  appliedAt: string;
  match: number;
  notes?: number;
  interviewDate?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function ApplicationCard({
  id, company, logo, role, location, salary, appliedAt, match, notes, interviewDate, onDragStart, onDragEnd
}: ApplicationCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-white rounded-lg border border-[#E8E8E6] p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-xs flex-shrink-0">
            {logo}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#1A1A2E] text-sm truncate">{role}</p>
            <p className="text-xs text-[#5C5C6D]">{company}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#F4F4F2] transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-[#5C5C6D]" />
        </button>
      </div>

      <div className="flex items-center gap-1 text-xs text-[#5C5C6D] mb-1">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{location}</span>
      </div>

      {salary && (
        <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium mb-1">
          <DollarSign className="w-3 h-3" />
          {salary}
        </div>
      )}

      {interviewDate && (
        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-medium mb-1">
          <Calendar className="w-3 h-3" />
          {interviewDate}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E8E6]">
        <span className="text-xs text-[#5C5C6D] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {Math.floor((Date.now() - new Date(appliedAt).getTime()) / 86400000)}d ago
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: match >= 85 ? "#22C55E" : match >= 70 ? "#F59E0B" : "#9CA3AF" }}
        >
          {match}% match
        </span>
      </div>
    </div>
  );
}
