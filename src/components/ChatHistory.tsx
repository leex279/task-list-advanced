import React, { useState } from 'react';
import { Download, ChevronRight, Trash2, MessageSquare, AlertTriangle } from 'lucide-react'; // Added MessageSquare, AlertTriangle
import { ChatMessage } from '../types/chat';
import { CodeBlock } from './code/CodeBlock'; // Using the refactored CodeBlock for JSON

interface ChatHistoryProps {
  onClose?: () => void; // Making onClose optional if ChatHistory can be used outside a modal too
}

interface FormattedMessage {
  isJson: boolean;
  content: string;
  title?: string;
  originalContent: string; // Keep original for non-JSON display or if formatting fails
}

export function ChatHistory({ onClose }: ChatHistoryProps) {
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    } catch (e) {
      console.error("Error parsing chat history from localStorage", e);
      return []; // Return empty array on error
    }
  });
  const [expandedMessages, setExpandedMessages] = useState<number[]>([]);

  const downloadHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `ai-chat-history-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(linkElement); // Required for Firefox
    linkElement.click();
    document.body.removeChild(linkElement); // Clean up
  };

  const clearHistory = () => {
    // Consider using a custom ConfirmationModal if available
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      localStorage.setItem('aiChatHistory', '[]');
      setHistory([]);
      setExpandedMessages([]); // Reset expanded messages as well
    }
  };

  const deleteEntry = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem('aiChatHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
    // Adjust expandedMessages if a deleted message was expanded
    setExpandedMessages(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const toggleMessage = (index: number) => {
    setExpandedMessages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatMessageContent = (content: string): FormattedMessage => {
    const cleanContent = content.replace(/^```json\s*|```\s*$/g, '');
    try {
      const parsed = JSON.parse(cleanContent);
      // If it's an array, stringify it back for display or handle as needed
      // For this component, we'll assume the main content is an object
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return {
          isJson: true,
          content: JSON.stringify(parsed, null, 2), // Pretty print JSON
          title: parsed.name || 'AI Generated Tasks',
          originalContent: content // Keep original if needed
        };
      }
      // If it's JSON but not an object (e.g. just a string "tasks" or a number)
      // or if it's an array, treat as non-JSON for simple display.
      // This could be refined based on expected JSON structures.
      return { isJson: false, content: content, originalContent: content };
    } catch {
      // If parsing fails, it's not JSON or malformed
      return { isJson: false, content: content, originalContent: content };
    }
  };

  return (
    // Using card for overall structure if this is a standalone section, or div if embedded
    <div className="card bg-base-100 shadow-xl mt-6"> 
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-3 border-b border-base-300">
          <h2 className="card-title text-lg sm:text-xl flex items-center">
            <MessageSquare size={20} className="mr-2 text-primary" /> AI Chat History
          </h2>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={downloadHistory} className="btn btn-sm btn-outline btn-accent">
              <Download size={16} /> Download
            </button>
            <button onClick={clearHistory} className="btn btn-sm btn-outline btn-error">
              <Trash2 size={16} /> Clear All
            </button>
            {onClose && ( // Show close button only if onClose is provided (e.g. when in a modal)
                 <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle absolute right-2 top-2 sm:static"> {/* Adjust positioning for modal context */}
                    <X size={20} />
                </button>
            )}
          </div>
        </div>
      
        <div className="max-h-96 overflow-y-auto space-y-4 pr-2"> {/* Added space-y-4 for chat items and pr-2 for scrollbar */}
          {history.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangle size={32} className="mx-auto text-base-content/50 mb-2" />
              <p className="text-base-content/70">No chat history found.</p>
              <p className="text-sm text-base-content/60">Your conversations with the AI will appear here.</p>
            </div>
          ) : (
            history.map((message, index) => {
              const { isJson, content: formattedContent, title, originalContent } = formatMessageContent(message.content);
              const isExpanded = expandedMessages.includes(index);
              const isUser = message.role === 'user';

              return (
                <div key={index} className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
                  <div className="chat-header text-xs opacity-70 mb-1">
                    {isUser ? 'You' : (title || 'AI Assistant')}
                    <time className="text-xs opacity-50 ml-1">{new Date(message.timestamp).toLocaleTimeString()}</time>
                    <button
                        onClick={() => deleteEntry(index)}
                        className="btn btn-xs btn-ghost btn-circle text-error opacity-50 hover:opacity-100 ml-2"
                        title="Delete this entry"
                    >
                        <Trash2 size={12} />
                    </button>
                  </div>
                  <div className={`chat-bubble ${isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                    {isJson && message.role === 'assistant' ? (
                      <div>
                        <button
                          onClick={() => toggleMessage(index)}
                          className="btn btn-xs btn-ghost flex items-center gap-1 normal-case font-normal mb-1"
                        >
                          <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          {isExpanded ? 'Hide JSON Response' : 'View Full JSON Response'}
                        </button>
                        {isExpanded && (
                           <div className="bg-neutral text-neutral-content p-2 rounded-md mt-1 text-xs max-w-full overflow-x-auto">
                             {/* Using CodeBlock to render the JSON content */}
                             <CodeBlock code={formattedContent} language="json" />
                           </div>
                        )}
                        {!isExpanded && <p className="text-xs opacity-80 italic">(Contains structured data, click to expand)</p>}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">{originalContent}</p>
                    )}
                  </div>
                   {message.attachments?.length > 0 && (
                    <div className="chat-footer text-xs opacity-50 mt-1">
                        Attachments: {message.attachments.join(', ')}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}