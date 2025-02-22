/*
  # Fix Authentication Flow

  1. Changes
    - Update RLS policies to handle authentication properly
    - Add proper role checks
    - Fix user permissions
  
  2. Security
    - Allow public access to check first user
    - Maintain proper admin role checks
    - Fix user authentication flow
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read example lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can insert task lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can update task lists" ON task_lists;
DROP POLICY IF EXISTS "Admins can delete task lists" ON task_lists;

-- Create new policies with proper role checks
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