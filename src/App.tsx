import React, { useState, useEffect } from 'react';
import { CheckSquare, Settings, Send, HelpCircle, Paperclip } from 'lucide-react';
import { Task } from './types/task';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { ImportExport } from './components/ImportExport';
import { TaskListSelector } from './components/TaskListSelector';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { ErrorNotification } from './components/ErrorNotification';

const isLocalDevelopment = import.meta.env.VITE_DEV_MODE;
console.log('VITE_DEV_MODE:', import.meta.env.VITE_DEV_MODE, typeof import.meta.env.VITE_DEV_MODE);
console.log('Development mode:', isLocalDevelopment);

// Add cache at the top level
const apiCache: { [key: string]: any } = {};

const DEFAULT_SETTINGS = {
  service: 'Google',
  model: 'gemini-2.0-flash-exp',
  googleApiKey: ''
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableLists, setAvailableLists] = useState<{ name: string; url: string }[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem('settings');
    try {
      const parsed = storedSettings ? JSON.parse(storedSettings) : null;
      return parsed || DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Error parsing stored settings:', e);
      return DEFAULT_SETTINGS;
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const fetchTaskLists = async () => {
    const localFiles = [
      '/tasklists/simple-example-list.json',
      '/tasklists/windows-ollama-bolt-install.json'
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
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text, codeBlock, richText, optional } : task
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

  const handleSettingsSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
  };

  const completedTasks = tasks.filter((task) => !task.isHeadline && task.completed).length;
  const totalTasks = tasks.filter((task) => !task.isHeadline).length;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFile(null);
      setSelectedFileName(null);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.googleApiKey) {
      setError('No Google API Key provided!');
      return;
    }
    if (!chatInput.trim()) return;
    
    setLoading(true);
    setError(null);

    let fileContent = '';
    if (selectedFile) {
      try {
        fileContent = await selectedFile.text();
      } catch (error) {
        console.error('Error reading file:', error);
        setError('Failed to read the attached file.');
        setLoading(false);
        return;
      }
    }

    const systemPrompt = `You are a task list generator that creates structured tasks with descriptions and code examples.
    Please generate tasks in the following JSON structure:
    {
      "text": "Task title or headline",
      "isHeadline": false,
      "completed": false,
      "richText": "Detailed description with formatting",
      "codeBlock": {
        "language": "javascript",
        "code": "Your code example"
      },
      "optional": false
    }

    Each task should include:
    - A clear title in the "text" field
    - A detailed description in the "richText" field when appropriate
    - Code examples in the "codeBlock" field when relevant
    - Proper marking of headlines with "isHeadline": true
    - Optional tasks marked with "optional": true when appropriate
    - All tasks start with "completed": false

    Format the response as a valid JSON array of tasks.`;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: chatInput + (fileContent ? `\n\nFile content:\n${fileContent}` : '') }
      ];
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${settings.googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Create a checklist in JSON format with the following structure: { "name": "Task List Name", "data": [ { "id": "unique-task-id", "text": "Task description", "completed": false, "isHeadline": false, "createdAt": "2024-07-20T12:00:00.000Z", "codeBlock": { "language": "javascript", "code": "console.log('Hello, world!');" }, "optional": false }, { "id": "unique-headline-id", "text": "Headline", "completed": false, "isHeadline": true, "createdAt": "2024-07-20T12:00:00.000Z" } ] } based on the following prompt: ${chatInput}` },
              ...(fileContent ? [{ text: `\n\nFile Content:\n${fileContent}` }] : [])
            ]
          }]
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate content: ${response.statusText} - ${errorData.error?.message || 'No details provided'}`);
      }
      const data = await response.json();
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const generatedText = data.candidates[0].content.parts[0].text;
        try {
          const parsedData = JSON.parse(generatedText.replace(/```json\n/g, '').replace(/```/g, ''));
          if (parsedData && parsedData.data) {
            const newTasks = parsedData.data.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
            }));
            setTasks(newTasks);
          } else {
            throw new Error('Invalid response format: Missing "data" property');
          }
        } catch (parseError) {
          throw new Error(`Failed to parse generated content: ${parseError.message}`);
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      console.error('Error generating tasks:', error);
      setError(error.message || 'Failed to generate tasks. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="beta-badge">beta</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setShowSettingsModal(true)}
          className="text-gray-400 hover:text-gray-600"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <CheckSquare size={32} className="text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Task List Advanced</h1>
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
            {!isLocalDevelopment && (
              <h2 className="text-center text-gray-600 text-sm font-medium mb-3">Examples</h2>
            )}
            <TaskListSelector
              availableLists={availableLists}
              onImportTaskList={handleImportTaskList}
            />
            {settings.googleApiKey ? (
              <form onSubmit={handleChatSubmit} className="flex flex-col items-start mt-4">
                <div className="flex w-full">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Enter a prompt to generate a task list..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 resize-none mr-2"
                    rows={8}
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : <Send size={18} />}
                  </button>
                </div>
                <label htmlFor="fileInput" className="cursor-pointer mt-2 flex items-center gap-1">
                  <Paperclip size={18} className="text-gray-400 hover:text-gray-600" />
                  {selectedFileName && <span className="text-sm text-gray-500">{selectedFileName}</span>}
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
              </form>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Configure your Google API Key in settings to enable AI task generation
              </div>
            )}
          </>
        )}
      </div>
      <footer className="text-center p-4 text-gray-300 bg-gray-800">
        <div className="flex flex-col items-center gap-4">
          <a href="https://github.com/leex279/task-list-advanced" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub Repository
          </a>
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 text-gray-400">Build with</span>
            <a href="https://bolt.diy" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
              <img src="/bolt-logo.png" alt="Bolt Logo" className="h-8" />
            </a>
          </div>
        </div>
      </footer>
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
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
