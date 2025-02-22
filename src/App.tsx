import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskListSection } from './components/TaskListSection';
import { Footer } from './components/Footer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { ErrorNotification } from './components/ErrorNotification';
import { IntroModal } from './components/IntroModal';
import { Tour } from './components/tour/Tour';

export default function App() {
  const [settings, setSettings] = useSettings();
  const {
    tasks,
    setTasks,
    addTask,
    duplicateTask,
    toggleTask,
    deleteTask,
    editTask,
    reorderTasks
  } = useTasks();

  const [availableLists, setAvailableLists] = useState<{ name: string; url: string }[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    return !hasSeenTour && !settings.googleApiKey;
  });

  const fetchTaskLists = async () => {
    const localFiles = [
      '/tasklists/simple-example-list.json',
      '/tasklists/windows-bolt-install.json',
      '/tasklists/bolt-cloudflare-deployment.json',
      '/tasklists/macOS-install-bolt-diy.json',
      '/tasklists/ollama-installation-bolt.json',
      '/tasklists/bolt-diy-vps-install.json',
      '/tasklists/bolt-diy-github-pages-deployment.json',
    ];
    
    try {
      const filePromises = localFiles.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch local task list: ${response.statusText}`);
        }
        const data = await response.json();
        return { name: data.name, url: path };
      });

      const results = await Promise.all(filePromises);
      setAvailableLists(results);
    } catch (error) {
      console.error('Error fetching local task lists:', error);
      setError('Failed to load task lists.');
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  useEffect(() => {
    if (!showTour) {
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [showTour]);

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

  const handleSettingsSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
  };

  const checkAllSubTasks = (headlineId: string) => {
    setTasks((prevTasks) => {
      const isAllCompleted = prevTasks.every(task => 
        task.isHeadline || task.completed || !isSubTaskOf(task, headlineId, prevTasks)
      );
      
      return prevTasks.map(task => {
        if (task.id === headlineId || isSubTaskOf(task, headlineId, prevTasks)) {
          return { ...task, completed: !isAllCompleted };
        }
        return task;
      });
    });
  };

  const isSubTaskOf = (task: Task, headlineId: string, tasks: Task[]) => {
    if (task.isHeadline) return false;
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    for (let i = taskIndex; i >= 0; i--) {
      if (tasks[i].isHeadline) {
        return tasks[i].id === headlineId;
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="beta-badge">beta</span>
      </div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <Header
            onLogoClick={handleLogoClick}
            onSettingsClick={() => setShowSettingsModal(true)}
            tasks={tasks}
            onImport={setTasks}
          />
          <TaskInput onAddTask={addTask} />
        </div>
        <TaskListSection
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onDuplicate={duplicateTask}
          onReorder={reorderTasks}
          onCheckAllSubTasks={checkAllSubTasks}
          availableLists={availableLists}
          onImportTaskList={setTasks}
          googleApiKey={settings.googleApiKey}
          onError={setError}
        />
      </div>
      <Footer />
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        title="Help"
      >
        <HelpCircle size={24} />
      </button>
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmReload}
          onCancel={() => setShowConfirmationModal(false)}
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
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {showTour && (
        <Tour onComplete={() => setShowTour(false)} />
      )}
    </div>
  );
}