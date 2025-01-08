import React from 'react';
import { X, Upload, Download } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-xl">Help</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <strong>Task List Advanced</strong>
            <p className="text-gray-600 mt-1">
              A modern task management application with code block support and AI task generation capabilities.
            </p>
          </div>

          <strong className="mt-4 block">Features</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Task Creation</p>
              <p className="text-gray-500">Create tasks with rich text descriptions and code blocks.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Task Organization</p>
              <p className="text-gray-500">Use headlines to group tasks and mark tasks as optional.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Drag and Drop</p>
              <p className="text-gray-500">Reorder tasks using drag and drop functionality.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Import/Export</p>
              <p className="text-gray-500">Import <Upload size={16} className="inline-block ml-1 align-middle" /> and export <Download size={16} className="inline-block ml-1 align-middle" /> tasks as JSON files.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">AI Task Generation</p>
              <p className="text-gray-500">Generate task lists using Google's Gemini AI (API key required).</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Example Lists</p>
              <p className="text-gray-500">Start with pre-built example task lists.</p>
            </div>
          </div>

          <div className="mt-4">
            <strong>Getting Started</strong>
            <ol className="list-decimal ml-5 mt-2 space-y-2 text-gray-600">
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
            <strong>Source Code</strong>
            <p className="text-gray-600 mt-1">
              This project is open source. Visit the{' '}
              <a
                href="https://github.com/leex279/task-list-advanced"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                GitHub repository
              </a>{' '}
              for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
