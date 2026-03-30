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
    <div className="p-4 bg-white rounded-lg border border-surface-200 shadow-card">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-w-[200px]"
          />
          <button
            type="button"
            onClick={() => setIsHeadline(!isHeadline)}
            className={`px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              isHeadline
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-surface-200 text-surface-500 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'
            }`}
            title="Toggle headline"
          >
            <Heading size={18} />
          </button>
          {!isHeadline && (
            <>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  showCodeInput
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-surface-200 text-surface-500 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'
                }`}
                title="Add code block"
              >
                <Code size={18} />
              </button>
              <button
                type="button"
                onClick={() => setShowRichTextEditor(!showRichTextEditor)}
                className={`px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  showRichTextEditor
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-surface-200 text-surface-500 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'
                }`}
                title="Add rich text"
              >
                <AlignLeft size={18} />
              </button>
            </>
          )}
        </div>

        {showCodeInput && (
          <CodeBlockEditor
            language="javascript"
            code={code}
            onChange={(_, newCode) => setCode(newCode)}
          />
        )}
        {showRichTextEditor && (
          <RichTextEditor value={richText} onChange={setRichText} />
        )}
        <label className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
            className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
          />
          <span className="text-sm font-medium text-surface-600">Optional</span>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
