"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ReadinessBand } from "@/components/workspace/readiness-band";
import { SectionedRail } from "@/components/workspace/sectioned-rail";
import { IssueCard } from "@/components/workspace/issue-card";
import { ResumePreview } from "@/components/workspace/resume-preview";
import styles from "./workspace.module.css";

export default function WorkspacePage() {
  const {
    status,
    profileStrength,
    resumeDocument,
    selectedCategoryId,
    selectedIssueId,
    highlightedSectionId,
    previewVisible,
    loadMockData,
    selectCategory,
    selectIssue,
    togglePreview,
  } = useWorkspaceStore();

  useEffect(() => {
    // Load mock analysis data (replace with real API call in production)
    loadMockData();
  }, [loadMockData]);

  const categories = profileStrength?.categories ?? [];
  const selectedCategory = categories.find(c => c.id === selectedCategoryId) ?? null;

  const isLoading = status === "loading" || status === "analyzing";
  const isError = status === "error";

  return (
    <div className={styles.page}>
      {/* Readiness Band */}
      <ReadinessBand
        profileStrength={profileStrength}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={selectCategory}
        onTogglePreview={togglePreview}
        previewVisible={previewVisible}
        isLoading={isLoading}
      />

      {/* Main workspace layout */}
      <div className={styles.layout}>
        {/* Left: Sectioned Rail */}
        <SectionedRail
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={selectCategory}
          missingSections={profileStrength?.missingSections ?? []}
          partialSections={profileStrength?.partialSections ?? []}
        />

        {/* Center: Analysis Panel */}
        <main className={styles.center}>
          {/* Analysis in progress */}
          {isLoading && (
            <div className={styles.analyzingState}>
              <div className={styles.analyzingPulse} role="status" aria-label="Analyzing resume" />
              <h2 className={styles.analyzingTitle}>Analyzing your resume...</h2>
              <p className={styles.analyzingSubtitle}>
                Our AI is reviewing your resume right now. This usually takes about 30 seconds.
              </p>
              <ul className={styles.analyzingChecks}>
                <li>Checking action verbs and impact language</li>
                <li>Verifying ATS keyword density</li>
                <li>Assessing role alignment</li>
              </ul>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className={styles.errorState}>
              <h2 className={styles.errorTitle}>Something went wrong</h2>
              <p className={styles.errorMessage}>
                We couldn&apos;t complete the analysis. Please try again or contact support.
              </p>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={() => loadMockData()}
              >
                Try again
              </button>
            </div>
          )}

          {/* Category content */}
          {!isLoading && !isError && selectedCategory && (
            <div className={styles.categoryContent}>
              {/* Category header */}
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{selectedCategory.name}</h2>
                <p className={styles.categoryDescription}>{selectedCategory.description}</p>
              </div>

              {/* Positive state: no issues */}
              {selectedCategory.issues.length === 0 && (
                <div className={styles.positiveState}>
                  <div className={styles.positiveIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className={styles.positiveMessage}>
                    Looking great in {selectedCategory.name}. No issues found here — your {selectedCategory.name.toLowerCase()} is in good shape.
                  </p>
                </div>
              )}

              {/* Issue cards */}
              {selectedCategory.issues.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onHighlight={(sectionId) => selectIssue(issue.id)}
                />
              ))}
            </div>
          )}

          {/* No category selected */}
          {!isLoading && !isError && !selectedCategoryId && (
            <div className={styles.noSelectionState}>
              <p>Select a category from the left to see your analysis.</p>
            </div>
          )}
        </main>

        {/* Right: Resume Preview */}
        <ResumePreview
          document={resumeDocument}
          highlightedSectionId={highlightedSectionId}
          isVisible={previewVisible}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}