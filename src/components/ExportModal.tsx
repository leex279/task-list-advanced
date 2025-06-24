import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type ExportFormat = 'json' | 'markdown';

interface ExportModalProps {
  onClose: () => void;
  onExport: (name: string, format: ExportFormat) => void;
}

export function ExportModal({ onClose, onExport }: ExportModalProps) {
  const [name, setName] = useState('');
  const [format, setFormat] = useState<ExportFormat>('json');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onExport(name.trim(), format);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Export Task List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Task List Name
            </label>
            <input
              ref={inputRef}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter a name for your task list"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">JSON (for importing back into the app)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="markdown"
                  checked={format === 'markdown'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Markdown (for documentation and sharing)</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!name.trim()}
            >
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}