import React from 'react';
import { CheckSquare, Settings, Download, Upload } from 'lucide-react';
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
        <div className="import-export-buttons flex gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="import-export-button flex items-center gap-2 px-3 py-2..."
            title="Export tasks"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="import-export-button flex items-center gap-2 px-3 py-2..."
            title="Import tasks"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
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