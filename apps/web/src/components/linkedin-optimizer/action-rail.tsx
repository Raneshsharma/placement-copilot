"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

interface ActionItem {
  step: number;
  label: string;
  sectionId: string;
}

interface ActionRailProps {
  items: ActionItem[];
  onActionClick: (sectionId: string) => void;
}

export function ActionRail({ items, onActionClick }: ActionRailProps) {
  return (
    <div className={styles.actionRail}>
      <span className={styles.actionRailLabel}>Your plan:</span>
      {items.map((item) => (
        <motion.button
          key={item.step}
          className={styles.actionChip}
          onClick={() => onActionClick(item.sectionId)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: item.step * 0.05 }}
        >
          <span className={styles.actionChipNum}>{item.step}.</span>
          {item.label}
          <ChevronRight size={14} />
        </motion.button>
      ))}
    </div>
  );
}
