import React, { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { Task } from './types/task';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { ImportExport } from './components/ImportExport';
import { TaskListSelector } from './components/TaskListSelector';
import { ConfirmationModal } from './components/ConfirmationModal';

const GITHUB_TASKLISTS_URL = 'https://api.github.com/repos/leex279/task-list-advanced/contents/public/tasklists?ref=stable';
const GITHUB_REPO_URL = 'https://github.com/leex279/task-list-advanced';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableLists, setAvailableLists] = useState<string[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await fetch(GITHUB_TASKLISTS_URL);
        if (response.ok) {
          const data = await response.json();
          const fileNames = data
            .filter((item: any) => item.type === 'file' && item.name.endsWith('.json'))
            .map((item: any) => item.name);
          setAvailableLists(fileNames);
        } else {
          console.error('Failed to fetch task lists:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching task lists:', error);
      }
    };

    fetchTaskLists();
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
    setTasks([...tasks, newTask]); // Add new tasks at the bottom
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

  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  return (
    <div className="min-h-screen bg-gray-50">
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
            <TaskListSelector availableLists={availableLists} onImportTaskList={handleImportTaskList} />
          </>
        )}
      </div>
      <footer className="text-center p-4 text-gray-500">
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
    </div>
  );
}

