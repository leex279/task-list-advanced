import React, { useState, useEffect } from 'react';
import { getTaskLists, deleteTaskList, TaskList } from '../../services/taskListService';
import { Edit2, Trash2, Plus, ArrowLeft, ListPlus, Eye } from 'lucide-react'; // Added ListPlus, Eye
import { ListEditor } from './ListEditor'; // Assuming ListEditor will also be styled

interface AdminDashboardProps {
  onClose: () => void; // Function to close the admin dashboard and return to main app
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
    setLoading(true); // Ensure loading is true when fetching
    try {
      const data = await getTaskLists();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      onError('Failed to load task lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Consider using a custom ConfirmationModal here if available and styled
    if (!confirm('Are you sure you want to delete this task list? This action cannot be undone.')) return;

    try {
      await deleteTaskList(id);
      setLists(lists.filter(list => list.id !== id));
      // Optionally, show a success message
    } catch (error) {
      console.error('Error deleting list:', error);
      onError('Failed to delete task list. Please check permissions or try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center p-4">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (editingList || isCreating) {
    return (
      <ListEditor
        list={editingList || undefined} // Pass undefined if creating a new list
        onSave={() => {
          setEditingList(null);
          setIsCreating(false);
          fetchLists(); // Refresh lists after saving
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
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0 sm:p-2"> {/* Adjusted padding */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-circle"
                  title="Back to main app"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-base-content">Manage Task Lists</h1>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary btn-sm sm:btn-md" // Responsive button size
              >
                <ListPlus size={18} className="mr-2" />
                Create New List
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {lists.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-base-content/70">No task lists found.</p>
                  <p className="text-sm text-base-content/60 mt-2">Get started by creating a new list.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Last Updated</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lists.map((list) => (
                        <tr key={list.id} className="hover">
                          <td className="font-medium text-base-content">{list.name}</td>
                          <td>
                            {list.is_example ? (
                              <span className="badge badge-accent badge-outline">Example</span>
                            ) : (
                              <span className="badge badge-secondary badge-outline">Custom</span>
                            )}
                          </td>
                          <td>{new Date(list.updated_at || list.created_at).toLocaleDateString()}</td>
                          <td className="text-right">
                            <div className="join">
                              <button
                                onClick={() => setEditingList(list)}
                                className="btn btn-ghost btn-xs join-item text-info"
                                title="Edit list"
                              >
                                <Edit2 size={16} />
                              </button>
                              {/* Placeholder for a view button if needed in future */}
                              {/* <button className="btn btn-ghost btn-xs join-item" title="View list (read-only)"><Eye size={16} /></button> */}
                              <button
                                onClick={() => handleDelete(list.id)}
                                className="btn btn-ghost btn-xs join-item text-error"
                                title="Delete list"
                                disabled={list.is_example} // Optionally disable delete for example lists
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}