import React, { useState } from 'react';
import { importAllExampleLists } from '../../services/taskListService';

interface ImportExamplesButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function ImportExamplesButton({ onSuccess, onError }: ImportExamplesButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      await importAllExampleLists();
      onSuccess();
    } catch (error) {
      console.error('Error importing example lists:', error);
      onError('Failed to import example lists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleImport}
      disabled={loading}
      className="px-4 py-2 text-sm bg-magenta-500 text-white rounded-md hover:bg-magenta-600 disabled:opacity-50"
    >
      {loading ? 'Importing...' : 'Import Example Lists'}
    </button>
  );
}