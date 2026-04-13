"use client";
import { Check, X, AlertCircle } from "lucide-react";
import type { Application } from '@/types/application';
import styles from "@/app/(dashboard)/applications/applications.module.css";

interface ReviewQueueProps {
  apps: Application[];
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#F59E0B', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function ReviewQueue({ apps, onAccept, onDismiss }: ReviewQueueProps) {
  if (apps.length === 0) return null;

  return (
    <div className={styles.reviewBanner}>
      <div className={styles.reviewBannerIcon}>
        <AlertCircle size={16} />
      </div>
      <div className={styles.reviewBannerText}>
        <div className={styles.reviewBannerTitle}>AI detected {apps.length} new application{apps.length > 1 ? 's' : ''}</div>
        <div className={styles.reviewBannerSub}>Review them before they appear on your board</div>
      </div>
    </div>
  );
}

export function ReviewQueueModal({ apps, onAccept, onDismiss }: ReviewQueueProps) {
  if (apps.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth: '560px', width: '100%',
        maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e4' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Review detected applications</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b6b6b' }}>
            AI found these job applications in your emails. Accept to add them to your board.
          </p>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {apps.map(app => {
            const color = getCompanyColor(app.company);
            return (
              <div key={app.id} style={{
                border: '1px solid #e5e5e4', borderRadius: '10px', padding: '12px 14px',
                display: 'flex', gap: '10px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', background: color,
                  color: 'white', fontSize: '14px', fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>{app.company.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{app.role}</div>
                  <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{app.company} · {app.location || 'Location unknown'}</div>
                  <div style={{ fontSize: '11px', color: '#9a9a9a', marginTop: '3px' }}>
                    {app.emails.length} email{app.emails.length !== 1 ? 's' : ''} matched · {app.confidenceScore}% confidence
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => onAccept(app.id)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: '#f0fdf4', color: '#22c55e', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Accept"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => onDismiss(app.id)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e5e4' }}>
          <button
            onClick={() => apps.forEach(a => onDismiss(a.id))}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e5e4',
              background: 'white', color: '#6b6b6b', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Dismiss all
          </button>
        </div>
      </div>
    </div>
  );
}