import { supabase } from '../lib/supabase';
import { Task } from '../types/task';
import { updateTaskListCategories } from './categoryService';

export interface TaskList {
  id: string;
  name: string;
  data: Task[];
  created_at: string;
  user_id: string | null;
  is_example?: boolean;
  categories?: string[];
}

export async function saveTaskList(name: string, tasks: Task[], isExample = false, categories: string[] = []) {
  // Ensure all tasks are unchecked before saving
  const uncheckedTasks = tasks.map(task => ({
    ...task,
    completed: false
  }));

  // First, try to find an existing list with this name
  const { data: existingLists } = await supabase
    .from('task_lists')
    .select('id')
    .eq('name', name);

  try {
    if (existingLists && existingLists.length > 0) {
      // Update existing list
      const { data, error } = await supabase
        .from('task_lists')
        .update({
          data: uncheckedTasks,
          is_example: isExample
        })
        .eq('id', existingLists[0].id)
        .select()
        .single();

      if (error) throw error;

      // Update categories
      await updateTaskListCategories(existingLists[0].id, categories);
      return data;
    } else {
      // Create new list
      const { data, error } = await supabase
        .from('task_lists')
        .insert([
          {
            name,
            data: uncheckedTasks,
            is_example: isExample,
            user_id: isExample ? null : (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add categories
      await updateTaskListCategories(data.id, categories);
      return data;
    }
  } catch (error) {
    console.error('Error saving task list:', error);
    throw error;
  }
}

export async function updateTaskCategories(id: string, categories: string[]) {
  const { error } = await supabase
    .from('task_lists')
    .update({ categories })
    .eq('id', id);

  if (error) throw error;
}

export async function getTaskLists() {
  const { data, error } = await supabase
    .from('task_lists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getExampleLists() {
  try {
    const { data, error } = await supabase
      .from('task_lists')
      .select('*')
      .eq('is_example', true)
      .order('name');

    if (error || !data) {
      console.log('Falling back to local example lists');
      return fetchLocalExampleLists();
    }

    return data;
  } catch (error) {
    console.error('Error fetching example lists:', error);
    return fetchLocalExampleLists();
  }
}

async function fetchLocalExampleLists() {
  const localFiles = [
    '/tasklists/simple-example-list.json',
    '/tasklists/windows-bolt-install.json',
    '/tasklists/bolt-cloudflare-deployment.json',
    '/tasklists/macOS-install-bolt-diy.json',
    '/tasklists/ollama-installation-bolt.json',
    '/tasklists/bolt-diy-vps-install.json',
    '/tasklists/bolt-diy-github-pages-deployment.json',
  ];

  try {
    const lists = await Promise.all(
      localFiles.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch task list: ${response.statusText}`);
          }
          const data = await response.json();
          return {
            id: crypto.randomUUID(),
            name: data.name,
            data: data.data.map((task: any) => ({
              ...task,
              completed: false,
              createdAt: new Date(task.createdAt || new Date())
            })),
            is_example: true,
            created_at: new Date().toISOString(),
            user_id: null,
            categories: inferCategories(data.name)
          };
        } catch (error) {
          console.error(`Error loading example list ${url}:`, error);
          return null;
        }
      })
    );

    return lists.filter((list): list is TaskList => list !== null);
  } catch (error) {
    console.error('Error loading local example lists:', error);
    return [];
  }
}

function inferCategories(name: string): string[] {
  const categories = new Set<string>();
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('install')) categories.add('installation');
  if (nameLower.includes('deploy')) categories.add('deployment');
  if (nameLower.includes('config')) categories.add('configuration');
  if (nameLower.includes('example')) categories.add('example');
  if (nameLower.includes('tutorial')) categories.add('tutorial');
  if (nameLower.includes('guide')) categories.add('guide');
  if (nameLower.includes('setup')) categories.add('setup');
  if (nameLower.includes('bolt')) categories.add('bolt');
  
  return Array.from(categories);
}

export async function deleteTaskList(id: string) {
  const { error } = await supabase
    .from('task_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function importJsonFiles(files: FileList) {
  const results = {
    imported: 0,
    errors: [] as string[]
  };

  for (const file of files) {
    if (!file.name.endsWith('.json')) {
      results.errors.push(`${file.name}: Not a JSON file`);
      continue;
    }

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      if (!data.name || !Array.isArray(data.data)) {
        results.errors.push(`${file.name}: Invalid task list format`);
        continue;
      }

      await saveTaskList(data.name, data.data, true, inferCategories(data.name));
      results.imported++;
    } catch (error) {
      results.errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}