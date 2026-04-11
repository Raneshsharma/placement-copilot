"use client";

import { useState } from "react";
import { Wand2, Lightbulb, Sparkles, TrendingUp, ArrowUpDown, Search, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisIssue, ActionChip } from "@/types/analysis";
import { AiInlinePanel } from "./ai-inline-panel";
import styles from "./issue-card.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  Wand2, Lightbulb, Sparkles, TrendingUp, ArrowUpDown, Search, Target,
};

interface IssueCardProps {
  issue: AnalysisIssue;
  onHighlight?: (sectionId: string) => void;
}

function getSeverityClass(severity: string): string {
  switch (severity) {
    case "needs-work": return styles.badgeNeedsWork;
    case "should-fix": return styles.badgeShouldFix;
    case "quick-win": return styles.badgeQuickWin;
    default: return styles.badgeNeedsWork;
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case "needs-work": return "Needs Work";
    case "should-fix": return "Should Fix";
    case "quick-win": return "Quick Win";
    default: return "Issue";
  }
}

export function IssueCard({ issue, onHighlight }: IssueCardProps) {
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleActionClick = (action: string, chipLabel: string) => {
    setShowAiPanel(true);
    setIsLoadingAi(true);

    // Simulate AI response (in production, call the AI service)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "rewrite": `Based on your context, here's an improved version:\n\n"${issue.context.split("\n").pop()}"\n\n→ "Led the design and implementation of microservices architecture, improving system throughput by 45%."`,
        "suggest-verbs": `Stronger alternatives to consider:\n\n• "Built" instead of "helped with"\n• "Delivered" instead of "worked on"\n• "Spearheaded" instead of "assisted"\n• "Orchestrated" instead of "contributed to"`,
        "add-metrics": `Try adding these metrics to your achievements:\n\n• % improvement in performance\n• $ amount of revenue impacted\n• # of users or customers affected\n• time saved or reduced`,
        "optimize-keywords": `Key terms to weave in naturally:\n\n• "system design" • "distributed systems"\n• "CI/CD" • "cloud infrastructure"\n• "high-throughput" • "API design"`,
        "default": `Here are some suggestions for "${chipLabel}":\n\n1. Be specific about impact\n2. Use action verbs\n3. Include metrics where possible\n4. Match the language of your target role`,
      };
      setAiOutput(responses[action] || responses["default"]);
      setIsLoadingAi(false);
    }, 1500);
  };

  const handleApply = () => {
    setShowAiPanel(false);
    setAiOutput(null);
  };

  const handleDiscard = () => {
    setShowAiPanel(false);
    setAiOutput(null);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headline}>{issue.headline}</h3>
        <span className={cn(styles.severityBadge, getSeverityClass(issue.severity))}>
          {getSeverityLabel(issue.severity)}
        </span>
      </div>

      {/* Conversation flow */}
      <div className={styles.conversation}>
        {issue.context && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s what we found:</span>
            <div className={styles.convoContext}>{issue.context}</div>
          </div>
        )}
        {issue.reason && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s why it matters:</span>
            <p className={styles.convoReason}>{issue.reason}</p>
          </div>
        )}
        {issue.action && (
          <div className={styles.convoBlock}>
            <span className={styles.convoLabel}>Here&apos;s what to do:</span>
            <p className={styles.convoAction}>{issue.action}</p>
          </div>
        )}
      </div>

      {/* Assistant bar */}
      <div className={styles.assistantBar}>
        {issue.actionChips.map((chip, i) => {
          const Icon = ICON_MAP[chip.icon ?? ""] ?? Sparkles;
          return (
            <button
              key={i}
              type="button"
              className={styles.assistantChip}
              onClick={() => handleActionClick(chip.action, chip.label)}
              aria-label={chip.label}
            >
              <Icon size={14} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI inline panel */}
      {showAiPanel && (
        <AiInlinePanel
          isLoading={isLoadingAi}
          output={aiOutput}
          onApply={handleApply}
          onDiscard={handleDiscard}
        />
      )}
    </div>
  );
}
