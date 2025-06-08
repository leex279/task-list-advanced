import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SaveImportModalProps {
  onClose: () => void;
  onSave: (name: string, isExample: boolean) => void;
}

export function SaveImportModal({ onClose, onSave }: SaveImportModalProps) {
  const [name, setName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExample, setIsExample] = useState(false);


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
      onSave(name.trim(), isExample);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Save Task List As...</h2>
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
          <div className="flex justify-end gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isExample}
                onChange={(e) => setIsExample(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Save as example</span>
            </label>            
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}