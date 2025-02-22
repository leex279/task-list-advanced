/*
  # Migrate Categories Data

  1. Changes
    - Migrate data from task_lists.categories to task_list_categories table
    - Remove old categories column from task_lists table

  2. Data Migration
    - Insert category records for any missing categories
    - Create task_list_categories associations
    - Remove old categories column
*/

-- First ensure all categories exist
INSERT INTO categories (name)
SELECT DISTINCT unnest(categories)
FROM task_lists
WHERE categories IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Create task_list_categories associations
INSERT INTO task_list_categories (task_list_id, category_id)
SELECT DISTINCT
  tl.id as task_list_id,
  c.id as category_id
FROM task_lists tl
CROSS JOIN LATERAL unnest(tl.categories) as cat
JOIN categories c ON LOWER(c.name) = LOWER(cat)
WHERE tl.categories IS NOT NULL
ON CONFLICT (task_list_id, category_id) DO NOTHING;

-- Remove the old categories column
ALTER TABLE task_lists DROP COLUMN IF EXISTS categories;