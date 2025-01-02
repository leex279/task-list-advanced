import React from 'react';

export function Footer() {
  return (
    <footer className="text-center p-4 text-gray-300 bg-gray-800">
      <div className="flex flex-col items-center gap-4">
        <a 
          href="https://github.com/leex279/task-list-advanced" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white transition-colors"
        >
          GitHub Repository
        </a>
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-gray-400">Build with</span>
          <a 
            href="https://bolt.diy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-90 transition-opacity"
          >
            <img src="/bolt-logo.png" alt="Bolt Logo" className="h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
} 