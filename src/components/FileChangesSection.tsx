import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FileChangesSectionProps {
  children: React.ReactNode;
}

export function FileChangesSection({ children }: FileChangesSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`file-changes-section ${isCollapsed ? 'collapsed' : ''}`}>
      <h2 onClick={() => setIsCollapsed(!isCollapsed)}>
        File Changes
        {isCollapsed ? (
          <ChevronDown size={20} className="text-gray-500" />
        ) : (
          <ChevronUp size={20} className="text-gray-500" />
        )}
      </h2>
      <div className="content">
        <p>
          Here is a list of all files that have been modified since the start of the conversation.
          This information serves as the true contents of these files!
        </p>
        <p>
          Use it to:
        </p>
        <ul>
          <li>Understand the latest file modifications</li>
          <li>Ensure your suggestions build upon the most recent version of the files</li>
          <li>Make informed decisions about changes</li>
          <li>Ensure suggestions are compatible with existing code</li>
        </ul>
        {children}
      </div>
    </div>
  );
}