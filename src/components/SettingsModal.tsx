import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (settings: any) => void;
  initialSettings: any;
}

export function SettingsModal({ onClose, onSave, initialSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState(initialSettings);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-xl md:max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-lg sm:text-xl md:text-2xl">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-700">
              GitHub Repository URL
            </label>
            <input
              type="text"
              id="githubRepo"
              name="githubRepo"
              value={settings.githubRepo}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="githubTaskLists" className="block text-sm font-medium text-gray-700">
              GitHub Task Lists URL
            </label>
            <input
              type="text"
              id="githubTaskLists"
              name="githubTaskLists"
              value={settings.githubTaskLists}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="githubRawUrl" className="block text-sm font-medium text-gray-700">
              GitHub Raw Content Base URL
            </label>
            <input
              type="text"
              id="githubRawUrl"
              name="githubRawUrl"
              value={settings.githubRawUrl}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              Google API Key:
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                id="apiKey"
                name="apiKey"
                value={settings.apiKey || ''}
                onChange={handleInputChange}
                placeholder="Not set (will still work if set in .env file)"
                className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
              />
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                title="Get API Key"
              >
                Get API Key
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="modern-button bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSave} className="modern-button bg-blue-500 text-white hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

