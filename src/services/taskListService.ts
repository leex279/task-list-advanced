import { supabase } from '../lib/supabase';
import { Task } from '../types/task';

export interface TaskList {
  id: string;
  name: string;
  data: Task[];
  created_at: string;
  user_id: string | null;
  is_example?: boolean;
}

export async function saveTaskList(name: string, tasks: Task[], isExample = false) {
  // Ensure all tasks are unchecked before saving
  const uncheckedTasks = tasks.map(task => ({
    ...task,
    completed: false
  }));

  // First, try to find an existing list with this name
  const { data: existingList } = await supabase
    .from('task_lists')
    .select('id')
    .eq('name', name)
    .single();

  if (existingList) {
    // Update existing list
    const { data, error } = await supabase
      .from('task_lists')
      .update({
        data: uncheckedTasks,
        is_example: isExample
      })
      .eq('id', existingList.id)
      .select()
      .single();

    if (error) throw error;
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
    return data;
  }
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

    // If we get a 404 or any other error, fall back to local files
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
              completed: false, // Ensure local example tasks are also unchecked
              createdAt: new Date(task.createdAt || new Date())
            })),
            is_example: true,
            created_at: new Date().toISOString(),
            user_id: null
          };
        } catch (error) {
          console.error(`Error loading example list ${url}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed loads
    return lists.filter((list): list is TaskList => list !== null);
  } catch (error) {
    console.error('Error loading local example lists:', error);
    return [];
  }
}

export async function deleteTaskList(id: string) {
  const { error } = await supabase
    .from('task_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function importExampleList(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch task list: ${response.statusText}`);
    }
    const data = await response.json();
    return saveTaskList(data.name, data.data, true);
  } catch (error) {
    console.error(`Error importing example list ${url}:`, error);
    throw error;
  }
}

export async function importAllExampleLists() {
  const localFiles = [
    '/tasklists/simple-example-list.json',
    '/tasklists/windows-bolt-install.json',
    '/tasklists/bolt-cloudflare-deployment.json',
    '/tasklists/macOS-install-bolt-diy.json',
    '/tasklists/ollama-installation-bolt.json',
    '/tasklists/bolt-diy-vps-install.json',
    '/tasklists/bolt-diy-github-pages-deployment.json',
  ];

  const results = await Promise.allSettled(localFiles.map(importExampleList));
  
  const failures = results.filter((result): result is PromiseRejectedResult => 
    result.status === 'rejected'
  );

  if (failures.length > 0) {
    console.error('Some example lists failed to import:', failures);
    throw new Error(`Failed to import ${failures.length} example lists`);
  }

  return results
    .filter((result): result is PromiseFullfilledResult<TaskList> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
}