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
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }) => void;
  onReorder: (tasks: Task[]) => void;
  onCheckAllSubTasks: (headlineId: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder, onCheckAllSubTasks }: TaskListProps) {
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
          {tasks.map((task, index) => {
            const previousTask = tasks[index - 1];
            const isIndented = !task.isHeadline;

            return (
              <DraggableTaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                isIndented={isIndented}
                onCheckAllSubTasks={task.isHeadline ? onCheckAllSubTasks : undefined}
                tasks={tasks}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
