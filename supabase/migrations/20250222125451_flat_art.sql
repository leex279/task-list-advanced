/*
  # Fix Categories Table

  1. Changes
    - Drop old categories array column from task_lists
    - Ensure categories table exists with proper structure
    - Add missing indexes and constraints
    - Re-add default categories

  2. Security
    - Update RLS policies for better access control
*/

-- First drop the old categories array column if it exists
ALTER TABLE task_lists DROP COLUMN IF EXISTS categories;

-- Ensure categories table exists with proper structure
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_list_categories junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS task_list_categories (
  task_list_id uuid REFERENCES task_lists(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_list_id, category_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_list_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Admin write access for categories" ON categories;
DROP POLICY IF EXISTS "Public read access for task_list_categories" ON task_list_categories;
DROP POLICY IF EXISTS "Admin write access for task_list_categories" ON task_list_categories;

-- Add policies for categories table
CREATE POLICY "Public read access for categories"
  ON categories
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin write access for categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Add policies for task_list_categories table
CREATE POLICY "Public read access for task_list_categories"
  ON task_list_categories
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin write access for task_list_categories"
  ON task_list_categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description)
VALUES 
  ('installation', 'Installation guides and setup instructions'),
  ('deployment', 'Deployment procedures and configurations'),
  ('configuration', 'Configuration and customization guides'),
  ('tutorial', 'Step-by-step tutorials and learning materials'),
  ('example', 'Example implementations and demonstrations'),
  ('documentation', 'Documentation and reference materials'),
  ('setup', 'Initial setup and environment configuration'),
  ('guide', 'General guides and how-to instructions')
ON CONFLICT (name) DO NOTHING;