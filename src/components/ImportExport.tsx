import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Task } from '../types/task';
import { exportTasks } from '../utils/storage';
import { ImportModal } from './ImportModal';

interface ImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function ImportExport({ tasks, onImport }: ImportExportProps) {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = () => {
    const name = prompt('Enter a name for the task list:', 'My Task List');
    
    // Return early if user clicks Cancel or enters empty name
    if (!name) return;

    const json = exportTasks(tasks, name);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      <button
        onClick={() => setShowImportModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        title="Import tasks"
      >
        <Upload size={16} />
        Import
      </button>
      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} onImport={onImport} />
      )}
    </div>
  );
}
