"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Sparkles, Plus, FileText, Zap } from "lucide-react";
import { resumeApi } from "@/lib/api";
import { toast } from "sonner";

const SECTIONS = ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"];
const TEMPLATES = ["Modern", "Minimal", "Executive", "Creative"];

interface ResumeBuilderProps {
  initialData?: {
    header?: Record<string, string>;
    summary?: string;
    experience?: Array<{ company: string; title: string; period: string; bullets: string[] }>;
    education?: Array<{ school: string; degree: string; year: string; gpa?: string }>;
    skills?: string[];
    atsScore?: number;
    missingKeywords?: string[];
  };
}

export function ResumeBuilder({ initialData }: ResumeBuilderProps) {
  const [template, setTemplate] = useState("Modern");
  const [section, setSection] = useState("Summary");
  const [generating, setGenerating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const data = initialData || {
    header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    atsScore: 72,
    missingKeywords: ["distributed systems", "scalability", "AWS", "CI/CD", "microservices"],
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await resumeApi.generateSummary({ prompt: "Generate a professional summary" });
      const summary = res.data.data ?? res.data.summary;
      if (summary) toast.success("AI summary generated!");
    } catch {
      toast.error("Failed to generate summary.");
    } finally {
      setGenerating(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      await resumeApi.optimize({ targetRole: "Software Engineer" });
      toast.success("Resume optimized for ATS!");
    } catch {
      toast.error("Failed to optimize resume.");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-on-surface">Resume Builder</h2>
          <p className="text-sm text-on-surface-variant">Create ATS-optimized resumes tailored to each role</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => resumeApi.downloadPdf().then(() => toast.success("PDF downloaded!")).catch(() => toast.error("Failed to download"))}>
            <Download className="w-4 h-4 mr-2" />PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => resumeApi.downloadDocx().then(() => toast.success("DOCX downloaded!")).catch(() => toast.error("Failed to download"))}>
            <FileText className="w-4 h-4 mr-2" />DOCX
          </Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={`shrink-0 w-28 h-36 rounded-xl border-2 p-1 transition-all ${
              template === t
                ? "border-primary bg-primary/5"
                : "border-outline-variant bg-surface-container-highest hover:border-primary/30"
            }`}
          >
            <div className="w-full h-full bg-surface-container-mid rounded border border-outline-variant p-2 flex flex-col gap-1">
              <div className="h-3 w-16 bg-surface-container-high rounded" />
              <div className="h-2 w-12 bg-surface-container-high rounded" />
              <div className="mt-auto space-y-1">
                <div className="h-1.5 w-full bg-surface-container-high rounded" />
                <div className="h-1.5 w-3/4 bg-surface-container-high rounded" />
              </div>
            </div>
            <p className="text-xs text-center mt-1 font-medium text-on-surface">{t}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface-container-highest shadow-ambient-sm">
          <Tabs value={section} onValueChange={setSection}>
            <TabsList className="mb-4 flex flex-wrap h-auto gap-1 bg-surface-container-low rounded-xl p-1">
              {SECTIONS.map((s) => (
                <TabsTrigger key={s} value={s} className="text-xs data-[state=active]:bg-surface-container-highest data-[state=active]:text-primary" />
              ))}
            </TabsList>

            {section === "Summary" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-on-surface-variant">Professional Summary</p>
                  <Button size="sm" variant="outline" onClick={handleGenerate} disabled={generating}>
                    <Sparkles className="w-3 h-3 mr-1" /> {generating ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea className="min-h-[120px]" defaultValue={data.summary} placeholder="Write your professional summary..." />
                <p className="text-xs text-on-surface-disabled">Aim for 2-3 sentences highlighting your key strengths</p>
              </div>
            )}

            {section === "Experience" && (
              <div className="space-y-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />Add Experience
                </Button>
              </div>
            )}

            {section === "Skills" && (
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Add skills (press Enter to create a tag)</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(data.skills || []).map((s) => (
                    <Badge key={s} variant="default" className="pr-1.5">
                      {s} <button className="ml-1 hover:text-error text-on-surface-disabled">&#215;</button>
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Type a skill and press Enter" />
              </div>
            )}

            {["Education", "Projects", "Certifications"].includes(section) && (
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />Add {section}
                </Button>
              </div>
            )}
          </Tabs>
        </Card>

        <div>
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-on-surface-variant">Live Preview</p>
              <Button size="sm" variant="accent" onClick={handleOptimize} disabled={optimizing}>
                <Zap className="w-3 h-3 mr-1" /> {optimizing ? "Optimizing..." : "Optimize for ATS"}
              </Button>
            </div>
            <div className="transform scale-[0.7] origin-top-left" style={{ width: "143%", height: "143%" }}>
              <div className="bg-white rounded-xl shadow-ambient-md p-8 min-h-[600px] font-sans">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-on-surface">{data.header?.name || "Your Name"}</h2>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mt-1">
                    {data.header?.email && <span>{data.header.email}</span>}
                    {data.header?.phone && <><span>·</span><span>{data.header.phone}</span></>}
                    {data.header?.location && <><span>·</span><span>{data.header.location}</span></>}
                  </div>
                </div>
                <div className="border-t border-b border-outline-variant py-3 my-3 text-center text-xs text-on-surface-variant">
                  {data.header?.linkedin} · {data.header?.github}
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Professional Summary</h3>
                  <p className="text-xs text-on-surface-variant">{data.summary || "Your professional summary will appear here..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}