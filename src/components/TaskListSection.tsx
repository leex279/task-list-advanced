import React, { useEffect, useState } from 'react'; // Added useState
import { Task } from '../types/task';
import { TaskList } from './TaskList'; // Assumed refactored
import { TaskListSelector } from './TaskListSelector'; // To be refactored
import { AITaskGenerator } from './AITaskGenerator'; // To be refactored
import { getExampleLists } from '../services/taskListService';
import { Settings, ListChecks } from 'lucide-react'; // Icons

interface TaskListSectionProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  // Ensure onEdit signature matches what TaskList expects, which should match TaskEditForm
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean, isHeadline?: boolean) => void;
  onDuplicate: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  onCheckAllSubTasks: (headlineId: string) => void;
  onImportTaskList: (tasks: Task[]) => void; // Used by TaskListSelector and AITaskGenerator
  googleApiKey?: string;
  onError: (error: string) => void;
  isAdmin: boolean; // May not be directly used here but passed down
}

export function TaskListSection({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onDuplicate,
  onReorder,
  onCheckAllSubTasks,
  onImportTaskList,
  googleApiKey,
  onError,
  isAdmin // Pass isAdmin down if AITaskGenerator or TaskListSelector need it
}: TaskListSectionProps) {
  const [exampleLists, setExampleLists] = useState<{ name: string; data: Task[] }[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(true);

  useEffect(() => {
    const fetchExampleLists = async () => {
      setLoadingExamples(true);
      try {
        const lists = await getExampleLists();
        setExampleLists(lists.map(list => ({
          name: list.name,
          data: list.data
        })));
      } catch (error) {
        console.error('Error fetching example lists:', error);
        onError('Failed to load example lists. They may not be available at this time.');
      } finally {
        setLoadingExamples(false);
      }
    };

    fetchExampleLists();
  }, [onError]);

  const completedTasks = tasks.filter(task => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter(task => !task.isHeadline).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <section className="space-y-6"> {/* Added space-y for consistent spacing */}
      {tasks.length > 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4 sm:p-6">
            {totalTasks > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-sm text-base-content/80">
                <span>
                  {completedTasks} of {totalTasks} tasks completed
                </span>
                <progress className="progress progress-primary w-full sm:w-32 mt-2 sm:mt-0" value={progress} max="100"></progress>
              </div>
            )}
            {/* TaskList is assumed to handle its own internal padding/styling if it's card-like */}
            <TaskList
              tasks={tasks}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onReorder={onReorder}
              onCheckAllSubTasks={onCheckAllSubTasks}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-8 card bg-base-100 shadow-lg p-6">
          <ListChecks size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Your Task List is Empty!</h2>
          <p className="text-base-content/70 mb-6">
            Get started by adding tasks above, selecting an example list, or generating one with AI.
          </p>
          
          {/* Example Lists Section */}
          {!import.meta.env.VITE_DEV_MODE && !loadingExamples && exampleLists.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-secondary mb-3">Load an Example List:</h3>
              <TaskListSelector
                exampleLists={exampleLists}
                onImportTaskList={onImportTaskList}
              />
            </div>
          )}
          {loadingExamples && <span className="loading loading-dots loading-md text-accent my-4"></span>}

          {/* AI Task Generator Section */}
          <div className="divider text-sm text-base-content/60 my-6">OR</div>
          {googleApiKey ? (
            <AITaskGenerator
              apiKey={googleApiKey}
              onTasksGenerated={onImportTaskList}
              onError={onError}
            />
          ) : (
            <div className="alert alert-info shadow-sm text-sm">
              <Settings size={24} />
              <div>
                <h3 className="font-bold">Enable AI Task Generation!</h3>
                <p>Configure your Google API key in settings to use AI to generate task lists.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}