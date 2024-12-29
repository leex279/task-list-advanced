import React from 'react';

interface CodeBlockEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
}

export function CodeBlockEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: CodeBlockEditorProps) {
  return (
    <div className="space-y-2">
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-3 py-1.5 rounded-md border text-sm"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="jsx">JSX</option>
        <option value="tsx">TSX</option>
      </select>
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Enter code here..."
        className="w-full h-24 px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
