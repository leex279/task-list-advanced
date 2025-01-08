import React from 'react';

export function WelcomeImage() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect width="100%" height="100%" fill="#f8fafc" />
      <g transform="translate(100, 50)">
        {/* App Header */}
        <rect width="600" height="60" rx="8" fill="#fff" stroke="#e2e8f0" />
        <text x="20" y="38" fontSize="24" fill="#1e293b">Task List Advanced</text>
        
        {/* Beta Badge */}
        <rect x="520" y="20" width="60" height="24" rx="12" fill="#e2e8f0" />
        <text x="535" y="36" fontSize="14" fill="#64748b">beta</text>
      </g>
    </svg>
  );
} 