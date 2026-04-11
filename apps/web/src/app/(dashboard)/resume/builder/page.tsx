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
import { useResumeStore, ResumeState, TemplateType, SkillCategory, ResumeSkill, ResumeExperience, ResumeEducation, ResumeCertification, ResumeProject, ResumeVolunteer, ResumeAward } from "@/stores/resume-store";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, Save, Sparkles, Eye, Download,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, X, Loader2,
  FileText, Wand2, Zap, Link2, RotateCcw, CheckCircle2, AlertCircle,
  BookOpen, Award, Code2, Globe, Heart, Star, Briefcase, GraduationCap,
  FileUp, LayoutTemplate, PenLine, User
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type StepId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Step {
  id: StepId;
  label: string;
  icon: React.ReactNode;
  optional?: boolean;
}

// ─── Step Definitions ────────────────────────────────────────────────────────

const STEPS: Step[] = [
  { id: 0, label: "Start", icon: <FileUp className="w-4 h-4" /> },
  { id: 1, label: "Template", icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 2, label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: 3, label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
  { id: 4, label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
  { id: 5, label: "Skills", icon: <Star className="w-4 h-4" /> },
  { id: 6, label: "Additional", icon: <Plus className="w-4 h-4" />, optional: true },
  { id: 7, label: "ATS Score", icon: <Zap className="w-4 h-4" /> },
  { id: 8, label: "Preview", icon: <Eye className="w-4 h-4" /> },
  { id: 9, label: "Save", icon: <Save className="w-4 h-4" /> },
];

const TEMPLATES: Array<{ id: TemplateType; name: string; desc: string; atsSafe: boolean }> = [
  { id: "MODERN", name: "Modern", desc: "Bold header, color accents", atsSafe: true },
  { id: "MINIMAL", name: "Minimal", desc: "Maximum whitespace, clean", atsSafe: true },
  { id: "EXECUTIVE", name: "Executive", desc: "Elegant, traditional serif", atsSafe: true },
  { id: "CREATIVE", name: "Creative", desc: "Colored sidebar, unique layout", atsSafe: false },
  { id: "TECHNICAL", name: "Technical", desc: "Code-friendly, structured", atsSafe: true },
  { id: "CONSULTING", name: "Consulting", desc: "Professional, achievement-focused", atsSafe: true },
  { id: "ACADEMIC", name: "Academic", desc: "Research-focused, publication-ready", atsSafe: true },
  { id: "ENTRY_LEVEL", name: "Entry Level", desc: "Fresh graduate friendly", atsSafe: true },
];

const SKILL_CATEGORIES: Array<{ id: SkillCategory; label: string; icon: React.ReactNode }> = [
  { id: "technical", label: "Technical", icon: <Code2 className="w-3 h-3" /> },
  { id: "soft", label: "Soft Skills", icon: <Heart className="w-3 h-3" /> },
  { id: "tools", label: "Tools & Software", icon: <Wand2 className="w-3 h-3" /> },
  { id: "languages", label: "Languages", icon: <Globe className="w-3 h-3" /> },
];

const START_METHODS = [
  { id: "scratch", icon: <PenLine className="w-6 h-6" />, title: "Start from Scratch", desc: "Build resume section by section manually" },
  { id: "ai", icon: <Sparkles className="w-6 h-6" />, title: "AI-Assisted Build", desc: "Answer questions, AI generates draft content" },
  { id: "import", icon: <FileUp className="w-6 h-6" />, title: "Import Resume", desc: "Upload PDF/DOCX, AI parses and converts" },
  { id: "template", icon: <LayoutTemplate className="w-6 h-6" />, title: "Use a Template", desc: "Browse gallery and start from a design" },
];

const PROFICIENCY_LABELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

// ─── Auto-Save Hook ─────────────────────────────────────────────────────────

function useAutoSave(store: ResumeState, resumeId: string | null) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = store.hasUnsavedChanges;
  }, [store.hasUnsavedChanges]);

  const save = useCallback(async () => {
    if (!store.currentResume || !isDirtyRef.current) return;
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
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      store.markUnsaved();
      setSaveStatus("error");
      toast.error("Auto-save failed — your changes are local");
    }
  }, [store, resumeId]);

  // Auto-save on interval
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (isDirtyRef.current) save();
    }, 30000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [save]);

  // Save on window blur
  useEffect(() => {
    const handler = () => { if (isDirtyRef.current) save(); };
    window.addEventListener("blur", handler);
    return () => window.removeEventListener("blur", handler);
  }, [save]);

  return { save, saveStatus };
}

// ─── Step 0: Start Method ────────────────────────────────────────────────────

function StepStart({ onNext }: { onNext: (method: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">How would you like to start?</h2>
        <p className="text-on-surface-variant">Choose the method that works best for you</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {START_METHODS.map((m) => (
          <Card
            key={m.id}
            className={`p-5 cursor-pointer transition-all hover:shadow-ambient-md surface-shift ${
              selected === m.id
                ? "bg-primary/8 border-2 border-primary shadow-ambient-sm"
                : "bg-surface-container-highest shadow-ambient-sm hover:border-primary/30"
            }`}
            onClick={() => setSelected(m.id)}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              selected === m.id ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"
            }`}>
              {m.icon}
            </div>
            <h3 className="font-semibold text-on-surface mb-1">{m.title}</h3>
            <p className="text-sm text-on-surface-variant">{m.desc}</p>
            {selected === m.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button size="lg" onClick={() => selected && onNext(selected)} disabled={!selected}>
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 1: Template Selection ─────────────────────────────────────────────

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
            className={`relative rounded-xl border-2 p-1 transition-all hover:shadow-ambient-md ${
              t === tmpl.id
                ? "border-primary bg-primary/5 shadow-ambient-sm"
                : "border-outline-variant bg-surface-container-highest hover:border-primary/30"
            }`}
          >
            {/* Template preview thumbnail */}
            <div className="w-full aspect-[3/4] bg-white rounded-lg border border-outline-variant p-2 flex flex-col gap-1">
              <div className="h-4 w-3/4 bg-surface-container-mid rounded mx-auto mb-1" />
              <div className="h-2 w-1/2 bg-surface-container-low rounded mx-auto" />
              <div className="mt-auto space-y-0.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1 bg-surface-container-low rounded" style={{ width: `${70 + i * 8}%` }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1 px-1">
              <span className="text-xs font-medium text-on-surface">{tmpl.name}</span>
              {!tmpl.atsSafe && <Badge variant="warning" className="text-[10px]">⚠ ATS</Badge>}
            </div>
            {t === tmpl.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-ambient-sm">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-on-surface-variant">
        Templates flagged ⚠ ATS may reduce compatibility with Applicant Tracking Systems
      </p>
    </div>
  );
}

// ─── Step 2: Profile ────────────────────────────────────────────────────────

function StepProfile({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const header = resume?.header ?? { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" };
  const [summary, setSummary] = useState(resume?.summary ?? "");
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);

  const updateHeader = (field: string, value: string) => {
    if (!resume) return;
    store.updateSection("header", { ...header, [field]: value });
  };

  const updateSummary = (val: string) => {
    setSummary(val);
    if (resume) store.updateSection("summary", val);
  };

  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const res = await resumeApi.generateSummary({
        prompt: `Generate a professional summary for a ${header.name || "professional"} with experience.`,
        currentSummary: summary,
      });
      const generated = res.data?.data ?? res.data?.summary ?? "";
      if (generated) {
        updateSummary(generated);
        toast.success("Summary generated!");
      }
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  const handleImproveSummary = async () => {
    if (!summary) return;
    setImproving(true);
    try {
      const res = await resumeApi.generateSummary({
        prompt: "Improve this professional summary:",
        currentSummary: summary,
      });
      const improved = res.data?.data ?? res.data?.summary ?? "";
      if (improved) {
        updateSummary(improved);
        toast.success("Summary improved!");
      }
    } catch {
      toast.error("Failed to improve summary");
    } finally {
      setImproving(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Jane Smith", required: true },
    { key: "email", label: "Email", placeholder: "jane@email.com", type: "email", required: true },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567", type: "tel", required: true },
    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/janesmith" },
    { key: "github", label: "GitHub URL", placeholder: "github.com/janesmith" },
    { key: "website", label: "Portfolio / Website", placeholder: "janesmith.dev" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Basic Information</h2>
        <p className="text-on-surface-variant">Your contact details and professional summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label} {f.required && <span className="text-error">*</span>}</Label>
            <Input
              id={f.key}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              value={(header as any)[f.key] ?? ""}
              onChange={(e) => updateHeader(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="title">Professional Title</Label>
            <p className="text-xs text-on-surface-variant">e.g., Senior Frontend Engineer</p>
          </div>
        </div>
        <Input
          id="title"
          placeholder="e.g., Senior Frontend Engineer"
          value={resume?.title ?? ""}
          onChange={(e) => store.setResumeTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <p className="text-xs text-on-surface-variant">
              {summary.length}/400 chars recommended ({Math.max(0, 400 - summary.length)} remaining)
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleGenerateSummary} disabled={generating}>
              {generating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
              {generating ? "Generating..." : "Generate"}
            </Button>
            {summary && (
              <Button size="sm" variant="outline" onClick={handleImproveSummary} disabled={improving}>
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
      </div>
    </div>
  );
}

// ─── Step 3: Experience ──────────────────────────────────────────────────────

function StepExperience({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [expanding, setExpanding] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const makeExpId = () => `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addExperience = () => {
    store.addExperience({
      company: "", title: "", period: "", startDate: "", endDate: "",
      isCurrent: false, bullets: [], location: "", employmentType: "Full-time",
    });
    setAddingNew(true);
    const newId = store.currentResume?.experience[store.currentResume.experience.length - 1]?.id;
    if (newId) setExpanding(newId);
  };

  const removeExperience = (id: string) => {
    store.removeExperience(id);
    setExpanding(null);
  };

  const updateExperience = (id: string, field: string, value: unknown) => {
    if (!resume) return;
    const updated = resume.experience.map((e: ResumeExperience) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    store.updateSection("experience", updated);
  };

  const addBullet = (id: string) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    updateExperience(id, "bullets", [...exp.bullets, ""]);
  };

  const updateBullet = (id: string, index: number, value: string) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    const bullets = [...exp.bullets];
    bullets[index] = value;
    updateExperience(id, "bullets", bullets);
  };

  const removeBullet = (id: string, index: number) => {
    if (!resume) return;
    const exp = resume.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp) return;
    updateExperience(id, "bullets", exp.bullets.filter((_: string, i: number) => i !== index));
  };

  const handleSuggestAchievements = async (id: string) => {
    const exp = resume?.experience.find((e: ResumeExperience) => e.id === id);
    if (!exp?.title || !exp?.company) {
      toast.error("Fill in job title and company first");
      return;
    }
    try {
      const res = await resumeApi.suggestAchievements({ jobTitle: exp.title, company: exp.company, bullets: exp.bullets });
      const suggested = res.data?.data ?? res.data?.achievements ?? [];
      if (suggested.length > 0) {
        updateExperience(id, "bullets", [...exp.bullets, ...suggested]);
        toast.success(`Added ${suggested.length} achievement suggestions`);
      }
    } catch {
      toast.error("Failed to suggest achievements");
    }
  };

  const experiences: ResumeExperience[] = resume?.experience ?? [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Work Experience</h2>
        <p className="text-on-surface-variant">Add your professional experience (most recent first)</p>
      </div>

      {experiences.length === 0 && !addingNew && (
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
              onClick={() => setExpanding(expanding === exp.id ? null : exp.id)}
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
                {expanding === exp.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expanding === exp.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-outline-variant">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <div className="space-y-1">
                    <Label>Job Title *</Label>
                    <Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-1">
                    <Label>Company *</Label>
                    <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-1">
                    <Label>Location</Label>
                    <Input value={exp.location ?? ""} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="San Francisco, CA" />
                  </div>
                  <div className="space-y-1">
                    <Label>Employment Type</Label>
                    <Select value={exp.employmentType ?? "Full-time"} onValueChange={(v) => updateExperience(exp.id, "employmentType", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Start Date</Label>
                    <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>End Date</Label>
                    <Input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.isCurrent}
                    onCheckedChange={(checked) => {
                      updateExperience(exp.id, "isCurrent", !!checked);
                      if (checked) updateExperience(exp.id, "endDate", "");
                    }}
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer">Currently working here</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Achievements / Bullets</Label>
                    <Button size="sm" variant="ghost" onClick={() => handleSuggestAchievements(exp.id)}>
                      <Sparkles className="w-3 h-3 mr-1" /> Suggest with AI
                    </Button>
                  </div>
                  {exp.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-2 items-start">
                      <span className="text-primary mt-2.5">•</span>
                      <Input
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                        placeholder="e.g., Increased API response time by 40%"
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => removeBullet(exp.id, bi)} className="shrink-0">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => addBullet(exp.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Add Bullet
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="text-error hover:bg-error/5" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}

// ─── Step 4: Education ───────────────────────────────────────────────────────

function StepEducation({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [expanded, setExpanded] = useState<string | null>(null);

  const addEducation = () => {
    store.addEducation({
      school: "", degreeType: "", fieldOfStudy: "",
      graduationDate: "", gpa: "", honors: "", coursework: [], extracurriculars: "",
    });
    const newId = store.currentResume?.education[store.currentResume.education.length - 1]?.id;
    if (newId) setExpanded(newId);
  };

  const updateEducation = (id: string, field: string, value: any) => {
    if (!resume) return;
    const updated = resume.education.map(e => e.id === id ? { ...e, [field]: value } : e);
    store.updateSection("education", updated);
  };

  const handleSuggestCoursework = async (id: string) => {
    const edu = resume?.education.find(e => e.id === id);
    if (!edu?.fieldOfStudy) { toast.error("Fill in field of study first"); return; }
    try {
      toast.info("Coursework suggestions coming soon");
    } catch { toast.error("Failed to suggest coursework"); }
  };

  const education = resume?.education ?? [];

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
        {education.map((edu, i) => (
          <Card key={edu.id} className="bg-surface-container-highest shadow-ambient-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low surface-shift text-left"
              onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
            >
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
                  <div className="space-y-1">
                    <Label>Degree *</Label>
                    <Select value={edu.degreeType} onValueChange={(v) => updateEducation(edu.id, "degreeType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                      <SelectContent>
                        {["Bachelor's", "Master's", "PhD", "Associate's", "High School", "Certificate", "Diploma"].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Field of Study *</Label>
                    <Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className="space-y-1">
                    <Label>Institution *</Label>
                    <Input value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} placeholder="MIT" />
                  </div>
                  <div className="space-y-1">
                    <Label>Location</Label>
                    <Input value={edu.location ?? ""} onChange={(e) => updateEducation(edu.id, "location" as any, e.target.value)} placeholder="Cambridge, MA" />
                  </div>
                  <div className="space-y-1">
                    <Label>Graduation Date</Label>
                    <Input type="month" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>GPA (optional)</Label>
                    <Input value={edu.gpa ?? ""} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} placeholder="3.8/4.0" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Honors / Awards</Label>
                  <Input value={edu.honors ?? ""} onChange={(e) => updateEducation(edu.id, "honors", e.target.value)} placeholder="Magna Cum Laude, Dean's List" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Relevant Coursework</Label>
                    <Button size="sm" variant="ghost" onClick={() => handleSuggestCoursework(edu.id)}>
                      <Sparkles className="w-3 h-3 mr-1" /> Suggest
                    </Button>
                  </div>
                  <Input
                    value={edu.coursework.join(", ")}
                    onChange={(e) => updateEducation(edu.id, "coursework", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="Data Structures, Algorithms, ML (comma-separated)"
                  />
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="text-error hover:bg-error/5" onClick={() => { store.removeEducation(edu.id); setExpanded(null); }}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Education
      </Button>
    </div>
  );
}

// ─── Step 5: Skills ─────────────────────────────────────────────────────────

function StepSkills({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("technical");
  const [skillInput, setSkillInput] = useState("");

  const categories: SkillCategory[] = ["technical", "soft", "tools", "languages"];

  const skills = resume?.skills ?? [];

  const handleAddSkill = (name: string, category: SkillCategory, proficiency: 1 | 2 | 3 | 4 = 2) => {
    if (!name.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase().trim())) {
      toast.error("Skill already added");
      return;
    }
    store.addSkill(name.trim(), category, proficiency);
    setSkillInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(skillInput, activeCategory);
    }
  };

  const handleMatchSkills = async () => {
    const title = resume?.title;
    if (!title) { toast.error("Set your professional title first"); return; }
    try {
      const res = await resumeApi.matchSkills({ jobTitle: title });
      const suggested: string[] = res.data?.data ?? res.data?.skills ?? [];
      if (suggested.length > 0) {
        suggested.forEach(s => {
          if (!skills.some(ex => ex.name.toLowerCase() === s.toLowerCase())) {
            store.addSkill(s, activeCategory, 2);
          }
        });
        toast.success(`Added ${suggested.length} suggested skills`);
      }
    } catch {
      toast.error("Failed to match skills");
    }
  };

  const getCategorySkills = (cat: SkillCategory) => skills.filter(s => s.category === cat);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Skills</h2>
        <p className="text-on-surface-variant">Add your technical and soft skills</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-surface-container-low rounded-xl p-1">
        {categories.map(cat => {
          const catDef = SKILL_CATEGORIES.find(c => c.id === cat)!;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-surface-container-highest text-primary shadow-ambient-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {catDef.icon} {catDef.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type a skill and press Enter (category: ${SKILL_CATEGORIES.find(c => c.id === activeCategory)?.label})`}
          className="flex-1"
        />
        <Button variant="outline" onClick={() => handleAddSkill(skillInput, activeCategory)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        <Button variant="outline" onClick={handleMatchSkills}>
          <Sparkles className="w-4 h-4 mr-1" /> Match
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map(cat => {
          const catSkills = getCategorySkills(cat);
          if (catSkills.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <h4 className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                {SKILL_CATEGORIES.find(c => c.id === cat)?.icon}
                {SKILL_CATEGORIES.find(c => c.id === cat)?.label}
                <Badge variant="outline" className="text-xs ml-1">{catSkills.length}</Badge>
              </h4>
              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
                  <Badge key={skill.id} variant="default" className="pl-2 pr-1 py-1.5 gap-1.5 text-sm">
                    {skill.name}
                    <div className="flex gap-0.5 ml-1">
                      {[1, 2, 3, 4].map(p => (
                        <button
                          key={p}
                          onClick={() => store.setSkillProficiency(skill.id, p as 1|2|3|4)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            p <= skill.proficiency ? "bg-primary" : "bg-surface-container-low"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => store.removeSkill(skill.id)}
                      className="ml-1 text-on-surface-disabled hover:text-error"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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

// ─── Step 6: Additional Sections ──────────────────────────────────────────

function StepAdditional({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  type AdditionalSection = "certifications" | "projects" | "publications" | "volunteer" | "awards" | "interests";

  const sections: Array<{ id: AdditionalSection; label: string; icon: React.ReactNode; count: number }> = [
    { id: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" />, count: resume?.certifications.length ?? 0 },
    { id: "projects", label: "Projects", icon: <Code2 className="w-4 h-4" />, count: resume?.projects.length ?? 0 },
    { id: "publications", label: "Publications", icon: <BookOpen className="w-4 h-4" />, count: resume?.publications.length ?? 0 },
    { id: "volunteer", label: "Volunteer", icon: <Heart className="w-4 h-4" />, count: resume?.volunteer.length ?? 0 },
    { id: "awards", label: "Awards", icon: <Star className="w-4 h-4" />, count: resume?.awards.length ?? 0 },
    { id: "interests", label: "Interests", icon: <Globe className="w-4 h-4" />, count: resume?.interests.length ?? 0 },
  ];

  const renderCertifications = () => {
    const certs = resume?.certifications ?? [];
    const add = () => {
      store.addCertification({ name: "", issuer: "", date: "" });
    };
    const update = (id: string, field: string, value: string) => {
      if (!resume) return;
      store.updateSection("certifications", certs.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    return (
      <div className="space-y-3">
        {certs.map(cert => (
          <Card key={cert.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={cert.name} onChange={(e) => update(cert.id, "name", e.target.value)} placeholder="AWS Solutions Architect" />
              <Input value={cert.issuer} onChange={(e) => update(cert.id, "issuer", e.target.value)} placeholder="Amazon Web Services" />
              <Input type="month" value={cert.date} onChange={(e) => update(cert.id, "date", e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeCertification(cert.id)}>
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Certification</Button>
      </div>
    );
  };

  const renderProjects = () => {
    const projects = resume?.projects ?? [];
    const add = () => {
      store.addProject({ name: "", description: "", technologies: [] });
    };
    const update = (id: string, field: string, value: any) => {
      if (!resume) return;
      store.updateSection("projects", projects.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    return (
      <div className="space-y-3">
        {projects.map(proj => (
          <Card key={proj.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input value={proj.name} onChange={(e) => update(proj.id, "name", e.target.value)} placeholder="Project Name" />
              <Input value={proj.technologies.join(", ")} onChange={(e) => update(proj.id, "technologies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" />
            </div>
            <Textarea value={proj.description} onChange={(e) => update(proj.id, "description", e.target.value)} placeholder="Brief description of the project..." className="min-h-[80px]" />
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeProject(proj.id)}>
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
      </div>
    );
  };

  const renderVolunteer = () => {
    const vols = resume?.volunteer ?? [];
    const add = () => { store.addVolunteer({ organization: "", role: "", period: "", description: "" }); };
    const update = (id: string, field: string, value: string) => {
      if (!resume) return;
      store.updateSection("volunteer", vols.map(v => v.id === id ? { ...v, [field]: value } : v));
    };
    return (
      <div className="space-y-3">
        {vols.map(vol => (
          <Card key={vol.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input value={vol.organization} onChange={(e) => update(vol.id, "organization", e.target.value)} placeholder="Organization" />
              <Input value={vol.role} onChange={(e) => update(vol.id, "role", e.target.value)} placeholder="Your Role" />
            </div>
            <Input value={vol.period} onChange={(e) => update(vol.id, "period", e.target.value)} placeholder="Jan 2020 – Dec 2021" />
            <Textarea value={vol.description} onChange={(e) => update(vol.id, "description", e.target.value)} placeholder="Description..." className="min-h-[60px]" />
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeVolunteer(vol.id)}>
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Volunteer</Button>
      </div>
    );
  };

  const renderAwards = () => {
    const awards = resume?.awards ?? [];
    const add = () => { store.addAward({ name: "", issuer: "", date: "", description: "" }); };
    const update = (id: string, field: string, value: string) => {
      if (!resume) return;
      store.updateSection("awards", awards.map(a => a.id === id ? { ...a, [field]: value } : a));
    };
    return (
      <div className="space-y-3">
        {awards.map(award => (
          <Card key={award.id} className="p-4 bg-surface-container-high shadow-ambient-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={award.name} onChange={(e) => update(award.id, "name", e.target.value)} placeholder="Award Name" />
              <Input value={award.issuer} onChange={(e) => update(award.id, "issuer", e.target.value)} placeholder="Issuer" />
              <Input type="month" value={award.date} onChange={(e) => update(award.id, "date", e.target.value)} />
            </div>
            <Textarea value={award.description} onChange={(e) => update(award.id, "description", e.target.value)} placeholder="Description..." className="min-h-[60px]" />
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="text-error" onClick={() => store.removeAward(award.id)}>
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Award</Button>
      </div>
    );
  };

  const renderInterests = () => {
    const interests = resume?.interests ?? [];
    const [input, setInput] = useState("");

    const add = (name: string) => {
      if (!name.trim()) return;
      store.addInterest(name.trim());
      setInput("");
    };
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(input); } }} placeholder="Add an interest..." className="flex-1" />
          <Button variant="outline" onClick={() => add(input)}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <Badge key={interest} variant="default" className="pl-2 pr-1 py-1.5 gap-1">
              {interest}
              <button onClick={() => store.removeInterest(interest)} className="text-on-surface-disabled hover:text-error ml-1">
                <X className="w-3 h-3" />
              </button>
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
      case "publications": return (
        <div className="text-center py-8 text-on-surface-variant">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-on-surface-disabled" />
          <p>Add publications when editing a published work</p>
          <p className="text-xs text-on-surface-disabled mt-1">Supports academic papers, articles, conference talks</p>
        </div>
      );
      case "volunteer": return renderVolunteer();
      case "awards": return renderAwards();
      case "interests": return renderInterests();
      default: return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-highest shadow-ambient-sm hover:shadow-ambient-md hover:bg-surface-container-low surface-shift transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                {s.icon}
              </div>
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
          <Button size="sm" variant="ghost" onClick={() => setActiveSection(null)}>
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Button>
          <span className="text-sm text-on-surface-variant">
            {sections.find(s => s.id === activeSection)?.label}
          </span>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

// ─── Step 7: ATS Optimization ────────────────────────────────────────────────

function StepATS({ store }: { store: ResumeState }) {
  const resume = store.currentResume;
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [atsScore, setAtsScore] = useState(resume?.atsScore ?? 72);
  const [missingKeywords, setMissingKeywords] = useState<string[]>(resume?.missingKeywords ?? []);
  const [linkedRoleId, setLinkedRoleId] = useState<string | null>(resume?.linkedJobId ?? null);

  const handleScore = async () => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first");
      return;
    }
    setScoring(true);
    try {
      const res = await resumeApi.getAtsScore({ resumeId: resume?.id, jobDescription });
      const result = res.data?.data ?? res.data ?? {};
      setAtsScore(result.score ?? 0);
      setMissingKeywords(result.missingKeywords ?? []);
      if (result.score !== undefined) {
        store.updateSection("atsScore", result.score);
        store.updateSection("missingKeywords", result.missingKeywords ?? []);
      }
      toast.success(`ATS Score: ${result.score ?? 0}%`);
    } catch {
      toast.error("Failed to calculate ATS score");
    } finally {
      setScoring(false);
    }
  };

  const handleAutoOptimize = async () => {
    if (!jobDescription.trim()) { toast.error("Paste a job description first"); return; }
    setOptimizing(true);
    try {
      await resumeApi.autoOptimize({ resumeId: resume?.id, roleId: linkedRoleId ?? undefined });
      toast.success("Resume optimized for ATS!");
      setAtsScore(Math.min(100, atsScore + 5));
    } catch {
      toast.error("Failed to optimize");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">ATS Optimization</h2>
        <p className="text-on-surface-variant">Analyze and optimize your resume for applicant tracking systems</p>
      </div>

      <Card className="p-6 bg-surface-container-highest shadow-ambient-sm">
        <ATSScoreMeter score={atsScore} showZones />
      </Card>

      <div className="space-y-2">
        <Label htmlFor="jd">Paste Job Description</Label>
        <Textarea
          id="jd"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to analyze your resume against it..."
          className="min-h-[150px]"
        />
        <div className="flex gap-2">
          <Button onClick={handleScore} disabled={scoring || !jobDescription.trim()}>
            {scoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            {scoring ? "Scoring..." : "Score Resume"}
          </Button>
          <Button variant="outline" onClick={handleAutoOptimize} disabled={optimizing || !jobDescription.trim()}>
            {optimizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {optimizing ? "Optimizing..." : "Auto-Optimize"}
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
            {missingKeywords.map((kw, i) => (
              <Badge key={i} variant="warning" className="text-xs">{kw}</Badge>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Add these keywords to your resume to improve your ATS match score
          </p>
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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = format === "pdf"
        ? await resumeApi.downloadPdf()
        : await resumeApi.downloadDocx();
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

  const resumeData = resume ?? {
    name: "Untitled Resume", title: "", template: "MODERN",
    header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
    summary: "", experience: [], education: [], skills: [], certifications: [], projects: [],
    publications: [], volunteer: [], awards: [], interests: [], sections: [],
    status: "draft", tags: [], visibility: "private" as const,
    atsScore: 72, missingKeywords: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), versions: [],
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Preview</h2>
        <p className="text-on-surface-variant">Review your resume before saving</p>
      </div>

      {/* Download bar */}
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

      {/* Resume preview */}
      <div className="transform scale-[0.65] origin-top-left" style={{ width: "154%", height: "154%" }}>
        <div className="bg-white rounded-xl shadow-ambient-lg p-8 min-h-[700px] font-sans border border-outline-variant">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-on-surface">{resumeData.header.name || "Your Name"}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mt-1">
              {resumeData.header.email && <span>{resumeData.header.email}</span>}
              {resumeData.header.phone && <><span>·</span><span>{resumeData.header.phone}</span></>}
              {resumeData.header.location && <><span>·</span><span>{resumeData.header.location}</span></>}
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 text-xs text-on-surface-variant mt-0.5">
              {resumeData.header.linkedin && <span>linkedin.com/in/{resumeData.header.linkedin}</span>}
              {resumeData.header.github && <span>github.com/{resumeData.header.github}</span>}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-1 mb-2">Professional Summary</h3>
              <p className="text-xs text-on-surface-variant">{resumeData.summary}</p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-1 mb-2">Experience</h3>
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-on-surface">{exp.title}</p>
                    <p className="text-xs text-on-surface-variant">{exp.period || `${exp.startDate} – ${exp.endDate || "Present"}`}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <p key={bi} className="text-xs text-on-surface-variant pl-3 mt-0.5">• {b}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {resumeData.education.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-1 mb-2">Education</h3>
              {resumeData.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-on-surface">{edu.degreeType} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                    <p className="text-xs text-on-surface-variant">{edu.graduationDate}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant">{edu.school}{edu.gpa ? `, GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          )}

          {resumeData.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-1 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {resumeData.skills.map((skill, i) => (
                  <span key={i} className="text-xs text-on-surface">
                    {skill.name} <span className="text-on-surface-variant">
                      {PROFICIENCY_LABELS[skill.proficiency] ? `(${PROFICIENCY_LABELS[skill.proficiency]})` : ""}
                    </span>
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

function StepSave({ store, resumeId, onComplete }: {
  store: ResumeState;
  resumeId: string | null;
  onComplete: () => void;
}) {
  const [name, setName] = useState(store.currentResume?.name ?? "Untitled Resume");
  const [title, setTitle] = useState(store.currentResume?.title ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please name your resume"); return; }
    setSaving(true);
    try {
      store.setResumeName(name);
      if (title) store.setResumeTitle(title);
      store.setStatus("complete");

      if (resumeId) {
        await resumeApi.updateById(resumeId, store.currentResume! as unknown as Record<string, unknown>);
      } else {
        const res = await resumeApi.create(store.currentResume! as unknown as Record<string, unknown>);
        const created = res.data?.data ?? res.data;
        if (created?.id) {
          store.setCurrentResume({ ...store.currentResume!, id: created.id });
        }
      }
      toast.success("Resume saved!");
      onComplete();
    } catch {
      toast.error("Failed to save resume");
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
        <p className="text-on-surface-variant">Give your resume a name and you're done!</p>
      </div>

      <Card className="p-6 bg-surface-container-highest shadow-ambient-sm max-w-md mx-auto space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="resume-name">Resume Name *</Label>
          <Input
            id="resume-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Senior Frontend Dev — TechCorp Application"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="resume-title">Target Role</Label>
          <Input
            id="resume-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Frontend Engineer"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="draft" checked={store.currentResume?.status === "draft"} onCheckedChange={(checked) => store.setStatus(checked ? "draft" : "complete")} />
          <Label htmlFor="draft" className="text-sm cursor-pointer">Save as draft</Label>
        </div>
        <Button className="w-full" size="lg" onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : "Save Resume"}
        </Button>
      </Card>
    </div>
  );
}

// ─── Main Builder ───────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const store = useResumeStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepId>(0);
  const [resumeId] = useState<string | null>(null); // null = new resume
  const { saveStatus } = useAutoSave(store, resumeId);

  // Initialize blank resume on mount
  useEffect(() => {
    if (!store.currentResume) {
      const blank = {
        id: "",
        name: "Untitled Resume",
        title: "",
        template: "MODERN" as TemplateType,
        status: "draft" as const,
        tags: [],
        visibility: "private" as const,
        header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        publications: [],
        volunteer: [],
        awards: [],
        interests: [],
        sections: [],
        atsScore: undefined,
        missingKeywords: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [],
      };
      store.setCurrentResume(blank);
    }
  }, [store]);

  const handleStep0Next = (method: string) => {
    if (method === "template") setCurrentStep(1);
    else if (method === "import") {
      toast.info("Import feature — upload PDF coming soon");
      setCurrentStep(2);
    }
    else setCurrentStep(2);
  };

  const handleComplete = () => {
    store.setCurrentResume(null);
    router.push("/resume");
  };

  const progress = Math.round(((currentStep) / (STEPS.length - 1)) * 100);

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < STEPS.length - 1;

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepStart onNext={handleStep0Next} />;
      case 1: return <StepTemplate store={store} />;
      case 2: return <StepProfile store={store} />;
      case 3: return <StepExperience store={store} />;
      case 4: return <StepEducation store={store} />;
      case 5: return <StepSkills store={store} />;
      case 6: return <StepAdditional store={store} />;
      case 7: return <StepATS store={store} />;
      case 8: return <StepPreview store={store} />;
      case 9: return <StepSave store={store} resumeId={resumeId} onComplete={handleComplete} />;
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
                {saveStatus === "saving" && <><Loader2 className="w-3 h-3 animate-spin text-on-surface-variant" /> <span className="text-on-surface-variant">Saving...</span></>}
                {saveStatus === "saved" && <><CheckCircle2 className="w-3 h-3 text-success" /> <span className="text-success">Saved</span></>}
                {saveStatus === "error" && <><AlertCircle className="w-3 h-3 text-error" /> <span className="text-error">Save failed</span></>}
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push("/resume")}>Exit Builder</Button>
            </div>
          </div>
          {/* Progress bar */}
          <Progress value={progress} className="h-1" />
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-2 overflow-x-auto pb-1">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => i <= currentStep && setCurrentStep(step.id)}
                className={`flex items-center gap-1 shrink-0 transition-all ${
                  i === currentStep
                    ? "text-primary"
                    : i < currentStep
                    ? "text-on-surface-variant hover:text-on-surface"
                    : "text-on-surface-disabled"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === currentStep
                    ? "bg-primary text-white"
                    : i < currentStep
                    ? "bg-success/16 text-success"
                    : "bg-surface-container-low text-on-surface-disabled"
                }`}>
                  {i < currentStep ? <Check className="w-2.5 h-2.5" /> : i + 1}
                </div>
                <span className="text-[10px] hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {store.currentResume ? renderStep() : (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-variant" />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => (s - 1) as StepId)}
            disabled={!canGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          {canGoForward && currentStep < 9 && (
            <Button
              onClick={() => setCurrentStep((s) => (s + 1) as StepId)}
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
