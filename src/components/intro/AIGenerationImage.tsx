import React from 'react';

export function AIGenerationImage() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect width="100%" height="100%" fill="#f8fafc" />
      <g transform="translate(100, 50)">
        {/* AI Input Area */}
        <rect width="600" height="200" rx="8" fill="#fff" stroke="#e2e8f0" />
        <text x="20" y="40" fontSize="14" fill="#94a3b8">
          Generate a task list for...
        </text>
        
        {/* AI Button */}
        <rect x="20" y="140" width="120" height="40" rx="6" fill="#3b82f6" />
        <text x="45" y="165" fontSize="14" fill="#fff">Generate</text>
      </g>
    </svg>
  );
} 