import React from 'react';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  availableLists: { name: string; url: string }[];
  onImportTaskList: (tasks: Task[]) => void;
}

export function TaskListSelector({
  availableLists,
  onImportTaskList,
}: TaskListSelectorProps) {
  const handleImport = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch task list: ${response.statusText}`);
      }
      const data = await response.json();
      onImportTaskList(data.data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      })));
    } catch (error) {
      console.error('Error importing task list:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {availableLists.map((list) => (
        <button
          key={list.url}
          onClick={() => handleImport(list.url)}
          className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-md border border-gray-200 
            hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 
            shadow-sm hover:shadow"
        >
          {list.name}
        </button>
      ))}
    </div>
  );
}
