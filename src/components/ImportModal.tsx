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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-3xl">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-lg sm:text-xl md:text-2xl">Import Tasks</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              setImportType('browse');
              handleBrowseClick();
            }}
            className={`modern-button ${importType === 'browse' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Browse
          </button>
          <button
            onClick={() => setImportType('url')}
            className={`modern-button ${importType === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Import by URL
          </button>
          <button
            onClick={() => setImportType('paste')}
            className={`modern-button ${importType === 'paste' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Paste JSON
          </button>
        </div>
        {importType === 'url' && (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to JSON file"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
        {importType === 'paste' && (
          <div className="space-y-2 mb-4">
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full h-24 px-4 py-2 rounded-lg border border-gray-200 font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="modern-button bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleImport} className="modern-button bg-blue-500 text-white hover:bg-blue-600">
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
