import React from 'react';

export function RichContentImage() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect width="100%" height="100%" fill="#f8fafc" />
      <g transform="translate(100, 50)">
        {/* Code Block */}
        <rect width="600" height="200" rx="8" fill="#1e293b" />
        <g transform="translate(20, 40)">
          <text fontSize="14" fontFamily="monospace" fill="#94a3b8">
            <tspan x="0" dy="0">{'function example() {'}</tspan>
          </text>
          <text fontSize="14" fontFamily="monospace" fill="#94a3b8">
            <tspan x="20" dy="24">{'  console.log("Hello");'}</tspan>
          </text>
          <text fontSize="14" fontFamily="monospace" fill="#94a3b8">
            <tspan x="0" dy="24">{'}'}</tspan>
          </text>
        </g>
        
        {/* Rich Text Editor */}
        <rect y="220" width="600" height="120" rx="8" fill="#fff" stroke="#e2e8f0" />
        <text x="20" y="260" fontSize="14" fill="#0f172a">
          Rich text description with formatting
        </text>
        
        {/* Rich Text Toolbar */}
        <rect y="220" width="600" height="32" rx="8" fill="#f8fafc" />
        <g transform="translate(20, 236)">
          <rect width="24" height="24" rx="4" fill="#e2e8f0" />
          <text x="6" y="17" fontSize="14" fontWeight="bold" fill="#64748b">B</text>
          <rect x="32" width="24" height="24" rx="4" fill="#e2e8f0" />
          <text x="38" y="17" fontSize="14" fontStyle="italic" fill="#64748b">I</text>
          <rect x="64" width="24" height="24" rx="4" fill="#e2e8f0" />
          <text x="70" y="17" fontSize="14" fill="#64748b">•</text>
        </g>
      </g>
    </svg>
  );
} 