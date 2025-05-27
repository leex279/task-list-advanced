import React, { useState } from 'react';
import { ArrowLeft, Save, ListPlus } from 'lucide-react'; // Added ListPlus for TaskInput section
import { TaskInput } from '../TaskInput'; // Assumed to be refactored
import { TaskList } from '../TaskList';   // Assumed to be refactored
import { Task } from '../../types/task';
import { saveTaskList } from '../../services/taskListService'; // Assuming this handles both create and update based on list.id

interface ListEditorProps {
  list?: { // If list is provided, it's an edit operation
    id?: string; // ID will be present for existing lists
    name: string;
    data: Task[];
    is_example?: boolean;
  };
  onSave: () => void; // Callback after successful save
  onCancel: () => void; // Callback to cancel editing/creating
  onError: (error: string) => void; // Callback for error reporting
}

export function ListEditor({ list, onSave, onCancel, onError }: ListEditorProps) {
  const [name, setName] = useState(list?.name || '');
  const [tasks, setTasks] = useState<Task[]>(list?.data || []);
  const [isExample, setIsExample] = useState(list?.is_example || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      onError('Please enter a name for the task list.');
      return;
    }
    if (tasks.length === 0) {
      onError('A task list cannot be empty. Please add at least one task.');
      return;
    }

    setSaving(true);
    try {
      // Pass list.id if it exists, for update operation
      await saveTaskList(name.trim(), tasks, isExample, list?.id); 
      onSave();
    } catch (error) {
      console.error('Error saving list:', error);
      onError(`Failed to save task list: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const addTask = (
    text: string,
    isHeadline: boolean,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      isHeadline,
      createdAt: new Date(), // Ensure createdAt is always set
      codeBlock,
      richText,
      optional,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (
    id: string,
    text: string,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean,
    isHeadline?: boolean // Added isHeadline from TaskEditForm's onSave
  ) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text, codeBlock, richText, optional, isHeadline } : task
      )
    );
  };

  const duplicateTask = (id: string) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      const taskToDuplicate = { ...tasks[taskIndex] };
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: crypto.randomUUID(),
        completed: false, // Reset completion status
        createdAt: new Date(), // Reset creation date
      };
      const newTasks = [...tasks];
      newTasks.splice(taskIndex + 1, 0, duplicatedTask);
      setTasks(newTasks);
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };
  
  // Handler for checking/unchecking all subtasks of a headline - currently a no-op in editor
  const handleCheckAllSubTasks = (headlineId: string) => {
    // This functionality is more relevant in the main app view, not typically during list creation/editing.
    // If needed, logic to find subtasks and toggle their 'completed' status would go here.
    console.log(`Check/uncheck all subtasks for headline: ${headlineId} (no-op in editor)`);
  };


  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={onCancel}
                  className="btn btn-ghost btn-circle"
                  title="Back to lists"
                  aria-label="Back to lists"
                >
                  <ArrowLeft size={24} />
                </button>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter List Name..."
                  className="input input-ghost text-2xl font-bold text-base-content p-1 flex-grow" // Adjusted for better look
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="form-control w-full sm:w-auto">
                  <label className="label cursor-pointer p-0 sm:justify-end">
                    <span className="label-text text-sm mr-2">Save as Example List</span>
                    <input
                      type="checkbox"
                      checked={isExample}
                      onChange={(e) => setIsExample(e.target.checked)}
                      className="toggle toggle-accent toggle-sm"
                    />
                  </label>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim() || tasks.length === 0}
                  className="btn btn-primary btn-sm sm:btn-md" // Responsive button size
                >
                  <Save size={18} className="mr-2" />
                  {saving ? <span className="loading loading-spinner loading-xs"></span> : (list?.id ? 'Update List' : 'Save List')}
                </button>
              </div>
            </div>

            {/* Task Input Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center">
                <ListPlus size={20} className="mr-2 text-secondary" /> Add Tasks
              </h2>
              <TaskInput onAddTask={addTask} />
            </div>
            
            {/* Task List Section */}
            {tasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-base-content mb-2">Current Tasks in List</h2>
                <div className="bg-base-200 p-2 sm:p-4 rounded-box"> {/* Added a subtle background for task list area */}
                  <TaskList
                    tasks={tasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onDuplicate={duplicateTask}
                    onReorder={reorderTasks}
                    onCheckAllSubTasks={handleCheckAllSubTasks} // Pass the handler
                  />
                </div>
              </div>
            )}
             {tasks.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-base-content/70">This list is currently empty.</p>
                  <p className="text-sm text-base-content/60">Add some tasks using the form above.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}