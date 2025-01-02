import React from 'react';
import { Task } from '../types/task';
import { TaskList } from './TaskList';
import { TaskListSelector } from './TaskListSelector';
import { AITaskGenerator } from './AITaskGenerator';

interface TaskListSectionProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, codeBlock?: { language: string; code: string }, richText?: string) => void;
  onReorder: (tasks: Task[]) => void;
  onCheckAllSubTasks: (headlineId: string) => void;
  availableLists: { name: string; url: string }[];
  onImportTaskList: (tasks: Task[]) => void;
  googleApiKey?: string;
  onError: (error: string) => void;
}

export function TaskListSection({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  onCheckAllSubTasks,
  availableLists,
  onImportTaskList,
  googleApiKey,
  onError
}: TaskListSectionProps) {
  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  return (
    <>
      {tasks.length > 0 ? (
        <>
          {totalTasks > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          )}
          <TaskList
            tasks={tasks}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
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
            availableLists={availableLists}
            onImportTaskList={onImportTaskList}
          />
          {googleApiKey ? (
            <AITaskGenerator
              apiKey={googleApiKey}
              onTasksGenerated={onImportTaskList}
              onError={onError}
            />
          ) : (
            <div className="text-center text-gray-500 mt-4">
              Configure your Google API Key in settings to enable AI task generation
            </div>
          )}
        </>
      )}
    </>
  );
} 