import React from 'react';
import { processLinks } from '../utils/links';

interface TaskTextProps {
  text: string;
  completed: boolean;
}

export function TaskText({ text, completed }: TaskTextProps) {
  const processedText = processLinks(text);
  
  return (
    <span
      className={`flex-1 ${completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
}
