import React, { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react'; // Added Download icon

interface ExportModalProps {
  onClose: () => void;
  onExport: (name: string) => void;
}

export function ExportModal({ onClose, onExport }: ExportModalProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Removed modalRef and useEffect for handleClickOutside, daisyUI handles this

  useEffect(() => {
    // Focus the input field when the modal opens
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onExport(name.trim());
      onClose(); // Close modal on successful export
    } else {
      // Optionally, provide feedback if name is empty, though `required` attribute handles some of this
      alert("Please enter a name for the task list.");
    }
  };

  return (
    <dialog id="export_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-bold text-base-content">Export Task List</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="export-name" className="label">
              <span className="label-text">Task List Name</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              id="export-name" // Changed id for clarity
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered input-primary w-full"
              placeholder="Enter a name for your task list"
              required // HTML5 validation for empty field
            />
          </div>
          
          {/* Modal Actions */}
          <div className="modal-action mt-6">
            <button
              type="button" // Important: type="button" for cancel to not submit form
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim()} // Disable if name is empty or only whitespace
            >
              <Download size={18} className="mr-2" /> {/* Added icon */}
              Export
            </button>
          </div>
        </form>
      </div>
      {/* Modal backdrop for closing when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}