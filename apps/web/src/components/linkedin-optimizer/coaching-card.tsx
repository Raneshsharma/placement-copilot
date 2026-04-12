"use client";

import { useState } from "react";
import { AlertCircle, Lightbulb, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { CoachingCard } from "@/types/linkedin-profile";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

const severityConfig = {
  critical: {
    cardClass: "coachingCardCritical",
    iconClass: "severityCritical",
    icon: AlertCircle,
  },
  opportunity: {
    cardClass: "coachingCardOpportunity",
    iconClass: "severityOpportunity",
    icon: Lightbulb,
  },
  strength: {
    cardClass: "coachingCardStrength",
    iconClass: "severityStrength",
    icon: CheckCircle,
  },
};

interface CoachingCardProps {
  card: CoachingCard;
  onAction: (actionId: string) => void;
}

export default function CoachingCard({ card, onAction }: CoachingCardProps) {
  const [doneAction, setDoneAction] = useState<string | null>(null);

  const handleAction = (actionId: string, isPremium: boolean) => {
    if (isPremium) return;
    setDoneAction(actionId);
    setTimeout(() => {
      setDoneAction(null);
    }, 2000);
  };

  const config = severityConfig[card.severity];
  const Icon = config.icon;

  return (
    <motion.div
      className={`${styles.coachingCard} ${styles[config.cardClass]}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.coachingCardHeader}>
        <div className={`${styles.coachingSeverityIcon} ${styles[config.iconClass]}`}>
          <Icon size={16} />
        </div>
        <h3 className={styles.coachingHeadline}>{card.headline}</h3>
      </div>
      <p className={styles.coachingBody}>{card.body}</p>
      <div className={styles.coachingActions}>
        {card.actions.map((action) => (
          <button
            key={action.id}
            className={`${styles.aiActionBtn} ${action.isPremium ? styles.aiActionBtnLocked : ""}`}
            onClick={() => handleAction(action.id, action.isPremium)}
            title={action.isPremium ? "Premium feature — unlock to use" : undefined}
          >
            {action.isPremium && <Lock size={12} className={styles.lockIcon} />}
            {doneAction === action.id ? "Done \u2713" : action.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
