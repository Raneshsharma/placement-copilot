"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  DollarSign,
  Grid,
  List,
  Heart,
  Zap,
  Globe,
  Briefcase,
  Building2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobApi } from "@/lib/api";
import { toast } from "sonner";
import { useJobStore } from "@/stores/job-store";
import { motion } from "framer-motion";

interface JobRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedAt?: string;
  keywords?: string[];
  matchScore?: number;
  match?: number;
}

interface SavedJobRecord {
  id: string;
  jobId: string;
  savedAt: string;
  job?: JobRecord | null;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Recently posted";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

type FilterLabel = "90%+ Match" | "Remote" | "Student" | "Entry Level" | ">$80k";

const FILTER_CONFIG: { label: FilterLabel; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "90%+ Match", icon: Zap },
  { label: "Remote", icon: Globe },
  { label: "Student", icon: Briefcase },
  { label: "Entry Level", icon: Building2 },
  { label: ">$80k", icon: DollarSign },
];

function getMatchScore(job: JobRecord): number {
  return job.matchScore ?? job.match ?? 0;
}

function getMatchBadgeVariant(score: number): "success" | "warning" | "default" | "tonal" {
  if (score >= 90) return "success";
  if (score >= 70) return "warning";
  return "default";
}

function getLeftBorderColor(score: number): string {
  if (score >= 90) return "border-l-success";
  if (score >= 70) return "border-l-warning";
  return "border-l-secondary";
}

export default function RolesPage() {
  const { viewMode, setViewMode, savedJobIds } = useJobStore();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterLabel[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  }, []);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        setSearchQuery(searchInput);
      }
    },
    [searchInput]
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
  }, []);

  useEffect(() => {
    jobApi
      .getSaved()
      .then((res) => setSavedJobs(res.data?.data ?? res.data ?? []))
      .catch(() => setSavedJobs([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, unknown> = {};
    if (searchQuery) params.query = searchQuery;
    jobApi
      .list(params)
      .then((res) => {
        const items = (res.data?.items ?? res.data?.data ?? res.data ?? []) as JobRecord[];
        setJobs(items);
      })
      .catch(() => {
        setJobs([]);
        toast.error("Failed to load roles");
      })
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const toggleFilter = useCallback((label: FilterLabel) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : ([...prev, label] as FilterLabel[])
    );
  }, []);

  const clearFilters = useCallback(() => setActiveFilters([]), []);

  const handleToggleSave = useCallback(
    async (jobId: string) => {
      const isSaved = savedJobIds.includes(jobId);
      const newSavedIds = isSaved
        ? savedJobIds.filter((id) => id !== jobId)
        : [...savedJobIds, jobId];
      useJobStore.setState({ savedJobIds: newSavedIds });

      try {
        if (isSaved) {
          const saved = savedJobs.find((s) => s.jobId === jobId);
          if (saved) await jobApi.unsave(saved.id);
          setSavedJobs((prev) => prev.filter((s) => s.jobId !== jobId));
        } else {
          const res = await jobApi.save(jobId);
          const newSaved = (res.data as SavedJobRecord) ?? {
            jobId,
            savedAt: new Date().toISOString(),
          };
          setSavedJobs((prev) => [{ ...newSaved, jobId }, ...prev.filter((s) => s.jobId !== jobId)]);
        }
      } catch {
        useJobStore.setState({ savedJobIds });
        toast.error("Couldn't save — try again");
      }
    },
    [savedJobIds, savedJobs]
  );

  const filteredJobs = jobs.filter((job) => {
    const score = getMatchScore(job);
    if (activeFilters.includes("90%+ Match") && score < 90) return false;
    if (activeFilters.includes("Remote")) {
      const remote =
        job.locationType === "REMOTE" || job.location?.toLowerCase().includes("remote");
      if (!remote) return false;
    }
    if (activeFilters.includes("Entry Level") || activeFilters.includes("Student")) {
      const keywords = (job.keywords ?? []).map((k) => k.toLowerCase());
      const entryKeywords = [
        "entry",
        "junior",
        "intern",
        "new grad",
        "graduate",
        "entry-level",
      ];
      const isEntry = entryKeywords.some(
        (k) =>
          job.title.toLowerCase().includes(k) ||
          keywords.some((j) => j.includes(k))
      );
      if (!isEntry) return false;
    }
    if (activeFilters.includes(">$80k")) {
      if (!job.salaryMin || job.salaryMin < 80000) return false;
    }
    return true;
  });

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-on-surface">Discover Roles</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Find opportunities that match your skills and goals
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
        <Input
          placeholder="Search roles, companies..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-10 h-11 pr-10"
        />
        {searchInput && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Pills + View Toggle */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {FILTER_CONFIG.map((filter) => {
          const active = activeFilters.includes(filter.label);
          const Icon = filter.icon;
          return (
            <button
              key={filter.label}
              onClick={() => toggleFilter(filter.label)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap surface-shift flex items-center gap-1.5 transition-all ${
                active
                  ? "bg-primary text-white shadow-ambient-sm"
                  : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {filter.label}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-sm text-on-surface-variant hover:text-on-surface whitespace-nowrap surface-shift rounded-full hover:bg-surface-container-low"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}

        <div className="ml-auto flex-shrink-0">
          <div className="bg-surface-container-low rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-surface-container-highest shadow-ambient-sm text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-mid"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-surface-container-highest shadow-ambient-sm text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-mid"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <p className="text-sm text-on-surface-variant mb-4">
        {loading
          ? "Loading..."
          : `${filteredJobs.length} role${filteredJobs.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Job Grid / List */}
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`bg-surface-container-highest rounded-xl shadow-ambient-sm overflow-hidden ${
                viewMode === "grid" ? "" : "p-4 flex items-center gap-4"
              }`}
            >
              <div
                className={`animate-shimmer h-10 w-10 rounded-lg bg-surface-container-high ${
                  viewMode === "list" ? "flex-shrink-0" : ""
                }`}
              />
              <div className="flex-1 space-y-2 p-4">
                <div className="animate-shimmer h-4 w-3/4 rounded bg-surface-container-high" />
                <div className="animate-shimmer h-3 w-1/2 rounded bg-surface-container-high" />
                <div className="flex gap-1.5 mt-2">
                  <div className="animate-shimmer h-5 w-12 rounded-full bg-surface-container-high" />
                  <div className="animate-shimmer h-5 w-16 rounded-full bg-surface-container-high" />
                </div>
                <div className="animate-shimmer h-9 w-full rounded-lg mt-2 bg-surface-container-high" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-on-surface-disabled mx-auto mb-3" />
          <p className="text-on-surface-variant mb-3">
            {searchQuery
              ? `No roles match "${searchQuery}"`
              : "No roles found matching your filters."}
          </p>
          {(hasActiveFilters || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearFilters();
                clearSearch();
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const score = getMatchScore(job);
            const badgeVariant = getMatchBadgeVariant(score);
            const borderColor = getLeftBorderColor(score);
            const logo = job.company?.charAt(0).toUpperCase() ?? "?";
            const salary = formatSalary(job.salaryMin, job.salaryMax);
            const isSaved = savedJobIds.includes(job.id);
            const skills = (Array.isArray(job.keywords) ? job.keywords : []).slice(0, 3);

            return (
              <motion.div
                key={job.id}
                className={`bg-surface-container-highest rounded-xl shadow-ambient-sm surface-shift hover:shadow-ambient-md relative border-l-4 ${borderColor}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm">
                      {logo}
                    </div>
                    {score > 0 && (
                      <Badge variant={badgeVariant} className="text-xs">
                        {score}%
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-on-surface mb-1">{job.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-2">{job.company}</p>

                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {job.location || "Location not specified"}
                  </div>

                  {salary && (
                    <div className="flex items-center gap-1 text-sm text-success font-medium mb-3">
                      <DollarSign className="w-3 h-3" />
                      {salary}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full text-xs bg-surface-dim text-on-surface-variant"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(job.id)}
                      className="p-1.5 rounded-md hover:bg-surface-container-low surface-shift text-on-surface-disabled hover:text-error"
                      title={isSaved ? "Unsave" : "Save"}
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? "fill-error text-error" : ""}`}
                      />
                    </button>
                    <Link href={`/roles/${job.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full h-9 text-sm">
                        View Role
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const score = getMatchScore(job);
            const badgeVariant = getMatchBadgeVariant(score);
            const logo = job.company?.charAt(0).toUpperCase() ?? "?";
            const salary = formatSalary(job.salaryMin, job.salaryMax);
            const isSaved = savedJobIds.includes(job.id);
            const skills = (Array.isArray(job.keywords) ? job.keywords : []).slice(0, 3);

            return (
              <motion.div
                key={job.id}
                className="bg-surface-container-highest rounded-xl shadow-ambient-sm surface-shift hover:shadow-ambient-md p-4 flex items-center gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                  {logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-on-surface">{job.title}</h3>
                    {score > 0 && (
                      <Badge variant={badgeVariant} className="text-xs">
                        {score}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {job.company} &bull; {job.location || "Location not specified"}
                  </p>
                  {salary && (
                    <p className="text-sm text-success font-medium">{salary}</p>
                  )}
                </div>

                {skills.length > 0 && (
                  <div className="hidden xl:flex flex-wrap gap-1 flex-shrink-0">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full text-xs bg-surface-dim text-on-surface-variant"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleSave(job.id)}
                    className="p-1.5 rounded-md hover:bg-surface-container-low surface-shift text-on-surface-disabled hover:text-error"
                    title={isSaved ? "Unsave" : "Save"}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-error text-error" : ""}`} />
                  </button>
                  <Link href={`/roles/${job.id}`}>
                    <Button variant="secondary" size="sm" className="h-9 text-sm">
                      View Role
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
