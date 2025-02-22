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

-- Update RLS policies to allow category management
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