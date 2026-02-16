import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { exportTasks } from '../utils/storage';
import { Task } from '../types/task';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  tasks: Task[];
}

export function ConfirmationModal({ onConfirm, onCancel, tasks }: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-modal w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Confirm Action</h2>
          <button
            onClick={onCancel}
            className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-surface-700">
            Are you sure you want to reload? You will lose any unsaved changes.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-200 bg-surface-50">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
          >
            Export
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
