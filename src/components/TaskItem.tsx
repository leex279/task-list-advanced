import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Task } from '../types/task';
import { TaskDisplay } from './TaskDisplay';
import { TaskEditForm } from './TaskEditForm';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <TaskEditForm
        task={task}
        onSave={(text, codeBlock) => {
          onEdit(task.id, text, codeBlock);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <TaskDisplay
      task={task}
      onToggle={onToggle}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
}
