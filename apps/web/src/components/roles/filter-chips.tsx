"use client";

import { ReactNode } from "react";

interface FilterChipsProps {
  filters: { label: string; icon?: ReactNode; active?: boolean }[];
  onToggle: (label: string) => void;
}

export function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => onToggle(filter.label)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter.active
              ? "bg-[#0D7377] text-white"
              : "bg-white border border-[#E8E8E6] text-[#5C5C6D] hover:border-[#0D7377]/30"
          }`}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
