import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { generateTasks } from '../services/aiService';
import { ChatMessage } from '../types/chat';

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

  const addToChatHistory = (message: ChatMessage) => {
    const history = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    history.push(message);
    localStorage.setItem('aiChatHistory', JSON.stringify(history));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setLoading(true);

    // Add user message to history
    addToChatHistory({
      role: 'user',
      content: chatInput,
      timestamp: Date.now(),
      attachments: selectedFile ? [selectedFile.name] : undefined
    });

    try {
      let fileContent = '';
      if (selectedFile) {
        fileContent = await selectedFile.text();
      }

      const data = await generateTasks(apiKey, chatInput, fileContent);
      
      if (data.candidates?.[0]?.content?.parts?.[0]) {
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('Generated text:', generatedText);
        
        // Add assistant response to history right after getting the response
        addToChatHistory({
          role: 'assistant',
          content: generatedText,
          timestamp: Date.now()
        });

        const jsonMatch = generatedText.match(/```json\n?(.*?)\n?```/s) || [null, generatedText];
        const jsonText = jsonMatch[1].trim();
        console.log('Extracted JSON:', jsonText);

        try {
          const parsedData = JSON.parse(jsonText);
          console.log('Parsed data:', parsedData);
          
          if (parsedData?.data) {
            const newTasks = parsedData.data.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt || new Date()),
              id: task.id || crypto.randomUUID()
            }));
            onTasksGenerated(newTasks);
            setChatInput('');
            setSelectedFile(null);
            setSelectedFileName(null);
          } else {
            throw new Error('Invalid task list format');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          onError('Failed to parse generated tasks. Invalid format.');
        }
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      onError(error.message || 'Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-generator-section">
      <form onSubmit={handleSubmit} className="flex flex-col items-start mt-4">
        <div className="flex w-full">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Enter a prompt to generate a task list..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:border-magenta-500 resize-none mr-2"
            rows={8}
          />
          <button
            type="submit"
            className="px-3 py-2 text-white bg-magenta-500 rounded-md hover:bg-magenta-600 transition-colors"
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
    </div>
  );
} 