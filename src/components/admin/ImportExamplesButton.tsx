import React, { useState, useRef } from 'react';
import { Upload, Loader } from 'lucide-react';
import { importJsonFiles } from '../../services/taskListService';

interface ImportExamplesButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function ImportExamplesButton({ onSuccess, onError }: ImportExamplesButtonProps) {
  const [loading, setLoading] = useState(false);
  const directoryInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const results = await importJsonFiles(files);
      
      if (results.errors.length > 0) {
        const errorMessage = `Some files failed to import:\n${results.errors.join('\n')}`;
        onError(errorMessage);
      }
      
      if (results.imported > 0) {
        onSuccess();
      } else {
        onError('No valid task lists were found in the selected files.');
      }
    } catch (error) {
      console.error('Error importing files:', error);
      onError('Failed to import files. Please ensure they are valid JSON task lists.');
    } finally {
      setLoading(false);
      if (directoryInputRef.current) {
        directoryInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={directoryInputRef}
        type="file"
        accept=".json"
        multiple
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => directoryInputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={16} />
            Importing...
          </>
        ) : (
          <>
            <Upload size={16} />
            Import JSON Files
          </>
        )}
      </button>
    </div>
  );
}