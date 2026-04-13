"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, Clock, RotateCcw } from "lucide-react";
import { useInterviewStore } from "@/stores/interview-store";
import { INTERVIEW_CATALOG } from "@/data/interview-catalog";
import { CATEGORY_META, DIFFICULTY_META } from "@/types/interview";
import type { CatalogEntry, Category, Difficulty } from "@/types/interview";
import styles from "./interview.module.css";

function getCompanyColor(company: string): string {
  const colors = ['#0D7377', '#7C6BB2', '#D97706', '#22C55E', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface InterviewCardProps {
  entry: CatalogEntry;
  onStart: (entry: CatalogEntry) => void;
  isFeatured?: boolean;
}

function InterviewCard({ entry, onStart, isFeatured }: InterviewCardProps) {
  const color = getCompanyColor(entry.company);
  const catMeta = CATEGORY_META[entry.category];
  const diffMeta = DIFFICULTY_META[entry.difficulties[0]];

  return (
    <div className={`${styles.interviewCard} ${isFeatured ? styles.interviewCardFeatured : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardCompanyLogo} style={{ backgroundColor: color }}>
          {entry.company.charAt(0)}
        </div>
        <div className={styles.cardTitleGroup}>
          <div className={styles.cardCompany}>{entry.company}</div>
          <div className={styles.cardRole}>{entry.role}</div>
        </div>
      </div>
      <div className={styles.cardBadges}>
        <span className={`${styles.cardBadge} ${styles.badgeCategory}`}>{catMeta.label}</span>
        <span className={`${styles.cardBadge} ${styles[`badgeType${entry.interviewType.replace(' ', '')}`]}`}>
          {entry.interviewType}
        </span>
        <span className={`${styles.cardBadge} ${styles.badgeDifficulty}`}>{diffMeta.label}</span>
        {isFeatured && (
          <span className={styles.cardBadge} style={{ background: '#fef3c7', color: '#D97706' }}>
            ★ Featured
          </span>
        )}
      </div>
      <div className={styles.cardMeta}>
        <Clock size={11} />
        <span>{entry.durationMinutes} min</span>
        <span>·</span>
        <span>{entry.questionCount} questions</span>
      </div>
      <button className={styles.cardStartBtn} onClick={() => onStart(entry)}>
        Start Interview <ArrowRight size={12} style={{ display: 'inline' }} />
      </button>
    </div>
  );
}

export default function InterviewPage() {
  const router = useRouter();
  const { selectInterview, sessions } = useInterviewStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  const categories: Array<Category | 'All'> = ['All', 'Consulting', 'Finance', 'Tech', 'Sales', 'Operations', 'HR'];

  const filtered = useMemo(() => {
    return INTERVIEW_CATALOG.filter(entry => {
      if (activeCategory !== 'All' && entry.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!entry.company.toLowerCase().includes(q) && !entry.role.toLowerCase().includes(q)) return false;
      }
      if (selectedDifficulty !== 'All' && !entry.difficulties.includes(selectedDifficulty)) return false;
      return true;
    });
  }, [activeCategory, searchQuery, selectedDifficulty]);

  const featured = filtered.filter(e => e.featured);
  const rest = filtered.filter(e => !e.featured);

  const pastSessions = sessions.filter(s => s.status === 'COMPLETED');
  const recentPast = pastSessions.slice(-5).reverse();

  const handleStart = (entry: CatalogEntry) => {
    selectInterview(entry, entry.difficulties[0]);
    router.push('/interview/setup');
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.heroStrip}>
        <h1 className={styles.heroTitle}>AI Mock Interview</h1>
        <p className={styles.heroSub}>Practice real interviews for real companies. Get instant feedback.</p>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? 'All' : (CATEGORY_META[cat]?.label ?? cat)}
          </button>
        ))}
        <input
          type="text"
          className={styles.filterSearch}
          placeholder="Search company or role..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>No interviews match your filters</h2>
          <p className={styles.emptySub}>Try adjusting your search or category selection.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <div style={{ padding: '20px 28px 4px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a8a29e', marginBottom: '12px' }}>
                ★ Most Popular
              </div>
              <div className={styles.catalogGrid}>
                {featured.map(entry => (
                  <InterviewCard key={entry.id} entry={entry} onStart={handleStart} isFeatured />
                ))}
              </div>
            </div>
          )}

          {/* All interviews */}
          <div style={{ padding: featured.length > 0 ? '16px 28px 28px' : '20px 28px 28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a8a29e', marginBottom: '12px' }}>
              All Interviews
            </div>
            <div className={styles.catalogGrid}>
              {rest.map(entry => (
                <InterviewCard key={entry.id} entry={entry} onStart={handleStart} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent sessions */}
      {recentPast.length > 0 && (
        <div className={styles.recentSection}>
          <div className={styles.recentTitle}>Recent Sessions</div>
          <div className={styles.recentScroll}>
            {recentPast.map(session => (
              <div
                key={session.id}
                className={styles.recentCard}
                onClick={() => router.push(`/interview/report/${session.id}`)}
              >
                <div className={styles.recentCardCompany}>{session.company}</div>
                <div className={styles.recentCardRole}>{session.role}</div>
                {session.overallScore !== undefined && (
                  <div className={`${styles.recentCardScore} ${
                    session.overallScore >= 80 ? styles.scoreGreen :
                    session.overallScore >= 60 ? styles.scoreAmber :
                    styles.scoreRed
                  }`}>
                    {session.overallScore}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#a8a29e', marginTop: '4px' }}>
                  {new Date(session.completedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
