"use client";

import { useEffect } from "react";
import { Linkedin } from "lucide-react";
import { useLinkedInOptimizerStore } from "@/stores/linkedin-optimizer-store";
import LinkedInRail from "@/components/linkedin-optimizer/linkedin-rail";
import CoachingPanel from "@/components/linkedin-optimizer/coaching-panel";
import ProfilePreview from "@/components/linkedin-optimizer/profile-preview";
import styles from "./linkedin-optimizer.module.css";

export default function LinkedInOptimizerPage() {
  const {
    status,
    profile,
    statusDimensions,
    railGroups,
    coachingCards,
    selectedSectionId,
    expandedGroupId,
    roleTarget,
    roleTargets,
    previewHighlight,
    loadMockData,
    selectSection,
    expandGroup,
    setRoleTarget,
  } = useLinkedInOptimizerStore();

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>LinkedIn Optimizer</h1>
          <p className={styles.pageSubtitle}>Your profile command center — powered by AI</p>
        </div>
        <button className={styles.analyzeBtn}>
          <Linkedin size={16} />
          Analyze Profile
        </button>
      </div>

      {/* 3-column layout */}
      <div className={styles.layout}>
        {/* Left: Rail navigator */}
        <LinkedInRail
          groups={railGroups}
          selectedSectionId={selectedSectionId}
          expandedGroupId={expandedGroupId}
          onSectionSelect={selectSection}
          onGroupToggle={expandGroup}
        />

        {/* Center: Coaching panel */}
        <CoachingPanel
          status={status}
          statusDimensions={statusDimensions}
          coachingCards={coachingCards}
          roleTargets={roleTargets}
          roleTarget={roleTarget}
          selectedSectionId={selectedSectionId}
          onRoleSelect={setRoleTarget}
          onSectionSelect={selectSection}
          onActionClick={selectSection}
        />

        {/* Right: Profile preview */}
        <ProfilePreview
          profile={profile}
          highlightSectionId={previewHighlight}
          status={status}
        />
      </div>
    </div>
  );
}
