"use client";

import { useState } from "react";
import { ChevronDown, Check, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisCategory } from "@/types/analysis";
import styles from "./sectioned-rail.module.css";

interface SectionedRailProps {
  categories: AnalysisCategory[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  missingSections?: string[];
  partialSections?: string[];
}

interface RailSection {
  id: string;
  label: string;
  categories: AnalysisCategory[];
}

const RAIL_SECTIONS: RailSection[] = [
  { id: "resume-quality", label: "Resume Quality", categories: [] },
  { id: "content", label: "Content", categories: [] },
  { id: "ats-health", label: "ATS Health", categories: [] },
];

function getHealthIcon(health: string, issueCount: number) {
  if (health === "healthy") return <Check size={14} color="#22c55e" />;
  if (health === "needs-work" || health === "critical") return <AlertCircle size={14} color={health === "critical" ? "#ef4444" : "#f59e0b"} />;
  return null;
}

export function SectionedRail({
  categories,
  selectedCategoryId,
  onCategorySelect,
  missingSections = [],
  partialSections = [],
}: SectionedRailProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Group categories by section
  const sections = RAIL_SECTIONS.map(section => ({
    ...section,
    categories: categories.filter(c => c.section === section.id),
  }));

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <nav className={styles.rail} aria-label="Resume analysis categories">
      {sections.map(section => {
        const isCollapsed = collapsedSections.has(section.id);
        return (
          <div key={section.id} className={styles.section}>
            {/* Section header */}
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
              aria-expanded={!isCollapsed}
            >
              <span className={styles.sectionLabel}>{section.label}</span>
              <ChevronDown
                size={14}
                className={cn(styles.chevron, isCollapsed && styles.chevronCollapsed)}
              />
            </button>

            {/* Category items */}
            {!isCollapsed && (
              <ul className={styles.categoryList} role="list">
                {section.categories.map(cat => {
                  const isSelected = selectedCategoryId === cat.id;
                  const isPartial = partialSections.includes(cat.id);
                  const isMissing = missingSections.includes(cat.id);
                  const hasIssues = cat.issueCount > 0;
                  const dotColor = cat.health === "healthy" ? "#22c55e"
                    : cat.health === "needs-work" ? "#f59e0b"
                    : cat.health === "critical" ? "#ef4444"
                    : cat.health === "analyzing" ? "#D97706"
                    : "#a8a29e";

                  return (
                    <li key={cat.id}>
                      <button
                        className={cn(styles.categoryItem, isSelected && styles.categoryItemActive)}
                        onClick={() => onCategorySelect(cat.id)}
                        aria-current={isSelected ? "page" : undefined}
                      >
                        <span
                          className={styles.healthDot}
                          style={{ backgroundColor: dotColor }}
                          aria-label={cat.health}
                        />
                        <span className={styles.categoryName}>{cat.name}</span>
                        {isPartial && (
                          <span className={styles.partialBadge}>Partial</span>
                        )}
                        {isMissing && (
                          <span className={styles.missingBadge}>
                            <Plus size={10} />
                            <span>Add</span>
                          </span>
                        )}
                        {!isPartial && !isMissing && hasIssues && (
                          <span className={styles.issueBadge}>{cat.issueCount}</span>
                        )}
                        {!isPartial && !isMissing && !hasIssues && (
                          <span className={styles.healthyCheck}>
                            <Check size={12} color="#22c55e" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
