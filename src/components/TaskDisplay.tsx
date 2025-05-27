import React, { useState } from 'react';
import { Check, Trash2, Edit2, CheckSquare, AlignLeft, Copy } from 'lucide-react';
import { Task } from '../types/task';
import { CodeBlock } from './code/CodeBlock';
import { TaskText } from './TaskText';
import { DescriptionModal } from './DescriptionModal'; // Assuming DescriptionModal will also be styled

interface TaskDisplayProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCheckAllSubTasks?: (headlineId: string) => void;
  tasks: Task[];
}

export function TaskDisplay({ task, onToggle, onEdit, onDelete, onDuplicate, onCheckAllSubTasks, tasks }: TaskDisplayProps) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Helper to determine if all subtasks of a headline are completed
  const isAllSubTasksCompleted = (headlineId: string, allTasks: Task[]): boolean => {
    if (!onCheckAllSubTasks) return false; // Only relevant if the handler exists

    // Find the index of the current headline
    const headlineIndex = allTasks.findIndex(t => t.id === headlineId);
    if (headlineIndex === -1) return false;

    // Iterate through tasks that appear after this headline
    // until the next headline or end of list
    for (let i = headlineIndex + 1; i < allTasks.length; i++) {
      const subtask = allTasks[i];
      if (subtask.isHeadline) break; // Stop if we hit another headline
      if (!subtask.completed) return false; // Found an incomplete subtask
    }
    return true; // All subtasks (if any) are completed
  };


  if (task.isHeadline) {
    const allSubtasksDone = isAllSubTasksCompleted(task.id, tasks);
    return (
      <div className="card bg-base-200 shadow-md mb-4 group"> {/* Headline tasks with a slightly different bg */}
        <div className="card-body p-4">
          <div className="flex items-center gap-3">
            {onCheckAllSubTasks && (
               <input
                 type="checkbox"
                 checked={allSubtasksDone}
                 onChange={() => onCheckAllSubTasks(task.id)}
                 className="checkbox checkbox-primary checkbox-sm"
                 title={allSubtasksDone ? "Uncheck all subtasks" : "Check all subtasks"}
               />
            )}
            <h2 className={`flex-1 text-xl font-semibold ${allSubtasksDone ? 'line-through text-neutral-content' : 'text-base-content'}`}>
              {task.text}
              {task.optional && (
                <span className="badge badge-sm badge-outline badge-warning ml-2 align-middle">
                  Optional
                </span>
              )}
            </h2>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.richText && (
                <button
                  onClick={() => setShowDescriptionModal(true)}
                  className="btn btn-ghost btn-xs text-info"
                  title="Show detailed description"
                >
                  <AlignLeft size={16} />
                </button>
              )}
              <button
                onClick={() => onDuplicate(task.id)}
                className="btn btn-ghost btn-xs"
                title="Duplicate task"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={onEdit}
                className="btn btn-ghost btn-xs text-secondary"
                title="Edit task"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="btn btn-ghost btn-xs text-error"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {showDescriptionModal && (
            <DescriptionModal
              content={task.richText || ''}
              onClose={() => setShowDescriptionModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Regular task display
  return (
    <div className="card bg-base-100 shadow-lg mb-4 group">
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="checkbox checkbox-primary checkbox-sm mt-1"
          />
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2">
              <TaskText text={task.text} completed={task.completed} /> {/* TaskText might need its own styling review */}
              {task.optional && (
                <span className="badge badge-sm badge-outline badge-warning ml-2 align-middle">
                  Optional
                </span>
              )}
              {task.richText && (
                <button
                  onClick={() => setShowDescriptionModal(true)}
                  className="btn btn-ghost btn-xs text-info opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Show detailed description"
                >
                  <AlignLeft size={16} />
                </button>
              )}
            </div>
            {task.codeBlock && task.codeBlock.code && (
              <div className="mt-2 rounded-md overflow-hidden"> {/* Ensure CodeBlock fits well */}
                <CodeBlock
                  code={task.codeBlock.code}
                  language={task.codeBlock.language}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDuplicate(task.id)}
              className="btn btn-ghost btn-xs"
              title="Duplicate task"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={onEdit}
              className="btn btn-ghost btn-xs text-secondary"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-ghost btn-xs text-error"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {showDescriptionModal && (
          <DescriptionModal
            content={task.richText || ''}
            onClose={() => setShowDescriptionModal(false)}
          />
        )}
      </div>
    </div>
  );
}