import React from 'react';
import { processLinks } from '../utils/links'; // Assuming processLinks correctly sanitizes and handles HTML

interface TaskTextProps {
  text: string;
  completed: boolean;
  isHeadline?: boolean; // Optional: to apply different styling for headlines
}

export function TaskText({ text, completed, isHeadline = false }: TaskTextProps) {
  // Process links to make them clickable. Ensure this utility is robust.
  const processedText = processLinks(text); 

  // Base classes for text
  // For headlines, specific styling (like font size, weight) is typically handled by the parent (e.g., TaskDisplay using <h2>).
  // This component will primarily handle text color and completed state styling.
  let textClasses = "flex-1 break-words"; 

  if (isHeadline) {
    // If it's a headline, apply slightly different styling for completed state if needed,
    // but generally, headline visual distinction comes from its HTML tag (h1, h2, etc.) and parent styling.
    // For DaisyUI, text color should adapt based on the background it's on (e.g., card header).
    textClasses += completed ? ' text-base-content/60 line-through' : ' text-base-content';
  } else {
    // Regular task text styling
    // text-base-content/90 for slightly less emphasis than full black/white.
    // text-base-content/60 for completed tasks, making them dimmer.
    textClasses += completed ? ' text-base-content/60 line-through italic' : ' text-base-content/90';
  }

  // Using a div instead of span to allow processedText (which might contain block elements if links are complex or future markdown is used)
  // to render correctly without violating HTML rules (e.g., a <div> inside a <span>).
  // If processedText is guaranteed to be simple inline content, <span> could be used, but <div> is safer for `dangerouslySetInnerHTML`.
  return (
    <div
      className={textClasses}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
}
