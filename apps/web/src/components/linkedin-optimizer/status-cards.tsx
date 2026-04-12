"use client";

import { CheckCircle, Eye, Search, Sparkles, Target, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { StatusDimension } from "@/types/linkedin-profile";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

const iconMap: Record<string, LucideIcon> = {
  "check-circle": CheckCircle,
  eye: Eye,
  search: Search,
  sparkles: Sparkles,
  target: Target,
};

const statusConfig: Record<
  string,
  { chipClass: string; iconClass: string }
> = {
  complete: {
    chipClass: styles.statusChipComplete,
    iconClass: styles.statusCardIconComplete,
  },
  "in-progress": {
    chipClass: styles.statusChipWarning,
    iconClass: styles.statusCardIconWarning,
  },
  missing: {
    chipClass: styles.statusChipCritical,
    iconClass: styles.statusCardIconCritical,
  },
};

const statusLabel: Record<string, string> = {
  complete: "Complete",
  "in-progress": "In Progress",
  missing: "Missing",
};

interface StatusCardsProps {
  dimensions: StatusDimension[];
}

export function StatusCards({ dimensions }: StatusCardsProps) {
  return (
    <div className={styles.statusCards}>
      {dimensions.map((dim, i) => {
        const Icon = iconMap[dim.icon] ?? Eye;
        const config = statusConfig[dim.status] ?? statusConfig.missing;
        const label = statusLabel[dim.status] ?? dim.status;

        return (
          <motion.div
            key={dim.id}
            className={styles.statusCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className={styles.statusCardHeader}>
              <div
                className={`${styles.statusCardIcon} ${config.iconClass}`}
              >
                <Icon size={14} />
              </div>
              <span className={styles.statusCardLabel}>{dim.label}</span>
            </div>
            <div className={`${styles.statusCardChip} ${config.chipClass}`}>
              {label}
            </div>
            <div className={styles.statusCardSubLabel}>{dim.subLabel}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
