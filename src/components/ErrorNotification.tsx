import React, { useEffect } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react'; // Added AlertTriangle for more visual cue

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number; // Optional duration in ms to auto-close
}

export function ErrorNotification({ message, onClose, duration = 7000 }: ErrorNotificationProps) { // Increased default duration
  useEffect(() => {
    if (duration && duration !== Infinity) { // Allow Infinity to disable auto-close
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration, message]); // Added message to deps: if message changes, timer should reset

  if (!message) return null; // Don't render if no message

  return (
    // Using daisyUI alert component with error styling
    // Fixed position at the top-center of the screen for better visibility
    // Increased z-index to ensure it's above most other content
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-auto max-w-[90%] sm:max-w-md md:max-w-lg" role="alertdialog" aria-labelledby="error-message" aria-describedby="error-message">
      <div className="alert alert-error shadow-lg flex items-center"> {/* flex and items-center for icon alignment */}
        <AlertTriangle size={24} className="stroke-current shrink-0 mr-3" /> 
        <span id="error-message" className="flex-grow text-sm sm:text-base">{message}</span>
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-ghost btn-circle ml-2" // Added ml-2 for spacing
          aria-label="Close error notification"
        >
          <XCircle size={22} /> {/* Slightly larger icon */}
        </button>
      </div>
    </div>
  );
}
