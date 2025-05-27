import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 as Loader, Tag } from 'lucide-react'; // Using Loader2 for a different spin animation
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';

interface CategoryManagerProps {
  // categories prop might be redundant if fetched internally, but can be used for initial state or if managed externally
  // For now, assuming it's mainly for onUpdateCategories callback
  onUpdateCategories: (categories: string[]) => void;
  onError: (error: string) => void;
}

export function CategoryManager({ onUpdateCategories, onError }: CategoryManagerProps) {
  const [internalCategories, setInternalCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial fetch

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      const categoryNames = data.map(cat => cat.name);
      setInternalCategories(categoryNames);
      onUpdateCategories(categoryNames); // Notify parent about the fetched categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      onError('Failed to load categories. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      onError('Category name cannot be empty.');
      return;
    }
    
    const categoryName = newCategory.trim().toLowerCase();
    if (internalCategories.includes(categoryName)) {
      onError(`Category "${categoryName}" already exists.`);
      setNewCategory(''); // Clear input even if category exists
      return;
    }

    setSaving(true);
    try {
      await createCategory(categoryName);
      // Refetch all categories to ensure consistency and get new IDs/data if any
      await fetchCategories(); 
      setNewCategory(''); // Clear input on success
    } catch (error) {
      console.error('Error adding category:', error);
      onError(`Failed to add category "${categoryName}". It might already exist or there was a server error.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    // Consider using a custom ConfirmationModal here
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This might affect existing task lists.`)) return;

    setSaving(true);
    try {
      await deleteCategory(categoryName);
      await fetchCategories(); // Refetch to update the list
    } catch (error) {
      console.error('Error deleting category:', error);
      onError(`Failed to delete category "${categoryName}".`);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if it's part of a form
      handleAddCategory();
    }
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center p-8">
          <span className="loading loading-lg loading-spinner text-primary"></span>
          <p className="text-base-content/70 mt-4">Loading Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center mb-4 pb-3 border-b border-base-300">
          <Tag size={20} className="text-accent mr-3 shrink-0" />
          <h2 className="card-title text-lg sm:text-xl text-base-content">Manage Categories</h2>
        </div>
        <p className="text-sm text-base-content/70 mb-4">
          Add or remove categories available for organizing task lists.
        </p>

        <div className="form-control mb-6">
          <label className="label"><span className="label-text">Add New Category</span></label>
          <div className="join w-full">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 'documentation', 'bugfix'"
              className="input input-bordered join-item flex-grow"
              disabled={saving}
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || saving}
              className="btn btn-primary join-item"
            >
              {saving ? <span className="loading loading-xs loading-spinner"></span> : <Plus size={18} />}
              Add
            </button>
          </div>
        </div>

        <h3 className="text-md font-semibold text-base-content mb-3">Available Categories:</h3>
        {internalCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {internalCategories.map((category) => (
              <div
                key={category}
                className="badge badge-lg badge-secondary badge-outline group" // Larger badges, secondary color
              >
                <span>{category}</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="ml-2 btn btn-xs btn-ghost btn-circle opacity-50 group-hover:opacity-100 transition-opacity"
                  disabled={saving}
                  aria-label={`Delete category ${category}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-base-content/70 italic">No categories defined yet. Add some above!</p>
        )}
      </div>
    </div>
  );
}