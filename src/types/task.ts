export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  isHeadline?: boolean;
  codeBlock?: {
    language: string;
    code: string;
    tokens?: Record<string, string>;  // Token definitions { tokenName: defaultValue }
  };
  richText?: string;
  optional?: boolean;
}
