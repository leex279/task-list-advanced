import React, { useState, useEffect } from 'react';
import { getTaskLists, deleteTaskList, TaskList } from '../../services/taskListService';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { ListEditor } from './ListEditor';

interface AdminDashboardProps {
  onClose: () => void;
  onError: (error: string) => void;
}

export function AdminDashboard({ onClose, onError }: AdminDashboardProps) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New List
            </button>
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
                  {lists.map((list) => (
                    <tr key={list.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {list.name}
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
  );
}