"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  RadarChart,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  ChevronRight,
  Zap,
  Target,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";

const SKILL_DATA = [
  { name: "React", level: 85, target: 90, category: "Frontend", color: "#0D7377" },
  { name: "TypeScript", level: 78, target: 85, category: "Frontend", color: "#0D7377" },
  { name: "Node.js", level: 65, target: 80, category: "Backend", color: "#7C6BB2" },
  { name: "Python", level: 72, target: 85, category: "Backend", color: "#7C6BB2" },
  { name: "System Design", level: 45, target: 75, category: "Architecture", color: "#FF6B35" },
  { name: "SQL", level: 68, target: 80, category: "Data", color: "#22C55E" },
  { name: "AWS", level: 40, target: 70, category: "DevOps", color: "#F59E0B" },
  { name: "Docker", level: 55, target: 75, category: "DevOps", color: "#F59E0B" },
  { name: "Machine Learning", level: 30, target: 60, category: "AI/ML", color: "#EF4444" },
  { name: "Communication", level: 80, target: 90, category: "Soft Skills", color: "#22C55E" },
];

const GAPS = [
  { skill: "System Design", gap: 30, priority: "High", reason: "Required for senior/staff roles at FAANG companies", resources: 4 },
  { skill: "AWS", gap: 30, priority: "High", reason: "Cloud proficiency required for 68% of target roles", resources: 6 },
  { skill: "Machine Learning", gap: 30, priority: "Medium", reason: "Differentiator for ML-adjacent product roles", resources: 8 },
  { skill: "Docker", gap: 20, priority: "Medium", reason: "Containerization is standard in modern devops", resources: 3 },
  { skill: "Node.js", gap: 15, priority: "Low", reason: "Backend depth complements your frontend strength", resources: 2 },
];

const RESOURCES = [
  { skill: "System Design", title: "Grok the System Design Interview", platform: "Educative", type: "Course", duration: "12 hours", url: "#", progress: 0 },
  { skill: "System Design", title: "Designing Data-Intensive Applications", platform: "Book", type: "Book", duration: "15 hours", url: "#", progress: 30 },
  { skill: "AWS", title: "AWS Solutions Architect Associate", platform: "AWS Training", type: "Certification", duration: "40 hours", url: "#", progress: 0 },
  { skill: "AWS", title: "Stephen Maarek's AWS Course", platform: "Udemy", type: "Course", duration: "20 hours", url: "#", progress: 0 },
  { skill: "Machine Learning", title: "Andrew Ng's ML Course", platform: "Coursera", type: "Course", duration: "60 hours", url: "#", progress: 0 },
];

const RADAR_DATA = [
  { subject: "Frontend", A: 85, B: 80, fullMark: 100 },
  { subject: "Backend", A: 65, B: 75, fullMark: 100 },
  { subject: "DevOps", A: 48, B: 60, fullMark: 100 },
  { subject: "Data", A: 68, B: 70, fullMark: 100 },
  { subject: "AI/ML", A: 30, B: 55, fullMark: 100 },
  { subject: "Soft Skills", A: 80, B: 85, fullMark: 100 },
];

function SimpleRadarChart({ data }: { data: typeof RADAR_DATA }) {
  const maxRadius = 100;
  const cx = 150;
  const cy = 150;
  const categories = data.length;
  const angleStep = (2 * Math.PI) / categories;
  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.A / d.fullMark) * maxRadius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), label: d.subject, value: d.A };
  });
  const gridRings = [20, 40, 60, 80, 100];

  return (
    <div className="w-full aspect-square max-w-[300px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Grid rings */}
        {gridRings.map((r) => (
          <polygon
            key={r}
            points={Array.from({ length: categories }, (_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              return `${cx + (r / 100) * maxRadius * Math.cos(angle)},${cy + (r / 100) * maxRadius * Math.sin(angle)}`;
            }).join(" ")}
            fill="none"
            stroke="#E8E8E6"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + maxRadius * Math.cos(angle)}
              y2={cy + maxRadius * Math.sin(angle)}
              stroke="#E8E8E6"
              strokeWidth="1"
            />
          );
        })}
        {/* Data polygon */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="#0D7377"
          fillOpacity="0.2"
          stroke="#0D7377"
          strokeWidth="2"
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0D7377" />
        ))}
        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#5C5C6D"
            fontWeight="500"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [tab, setTab] = useState("overview");

  const totalGap = GAPS.reduce((s, g) => s + g.gap, 0);
  const priorityCount = GAPS.filter((g) => g.priority === "High").length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Skill Gap Analysis</h1>
          <p className="text-sm text-[#5C5C6D] mt-1">Identify and close gaps between your skills and target roles</p>
        </div>
        <Button className="bg-[#0D7377] hover:bg-[#0a5c5f]">
          <Zap className="w-4 h-4 mr-2" /> Run AI Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#1A1A2E]">{SKILL_DATA.length}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Skills Tracked</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#FF6B35]">{GAPS.length}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Gaps Identified</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#EF4444]">{priorityCount}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">High Priority</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#22C55E]">{Math.round(SKILL_DATA.reduce((s, d) => s + (d.level / d.target), 0) / SKILL_DATA.length * 100)}%</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Overall Readiness</p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-[#F4F4F2] p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Details</TabsTrigger>
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-[#1A1A2E] mb-4">Skill Radar</h3>
              <SimpleRadarChart data={RADAR_DATA} />
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0D7377]" />
                  <span className="text-xs text-[#5C5C6D]">Your Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-[#7C6BB2]" />
                  <span className="text-xs text-[#5C5C6D]">Target Level</span>
                </div>
              </div>
            </Card>

            {/* Top Gaps */}
            <Card className="p-6">
              <h3 className="font-semibold text-[#1A1A2E] mb-4">Top Priority Gaps</h3>
              <div className="space-y-3">
                {GAPS.filter((g) => g.priority === "High").map((gap) => {
                  const skill = SKILL_DATA.find((s) => s.name === gap.skill);
                  return (
                    <div key={gap.skill} className="p-3 rounded-lg border border-[#E8E8E6]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#EF4444]" />
                          <span className="font-medium text-[#1A1A2E]">{gap.skill}</span>
                        </div>
                        <Badge className="bg-[#EF4444]/10 text-[#EF4444] text-xs">-{gap.gap}%</Badge>
                      </div>
                      <p className="text-xs text-[#5C5C6D] mb-2">{gap.reason}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#E8E8E6] rounded-full overflow-hidden">
                          <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${skill?.level || 0}%` }} />
                        </div>
                        <span className="text-xs text-[#5C5C6D]">{skill?.level}%</span>
                        <span className="text-xs text-[#5C5C6D]">→ {skill?.target}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setTab("gaps")}>
                View All Gaps <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaps">
          <div className="space-y-3">
            {GAPS.map((gap) => {
              const skill = SKILL_DATA.find((s) => s.name === gap.skill);
              return (
                <Card key={gap.skill} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1A1A2E]">{gap.skill}</h3>
                        <Badge className={
                          gap.priority === "High" ? "bg-[#EF4444]/10 text-[#EF4444]" :
                          gap.priority === "Medium" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                          "bg-[#22C55E]/10 text-[#22C55E]"
                        }>
                          {gap.priority} Priority
                        </Badge>
                        <Badge className="bg-[#E8E8E6] text-[#5C5C6D]">{skill?.category}</Badge>
                      </div>
                      <p className="text-sm text-[#5C5C6D] mb-3">{gap.reason}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#5C5C6D]">Current: {skill?.level}%</span>
                            <span className="text-xs text-[#5C5C6D]">Target: {skill?.target}%</span>
                          </div>
                          <div className="h-2 bg-[#E8E8E6] rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#0D7377]" style={{ width: `${(skill?.level || 0) / (skill?.target || 100) * 100}%` }} />
                            <div className="h-full bg-[#E8E8E6] flex-1" />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#EF4444]">-{gap.gap}%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="w-10 h-10 rounded-lg bg-[#7C6BB2]/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#7C6BB2]" />
                      </div>
                      <span className="text-xs text-[#5C5C6D]">{gap.resources} resources</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <div className="space-y-4">
            {/* Week 1-2 */}
            <div className="border-l-2 border-[#FF6B35] pl-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                <span className="font-semibold text-[#1A1A2E]">Weeks 1-2: System Design Fundamentals</span>
              </div>
              <p className="text-sm text-[#5C5C6D]">Build a strong foundation in distributed systems concepts</p>
              {RESOURCES.filter((r) => r.skill === "System Design").map((r) => (
                <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A2E] truncate">{r.title}</p>
                    <p className="text-xs text-[#5C5C6D]">{r.platform} · {r.type} · {r.duration}</p>
                  </div>
                  {r.progress > 0 ? (
                    <div className="flex items-center gap-2 w-24">
                      <Progress value={r.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-[#5C5C6D]">{r.progress}%</span>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">Start</Button>
                  )}
                </div>
              ))}
            </div>

            {/* Week 3-4 */}
            <div className="border-l-2 border-[#0D7377] pl-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0D7377]" />
                <span className="font-semibold text-[#1A1A2E]">Weeks 3-4: AWS Cloud Essentials</span>
              </div>
              <p className="text-sm text-[#5C5C6D]">Get comfortable with core AWS services and architecture patterns</p>
              {RESOURCES.filter((r) => r.skill === "AWS").map((r) => (
                <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]">
                  <div className="w-8 h-8 rounded-lg bg-[#0D7377]/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#0D7377]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A2E] truncate">{r.title}</p>
                    <p className="text-xs text-[#5C5C6D]">{r.platform} · {r.type} · {r.duration}</p>
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              ))}
            </div>

            {/* Week 5-6 */}
            <div className="border-l-2 border-[#7C6BB2] pl-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7C6BB2]" />
                <span className="font-semibold text-[#1A1A2E]">Weeks 5-6: ML Foundations</span>
              </div>
              <p className="text-sm text-[#5C5C6D]">Develop practical ML understanding for product-adjacent roles</p>
              {RESOURCES.filter((r) => r.skill === "Machine Learning").map((r) => (
                <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]">
                  <div className="w-8 h-8 rounded-lg bg-[#7C6BB2]/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#7C6BB2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A2E] truncate">{r.title}</p>
                    <p className="text-xs text-[#5C5C6D]">{r.platform} · {r.type} · {r.duration}</p>
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
