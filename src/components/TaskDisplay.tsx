import React from 'react';
import { Check, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../types/task';
import { CodeBlock } from './code/CodeBlock';
import { TaskText } from './TaskText';

interface TaskDisplayProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function TaskDisplay({ task, onToggle, onEdit, onDelete }: TaskDisplayProps) {
  if (task.isHeadline) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm group">
        <div className="flex items-center gap-3">
          <h2 className="flex-1 text-xl font-semibold text-gray-900">{task.text}</h2>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
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
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm group">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>
        <TaskText text={task.text} completed={task.completed} />
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
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
      
      {task.codeBlock && (
        <CodeBlock
          code={task.codeBlock.code}
          language={task.codeBlock.language}
        />
      )}
    </div>
  );
}
