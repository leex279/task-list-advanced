# Task List Advanced

A modern task management application with code block support and AI task generation capabilities. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ Create and manage tasks with rich text descriptions
- 📝 Add code blocks with syntax highlighting
- 🔄 Drag and drop to reorder tasks
- 🤖 Generate task lists using Google's Gemini AI
- 📁 Import/Export task lists as JSON
- 🎯 Mark tasks as optional
- 📑 Organize tasks with headlines and subtasks
- 🔗 Automatic URL to clickable link conversion
- 🎨 Clean, modern UI with responsive design
- 🔒 User authentication and admin dashboard
- 💾 Database storage with Supabase
- 📋 Example task lists
- 🔄 Task duplication
- 🔍 Rich text descriptions with formatting

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/yourusername/task-list-advanced.git
cd task-list-advanced
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your Supabase credentials:
     - Create a new project at [Supabase](https://supabase.com)
     - Get your project URL and anon key from the project settings
     - Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

3. Set up the database:
   - Create a new Supabase project
   - Run the following SQL in the Supabase SQL editor:

```sql
-- Create task_lists table
CREATE TABLE IF NOT EXISTS task_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  is_example boolean DEFAULT false
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_task_lists_is_example ON task_lists (is_example);
CREATE INDEX IF NOT EXISTS idx_task_lists_user_id ON task_lists (user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Task Lists Policies
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

-- Users Policies
CREATE POLICY "Allow public read access to user count"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update user data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add helpful comments
COMMENT ON TABLE task_lists IS 'Stores all task lists including example lists';
COMMENT ON TABLE users IS 'Stores user information and roles';
COMMENT ON COLUMN task_lists.is_example IS 'Indicates if this is a public example list';
COMMENT ON COLUMN users.role IS 'User role (admin or user)';
```

4. Start development server:
```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser

## Authentication

Authentication is handled through Supabase. Users can:
- Sign up with email/password
- Sign in with existing account
- Access authentication through the settings menu
- The first user to sign up automatically becomes an admin

### Admin Features
- Create and manage task lists
- Save example lists for all users
- Import example lists into the database
- Edit and delete task lists

## Database Setup

The application uses Supabase for data storage. The database schema includes:

### Tables
- `task_lists`: Stores all task lists
  - `id`: UUID primary key
  - `name`: List name
  - `data`: JSONB data containing tasks
  - `created_at`: Creation timestamp
  - `user_id`: Reference to auth.users
  - `is_example`: Boolean flag for example lists

- `users`: Manages user data and roles
  - `id`: UUID primary key (references auth.users)
  - `email`: User's email
  - `role`: User role (admin/user)
  - `created_at`: Creation timestamp

### Security
- Row Level Security (RLS) enabled on all tables
- Policies control access based on user roles
- Example lists are publicly readable
- Admin users have full access
- Regular users can only access their own data

## Core Components

The application is built using several key components:

- **Task Management**
  - `TaskInput`: Add new tasks with text, code blocks, and rich text
  - `TaskList`: Display and manage tasks with drag-and-drop
  - `TaskItem`: Individual task display and editing
  - `CodeBlock`: Syntax-highlighted code display

- **Admin Features**
  - `AdminDashboard`: Manage task lists and example lists
  - `ListEditor`: Create and edit task lists
  - `SaveListModal`: Save lists with options for example lists

- **Authentication**
  - `AuthModal`: Handle user sign up and sign in
  - `useAuth`: Manage authentication state

## AI Task Generation

To use the AI task generation feature:

1. Get a Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add your API key in the Settings modal
3. Enter a prompt in the input field
4. Optionally attach files for analysis
5. Click send to generate tasks

## Task List Format

Tasks are stored in JSON format:

```json
{
  "name": "Task List Name",
  "data": [
    {
      "id": "unique-id",
      "text": "Task description",
      "completed": false,
      "isHeadline": false,
      "createdAt": "2024-03-20T12:00:00.000Z",
      "codeBlock": {
        "language": "javascript",
        "code": "console.log('Hello!');"
      },
      "optional": false,
      "richText": "<p>Detailed description</p>"
    }
  ]
}
```

## Development

Built with:
- Vite for development and building
- React + TypeScript for type safety
- TailwindCSS for styling
- DND Kit for drag and drop
- Prism.js for code highlighting
- Google Gemini API for AI features
- Supabase for database and authentication
- React Quill for rich text editing

## See also my Youtube Channel
URL: https://www.youtube.com/@DIYSmartCode<br><br>
<a href="https://www.youtube.com/@DIYSmartCode">
  <img src="public/diysmartcode.png" width="900" alt="DIY Smart Code">
</a>

## Build with
<a href="https://bolt.diy">
  <img src="public/bolt-logo.png" width="200" alt="Bolt Logo">
</a>

## License

This project is licensed under the MIT License.