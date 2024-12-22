import React from 'react';
import { exportTasks } from '../utils/storage';
import { Task } from '../types/task';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  tasks: Task[];
}

export function ConfirmationModal({ onConfirm, onCancel, tasks }: ConfirmationModalProps) {
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

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p className="text-gray-800 mb-4">
          Are you sure you want to reload? You will lose any unsaved changes.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button onClick={handleExport} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Export
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}