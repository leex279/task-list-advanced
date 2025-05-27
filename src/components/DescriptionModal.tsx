import React from 'react'; // Removed useEffect, useRef
import { X, Info } from 'lucide-react'; // Added Info icon

interface DescriptionModalProps {
  content: string;
  onClose: () => void;
  title?: string;
}

export function DescriptionModal({ 
  content, 
  onClose, 
  title = "Detailed Description" 
}: DescriptionModalProps) {
  // daisyUI handles modal closure via form method="dialog" or by pressing ESC

  return (
    <dialog id="description_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-3xl"> {/* Increased max-width for descriptions */}
        {/* Modal Header */}
        <div className="flex items-center pb-3"> {/* Use items-center for icon and title alignment */}
          <Info size={22} className="text-info mr-3 shrink-0" /> {/* Icon for description */}
          <h3 className="text-xl font-bold text-base-content flex-grow">{title}</h3>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close" // Accessibility
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {/* Apply prose for rich text styling, ensure it works with daisyUI base styles */}
        {/* max-h-[calc(100vh-10rem)] makes content scrollable if too long */}
        <div 
          className="prose prose-sm sm:prose-base max-w-none py-4 max-h-[calc(100vh-12rem)] overflow-y-auto text-base-content/90" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
        
        {/* Modal Actions */}
        <div className="modal-action mt-4">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
      {/* Modal backdrop for closing when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
