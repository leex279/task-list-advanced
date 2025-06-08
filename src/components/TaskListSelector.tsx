import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types/task';

interface TaskListSelectorProps {
  exampleLists: { name: string; data: Task[] }[];
}

export function TaskListSelector({
  exampleLists,
}: TaskListSelectorProps) {
  const navigate = useNavigate();

  const handleListSelection = (listName: string) => {
    const slug = listName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    navigate(`/list/${slug}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {exampleLists.map((list) => (
        <button
          key={list.name}
          onClick={() => handleListSelection(list.name)}
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