"use client";

import { useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeDocument } from "@/types/analysis";
import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  document: ResumeDocument | null;
  highlightedSectionId: string | null;
  isVisible: boolean;
  isLoading: boolean;
}

export function ResumePreview({
  document,
  highlightedSectionId,
  isVisible,
  isLoading,
}: ResumePreviewProps) {
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Auto-scroll to highlighted section
  useEffect(() => {
    if (highlightedSectionId) {
      const el = sectionRefs.current.get(highlightedSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedSectionId]);

  if (!isVisible) return null;

  return (
    <aside className={styles.previewPanel} aria-label="Resume preview">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>Resume Preview</div>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarBtn} type="button" aria-label="Download PDF">
            <Download size={15} />
          </button>
          <div className={styles.sectionDropdown}>
            <select className={styles.sectionSelect} aria-label="Jump to section">
              <option value="">Jump to section...</option>
              {document?.sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document */}
      {isLoading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonSection}>
              <div className={styles.skeletonSectionTitle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} style={{ width: "75%" }} />
            </div>
          ))}
        </div>
      ) : document ? (
        <div className={styles.document}>
          {document.sections.map(section => {
            const isHighlighted = section.id === highlightedSectionId;
            return (
              <div
                key={section.id}
                ref={(el) => {
                  if (el) sectionRefs.current.set(section.id, el);
                }}
                className={cn(styles.section, isHighlighted && styles.sectionHighlighted)}
                id={`preview-${section.id}`}
                data-section-id={section.id}
              >
                {section.label && (
                  <div className={styles.sectionLabel}>{section.label}</div>
                )}
                {section.content && (
                  <p className={styles.sectionContent}>{section.content}</p>
                )}
                {section.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className={styles.bulletItem}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.isEmpty && (
                  <div className={styles.emptySection}>
                    <span>No content — add it manually</span>
                    <button type="button" className={styles.addBtn}>Add</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noDocument}>
          <p>No resume found. Upload one to get started.</p>
          <button type="button" className={styles.uploadBtn}>Upload Resume</button>
        </div>
      )}
    </aside>
  );
}
