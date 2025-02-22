import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
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
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { supabase, checkDatabaseConnection } from './lib/supabase';

export default function App() {
  const [settings, setSettings] = useSettings();
  const { user, loading: authLoading, isAdmin } = useAuth();
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    return !hasSeenTour;
  });

  useEffect(() => {
    let mounted = true;

    // Check database connection and first user status
    const initialize = async () => {
      try {
        // Check database connection first
        const { ok, error: connectionError } = await checkDatabaseConnection();
        if (!ok && mounted) {
          setError(connectionError || 'Failed to connect to the database');
          return;
        }

        if (!authLoading && mounted) {
          const { count, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

          if (countError) {
            if (countError.code === '42501' && mounted) {
              setIsFirstUser(true);
            } else {
              console.error('Error checking user count:', {
                code: countError.code,
                message: countError.message,
                details: countError.details
              });
              if (mounted) {
                setError('Failed to check user count. Please try again later.');
              }
            }
          } else if (mounted) {
            setIsFirstUser(!count || count === 0);
          }
        }
      } catch (error) {
        console.error('Error during initialization:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          stack: error instanceof Error ? error.stack : undefined
        });
        if (mounted) {
          setError('Failed to initialize application. Please try again later.');
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [authLoading]);

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

  const handleTourComplete = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShowTour(false);
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

  if (showAdminDashboard && isAdmin) {
    return (
      <AdminDashboard 
        onClose={() => setShowAdminDashboard(false)}
        onError={setError}
        onEditList={(list) => {
          setTasks(list.data);
          setShowAdminDashboard(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="beta-badge">beta</span>
      </div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}

      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Header
            onLogoClick={handleLogoClick}
            onSettingsClick={() => setShowSettingsModal(true)}
            onAdminClick={() => setShowAdminDashboard(true)}
            tasks={tasks}
            onImport={setTasks}
            isAdmin={isAdmin}
            user={user}
          />
          <TaskInput onAddTask={addTask} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <TaskListSection
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onDuplicate={duplicateTask}
          onReorder={reorderTasks}
          onCheckAllSubTasks={checkAllSubTasks}
          onImportTaskList={setTasks}
          googleApiKey={settings.googleApiKey}
          onError={setError}
          isAdmin={isAdmin}
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
          isAdmin={isAdmin}
        />
      )}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {showTour && (
        <Tour onComplete={handleTourComplete} />
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isFirstUser={isFirstUser}
        />
      )}
    </div>
  );
}