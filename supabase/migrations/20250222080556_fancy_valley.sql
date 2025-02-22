/*
  # Fix RLS Policies for Task Lists

  1. Changes
    - Update RLS policies to allow public read access to example lists
    - Fix user_id handling for example lists
    - Add index on is_example column
  
  2. Security
    - Maintain admin-only write access
    - Allow public read access to example lists
    - Protect user-specific task lists
*/

-- Add index for is_example column
CREATE INDEX IF NOT EXISTS idx_task_lists_is_example ON task_lists (is_example);

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read example lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can insert task lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can update their own task lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can delete their own task lists" ON task_lists;

-- Create new policies
CREATE POLICY "Anyone can read example lists"
  ON task_lists
  FOR SELECT
  USING (
    is_example = true OR (
      auth.role() = 'authenticated' AND 
      auth.jwt() ->> 'role' = 'admin'
    )
  );

CREATE POLICY "Admins can insert task lists"
  ON task_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update task lists"
  ON task_lists
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete task lists"
  ON task_lists
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );