import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TaskItem } from './TaskItem'; // Assumed TaskItem and its children (TaskDisplay, TaskEditForm) are refactored
import { Task } from '../types/task';

interface DraggableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean, isHeadline?: boolean) => void;
  onDuplicate: (id: string) => void;
  hasHeadlines: boolean; // To determine if indentation logic applies
  onCheckAllSubTasks?: (headlineId: string) => void;
  tasks: Task[]; // Full list of tasks for context (e.g., subtask checking)
}

export function DraggableTaskItem({ task, onToggle, onDelete, onEdit, onDuplicate, hasHeadlines, onCheckAllSubTasks, tasks }: DraggableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Provides visual feedback during drag
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined, // Ensure transition is not null
    // Applying a subtle shadow or scale effect when dragging for better UX
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' : undefined,
    // zIndex: isDragging ? 50 : undefined, // daisyUI z-index classes can also be used if preferred
  };

  // Determine if the task should be indented (is a sub-task and not a headline itself)
  // Basic indentation logic: if headlines exist and this task is not a headline, indent it.
  // More sophisticated logic would involve checking parent-child relationships if tasks are nested.
  // For now, `ml-0` or `ml-6` (or `pl-6` on the TaskItem container if drag handle is outside)
  const isIndented = hasHeadlines && !task.isHeadline;

  return (
    <div
      ref={setNodeRef}
      style={style}
      // Apply z-index when dragging to ensure it appears above other items.
      // The `indent` class needs to be defined in global CSS or replaced with daisyUI/Tailwind utility.
      // For daisyUI, padding `pl-6` or margin `ml-6` on the inner content (excluding handle) is better.
      className={`draggable-item-container relative ${isDragging ? 'z-50 opacity-90' : ''}`}
    >
      <div className={`flex items-start group ${isIndented ? 'ml-4 sm:ml-6' : ''}`}> {/* items-start for better alignment if TaskItem content varies in height */}
        <div
          {...attributes}
          {...listeners}
          // Styling the drag handle: subtle, visible on hover of the item or always if preferred.
          // `btn btn-ghost btn-square btn-xs` could make it look like a button.
          // For a more minimal handle, direct padding and hover effects are fine.
          className="p-2 cursor-grab active:cursor-grabbing text-base-content/50 hover:text-primary transition-colors touch-none flex items-center h-full" // Added touch-none
          aria-label="Drag task to reorder"
        >
          <GripVertical size={20} /> {/* Slightly larger icon */}
        </div>
        <div className="flex-1 overflow-hidden"> {/* overflow-hidden if TaskItem content might exceed boundaries */}
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onCheckAllSubTasks={onCheckAllSubTasks}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}