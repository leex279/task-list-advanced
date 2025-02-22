/*
  # Add category support to task lists

  1. Changes
    - Add category column to task_lists table if it doesn't exist
    - Add index for category column for faster filtering
    - Update RLS policies to maintain existing permissions

  2. Notes
    - Category is optional (nullable)
    - Categories are free-form text strings
    - Index improves performance of category-based filtering
*/

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'task_lists' AND column_name = 'category'
  ) THEN
    ALTER TABLE task_lists ADD COLUMN category text;
  END IF;
END $$;

-- Add index for category column
CREATE INDEX IF NOT EXISTS idx_task_lists_category ON task_lists (category);

-- Update RLS policies to include category access
DROP POLICY IF EXISTS "Public read access for example lists" ON task_lists;
DROP POLICY IF EXISTS "Admin write access" ON task_lists;
DROP POLICY IF EXISTS "Admin update access" ON task_lists;
DROP POLICY IF EXISTS "Admin delete access" ON task_lists;

-- Recreate policies with category access
CREATE POLICY "Public read access for example lists"
  ON task_lists
  FOR SELECT
  USING (
    is_example = true OR 
    (auth.role() = 'authenticated' AND auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admin write access"
  ON task_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin update access"
  ON task_lists
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin delete access"
  ON task_lists
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );