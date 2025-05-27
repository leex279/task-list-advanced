import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

export function CategorySelector({ selectedCategories, onUpdateCategories }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Consider making this prop or fetching dynamically if categories change often
  const availableCategories = [
    'installation', 'deployment', 'configuration', 'tutorial', 
    'example', 'documentation', 'setup', 'guide', 'bugfix', 
    'feature', 'refactor', 'testing', 'performance', 'security'
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onUpdateCategories(selectedCategories.filter(c => c !== category));
    } else {
      onUpdateCategories([...selectedCategories, category]);
    }
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim().toLowerCase();
    if (trimmedCategory && !selectedCategories.includes(trimmedCategory)) { // Prevent adding duplicates
      onUpdateCategories([...selectedCategories, trimmedCategory]);
    }
    setNewCategory(''); // Clear input regardless of whether category was added
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {selectedCategories.map(category => (
          <div
            key={category}
            className="badge badge-primary badge-outline gap-1" // Use daisyUI badge
          >
            {category}
            <button
              onClick={() => toggleCategory(category)}
              className="btn btn-xs btn-ghost btn-circle p-0" // Make remove button subtle
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-sm btn-outline btn-secondary" // Button to open/close selector
        >
          <Tag size={16} />
          {selectedCategories.length === 0 ? 'Add Categories' : 'Edit Categories'}
        </button>
      </div>

      {isOpen && (
        <div className="card bg-base-200 shadow-xl p-4 mt-2">
          <div className="form-control mb-4">
            <label className="label"><span className="label-text">Add New Category</span></label>
            <div className="join">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Type and press Enter or click Add"
                className="input input-sm input-bordered join-item flex-1"
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
                className="btn btn-sm btn-primary join-item"
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Available Categories</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-base-100 rounded-md">
              {availableCategories.filter(cat => !selectedCategories.includes(cat)).map(category => ( // Show only unselected
                <label
                  key={category}
                  className="label cursor-pointer hover:bg-base-300 rounded-md p-2 transition-colors"
                >
                  <span className="label-text">{category}</span>
                  <input
                    type="checkbox"
                    // checked={selectedCategories.includes(category)} // This is handled by filtering
                    onChange={() => toggleCategory(category)}
                    className="checkbox checkbox-sm checkbox-accent"
                  />
                </label>
              ))}
            </div>
          </div>
           <div className="card-actions justify-end mt-4">
            <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-ghost">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}