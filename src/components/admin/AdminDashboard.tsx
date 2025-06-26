import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskLists, deleteTaskList, TaskList, saveTaskList } from '../../services/taskListService';
import { Edit2, Trash2, Plus, ArrowLeft, Upload, Download } from 'lucide-react';
import { ListEditor } from './ListEditor';
import { SaveImportModal } from '../SaveImportModal';
import { ExportModal } from '../ExportModal';
import { Task } from '../../types/task';

interface AdminDashboardProps {
  onClose: () => void;
  onError: (error: string) => void;
}

export function AdminDashboard({ onClose, onError }: AdminDashboardProps) {
  const { listName } = useParams<{ listName: string }>();
  const navigate = useNavigate();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [showSaveImportModal, setShowSaveImportModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportingList, setExportingList] = useState<TaskList | null>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (listName && lists.length > 0) {
      const normalizeForMatching = (str: string) => 
        str.toLowerCase().replace(/[-:+.]/g, ' ').replace(/\s+/g, ' ').trim();
      
      const normalizedUrlListName = normalizeForMatching(listName.replace(/-/g, ' '));
      
      const matchedList = lists.find(list => 
        normalizeForMatching(list.name) === normalizedUrlListName
      );
      
      if (matchedList) {
        setEditingList(matchedList);
        setTasks(matchedList.data);
      }
    }
  }, [listName, lists]);

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
          if (listName) {
            navigate('/admin');
          } else {
            setEditingList(null);
            setIsCreating(false);
          }
          fetchLists();
        }}
        onCancel={() => {
          if (listName) {
            navigate('/admin');
          } else {
            setEditingList(null);
            setIsCreating(false);
          }
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

            <div className='flex gap-3'>
              <button
                onClick={handleImport}
                className="import-export-button flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="Import tasks"
                disabled={saving}
              >
                <Upload size={16} />
                Import
              </button>
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
                            onClick={() => {
                              setExportingList(list);
                              setShowExportModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Export list"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const slug = list.name
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^a-z0-9-]/g, '');
                              navigate(`/admin/list/${slug}`);
                            }}
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
      {showSaveImportModal && (
        <SaveImportModal
          onClose={() => setShowSaveImportModal(false)}
          onSave={handleSaveImport}
        />
      )}

      {showExportModal && exportingList && (
        <ExportModal
          taskListName={exportingList.name}
          onClose={() => {
            setShowExportModal(false);
            setExportingList(null);
          }}
        />
      )}

    </div>
  );
}