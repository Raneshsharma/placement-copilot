"use client";

import {
  User,
  Sparkles,
  Briefcase,
  Award,
  Search,
  TrendingUp,
  Image,
  ImagePlus,
  Link,
  Type,
  FileText,
  Star,
  MessageCircle,
  List,
  ListChecks,
  Tag,
  ThumbsUp,
  MessageSquare,
  Activity,
  Edit,
  Users,
  Zap,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { RailGroup } from "@/types/linkedin-profile";
import styles from "@/app/(dashboard)/linkedin/linkedin-optimizer.module.css";

const iconMap: Record<string, LucideIcon> = {
  user: User,
  sparkles: Sparkles,
  briefcase: Briefcase,
  award: Award,
  search: Search,
  "trending-up": TrendingUp,
  image: Image,
  "image-plus": ImagePlus,
  link: Link,
  type: Type,
  "file-text": FileText,
  star: Star,
  "message-circle": MessageCircle,
  list: List,
  "list-checks": ListChecks,
  tag: Tag,
  "thumbs-up": ThumbsUp,
  "message-square": MessageSquare,
  activity: Activity,
  edit: Edit,
  users: Users,
  zap: Zap,
};

const statusColorMap: Record<string, string> = {
  complete: "railSubItemIconComplete",
  "in-progress": "railSubItemIconWarning",
  missing: "railSubItemIconCritical",
};

export interface LinkedInRailProps {
  groups: RailGroup[];
  selectedSectionId: string | null;
  expandedGroupId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onGroupToggle: (groupId: string) => void;
}

export default function LinkedInRail({
  groups,
  selectedSectionId,
  expandedGroupId,
  onSectionSelect,
  onGroupToggle,
}: LinkedInRailProps) {
  return (
    <div className={styles.rail}>
      <div className={styles.railSectionTitle}>Optimization Areas</div>

      {groups.map((group) => {
        const totalIssues = group.sections.reduce(
          (sum, s) => sum + s.issueCount,
          0
        );
        const hasIssues = group.sections.some((s) => s.issueCount > 0);
        const allComplete = group.sections.every(
          (s) => s.issueCount === 0
        );

        const groupIconClass = allComplete
          ? styles.railGroupIconComplete
          : hasIssues
          ? styles.railGroupIconWarning
          : styles.railGroupIcon;

        const GroupIcon = iconMap[group.icon] || Sparkles;
        const isExpanded = expandedGroupId === group.id;

        return (
          <div key={group.id} className={styles.railGroup}>
            <button
              className={styles.railGroupHeader}
              onClick={() => onGroupToggle(group.id)}
            >
              <div
                className={`${styles.railGroupIcon} ${groupIconClass}`}
              >
                <GroupIcon size={16} />
              </div>
              <span className={styles.railGroupName}>{group.name}</span>
              <span
                className={`${styles.railGroupCount} ${
                  totalIssues === 0 ? styles.railGroupCountGood : ""
                }`}
              >
                {totalIssues === 0 ? "All good" : totalIssues}
              </span>
              <ChevronDown
                size={14}
                className={`${styles.railGroupChevron} ${
                  isExpanded ? styles.railGroupChevronOpen : ""
                }`}
              />
            </button>

            {isExpanded && (
              <motion.div
                className={styles.railSubItems}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {group.sections.map((section) => {
                  const dotClass =
                    statusColorMap[section.status] ||
                    styles.railSubItemIconMissing;
                  const isSelected = selectedSectionId === section.id;

                  return (
                    <button
                      key={section.id}
                      className={`${styles.railSubItem} ${
                        isSelected ? styles.isSelected : ""
                      }`}
                      onClick={() => onSectionSelect(section.id)}
                    >
                      <div
                        className={`${styles.railSubItemIcon} ${dotClass}`}
                      />
                      <span className={styles.railSubItemName}>
                        {section.name}
                      </span>
                      {section.issueCount > 0 && (
                        <span className={styles.railSubItemBadge}>
                          {section.issueCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
