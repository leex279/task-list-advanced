import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  onImportTaskList: (tasks: Task[]) => void;
  settings: {
    githubTaskLists: string;
    githubRawUrl: string;
  };
}

export function TaskListSelector({ onImportTaskList, settings }: TaskListSelectorProps) {
  const [availableLists, setAvailableLists] = useState<{ name: string; url: string }[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskLists = async () => {
      setFetchError(null);
      try {
        const response = await fetch(settings.githubTaskLists);
        if (!response.ok) {
          if (response.status === 403) {
            const errorData = await response.json();
            if (errorData.message && errorData.message.includes('API rate limit exceeded')) {
              setFetchError('GitHub API rate limit exceeded. Please try again later.');
              return;
            }
          }
          throw new Error(`Failed to fetch task lists: ${response.statusText}`);
        }
        const data = await response.json();
        const filePromises = data
          .filter((item: any) => item.type === 'file' && item.name.endsWith('.json'))
          .map(async (item: any) => {
            const fileResponse = await fetch(`${settings.githubRawUrl}/${item.name}`);
            if (!fileResponse.ok) {
              throw new Error(`Failed to fetch task list: ${fileResponse.statusText}`);
            }
            const jsonData = await fileResponse.json();
            return { name: jsonData.name, url: item.download_url };
          });

        const filesData = await Promise.all(filePromises);
        setAvailableLists(filesData);
      } catch (error: any) {
        console.error('Error fetching task lists:', error);
        setFetchError(error.message || 'Failed to fetch task lists.');
      }
    };

    fetchTaskLists();
  }, [settings]);

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
      {fetchError ? (
        <div className="text-center text-red-500 font-semibold mb-4">
          {fetchError}
          <button onClick={() => fetchTaskLists()} className="mt-2 text-blue-500 hover:underline">
            Retry
          </button>
        </div>
      ) : availableLists.length > 0 ? (
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
