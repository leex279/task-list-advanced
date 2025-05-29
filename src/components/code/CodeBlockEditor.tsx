import React from 'react';

interface CodeBlockEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeBlockEditor({ code, onChange }: CodeBlockEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-magenta-500 font-mono
          bg-gray-50 text-gray-800"
        rows={5}
        placeholder="Enter your code here..."
      />
    </div>
  );
}
