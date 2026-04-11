"use client";

import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/applications/kanban-board";
import { useApplicationStore } from "@/stores/application-store";
import { applicationApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { AddApplicationModal } from "@/components/applications/add-application-modal";

export default function ApplicationsPage() {
  const { columns, setApplications, isLoading, setLoading } = useApplicationStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    applicationApi.getAll()
      .then((res) => {
        const apps = res.data.data ?? res.data ?? [];
        if (Array.isArray(apps) && apps.length > 0) {
          setApplications(apps);
        }
      })
      .catch(() => {
        toast.error("Failed to load applications. Using cached data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalApps = columns.reduce((sum, col) => sum + col.apps.length, 0);
  const avgMatch = totalApps > 0
    ? Math.round(columns.reduce((sum, col) => sum + col.apps.reduce((s, a) => s + (a.match || 0), 0), 0) / totalApps)
    : 0;

  const responseCount = columns.reduce((sum, col) => {
    if (["UNDER_REVIEW", "INTERVIEW", "OFFERED"].includes(col.id)) {
      return sum + col.apps.length;
    }
    return sum;
  }, 0);
  const responseRate = totalApps > 0 ? Math.round((responseCount / totalApps) * 100) : 0;

  const handleCardClick = (id: string) => {
    console.log("Application clicked:", id);
    toast.info("Detail view coming soon");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Application Tracker</h1>
          <p className="text-text-secondary mt-1">
            {totalApps} applications &middot; {avgMatch}% avg match &middot; {responseRate}% response rate
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />Add
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 rounded-xl p-3 space-y-2">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard onCardClick={handleCardClick} onAddClick={() => setShowAddModal(true)} />
      )}

      <AddApplicationModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
