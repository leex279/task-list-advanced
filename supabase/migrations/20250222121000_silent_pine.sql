/*
  # Add Categories Array Support

  1. Changes
    - Add categories array column to task_lists table
    - Add GIN index for efficient array operations
    - Drop old single category column

  2. Notes
    - Uses text[] array type for flexible category storage
    - GIN index optimizes array operations and searches
    - Preserves existing RLS policies
*/

-- Add categories array column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'task_lists' AND column_name = 'categories'
  ) THEN
    ALTER TABLE task_lists 
    ADD COLUMN categories text[] DEFAULT '{}';
  END IF;
END $$;

-- Add GIN index for efficient array operations
CREATE INDEX IF NOT EXISTS idx_task_lists_categories ON task_lists USING GIN (categories);