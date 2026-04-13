"use client";
import { ArrowLeft, Archive, Trash2, Plus, Lightbulb } from "lucide-react";
import type { Application } from '@/types/application';
import { EmailTimeline } from "./email-timeline";
import styles from "@/app/(dashboard)/applications/applications.module.css";
import { useApplicationsStore } from '@/stores/applications-store';

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface ApplicationDrawerProps {
  app: Application;
  onClose: () => void;
  onAddNote: (content: string) => void;
}

export function ApplicationDrawer({ app, onClose, onAddNote }: ApplicationDrawerProps) {
  const { moveApplication, archiveApplication, deleteApplication } = useApplicationsStore();
  const color = getCompanyColor(app.company);

  const daysInStage = app.appliedAt
    ? Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / (24 * 60 * 60 * 1000))
    : 0;

  const isStale = daysInStage >= 14;

  // AI summary mock (Phase 1 — in Phase 2 this calls the AI API)
  const aiSummary = `You applied for the ${app.role} role at ${app.company}${app.location ? ` (${app.location})` : ''}. ` +
    `Your application ${app.emails.length > 0 ? `has received ${app.emails.length} email${app.emails.length > 1 ? 's' : ''}` : 'has not received a reply yet'}. ` +
    `Current stage: ${app.status.replace('_', ' ')}. ` +
    (app.recruiterName ? `Recruiter contact: ${app.recruiterName}. ` : '') +
    `Your match score is ${app.matchScore ?? 'unknown'}%.`;

  return (
    <>
      {/* Overlay */}
      <div className={styles.drawerOverlay} onClick={onClose} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <button className={styles.drawerBack} onClick={onClose}>
            <ArrowLeft size={16} />
          </button>
          <div className={styles.drawerCompany}>
            <div className={styles.drawerCompanyName}>
              <span style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: color,
                color: 'white',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: '24px',
                marginRight: '8px',
              }}>{app.company.charAt(0)}</span>
              {app.company}
            </div>
            <div className={styles.drawerRole}>{app.role}</div>
          </div>
        </div>

        {/* Meta */}
        <div className={styles.drawerMeta}>
          {app.location && (
            <div className={styles.drawerMetaItem}>
              <span style={{ fontWeight: 600 }}>{app.location}</span>
            </div>
          )}
          {app.salary && (
            <div className={styles.drawerMetaItem}>
              <span className={styles.drawerMetaLabel}>{app.salary}</span>
            </div>
          )}
          {app.appliedAt && (
            <div className={styles.drawerMetaItem}>
              <span>Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({daysInStage}d)</span>
            </div>
          )}
          {app.interviewDate && (
            <div className={styles.drawerMetaItem}>
              <span style={{ color: '#d97706', fontWeight: 600 }}>
                Interview: {new Date(app.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
          {app.matchScore && (
            <div className={styles.drawerMetaItem}>
              <span style={{ fontWeight: 600 }}>{app.matchScore}% ATS match</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          {/* AI Summary */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>
              🤖 AI Summary
            </div>
            <div className={styles.aiSummary}>{aiSummary}</div>
          </div>

          {/* Timeline */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>
              Email Timeline
              <button
                className={styles.drawerSectionAction}
                onClick={() => {
                  const note = prompt('Add a note:');
                  if (note) onAddNote(note);
                }}
              >
                <Plus size={11} style={{ marginRight: '3px' }} /> Add note
              </button>
            </div>
            <EmailTimeline
              emails={app.emails}
              onViewEmail={(email) => alert(`Full email: ${email.subject}\n\n${email.snippet}`)}
            />
          </div>

          {/* Follow-up suggestion */}
          {isStale && (
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>💡 Follow-up Suggestion</div>
              <div className={styles.followupSuggestion}>
                <div className={styles.followupIcon}><Lightbulb size={14} /></div>
                <div className={styles.followupText}>
                  <div className={styles.followupTitle}>It's been {daysInStage} days since your last update</div>
                  <div className={styles.followupDesc}>
                    No response from {app.company} yet. A follow-up email can keep you top of mind.
                  </div>
                  <div className={styles.followupActions}>
                    <button className={`${styles.followupBtn} ${styles.followupBtnPrimary}`}>
                      Draft follow-up ✨
                    </button>
                    <button className={`${styles.followupBtn} ${styles.followupBtnSecondary}`}>
                      Set reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {app.notes.length > 0 && (
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>Notes</div>
              {app.notes.map(note => (
                <div key={note.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0ef' }}>
                  <div style={{ fontSize: '12px', color: '#1a1a1a', lineHeight: 1.5 }}>{note.content}</div>
                  <div style={{ fontSize: '10px', color: '#9a9a9a', marginTop: '3px' }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={styles.drawerActions}>
          <button
            className={styles.drawerActionBtn}
            onClick={() => {
              const statuses = ['WISHLIST', 'APPLIED', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED'];
              const next = statuses[Math.min(statuses.indexOf(app.status) + 1, statuses.length - 1)];
              moveApplication(app.id, next);
            }}
          >
            Update stage
          </button>
          <button
            className={styles.drawerActionBtn}
            onClick={() => { archiveApplication(app.id); onClose(); }}
          >
            <Archive size={12} style={{ marginRight: '4px' }} /> Archive
          </button>
          <button
            className={`${styles.drawerActionBtn} ${styles.drawerActionBtnDanger}`}
            onClick={() => { deleteApplication(app.id); onClose(); }}
          >
            <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
          </button>
        </div>
      </div>
    </>
  );
}