import { Task } from '../types/task';

export const exportTasks = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2);
};

export const importTasks = (jsonString: string): Task[] => {
  try {
    const parsedData = JSON.parse(jsonString);
    const tasks = Array.isArray(parsedData) ? parsedData : (parsedData.data || []);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};
