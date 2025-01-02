import React from 'react';
import { CheckSquare, Settings } from 'lucide-react';
import { ImportExport } from './ImportExport';
import { Task } from '../types/task';

interface HeaderProps {
  onLogoClick: () => void;
  onSettingsClick: () => void;
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function Header({ onLogoClick, onSettingsClick, tasks, onImport }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
        <CheckSquare size={32} className="text-blue-500" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Task List Advanced</h1>
      </div>
      <div className="flex items-center gap-2">
        <ImportExport tasks={tasks} onImport={onImport} />
        <button
          onClick={onSettingsClick}
          className="text-gray-400 hover:text-gray-600"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
} 