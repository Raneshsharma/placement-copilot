"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Clock, Grid, List, Heart, Zap, Building2, Globe, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_ROLES = [
  { id: "r1", company: "Google", logo: "G", role: "Software Engineer", location: "Mountain View, CA", salary: "$120k - $180k", postedAt: "2 days ago", match: 92, skills: ["Python", "Go", "Distributed Systems"], type: "Full-time" },
  { id: "r2", company: "Stripe", logo: "S", role: "Product Manager", location: "San Francisco, CA", salary: "$130k - $190k", postedAt: "1 day ago", match: 88, skills: ["Product Strategy", "Data Analysis", "SQL"], type: "Full-time" },
  { id: "r3", company: "Notion", logo: "N", role: "Senior Designer", location: "Remote", salary: "$100k - $150k", postedAt: "3 days ago", match: 85, skills: ["Figma", "Design Systems", "Prototyping"], type: "Full-time" },
  { id: "r4", company: "Meta", logo: "M", role: "Frontend Engineer", location: "Menlo Park, CA", salary: "$110k - $160k", postedAt: "5 days ago", match: 91, skills: ["React", "TypeScript", "CSS"], type: "Full-time" },
  { id: "r5", company: "Airbnb", logo: "A", role: "Data Scientist", location: "Remote", salary: "$115k - $165k", postedAt: "1 week ago", match: 82, skills: ["Python", "Machine Learning", "SQL"], type: "Full-time" },
  { id: "r6", company: "Spotify", logo: "Sp", role: "Backend Engineer", location: "New York, NY", salary: "$105k - $155k", postedAt: "4 days ago", match: 79, skills: ["Java", "Kubernetes", "AWS"], type: "Full-time" },
  { id: "r7", company: "Figma", logo: "F", role: "Full Stack Engineer", location: "San Francisco, CA", salary: "$125k - $175k", postedAt: "6 days ago", match: 87, skills: ["React", "Node.js", "GraphQL"], type: "Full-time" },
  { id: "r8", company: "Linear", logo: "L", role: "iOS Engineer", location: "Remote", salary: "$115k - $160k", postedAt: "2 weeks ago", match: 76, skills: ["Swift", "SwiftUI", "Combine"], type: "Full-time" },
  { id: "r9", company: "Vercel", logo: "V", role: "DevOps Engineer", location: "Remote", salary: "$120k - $170k", postedAt: "3 days ago", match: 83, skills: ["Next.js", "Docker", "Terraform"], type: "Full-time" },
  { id: "r10", company: "Anthropic", logo: "An", role: "ML Engineer", location: "San Francisco, CA", salary: "$150k - $220k", postedAt: "1 day ago", match: 90, skills: ["PyTorch", "LLMs", "Python"], type: "Full-time" },
];

const FILTERS = [
  { label: "90%+ Match", icon: Zap },
  { label: "Remote", icon: Globe },
  { label: "Student", icon: Briefcase },
  { label: "Entry Level", icon: Building2 },
  { label: ">$80k", icon: DollarSign },
];

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedRoles, setSavedRoles] = useState<string[]>([]);

  const toggleFilter = (label: string) => {
    setActiveFilters((prev) => prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]);
  };

  const toggleSave = (id: string) => {
    setSavedRoles((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const filteredRoles = MOCK_ROLES.filter((role) => {
    if (searchQuery && !role.role.toLowerCase().includes(searchQuery.toLowerCase()) && !role.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Discover Roles</h1>
        <p className="text-text-secondary mt-1">Find opportunities that match your skills and goals</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <Input
          placeholder="Search roles, companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => toggleFilter(filter.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilters.includes(filter.label)
                ? "bg-[#0D7377] text-white"
                : "bg-white border border-[#E8E8E6] text-text-secondary hover:border-[#0D7377]/30"
            }`}
          >
            <filter.icon className="w-3.5 h-3.5" />
            {filter.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 bg-[#F4F4F2] rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-[#0D7377]" : "text-text-tertiary"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#0D7377]" : "text-text-tertiary"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-tertiary mb-4">{filteredRoles.length} roles found</p>

      {/* Role Cards */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {filteredRoles.map((role) => (
          <Card key={role.id} className={`p-4 hover:shadow-md transition-shadow ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
            {viewMode === "grid" ? (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-sm">
                    {role.logo}
                  </div>
                  <Badge variant="success" className="text-xs">{role.match}%</Badge>
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{role.role}</h3>
                <p className="text-sm text-text-secondary mb-2">{role.company}</p>
                <div className="flex items-center gap-1 text-xs text-text-tertiary mb-1">
                  <MapPin className="w-3 h-3" />
                  {role.location}
                </div>
                {role.salary && (
                  <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium mb-3">
                    <DollarSign className="w-3 h-3" />
                    {role.salary}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {role.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-[#F4F4F2] text-text-secondary">{skill}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSave(role.id)}
                    className="p-1.5 rounded-md hover:bg-[#F4F4F2] transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${savedRoles.includes(role.id) ? "fill-[#EF4444] text-[#EF4444]" : "text-text-tertiary"}`} />
                  </button>
                  <Link href={`/roles/${role.id}`}>
                    <Button variant="accent" size="sm">Quick Apply</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-sm flex-shrink-0">
                  {role.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary">{role.role}</h3>
                    <Badge variant="success" className="text-xs">{role.match}%</Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{role.company} &bull; {role.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleSave(role.id)} className="p-1.5 rounded-md hover:bg-[#F4F4F2]">
                    <Heart className={`w-4 h-4 ${savedRoles.includes(role.id) ? "fill-[#EF4444] text-[#EF4444]" : "text-text-tertiary"}`} />
                  </button>
                  <Link href={`/roles/${role.id}`}><Button variant="accent" size="sm">Apply</Button></Link>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
