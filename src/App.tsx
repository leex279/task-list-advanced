import React, { useState, useEffect } from 'react';
import { CheckSquare, Settings } from 'lucide-react';
import { Task } from './types/task';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { ImportExport } from './components/ImportExport';
import { TaskListSelector } from './components/TaskListSelector';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_GITHUB_TASKLISTS_URL = import.meta.env.VITE_DEFAULT_GITHUB_TASKLISTS_URL;
const DEFAULT_GITHUB_REPO_URL = import.meta.env.VITE_DEFAULT_GITHUB_REPO_URL;
const DEFAULT_GITHUB_RAW_URL = import.meta.env.VITE_DEFAULT_GITHUB_RAW_URL;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableLists, setAvailableLists] = useState<{ name: string; url: string }[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem('settings');
    return storedSettings ? JSON.parse(storedSettings) : {
      githubRepo: DEFAULT_GITHUB_REPO_URL,
      githubTaskLists: DEFAULT_GITHUB_TASKLISTS_URL,
      githubRawUrl: DEFAULT_GITHUB_RAW_URL,
    };
  });

  const fetchTaskLists = async () => {
    try {
      const response = await fetch(settings.githubTaskLists);
      if (!response.ok) {
        throw new Error(`Failed to fetch task lists: ${response.statusText}`);
      }
      const data = await response.json();
      const filePromises = data
        .filter((item: any) => item.type === 'file' && item.name.endsWith('.json'))
        .map(async (item: any) => {
          const fileResponse = await fetch(`${settings.githubRawUrl}/${item.name}`);
          if (!fileResponse.ok) {
            throw new Error(`Failed to fetch task list: ${fileResponse.statusText}`);
          }
          const jsonData = await fileResponse.json();
          return { name: jsonData.name, url: item.download_url };
        });

      const filesData = await Promise.all(filePromises);
      setAvailableLists(filesData);
    } catch (error) {
      console.error('Error fetching task lists:', error);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, [settings]);

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const addTask = (
    text: string,
    isHeadline: boolean,
    codeBlock?: { language: string; code: string }
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      isHeadline,
      createdAt: new Date(),
      codeBlock,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (
    id: string,
    text: string,
    codeBlock?: { language: string; code: string }
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text, codeBlock } : task
      )
    );
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const checkAllSubTasks = (headlineId: string) => {
    setTasks((prevTasks) => {
      const headline = prevTasks.find((task) => task.id === headlineId);
      if (!headline) return prevTasks;

      const newTasks = prevTasks.map((task, index) => {
        if (task.id === headlineId) {
          return { ...task, completed: !isAllSubTasksCompleted(prevTasks, task.id) };
        }
        if (task.isHeadline) {
          return task;
        }
        let i = index - 1;
        while (i >= 0 && !prevTasks[i].isHeadline) {
          i--;
        }
        if (i >= 0 && prevTasks[i].id === headlineId) {
          return { ...task, completed: !isAllSubTasksCompleted(prevTasks, headlineId) };
        }
        return task;
      });
      return newTasks;
    });
  };

  const isAllSubTasksCompleted = (tasks: Task[], headlineId: string) => {
    let allCompleted = true;
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.isHeadline) continue;
      let j = i - 1;
      while (j >= 0 && !tasks[j].isHeadline) {
        j--;
      }
      if (j >= 0 && tasks[j].id === headlineId) {
        if (!t.completed) {
          allCompleted = false;
          break;
        }
      }
    }
    return allCompleted;
  };

  const handleImportTaskList = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const handleLogoClick = () => {
    if (tasks.length > 0) {
      setShowConfirmationModal(true);
    } else {
      window.location.reload();
    }
  };

  const handleConfirmReload = () => {
    window.location.reload();
  };

  const handleCancelReload = () => {
    setShowConfirmationModal(false);
  };

  const handleSettingsSave = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    fetchTaskLists();
  };

  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setShowSettingsModal(true)}
          className="text-gray-400 hover:text-gray-600"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <span className="beta-badge">beta</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <CheckSquare size={32} className="text-blue-500" />
              <h1 className="text-2xl font-semibold text-gray-900">Task List Advanced</h1>
            </div>
            <ImportExport tasks={tasks} onImport={setTasks} />
          </div>
          <TaskInput onAddTask={addTask} />
        </div>
        {tasks.length > 0 ? (
          <>
            {totalTasks > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            )}
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onReorder={reorderTasks}
              onCheckAllSubTasks={checkAllSubTasks}
            />
          </>
        ) : (
          <>
            <h2 className="text-center text-gray-500 font-semibold mb-4">Load Community Lists</h2>
            <TaskListSelector availableLists={availableLists} onImportTaskList={handleImportTaskList} settings={settings} />
          </>
        )}
      </div>
      <footer className="text-center p-4 text-gray-500">
        <a href={settings.githubRepo} target="_blank" rel="noopener noreferrer" className="hover:underline">
          GitHub Repository
        </a>
      </footer>
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmReload}
          onCancel={handleCancelReload}
          tasks={tasks}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSettingsSave}
          initialSettings={settings}
        />
      )}
    </div>
  );
}
