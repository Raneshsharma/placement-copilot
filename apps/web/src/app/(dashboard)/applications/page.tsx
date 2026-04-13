"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useApplicationsStore } from "@/stores/applications-store";
import { GmailConnectBanner } from "@/components/applications/gmail-connect-banner";
import { MetricsDashboard } from "@/components/applications/metrics-dashboard";
import { ApplicationCard } from "@/components/applications/application-card";
import { ApplicationDrawer } from "@/components/applications/application-drawer";
import { ReviewQueue, ReviewQueueModal } from "@/components/applications/review-queue";
import { KANBAN_COLUMNS } from "@/types/application";
import type { Application, AppStatus } from "@/types/application";
import styles from "./applications.module.css";

export default function ApplicationsPage() {
  const {
    applications,
    gmailConnection,
    selectedAppId,
    drawerOpen,
    reviewQueue,
    isSyncing,
    isLoading,
    loadMockData,
    setSelectedApp,
    setDrawerOpen,
    moveApplication,
    acceptReviewQueueApp,
    dismissReviewQueueApp,
    addNoteToApp,
    getStats,
  } = useApplicationsStore();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [gmailMode, setGmailMode] = useState<'connected' | 'unconnected' | 'manual'>('connected');

  const stats = getStats();
  const selectedApp = applications.find(a => a.id === selectedAppId) ?? null;

  useEffect(() => {
    loadMockData();
  }, []);

  useEffect(() => {
    if (reviewQueue.length > 0 && !showReviewModal) {
      setShowReviewModal(true);
    }
  }, [reviewQueue.length]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as AppStatus;
    moveApplication(draggableId, newStatus);
    toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
  };

  const handleCardClick = (id: string) => {
    setSelectedApp(id);
  };

  const handleMenuAction = (action: string, id: string) => {
    toast.info(`Action: ${action} on ${id}`);
  };

  const handleAddNote = (content: string) => {
    if (!selectedAppId) return;
    addNoteToApp(selectedAppId, {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
    });
    toast.success("Note added");
  };

  // Gmail not connected
  if (gmailMode === 'unconnected') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Application Tracker</h1>
            <p className={styles.pageSubtitle}>Smart tracking powered by your Gmail inbox</p>
          </div>
        </div>
        <GmailConnectBanner
          onConnect={() => setGmailMode('connected')}
          onManualMode={() => setGmailMode('manual')}
        />
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Application Tracker</h1>
          </div>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <h3 className={styles.loadingTitle}>Reading your emails...</h3>
          <p className={styles.loadingText}>Scanning for job applications. This takes a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Application Tracker</h1>
          <p className={styles.pageSubtitle}>Smart tracking powered by your Gmail inbox</p>
        </div>
        {gmailConnection && (
          <div className={styles.gmailBadge}>
            <span>📧</span>
            {gmailConnection.email}
            {isSyncing && <div className={styles.syncSpinner} />}
          </div>
        )}
      </div>

      {/* Metrics */}
      <MetricsDashboard
        stats={stats}
        isSyncing={isSyncing}
        lastSyncedAt={gmailConnection?.lastSyncedAt}
        onSync={() => toast.info("Sync triggered (mock)")}
      />

      {/* Review queue banner */}
      {reviewQueue.length > 0 && !showReviewModal && (
        <ReviewQueue
          apps={reviewQueue}
          onAccept={(id) => acceptReviewQueueApp(id)}
          onDismiss={(id) => dismissReviewQueueApp(id)}
        />
      )}

      {/* Main content */}
      <div className={styles.mainContent}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.kanbanBoard}>
            {KANBAN_COLUMNS.map((column) => {
              const columnApps = applications.filter(a => a.status === column.id);
              return (
                <div key={column.id} className={styles.kanbanColumn}>
                  <div className={styles.kanbanColumnHeader}>
                    <div className={styles.kanbanColumnDot} style={{ backgroundColor: column.color }} />
                    <span className={styles.kanbanColumnTitle}>{column.label}</span>
                    <span className={styles.kanbanColumnCount}>{columnApps.length}</span>
                    <button className={styles.kanbanColumnAdd} title="Add application">
                      <Plus size={14} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${styles.kanbanColumnBody} ${snapshot.isDraggingOver ? styles.columnDragOver : ''}`}
                      >
                        {columnApps.length === 0 ? (
                          <div className={styles.kanbanColumnEmpty}>
                            <span>Empty</span>
                          </div>
                        ) : (
                          columnApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ApplicationCard
                                    app={app}
                                    onClick={handleCardClick}
                                    onMenuAction={handleMenuAction}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Detail drawer */}
      {drawerOpen && selectedApp && (
        <ApplicationDrawer
          app={selectedApp}
          onClose={() => setDrawerOpen(false)}
          onAddNote={handleAddNote}
        />
      )}

      {/* Review modal */}
      {showReviewModal && reviewQueue.length > 0 && (
        <ReviewQueueModal
          apps={reviewQueue}
          onAccept={(id) => { acceptReviewQueueApp(id); }}
          onDismiss={(id) => { dismissReviewQueueApp(id); }}
        />
      )}
    </div>
  );
}