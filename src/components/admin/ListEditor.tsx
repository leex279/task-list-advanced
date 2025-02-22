import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { TaskInput } from '../TaskInput';
import { TaskList } from '../TaskList';
import { Task } from '../../types/task';
import { saveTaskList } from '../../services/taskListService';
import { getCategories } from '../../services/categoryService';

interface ListEditorProps {
  list?: {
    id?: string;
    name: string;
    data: Task[];
    is_example?: boolean;
    categories?: string[];
  };
  onSave: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export function ListEditor({ list, onSave, onCancel, onError }: ListEditorProps) {
  const [name, setName] = useState(list?.name || '');
  const [tasks, setTasks] = useState<Task[]>(list?.data || []);
  const [isExample, setIsExample] = useState(list?.is_example || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(list?.categories || []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setAvailableCategories(data.map(cat => cat.name).sort());
      } catch (error) {
        console.error('Error fetching categories:', error);
        onError('Failed to load categories');
      }
    };

    fetchCategories();
  }, [onError]);

  const handleSave = async () => {
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
      await saveTaskList(name, tasks, isExample, selectedCategories);
      onSave();
    } catch (error) {
      console.error('Error saving list:', error);
      onError('Failed to save task list');
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
      createdAt: new Date(),
      codeBlock,
      richText,
      optional
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter((task) => task.id !== id));
  };

  const editTask = (
    id: string,
    text: string,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === id ? { ...task, text, codeBlock, richText, optional } : task
      )
    );
  };

  const duplicateTask = (id: string) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      const taskToDuplicate = tasks[taskIndex];
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date()
      };
      
      const newTasks = [...tasks];
      newTasks.splice(taskIndex + 1, 0, duplicatedTask);
      setTasks(newTasks);
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Back to list"
                >
                  <ArrowLeft size={24} />
                </button>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter list name"
                  className="text-2xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 bg-transparent"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isExample}
                    onChange={(e) => setIsExample(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Save as example</span>
                </label>
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim() || tasks.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save List'}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative">
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-3 py-2 text-sm bg-white border rounded-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedCategories.length === 0 ? 'Select Categories' : `${selectedCategories.length} categories`}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {category}
                        <button
                          onClick={() => toggleCategory(category)}
                          className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-10 py-1">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <TaskInput onAddTask={addTask} />
            
            {tasks.length > 0 && (
              <div className="mt-8">
                <TaskList
                  tasks={tasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  onDuplicate={duplicateTask}
                  onReorder={reorderTasks}
                  onCheckAllSubTasks={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}