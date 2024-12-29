import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  availableLists: { name: string; url: string }[];
  availableFolders: string[];
  onImportTaskList: (tasks: Task[]) => void;
  settings: {
    githubRepo: string;
  };
  onFetchTaskLists: (folderName?: string) => void;
}

export function TaskListSelector({ availableLists, availableFolders, onImportTaskList, settings, onFetchTaskLists }: TaskListSelectorProps) {
  const [selectedFolder, setSelectedFolder] = useState('examples');

  useEffect(() => {
    onFetchTaskLists(selectedFolder);
  }, [selectedFolder, onFetchTaskLists]);

  const handleImport = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch task list: ${response.statusText}`);
      }
      const jsonData = await response.json();
      onImportTaskList(jsonData.data);
    } catch (error) {
      console.error('Error importing task list:', error);
      alert('Error importing task list: ' + error);
    }
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
  };

  return (
    <div className="text-center py-4 text-gray-500">
      <div className="mb-4">
        <label htmlFor="folderSelect" className="mr-2">Collection:</label>
        <select id="folderSelect" value={selectedFolder} onChange={handleFolderChange} className="border rounded px-2 py-1">
          <option value="" disabled>Select a collection</option>
          {availableFolders.map((folder) => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>
      {availableLists.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {availableLists.map((list) => (
            <button
              key={list.url}
              onClick={() => handleImport(list.url)}
              className="tag-button"
            >
              {list.name}
            </button>
          ))}
        </div>
      ) : (
        <div>No predefined task lists available.</div>
      )}
    </div>
  );
}
