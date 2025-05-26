import React, { useEffect } from 'react';
import { Task } from '../types/task';
import { TaskList } from './TaskList';
import { TaskListSelector } from './TaskListSelector';
import { AITaskGenerator } from './AITaskGenerator';
import { getExampleLists } from '../services/taskListService';

interface TaskListSectionProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }, richText?: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  onCheckAllSubTasks: (headlineId: string) => void;
  onImportTaskList: (tasks: Task[]) => void;
  googleApiKey?: string;
  onError: (error: string) => void;
  isAdmin: boolean;
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
  isAdmin
}: TaskListSectionProps) {
  const [exampleLists, setExampleLists] = React.useState<{ name: string; data: Task[] }[]>([]);

  useEffect(() => {
    const fetchExampleLists = async () => {
      try {
        const lists = await getExampleLists();
        setExampleLists(lists.map(list => ({
          name: list.name,
          data: list.data
        })));
      } catch (error) {
        console.error('Error fetching example lists:', error);
        onError('Failed to load example lists');
      }
    };

    fetchExampleLists();
  }, [onError]);

  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  return (
    <>
      {tasks.length > 0 ? (
        <>
          {totalTasks > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          )}
          <TaskList
            tasks={tasks}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onReorder={onReorder}
            onCheckAllSubTasks={onCheckAllSubTasks}
          />
        </>
      ) : (
        <>
          {!import.meta.env.VITE_DEV_MODE && (
            <h2 className="text-center text-gray-600 text-sm font-medium mb-3">Examples</h2>
          )}
          <TaskListSelector
            exampleLists={exampleLists}
          />
          {googleApiKey ? (
            <AITaskGenerator
              apiKey={googleApiKey}
              onTasksGenerated={onImportTaskList}
              onError={onError}
            />
          ) : (
            <p className="ai-config-text text-gray-600 text-center mt-4">
              Configure your Google API key in settings to use AI task generation
            </p>
          )}
        </>
      )}
    </>
  );
}