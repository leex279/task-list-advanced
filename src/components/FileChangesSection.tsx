import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, AlertTriangle } from 'lucide-react'; // Added icons

interface FileChangesSectionProps {
  children: React.ReactNode;
  // Default to true to show the section initially expanded, as it's important info.
  initiallyCollapsed?: boolean; 
}

export function FileChangesSection({ children, initiallyCollapsed = false }: FileChangesSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  // Using daisyUI collapse component for the section
  // Adding some card-like styling for better visual grouping if this section is standalone
  return (
    <div className="card bg-base-200 shadow-md my-4">
      <div className="card-body p-0"> {/* Remove padding from card-body if using collapse which has its own */}
        <div 
            tabIndex={0} // Make it focusable for keyboard navigation
            className={`collapse collapse-arrow ${isCollapsed ? 'collapse-close' : 'collapse-open'} border border-base-300 rounded-box`}
            onClick={() => setIsCollapsed(!isCollapsed)} // Toggle on click of the entire summary/header
        >
          <input type="checkbox" checked={!isCollapsed} onChange={() => {}} className="peer sr-only" /> {/* Hidden checkbox for state, controlled by isCollapsed */}
          
          <div className="collapse-title text-lg font-semibold flex items-center cursor-pointer select-none bg-base-300 text-base-content peer-checked:rounded-b-none">
            <FileText size={20} className="mr-3 text-primary" />
            File Changes Overview
            {/* Chevron is handled by collapse-arrow, but if custom needed: */}
            {/* {isCollapsed ? <ChevronDown size={20} className="ml-auto" /> : <ChevronUp size={20} className="ml-auto" />} */}
          </div>

          <div className="collapse-content bg-base-100 text-base-content/90">
            <div className="p-4 space-y-3"> {/* Added padding inside content area */}
              <div className="alert alert-warning shadow-sm text-sm">
                <AlertTriangle size={18} />
                <div>
                  <h3 className="font-bold">Important!</h3>
                  <p>This section lists all files modified during our current session. The content shown here is the **definitive version** of these files for our work.</p>
                </div>
              </div>
              
              <p className="font-medium">Please use this information to:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Understand the latest file modifications.</li>
                <li>Ensure your suggestions build upon the most recent version of the files.</li>
                <li>Make informed decisions about further changes.</li>
                <li>Verify that your proposed changes are compatible with the existing code state.</li>
              </ul>
              {/* The actual file changes (children) will be rendered here */}
              <div className="mt-3 border-t border-base-300 pt-3">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}