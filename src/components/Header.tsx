import React, { useState } from 'react';
import { CheckSquare, Settings, Download, Upload } from 'lucide-react';
import { Task } from '../types/task';

interface HeaderProps {
  onLogoClick: () => void;
  onSettingsClick: () => void;
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function Header({ onLogoClick, onSettingsClick, tasks, onImport }: HeaderProps) {
  const handleExport = () => {
    const dataStr = JSON.stringify({ data: tasks }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tasks.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);
            if (parsed.data) {
              onImport(parsed.data);
            }
          } catch (error) {
            console.error('Error parsing imported file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
        <CheckSquare size={32} className="text-blue-500" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Task List Advanced</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="import-export-buttons flex gap-2">
          <button
            onClick={handleExport}
            className="import-export-button flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Export tasks"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleImport}
            className="import-export-button flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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