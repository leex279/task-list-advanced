import React from 'react';

export function TaskCreationImage() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect width="100%" height="100%" fill="#f8fafc" />
      <g transform="translate(100, 50)">
        {/* Input Area */}
        <rect width="600" height="120" rx="8" fill="#fff" stroke="#e2e8f0" />
        <rect x="20" y="20" width="440" height="40" rx="6" fill="#f1f5f9" stroke="#e2e8f0" />
        <text x="40" y="45" fontSize="14" fill="#94a3b8">Add a new task...</text>
        
        {/* Buttons */}
        <rect x="480" y="20" width="40" height="40" rx="6" fill="#fff" stroke="#e2e8f0" />
        <text x="492" y="45" fontSize="20" fill="#64748b">H</text>
        
        <rect x="530" y="20" width="40" height="40" rx="6" fill="#fff" stroke="#e2e8f0" />
        <text x="542" y="45" fontSize="20" fill="#64748b">&lt;/&gt;</text>
      </g>
    </svg>
  );
} 