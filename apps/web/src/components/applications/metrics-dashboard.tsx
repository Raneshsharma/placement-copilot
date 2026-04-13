"use client";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import type { ApplicationStats } from "@/types/application";
import styles from "@/app/(dashboard)/applications/applications.module.css";

interface MetricsDashboardProps {
  stats: ApplicationStats;
  isSyncing: boolean;
  lastSyncedAt?: string;
  onSync: () => void;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function MetricsDashboard({ stats, isSyncing, lastSyncedAt, onSync }: MetricsDashboardProps) {
  return (
    <div className={styles.metricsRow}>
      <MetricCard label="Tracked" value={stats.total} />
      <MetricCard label="Responses" value={stats.responses} />
      <MetricCard label="Resp Rate" value={`${stats.responseRate}%`} />
      <MetricCard label="Interviews" value={stats.interviews} />
      <MetricCard label="Offers" value={stats.offers} />
      <MetricCard label="Avg Stage" value={`${stats.avgStageDays}d`} />
      <MetricCard label="This Week" value={`+${stats.addedThisWeek}`} />
      <div className={styles.metricCard} style={{ cursor: 'pointer' }} onClick={onSync}>
        <div className={styles.metricValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isSyncing ? (
            <RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            '🔄'
          )}
        </div>
        <div className={styles.metricLabel}>Synced</div>
        <div style={{ fontSize: '10px', color: '#9a9a9a', marginTop: '2px' }}>
          {lastSyncedAt ? timeAgo(lastSyncedAt) : '—'}
        </div>
      </div>
    </div>
  );
}
