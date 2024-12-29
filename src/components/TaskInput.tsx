import React, { useState } from 'react';
import { PlusCircle, Code, Heading, AlignLeft } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface TaskInputProps {
  onAddTask: (text: string, isHeadline: boolean, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showRichTextEditor, setShowRichTextEditor] = useState(false);
  const [isHeadline, setIsHeadline] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
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
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isHeadline ? "Add a headline..." : "Add a new task..."}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
        />
        <button
          type="button"
          onClick={() => {
            setIsHeadline(!isHeadline);
            if (!isHeadline) {
              setShowCodeInput(false);
              setShowRichTextEditor(false);
            }
          }}
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
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Optional</span>
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

      {!isHeadline && showCodeInput && (
        <div className="space-y-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="jsx">JSX</option>
            <option value="tsx">TSX</option>
          </select>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code here..."
            className="w-full h-24 px-4 py-2 rounded-lg border border-gray-200 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
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
