import React, { useState } from 'react';
import { Upload } from 'lucide-react'; // Download icon and exportTasks removed as export is handled by Header
import { Task } from '../types/task'; // Task type might not be needed if not directly handling tasks
import { ImportModal } from './ImportModal'; // Assumed ImportModal is refactored

interface ImportExportProps {
  onImport: (tasks: Task[]) => void; // Callback when tasks are imported
  buttonClass?: string; // Optional class for the button for flexibility
  buttonSize?: 'btn-xs' | 'btn-sm' | 'btn-md' | 'btn-lg'; // DaisyUI button sizes
  label?: string; // Optional label for the button, defaults to "Import"
}

export function ImportExport({ 
  onImport, 
  buttonClass, 
  buttonSize = 'btn-sm', 
  label = "Import" 
}: ImportExportProps) {
  const [showImportModal, setShowImportModal] = useState(false);

  // Export functionality has been removed from this component.
  // It's assumed to be handled by an ExportModal triggered elsewhere (e.g., in Header.tsx).

  const iconSize = buttonSize === 'btn-xs' || buttonSize === 'btn-sm' ? 16 : 18;

  return (
    <>
      <button
        onClick={() => setShowImportModal(true)}
        className={`btn ${buttonSize} btn-ghost ${buttonClass || 'btn-outline btn-secondary'}`} // Default to outline secondary if no class given
        title="Import tasks from a JSON file"
      >
        <Upload size={iconSize} />
        {label}
      </button>
      {showImportModal && (
        <ImportModal 
          onClose={() => setShowImportModal(false)} 
          onImport={(importedTasks: Task[]) => { // Ensure type consistency
            onImport(importedTasks);
            setShowImportModal(false); // Close modal after successful import
          }} 
        />
      )}
    </>
  );
}
