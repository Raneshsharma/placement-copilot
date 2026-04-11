"use client";

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { StatusColumn } from "./status-column";
import { KANBAN_COLUMNS } from "@/stores/application-store";
import { useApplicationStore } from "@/stores/application-store";
import { applicationApi } from "@/lib/api";
import { toast } from "sonner";

interface KanbanBoardProps {
  initialColumns?: typeof KANBAN_COLUMNS;
  onCardClick?: (id: string) => void;
  onAddClick?: () => void;
}

export function KanbanBoard({ initialColumns, onCardClick, onAddClick }: KanbanBoardProps) {
  const columns = initialColumns || KANBAN_COLUMNS;
  const { columns: storeColumns, moveApplication } = useApplicationStore();

  const displayColumns = storeColumns.length > 0 ? storeColumns : columns.map((col) => ({ ...col, apps: [] as any[] }));

  const handleDragStart = (result: any) => {
    // drag started — visual feedback handled by react-beautiful-dnd
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const fromCol = displayColumns.find((c) => c.id === source.droppableId);
    const toCol = displayColumns.find((c) => c.id === destination.droppableId);
    if (!fromCol || !toCol) return;

    const app = fromCol.apps.find((a) => a.id === draggableId);
    if (!app) return;

    moveApplication(draggableId, source.droppableId as any, destination.droppableId as any);

    applicationApi.update(app.id, { status: destination.droppableId })
      .catch(() => {
        toast.error("Couldn't update — tap to retry");
      });
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-6">
        {displayColumns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <StatusColumn
                id={col.id}
                label={col.label}
                color={col.color}
                apps={col.apps}
                isDragOver={snapshot.isDraggingOver}
                onDrop={() => {}}
                onAdd={onAddClick}
                onCardClick={onCardClick}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
