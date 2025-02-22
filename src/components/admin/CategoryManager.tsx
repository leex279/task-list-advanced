import React, { useState, useEffect } from 'react';
import { Plus, X, Loader } from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';

interface CategoryManagerProps {
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
  onError: (error: string) => void;
}

export function CategoryManager({ categories, onUpdateCategories, onError }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      onUpdateCategories(data.map(cat => cat.name));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      onError('Failed to load categories');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const categoryName = newCategory.trim().toLowerCase();
    if (categories.includes(categoryName)) {
      onError('Category already exists');
      return;
    }

    setSaving(true);
    try {
      await createCategory(categoryName);
      await fetchCategories();
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
      onError('Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setSaving(true);
    try {
      await deleteCategory(categoryName);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      onError('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 flex justify-center">
        <Loader className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage categories for task lists
        </p>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new category"
            className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={saving}
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim() || saving}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {category}
              <button
                onClick={() => handleDeleteCategory(category)}
                className="hover:text-purple-900 disabled:opacity-50"
                disabled={saving}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
}