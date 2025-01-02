import React, { useState } from 'react';
import { Download, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface ChatHistoryProps {
  onClose: () => void;
}

export function ChatHistory({ onClose }: ChatHistoryProps) {
  const history: ChatMessage[] = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
  const [expandedMessages, setExpandedMessages] = useState<number[]>([]);

  const downloadHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'ai-chat-history.json');
    linkElement.click();
  };

  const toggleMessage = (index: number) => {
    setExpandedMessages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatMessage = (content: string) => {
    // Remove ```json and ``` from the content
    const cleanContent = content.replace(/```json\n?|\n?```/g, '');
    
    try {
      // Try to parse as JSON to determine if it's a JSON response
      JSON.parse(cleanContent);
      return {
        isJson: true,
        content: cleanContent
      };
    } catch {
      return {
        isJson: false,
        content: cleanContent
      };
    }
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-900">AI Chat History</h4>
        <button
          onClick={downloadHistory}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Download size={14} />
          Download
        </button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto border rounded-lg">
        {history.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No chat history yet</p>
        ) : (
          <div className="divide-y">
            {history.map((message, index) => {
              const { isJson, content } = formatMessage(message.content);
              const isExpanded = expandedMessages.includes(index);

              return (
                <div 
                  key={index}
                  className={`p-4 ${
                    message.role === 'assistant' ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.role === 'assistant' ? 'AI' : 'You'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {isJson && message.role === 'assistant' ? (
                    <div>
                      <button
                        onClick={() => toggleMessage(index)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <ChevronRight
                          size={16}
                          className={`transform transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                        View JSON Response
                      </button>
                      {isExpanded && (
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(JSON.parse(content), null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {content}
                    </p>
                  )}
                  {message.attachments?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Attachments: {message.attachments.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 