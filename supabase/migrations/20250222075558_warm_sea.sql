/*
  # Add is_example column to task_lists table

  1. Changes
    - Add `is_example` boolean column to `task_lists` table
    - Make `user_id` nullable for example lists
    - Update RLS policies to allow public read access to example lists

  2. Security
    - Allow public read access to example lists
    - Maintain admin-only access for non-example lists
*/

-- Add is_example column
ALTER TABLE task_lists ADD COLUMN IF NOT EXISTS is_example boolean DEFAULT false;

-- Make user_id nullable for example lists
ALTER TABLE task_lists ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow public read access to example lists
DROP POLICY IF EXISTS "Admins can read task lists" ON task_lists;

CREATE POLICY "Anyone can read example lists"
  ON task_lists
  FOR SELECT
  USING (
    is_example = true OR (
      auth.jwt() ->> 'role' = 'admin'
    )
  );