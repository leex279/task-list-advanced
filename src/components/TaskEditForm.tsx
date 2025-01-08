import React, { useState } from 'react';
import { X, Save, Code, AlignLeft, Heading } from 'lucide-react';
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
  const [showCodeInput, setShowCodeInput] = useState(!!task.codeBlock);
  const [showRichTextEditor, setShowRichTextEditor] = useState(!!task.richText);
  const [isHeadline, setIsHeadline] = useState(task.isHeadline);
  const [code, setCode] = useState(task.codeBlock?.code || '');
  const [richText, setRichText] = useState(task.richText || '');
  const [optional, setOptional] = useState(task.optional || false);

  const handleSave = () => {
    if (text.trim() || richText.trim()) {
      onSave(
        text.trim(),
        code.trim() ? { language: 'javascript', code: code.trim() } : undefined,
        richText.trim() ? richText.trim() : undefined,
        optional
      );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
          />
          <button
            type="button"
            onClick={() => setIsHeadline(!isHeadline)}
            className={`px-3 rounded-lg border transition-colors ${
              isHeadline
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-500'
            }`}
            title="Toggle headline"
          >
            <Heading size={20} />
          </button>
          {!isHeadline && (
            <>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`px-3 rounded-lg border transition-colors ${
                  showCodeInput
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                <Code size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowRichTextEditor(!showRichTextEditor)}
                className={`px-3 rounded-lg border transition-colors ${
                  showRichTextEditor
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                <AlignLeft size={20} />
              </button>
            </>
          )}
        </div>

        {showCodeInput && (
          <CodeBlockEditor
            code={code}
            onChange={(newCode) => setCode(newCode)}
          />
        )}
        {showRichTextEditor && (
          <RichTextEditor value={richText} onChange={setRichText} />
        )}
        <label className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
          />
          <span className="text-sm font-medium text-gray-600">Optional</span>
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
