"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Clock } from "lucide-react";

interface ResumeVersion {
  id: string;
  name: string;
  createdAt: string;
  isActive?: boolean;
}

interface ResumeVersionSelectorProps {
  versions: ResumeVersion[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ResumeVersionSelector({ versions, selectedId, onSelect }: ResumeVersionSelectorProps) {
  const selected = versions.find((v) => v.id === selectedId);

  return (
    <div className="flex items-center gap-3">
      <FileText className="w-4 h-4 text-primary" />
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger className="flex-1 bg-surface-container-highest border-outline-variant">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent className="bg-surface-container-highest">
          {versions.map((v) => (
            <SelectItem key={v.id} value={v.id}>
              <div className="flex items-center gap-2">
                <span className="text-on-surface">{v.name}</span>
                <span className="text-on-surface-variant text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected?.isActive && <Badge variant="success">Active</Badge>}
    </div>
  );
}