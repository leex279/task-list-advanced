import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Default Quill snow theme

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Standard toolbar options for a basic rich text editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }], // Header dropdown
    ['bold', 'italic', 'underline', 'strike'],        // Toggled buttons
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }], // Lists, indent
    // [{ 'script': 'sub'}, { 'script': 'super' }],   // Subscript/superscript - can be added if needed
    // [{ 'align': [] }],                             // Text alignment - can be added if needed
    ['link', /*'image', 'video'*/],                  // Link, image, video - image/video might need server handling
    ['blockquote', 'code-block'],                   // Blockquote, code block
    ['clean']                                         // Remove formatting button
  ],
  clipboard: {
    // Match visual, not literal paste from external sources
    matchVisual: false,
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 
  'list', 'bullet', 'indent',
  // 'script', 'align', // Uncomment if modules are added
  'link', /*'image', 'video',*/
  'blockquote', 'code-block'
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);

  // The .rich-text-editor class can be used for global overrides if absolutely necessary,
  // but prefer direct styling of the Quill component or its container when possible.
  return (
    <div className="rich-text-editor-wrapper form-control bg-base-100 rounded-md border border-base-300 focus-within:border-primary transition-colors">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow" // 'snow' is the default theme with a toolbar
        className="[&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-base-300 [&_.ql-container]:border-0 [&_.ql-container]:rounded-b-md"
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write something amazing..."}
      />
      {/* 
        Global styles are used here to target Quill's generated classes.
        These styles aim to make the editor blend better with daisyUI.
        It's a common approach for customizing third-party libraries like Quill.
      */}
      <style jsx global>{`
        .rich-text-editor-wrapper .ql-editor {
          min-height: 150px; /* Ensure sufficient typing area */
          max-height: 400px; /* Prevent editor from becoming too tall */
          overflow-y: auto;
          font-size: 0.875rem; /* text-sm */
          line-height: 1.5rem; /* leading-relaxed */
          color: var(--fallback-bc, oklch(var(--bc) / 1)); /* Use daisyUI base content color */
          padding: 0.75rem; /* p-3 */
        }
        .rich-text-editor-wrapper .ql-toolbar {
          background-color: var(--fallback-b2, oklch(var(--b2, var(--b1)) / 1)); /* base-200 or base-100 */
          color: var(--fallback-bc, oklch(var(--bc) / 1));
        }
        /* Style Quill toolbar buttons to look more like daisyUI buttons (subtle) */
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label,
        .rich-text-editor-wrapper .ql-toolbar button {
          border-radius: 0.25rem; /* rounded-sm */
          transition: background-color 0.2s ease-in-out;
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover,
        .rich-text-editor-wrapper .ql-toolbar button:hover {
          background-color: var(--fallback-b3, oklch(var(--b3, var(--b2)) / 1)); /* base-300 or base-200 */
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-active {
           background-color: var(--fallback-p, oklch(var(--p) / 1)) !important; /* primary color */
           color: var(--fallback-pc, oklch(var(--pc) / 1)) !important; /* primary-content color */
        }
        .rich-text-editor-wrapper .ql-snow.ql-toolbar button svg,
        .rich-text-editor-wrapper .ql-snow .ql-toolbar button svg {
            filter: invert(var(--is-dark)) sepia(0) saturate(0) hue-rotate(0deg) brightness(1) contrast(1);
        }
        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-active button svg,
        .rich-text-editor-wrapper .ql-snow .ql-toolbar .ql-active button svg {
             filter: invert(var(--is-dark-theme-enhancer)) sepia(0) saturate(0) hue-rotate(0deg) brightness(1) contrast(1);
        }
      `}</style>
    </div>
  );
}
