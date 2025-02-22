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
  try {
    // First, try to find an existing list with this name
    const { data: existingLists } = await supabase
      .from('task_lists')
      .select('id')
      .eq('name', name);

    // Ensure all tasks are unchecked before saving
    const uncheckedTasks = tasks.map(task => ({
      ...task,
      completed: false
    }));

    let taskListId: string;

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
      taskListId = existingLists[0].id;
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
      taskListId = data.id;
    }

    // Update categories
    if (categories.length > 0) {
      await updateTaskListCategories(taskListId, categories);
    }

    return taskListId;
  } catch (error) {
    console.error('Error saving task list:', error);
    throw error;
  }
}

export async function updateTaskCategories(id: string, categories: string[]) {
  try {
    await updateTaskListCategories(id, categories);
  } catch (error) {
    console.error('Error updating task categories:', error);
    throw error;
  }
}

export async function getTaskLists() {
  try {
    const { data: lists, error: listsError } = await supabase
      .from('task_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (listsError) throw listsError;

    // For each list, get its categories
    const listsWithCategories = await Promise.all(lists.map(async (list) => {
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('task_list_categories')
          .select('categories!inner(name)')
          .eq('task_list_id', list.id);

        if (categoriesError) throw categoriesError;

        return {
          ...list,
          categories: categories.map(c => c.categories.name)
        };
      } catch (error) {
        console.error(`Error fetching categories for list ${list.id}:`, error);
        return list;
      }
    }));

    return listsWithCategories;
  } catch (error) {
    console.error('Error fetching task lists:', error);
    throw error;
  }
}

export async function getExampleLists() {
  try {
    console.log('[TaskListService] Fetching example lists...');
    
    // First try to get lists from the database
    const { data: lists, error: listsError } = await supabase
      .from('task_lists')
      .select('*')
      .eq('is_example', true)
      .order('name');

    if (listsError) {
      console.log('[TaskListService] Error fetching from database, falling back to local lists');
      return fetchLocalExampleLists();
    }

    console.log('[TaskListService] Fetched lists from database:', lists);

    // For each list, get its categories
    const listsWithCategories = await Promise.all(lists.map(async (list) => {
      try {
        console.log(`[TaskListService] Fetching categories for list: ${list.name}`);
        
        const { data: categories, error: categoriesError } = await supabase
          .from('task_list_categories')
          .select('categories!inner(name)')
          .eq('task_list_id', list.id);

        if (categoriesError) {
          console.error(`[TaskListService] Error fetching categories for list ${list.id}:`, categoriesError);
          return list;
        }

        const listWithCategories = {
          ...list,
          categories: categories?.map(c => c.categories.name.toLowerCase()) || inferCategories(list.name)
        };

        console.log(`[TaskListService] List with categories:`, listWithCategories);
        return listWithCategories;
      } catch (error) {
        console.error(`[TaskListService] Error processing list ${list.id}:`, error);
        return {
          ...list,
          categories: inferCategories(list.name)
        };
      }
    }));

    // If no database lists found, fall back to local lists
    if (listsWithCategories.length === 0) {
      console.log('[TaskListService] No lists in database, falling back to local lists');
      return fetchLocalExampleLists();
    }

    console.log('[TaskListService] Final lists with categories:', listsWithCategories);
    return listsWithCategories;
  } catch (error) {
    console.error('[TaskListService] Error fetching example lists:', error);
    return fetchLocalExampleLists();
  }
}

export async function deleteTaskList(id: string) {
  try {
    // First delete task list categories
    const { error: categoriesError } = await supabase
      .from('task_list_categories')
      .delete()
      .eq('task_list_id', id);

    if (categoriesError) throw categoriesError;

    // Then delete the task list
    const { error: listError } = await supabase
      .from('task_lists')
      .delete()
      .eq('id', id);

    if (listError) throw listError;
  } catch (error) {
    console.error('Error deleting task list:', error);
    throw error;
  }
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

async function fetchLocalExampleLists() {
  console.log('[TaskListService] Fetching local example lists...');
  
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
          console.log(`[TaskListService] Loading local file: ${url}`);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch task list: ${response.statusText}`);
          }
          const data = await response.json();
          
          const categories = inferCategories(data.name);
          const list = {
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
            categories: categories
          };

          console.log(`[TaskListService] Loaded local list:`, {
            name: list.name,
            categories: list.categories
          });
          
          return list;
        } catch (error) {
          console.error(`[TaskListService] Error loading example list ${url}:`, error);
          return null;
        }
      })
    );

    const validLists = lists.filter((list): list is TaskList => list !== null);
    console.log('[TaskListService] Final local lists:', validLists);
    return validLists;
  } catch (error) {
    console.error('[TaskListService] Error loading local example lists:', error);
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
  
  const inferredCategories = Array.from(categories);
  console.log(`[TaskListService] Inferred categories for "${name}":`, inferredCategories);
  return inferredCategories;
}