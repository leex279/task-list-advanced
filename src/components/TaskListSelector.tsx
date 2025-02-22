import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { ChevronDown } from 'lucide-react';
import { getCategories } from '../services/categoryService';

interface TaskListSelectorProps {
  exampleLists: { name: string; data: Task[]; categories?: string[] }[];
  onImportTaskList: (tasks: Task[]) => void;
}

export function TaskListSelector({
  exampleLists,
  onImportTaskList,
}: TaskListSelectorProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{
    original: string;
    lower: string;
  }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('[TaskListSelector] Fetching categories...');
        const data = await getCategories();
        console.log('[TaskListSelector] Fetched categories:', data);
        
        const formattedCategories = data.map(cat => ({
          original: cat.name,
          lower: cat.name.toLowerCase()
        })).sort((a, b) => a.lower.localeCompare(b.lower));
        
        console.log('[TaskListSelector] Formatted categories:', formattedCategories);
        setAvailableCategories(formattedCategories);
      } catch (error) {
        console.error('[TaskListSelector] Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Filter lists by selected categories
  const filteredLists = exampleLists.filter(list => {
    console.log('\n[TaskListSelector] Filtering list:', {
      listName: list.name,
      listCategories: list.categories,
      selectedCategories: selectedCategories
    });

    if (selectedCategories.length === 0) {
      console.log('[TaskListSelector] No categories selected, showing all lists');
      return true;
    }
    
    if (!list.categories || !Array.isArray(list.categories) || list.categories.length === 0) {
      console.log('[TaskListSelector] List has no categories, filtering out');
      return false;
    }
    
    const listCategoriesLower = list.categories.map(cat => cat.toLowerCase());
    console.log('[TaskListSelector] List categories (lowercase):', listCategoriesLower);
    
    const hasMatchingCategory = selectedCategories.some(selectedCat => {
      const matches = listCategoriesLower.includes(selectedCat.toLowerCase());
      console.log('[TaskListSelector] Checking category match:', {
        selectedCategory: selectedCat,
        matches: matches
      });
      return matches;
    });

    console.log('[TaskListSelector] List matches filter:', hasMatchingCategory);
    return hasMatchingCategory;
  });

  console.log('[TaskListSelector] Filtered lists result:', {
    totalLists: exampleLists.length,
    filteredLists: filteredLists.length,
    filteredListNames: filteredLists.map(l => l.name)
  });

  const toggleCategory = (category: string) => {
    console.log('[TaskListSelector] Toggling category:', {
      category: category,
      currentlySelected: selectedCategories
    });

    setSelectedCategories(prev => {
      const categoryLower = category.toLowerCase();
      const newCategories = prev.includes(categoryLower)
        ? prev.filter(c => c !== categoryLower)
        : [...prev, categoryLower];
      
      console.log('[TaskListSelector] New selected categories:', newCategories);
      return newCategories;
    });
  };

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
            <span>
              {selectedCategories.length === 0 
                ? 'All Categories' 
                : `${selectedCategories.length} selected`}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-10 py-1">
              <div className="p-2 border-b">
                <button
                  onClick={() => {
                    console.log('[TaskListSelector] Clearing all categories');
                    setSelectedCategories([]);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear all
                </button>
              </div>
              {availableCategories.map(({ original, lower }) => (
                <label
                  key={lower}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(lower)}
                    onChange={() => toggleCategory(lower)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{original}</span>
                </label>
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
                    className={`px-1.5 py-0.5 text-xs font-medium rounded-full truncate max-w-[80px] ${
                      selectedCategories.includes(category.toLowerCase())
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
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