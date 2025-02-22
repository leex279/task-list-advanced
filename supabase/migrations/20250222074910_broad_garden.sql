/*
  # Create task lists table

  1. New Tables
    - `task_lists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `task_lists` table
    - Add policies for admin users
*/

CREATE TABLE IF NOT EXISTS task_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;

-- Only admins can read task lists
CREATE POLICY "Admins can read task lists"
  ON task_lists
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Only admins can insert task lists
CREATE POLICY "Admins can insert task lists"
  ON task_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Only admins can update their own task lists
CREATE POLICY "Admins can update their own task lists"
  ON task_lists
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
    AND auth.uid() = user_id
  );

-- Only admins can delete their own task lists
CREATE POLICY "Admins can delete their own task lists"
  ON task_lists
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
    AND auth.uid() = user_id
  );