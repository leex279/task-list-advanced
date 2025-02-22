/*
  # Add category support to task lists

  1. Changes
    - Add category column to task_lists table
    - Add index for category column for faster filtering
    - Update RLS policies to maintain existing permissions

  2. Notes
    - Category is optional (nullable)
    - Categories are free-form text strings
    - Index improves performance of category-based filtering
*/

-- Add category column
ALTER TABLE task_lists ADD COLUMN IF NOT EXISTS category text;

-- Add index for category column
CREATE INDEX IF NOT EXISTS idx_task_lists_category ON task_lists (category);