"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { jobApi, applicationApi } from "@/lib/api";
import { useJobStore } from "@/stores/job-store";
import { toast } from "sonner";
import {
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  MapPin,
  DollarSign,
  Building2,
  Users,
  TrendingUp,
  Star,
  ExternalLink,
} from "lucide-react";

function PPSRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 50;
  const ringColor = score >= 81 ? "#2ad760" : score >= 61 ? "#006879" : score >= 41 ? "#f59e0b" : "#dc2626";
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle cx="64" cy="64" r="50" fill="none" stroke="#eceef7" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r="50"
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (score / 100) * circumference}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-on-surface">{score}%</span>
        <span className="text-xs text-on-surface-variant">Match</span>
      </div>
    </div>
  );
}

function formatSalary(job: any): string {
  if (job.salary?.min && job.salary?.max) {
    return `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k`;
  }
  if (job.salary?.min) return `From $${(job.salary.min / 1000).toFixed(0)}k`;
  if (job.salary?.max) return `Up to $${(job.salary.max / 1000).toFixed(0)}k`;
  return job.salaryRange || "Not specified";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.roleId as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [defaultResumeId, setDefaultResumeId] = useState<string | null>(null);

  const jobStore = useJobStore();

  const checklistKey = `role-checklist-${roleId}`;
  const [checklist, setChecklist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(checklistKey);
    return saved
      ? JSON.parse(saved)
      : [
          "Researched company mission and values",
          "Reviewed job description keywords",
          "Prepared STAR stories for common questions",
          "Practiced with mock interview",
          "Tailored resume for this role",
        ];
  });

  useEffect(() => {
    jobApi
      .getById(roleId)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Role not found");
        router.push("/roles");
      });
  }, [roleId, router]);

  useEffect(() => {
    jobApi.getSaved().then((res) => {
      const data = res.data?.data ?? res.data;
      setSavedJobs(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    applicationApi.getAll().then((res) => {
      const apps: any[] = res.data?.data ?? res.data ?? [];
      const found = apps.find((a: any) => a.jobId === job?.id);
      if (found) setHasApplied(true);
    }).catch(() => {});
  }, [job?.id]);

  const toggleChecklist = useCallback(
    (index: number) => {
      const updated = [...checklist];
      updated[index] = updated[index].replace(/^\[ \] /, "[x] ").replace(/^\[x\] /, "[ ] ");
      setChecklist(updated);
      localStorage.setItem(checklistKey, JSON.stringify(updated));
    },
    [checklist, checklistKey]
  );

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      const savedJob = savedJobs.find((s) => s.jobId === job.id);
      await applicationApi.create({
        company: job.company?.name || job.company,
        position: job.title,
        jobId: job.id,
        savedJobId: savedJob?.id || null,
        status: "SUBMITTED",
        resumeId: defaultResumeId,
      });
      setHasApplied(true);
      toast.success("Application added to your tracker");
    } catch {
      toast.error("Failed to create application");
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSave = async () => {
    if (!job) return;
    const isSaved = jobStore.savedJobIds.includes(job.id);
    jobStore.toggleSave(job.id);
    try {
      if (isSaved) {
        const savedJob = savedJobs.find((s) => s.jobId === job.id);
        if (savedJob) await jobApi.unsave(savedJob.id);
        setSavedJobs((prev) => prev.filter((s) => s.id !== savedJob?.id));
      } else {
        await jobApi.save(job.id);
        await jobApi.getSaved().then((res) => {
          const data = res.data?.data ?? res.data;
          setSavedJobs(Array.isArray(data) ? data : []);
        });
      }
    } catch {
      jobStore.toggleSave(job.id);
      toast.error("Couldn't save");
    }
  };

  const matchScore = job?.matchScore ?? job?.match ?? 0;
  const isSaved = jobStore.savedJobIds.includes(job?.id);
  const companyName = job?.company?.name ?? job?.company ?? "";
  const companyLogo = job?.company?.logo;
  const companySize = job?.company?.size;
  const companyFounded = job?.company?.founded;
  const companyRating = job?.company?.glassdoorRating;
  const companyFortune = job?.company?.fortuneRank;

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-48 h-6 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {job.isActive === false && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 text-warning text-sm font-medium">
          This role is no longer available.
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg hover:bg-surface-container-low surface-shift cursor-pointer"
          onClick={() => router.push("/roles")}
        >
          <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
        </button>
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={companyName}
            className="h-12 w-12 rounded-full object-contain"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-secondary text-lg">
            {companyName[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display text-on-surface">{job.title}</h1>
          <p className="text-sm text-on-surface-variant">{companyName}</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-surface-container-low surface-shift cursor-pointer">
          <Share2 className="w-5 h-5 text-on-surface-variant" />
        </button>
        <button
          onClick={handleToggleSave}
          className="p-2 rounded-lg hover:bg-error/5 surface-shift cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isSaved ? "fill-error text-error" : "text-on-surface-variant"
            }`}
          />
        </button>
      </div>

      {/* Match Score + Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center">
          <PPSRing score={matchScore} />
          <p className="text-sm text-on-surface-variant mt-2">Your match score</p>
        </Card>
        <Card className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-on-surface-variant" />
            {job.location}
            {job.remote && (
              <Badge variant="secondary" className="ml-1">Remote</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-success">
            <DollarSign className="w-4 h-4" />
            {formatSalary(job)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-on-surface-variant" /> {companyName}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-on-surface-variant" />
            {companySize || "Not specified"}
          </div>
          {job.postedAt && (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              Posted {formatDate(job.postedAt)}
            </div>
          )}
        </Card>
        <Card className="p-4 flex flex-col gap-3">
          {companyFounded && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-on-surface-variant" /> Founded {companyFounded}
            </div>
          )}
          {companyRating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-warning" /> {companyRating} rating on Glassdoor
            </div>
          )}
          {companyFortune && (
            <Badge variant="secondary" className="w-fit">
              Fortune {companyFortune}
            </Badge>
          )}
        </Card>
      </div>

      {/* Apply Now Button */}
      <div className="flex items-center gap-4">
        {hasApplied ? (
          <>
            <Button
              disabled
              className="bg-success hover:bg-success-light text-white flex-1 py-6 text-lg font-semibold shadow-ambient-sm"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Applied
            </Button>
            <Button
              variant="outline"
              className="py-6 text-lg font-semibold"
              onClick={() => router.push("/applications")}
            >
              View in Applications
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <Button
            className="w-full bg-primary hover:bg-primary-light text-white py-6 text-lg font-semibold shadow-ambient-sm btn-hover-shift"
            onClick={handleApply}
            disabled={applying || job.isActive === false}
          >
            {applying ? "Applying..." : `Apply Now — ${companyName}`}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-surface-container-low rounded-xl p-1 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="salary">Salary & Benefits</TabsTrigger>
          <TabsTrigger value="prep">Application Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold font-display mb-3 text-on-surface">About the Role</h2>
            <div className="prose prose-sm text-on-surface-variant space-y-3">
              {(job.description || "")
                .split("\n\n")
                .filter(Boolean)
                .map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </div>
          {job.matchReasons?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold font-display mb-3 text-on-surface">Why You Match</h2>
              <ul className="space-y-2">
                {job.matchReasons.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold font-display mb-3 text-on-surface">Required Skills</h2>
            <div className="space-y-2">
              {job.requirements
                ?.filter((r: any) => r.required)
                .map((req: any) => (
                  <div
                    key={req.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest border border-outline-variant"
                  >
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm font-medium text-on-surface">{req.name}</span>
                    <Badge variant="error" className="ml-auto">Required</Badge>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display mb-3 text-on-surface">Nice to Have</h2>
            <div className="space-y-2">
              {job.requirements
                ?.filter((r: any) => !r.required)
                .map((req: any) => (
                  <div
                    key={req.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest border border-outline-variant"
                  >
                    <Heart className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-sm font-medium text-on-surface">{req.name}</span>
                    <Badge variant="tonal" className="ml-auto">Differentiator</Badge>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <div className="text-center p-6 bg-surface-container-mid rounded-xl">
            <p className="text-3xl font-bold text-success">{formatSalary(job)}</p>
            <p className="text-sm text-on-surface-variant mt-1">Base salary per year</p>
          </div>
          {job.benefits?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold font-display mb-3 text-on-surface">Benefits</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {job.benefits.map((b: string) => (
                  <div
                    key={b}
                    className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-mid"
                  >
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-on-surface">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prep" className="space-y-6">
          {job.applicationTips?.length > 0 && (
            <Card className="p-4 bg-warning/5 border border-warning/20">
              <h3 className="font-semibold text-on-surface mb-2">AI Application Tips</h3>
              <ul className="space-y-1.5 text-sm text-on-surface-variant">
                {job.applicationTips.map((tip: string, i: number) => (
                  <li key={i}>&#8226; {tip}</li>
                ))}
              </ul>
            </Card>
          )}
          <div>
            <h3 className="font-semibold text-on-surface mb-2">Resume Match</h3>
            <div className="flex items-center gap-4 mb-2">
              <Progress value={matchScore} className="flex-1 h-2" />
              <span className="text-sm font-bold text-primary">{matchScore}%</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Your resume covers {matchScore}% of this role&apos;s keywords
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-on-surface">Application Checklist</h3>
            {checklist.map((item, index) => {
              const checked = item.startsWith("[x]");
              return (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low surface-shift"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChecklist(index)}
                    className="w-4 h-4 rounded accent-secondary"
                  />
                  <span className="text-sm text-on-surface">{item.replace(/^\[.\] /, "")}</span>
                </label>
              );
            })}
          </div>
          {!hasApplied && job.isActive !== false && (
            <Button
              className="w-full bg-primary hover:bg-primary-light text-white py-6 text-lg font-semibold shadow-ambient-sm btn-hover-shift disabled:opacity-50"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Applying..." : `Apply Now — ${companyName}`}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
