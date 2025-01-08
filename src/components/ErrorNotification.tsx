import React from 'react';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
  return (
    <div className="fixed top-0 left-0 w-full bg-red-100 border-b border-red-400 text-red-700 p-3 flex justify-between items-center">
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        X
      </button>
    </div>
  );
}
