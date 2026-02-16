import React, { useState, useEffect } from 'react';
import { getTaskLists, deleteTaskList, TaskList, saveTaskList } from '../../services/taskListService';
import { Edit2, Trash2, Plus, ArrowLeft, Upload } from 'lucide-react';
import { ListEditor } from './ListEditor';
import { SaveImportModal } from '../SaveImportModal';
import { Task } from '../../types/task';

interface AdminDashboardProps {
  onClose: () => void;
  onError: (error: string) => void;
}

export function AdminDashboard({ onClose, onError }: AdminDashboardProps) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [showSaveImportModal, setShowSaveImportModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
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

  const onSave = () => {
    setShowSaveImportModal(false);
    fetchLists();
  }

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);
            if (parsed.data) {
              setTasks(parsed.data);
              setShowSaveImportModal(true);
            }
          } catch (error) {
            console.error('Error parsing imported file:', error);
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  const handleSaveImport = async (name: string, isExample: boolean) => {
    if (!name.trim()) {
      onError('Please enter a name for the list');
      return;
    }

    if (tasks.length === 0) {
      onError('Please add at least one task to the list');
      return;
    }

    setSaving(true);
    try {
      await saveTaskList(name, tasks, isExample);
      onSave();
    } catch (error) {
      console.error('Error saving list:', error);
      onError('Failed to save task list');
    } finally {
      setSaving(false);
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
      <div className="min-h-screen bg-surface-50 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-card border border-surface-200">
          {/* Header */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-surface-200">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                title="Back to main app"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-semibold text-surface-900">Task Lists</h2>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleImport}
                className="btn btn-ghost"
                title="Import tasks"
                disabled={saving}
              >
                <Upload size={16} />
                Import
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                New List
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((list) => (
                    <tr key={list.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 font-medium">
                        {list.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {list.is_example ? (
                          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                            Example
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {new Date(list.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingList(list)}
                            className="p-1 text-primary-500 hover:text-primary-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            title="Edit list"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(list.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
      {showSaveImportModal && (
        <SaveImportModal
          onClose={() => setShowSaveImportModal(false)}
          onSave={handleSaveImport}
        />
      )}

    </div>
  );
}
