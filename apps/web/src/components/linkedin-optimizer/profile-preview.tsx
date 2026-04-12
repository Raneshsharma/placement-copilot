"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { LinkedInProfile } from "@/types/linkedin-profile";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

interface ProfilePreviewProps {
  profile: LinkedInProfile | null;
  highlightSectionId: string | null;
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
}

const PREVIEW_SECTIONS = [
  { id: "headline", label: "Headline" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
];

export function ProfilePreview({
  profile,
  highlightSectionId,
  status,
}: ProfilePreviewProps) {
  // Loading or analyzing state
  if (status === "loading" || status === "analyzing") {
    return (
      <div className={styles.previewPanel}>
        <div className={styles.previewToolbar}>
          <span className={styles.previewToolbarTitle}>Profile Preview</span>
        </div>
        <div className={styles.previewSkeleton}>
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
        </div>
      </div>
    );
  }

  // No profile state
  if (profile === null) {
    return (
      <div className={styles.previewPanel}>
        <div className={styles.previewToolbar}>
          <span className={styles.previewToolbarTitle}>Profile Preview</span>
        </div>
        <div className={styles.previewEmpty}>
          <p className={styles.previewEmptyText}>
            Paste your LinkedIn URL above to see your profile content here.
          </p>
        </div>
      </div>
    );
  }

  // Has profile state
  const getSectionLabel = (sectionId: string) => {
    const section = PREVIEW_SECTIONS.find((s) => s.id === sectionId);
    return section?.label ?? sectionId;
  };

  return (
    <div className={styles.previewPanel}>
      <div className={styles.previewToolbar}>
        <span className={styles.previewToolbarTitle}>Profile Preview</span>
        {highlightSectionId && (
          <span className={styles.previewToolbarBadge}>
            {getSectionLabel(highlightSectionId)}
          </span>
        )}
      </div>

      <div className={styles.previewContent}>
        {/* Headline Block */}
        <div
          className={`${styles.previewBlock} ${
            highlightSectionId === "headline" ? styles.isHighlighted : ""
          }`}
        >
          <div className={styles.previewBlockHeader}>
            <span className={styles.previewBlockLabel}>Headline</span>
            {highlightSectionId === "headline" && (
              <span className={styles.previewBlockBadge}>This section</span>
            )}
          </div>
          <div className={styles.previewBlockBody}>
            {profile.headline || "No headline added yet."}
          </div>
        </div>

        {/* About Block */}
        <div
          className={`${styles.previewBlock} ${
            highlightSectionId === "about" ? styles.isHighlighted : ""
          }`}
        >
          <div className={styles.previewBlockHeader}>
            <span className={styles.previewBlockLabel}>About</span>
            {highlightSectionId === "about" && (
              <span className={styles.previewBlockBadge}>This section</span>
            )}
          </div>
          <div className={styles.previewBlockBody}>
            {profile.about
              ? profile.about.length > 200
                ? profile.about.slice(0, 200) + "..."
                : profile.about
              : "No about section added yet."}
          </div>
        </div>

        {/* Experience Block */}
        <div
          className={`${styles.previewBlock} ${
            highlightSectionId === "experience" ? styles.isHighlighted : ""
          }`}
        >
          <div className={styles.previewBlockHeader}>
            <span className={styles.previewBlockLabel}>Experience</span>
            {highlightSectionId === "experience" && (
              <span className={styles.previewBlockBadge}>This section</span>
            )}
          </div>
          <div className={styles.previewBlockBody}>
            {profile.experience && profile.experience.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {profile.experience.map((exp) => (
                  <div key={exp.id} className={styles.previewExperienceItem}>
                    <div className={styles.previewExperienceTitle}>{exp.title}</div>
                    <div className={styles.previewExperienceCompany}>{exp.company}</div>
                    {exp.duration && (
                      <div className={styles.previewExperienceDuration}>{exp.duration}</div>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={styles.previewExperienceBullets}>
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles.previewEmptyText}>
                No experience added yet.
              </span>
            )}
          </div>
        </div>

        {/* Skills Block */}
        <div
          className={`${styles.previewBlock} ${
            highlightSectionId === "skills" ? styles.isHighlighted : ""
          }`}
        >
          <div className={styles.previewBlockHeader}>
            <span className={styles.previewBlockLabel}>Skills</span>
            {highlightSectionId === "skills" && (
              <span className={styles.previewBlockBadge}>This section</span>
            )}
          </div>
          <div className={styles.previewSkillChips}>
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, idx) => {
                const endorsementCount = profile.endorsements?.[skill] ?? 0;
                const isEndorsed = endorsementCount > 0;
                return (
                  <motion.span
                    key={idx}
                    className={`${styles.skillChip} ${
                      isEndorsed ? styles.skillChipEndorsed : ""
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {skill}
                    {isEndorsed && (
                      <>
                        <span className={styles.endorsedDot} />
                        {endorsementCount > 0 && (
                          <span style={{ fontSize: "10px", fontWeight: 600 }}>
                            {endorsementCount}
                          </span>
                        )}
                      </>
                    )}
                  </motion.span>
                );
              })
            ) : (
              <span className={styles.previewEmptyText}>
                No skills listed yet.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
