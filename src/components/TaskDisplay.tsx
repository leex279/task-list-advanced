import React, { useState } from 'react';
import { Check, Trash2, Edit2, CheckSquare, AlignLeft } from 'lucide-react';
import { Task } from '../types/task';
import { CodeBlock } from './code/CodeBlock';
import { TaskText } from './TaskText';
import { DescriptionModal } from './DescriptionModal';

interface TaskDisplayProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onCheckAllSubTasks?: (headlineId: string) => void;
  tasks: Task[];
}

export function TaskDisplay({ task, onToggle, onEdit, onDelete, onCheckAllSubTasks, tasks }: TaskDisplayProps) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  if (task.isHeadline) {
    const isAllSubTasksCompleted = (tasks: Task[]) => {
      let allCompleted = true;
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        if (t.isHeadline) continue;
        let j = i - 1;
        while (j >= 0 && !tasks[j].isHeadline) {
          j--;
        }
        if (j >= 0 && tasks[j].id === task.id) {
          if (!t.completed) {
            allCompleted = false;
            break;
          }
        }
      }
      return allCompleted;
    };

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm group">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCheckAllSubTasks?.(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isAllSubTasksCompleted(tasks) ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {isAllSubTasksCompleted(tasks) && <Check size={14} className="text-white" />}
          </button>
          <h2 className="flex-1 text-xl font-semibold text-gray-900">
            {task.text}
            {task.optional && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-gray-600 bg-yellow-200 rounded-md optional-badge">
                Optional
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.richText && (
              <button
                onClick={() => setShowDescriptionModal(true)}
                className="text-blue-400 hover:text-blue-500 transition-colors"
                title="Show detailed description"
              >
                <AlignLeft size={18} />
              </button>
            )}
            <button
              onClick={() => onEdit()}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            {onCheckAllSubTasks && (
              <button
                onClick={() => onCheckAllSubTasks(task.id)}
                className="text-gray-400 hover:text-green-500 transition-colors"
                title="Check all subtasks"
              >
                <CheckSquare size={18} />
              </button>
            )}
          </div>
        </div>
        {showDescriptionModal && (
          <DescriptionModal
            content={task.richText || ''}
            onClose={() => setShowDescriptionModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm group">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-2">
            <TaskText text={task.text} completed={task.completed} />
            {task.optional && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-gray-600 bg-yellow-200 rounded-md optional-badge">
                Optional
              </span>
            )}
            {task.richText && (
              <button
                onClick={() => setShowDescriptionModal(true)}
                className="text-blue-400 hover:text-blue-500 transition-colors"
                title="Show detailed description"
              >
                <AlignLeft size={18} />
              </button>
            )}
          </div>
          {task.codeBlock && task.codeBlock.code.trim() && (
            <div className="mt-2">
              <CodeBlock
                code={task.codeBlock.code}
                language={task.codeBlock.language}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit()}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
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
  );
}
