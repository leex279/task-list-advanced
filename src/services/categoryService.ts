import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  try {
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
    const { data, error } = await supabase
      .from('task_list_categories')
      .select('categories!inner(name)')
      .eq('task_list_id', taskListId);

    if (error) {
      console.error('Error fetching task list categories:', error);
      throw new Error('Failed to fetch task list categories');
    }

    return data.map(row => row.categories.name);
  } catch (error) {
    console.error('Error in getTaskListCategories:', error);
    throw error;
  }
}

export async function updateTaskListCategories(taskListId: string, categoryNames: string[]): Promise<void> {
  try {
    // First get category IDs
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .in('name', categoryNames);

    if (categoriesError) throw categoriesError;
    const categoryIds = categories.map(cat => cat.id);

    // Delete existing associations
    const { error: deleteError } = await supabase
      .from('task_list_categories')
      .delete()
      .eq('task_list_id', taskListId);

    if (deleteError) throw deleteError;

    // Insert new ones if there are any
    if (categoryIds.length > 0) {
      const { error: insertError } = await supabase
        .from('task_list_categories')
        .insert(
          categoryIds.map(categoryId => ({
            task_list_id: taskListId,
            category_id: categoryId
          }))
        );

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error in updateTaskListCategories:', error);
    throw error;
  }
}