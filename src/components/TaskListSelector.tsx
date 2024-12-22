import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  onImportTaskList: (tasks: Task[]) => void;
}

const GITHUB_TASKLIST_BASE_URL = 'https://raw.githubusercontent.com/leex279/task-list-advanced/stable/public/tasklists';

export function TaskListSelector({ onImportTaskList }: TaskListSelectorProps) {
  const [availableLists, setAvailableLists] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/leex279/task-list-advanced/contents/public/tasklists?ref=stable');
        if (!response.ok) {
          throw new Error(`Failed to fetch task lists: ${response.statusText}`);
        }
        const data = await response.json();
        const filePromises = data
          .filter((item: any) => item.type === 'file' && item.name.endsWith('.json'))
          .map(async (item: any) => {
            const fileResponse = await fetch(`${GITHUB_TASKLIST_BASE_URL}/${item.name}`);
            if (!fileResponse.ok) {
              throw new Error(`Failed to fetch task list: ${fileResponse.statusText}`);
            }
            const jsonData = await fileResponse.json();
            return { name: jsonData.name, url: item.download_url };
          });

        const filesData = await Promise.all(filePromises);
        setAvailableLists(filesData);
      } catch (error) {
        console.error('Error fetching task lists:', error);
        alert('Error fetching task lists: ' + error);
      }
    };

    fetchTaskLists();
  }, []);

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

  return (
    <div className="text-center py-4 text-gray-500">
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
