import React from 'react';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  exampleLists: { name: string; data: Task[] }[];
  onImportTaskList: (tasks: Task[]) => void;
}

export function TaskListSelector({
  exampleLists,
  onImportTaskList,
}: TaskListSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {exampleLists.map((list) => (
        <button
          key={list.name}
          onClick={() => onImportTaskList(list.data)}
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