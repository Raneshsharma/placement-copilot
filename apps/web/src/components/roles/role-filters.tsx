"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface RoleFiltersProps {
  skills?: FilterOption[];
  selectedSkills?: string[];
  onSkillsChange?: (skills: string[]) => void;
  experienceLevel?: FilterOption[];
  selectedExperience?: string[];
  onExperienceChange?: (levels: string[]) => void;
  jobSources?: FilterOption[];
  selectedSources?: string[];
  onSourcesChange?: (sources: string[]) => void;
}

export function RoleFilters({
  skills,
  selectedSkills = [],
  onSkillsChange,
  experienceLevel,
  selectedExperience = [],
  onExperienceChange,
  jobSources,
  selectedSources = [],
  onSourcesChange,
}: RoleFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleItem = (
    value: string,
    selected: string[],
    onChange?: (items: string[]) => void
  ) => {
    if (!onChange) return;
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Card className="p-4 border-border shadow-card">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-between w-full mb-4"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-semibold text-text-primary text-sm">Filters</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
      </button>

      {expanded && (
        <div className="space-y-6">
          {experienceLevel && experienceLevel.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Experience Level</h3>
              <div className="space-y-2">
                {experienceLevel.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`exp-${opt.value}`}
                      checked={selectedExperience.includes(opt.value)}
                      onCheckedChange={() => toggleItem(opt.value, selectedExperience, onExperienceChange)}
                    />
                    <Label htmlFor={`exp-${opt.value}`} className="text-sm text-text-primary cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Skills</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {skills.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`skill-${opt.value}`}
                      checked={selectedSkills.includes(opt.value)}
                      onCheckedChange={() => toggleItem(opt.value, selectedSkills, onSkillsChange)}
                    />
                    <Label htmlFor={`skill-${opt.value}`} className="text-sm text-text-primary cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jobSources && jobSources.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Job Source</h3>
              <div className="space-y-2">
                {jobSources.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`source-${opt.value}`}
                      checked={selectedSources.includes(opt.value)}
                      onCheckedChange={() => toggleItem(opt.value, selectedSources, onSourcesChange)}
                    />
                    <Label htmlFor={`source-${opt.value}`} className="text-sm text-text-primary cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
