import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { SaveListModal } from './SaveListModal';

interface SaveListButtonProps {
  onSave: (name: string, asExample: boolean) => Promise<boolean>;
}

export function SaveListButton({ onSave }: SaveListButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-magenta-500 text-white rounded-md hover:bg-magenta-600 transition-colors"
      >
        <Save size={16} />
        Save List
      </button>

      {showModal && (
        <SaveListModal
          onClose={() => setShowModal(false)}
          onSave={onSave}
        />
      )}
    </>
  );
}