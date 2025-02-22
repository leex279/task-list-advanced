export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  isHeadline?: boolean;
  codeBlock?: {
    language: string;
    code: string;
  };
  richText?: string;
  optional?: boolean;
}

export interface TaskListCategory {
  id: string;
  name: string;
  description?: string;
}

export interface TaskListWithCategory extends Task {
  category?: string;
}