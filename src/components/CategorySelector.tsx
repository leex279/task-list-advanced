import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

export function CategorySelector({ selectedCategories, onUpdateCategories }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const availableCategories = [
    'installation',
    'deployment',
    'configuration',
    'tutorial',
    'example',
    'documentation',
    'setup',
    'guide'
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onUpdateCategories(selectedCategories.filter(c => c !== category));
    } else {
      onUpdateCategories([...selectedCategories, category]);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onUpdateCategories([...selectedCategories, newCategory.trim().toLowerCase()]);
      setNewCategory('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map(category => (
          <div
            key={category}
            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {category}
            <button
              onClick={() => toggleCategory(category)}
              className="hover:text-blue-900"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 rounded-full text-sm border border-gray-200 hover:border-gray-300"
        >
          <Tag size={14} />
          {selectedCategories.length === 0 ? 'Add categories' : 'Edit categories'}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {availableCategories.map(category => (
              <label
                key={category}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}