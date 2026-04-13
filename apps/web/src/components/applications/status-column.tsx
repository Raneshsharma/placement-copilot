"use client";

import { ApplicationCard } from "./application-card";
import { Plus } from "lucide-react";
import type { Application } from "@/types/application";

interface StatusColumnProps {
  id: string;
  label: string;
  color: string;
  apps: Application[];
  isDragOver?: boolean;
  onDrop?: () => void;
  onAdd?: () => void;
  onCardClick?: (id: string) => void;
  onMenuAction?: (action: string, id: string) => void;
}

export function StatusColumn({ id, label, color, apps, isDragOver, onDrop, onAdd, onCardClick, onMenuAction }: StatusColumnProps) {
  return (
    <div
      className={`flex-shrink-0 w-72 rounded-xl p-3 transition-all ${
        isDragOver ? "ring-2 ring-primary/30 bg-primary/5" : ""
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-text-primary">{label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-surfaceContainer text-text-tertiary">{apps.length}</span>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="p-1 rounded hover:bg-surfaceContainer text-text-tertiary hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2 min-h-[100px]">
        {apps.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onClick={(id) => onCardClick?.(id)}
            onMenuAction={(action, appId) => onMenuAction?.(action, appId)}
          />
        ))}
        {apps.length === 0 && (
          <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
            <p className="text-xs text-text-tertiary">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}
