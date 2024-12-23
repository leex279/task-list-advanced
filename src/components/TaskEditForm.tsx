import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Task } from '../types/task';
import { CodeBlockEditor } from './code/CodeBlockEditor';
import { RichTextEditor } from './RichTextEditor';

interface TaskEditFormProps {
  task: Task;
  onSave: (text: string, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean) => void;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [text, setText] = useState(task.text);
  const [code, setCode] = useState(task.codeBlock?.code || '');
  const [language, setLanguage] = useState(task.codeBlock?.language || 'javascript');
  const [richText, setRichText] = useState(task.richText || '');
  const [optional, setOptional] = useState(task.optional || false);

  const handleSave = () => {
    if (text.trim() || richText.trim()) {
      onSave(
        text.trim(),
        code.trim() ? { language, code: code.trim() } : undefined,
        richText.trim() ? richText.trim() : undefined,
        optional
      );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
         <RichTextEditor
          value={richText}
          onChange={setRichText}
        />
        <CodeBlockEditor
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
        />
         <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Optional</span>
            </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
