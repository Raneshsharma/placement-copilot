"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { resumeApi } from "@/lib/api";
import { useResumeStore, Resume } from "@/stores/resume-store";
import { toast } from "sonner";
import {
  Plus, Search, FileText, MoreHorizontal, Edit2, Copy, Trash2,
  Download, CheckCircle, Zap, ExternalLink, Star, Link2,
  LayoutList, Grid3X3, SlidersHorizontal, X, Loader2
} from "lucide-react";

// ─── Resume Card ───────────────────────────────────────────────────────────

function ResumeCard({ resume, onEdit, onDuplicate, onDelete, onDownloadPdf, onDownloadDocx }: {
  resume: Resume;
  onEdit: () => void; onDuplicate: () => void; onDelete: () => void;
  onDownloadPdf: () => void; onDownloadDocx: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const atsScore = resume.atsScore ?? 72;
  const scoreColor = atsScore >= 80 ? "text-success" : atsScore >= 60 ? "text-warning" : "text-error";
  const scoreBar = `${atsScore}%`;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <Card className="bg-surface-container-highest shadow-ambient-sm surface-shift hover:shadow-ambient-md p-5 group">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs shrink-0">{resume.template}</Badge>
              {resume.status === "draft" && <Badge variant="warning" className="text-xs">Draft</Badge>}
              {resume.status === "complete" && <Badge variant="success" className="text-xs">Complete</Badge>}
            </div>
            <h3 className="font-semibold text-on-surface truncate">{resume.name}</h3>
            {resume.title && <p className="text-sm text-on-surface-variant truncate">{resume.title}</p>}
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-surface-container-low surface-shift opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-on-surface-variant" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 bg-surface-container-highest rounded-xl shadow-ambient-md border border-outline-variant py-1 min-w-[180px] animate-scale-in">
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low surface-shift">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { onDuplicate(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low surface-shift">
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <button onClick={() => { onDownloadPdf(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low surface-shift">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={() => { onDownloadDocx(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low surface-shift">
                  <FileText className="w-4 h-4" /> Download DOCX
                </button>
                {resume.linkedJobId && (
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low surface-shift">
                    <Link2 className="w-4 h-4" /> View Role Link
                  </button>
                )}
                <hr className="my-1 border-outline-variant" />
                <button onClick={() => { setDeleteDialogOpen(true); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 surface-shift">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Updated + status */}
        <p className="text-xs text-on-surface-disabled mb-3">Updated {formatDate(resume.updatedAt)}</p>

        {/* ATS Score */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-on-surface-variant">ATS Score:</span>
          <span className={`text-lg font-bold font-display ${scoreColor}`}>{atsScore}</span>
          <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${atsScore >= 80 ? "bg-success" : atsScore >= 60 ? "bg-warning" : "bg-error"}`} style={{ width: scoreBar }} />
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <p className="text-xs text-on-surface-variant mb-3 truncate">
            Skills: {resume.skills.slice(0, 3).map((s: any) => s.name || s).join(", ")}
            {resume.skills.length > 3 && ` (+${resume.skills.length - 3})`}
          </p>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-outline-variant">
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 text-xs">
            <Edit2 className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={onDuplicate} className="h-8 text-xs text-on-surface-variant hover:text-on-surface">
            <Copy className="w-3 h-3 mr-1" /> Duplicate
          </Button>
          <Button size="sm" variant="ghost" onClick={onDownloadPdf} className="h-8 text-xs text-on-surface-variant hover:text-on-surface">
            <Download className="w-3 h-3 mr-1" /> PDF
          </Button>
          {resume.linkedJobId && (
            <Link href="/roles" className="ml-auto">
              <Button size="sm" variant="ghost" className="h-8 text-xs text-secondary hover:text-secondary">
                <Zap className="w-3 h-3 mr-1" /> Match to Role
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-surface-container-highest shadow-ambient-lg">
          <DialogHeader>
            <DialogTitle>Delete Resume?</DialogTitle>
            <DialogDescription>
              "{resume.name}" will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="default" className="bg-error hover:bg-error-dark text-white" onClick={() => { onDelete(); setDeleteDialogOpen(false); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="w-20 h-20 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto">
        <FileText className="w-10 h-10 text-on-surface-disabled" />
      </div>
      <h2 className="text-xl font-bold font-display text-on-surface">No Resumes Yet</h2>
      <p className="text-on-surface-variant max-w-sm mx-auto">
        Create your first resume to start building ATS-optimized applications tailored to each role.
      </p>
      <Button variant="default" size="lg" onClick={onCreate} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Create Resume
      </Button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ResumeListPage() {
  const router = useRouter();
  const resumeStore = useResumeStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "complete">("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "ats">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchRef = { current: 0 } as any;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load resumes
  useEffect(() => {
    setLoading(true);
    resumeApi.getAll()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setResumes(Array.isArray(data) ? data : []);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort
  const filtered = resumes
    .filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (debouncedSearch && !r.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "ats") return (b.atsScore ?? 0) - (a.atsScore ?? 0);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleCreate = () => router.push("/resume/builder");
  const handleEdit = (id: string) => router.push(`/resume/${id}`);
  const handleDuplicate = async (resume: Resume) => {
    try {
      const res = await resumeApi.duplicate(resume.id);
      const newResume = res.data?.data ?? res.data;
      if (newResume) setResumes((prev) => [newResume, ...prev]);
      toast.success("Resume duplicated");
    } catch {
      toast.error("Failed to duplicate resume");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };
  const handleDownloadPdf = async (id: string) => {
    try {
      const res = await resumeApi.downloadPdfById(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    }
  };
  const handleDownloadDocx = async (id: string) => {
    try {
      const res = await resumeApi.downloadDocxById(id);
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.setAttribute("download", "resume.docx");
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url);
      toast.success("DOCX downloaded!");
    } catch {
      toast.error("Failed to download DOCX");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">My Resumes</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {loading ? "Loading..." : `${filtered.length} resume${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button variant="default" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Resume
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
          {(["all", "draft", "complete"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === f
                  ? "bg-surface-container-highest text-primary shadow-ambient-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <option value="recent">Recently updated</option>
          <option value="name">Alphabetical</option>
          <option value="ats">ATS Score</option>
        </select>

        {/* View toggle */}
        <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-surface-container-highest shadow-ambient-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-surface-container-highest shadow-ambient-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container-highest rounded-xl shadow-ambient-sm p-5 space-y-3 animate-shimmer">
              <Skeleton className="w-24 h-5 rounded" />
              <Skeleton className="w-48 h-6 rounded" />
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-full h-2 rounded-full" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="w-16 h-8 rounded" />
                <Skeleton className="w-16 h-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onCreate={handleCreate} />
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {filtered.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEdit(resume.id)}
              onDuplicate={() => handleDuplicate(resume)}
              onDelete={() => handleDelete(resume.id)}
              onDownloadPdf={() => handleDownloadPdf(resume.id)}
              onDownloadDocx={() => handleDownloadDocx(resume.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}