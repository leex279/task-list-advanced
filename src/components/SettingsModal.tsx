import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (settings: any) => void;
  initialSettings: any;
}

export function SettingsModal({ onClose, onSave, initialSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [googleApiKeyDisplay, setGoogleApiKeyDisplay] = useState(initialSettings.googleApiKey);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    if (name === 'googleApiKey') {
      setGoogleApiKeyDisplay(value);
    }
  };

  const handleSave = () => {
    onSave(settings);
  };

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
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-xl">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="googleApiKey" className="block text-sm font-medium text-gray-700">
              Google API Key:
            </label>
            <div className="flex items-center justify-between">
              <input
                type="password"
                id="googleApiKey"
                name="googleApiKey"
                value={googleApiKeyDisplay}
                onChange={handleInputChange}
                placeholder={googleApiKeyDisplay ? "********************" : "Paste your API key here!"}
                className="mt-1 px-3 py-2 border rounded-md w-[calc(100%-120px)] focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                className="modern-button bg-yellow-100 text-yellow-700 hover:bg-yellow-200 whitespace-nowrap w-fit flex items-center gap-1"
                title="Get Google API Key"
              >
                Get API Key
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="modern-button bg-gray-100 text-gray-700">
            Cancel
          </button>
          <button onClick={handleSave} className="modern-button bg-blue-500 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
