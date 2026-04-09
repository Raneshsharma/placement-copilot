"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  children: ReactNode;
  count: number;
  isDragOver?: boolean;
  onDrop?: () => void;
}

export function KanbanColumn({ id, label, color, children, count, isDragOver, onDrop }: KanbanColumnProps) {
  return (
    <div
      className={`flex-shrink-0 w-72 rounded-xl p-3 transition-all ${
        isDragOver ? "ring-2 ring-[#0D7377]/30 bg-[#0D7377]/5" : ""
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-[#1A1A2E]">{label}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#F4F4F2] text-[#5C5C6D]">{count}</span>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {children}
        {count === 0 && (
          <div className="h-24 border-2 border-dashed border-[#E8E8E6] rounded-lg flex items-center justify-center">
            <p className="text-xs text-[#9B9BAA]">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}
