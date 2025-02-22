import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { TaskInput } from '../TaskInput';
import { TaskList } from '../TaskList';
import { Task } from '../../types/task';
import { saveTaskList } from '../../services/taskListService';

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
  const [categories, setCategories] = useState<string[]>(list?.categories || []);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    // Predefined categories - you can extend this list
    const defaultCategories = [
      'installation',
      'deployment',
      'configuration',
      'tutorial',
      'example',
      'documentation',
      'setup',
      'guide'
    ];
    setAvailableCategories([...new Set([...defaultCategories, ...(list?.categories || [])])].sort());
  }, [list]);

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
      await saveTaskList(name, tasks, isExample, categories);
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
    setCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !availableCategories.includes(newCategory.trim())) {
      const category = newCategory.trim().toLowerCase();
      setAvailableCategories(prev => [...prev, category].sort());
      setCategories(prev => [...prev, category]);
      setNewCategory('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewCategory();
    }
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
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="px-3 py-2 text-sm bg-white border rounded-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Select Categories
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
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

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg z-10">
                    <div className="p-2 border-b">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add new category"
                          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={addNewCategory}
                          disabled={!newCategory.trim()}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="py-1">
                      {availableCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={categories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
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