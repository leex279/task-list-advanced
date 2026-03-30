import React, { useEffect, useRef } from 'react';
import { X, Upload, Download } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-modal w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Help</h2>
          <button
            onClick={onClose}
            className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <strong className="text-surface-900">Task List Advanced</strong>
              <p className="text-surface-600 mt-1">
                A modern task management application with code block support and AI task generation capabilities.
              </p>
            </div>

            <strong className="mt-4 block text-surface-900">Features</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">Task Creation</p>
                <p className="text-surface-500 text-sm">Create tasks with rich text descriptions and code blocks.</p>
              </div>
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">Task Organization</p>
                <p className="text-surface-500 text-sm">Use headlines to group tasks and mark tasks as optional.</p>
              </div>
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">Drag and Drop</p>
                <p className="text-surface-500 text-sm">Reorder tasks using drag and drop functionality.</p>
              </div>
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">Import/Export</p>
                <p className="text-surface-500 text-sm">Import <Upload size={16} className="inline-block ml-1 align-middle" /> and export <Download size={16} className="inline-block ml-1 align-middle" /> tasks as JSON files.</p>
              </div>
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">AI Task Generation</p>
                <p className="text-surface-500 text-sm">Generate task lists using Google's Gemini AI (API key required).</p>
              </div>
              <div className="p-4 rounded-lg border border-surface-200 bg-surface-50">
                <p className="font-semibold text-surface-700">Example Lists</p>
                <p className="text-surface-500 text-sm">Start with pre-built example task lists.</p>
              </div>
            </div>

            <div className="mt-4">
              <strong className="text-surface-900">Getting Started</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-2 text-surface-600">
                <li>Create tasks using the input field at the top</li>
                <li>Toggle headline mode to create section headers</li>
                <li>Add code blocks or rich text descriptions as needed</li>
                <li>Mark tasks as optional when appropriate</li>
                <li>Drag and drop to reorder tasks</li>
                <li>Import/Export tasks using the buttons in the header</li>
                <li>Configure your Google API key in settings to use AI generation</li>
              </ol>
            </div>

            <div className="mt-4">
              <strong className="text-surface-900">Source Code</strong>
              <p className="text-surface-600 mt-1">
                This project is open source. Visit the{' '}
                <a
                  href="https://github.com/leex279/task-list-advanced"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                >
                  GitHub repository
                </a>{' '}
                for more information.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-surface-200 bg-surface-50">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
