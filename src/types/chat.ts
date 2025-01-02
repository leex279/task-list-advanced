export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: string[]; // For file names that were attached
}

export interface ChatSession {
  messages: ChatMessage[];
  taskResults?: any[]; // The tasks that were generated
} 