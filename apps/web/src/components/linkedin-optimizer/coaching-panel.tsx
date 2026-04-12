"use client";

import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { StatusCards } from "./status-cards";
import { ActionRail } from "./action-rail";
import RoleTargeting from "./role-targeting";
import CoachingCard from "./coaching-card";
import type {
  StatusDimension,
  RoleTarget,
  CoachingCard as CoachingCardType,
} from "@/types/linkedin-profile";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

interface CoachingPanelProps {
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
  statusDimensions: StatusDimension[];
  coachingCards: CoachingCardType[];
  roleTargets: RoleTarget[];
  roleTarget: RoleTarget | null;
  selectedSectionId: string | null;
  onRoleSelect: (target: RoleTarget | null) => void;
  onSectionSelect: (sectionId: string) => void;
  onActionClick: (sectionId: string) => void;
}

export function CoachingPanel({
  status,
  statusDimensions,
  coachingCards,
  roleTargets,
  roleTarget,
  selectedSectionId,
  onRoleSelect,
  onSectionSelect,
  onActionClick,
}: CoachingPanelProps) {
  // Loading/analyzing state
  if (status === "loading" || status === "analyzing") {
    return (
      <div className={styles.center}>
        <div className={styles.loadingState}>
          <div className={styles.loadingPulse} />
          <h3 className={styles.loadingTitle}>Reading your LinkedIn profile...</h3>
          <p className={styles.loadingText}>
            I&apos;m analyzing how recruiters see your profile. Checking keyword
            strength, visibility, and positioning.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (status === "empty") {
    return (
      <div className={styles.center}>
        <div className={styles.emptyProfile}>
          <div className={styles.emptyIcon}>
            <Eye size={28} />
          </div>
          <h2 className={styles.emptyTitle}>
            I can help you optimize your LinkedIn profile
          </h2>
          <p className={styles.emptyText}>
            Paste your LinkedIn profile URL below and I&apos;ll analyze every
            section...
          </p>
          <input
            className={styles.emptyInput}
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <button className={styles.analyzeProfileBtn}>Analyze Profile</button>
        </div>
      </div>
    );
  }

  // Ready state (all other statuses: ready, error)
  // Derive action items from coaching cards
  const actionItems = coachingCards
    .filter((c) => c.severity !== "strength")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map((c, index) => {
      const label = c.headline.replace(/^(Your|This)/, "Fix").slice(0, 40);
      const truncated = label.length < c.headline.replace(/^(Your|This)/, "Fix").length;
      return {
        step: index + 1,
        label: truncated ? `${label}...` : label,
        sectionId: c.sectionId,
      };
    });

  // Determine section title
  let sectionTitle = "Your optimization roadmap";
  if (selectedSectionId) {
    const selectedCard = coachingCards.find((c) => c.sectionId === selectedSectionId);
    if (selectedCard) {
      sectionTitle = `${selectedCard.linkedSection} — coaching`;
    }
  }

  // Filter coaching cards for display
  const visibleCards = selectedSectionId
    ? coachingCards.filter((c) => c.sectionId === selectedSectionId)
    : coachingCards;

  return (
    <div className={styles.center}>
      <StatusCards dimensions={statusDimensions} />

      <RoleTargeting
        targets={roleTargets}
        selected={roleTarget}
        onSelect={onRoleSelect}
      />

      <ActionRail items={actionItems} onActionClick={onActionClick} />

      <div className={styles.sectionHeader}>
        <div className={styles.sectionLabel}>Analysis</div>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      </div>

      {visibleCards.length > 0 ? (
        <div className={styles.coachingCards}>
          {visibleCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CoachingCard
                card={card}
                onAction={(actionId) => {
                  // Handle action click - the action references a section
                  const action = card.actions.find((a) => a.id === actionId);
                  if (action) {
                    onActionClick(card.sectionId);
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={styles.noSelection}>
          <div className={styles.noSelectionIcon}>
            <Eye size={28} />
          </div>
          <h3 className={styles.noSelectionTitle}>
            Select a section to get coaching
          </h3>
          <p className={styles.noSelectionText}>
            Choose a section from the left panel to see specific optimization
            recommendations for that area of your profile.
          </p>
        </div>
      )}
    </div>
  );
}
