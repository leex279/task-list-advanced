import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Default categories for development mode
const DEFAULT_CATEGORIES = [
  { name: 'installation', description: 'Installation guides and setup instructions' },
  { name: 'deployment', description: 'Deployment procedures and configurations' },
  { name: 'configuration', description: 'Configuration and customization guides' },
  { name: 'tutorial', description: 'Step-by-step tutorials and learning materials' },
  { name: 'example', description: 'Example implementations and demonstrations' },
  { name: 'documentation', description: 'Documentation and reference materials' },
  { name: 'setup', description: 'Initial setup and environment configuration' },
  { name: 'guide', description: 'General guides and how-to instructions' }
].map(cat => ({
  id: crypto.randomUUID(),
  name: cat.name,
  description: cat.description,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

// Development mode task list categories mapping
const DEV_TASK_LIST_CATEGORIES: Record<string, string[]> = {};

const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

export async function getCategories(): Promise<Category[]> {
  try {
    if (isDev) {
      console.log('[CategoryService] Development mode: Using default categories');
      return DEFAULT_CATEGORIES;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return DEFAULT_CATEGORIES;
    }

    return data || DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return DEFAULT_CATEGORIES;
  }
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  try {
    if (isDev) {
      const newCategory = {
        id: crypto.randomUUID(),
        name: name.toLowerCase(),
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      DEFAULT_CATEGORIES.push(newCategory);
      return newCategory;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.toLowerCase(), description }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
}

export async function deleteCategory(name: string): Promise<void> {
  try {
    if (isDev) {
      const index = DEFAULT_CATEGORIES.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
      if (index !== -1) {
        DEFAULT_CATEGORIES.splice(index, 1);
      }
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
}

export async function getTaskListCategories(taskListId: string): Promise<string[]> {
  try {
    if (isDev) {
      console.log('[CategoryService] Development mode: Getting task list categories', {
        taskListId,
        categories: DEV_TASK_LIST_CATEGORIES[taskListId] || []
      });
      return DEV_TASK_LIST_CATEGORIES[taskListId] || [];
    }

    const { data, error } = await supabase
      .from('task_list_categories')
      .select('categories(name)')
      .eq('task_list_id', taskListId);

    if (error) {
      console.error('Error fetching task list categories:', error);
      return [];
    }

    return data.map(row => row.categories.name);
  } catch (error) {
    console.error('Error in getTaskListCategories:', error);
    return [];
  }
}

export async function updateTaskListCategories(taskListId: string, categoryNames: string[]): Promise<void> {
  console.log('[CategoryService] Updating task list categories:', {
    taskListId,
    categoryNames,
    isDev
  });

  if (isDev) {
    DEV_TASK_LIST_CATEGORIES[taskListId] = categoryNames;
    console.log('[CategoryService] Development mode: Updated categories', DEV_TASK_LIST_CATEGORIES);
    return;
  }

  try {
    // Get category IDs for the given names
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .in('name', categoryNames.map(name => name.toLowerCase()));

    if (categoriesError) {
      console.error('Error getting category IDs:', categoriesError);
      return;
    }

    const categoryIds = categories.map(cat => cat.id);

    // Delete existing associations
    const { error: deleteError } = await supabase
      .from('task_list_categories')
      .delete()
      .eq('task_list_id', taskListId);

    if (deleteError) {
      console.error('Error deleting existing categories:', deleteError);
      return;
    }

    // Insert new associations if there are any categories
    if (categoryIds.length > 0) {
      const { error: insertError } = await supabase
        .from('task_list_categories')
        .insert(
          categoryIds.map(categoryId => ({
            task_list_id: taskListId,
            category_id: categoryId
          }))
        );

      if (insertError) {
        console.error('Error inserting new categories:', insertError);
        return;
      }
    }

    console.log('[CategoryService] Successfully updated categories');
  } catch (error) {
    console.error('Error in updateTaskListCategories:', error);
    if (!isDev) {
      throw error;
    }
  }
}