import React, { useState, useEffect } from 'react';
import { getTaskLists, deleteTaskList, updateTaskCategories, TaskList } from '../../services/taskListService';
import { Edit2, Trash2, Plus, ArrowLeft, Check, X, ChevronDown } from 'lucide-react';
import { ListEditor } from './ListEditor';
import { CategoryManager } from './CategoryManager';

interface AdminDashboardProps {
  onClose: () => void;
  onError: (error: string) => void;
  onEditList?: (list: TaskList) => void;
}

interface EditingCategory {
  listId: string;
  categories: string[];
}

export function AdminDashboard({ onClose, onError, onEditList }: AdminDashboardProps) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const data = await getTaskLists();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      onError('Failed to load task lists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this list?')) return;

    try {
      await deleteTaskList(id);
      setLists(lists.filter(list => list.id !== id));
    } catch (error) {
      console.error('Error deleting list:', error);
      onError('Failed to delete task list');
    }
  };

  const handleCategoryEdit = async (listId: string, categories: string[]) => {
    try {
      await updateTaskCategories(listId, categories);
      setLists(lists.map(list => 
        list.id === listId ? { ...list, categories } : list
      ));
      setEditingCategory(null);
      setDropdownOpen(null);
    } catch (error) {
      console.error('Error updating categories:', error);
      onError('Failed to update categories');
    }
  };

  const handleUpdateCategories = async (newCategories: string[]) => {
    setExistingCategories(newCategories);
  };

  // Get unique categories from all lists
  const categories = ['all', ...existingCategories];

  // Filter lists by selected category
  const filteredLists = lists.filter(list => 
    selectedCategory === 'all' || 
    (list.categories && list.categories.includes(selectedCategory))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (editingList || isCreating) {
    return (
      <ListEditor
        list={editingList || undefined}
        onSave={() => {
          setEditingList(null);
          setIsCreating(false);
          fetchLists();
        }}
        onCancel={() => {
          setEditingList(null);
          setIsCreating(false);
        }}
        onError={onError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Category Manager */}
          <CategoryManager
            categories={existingCategories}
            onUpdateCategories={handleUpdateCategories}
            onError={onError}
          />

          {/* Task Lists */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 flex justify-between items-center border-b">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Back to main app"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-semibold text-gray-900">Task Lists</h2>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-sm bg-white text-gray-700 rounded-md border border-gray-200 
                    hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} />
                  New List
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLists.map((list) => (
                      <tr key={list.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {list.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="relative">
                            <button
                              onClick={() => {
                                setDropdownOpen(dropdownOpen === list.id ? null : list.id);
                                setEditingCategory({
                                  listId: list.id,
                                  categories: list.categories || []
                                });
                              }}
                              className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition-colors w-full text-left"
                            >
                              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                                {list.categories && list.categories.length > 0 ? (
                                  list.categories.map(category => (
                                    <span key={category} className="px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                                      {category}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                                    Uncategorized
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform ${dropdownOpen === list.id ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {dropdownOpen === list.id && (
                              <div className="absolute left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-10 p-3">
                                <div className="space-y-2">
                                  {existingCategories.map(category => (
                                    <label
                                      key={category}
                                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editingCategory?.categories.includes(category)}
                                        onChange={(e) => {
                                          if (editingCategory) {
                                            const newCategories = e.target.checked
                                              ? [...editingCategory.categories, category]
                                              : editingCategory.categories.filter(c => c !== category);
                                            setEditingCategory({
                                              ...editingCategory,
                                              categories: newCategories
                                            });
                                          }
                                        }}
                                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="text-sm text-gray-700">{category}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                                  <button
                                    onClick={() => {
                                      setDropdownOpen(null);
                                      setEditingCategory(null);
                                    }}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (editingCategory) {
                                        handleCategoryEdit(editingCategory.listId, editingCategory.categories);
                                      }
                                    }}
                                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {list.is_example ? (
                            <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                              Example
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                              Custom
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(list.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingList(list)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit list"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(list.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete list"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}