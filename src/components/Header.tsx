import React, { useState } from 'react';
import { CheckSquare, Settings, Shield, Download, Upload } from 'lucide-react';
import { Task } from '../types/task';
import { ExportModal } from './ExportModal';
import { ThemeSwitcher } from './ThemeSwitcher'; // Import ThemeSwitcher

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
    <div className="navbar bg-base-100 shadow-md mb-4 sm:mb-8">
      <div className="navbar-start">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
          <CheckSquare size={32} className="text-primary" />
          <span className="text-xl sm:text-2xl font-semibold text-base-content">Task List Advanced</span>
        </div>
      </div>
      <div className="navbar-end">
        <button
          onClick={() => setShowExportModal(true)}
          className="btn btn-ghost btn-sm"
          title="Export tasks"
        >
          <Download size={16} />
          Export
        </button>
        <button
          onClick={handleImport}
          className="btn btn-ghost btn-sm"
          title="Import tasks"
        >
          <Upload size={16} />
          Import
        </button>
        {isAdmin && (
          <button
            onClick={onAdminClick}
            className="btn btn-ghost btn-sm"
            title="Admin Dashboard"
          >
            <Shield size={16} />
            Admin
          </button>
        )}
        <ThemeSwitcher /> {/* Add ThemeSwitcher here */}
        <button
          onClick={onSettingsClick}
          className="btn btn-ghost btn-circle"
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