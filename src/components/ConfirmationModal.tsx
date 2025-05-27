import React from 'react'; // Removed useEffect, useRef as daisyUI handles modal closure via form method="dialog"
import { AlertTriangle, Download, RotateCcw, ShieldCheck } from 'lucide-react'; // Added relevant icons
import { exportTasks } from '../utils/storage'; // Assuming this util is correctly set up
import { Task } from '../types/task';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  tasks?: Task[]; // Optional: only needed if export functionality is used
  title?: string;
  message?: string;
  confirmButtonText?: string;
  confirmButtonClass?: string; // e.g., 'btn-error', 'btn-warning', 'btn-success'
  showExportButton?: boolean;
  icon?: React.ReactNode; // Allow passing a custom icon
}

export function ConfirmationModal({ 
  onConfirm, 
  onCancel, 
  tasks,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action may have consequences.",
  confirmButtonText = "Confirm",
  confirmButtonClass = "btn-primary", // Default to primary, can be overridden for destructive actions
  showExportButton = false,
  icon = <AlertTriangle size={24} className="text-warning mr-3" /> // Default icon
}: ConfirmationModalProps) {

  const handleExportAndConfirm = () => {
    if (tasks && tasks.length > 0) {
      try {
        const json = exportTasks(tasks); // Assuming exportTasks returns a JSON string
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        // Try to find a list name from a headline task, otherwise default
        const listName = tasks.find(t => t.isHeadline)?.text || "task-list";
        const sanitizedListName = listName.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
        a.download = `${sanitizedListName}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); // Append to body to ensure click works in all browsers
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url);
      } catch (error) {
          console.error("Error exporting tasks:", error);
          // Optionally, inform the user that export failed but still proceed with confirm
          alert(`Tasks could not be exported due to an error: ${error instanceof Error ? error.message : String(error)}. Proceeding with action.`);
      }
    } else if (showExportButton) {
      // If export is shown but no tasks, maybe warn or just proceed
      console.warn("Export button was shown, but no tasks were provided to export.");
    }
    onConfirm(); // Proceed with the original confirm action
  };

  const mainConfirmAction = showExportButton ? handleExportAndConfirm : onConfirm;
  const mainConfirmButtonText = showExportButton ? `Export & ${confirmButtonText}` : confirmButtonText;
  const mainConfirmIcon = showExportButton ? <Download size={18} className="mr-2" /> : <ShieldCheck size={18} className="mr-2" />;


  return (
    <dialog id="confirmation_modal_generic" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <div className="flex items-start mb-4"> {/* Changed to items-start for better icon alignment with text */}
          {icon}
          <h3 className="text-xl font-bold text-base-content">{title}</h3>
        </div>

        <p className="py-4 text-base-content opacity-90">{message}</p>
        
        <div className="modal-action mt-6">
          <button onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={mainConfirmAction} className={`btn ${confirmButtonClass}`}>
            {mainConfirmIcon}
            {mainConfirmButtonText}
          </button>
        </div>
      </div>
      {/* Modal backdrop for closing when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onCancel}>close</button>
      </form>
    </dialog>
  );
}
