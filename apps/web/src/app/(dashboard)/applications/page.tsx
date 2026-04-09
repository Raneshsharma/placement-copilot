"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { applicationApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  GripVertical,
  Eye,
  Trash2,
  MoreHorizontal,
  Filter,
  ChevronDown,
} from "lucide-react";

const COLUMNS = [
  { id: "applied", label: "Applied", color: "#94A3B8", bg: "bg-[#94A3B8]/10", count: 2 },
  { id: "screening", label: "Screening", color: "#7C6BB2", bg: "bg-[#7C6BB2]/10", count: 1 },
  { id: "interview", label: "Interview", color: "#0D7377", bg: "bg-[#0D7377]/10", count: 2 },
  { id: "assessment", label: "Assessment", color: "#F59E0B", bg: "bg-[#F59E0B]/10", count: 1 },
  { id: "offer", label: "Offer", color: "#22C55E", bg: "bg-[#22C55E]/10", count: 0 },
  { id: "rejected", label: "Rejected", color: "#EF4444", bg: "bg-[#EF4444]/10", count: 1 },
  { id: "ghosted", label: "Ghosted", color: "#6B7280", bg: "bg-[#6B7280]/10", count: 1 },
  { id: "withdrawn", label: "Withdrawn", color: "#9CA3AF", bg: "bg-[#9CA3AF]/10", count: 0 },
];

const APPLICATION_DATA: Record<string, any[]> = {
  applied: [
    { id: "a1", company: "Vercel", logo: "V", role: "DevOps Engineer", location: "Remote", salary: "$120k - $170k", appliedAt: "2026-04-08", match: 83, notes: 0 },
    { id: "a2", company: "Linear", logo: "L", role: "iOS Engineer", location: "Remote", salary: "$115k - $160k", appliedAt: "2026-04-07", match: 76, notes: 1 },
  ],
  screening: [
    { id: "a3", company: "Figma", logo: "F", role: "Full Stack Engineer", location: "San Francisco, CA", salary: "$125k - $175k", appliedAt: "2026-04-04", match: 87, notes: 2 },
  ],
  interview: [
    { id: "a4", company: "Google", logo: "G", role: "Software Engineer II", location: "Mountain View, CA", salary: "$120k - $180k", appliedAt: "2026-04-05", match: 92, notes: 3, interviewDate: "April 11, 2026" },
    { id: "a5", company: "Stripe", logo: "S", role: "Product Manager", location: "San Francisco, CA", salary: "$130k - $190k", appliedAt: "2026-04-07", match: 88, notes: 1, interviewDate: "April 14, 2026" },
  ],
  assessment: [
    { id: "a6", company: "Anthropic", logo: "An", role: "ML Engineer", location: "San Francisco, CA", salary: "$150k - $220k", appliedAt: "2026-04-03", match: 90, notes: 2 },
  ],
  offer: [],
  rejected: [
    { id: "a7", company: "Netflix", logo: "N", role: "Senior Engineer", location: "Los Gatos, CA", salary: "$200k - $350k", appliedAt: "2026-03-28", match: 71, notes: 0 },
  ],
  ghosted: [
    { id: "a8", company: "Robinhood", logo: "R", role: "Android Engineer", location: "Remote", salary: "$110k - $160k", appliedAt: "2026-03-25", match: 78, notes: 1 },
  ],
  withdrawn: [],
};

function AppCard({ app }: { app: any }) {
  return (
    <div className="bg-white rounded-lg border border-[#E8E8E6] p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#E8F6F6] flex items-center justify-center text-[#0D7377] font-bold text-xs flex-shrink-0">
            {app.logo}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#1A1A2E] text-sm truncate">{app.role}</p>
            <p className="text-xs text-[#5C5C6D]">{app.company}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#F4F4F2] transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-[#5C5C6D]" />
        </button>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#5C5C6D] mb-2">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{app.location}</span>
      </div>
      {app.salary && (
        <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium mb-2">
          <DollarSign className="w-3 h-3" />
          {app.salary}
        </div>
      )}
      {app.interviewDate && (
        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-medium mb-2">
          <Calendar className="w-3 h-3" />
          {app.interviewDate}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E8E6]">
        <span className="text-xs text-[#5C5C6D] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)}d ago
        </span>
        <span className="text-xs font-medium" style={{ color: app.match >= 85 ? "#22C55E" : app.match >= 70 ? "#F59E0B" : "#EF4444" }}>
          {app.match}% match
        </span>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggedApp, setDraggedApp] = useState<any>(null);
  const [data, setData] = useState(APPLICATION_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationApi.list()
      .then((res) => {
        const apps = res.data.data ?? res.data ?? [];
        const grouped: Record<string, any[]> = {};
        COLUMNS.forEach((col) => { grouped[col.id] = []; });
        apps.forEach((app: any) => {
          const status = app.status?.toLowerCase() ?? "applied";
          if (grouped[status]) {
            grouped[status].push(app);
          } else {
            grouped.applied.push(app);
          }
        });
        if (apps.length > 0) setData(grouped);
      })
      .catch(() => toast.error("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (colId: string, app: any) => {
    setDraggedApp({ colId, app });
    setActiveColumn(colId);
  };

  const handleDrop = (targetColId: string) => {
    if (!draggedApp || draggedApp.colId === targetColId) {
      setDraggedApp(null);
      setActiveColumn(null);
      return;
    }
    const appId = draggedApp.app.id;
    const targetStatus = targetColId;
    applicationApi.updateStatus(appId, targetStatus).catch(() => {
      toast.error("Failed to update status. Changes may not persist.");
    });
    setData((prev) => {
      const newData = { ...prev };
      newData[draggedApp.colId] = prev[draggedApp.colId].filter((a: any) => a.id !== draggedApp.app.id);
      newData[targetColId] = [...prev[targetColId], { ...draggedApp.app, status: targetStatus }];
      return newData;
    });
    setDraggedApp(null);
    setActiveColumn(null);
  };

  const totalApps = Object.values(data).flat().length;
  const avgMatch = Math.round(Object.values(data).flat().reduce((s, a) => s + a.match, 0) / totalApps);
  const activePipeline = Object.keys(data).filter((k) => data[k].length > 0).length;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Application Tracker</h1>
          <p className="text-sm text-[#5C5C6D] mt-1">
            {totalApps} applications · {avgMatch}% avg match · {activePipeline} active stages
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-[#F4F4F2] rounded-lg p-1">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === "kanban" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-[#5C5C6D]"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === "list" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-[#5C5C6D]"
              }`}
            >
              List
            </button>
          </div>
          <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4F4F2]">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-xs font-medium text-[#5C5C6D]">Offers: 0</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4F4F2]">
          <div className="w-2 h-2 rounded-full bg-[#0D7377]" />
          <span className="text-xs font-medium text-[#5C5C6D]">Interviewing: 2</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4F4F2]">
          <div className="w-2 h-2 rounded-full bg-[#7C6BB2]" />
          <span className="text-xs font-medium text-[#5C5C6D]">Screening: 1</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-[#5C5C6D]">
          <Progress value={(5 / totalApps) * 100} className="w-20 h-1.5" />
          <span>{Math.round((5 / totalApps) * 100)}% response rate</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 rounded-xl p-3 space-y-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          ))
        ) : (
          COLUMNS.map((col) => {
            const apps = data[col.id] || [];
            return (
              <div
                key={col.id}
                className={`flex-shrink-0 w-72 rounded-xl p-3 transition-colors ${
                  activeColumn === col.id ? "ring-2 ring-[#0D7377]/30" : ""
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.bg.replace("/10", "")}`} style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-[#1A1A2E]">{col.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#F4F4F2] text-[#5C5C6D]">{apps.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[100px]">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={() => handleDragStart(col.id, app)}
                    onDragEnd={() => { setDraggedApp(null); setActiveColumn(null); }}
                  >
                    <AppCard app={app} />
                  </div>
                ))}
                {apps.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-[#E8E8E6] rounded-lg flex items-center justify-center">
                    <p className="text-xs text-[#9B9BAA]">Drop here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
