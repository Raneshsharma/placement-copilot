"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  MapPin,
  DollarSign,
  Building2,
  Users,
  TrendingUp,
  Heart,
  Star,
} from "lucide-react";

const roles: Record<string, any> = {
  "1": {
    company: "Google",
    role: "Software Engineer II",
    location: "Mountain View, CA",
    salary: "$120,000 – $180,000",
    match: 85,
    description: `We're looking for a Software Engineer II to join our Core Infrastructure team. You'll design, build, and maintain highly scalable systems that power Google's products for billions of users.

In this role, you'll work on distributed systems, optimize performance bottlenecks, and collaborate with cross-functional teams to deliver impactful solutions.`,
    requirements: [
      { name: "Python", required: true },
      { name: "System Design", required: true },
      { name: "Algorithms", required: true },
      { name: "Distributed Systems", required: false },
      { name: "Go", required: false },
    ],
    benefits: ["Health Insurance", "401k Match", "Unlimited PTO", "Remote Work", "Learning Budget", "Gym Membership"],
    skills: ["Python", "System Design", "Algorithms"],
    whyMatch: ["Strong algorithmic background from your CS degree", "5+ projects using distributed systems", "Proficiency in Python matches their stack"],
  },
};

function PPSRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 50;
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle cx="64" cy="64" r="50" fill="none" stroke="#E8E8E6" strokeWidth="8" />
        <circle cx="64" cy="64" r="50" fill="none" stroke="#0D7377" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#1A1A2E]">{score}%</span>
        <span className="text-xs text-[#5C5C6D]">Match</span>
      </div>
    </div>
  );
}

export default function RoleDetailPage() {
  const params = useParams();
  const roleId = params.roleId as string;
  const role = roles[roleId] || roles["1"];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-[#F4F4F2] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#5C5C6D]" />
        </button>
        <div className="h-12 w-12 rounded-full bg-[#7C6BB2]/10 flex items-center justify-center font-bold text-[#7C6BB2] text-lg">
          {role.company[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display text-[#1A1A2E]">{role.role}</h1>
          <p className="text-sm text-[#5C5C6D]">{role.company}</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-[#F4F4F2]">
          <Share2 className="w-5 h-5 text-[#5C5C6D]" />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#FEF2F2]">
          <Bookmark className="w-5 h-5 text-[#5C5C6D]" />
        </button>
      </div>

      {/* Match Score + Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center">
          <PPSRing score={role.match} />
          <p className="text-sm text-[#5C5C6D] mt-2">Your match score</p>
        </Card>
        <Card className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#5C5C6D]" /> {role.location}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#0D7377]">
            <DollarSign className="w-4 h-4" /> {role.salary}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-[#5C5C6D]" /> {role.company}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[#5C5C6D]" /> 10,000+ employees
          </div>
        </Card>
        <Card className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[#5C5C6D]" /> Founded 1998
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-[#F59E0B]" /> 4.5 rating on Glassdoor
          </div>
          <Badge className="bg-[#E8F6F6] text-[#0D7377] w-fit">Fortune 100</Badge>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="salary">Salary & Benefits</TabsTrigger>
          <TabsTrigger value="prep">Application Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold font-display mb-3">About the Role</h2>
            <div className="prose prose-sm text-[#5C5C6D] space-y-3">
              {role.description.split("\n\n").map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display mb-3">Why You Match</h2>
            <ul className="space-y-2">
              {role.whyMatch.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#5C5C6D]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold font-display mb-3">Required Skills</h2>
            <div className="space-y-2">
              {role.requirements.filter((r: any) => r.required).map((req: any) => (
                <div key={req.name} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8E8E6]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#1A1A2E]">{req.name}</span>
                  <Badge className="ml-auto bg-[#EF4444]/10 text-[#EF4444] text-xs">Required</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display mb-3">Nice to Have</h2>
            <div className="space-y-2">
              {role.requirements.filter((r: any) => !r.required).map((req: any) => (
                <div key={req.name} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8E8E6]">
                  <Heart className="w-4 h-4 text-[#7C6BB2]" />
                  <span className="text-sm font-medium text-[#1A1A2E]">{req.name}</span>
                  <Badge className="ml-auto bg-[#7C6BB2]/10 text-[#7C6BB2] text-xs">Differentator</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <div className="text-center p-6 bg-[#E8F6F6] rounded-xl">
            <p className="text-3xl font-bold text-[#0D7377]">{role.salary}</p>
            <p className="text-sm text-[#5C5C6D] mt-1">Base salary per year</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display mb-3">Benefits</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {role.benefits.map((b: string) => (
                <div key={b} className="flex items-center gap-2 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E6]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prep" className="space-y-6">
          <Card className="p-4 bg-[#FFF0EB] border-[#FF6B35]/20">
            <h3 className="font-semibold text-[#1A1A2E] mb-2">AI Application Tips</h3>
            <ul className="space-y-1.5 text-sm text-[#5C5C6D]">
              <li>• Emphasize your experience with large-scale distributed systems</li>
              <li>• Prepare to discuss a time you optimized a system under load</li>
              <li>• Know Google's cultural values: Focus on the user, move fast</li>
            </ul>
          </Card>
          <div>
            <h3 className="font-semibold mb-2">Resume Match</h3>
            <div className="flex items-center gap-4 mb-2">
              <Progress value={role.match} className="flex-1 h-2" />
              <span className="text-sm font-bold text-[#0D7377]">{role.match}%</span>
            </div>
            <p className="text-xs text-[#5C5C6D]">Your resume covers {role.match}% of this role's keywords</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Application Checklist</h3>
            {["Resume tailored for this role", "Cover letter drafted", "GitHub/portfolio reviewed", "STAR stories prepared", "System design review"].map((item) => (
              <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8E8E6] cursor-pointer hover:bg-[#FAFAF8]">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E8E8E6] accent-[#0D7377]" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
          <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 text-lg font-semibold">
            Apply Now — {role.company}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
