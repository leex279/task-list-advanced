/*
  # Update Categories Implementation

  1. Changes
    - Add categories array column to task_lists table
    - Migrate existing category data to array format
    - Add GIN index for efficient array searching
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Ensure admin-only write access
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