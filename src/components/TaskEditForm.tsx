import React, { useState } from 'react';
import { X, Save, Code, AlignLeft, Type as HeadingIcon } from 'lucide-react'; // Renamed Heading to HeadingIcon
import { Task } from '../types/task';
import { CodeBlockEditor } from './code/CodeBlockEditor';
import { RichTextEditor } from './RichTextEditor'; // Assuming RichTextEditor will also be styled

interface TaskEditFormProps {
  task: Task;
  onSave: (text: string, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean, isHeadline?: boolean) => void;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [text, setText] = useState(task.text);
  const [showCodeInput, setShowCodeInput] = useState(!!task.codeBlock);
  const [showRichTextEditor, setShowRichTextEditor] = useState(!!task.richText);
  const [isHeadline, setIsHeadline] = useState(task.isHeadline || false);
  const [code, setCode] = useState(task.codeBlock?.code || '');
  const [richText, setRichText] = useState(task.richText || '');
  const [optional, setOptional] = useState(task.optional || false);

  const handleSave = () => {
    // For headlines, text is required. For normal tasks, either text or richText can be present.
    if (isHeadline && !text.trim()) {
      // Optionally, show an error or prevent saving if headline text is empty
      // For now, just returning, but an alert or message could be useful
      return;
    }
    if (!isHeadline && !text.trim() && !richText.trim()) {
      // Optionally, show an error or prevent saving if both text and rich text are empty for normal task
      return;
    }

    onSave(
      text.trim(),
      (showCodeInput && code.trim()) ? { language: 'javascript', code: code.trim() } : undefined,
      (showRichTextEditor && richText.trim()) ? richText.trim() : undefined,
      optional,
      isHeadline
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl p-4 my-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isHeadline ? "Headline text" : "Task text"}
            className="input input-bordered input-primary flex-1 min-w-[200px]"
          />
          <div className="join">
            <button
              type="button"
              onClick={() => setIsHeadline(!isHeadline)}
              className={`btn join-item ${isHeadline ? 'btn-primary' : 'btn-outline'}`}
              title="Toggle headline"
            >
              <HeadingIcon size={20} />
            </button>
            {!isHeadline && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  className={`btn join-item ${showCodeInput ? 'btn-secondary' : 'btn-outline'}`}
                  title="Toggle code editor"
                >
                  <Code size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowRichTextEditor(!showRichTextEditor)}
                  className={`btn join-item ${showRichTextEditor ? 'btn-accent' : 'btn-outline'}`}
                  title="Toggle rich text editor"
                >
                  <AlignLeft size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {showCodeInput && !isHeadline && (
          <div className="form-control">
            <label className="label"><span className="label-text">Code Block</span></label>
            <CodeBlockEditor
              code={code}
              onChange={(newCode) => setCode(newCode)}
            />
          </div>
        )}
        {showRichTextEditor && !isHeadline && (
          <div className="form-control">
            <label className="label"><span className="label-text">Rich Text Description</span></label>
            <RichTextEditor value={richText} onChange={setRichText} /> {/* Ensure RichTextEditor is styled for daisyUI */}
          </div>
        )}
        <div className="form-control">
          <label className="label cursor-pointer w-max">
            <span className="label-text mr-2">Optional Task</span>
            <input
              type="checkbox"
              checked={optional}
              onChange={(e) => setOptional(e.target.checked)}
              className="toggle toggle-warning"
            />
          </label>
        </div>
        <div className="card-actions justify-end gap-2">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
