import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { importTasks } from '../utils/storage';

interface TaskListSelectorProps {
  availableLists: string[];
  onImportTaskList: (tasks: Task[]) => void;
}

const GITHUB_TASKLIST_BASE_URL = 'https://raw.githubusercontent.com/leex279/task-list-advanced/stable/public/tasklists';

export function TaskListSelector({ availableLists, onImportTaskList }: TaskListSelectorProps) {
  const handleImport = async (listName: string) => {
    try {
      const response = await fetch(`${GITHUB_TASKLIST_BASE_URL}/${listName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch task list: ${response.statusText}`);
      }
      const jsonString = await response.text();
      const tasks = importTasks(jsonString);
      onImportTaskList(tasks);
    } catch (error) {
      console.error('Error importing task list:', error);
      alert('Error importing task list: ' + error);
    }
  };

  return (
    <div className="text-center py-12 text-gray-500">
      {availableLists.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {availableLists.map((listName) => (
            <button
              key={listName}
              onClick={() => handleImport(listName)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {listName.replace('.json', '').replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      ) : (
        <div>No predefined task lists available.</div>
      )}
    </div>
  );
}
