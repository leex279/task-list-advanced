import React from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../types/task';
import { DraggableTaskItem } from './DraggableTaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }, richText?: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  onCheckAllSubTasks: (headlineId: string) => void;
  selectedTaskId?: string | null;
  onSelectTask?: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onEdit, onDuplicate, onReorder, onCheckAllSubTasks, selectedTaskId, onSelectTask }: TaskListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);
      
      onReorder(newTasks);
    }
  };

  const hasHeadlines = tasks.some((task) => task.isHeadline);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tasks.map((task) => (
            <DraggableTaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              hasHeadlines={hasHeadlines}
              onCheckAllSubTasks={task.isHeadline ? onCheckAllSubTasks : undefined}
              tasks={tasks}
              isSelected={selectedTaskId === task.id}
              onSelect={onSelectTask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}