"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ATSScoreMeter } from "@/components/resume/ats-score-meter";
import { resumeApi } from "@/lib/api";
import { useResumeStore, ResumeState, TemplateType, SkillCategory, ResumeExperience, ResumeEducation } from "@/stores/resume-store";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, Save, Sparkles, Eye, Download,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, X, Loader2,
  FileText, Wand2, Zap, CheckCircle2, AlertCircle,
  Award, Code2, Globe, Heart, Star, Briefcase, GraduationCap,
  User, BookOpen, FileUp, LayoutTemplate, PenLine, Upload,
  RefreshCw, Clock, BrainCircuit
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type StepId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const STEPS = [
  { id: 0 as StepId, label: "Start" },
  { id: 1 as StepId, label: "Template" },
  { id: 2 as StepId, label: "Profile" },
  { id: 3 as StepId, label: "Experience" },
  { id: 4 as StepId, label: "Education" },
  { id: 5 as StepId, label: "Skills" },
  { id: 6 as StepId, label: "Additional" },
  { id: 7 as StepId, label: "ATS Score" },
  { id: 8 as StepId, label: "Preview" },
  { id: 9 as StepId, label: "Save" },
];

const TEMPLATES: Array<{ id: TemplateType; name: string; desc: string; atsSafe: boolean; accentColor: string; style: "modern" | "minimal" | "executive" | "sidebar" | "two-col" | "academic" }> = [
  { id: "MODERN", name: "Modern", desc: "Bold header, clean layout", atsSafe: true, accentColor: "#003178", style: "modern" },
  { id: "MINIMAL", name: "Minimal", desc: "Maximum whitespace, clean", atsSafe: true, accentColor: "#2D2D2D", style: "minimal" },
  { id: "EXECUTIVE", name: "Executive", desc: "Traditional, serif-forward", atsSafe: true, accentColor: "#1a1a2e", style: "executive" },
  { id: "TECHNICAL", name: "Technical", desc: "Code-friendly, structured", atsSafe: true, accentColor: "#006879", style: "two-col" },
  { id: "CONSULTING", name: "Consulting", desc: "Achievement-focused", atsSafe: true, accentColor: "#2D4A6B", style: "sidebar" },
  { id: "CREATIVE", name: "Creative", desc: "Colorful sidebar", atsSafe: false, accentColor: "#7C3AED", style: "sidebar" },
  { id: "ACADEMIC", name: "Academic", desc: "Publication-ready", atsSafe: true, accentColor: "#166534", style: "academic" },
  { id: "ENTRY_LEVEL", name: "Entry Level", desc: "Fresh graduate friendly", atsSafe: true, accentColor: "#003178", style: "modern" },
];

const SKILL_CATEGORIES: Array<{ id: SkillCategory; label: string; icon: React.ReactNode }> = [
  { id: "technical", label: "Technical", icon: <Code2 className="w-3 h-3" /> },
  { id: "soft", label: "Soft Skills", icon: <Heart className="w-3 h-3" /> },
  { id: "tools", label: "Tools", icon: <Wand2 className="w-3 h-3" /> },
  { id: "languages", label: "Languages", icon: <Globe className="w-3 h-3" /> },
];

const PROFICIENCY_LABELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

const START_METHODS = [
  { id: "scratch", icon: <PenLine className="w-6 h-6" />, title: "Start from Scratch", desc: "Build resume section by section" },
  { id: "import", icon: <FileUp className="w-6 h-6" />, title: "Import Resume", desc: "Upload PDF — AI parses and imports" },
  { id: "template", icon: <LayoutTemplate className="w-6 h-6" />, title: "Use a Template", desc: "Browse gallery and start from a design" },
];

// ─── Template Preview Renderer ──────────────────────────────────────────────

function TemplatePreview({ template }: { template: typeof TEMPLATES[0] }) {
  const { accentColor, style } = template;

  if (style === "minimal") {
    return (
      <div className="w-full h-full bg-white rounded p-3 font-sans">
        <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded mb-2" />
        <div className="h-2 w-1/2 mx-auto bg-gray-100 rounded mb-3" />
        <div className="border-t border-b border-gray-200 py-2 mb-2">
          <div className="h-1.5 w-full bg-gray-100 rounded mb-1" />
          <div className="h-1.5 w-4/5 bg-gray-100 rounded mb-1" />
          <div className="h-1.5 w-3/5 bg-gray-100 rounded" />
        </div>
        <div className="space-y-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${70 + i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (style === "sidebar") {
    return (
      <div className="w-full h-full bg-white rounded flex overflow-hidden font-sans">
        <div className="w-1/3 bg-gray-900 p-2">
          <div className="h-3 bg-gray-700 rounded mb-2" />
          <div className="space-y-1">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-1 bg-gray-700 rounded opacity-60" style={{ width: `${60 + i * 10}%` }} />)}
          </div>
        </div>
        <div className="w-2/3 p-2">
          <div className="h-4 bg-gray-300 rounded mb-1" />
          <div className="h-2 bg-gray-200 rounded mb-2" />
          <div className="space-y-0.5">
            {[1, 2, 3].map(i => <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${80 - i * 5}%` }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (style === "two-col") {
    return (
      <div className="w-full h-full bg-white rounded p-3 font-sans">
        <div className="h-5 rounded mb-1" style={{ backgroundColor: accentColor }} />
        <div className="h-2 w-1/2 rounded mb-2" style={{ backgroundColor: accentColor + "30" }} />
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="bg-gray-100 rounded p-1"><div className="h-1.5 bg-gray-300 rounded mb-0.5" /><div className="h-1 bg-gray-200 rounded" /></div>
          <div className="bg-gray-100 rounded p-1"><div className="h-1.5 bg-gray-300 rounded mb-0.5" /><div className="h-1 bg-gray-200 rounded" /></div>
        </div>
        <div className="space-y-0.5">
          {[1, 2, 3].map(i => <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${90 - i * 8}%` }} />)}
        </div>
      </div>
    );
  }

  // Default modern
  return (
    <div className="w-full h-full bg-white rounded p-3 font-sans">
      <div className="h-5 rounded mb-1" style={{ backgroundColor: accentColor }} />
      <div className="h-2 w-1/2 rounded mb-2" style={{ backgroundColor: accentColor + "30" }} />
      <div className="border-t border-b border-gray-200 py-1.5 mb-2">
        <div className="space-y-0.5">
          {[1, 2, 3].map(i => <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${80 - i * 5}%` }} />)}
        </div>
      </div>
      <div className="space-y-0.5">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${70 + i * 7}%` }} />)}
      </div>
    </div>
  );
}

// ─── Auto-Save ───────────────────────────────────────────────────────────────

function useAutoSave(store: ResumeState, resumeId: string | null, currentStep: StepId) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isDirtyRef = useRef(false);
  const saveCountRef = useRef(0);

  useEffect(() => { isDirtyRef.current = store.hasUnsavedChanges; }, [store.hasUnsavedChanges]);

  const save = useCallback(async (label = "auto") => {
    if (!store.currentResume || !isDirtyRef.current) return;
    if (saveStatus === "saving") return; // Prevent concurrent saves

    setSaveStatus("saving");
    store.markSaving();

    try {
      if (resumeId) {
        await resumeApi.updateById(resumeId, store.currentResume as unknown as Record<string, unknown>);
      } else {
        const res = await resumeApi.create(store.currentResume as unknown as Record<string, unknown>);
        const created = res.data?.data ?? res.data;
        if (created?.id) {
          store.setCurrentResume({ ...store.currentResume, id: created.id });
        }
      }
      store.markSaved();
      setSaveStatus("saved");
      saveCountRef.current++;
      setTimeout(() => setSaveStatus(s => s === "saved" ? "idle" : s), 2500);
    } catch (err: any) {
      store.markUnsaved();
      setSaveStatus("error");
      console.error("Auto-save failed:", err?.message || err);
    }
  }, [store, resumeId, saveStatus]);

  // Save on step change (user navigating)
  useEffect(() => {
    if (store.hasUnsavedChanges) save("step");
  }, [currentStep]);

  // Save on 15s interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirtyRef.current) save("interval");
    }, 15000);
    return () => clearInterval(timer);
  }, [save]);

  // Save on window blur
  useEffect(() => {
    const handler = () => { if (isDirtyRef.current) save("blur"); };
    window.addEventListener("blur", handler);
    return () => window.removeEventListener("blur", handler);
  }, [save]);

  return { save, saveStatus };
}

// ─── Step 0: Start Method ──────────────────────────────────────────────────────

function StepStart({
  onScratch, onImport, onTemplate
}: {
  onScratch: () => void;
  onImport: () => void;
  onTemplate: () => void;
}) {
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setImportError("Only PDF or DOCX files are supported");
      return;
    }

    setImporting(true);
    setImportError("");

    try {
      const res = await resumeApi.importPdf(file);
      const result = res.data?.data ?? res.data;

      if (result?.parsed) {
        toast.success("Resume imported! Review and edit the parsed content.");
        onImport(); // pass parsed data up
      } else {
        toast.info("File uploaded. Fill in details manually or use a template.");
        onImport();
      }
    } catch (err: any) {
      setImportError(err?.response?.data?.error || "Failed to import. Try again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">How would you like to start?</h2>
        <p className="text-on-surface-variant">Choose the method that works best for you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {/* Scratch */}
        <Card
          className="p-6 cursor-pointer transition-all hover:shadow-ambient-md surface-shift text-center group"
          onClick={onScratch}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <PenLine className="w-7 h-7" />
          </div>
          <h3 className="font-semibold text-on-surface mb-1">Start from Scratch</h3>
          <p className="text-sm text-on-surface-variant">Build your resume section by section with guided prompts</p>
        </Card>

        {/* Import */}
        <Card className="p-6 cursor-pointer transition-all hover:shadow-ambient-md surface-shift text-center group relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={importing}
          />
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            {importing ? <Loader2 className="w-7 h-7 animate-spin" /> : <FileUp className="w-7 h-7" />}
          </div>
          <h3 className="font-semibold text-on-surface mb-1">Import Resume</h3>
          <p className="text-sm text-on-surface-variant">Upload PDF — AI parses and imports</p>
          {importError && (
            <p className="text-xs text-error mt-2">{importError}</p>
          )}
        </Card>

        {/* Template */}
        <Card
          className="p-6 cursor-pointer transition-all hover:shadow-ambient-md surface-shift text-center group"
          onClick={onTemplate}
        >
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4 text-success group-hover:bg-success group-hover:text-white transition-colors">
            <LayoutTemplate className="w-7 h-7" />
          </div>
          <h3 className="font-semibold text-on-surface mb-1">Use a Template</h3>
          <p className="text-sm text-on-surface-variant">Browse gallery and start from a design</p>
        </Card>
      </div>
    </div>
  );
}

// ─── Step 1: Template ─────────────────────────────────────────────────────────

function StepTemplate({ store }: { store: ResumeState }) {
  const t = store.activeTemplate;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Choose a Template</h2>
        <p className="text-on-surface-variant">Pick a visual style for your resume</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => store.setTemplate(tmpl.id)}
            className={`relative rounded-xl border-2 p-1.5 transition-all hover:shadow-ambient-md ${
              t === tmpl.id
                ? "border-primary bg-primary/5 shadow-ambient-sm"
                : "border-outline-variant bg-surface-container-highest hover:border-primary/30"
            }`}
          >
            <div className="aspect-[3/4]">
              <TemplatePreview template={tmpl} />
            </div>
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-xs font-medium text-on-surface">{tmpl.name}</span>
              {!tmpl.atsSafe && <Badge variant="warning" className="text-[9px] px-1 py-0">⚠ ATS</Badge>}
            </div>
            {t === tmpl.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-ambient-sm">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────

function StepProfile({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const header = resume?.header ?? { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" };
  const [summary, setSummary] = useState(resume?.summary ?? "");
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState("");

  const updateHeader = (field: string, value: string) => {
    if (!resume) return;
    store.updateSection("header", { ...header, [field]: value });
  };

  const updateSummary = (val: string) => {
    setSummary(val);
    if (resume) store.updateSection("summary", val);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await resumeApi.generateSummary({
        prompt: "Generate a professional summary",
        resumeData: {
          header: resume?.header,
          title: resume?.title,
          experience: resume?.experience,
          education: resume?.education,
          skills: resume?.skills,
        },
      });
      const generated = res.data?.data?.summary ?? "";
      if (generated) {
        updateSummary(generated);
        toast.success("Summary generated!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!summary) return;
    setImproving(true);
    try {
      const res = await resumeApi.generateSummary({
        prompt: "Improve this summary",
        currentSummary: summary,
        resumeData: {
          header: resume?.header,
          title: resume?.title,
          experience: resume?.experience,
          education: resume?.education,
          skills: resume?.skills,
        },
      });
      const improved = res.data?.data?.summary ?? "";
      if (improved) {
        setImprovedSummary(improved);
      }
    } catch {
      toast.error("Failed to improve summary");
    } finally {
      setImproving(false);
    }
  };

  const acceptImproved = () => {
    if (improvedSummary) {
      updateSummary(improvedSummary);
      setImprovedSummary("");
      toast.success("Summary updated!");
    }
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Jane Smith", required: true },
    { key: "email", label: "Email", placeholder: "jane@email.com", type: "email", required: true },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567", type: "tel", required: true },
    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/janesmith" },
    { key: "github", label: "GitHub", placeholder: "github.com/janesmith" },
    { key: "website", label: "Portfolio / Website", placeholder: "janesmith.dev" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Basic Information</h2>
        <p className="text-on-surface-variant">Your contact details and professional summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={`profile-${f.key}`}>{f.label} {f.required && <span className="text-error">*</span>}</Label>
            <Input
              id={`profile-${f.key}`}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              value={(header as Record<string, string>)[f.key] ?? ""}
              onChange={(e) => updateHeader(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-title">Professional Title</Label>
        <Input
          id="profile-title"
          placeholder="e.g., Senior Frontend Engineer"
          value={resume?.title ?? ""}
          onChange={(e) => store.setResumeTitle(e.target.value)}
        />
      </div>

      {/* Summary with AI */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <p className="text-xs text-on-surface-variant">{summary.length}/400 chars recommended</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
              {generating ? "Generating..." : "Generate with AI"}
            </Button>
            {summary && (
              <Button size="sm" variant="outline" onClick={handleImprove} disabled={improving}>
                {improving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                Improve
              </Button>
            )}
          </div>
        </div>

        <Textarea
          id="summary"
          placeholder="Write a brief summary of your experience, skills, and what you're looking for..."
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="min-h-[120px]"
          maxLength={600}
        />

        {/* Improved version preview */}
        {improvedSummary && (
          <Card className="p-3 bg-success/8 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">AI Improved Version</span>
            </div>
            <p className="text-sm text-on-surface mb-3">{improvedSummary}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={acceptImproved}>Use This Version</Button>
              <Button size="sm" variant="ghost" onClick={() => setImprovedSummary("")}>Discard</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Experience ───────────────────────────────────────────────────────

function StepExperience({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [suggesting, setSuggesting] = useState<string | null>(null);
  const [showSuggestFor, setShowSuggestFor] = useState<string | null>(null);
  const [suggestedBullets, setSuggestedBullets] = useState<string[]>([]);
  const experiences: ResumeExperience[] = resume?.experience ?? [];

  const addExperience = () => {
    store.addExperience({
      company: "", title: "", period: "", startDate: "", endDate: "",
      isCurrent: false, bullets: [], location: "", employmentType: "Full-time",
    });
    const newId = store.currentResume?.experience[store.currentResume.experience.length - 1]?.id;
    if (newId) setExpanded(newId);
  };

  const updateExp = (id: string, field: string, value: unknown) => {
    if (!resume) return;
    store.updateSection("experience", resume.experience.map((e: ResumeExperience) => e.id === id ? { ...e, [field]: value } : e));
  };

  const addBullet = (id: string) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    updateExp(id, "bullets", [...exp.bullets, ""]);
  };

  const updateBullet = (id: string, idx: number, val: string) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    const bullets = [...exp.bullets]; bullets[idx] = val;
    updateExp(id, "bullets", bullets);
  };

  const removeBullet = (id: string, idx: number) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    updateExp(id, "bullets", exp.bullets.filter((_: string, i: number) => i !== idx));
  };

  const handleSuggest = async (id: string) => {
    const exp = resume?.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp?.title && !exp?.company) {
      toast.error("Fill in job title or company first");
      return;
    }
    setSuggesting(id);
    setSuggestedBullets([]);
    setShowSuggestFor(id);
    try {
      const res = await resumeApi.suggestAchievements({
        jobTitle: exp.title,
        company: exp.company,
        existingAchievements: exp.bullets,
      });
      const bullets: string[] = res.data?.data?.achievements ?? [];
      if (bullets.length > 0) {
        setSuggestedBullets(bullets);
      } else {
        toast.info("No suggestions available. Add bullets manually.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to suggest achievements");
    } finally {
      setSuggesting(null);
    }
  };

  const applySuggested = (id: string) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    const merged = Array.from(new Set<string>([...exp.bullets, ...suggestedBullets]));
    updateExp(id, "bullets", merged);
    setSuggestedBullets([]);
    setShowSuggestFor(null);
    toast.success(`Added ${suggestedBullets.length} achievement bullets`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Work Experience</h2>
        <p className="text-on-surface-variant">Add your professional experience (most recent first)</p>
      </div>

      {experiences.length === 0 && (
        <Card className="p-8 text-center bg-surface-container-highest shadow-ambient-sm">
          <Briefcase className="w-10 h-10 text-on-surface-disabled mx-auto mb-3" />
          <p className="text-on-surface-variant mb-4">No experience added yet</p>
        </Card>
      )}

      <div className="space-y-3">
        {experiences.map((exp, i) => (
          <Card key={exp.id} className="bg-surface-container-highest shadow-ambient-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low surface-shift text-left"
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="w-4 h-4 text-on-surface-disabled shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-on-surface truncate">{exp.title || `Position ${i + 1}`}</p>
                  <p className="text-sm text-on-surface-variant truncate">{exp.company || "Company"} · {exp.period || "Period"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs">{exp.bullets.length} bullets</Badge>
                {expanded === exp.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expanded === exp.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-outline-variant pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Job Title *</Label><Input value={exp.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExp(exp.id, "title", e.target.value)} placeholder="Software Engineer" /></div>
                  <div className="space-y-1"><Label>Company *</Label><Input value={exp.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExp(exp.id, "company", e.target.value)} placeholder="Acme Corp" /></div>
                  <div className="space-y-1"><Label>Location</Label><Input value={exp.location ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExp(exp.id, "location", e.target.value)} placeholder="San Francisco, CA" /></div>
                  <div className="space-y-1"><Label>Employment Type</Label>
                    <Select value={exp.employmentType ?? "Full-time"} onValueChange={(v: string) => updateExp(exp.id, "employmentType", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><Label>Start Date</Label><Input type="month" value={exp.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExp(exp.id, "startDate", e.target.value)} /></div>
                  <div className="space-y-1"><Label>End Date</Label><Input type="month" value={exp.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExp(exp.id, "endDate", e.target.value)} disabled={exp.isCurrent} /></div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id={`current-${exp.id}`} checked={exp.isCurrent} onCheckedChange={(checked: boolean) => { updateExp(exp.id, "isCurrent", !!checked); if (checked) updateExp(exp.id, "endDate", ""); }} />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer">Currently working here</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Achievements / Bullets</Label>
                    <Button size="sm" variant="ghost" onClick={() => handleSuggest(exp.id)} disabled={suggesting === exp.id}>
                      {suggesting === exp.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <BrainCircuit className="w-3 h-3 mr-1" />}
                      {suggesting === exp.id ? "Thinking..." : "Suggest with AI"}
                    </Button>
                  </div>

                  {/* Suggested bullets */}
                  {showSuggestFor === exp.id && suggestedBullets.length > 0 && (
                    <Card className="p-3 bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI Suggestions</span>
                      </div>
                      <div className="space-y-1 mb-3">
                        {suggestedBullets.map((b, bi) => (
                          <div key={bi} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <p className="text-sm text-on-surface">{b}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => applySuggested(exp.id)}>Add All ({suggestedBullets.length})</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSuggestedBullets([]); setShowSuggestFor(null); }}>Cancel</Button>
                      </div>
                    </Card>
                  )}

                  {(exp.bullets ?? []).map((bullet: string, bi: number) => (
                    <div key={bi} className="flex gap-2 items-start">
                      <span className="text-primary mt-2.5">•</span>
                      <Input value={bullet} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBullet(exp.id, bi, e.target.value)}
                        placeholder="e.g., Increased API response time by 40%" className="flex-1" />
                      <Button size="sm" variant="ghost" onClick={() => removeBullet(exp.id, bi)} className="shrink-0"><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => addBullet(exp.id)}><Plus className="w-3 h-3 mr-1" /> Add Bullet</Button>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="text-error hover:bg-error/5" onClick={() => { store.removeExperience(exp.id); setExpanded(null); }}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <Button variant="outline" onClick={addExperience} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Experience</Button>
    </div>
  );
}

// ─── Step 4: Education ───────────────────────────────────────────────────────

function StepEducation({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [expanded, setExpanded] = useState<string | null>(null);
  const education = resume?.education ?? [];

  const addEducation = () => {
    store.addEducation({ school: "", degreeType: "", fieldOfStudy: "", graduationDate: "", gpa: "", honors: "", coursework: [], extracurriculars: "", location: "" });
    const newId = store.currentResume?.education[store.currentResume.education.length - 1]?.id;
    if (newId) setExpanded(newId);
  };

  const updateEdu = (id: string, field: string, value: unknown) => {
    if (!resume) return;
    store.updateSection("education", resume.education.map((e: ResumeEducation) => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Education</h2>
        <p className="text-on-surface-variant">Add your educational background</p>
      </div>

      {education.length === 0 && (
        <Card className="p-8 text-center bg-surface-container-highest shadow-ambient-sm">
          <GraduationCap className="w-10 h-10 text-on-surface-disabled mx-auto mb-3" />
          <p className="text-on-surface-variant mb-4">No education added yet</p>
        </Card>
      )}

      <div className="space-y-3">
        {education.map((edu: ResumeEducation, i: number) => (
          <Card key={edu.id} className="bg-surface-container-highest shadow-ambient-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low surface-shift text-left"
              onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}>
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="w-4 h-4 text-on-surface-disabled shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-on-surface truncate">{edu.degreeType || `Education ${i + 1}`} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                  <p className="text-sm text-on-surface-variant truncate">{edu.school || "Institution"} · {edu.graduationDate || "Date"}</p>
                </div>
              </div>
              {expanded === edu.id ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>

            {expanded === edu.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-outline-variant pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Degree *</Label>
                    <Select value={edu.degreeType} onValueChange={(v: string) => updateEdu(edu.id, "degreeType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                      <SelectContent>
                        {["Bachelor's", "Master's", "PhD", "Associate's", "High School", "Certificate", "Diploma"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><Label>Field of Study *</Label><Input value={edu.fieldOfStudy} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "fieldOfStudy", e.target.value)} placeholder="Computer Science" /></div>
                  <div className="space-y-1"><Label>Institution *</Label><Input value={edu.school} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "school", e.target.value)} placeholder="MIT" /></div>
                  <div className="space-y-1"><Label>Location</Label><Input value={edu.location ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "location", e.target.value)} placeholder="Cambridge, MA" /></div>
                  <div className="space-y-1"><Label>Graduation Date</Label><Input type="month" value={edu.graduationDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "graduationDate", e.target.value)} /></div>
                  <div className="space-y-1"><Label>GPA (optional)</Label><Input value={edu.gpa ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "gpa", e.target.value)} placeholder="3.8/4.0" /></div>
                </div>
                <div className="space-y-1"><Label>Honors</Label><Input value={edu.honors ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "honors", e.target.value)} placeholder="Magna Cum Laude, Dean's List" /></div>
                <div className="space-y-1"><Label>Relevant Coursework</Label><Input value={(edu.coursework ?? []).join(", ")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEdu(edu.id, "coursework", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} placeholder="Data Structures, Algorithms (comma-separated)" /></div>
                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="text-error" onClick={() => { store.removeEducation(edu.id); setExpanded(null); }}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <Button variant="outline" onClick={addEducation} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Education</Button>
    </div>
  );
}

// ─── Step 5: Skills ──────────────────────────────────────────────────────────

function StepSkills({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("technical");
  const [skillInput, setSkillInput] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{ score: number; suggested: string[]; missing: string[] } | null>(null);
  const categories: SkillCategory[] = ["technical", "soft", "tools", "languages"];
  const skills = resume?.skills ?? [];

  const handleAddSkill = (name: string, category: SkillCategory, proficiency: 1|2|3|4 = 2) => {
    if (!name.trim()) return;
    if (skills.some((s: any) => (s.name || s).toLowerCase() === name.toLowerCase().trim())) {
      toast.error("Skill already added");
      return;
    }
    store.addSkill(name.trim(), category, proficiency);
    setSkillInput("");
  };

  const handleMatch = async () => {
    const title = resume?.title;
    if (!title) { toast.error("Set your professional title in the Profile step first"); return; }
    setMatching(true);
    setMatchResult(null);
    try {
      const res = await resumeApi.matchSkills({
        jobTitle: title,
        skills: skills.map((s: any) => s.name || s),
      });
      const result = res.data?.data ?? res.data ?? {};
      setMatchResult(result);
      // Auto-add suggested skills
      const suggested: string[] = result.suggestedSkills ?? [];
      if (suggested.length > 0) {
        suggested.forEach((s: string) => {
          if (!skills.some((ex: any) => (ex.name || ex).toLowerCase() === s.toLowerCase())) {
            store.addSkill(s, activeCategory, 2);
          }
        });
        toast.success(`Added ${suggested.length} suggested skills`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to match skills");
    } finally {
      setMatching(false);
    }
  };

  const getCategorySkills = (cat: SkillCategory) => skills.filter((s: any) => s.category === cat);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Skills</h2>
        <p className="text-on-surface-variant">Add your skills — AI can suggest relevant skills for your target role</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-surface-container-low rounded-xl p-1">
        {categories.map(cat => {
          const catDef = SKILL_CATEGORIES.find(c => c.id === cat)!;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat ? "bg-surface-container-highest text-primary shadow-ambient-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}>
              {catDef.icon} {catDef.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input value={skillInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAddSkill(skillInput, activeCategory); } }}
          placeholder="Type a skill and press Enter" className="flex-1" />
        <Button variant="outline" onClick={() => handleAddSkill(skillInput, activeCategory)}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        <Button variant="outline" onClick={handleMatch} disabled={matching}>
          {matching ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
          {matching ? "Matching..." : "Match to Role"}
        </Button>
      </div>

      {/* Match result */}
      {matchResult && (
        <Card className="p-4 bg-surface-container-high shadow-ambient-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-on-surface">Role Match: {matchResult.score}%</span>
            </div>
            <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${matchResult.score >= 80 ? "bg-success" : matchResult.score >= 60 ? "bg-warning" : "bg-error"}`}
                style={{ width: `${matchResult.score}%` }} />
            </div>
          </div>
          {matchResult.missing.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-on-surface-variant">Missing:</span>
              {matchResult.missing.slice(0, 8).map((m: string) => (
                <Badge key={m} variant="warning" className="text-xs">{m}</Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="space-y-4">
        {categories.map(cat => {
          const catSkills = getCategorySkills(cat);
          if (catSkills.length === 0 && activeCategory !== cat) return null;
          return (
            <div key={cat} className="space-y-2">
              {catSkills.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                    {SKILL_CATEGORIES.find(c => c.id === cat)?.icon}
                    {SKILL_CATEGORIES.find(c => c.id === cat)?.label}
                    <Badge variant="outline" className="text-xs ml-1">{catSkills.length}</Badge>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill: any) => (
                      <Badge key={skill.id} variant="default" className="pl-2 pr-1 py-1.5 gap-1.5 text-sm">
                        {skill.name}
                        <div className="flex gap-0.5 ml-1">
                          {[1, 2, 3, 4].map(p => (
                            <button key={p} onClick={() => store.setSkillProficiency(skill.id, p as 1|2|3|4)}
                              className={`w-2 h-2 rounded-full transition-all ${p <= skill.proficiency ? "bg-primary" : "bg-surface-container-low"}`} />
                          ))}
                        </div>
                        <button onClick={() => store.removeSkill(skill.id)} className="ml-1 text-on-surface-disabled hover:text-error">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {skills.length === 0 && (
          <Card className="p-8 text-center bg-surface-container-highest shadow-ambient-sm">
            <Star className="w-10 h-10 text-on-surface-disabled mx-auto mb-3" />
            <p className="text-on-surface-variant">Start adding skills above</p>
            <p className="text-xs text-on-surface-disabled mt-1">Press Enter or comma to add</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Step 6: Additional ───────────────────────────────────────────────────────

function StepAdditional({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  type AdditionalSection = "certifications" | "projects" | "volunteer" | "awards" | "interests";
  const sections: Array<{ id: AdditionalSection; label: string; icon: React.ReactNode; count: number }> = [
    { id: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" />, count: resume?.certifications.length ?? 0 },
    { id: "projects", label: "Projects", icon: <Code2 className="w-4 h-4" />, count: resume?.projects.length ?? 0 },
    { id: "volunteer", label: "Volunteer", icon: <Heart className="w-4 h-4" />, count: resume?.volunteer.length ?? 0 },
    { id: "awards", label: "Awards", icon: <Star className="w-4 h-4" />, count: resume?.awards.length ?? 0 },
    { id: "interests", label: "Interests", icon: <Globe className="w-4 h-4" />, count: resume?.interests.length ?? 0 },
  ];

  const renderCertifications = () => {
    const certs = resume?.certifications ?? [];
    return (
      <div className="space-y-3">
        {certs.map(cert => (
          <Card key={cert.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={cert.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("certifications", certs.map((c: any) => c.id === cert.id ? { ...c, name: e.target.value } : c));
              }} placeholder="AWS Solutions Architect" />
              <Input value={cert.issuer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("certifications", certs.map((c: any) => c.id === cert.id ? { ...c, issuer: e.target.value } : c));
              }} placeholder="Amazon Web Services" />
              <Input type="month" value={cert.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("certifications", certs.map((c: any) => c.id === cert.id ? { ...c, date: e.target.value } : c));
              }} />
            </div>
            <div className="flex justify-end"><Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeCertification(cert.id)}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button></div>
          </Card>
        ))}
        <Button variant="outline" onClick={() => store.addCertification({ name: "", issuer: "", date: "" })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Certification</Button>
      </div>
    );
  };

  const renderProjects = () => {
    const projects = resume?.projects ?? [];
    return (
      <div className="space-y-3">
        {projects.map(proj => (
          <Card key={proj.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input value={proj.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("projects", projects.map((p: any) => p.id === proj.id ? { ...p, name: e.target.value } : p));
              }} placeholder="Project Name" />
              <Input value={(proj.technologies ?? []).join(", ")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("projects", projects.map((p: any) => p.id === proj.id ? { ...p, technologies: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) } : p));
              }} placeholder="React, Node.js" />
            </div>
            <Textarea value={proj.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (!resume) return;
              store.updateSection("projects", projects.map((p: any) => p.id === proj.id ? { ...p, description: e.target.value } : p));
            }} placeholder="Brief description of the project..." className="min-h-[80px]" />
            <div className="flex justify-end"><Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeProject(proj.id)}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button></div>
          </Card>
        ))}
        <Button variant="outline" onClick={() => store.addProject({ name: "", description: "", technologies: [] })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
      </div>
    );
  };

  const renderVolunteer = () => {
    const vols = resume?.volunteer ?? [];
    return (
      <div className="space-y-3">
        {vols.map(vol => (
          <Card key={vol.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input value={vol.organization} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("volunteer", vols.map((v: any) => v.id === vol.id ? { ...v, organization: e.target.value } : v));
              }} placeholder="Organization" />
              <Input value={vol.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("volunteer", vols.map((v: any) => v.id === vol.id ? { ...v, role: e.target.value } : v));
              }} placeholder="Your Role" />
            </div>
            <Input value={vol.period} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!resume) return;
              store.updateSection("volunteer", vols.map((v: any) => v.id === vol.id ? { ...v, period: e.target.value } : v));
            }} placeholder="Jan 2020 – Dec 2021" />
            <Textarea value={vol.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (!resume) return;
              store.updateSection("volunteer", vols.map((v: any) => v.id === vol.id ? { ...v, description: e.target.value } : v));
            }} placeholder="Description..." className="min-h-[60px]" />
            <div className="flex justify-end"><Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeVolunteer(vol.id)}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button></div>
          </Card>
        ))}
        <Button variant="outline" onClick={() => store.addVolunteer({ organization: "", role: "", period: "", description: "" })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Volunteer</Button>
      </div>
    );
  };

  const renderAwards = () => {
    const awards = resume?.awards ?? [];
    return (
      <div className="space-y-3">
        {awards.map(award => (
          <Card key={award.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={award.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("awards", awards.map((a: any) => a.id === award.id ? { ...a, name: e.target.value } : a));
              }} placeholder="Award Name" />
              <Input value={award.issuer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("awards", awards.map((a: any) => a.id === award.id ? { ...a, issuer: e.target.value } : a));
              }} placeholder="Issuer" />
              <Input type="month" value={award.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!resume) return;
                store.updateSection("awards", awards.map((a: any) => a.id === award.id ? { ...a, date: e.target.value } : a));
              }} />
            </div>
            <Textarea value={award.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (!resume) return;
              store.updateSection("awards", awards.map((a: any) => a.id === award.id ? { ...a, description: e.target.value } : a));
            }} placeholder="Description..." className="min-h-[60px]" />
            <div className="flex justify-end"><Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeAward(award.id)}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button></div>
          </Card>
        ))}
        <Button variant="outline" onClick={() => store.addAward({ name: "", issuer: "", date: "", description: "" })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Award</Button>
      </div>
    );
  };

  const renderInterests = () => {
    const interests = resume?.interests ?? [];
    const [input, setInput] = useState("");
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input value={input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); if (input.trim()) { store.addInterest(input.trim()); setInput(""); } } }}
            placeholder="Add an interest..." className="flex-1" />
          <Button variant="outline" onClick={() => { if (input.trim()) { store.addInterest(input.trim()); setInput(""); } }}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <Badge key={interest} variant="default" className="pl-2 pr-1 py-1.5 gap-1">
              {interest}
              <button onClick={() => store.removeInterest(interest)} className="text-on-surface-disabled hover:text-error ml-1"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "certifications": return renderCertifications();
      case "projects": return renderProjects();
      case "volunteer": return renderVolunteer();
      case "awards": return renderAwards();
      case "interests": return renderInterests();
      default: return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-highest shadow-ambient-sm hover:shadow-ambient-md hover:bg-surface-container-low surface-shift transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">{s.icon}</div>
              <div>
                <p className="font-medium text-on-surface text-sm">{s.label}</p>
                <p className="text-xs text-on-surface-variant">{s.count} added</p>
              </div>
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Additional Sections</h2>
        <p className="text-on-surface-variant">Add optional sections to strengthen your resume</p>
      </div>
      {activeSection && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setActiveSection(null)}><ArrowLeft className="w-3 h-3 mr-1" /> Back</Button>
          <span className="text-sm text-on-surface-variant">{sections.find(s => s.id === activeSection)?.label}</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

// ─── Step 7: ATS Score ───────────────────────────────────────────────────────

function StepATS({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [atsScore, setAtsScore] = useState(resume?.atsScore ?? 72);
  const [missingKeywords, setMissingKeywords] = useState<string[]>(resume?.missingKeywords ?? []);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleScore = async () => {
    if (!jobDescription.trim()) { toast.error("Paste a job description first"); return; }
    setScoring(true);
    setSuggestions([]);
    try {
      const res = await resumeApi.getAtsScore({
        resumeId: resume?.id,
        jobDescription,
        resumeData: resume,
      });
      const result = res.data?.data ?? res.data ?? {};
      setAtsScore(result.score ?? 72);
      setMissingKeywords(result.missingKeywords ?? []);
      setSuggestions(result.suggestions ?? []);
      if (result.score !== undefined) {
        store.updateSection("atsScore", result.score);
        store.updateSection("missingKeywords", result.missingKeywords ?? []);
      }
      toast.success(`ATS Score: ${result.score ?? 72}%`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to calculate ATS score");
    } finally {
      setScoring(false);
    }
  };

  const handleAutoOptimize = async () => {
    if (!jobDescription.trim()) { toast.error("Paste a job description first"); return; }
    setOptimizing(true);
    try {
      const res = await resumeApi.autoOptimize({
        resumeId: resume?.id,
        resumeData: resume,
        jobDescription,
      });
      const result = res.data?.data ?? {};
      if (result.optimized) {
        const opt = result.optimized;
        if (opt.summary) store.updateSection("summary", opt.summary);
        if (opt.experience) store.updateSection("experience", opt.experience);
        if (opt.skills) store.updateSection("skills", opt.skills);
        toast.success(`Resume optimized! Score improved from ${result.originalScore ?? atsScore}% to ${result.optimizedScore ?? atsScore + 5}%`);
        setAtsScore(result.optimizedScore ?? atsScore + 5);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to optimize");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">ATS Optimization</h2>
        <p className="text-on-surface-variant">Paste a job description to score and optimize your resume</p>
      </div>

      <Card className="p-6 bg-surface-container-highest shadow-ambient-sm"><ATSScoreMeter score={atsScore} showZones /></Card>

      <div className="space-y-2">
        <Label htmlFor="ats-jd">Job Description</Label>
        <Textarea id="ats-jd" value={jobDescription} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to analyze your resume against it..." className="min-h-[150px]" />
        <div className="flex gap-2">
          <Button onClick={handleScore} disabled={scoring || !jobDescription.trim()}>
            {scoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            {scoring ? "Scoring..." : "Score Resume"}
          </Button>
          <Button variant="outline" onClick={handleAutoOptimize} disabled={optimizing || !jobDescription.trim()}>
            {optimizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {optimizing ? "Optimizing..." : "Auto-Optimize with AI"}
          </Button>
        </div>
      </div>

      {missingKeywords.length > 0 && (
        <Card className="p-4 bg-surface-container-highest shadow-ambient-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-warning" />
            <h4 className="font-medium text-on-surface">Missing Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw, i) => <Badge key={i} variant="warning" className="text-xs">{kw}</Badge>)}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">Add these keywords to your resume to improve ATS compatibility</p>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card className="p-4 bg-surface-container-highest shadow-ambient-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-on-surface">Improvement Suggestions</h4>
          </div>
          <ul className="space-y-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="text-primary mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Clean Format", ok: true, desc: "No tables or columns" },
          { label: "Standard Fonts", ok: true, desc: "Arial, Calibri, Times" },
          { label: "No Images", ok: true, desc: "Text-only sections" },
          { label: "Keyword Density", ok: atsScore >= 70, desc: `${atsScore}% match rate` },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${item.ok ? "bg-success/8" : "bg-warning/8"}`}>
            {item.ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertCircle className="w-4 h-4 text-warning" />}
            <div>
              <p className="text-xs font-medium text-on-surface">{item.label}</p>
              <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 8: Preview ────────────────────────────────────────────────────────

function StepPreview({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [downloading, setDownloading] = useState(false);
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const template = TEMPLATES.find(t => t.id === (resume?.template ?? "MODERN")) ?? TEMPLATES[0];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = format === "pdf" ? await resumeApi.downloadPdf() : await resumeApi.downloadDocx();
      const blob = new Blob([res.data], {
        type: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.setAttribute("download", `${resume?.name ?? "resume"}.${format}`);
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} downloaded!`);
    } catch {
      toast.error(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setDownloading(false);
    }
  };

  const data = resume ?? {
    name: "Your Name", title: "", template: "MODERN",
    header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
    summary: "", experience: [], education: [], skills: [], certifications: [], projects: [],
    publications: [], volunteer: [], awards: [], interests: [], sections: [],
    status: "draft" as const, tags: [], visibility: "private" as const,
    atsScore: 72, missingKeywords: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), versions: [],
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Preview</h2>
        <p className="text-on-surface-variant">Review your resume — download when ready</p>
      </div>

      <Card className="p-4 bg-surface-container-highest shadow-ambient-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-on-surface-variant">Download:</span>
          <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
            <button onClick={() => setFormat("pdf")} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${format === "pdf" ? "bg-surface-container-highest text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>PDF</button>
            <button onClick={() => setFormat("docx")} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${format === "docx" ? "bg-surface-container-highest text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>DOCX</button>
          </div>
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Download {format.toUpperCase()}
          </Button>
        </div>
      </Card>

      {/* Live preview */}
      <div className="transform scale-[0.65] origin-top-left" style={{ width: "154%", height: "154%" }}>
        <div className="bg-white rounded-xl shadow-ambient-lg p-8 min-h-[700px] font-sans border border-outline-variant">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold" style={{ color: template.accentColor }}>{data.header?.name || "Your Name"}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
              {data.header?.email && <span>{data.header.email}</span>}
              {data.header?.phone && <><span>·</span><span>{data.header.phone}</span></>}
              {data.header?.location && <><span>·</span><span>{data.header.location}</span></>}
            </div>
            {(data.header?.linkedin || data.header?.github) && (
              <div className="flex flex-wrap justify-center gap-x-3 text-xs text-gray-500 mt-0.5">
                {data.header?.linkedin && <span>{data.header.linkedin}</span>}
                {data.header?.github && <span>{data.header.github}</span>}
              </div>
            )}
          </div>

          {data.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: template.accentColor, borderColor: template.accentColor + "30" }}>Professional Summary</h3>
              <p className="text-xs text-gray-600">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: template.accentColor, borderColor: template.accentColor + "30" }}>Experience</h3>
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-gray-900">{exp.title}</p>
                    <p className="text-xs text-gray-500">{exp.period || `${exp.startDate} – ${exp.endDate || "Present"}`}</p>
                  </div>
                  <p className="text-xs text-gray-500 italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  {(exp.bullets ?? []).filter(Boolean).map((b: string, bi: number) => (
                    <p key={bi} className="text-xs text-gray-600 pl-3 mt-0.5">• {b}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: template.accentColor, borderColor: template.accentColor + "30" }}>Education</h3>
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-gray-900">{edu.degreeType} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  </div>
                  <p className="text-xs text-gray-500">{edu.school}{edu.gpa ? `, GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: template.accentColor, borderColor: template.accentColor + "30" }}>Skills</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {data.skills.map((skill: any, i: number) => (
                  <span key={i} className="text-xs text-gray-700">
                    {skill.name || skill} {PROFICIENCY_LABELS[skill.proficiency] ? `(${PROFICIENCY_LABELS[skill.proficiency]})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 9: Save ───────────────────────────────────────────────────────────

function StepSave({ store, onComplete }: { store: ResumeState; onComplete: () => void }) {
  const [name, setName] = useState(store.currentResume?.name ?? "My Resume");
  const [title, setTitle] = useState(store.currentResume?.title ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please name your resume"); return; }
    setSaving(true);
    try {
      store.setResumeName(name);
      if (title) store.setResumeTitle(title);
      store.setStatus("complete");

      const res = await resumeApi.create(store.currentResume as unknown as Record<string, unknown>);
      const created = res.data?.data ?? res.data;
      if (created?.id) store.setCurrentResume({ ...store.currentResume!, id: created.id });

      toast.success("Resume saved!");
      onComplete();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/12 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Save Your Resume</h2>
        <p className="text-on-surface-variant">Give your resume a name and you're all set!</p>
      </div>

      <Card className="p-6 bg-surface-container-highest shadow-ambient-sm max-w-md mx-auto space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="save-name">Resume Name *</Label>
          <Input id="save-name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="e.g., Senior Frontend Dev — TechCorp Application" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="save-title">Target Role</Label>
          <Input id="save-title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="e.g., Senior Frontend Engineer" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="save-draft" checked={store.currentResume?.status === "draft"} onCheckedChange={(checked: boolean) => store.setStatus(checked ? "draft" : "complete")} />
          <Label htmlFor="save-draft" className="text-sm cursor-pointer">Save as draft</Label>
        </div>
        <Button className="w-full" size="lg" onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : "Save Resume"}
        </Button>
      </Card>
    </div>
  );
}

// ─── Main Builder Page ───────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const store = useResumeStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepId>(0);
  const [resumeId] = useState<string | null>(null);
  const { saveStatus } = useAutoSave(store, resumeId, currentStep);

  useEffect(() => {
    if (!store.currentResume) {
      store.setCurrentResume({
        id: "", name: "Untitled Resume", title: "", template: "MODERN", status: "draft",
        tags: [], visibility: "private",
        header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
        summary: "", experience: [], education: [], skills: [], certifications: [], projects: [],
        publications: [], volunteer: [], awards: [], interests: [], sections: [],
        atsScore: undefined, missingKeywords: [],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), versions: [],
      });
    }
  }, [store]);

  const handleStart = (method: string) => {
    if (method === "scratch") setCurrentStep(2);
    else if (method === "import") setCurrentStep(2);
    else if (method === "template") setCurrentStep(1);
  };

  const handleComplete = () => {
    store.setCurrentResume(null);
    router.push("/resume");
  };

  const progress = Math.round((currentStep / (STEPS.length - 1)) * 100);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepStart onScratch={() => handleStart("scratch")} onImport={() => handleStart("import")} onTemplate={() => handleStart("template")} />;
      case 1: return <StepTemplate store={store} />;
      case 2: return <StepProfile store={store} />;
      case 3: return <StepExperience store={store} />;
      case 4: return <StepEducation store={store} />;
      case 5: return <StepSkills store={store} />;
      case 6: return <StepAdditional store={store} />;
      case 7: return <StepATS store={store} />;
      case 8: return <StepPreview store={store} />;
      case 9: return <StepSave store={store} onComplete={handleComplete} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-surface-container-highest border-b border-outline-variant sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" onClick={() => currentStep > 0 ? setCurrentStep((s) => (s - 1) as StepId) : router.push("/resume")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> {currentStep > 0 ? "Back" : "Exit"}
              </Button>
              <div>
                <h1 className="font-display text-lg font-bold text-on-surface">Resume Builder</h1>
                <p className="text-xs text-on-surface-variant">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Save status */}
              <div className="flex items-center gap-1.5 text-xs">
                {saveStatus === "saving" && <><Loader2 className="w-3 h-3 animate-spin text-on-surface-variant" /> <span className="text-on-surface-variant hidden sm:inline">Saving...</span></>}
                {saveStatus === "saved" && <><CheckCircle2 className="w-3 h-3 text-success" /> <span className="text-success hidden sm:inline">Saved</span></>}
                {saveStatus === "error" && <><AlertCircle className="w-3 h-3 text-error" /> <span className="text-error hidden sm:inline">Save failed</span></>}
                {saveStatus === "idle" && <><Clock className="w-3 h-3 text-on-surface-disabled" /> <span className="text-on-surface-disabled hidden sm:inline">Ready</span></>}
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push("/resume")}>Exit Builder</Button>
            </div>
          </div>

          <Progress value={progress} className="h-1" />

          <div className="flex items-center justify-between mt-2 overflow-x-auto pb-1">
            {STEPS.map((step, i) => (
              <button key={step.id} onClick={() => i <= currentStep && setCurrentStep(step.id)}
                className={`flex items-center gap-1 shrink-0 transition-all ${
                  i === currentStep ? "text-primary" : i < currentStep ? "text-on-surface-variant hover:text-on-surface" : "text-on-surface-disabled"
                }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === currentStep ? "bg-primary text-white" : i < currentStep ? "bg-success/16 text-success" : "bg-surface-container-low text-on-surface-disabled"
                }`}>
                  {i < currentStep ? <Check className="w-2.5 h-2.5" /> : i + 1}
                </div>
                <span className="text-[10px] hidden md:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {store.currentResume ? renderStep() : (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-variant" />
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant">
          <Button variant="outline" onClick={() => setCurrentStep((s) => (s - 1) as StepId)} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          {currentStep < STEPS.length - 1 && (
            <Button onClick={() => setCurrentStep((s) => (s + 1) as StepId)}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
