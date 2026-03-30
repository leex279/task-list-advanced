import React, { useState } from 'react';
import { PlusCircle, Code, Heading, AlignLeft } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { CodeBlockEditor } from './code/CodeBlockEditor';

interface TaskInputProps {
  onAddTask: (
    text: string,
    isHeadline: boolean,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showRichTextEditor, setShowRichTextEditor] = useState(false);
  const [isHeadline, setIsHeadline] = useState(false);
  const [code, setCode] = useState('');
  const language = 'javascript';
  const [richText, setRichText] = useState('');
  const [optional, setOptional] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || richText.trim()) {
      onAddTask(
        text.trim(),
        isHeadline,
        !isHeadline && showCodeInput && code.trim() ? { language, code: code.trim() } : undefined,
        !isHeadline && showRichTextEditor ? richText.trim() : undefined,
        !isHeadline ? optional : undefined
      );
      setText('');
      setCode('');
      setRichText('');
      setShowCodeInput(false);
      setShowRichTextEditor(false);
      setIsHeadline(false);
      setOptional(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="task-input flex flex-wrap gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isHeadline ? "Add a headline..." : "Add a new task..."}
          className="flex-1 px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-w-[200px]"
        />
        <button
          type="button"
          onClick={() => setIsHeadline(!isHeadline)}
          className={`headline-button px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
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
              className={`code-button px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
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
              className={`rich-text-button px-3 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                showRichTextEditor
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-surface-200 text-surface-500 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'
              }`}
              title="Add rich text"
            >
              <AlignLeft size={18} />
            </button>
            <label className="optional-checkbox flex items-center gap-2 px-3 py-2 rounded-full border-2 border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
              />
              <span className="text-sm font-medium text-surface-600">Optional</span>
            </label>
          </>
        )}
        <button
          type="submit"
          className="btn btn-primary px-4 py-2"
        >
          <PlusCircle size={18} />
          <span>Add</span>
        </button>
      </div>

      {showCodeInput && (
        <CodeBlockEditor
          language="javascript"
          code={code}
          onChange={(code) => {
            return setCode(code);
          }}
        />
      )}
      {!isHeadline && showRichTextEditor && (
        <div className="space-y-2">
          <RichTextEditor
            value={richText}
            onChange={setRichText}
          />
        </div>
      )}
    </form>
  );
}
