import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Task } from '../types/task';
import { exportTasks, importTasks } from '../utils/storage';

interface ImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function ImportExport({ tasks, onImport }: ImportExportProps) {
  const handleExport = () => {
    const json = exportTasks(tasks);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tasks = importTasks(e.target?.result as string);
          onImport(tasks);
        } catch (error) {
          alert('Error importing tasks: Invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        title="Export tasks"
      >
        <Download size={16} />
        Export
      </button>
      <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
        <Upload size={16} />
        Import
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
