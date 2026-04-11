"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { skillApi, skillGapApi } from "@/lib/api";
import { useSkillsStore, GapItem, RadarData } from "@/stores/skills-store";
import { toast } from "sonner";
import {
  Radar,
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
  AlertCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";

const TARGET_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Full Stack Developer",
  "Data Analyst",
];

function getRadarAxesForRole(role: string): string[] {
  const axes: Record<string, string[]> = {
    "Software Engineer": ["Frontend", "Backend", "Database", "DevOps", "System Design", "Testing"],
    "Product Manager": ["Strategy", "Analytics", "Communication", "Technical", "Execution", "Leadership"],
    "Data Scientist": ["ML/AI", "Statistics", "Programming", "Data Engineering", "Visualization", "Domain"],
    "UX Designer": ["Research", "Design", "Prototyping", "Tools", "Collaboration", "Accessibility"],
    "DevOps Engineer": ["Cloud", "CI/CD", "Containerization", "Monitoring", "Security", "Automation"],
    "Full Stack Developer": ["Frontend", "Backend", "Database", "APIs", "DevOps", "Testing"],
    "Data Analyst": ["SQL", "Visualization", "Statistics", "Python", "Business", "Reporting"],
  };
  return axes[role] || ["Technical", "Communication", "Problem Solving", "Leadership", "Domain", "Tools"];
}

function buildRadarData(
  axes: string[],
  radarData: RadarData[]
): { subject: string; A: number; B: number; fullMark: number }[] {
  return axes.map((axis) => {
    const found = radarData.find((r) => r.subject.toLowerCase() === axis.toLowerCase());
    return {
      subject: axis,
      A: found?.current ?? 0,
      B: found?.target ?? 0,
      fullMark: 100,
    };
  });
}

function SimpleRadarChart({
  data,
}: {
  data: { subject: string; A: number; B: number; fullMark: number }[];
}) {
  const maxRadius = 100;
  const cx = 150;
  const cy = 150;
  const categories = data.length;
  const angleStep = (2 * Math.PI) / categories;
  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.A / d.fullMark) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      label: d.subject,
      value: d.A,
      targetX: cx + (d.B / d.fullMark) * maxRadius * Math.cos(angle),
      targetY: cy + (d.B / d.fullMark) * maxRadius * Math.sin(angle),
    };
  });
  const targetPoints = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.B / d.fullMark) * maxRadius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const gridRings = [20, 40, 60, 80, 100];

  return (
    <div className="w-full aspect-square max-w-[300px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
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
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + maxRadius * Math.cos(angle)}
              y2={cy + maxRadius * Math.sin(angle)}
              stroke="#E8E8E6"
              strokeWidth="1"
            />
          );
        })}
        {/* Target polygon */}
        <polygon
          points={targetPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="#7C6BB2"
          fillOpacity="0.08"
          stroke="#7C6BB2"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Current polygon */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="#0D7377"
          fillOpacity="0.2"
          stroke="#0D7377"
          strokeWidth="2"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0D7377" />
        ))}
        {targetPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7C6BB2" />
        ))}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y - 10}
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

function getPriorityFromImportance(importance: number): "HIGH" | "MEDIUM" | "LOW" {
  if (importance >= 8) return "HIGH";
  if (importance >= 5) return "MEDIUM";
  return "LOW";
}

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [tab, setTab] = useState("overview");
  const [targetRole, setTargetRole] = useState<string>("Software Engineer");
  const [roadmapData, setRoadmapData] = useState<Record<string, unknown>>({});
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [profileEmpty, setProfileEmpty] = useState(false);

  const {
    skills,
    targetRole: storeTargetRole,
    gaps,
    matchedSkills,
    readinessScore,
    radarData,
    isAnalyzing,
    setSkills,
    setTargetRole: setStoreTargetRole,
    setGapAnalysis,
    setAnalyzing,
  } = useSkillsStore();

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await skillApi.get();
        const data = res.data?.data ?? res.data;
        const loadedSkills: string[] = data?.skills || [];
        setSkills(loadedSkills);
        if (loadedSkills.length === 0) {
          setProfileEmpty(true);
        }
        if (data?.targetRole && TARGET_ROLES.includes(data.targetRole)) {
          setTargetRole(data.targetRole);
          setStoreTargetRole(data.targetRole);
        }
      } catch {
        // API not available yet, show empty state
        setProfileEmpty(true);
      }
    };
    loadInitialData();
  }, [setSkills, setStoreTargetRole]);

  const loadGapAnalysis = useCallback(
    async (role: string) => {
      try {
        const res = await skillGapApi.analyze(role);
        const data = res.data?.data ?? res.data;
        setGapAnalysis(
          data?.gaps || [],
          data?.matched || [],
          data?.readiness || 0,
          data?.radarData || []
        );
      } catch {
        // silently fail on pre-analysis load
      }
    },
    [setGapAnalysis]
  );

  const handleRoleChange = async (role: string) => {
    setTargetRole(role);
    setStoreTargetRole(role);
    if (gaps.length > 0 || matchedSkills.length > 0) {
      await loadGapAnalysis(role);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole) {
      toast.error("Please select a target role first");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await skillGapApi.analyze(targetRole);
      const data = res.data?.data ?? res.data;
      setGapAnalysis(
        data?.gaps || [],
        data?.matched || [],
        data?.readiness || 0,
        data?.radarData || []
      );
      toast.success("Analysis complete!");
      setTab("overview");
    } catch {
      toast.error("Analysis failed — check your profile first");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewRoadmap = async (skill: string) => {
    setSelectedSkill(skill);
    setLoadingRoadmap(true);
    setTab("roadmap");
    try {
      const res = await skillGapApi.getRoadmap(targetRole);
      const data = res.data?.data ?? res.data;
      setRoadmapData(data || {});
    } catch {
      toast.error("Failed to load roadmap");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleStartResource = (skill: string, title: string) => {
    const key = `roadmap-progress-${skill}-${title}`;
    if (typeof window !== "undefined") {
      localStorage.setItem(key, "10");
    }
  };

  const getResourceProgress = (skill: string, title: string): number => {
    if (typeof window === "undefined") return 0;
    const key = `roadmap-progress-${skill}-${title}`;
    return parseInt(localStorage.getItem(key) || "0", 10);
  };

  const sortedGaps = [...gaps].sort((a, b) => {
    const pa = getPriorityFromImportance(a.importance);
    const pb = getPriorityFromImportance(b.importance);
    return (PRIORITY_ORDER[pa] ?? 3) - (PRIORITY_ORDER[pb] ?? 3);
  });

  const highPriorityCount = gaps.filter(
    (g) => getPriorityFromImportance(g.importance) === "HIGH"
  ).length;

  const axes = getRadarAxesForRole(targetRole);
  const chartData = buildRadarData(
    axes,
    radarData.length > 0 ? radarData : []
  );

  const radarHasData = radarData.length > 0 && radarData.some((r) => r.current > 0 || r.target > 0);

  // Empty profile state
  if (profileEmpty && skills.length === 0 && gaps.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0D7377]/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#0D7377]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">Complete your profile to get skill analysis</h2>
          <p className="text-sm text-[#5C5C6D] max-w-md">
            Add your skills in Settings so we can compare your abilities against target roles and identify gaps.
          </p>
          <Button asChild className="bg-[#0D7377] hover:bg-[#0a5c5f]">
            <Link href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Go to Settings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">
            Skill Gap Analysis
          </h1>
          <p className="text-sm text-[#5C5C6D] mt-1">
            Identify and close gaps between your skills and target roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={targetRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[220px] border-[#E8E8E6]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {TARGET_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-[#0D7377] hover:bg-[#0a5c5f]"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze Skills"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#0D7377]">{skills.length}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Skills Tracked</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#FF6B35]">{gaps.length}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Gaps Identified</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#EF4444]">{highPriorityCount}</p>
          <p className="text-xs text-[#5C5C6D] mt-1">High Priority</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#22C55E]">{readinessScore}%</p>
          <p className="text-xs text-[#5C5C6D] mt-1">Overall Readiness</p>
          {readinessScore > 0 && (
            <div className="mx-auto mt-2 w-16 h-1.5 bg-[#E8E8E6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22C55E] rounded-full transition-all"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          )}
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-[#F4F4F2] p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Details</TabsTrigger>
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {matchedSkills.length === 0 && gaps.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-[#5C5C6D]">
                No analysis yet. Select a target role and click{" "}
                <strong>Analyze Skills</strong> to see your skill comparison.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="p-6">
                <h3 className="font-semibold text-[#1A1A2E] mb-4">Skill Radar</h3>
                <SimpleRadarChart data={chartData} />
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

              {/* Matched Skills */}
              <Card className="p-6">
                <h3 className="font-semibold text-[#1A1A2E] mb-4">You&apos;re Strong In</h3>
                {matchedSkills.length > 0 ? (
                  <>
                    <p className="text-sm text-[#5C5C6D] mb-3">
                      {matchedSkills.length} skills match the requirements for {targetRole}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-[#22C55E]/10 text-[#22C55E] text-xs px-3 py-1"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[#5C5C6D]">
                    No matching skills found yet. Run the analysis to see results.
                  </p>
                )}

                {/* Top Priority Gaps */}
                {sortedGaps.filter((g) => getPriorityFromImportance(g.importance) === "HIGH").length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-[#1A1A2E] mb-3 text-sm">Top Priority Gaps</h4>
                    <div className="space-y-2">
                      {sortedGaps
                        .filter((g) => getPriorityFromImportance(g.importance) === "HIGH")
                        .slice(0, 3)
                        .map((gap) => {
                          const gapPct = gap.targetLevel && gap.currentLevel
                            ? Math.round(((gap.targetLevel - gap.currentLevel) / gap.targetLevel) * 100)
                            : 0;
                          return (
                            <div
                              key={gap.skill}
                              className="p-3 rounded-lg border border-[#E8E8E6]"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-[#EF4444]" />
                                  <span className="font-medium text-[#1A1A2E] text-sm">
                                    {gap.skill}
                                  </span>
                                </div>
                                <Badge className="bg-[#EF4444]/10 text-[#EF4444] text-xs">
                                  -{gapPct}%
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[#E8E8E6] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#EF4444] rounded-full"
                                    style={{
                                      width: `${
                                        gap.currentLevel && gap.targetLevel
                                          ? (gap.currentLevel / gap.targetLevel) * 100
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-[#5C5C6D]">
                                  {gap.currentLevel ?? 0}%
                                </span>
                                <span className="text-xs text-[#5C5C6D]">
                                  → {gap.targetLevel ?? 0}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setTab("gaps")}
                    >
                      View All Gaps <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gaps">
          {sortedGaps.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-[#5C5C6D]">
                No gaps identified. Run the analysis to see skill gaps for {targetRole}.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedGaps.map((gap) => {
                const priority = getPriorityFromImportance(gap.importance);
                const gapPct =
                  gap.targetLevel && gap.currentLevel
                    ? Math.round(((gap.targetLevel - gap.currentLevel) / gap.targetLevel) * 100)
                    : 0;
                const progressPct =
                  gap.currentLevel && gap.targetLevel
                    ? (gap.currentLevel / gap.targetLevel) * 100
                    : 0;
                return (
                  <Card key={gap.skill} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1A1A2E]">{gap.skill}</h3>
                          <Badge
                            className={
                              priority === "HIGH"
                                ? "bg-[#EF4444]/10 text-[#EF4444]"
                                : priority === "MEDIUM"
                                ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                                : "bg-[#22C55E]/10 text-[#22C55E]"
                            }
                          >
                            {priority} Priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-[#5C5C6D]">
                                Current: {gap.currentLevel ?? 0}%
                              </span>
                              <span className="text-xs text-[#5C5C6D]">
                                Target: {gap.targetLevel ?? 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-[#E8E8E6] rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-[#0D7377]"
                                style={{ width: `${progressPct}%` }}
                              />
                              <div className="h-full bg-[#E8E8E6] flex-1" />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#EF4444]">-{gapPct}%</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => handleViewRoadmap(gap.skill)}
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Roadmap
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="roadmap">
          {loadingRoadmap ? (
            <Card className="p-8 text-center">
              <p className="text-[#5C5C6D]">Loading roadmap...</p>
            </Card>
          ) : Object.keys(roadmapData).length > 0 ? (
            <div className="space-y-4">
              {sortedGaps.map((gap) => {
                const skillRoadmap = (roadmapData as Record<string, unknown[]>)[gap.skill] || [];
                if (skillRoadmap.length === 0) return null;
                return (
                  <div key={gap.skill} className="border-l-2 border-[#FF6B35] pl-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                      <span className="font-semibold text-[#1A1A2E]">{gap.skill}</span>
                    </div>
                    {skillRoadmap.map((resource: unknown, idx: number) => {
                      const r = resource as Record<string, unknown>;
                      const title = (r.title as string) || `Resource ${idx + 1}`;
                      const platform = (r.platform as string) || "Online";
                      const type = (r.type as string) || "Course";
                      const duration = (r.duration as string) || "Unknown";
                      const url = (r.url as string) || "#";
                      const progress = getResourceProgress(gap.skill, title);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                            <Play className="w-4 h-4 text-[#FF6B35]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1A1A2E] truncate">
                              {title}
                            </p>
                            <p className="text-xs text-[#5C5C6D]">
                              {platform} · {type} · {duration}
                            </p>
                          </div>
                          {progress > 0 ? (
                            <div className="flex items-center gap-2 w-24">
                              <Progress value={progress} className="h-1.5 flex-1" />
                              <span className="text-xs text-[#5C5C6D]">{progress}%</span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild={url !== "#"}
                            >
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                Start
                              </a>
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-[#5C5C6D]">
                Select a skill from the Gap Details tab to view its learning roadmap.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
