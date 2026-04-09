"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { resumeApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Sparkles,
  Download,
  FileText,
  CheckCircle,
  Zap,
  Plus,
  Trash2,
} from "lucide-react";

const templates = ["Modern", "Minimal", "Executive", "Creative"];
const sections = ["Header", "Summary", "Experience", "Education", "Skills", "Projects"];

const mockResume = {
  header: { name: "Alex Johnson", email: "alex@example.com", phone: "+1 555 123 4567", location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson", github: "github.com/alexjohnson" },
  summary: "Motivated software engineer with 3 years of experience building scalable web applications. Passionate about clean code and user experience. Seeking to leverage my full-stack skills at a growth-stage startup.",
  experience: [
    { company: "TechCorp", title: "Software Engineer", period: "Jan 2022 – Present", bullets: ["Led development of customer-facing dashboard serving 50K users", "Reduced API response times by 40% through database optimization", "Mentored 2 junior developers and conducted code reviews"] },
    { company: "StartupXYZ", title: "Frontend Developer", period: "Jun 2020 – Dec 2021", bullets: ["Built responsive web app from scratch using React and TypeScript", "Implemented CI/CD pipeline reducing deployment time by 60%"] },
  ],
  education: [{ school: "UC Berkeley", degree: "B.S. Computer Science", year: "2020", gpa: "3.7" }],
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
};

function TemplatePicker({ selected, onSelect }: { selected: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {templates.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`shrink-0 w-28 h-36 rounded-lg border-2 p-1 transition-all ${
            selected === t ? "border-[#0D7377] bg-[#E8F6F6]" : "border-[#E8E8E6] bg-white hover:border-[#0D7377]/50"
          }`}
        >
          <div className="w-full h-full bg-[#FAFAF8] rounded border border-[#E8E8E6] p-2 flex flex-col gap-1">
            <div className="h-3 w-16 bg-[#E8E8E6] rounded" />
            <div className="h-2 w-12 bg-[#E8E8E6] rounded" />
            <div className="mt-auto space-y-1">
              <div className="h-1.5 w-full bg-[#E8E8E6] rounded" />
              <div className="h-1.5 w-3/4 bg-[#E8E8E6] rounded" />
            </div>
          </div>
          <p className="text-xs text-center mt-1 font-medium">{t}</p>
        </button>
      ))}
    </div>
  );
}

function ResumePreview({ data, template }: { data: typeof mockResume; template: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px] font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[#1A1A2E]">{data.header.name}</h2>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-[#5C5C6D] mt-1">
          <span>{data.header.email}</span>
          <span>·</span>
          <span>{data.header.phone}</span>
          <span>·</span>
          <span>{data.header.location}</span>
        </div>
      </div>
      <div className="border-t border-b border-[#E8E8E6] py-3 my-3 text-center text-xs text-[#5C5C6D]">
        {data.header.linkedin} · {data.header.github}
      </div>
      {/* Summary */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0D7377] uppercase tracking-wider mb-1">Professional Summary</h3>
        <p className="text-xs text-[#5C5C6D]">{data.summary}</p>
      </div>
      {/* Experience */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0D7377] uppercase tracking-wider mb-2">Experience</h3>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#1A1A2E]">{exp.title}</span>
              <span className="text-xs text-[#5C5C6D]">{exp.period}</span>
            </div>
            <p className="text-xs text-[#5C5C6D] mb-1">{exp.company}</p>
            <ul className="space-y-0.5">
              {exp.bullets.map((b, j) => (
                <li key={j} className="text-xs text-[#5C5C6D] pl-3 relative before:content-['•'] before:absolute before:-left-1 before:text-[#0D7377]">{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Skills */}
      <div>
        <h3 className="text-sm font-bold text-[#0D7377] uppercase tracking-wider mb-1">Skills</h3>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#F0EDF7] text-[#7C6BB2]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const [template, setTemplate] = useState("Modern");
  const [section, setSection] = useState("Summary");
  const [data, setData] = useState(mockResume);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    resumeApi.get()
      .then((res) => {
        const resumeData = res.data.data ?? res.data;
        if (resumeData && Object.keys(resumeData).length > 0) {
          setData(resumeData);
        }
      })
      .catch(() => toast.error("Failed to load resume data."))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await resumeApi.generateSummary({ prompt: "Generate a professional summary" });
      const summary = res.data.data ?? res.data.summary;
      if (summary) setData((p) => ({ ...p, summary }));
      toast.success("AI summary generated!");
    } catch {
      toast.error("Failed to generate summary.");
    } finally {
      setGenerating(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await resumeApi.optimize(data);
      const optimized = res.data.data ?? res.data;
      if (optimized) setData(optimized);
      toast.success("Resume optimized for ATS!");
    } catch {
      toast.error("Failed to optimize resume.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await resumeApi.downloadPdf();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF.");
    }
  };

  const handleDownloadDocx = async () => {
    try {
      const res = await resumeApi.downloadDocx();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("DOCX downloaded!");
    } catch {
      toast.error("Failed to download DOCX.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-48 h-8 rounded mb-2" />
            <Skeleton className="w-64 h-4 rounded" />
          </div>
          <Skeleton className="w-32 h-9 rounded" />
        </div>
        <Skeleton className="w-full h-44 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Resume Builder</h1>
          <p className="text-sm text-[#5C5C6D]">Create ATS-optimized resumes tailored to each role</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}><Download className="w-4 h-4 mr-2" />PDF</Button>
          <Button variant="outline" size="sm" onClick={handleDownloadDocx}><FileText className="w-4 h-4 mr-2" />DOCX</Button>
        </div>
      </div>

      {/* Template Picker */}
      <div>
        <p className="text-sm font-medium text-[#5C5C6D] mb-2">Choose a template</p>
        <TemplatePicker selected={template} onSelect={setTemplate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="p-6">
          <Tabs value={section} onValueChange={setSection}>
            <TabsList className="mb-4 flex flex-wrap h-auto gap-1 bg-[#F4F4F2] p-1">
              {sections.map((s) => (
                <TabsTrigger key={s} value={s} className="text-xs data-[state=active]:bg-white">{s}</TabsTrigger>
              ))}
            </TabsList>
            {section === "Header" && (
              <div className="space-y-3">
                <Input placeholder="Full Name" defaultValue={data.header.name} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Email" defaultValue={data.header.email} />
                  <Input placeholder="Phone" defaultValue={data.header.phone} />
                </div>
                <Input placeholder="Location" defaultValue={data.header.location} />
                <Input placeholder="LinkedIn URL" defaultValue={data.header.linkedin} />
                <Input placeholder="GitHub URL" defaultValue={data.header.github} />
              </div>
            )}
            {section === "Summary" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#5C5C6D]">Professional Summary</p>
                  <Button size="sm" variant="outline" onClick={handleGenerate} disabled={generating}>
                    <Sparkles className="w-3 h-3 mr-1" /> {generating ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea
                  className="min-h-[120px]"
                  defaultValue={data.summary}
                  onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
                />
                <p className="text-xs text-[#9B9BAA]">Aim for 2-3 sentences highlighting your key strengths</p>
              </div>
            )}
            {section === "Experience" && (
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <Card key={i} className="p-4 border border-[#E8E8E6]">
                    <div className="flex items-center justify-between mb-3">
                      <Badge>{exp.company}</Badge>
                      <button className="text-[#EF4444] hover:bg-[#FEF2F2] p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Job Title" defaultValue={exp.title} />
                      <Input placeholder="Period (e.g. Jan 2022 – Present)" defaultValue={exp.period} />
                      <Textarea placeholder="Bullet points (one per line)" defaultValue={exp.bullets.join("\n")} className="min-h-[80px]" />
                    </div>
                  </Card>
                ))}
                <Button variant="outline" size="sm" className="w-full"><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
              </div>
            )}
            {section === "Education" && (
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <Card key={i} className="p-4 space-y-2">
                    <Input placeholder="Institution" defaultValue={edu.school} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Degree" defaultValue={edu.degree} />
                      <Input placeholder="Graduation Year" defaultValue={edu.year} />
                    </div>
                    <Input placeholder="GPA (optional)" defaultValue={edu.gpa} />
                  </Card>
                ))}
              </div>
            )}
            {section === "Skills" && (
              <div>
                <p className="text-sm text-[#5C5C6D] mb-2">Add skills (press Enter to create a tag)</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills.map((s) => (
                    <Badge key={s} className="bg-[#F0EDF7] text-[#7C6BB2] pr-1.5">
                      {s} <button className="ml-1 hover:text-[#EF4444]">×</button>
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Type a skill and press Enter" />
              </div>
            )}
            {section === "Projects" && (
              <div className="space-y-3">
                <Card className="p-4 space-y-2">
                  <Input placeholder="Project Name" />
                  <Textarea placeholder="Project Description" className="min-h-[80px]" />
                  <Input placeholder="Technologies Used" />
                </Card>
                <Button variant="outline" size="sm" className="w-full"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
              </div>
            )}
          </Tabs>
        </Card>

        {/* Preview */}
        <div>
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#5C5C6D]">Live Preview</p>
              <Button size="sm" variant="accent" onClick={handleOptimize} disabled={optimizing}>
                <Zap className="w-3 h-3 mr-1" /> {optimizing ? "Optimizing..." : "Optimize for ATS"}
              </Button>
            </div>
            <div className="transform scale-[0.7] origin-top-left" style={{ width: "142%", height: "143%" }}>
              <ResumePreview data={data} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
