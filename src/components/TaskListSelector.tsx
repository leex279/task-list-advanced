import React, { useState } from 'react';
import { Task } from '../types/task';
import { ChevronDown } from 'lucide-react';

interface TaskListSelectorProps {
  exampleLists: { name: string; data: Task[]; categories?: string[] }[];
  onImportTaskList: (tasks: Task[]) => void;
}

export function TaskListSelector({
  exampleLists,
  onImportTaskList,
}: TaskListSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(exampleLists.flatMap(list => list.categories || []))].sort();

  // Filter lists by selected category
  const filteredLists = exampleLists.filter(list => 
    selectedCategory === 'all' || 
    (list.categories && list.categories.includes(selectedCategory))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative inline-block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 text-sm bg-white text-gray-700 rounded-md border border-gray-200 
              hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              shadow-sm transition-all duration-200 min-w-[160px] flex items-center justify-between gap-2"
          >
            <span className="capitalize">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 py-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                    ${selectedCategory === category ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                >
                  <span className="capitalize">{category === 'all' ? 'All Categories' : category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-2">
        {filteredLists.map((list) => (
          <button
            key={list.name}
            onClick={() => onImportTaskList(list.data)}
            className="p-3 bg-white text-left rounded-lg border border-gray-200 
              hover:border-blue-300 hover:shadow-md transition-all duration-200
              group relative"
          >
            <h3 className="font-medium text-gray-900 text-sm mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {list.name}
            </h3>
            {list.categories && list.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {list.categories.slice(0, 2).map(category => (
                  <span
                    key={category}
                    className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full truncate max-w-[80px]"
                  >
                    {category}
                  </span>
                ))}
                {list.categories.length > 2 && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{list.categories.length - 2}
                  </span>
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}