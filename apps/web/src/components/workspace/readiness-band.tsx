"use client";

import { Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileStrength } from "@/types/analysis";
import styles from "./readiness-band.module.css";

interface ReadinessBandProps {
  profileStrength: ProfileStrength | null;
  selectedCategoryId: string | null;
  onCategoryClick: (categoryId: string) => void;
  onTogglePreview: () => void;
  previewVisible: boolean;
  isLoading: boolean;
  onGetAiHelp?: () => void;
}

type HealthStatus = "healthy" | "needs-work" | "critical" | "analyzing";

const HEALTH_COLORS: Record<HealthStatus, string> = {
  healthy: "#22c55e",
  "needs-work": "#f59e0b",
  critical: "#ef4444",
  analyzing: "#D97706",
};

const getScoreColor = (score: number) =>
  score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

export function ReadinessBand({
  profileStrength,
  selectedCategoryId,
  onCategoryClick,
  onTogglePreview,
  previewVisible,
  isLoading,
  onGetAiHelp,
}: ReadinessBandProps) {
  const score = profileStrength?.score ?? 0;
  const label = profileStrength?.label ?? "Analyzing...";
  const categories = profileStrength?.categories ?? [];

  const scoreColor = getScoreColor(score);

  return (
    <div className={styles.band}>
      {/* Left: Profile Strength */}
      <div className={styles.strengthSection}>
        <div className={styles.strengthLabel}>Profile Strength</div>
        <div className={styles.strengthScore} style={{ color: scoreColor }}>
          {score}
        </div>
        <div className={styles.strengthBar}>
          <div
            className={styles.strengthBarFill}
            style={{ width: `${score}%`, backgroundColor: scoreColor }}
          />
        </div>
        <div className={styles.strengthSublabel}>{label}</div>
      </div>

      {/* Center: Category pills */}
      <div className={styles.pillsContainer}>
        <div className={styles.pillsScroll}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.pillSkeleton} />
            ))
          ) : (
            categories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              const catHealth = cat.health as HealthStatus;
              const dotColor = HEALTH_COLORS[catHealth] ?? "#a8a29e";

              return (
                <button
                  type="button"
                  key={cat.id}
                  className={cn(styles.pill, isActive && styles.pillActive)}
                  onClick={() => onCategoryClick(cat.id)}
                  aria-label={`${cat.name}: ${cat.health}`}
                  aria-pressed={isActive}
                >
                  <span
                    className={styles.pillDot}
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className={styles.pillName}>{cat.name}</span>
                  {cat.issueCount > 0 && (
                    <span className={styles.pillBadge}>{cat.issueCount}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={cn(styles.actionBtn, previewVisible && styles.actionBtnActive)}
          onClick={onTogglePreview}
          aria-label="Toggle resume preview"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          type="button"
          className={styles.primaryActionBtn}
          onClick={onGetAiHelp}
          aria-label="Get AI help"
        >
          <Sparkles size={16} />
          <span>Get AI Help</span>
        </button>
      </div>
    </div>
  );
}
