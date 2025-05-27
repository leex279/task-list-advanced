import React, { useState } from 'react';
import { PlusCircle, Code, Type as HeadingIcon, AlignLeft } from 'lucide-react'; // Renamed Heading to HeadingIcon
import { RichTextEditor } from './RichTextEditor'; // Assuming RichTextEditor will be styled for daisyUI
import { CodeBlockEditor } from './code/CodeBlockEditor'; // Assuming CodeBlockEditor will be styled for daisyUI

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
  const language = 'javascript'; // Default language, can be made dynamic if needed
  const [richText, setRichText] = useState('');
  const [optional, setOptional] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isHeadline && !text.trim()) {
        // Headline must have text
        return;
    }
    if (!isHeadline && !text.trim() && !richText.trim()) {
        // Regular task must have either text or rich text
        return;
    }

    onAddTask(
      text.trim(),
      isHeadline,
      !isHeadline && showCodeInput && code.trim() ? { language, code: code.trim() } : undefined,
      !isHeadline && showRichTextEditor && richText.trim() ? richText.trim() : undefined,
      !isHeadline ? optional : false // Optional only applies to non-headlines
    );

    // Reset form state
    setText('');
    setCode('');
    setRichText('');
    setShowCodeInput(false);
    setShowRichTextEditor(false);
    setIsHeadline(false); // Default to task, not headline
    setOptional(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow-md p-4 space-y-3">
      <div className="flex flex-wrap items-start gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isHeadline ? "Add a new headline..." : "Add a new task..."}
          className="input input-bordered input-primary flex-grow min-w-[200px]"
        />
        <div className="join">
          <button
            type="button"
            onClick={() => setIsHeadline(!isHeadline)}
            className={`btn join-item ${isHeadline ? 'btn-primary' : 'btn-outline'}`}
            title={isHeadline ? "Switch to Task" : "Switch to Headline"}
          >
            <HeadingIcon size={20} />
          </button>
          {!isHeadline && (
            <>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`btn join-item ${showCodeInput ? 'btn-secondary' : 'btn-outline'}`}
                title="Toggle Code Block"
              >
                <Code size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowRichTextEditor(!showRichTextEditor)}
                className={`btn join-item ${showRichTextEditor ? 'btn-accent' : 'btn-outline'}`}
                title="Toggle Rich Text Editor"
              >
                <AlignLeft size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {!isHeadline && ( // Code, RichText, Optional are only for non-headlines
        <>
          {showCodeInput && (
            <div className="form-control">
              <label className="label"><span className="label-text">Code Block</span></label>
              <CodeBlockEditor
                language={language}
                code={code}
                onChange={(_, newCode) => setCode(newCode || '')} // Ensure newCode is not undefined
              />
            </div>
          )}
          {showRichTextEditor && (
            <div className="form-control">
              <label className="label"><span className="label-text">Rich Text Description</span></label>
              <RichTextEditor
                value={richText}
                onChange={setRichText}
              />
            </div>
          )}
          <div className="form-control w-max">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Optional Task</span>
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="toggle toggle-warning"
              />
            </label>
          </div>
        </>
      )}
       <button
          type="submit"
          className="btn btn-primary btn-block sm:btn-wide sm:ml-auto" // Block on small screens, auto width on larger, align right
        >
          <PlusCircle size={20} />
          {isHeadline ? 'Add Headline' : 'Add Task'}
        </button>
    </form>
  );
}
