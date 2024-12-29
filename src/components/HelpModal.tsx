import React, { useEffect, useRef } from 'react';
import { X, Code, Heading, CheckSquare, AlignLeft, Download, Upload, Settings, Send } from 'lucide-react';

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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl sm:max-w-2xl md:max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-lg sm:text-xl md:text-2xl">Help</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="prose max-w-none">
          <p>
            This is a versatile task list application designed to help you manage your tasks efficiently.
          </p>
          <strong className="mt-4 block">Features</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Task Creation</p>
              <p className="text-gray-500">Add tasks with text descriptions, including support for headlines <Heading size={16} className="inline-block ml-1 align-middle" /> and code blocks <Code size={16} className="inline-block ml-1 align-middle" />.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Task Management</p>
              <p className="text-gray-500">Mark tasks as complete <CheckSquare size={16} className="inline-block ml-1 align-middle" />, edit existing tasks, and delete tasks.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Drag and Drop Reordering</p>
              <p className="text-gray-500">Reorder tasks using drag and drop functionality.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Import/Export</p>
              <p className="text-gray-500">Import <Upload size={16} className="inline-block ml-1 align-middle" /> and export <Download size={16} className="inline-block ml-1 align-middle" /> tasks as JSON files.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Community Task Lists</p>
              <p className="text-gray-500">Load predefined task lists from a configurable GitHub repository.</p>
            </div>
             <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Subtask Completion</p>
              <p className="text-gray-500">Check all subtasks under a headline with a single click.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Link Processing</p>
              <p className="text-gray-500">Automatically convert URLs in task descriptions into clickable links.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">Settings Management</p>
              <p className="text-gray-500">Configure GitHub repository settings <Settings size={16} className="inline-block ml-1 align-middle" /> for community task lists via an in-app settings modal.</p>
            </div>
            <div className="p-4 rounded-md shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-700">AI Task Generation</p>
              <p className="text-gray-500">Generate task lists using a prompt with Google Gemini. Enter a prompt in the input field and click the send button <Send size={16} className="inline-block ml-1 align-middle" />. Make sure you have set a valid Google API key in the settings.</p>
            </div>
          </div>
          <strong className="mt-4 block">How to Use</strong>
          <ul>
            <li>Use the input field to add new tasks.</li>
            <li>Click the checkbox to mark tasks as complete.</li>
            <li>Use the edit and delete buttons to modify or remove tasks.</li>
            <li>Drag and drop tasks to reorder them.</li>
            <li>Use the import/export buttons to save and load tasks.</li>
            <li>Load community task lists using the provided buttons.</li>
            <li>Click the settings icon (next to the beta badge) to open the settings modal and configure the GitHub repository settings for community task lists.</li>
            <li>Use the input field to generate a task list with Google Gemini.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
