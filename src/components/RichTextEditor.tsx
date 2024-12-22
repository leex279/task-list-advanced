import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleChange}
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
  );
}
