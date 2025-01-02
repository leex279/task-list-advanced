import React from 'react';

export function ImportExportImage() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect width="100%" height="100%" fill="#f8fafc" />
      <g transform="translate(100, 50)">
        {/* Import/Export Buttons */}
        <rect width="600" height="80" rx="8" fill="#fff" stroke="#e2e8f0" />
        <rect x="20" y="20" width="100" height="40" rx="6" fill="#fff" stroke="#e2e8f0" />
        <text x="45" y="45" fontSize="14" fill="#64748b">Import</text>
        
        <rect x="140" y="20" width="100" height="40" rx="6" fill="#fff" stroke="#e2e8f0" />
        <text x="165" y="45" fontSize="14" fill="#64748b">Export</text>
      </g>
    </svg>
  );
} 