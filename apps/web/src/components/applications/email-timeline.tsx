"use client";
import type { MatchedEmail, EmailType } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

const TYPE_ICONS: Record<EmailType, string> = {
  confirmation: '✉️',
  status: '📊',
  interview: '🎯',
  offer: '💼',
  rejection: '❌',
  followup: '💬',
  other: '📧',
};

const TYPE_LABELS: Record<EmailType, string> = {
  confirmation: 'Confirmation',
  status: 'Status Update',
  interview: 'Interview',
  offer: 'Offer',
  rejection: 'Rejection',
  followup: 'Follow-up',
  other: 'Email',
};

interface EmailTimelineProps {
  emails: MatchedEmail[];
  onViewEmail: (email: MatchedEmail) => void;
}

export function EmailTimeline({ emails, onViewEmail }: EmailTimelineProps) {
  if (emails.length === 0) {
    return (
      <div style={{ padding: '16px 0', fontSize: '12px', color: '#9a9a9a', textAlign: 'center' }}>
        No emails matched to this application yet.
      </div>
    );
  }

  return (
    <div className={styles.emailTimeline}>
      {[...emails].reverse().map((email) => {
        const iconClass = {
          confirmation: styles.emailIconConfirmation,
          status: styles.emailIconStatus,
          interview: styles.emailIconInterview,
          offer: styles.emailIconOffer,
          rejection: styles.emailIconRejection,
          followup: styles.emailIconFollowup,
          other: styles.emailIconFollowup,
        }[email.type];

        const showAnnotation = !!email.detectedStatus && email.type !== 'other';

        return (
          <div key={email.id} className={styles.emailItem}>
            <div className={`${styles.emailIcon} ${iconClass}`}>
              {TYPE_ICONS[email.type]}
            </div>
            <div className={styles.emailContent}>
              <div className={styles.emailHeader}>
                <div className={styles.emailSubject}>{email.subject}</div>
                <div className={styles.emailDate}>
                  {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className={styles.emailSnippet}>{email.snippet}</div>
              {showAnnotation && (
                <div className={styles.emailAnnotation}>
                  → Auto-moved to {email.detectedStatus?.replace('_', ' ')}
                </div>
              )}
              <div
                className={styles.emailViewLink}
                onClick={() => onViewEmail(email)}
              >
                View full email →
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}