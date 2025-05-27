import React from 'react';

interface CodeBlockEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string; // Optional: To display the language, though this editor is plain
}

export function CodeBlockEditor({ code, onChange, language }: CodeBlockEditorProps) {
  return (
    <div className="form-control w-full">
      {language && ( // Display language if provided
        <label className="label">
          <span className="label-text-alt uppercase text-xs text-base-content/70">{language}</span>
        </label>
      )}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="textarea textarea-bordered textarea-ghost w-full font-mono text-sm leading-relaxed bg-base-200 text-base-content h-40" // Increased height with h-40
        rows={6} // Default rows, but h-40 will likely override depending on content
        placeholder="Enter your code here..."
        spellCheck="false"
        wrap="soft" // 'off' can be useful for code to prevent wrapping, but 'soft' is often more user-friendly
      />
    </div>
  );
}
