"use client";
import { MapPin, DollarSign, Calendar, Clock, Mail, MoreHorizontal, AlertCircle, Target } from "lucide-react";
import type { Application } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface ApplicationCardProps {
  app: Application;
  onClick: (id: string) => void;
  onMenuAction: (action: string, id: string) => void;
}

export function ApplicationCard({ app, onClick, onMenuAction }: ApplicationCardProps) {
  const color = getCompanyColor(app.company);
  const daysAgo = app.appliedAt
    ? Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / (24 * 60 * 60 * 1000))
    : null;

  const emailCount = app.emails.length;
  const hasInterview = !!app.interviewDate;

  const cardClasses = [
    styles.applicationCard,
    hasInterview ? styles.isInterview : '',
    app.needsReview ? styles.isNeedsReview : '',
    app.isStale ? styles.isStale : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={() => onClick(app.id)}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardCompanyLogo} style={{ backgroundColor: color }}>
          {app.company.charAt(0)}
        </div>
        <div className={styles.cardTitleGroup}>
          <div className={styles.cardRole}>{app.role}</div>
          <div className={styles.cardCompany}>{app.company}</div>
        </div>
        <button
          className={styles.cardHoverMenu}
          onClick={(e) => { e.stopPropagation(); onMenuAction('menu', app.id); }}
          title="More actions"
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Badges */}
      <div className={styles.cardBadges}>
        {app.source === 'auto' && (
          <span className={`${styles.cardBadge} ${styles.badgeAIDetected}`}>🤖 Auto-detected</span>
        )}
        {app.needsReview && (
          <span className={`${styles.cardBadge} ${styles.badgeNeedsReview}`}>
            <AlertCircle size={9} /> Review
          </span>
        )}
        {app.isStale && (
          <span className={`${styles.cardBadge} ${styles.badgeStale}`}>
            <Clock size={9} /> Stale
          </span>
        )}
        {emailCount > 0 && (
          <span className={`${styles.cardBadge} ${styles.badgeEmailCount}`}>
            <Mail size={9} /> {emailCount} email{emailCount !== 1 ? 's' : ''}
          </span>
        )}
        {hasInterview && (
          <span className={`${styles.cardBadge} ${styles.badgeInterview}`}>
            <Calendar size={9} /> Interview scheduled
          </span>
        )}
      </div>

      {/* Meta info */}
      <div className={styles.cardMeta}>
        {app.location && (
          <span className={styles.cardMetaItem}>
            <MapPin />
            {app.location}
          </span>
        )}
        {app.salary && (
          <span className={styles.cardMetaItem}>
            <DollarSign />
            {app.salary}
          </span>
        )}
        {daysAgo !== null && (
          <span className={styles.cardMetaItem}>
            <Clock />
            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
        )}
      </div>

      {/* Interview date */}
      {hasInterview && (
        <div className={styles.cardMeta} style={{ color: '#d97706' }}>
          <Target size={10} />
          <span>Interview: {new Date(app.interviewDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      )}

      {/* Email snippet */}
      {app.emails.length > 0 && (
        <div className={styles.cardSnippet}>
          "{app.emails[app.emails.length - 1].snippet}"
        </div>
      )}

      {/* ATS match */}
      {app.matchScore && (
        <div className={styles.cardMeta} style={{ marginTop: '4px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: app.matchScore >= 85 ? '#d97706' : app.matchScore >= 70 ? '#6b7280' : '#9a9a9a',
          }}>
            {app.matchScore}% match
          </span>
        </div>
      )}
    </div>
  );
}
