import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types/task';
import { importTasks } from '../utils/storage';

interface ImportModalProps {
  onClose: () => void;
  onImport: (tasks: Task[]) => void;
}

export function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [importType, setImportType] = useState<'browse' | 'url' | 'paste' | null>(null);
  const [url, setUrl] = useState('');
  const [json, setJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tasks = importTasks(e.target?.result as string);
          onImport(tasks);
          onClose();
        } catch (error) {
          console.error('Error importing tasks:', error);
          alert('Error importing tasks: ' + error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    try {
      let tasks: Task[];
      if (importType === 'url') {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch task list: ${response.statusText}`);
        }
        const jsonString = await response.text();
        tasks = importTasks(jsonString);
        onImport(tasks);
        onClose();
      } else if (importType === 'paste') {
        tasks = importTasks(json);
        onImport(tasks);
        onClose();
      }
    } catch (error) {
      console.error('Error importing tasks:', error);
      alert('Error importing tasks: ' + error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-modal w-full max-w-lg sm:max-w-xl md:max-w-3xl mx-4 overflow-hidden">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Import Tasks</h2>
          <button
            onClick={onClose}
            className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                setImportType('browse');
                handleBrowseClick();
              }}
              className={`btn ${importType === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Browse
            </button>
            <button
              onClick={() => setImportType('url')}
              className={`btn ${importType === 'url' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Import by URL
            </button>
            <button
              onClick={() => setImportType('paste')}
              className={`btn ${importType === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Paste JSON
            </button>
          </div>

          {importType === 'url' && (
            <div className="space-y-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to JSON file"
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          )}

          {importType === 'paste' && (
            <div className="space-y-2">
              <textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder="Paste JSON here..."
                className="w-full h-32 px-4 py-2 rounded-lg border border-surface-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-200 bg-surface-50">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="btn btn-primary"
            disabled={!importType || (importType === 'url' && !url) || (importType === 'paste' && !json)}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
