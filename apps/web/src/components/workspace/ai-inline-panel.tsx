"use client";

import { useState } from "react";
import { Loader2, Check, X, Copy } from "lucide-react";
import styles from "./ai-inline-panel.module.css";

interface AiInlinePanelProps {
  isLoading: boolean;
  output: string | null;
  onApply: () => void;
  onDiscard: () => void;
}

export function AiInlinePanel({ isLoading, output, onApply, onDiscard }: AiInlinePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.panel}>
      {isLoading ? (
        <div className={styles.loadingState}>
          <Loader2 size={20} className={styles.spinnerIcon} />
          <span className={styles.loadingText}>Generating suggestions...</span>
        </div>
      ) : output ? (
        <>
          <div className={styles.outputSection}>
            <div className={styles.outputLabel}>AI Suggestion</div>
            <pre className={styles.outputText}>{output}</pre>
            <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="Copy to clipboard">
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.applyBtn} onClick={onApply}>
              <Check size={14} />
              Apply to resume
            </button>
            <button type="button" className={styles.discardBtn} onClick={onDiscard}>
              <X size={14} />
              Discard
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
