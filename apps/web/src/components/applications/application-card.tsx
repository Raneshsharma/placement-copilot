"use client";

import { useState } from "react";
import { MapPin, DollarSign, Clock, MoreHorizontal, Calendar } from "lucide-react";

interface ApplicationCardProps {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location?: string;
  salary?: string;
  appliedAt: string;
  match?: number;
  notes?: string;
  interviewDate?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}

export function ApplicationCard({
  id, company, logo, role, location, salary, appliedAt, match, notes, interviewDate, onDragStart, onDragEnd, onClick
}: ApplicationCardProps) {
  const initials = logo || company?.slice(0, 2).toUpperCase() || "?";
  const daysAgo = Math.floor((Date.now() - new Date(appliedAt).getTime()) / 86400000);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="bg-surface rounded-lg border border-border p-3 cursor-grab active:cursor-grabbing hover:shadow-glow transition-shadow group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 shadow-glow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-primary text-sm truncate">{role}</p>
            <p className="text-xs text-text-secondary">{company}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surfaceContainer transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      {location && (
        <div className="flex items-center gap-1 text-xs text-text-tertiary mb-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{location}</span>
        </div>
      )}

      {salary && (
        <div className="flex items-center gap-1 text-xs text-primary font-medium mb-1">
          <DollarSign className="w-3 h-3" />
          {salary}
        </div>
      )}

      {interviewDate && (
        <div className="flex items-center gap-1 text-xs text-warning font-medium mb-1">
          <Calendar className="w-3 h-3" />
          {interviewDate}
        </div>
      )}

      {notes && (
        <p className="text-xs text-text-tertiary mb-2 line-clamp-2">{notes}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <span className="text-xs text-text-tertiary flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysAgo}d ago
        </span>
        {match !== undefined && (
          <span
            className="text-xs font-medium"
            style={{ color: match >= 85 ? "#e9c349" : match >= 70 ? "#f2cc00" : "#99907c" }}
          >
            {match}% match
          </span>
        )}
      </div>
    </div>
  );
}
