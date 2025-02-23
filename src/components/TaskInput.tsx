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
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
        />
        <button
          type="button"
          onClick={() => setIsHeadline(!isHeadline)}
          className={`headline-button px-3 rounded-lg border transition-colors ${
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
              className={`code-button px-3 rounded-lg border transition-colors ${
                showCodeInput
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-500'
              }`}
              title="Add code block"
            >
              <Code size={20} />
            </button>
            <button
              type="button"
              onClick={() => setShowRichTextEditor(!showRichTextEditor)}
              className={`rich-text-button px-3 rounded-lg border transition-colors ${
                showRichTextEditor
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-500'
              }`}
              title="Add rich text"
            >
              <AlignLeft size={20} />
            </button>
            <label className="optional-checkbox flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
              />
              <span className="text-sm font-medium text-gray-600">Optional</span>
            </label>
          </>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add
        </button>
      </div>

      {showCodeInput && (
        <CodeBlockEditor
          language="javascript"
          code={code}
          onChange={(_, code) => setCode(code)}
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
