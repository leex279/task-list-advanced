import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DescriptionModalProps {
  content: string;
  onClose: () => void;
}

export function DescriptionModal({ content, onClose }: DescriptionModalProps) {
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

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl sm:max-w-2xl md:max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-lg sm:text-xl md:text-2xl">Detailed Description</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="prose max-w-none prose-ul:list-disc prose-ol:list-decimal" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
