import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow"
        className="bg-white rounded-md border border-gray-200"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [2, 3, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ],
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 120px;
          max-height: 400px;
          overflow-y: auto;
        }
        .rich-text-editor .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
}
