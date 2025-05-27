import React, { useState, useRef } from 'react'; // Removed useEffect as daisyUI handles modal closure
import { X, UploadCloud, Link as LinkIcon, Clipboard } from 'lucide-react'; // Added more specific icons, Link aliased
import { Task } from '../types/task';
import { importTasks } from '../utils/storage';

interface ImportModalProps {
  onClose: () => void;
  onImport: (tasks: Task[]) => void;
}

export function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [importType, setImportType] = useState<'browse' | 'url' | 'paste' | null>(null);
  const [url, setUrl] = useState('');
  const [jsonText, setJsonText] = useState(''); // Renamed from json to jsonText for clarity
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    setImportType('browse'); // Set type then click
    fileInputRef.current?.click(); // Trigger hidden file input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const tasks = importTasks(event.target?.result as string);
          onImport(tasks);
          onClose(); // Close modal on successful import
        } catch (error) {
          console.error('Error importing tasks from file:', error);
          alert(`Error importing tasks: ${error instanceof Error ? error.message : String(error)}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUrlOrPasteImport = async () => {
    try {
      let tasks: Task[];
      if (importType === 'url') {
        if (!url.trim()) {
          alert("Please enter a valid URL.");
          return;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch task list: ${response.statusText} (status: ${response.status})`);
        }
        const fetchedJsonString = await response.text();
        tasks = importTasks(fetchedJsonString);
      } else if (importType === 'paste') {
        if (!jsonText.trim()) {
          alert("Please paste valid JSON content.");
          return;
        }
        tasks = importTasks(jsonText);
      } else {
        // This case should ideally not be reached if UI logic is correct
        alert("Please select an import method.");
        return;
      }
      onImport(tasks);
      onClose(); // Close modal on successful import
    } catch (error) {
      console.error('Error importing tasks:', error);
      alert(`Error importing tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const isImportButtonDisabled = () => {
    if (importType === 'url') return !url.trim();
    if (importType === 'paste') return !jsonText.trim();
    // For 'browse', the import button is not shown, action is via file selection.
    // If no import type is selected, or it's 'browse', the main import button should not be active or visible.
    return true; 
  };

  return (
    <dialog id="import_tasks_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Hidden file input */}
        <input
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3"> {/* Added pb-3 for spacing */}
          <h3 className="text-xl font-bold text-base-content">Import Tasks</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="tabs tabs-boxed mb-4">
          <button // Changed from <a> to <button> for accessibility and because it's a control
            className={`tab tab-lifted flex-1 ${importType === 'browse' ? 'tab-active !bg-primary text-primary-content' : ''}`}
            onClick={handleBrowseClick}
          >
            <UploadCloud size={16} className="mr-2" /> Browse File
          </button>
          <button
            className={`tab tab-lifted flex-1 ${importType === 'url' ? 'tab-active !bg-primary text-primary-content' : ''}`}
            onClick={() => setImportType('url')}
          >
            <LinkIcon size={16} className="mr-2" /> By URL
          </button>
          <button
            className={`tab tab-lifted flex-1 ${importType === 'paste' ? 'tab-active !bg-primary text-primary-content' : ''}`}
            onClick={() => setImportType('paste')}
          >
            <Clipboard size={16} className="mr-2" /> Paste JSON
          </button>
        </div>

        {importType === 'url' && (
          <div className="form-control space-y-2 mb-4 py-4"> {/* Added py-4 for spacing */}
            <label className="label"><span className="label-text">Enter URL to JSON file</span></label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/tasks.json"
              className="input input-bordered input-primary w-full"
            />
          </div>
        )}

        {importType === 'paste' && (
          <div className="form-control space-y-2 mb-4 py-4"> {/* Added py-4 for spacing */}
            <label className="label"><span className="label-text">Paste JSON content here</span></label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{ "name": "My Task List", "data": [ ... ] }'
              className="textarea textarea-bordered textarea-primary w-full h-32 font-mono text-sm"
              rows={5} // Added rows for better initial size
            />
          </div>
        )}
        
        {/* Modal Actions */}
        <div className="modal-action mt-6">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          {/* Only show Import button for URL and Paste modes */}
          {(importType === 'url' || importType === 'paste') && (
            <button 
              onClick={handleUrlOrPasteImport} 
              className="btn btn-primary"
              disabled={isImportButtonDisabled()}
            >
              Import
            </button>
          )}
        </div>
      </div>
      {/* Modal backdrop for closing when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
