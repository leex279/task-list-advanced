import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { generateTasks } from '../services/aiService';

interface AITaskGeneratorProps {
  apiKey: string;
  onTasksGenerated: (tasks: any[]) => void;
  onError: (error: string) => void;
}

export function AITaskGenerator({ apiKey, onTasksGenerated, onError }: AITaskGeneratorProps) {
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFile(null);
      setSelectedFileName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setLoading(true);

    try {
      let fileContent = '';
      if (selectedFile) {
        fileContent = await selectedFile.text();
      }

      const data = await generateTasks(apiKey, chatInput, fileContent);
      
      if (data.candidates?.[0]?.content?.parts?.[0]) {
        const generatedText = data.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(generatedText.replace(/```json\n/g, '').replace(/```/g, ''));
        
        if (parsedData?.data) {
          const newTasks = parsedData.data.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));
          onTasksGenerated(newTasks);
        }
      }
    } catch (error: any) {
      onError(error.message || 'Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start mt-4">
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
  );
} 