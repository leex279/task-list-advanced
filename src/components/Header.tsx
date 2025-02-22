import React, { useState } from 'react';
import { CheckSquare, Settings, Shield, Download, Upload } from 'lucide-react';
import { Task } from '../types/task';
import { ExportModal } from './ExportModal';

interface HeaderProps {
  onLogoClick: () => void;
  onSettingsClick: () => void;
  onAdminClick: () => void;
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
  isAdmin?: boolean;
}

export function Header({ onLogoClick, onSettingsClick, onAdminClick, tasks, onImport, isAdmin }: HeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = (name: string) => {
    const dataStr = JSON.stringify({ name, data: tasks }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${sanitizedName}.json`);
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
            onClick={() => setShowExportModal(true)}
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
        {isAdmin && (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Admin Dashboard"
          >
            <Shield size={16} />
            Admin
          </button>
        )}
        <button
          onClick={onSettingsClick}
          className="text-gray-400 hover:text-gray-600"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
}