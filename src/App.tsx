import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Task } from './types/task';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { ImportExport } from './components/ImportExport';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
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
          <div className="text-center py-12 text-gray-500">
            No tasks yet. Add one above to get started!
          </div>
        )}
      </div>
    </div>
  );
}
