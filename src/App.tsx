import React, { useState, useEffect } from 'react';
import { HelpCircle, Shield } from 'lucide-react'; // Added Shield for Admin
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
// import { Tour } from './components/tour/Tour'; // Assuming Tour might be refactored or removed
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard'; // AdminDashboard itself handles its layout
import { supabase } from './lib/supabase';
import { Task } from './types/task'; // Ensure Task type is imported

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
    reorderTasks,
  } = useTasks();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simplified tour logic: show if no API key and tour not seen in this session
  const [showIntroModal, setShowIntroModal] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntroModal');
    return !hasSeenIntro; // Show if not seen, API key check can be inside IntroModal or a separate tour component
  });

  useEffect(() => {
    const checkFirstUser = async () => {
      if (authLoading) return; // Wait for auth to settle
      try {
        // This query assumes RLS allows non-auth users to count, or an admin/service role is used.
        // If this fails due to RLS, an alternative might be needed or handle the error gracefully.
        const { count, error: countError } = await supabase
          .from('users') // Ensure 'users' is the correct table name in your Supabase schema
          .select('*', { count: 'exact', head: true });

        if (countError) {
          // 42P01: undefined_table (table doesn't exist)
          // 42501: insufficient_privilege (RLS policy blocks access)
          if (countError.code === '42P01' || countError.code === '42501') {
             console.warn('Could not determine user count (table missing or RLS policy). Assuming not first user or handling as error.');
             // Depending on desired behavior, could assume not first user or prompt for setup.
             // For now, we'll assume it's not the first user if this check fails to avoid blocking signup.
             setIsFirstUser(false); 
          } else {
            console.error('Error checking user count:', countError.message);
            setError('Could not verify user status. Some features might be affected.');
          }
        } else {
          setIsFirstUser(count === 0);
        }
      } catch (err) {
        console.error('Exception checking first user:', err);
        setError('An unexpected error occurred while checking user status.');
      }
    };
    checkFirstUser();
  }, [authLoading]);

  const handleLogoClick = () => {
    if (tasks.length > 0) {
      setShowConfirmationModal(true);
    } else {
      window.location.reload(); // Reload if no tasks to lose
    }
  };

  const handleConfirmReload = () => {
    window.location.reload();
  };

  const handleSettingsSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
  };

  const handleIntroModalClose = () => {
    sessionStorage.setItem('hasSeenIntroModal', 'true');
    setShowIntroModal(false);
  };

  const checkAllSubTasks = (headlineId: string) => {
    setTasks(prevTasks => {
      const headlineIndex = prevTasks.findIndex(t => t.id === headlineId);
      if (headlineIndex === -1) return prevTasks;

      let allSubtasksCompleted = true;
      for (let i = headlineIndex + 1; i < prevTasks.length; i++) {
        if (prevTasks[i].isHeadline) break; // Stop at next headline
        if (!prevTasks[i].completed) {
          allSubtasksCompleted = false;
          break;
        }
      }
      
      const newCompletionState = !allSubtasksCompleted;
      return prevTasks.map((task, index) => {
        if (task.id === headlineId) return { ...task, completed: newCompletionState }; // Mark headline itself
        if (index > headlineIndex) {
          let isSub = true;
          for (let j = headlineIndex + 1; j < index; j++) {
            if (prevTasks[j].isHeadline) { isSub = false; break; }
          }
          if (isSub && !prevTasks[index].isHeadline) return { ...task, completed: newCompletionState };
        }
        return task;
      });
    });
  };
  
  // AdminDashboard is now a full-page component, conditionally rendered
  if (showAdminDashboard && isAdmin) {
    return (
      <AdminDashboard 
        onClose={() => setShowAdminDashboard(false)}
        onError={setError}
        // onEditList prop is not standard for AdminDashboard, ListEditor handles its own data.
        // If AdminDashboard needs to trigger a list load in App.tsx, a different mechanism might be needed.
      />
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col relative" data-theme={settings.theme || "material-custom"}>
      {/* Beta Badge - Consider removing or making it part of Header */}
      <div className="badge badge-accent badge-outline absolute top-2 left-2 z-50">BETA</div>
      
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl"> {/* Max width for content */}
        <div className="card bg-base-100 shadow-xl p-4 sm:p-6 mb-8">
          <Header
            onLogoClick={handleLogoClick}
            onSettingsClick={() => setShowSettingsModal(true)}
            onAdminClick={() => setShowAdminDashboard(true)}
            tasks={tasks} // For export functionality in header
            onImport={setTasks} // To update tasks after import
            isAdmin={isAdmin}
          />
          <TaskInput onAddTask={addTask} />
        </div>
        
        <TaskListSection
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask} // Ensure editTask signature matches
          onDuplicate={duplicateTask}
          onReorder={reorderTasks}
          onCheckAllSubTasks={checkAllSubTasks}
          onImportTaskList={setTasks} // If TaskListSection has import capabilities
          googleApiKey={settings.googleApiKey} // For AI features within TaskListSection
          onError={setError}
          isAdmin={isAdmin} // If TaskListSection has admin-specific features
        />
      </main>

      <Footer />

      {/* Help Button - Floating Action Button style */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-40"
        aria-label="Help"
        title="Help"
      >
        <HelpCircle size={24} />
      </button>

      {/* Modals - daisyUI modals are typically appended to document.body or a portal */}
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmReload}
          onCancel={() => setShowConfirmationModal(false)}
          tasks={tasks} // For export before reload
          title="Confirm Reload"
          message="Are you sure you want to reload the application? Any unsaved changes might be lost. You can export your current tasks first."
          confirmButtonText="Reload"
          confirmButtonClass="btn-error" // Destructive action
          showExportButton={true} // Allow exporting before reloading
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSettingsSave}
          initialSettings={settings}
          isAdmin={isAdmin}
          user={user}
          onShowAuth={() => { setShowSettingsModal(false); setShowAuthModal(true); }} // Close settings, open auth
        />
      )}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {showIntroModal && ( // Changed from showTour to showIntroModal
        <IntroModal onClose={handleIntroModalClose} />
      )}
      {/* {showTour && settings.enableTour && ( // Example conditional for a more complex tour
        <Tour onComplete={handleTourComplete} />
      )} */}
      {(showAuthModal || (isFirstUser && !user && !authLoading)) && ( // Show auth if needed or if first user setup
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            if (isFirstUser && !user) {
              // If first user setup was cancelled, behavior might need adjustment
              // For now, just closes. They might need to refresh or be guided.
            }
          }}
          isFirstUser={isFirstUser && !user} // Pass true only if it's genuinely the first user setup scenario
        />
      )}
    </div>
  );
}