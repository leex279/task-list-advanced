# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev          # Start development server on localhost:5173
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build

# Package management - Project uses both npm and pnpm
npm install          # Install dependencies with npm
pnpm install         # Install dependencies with pnpm (also supported)

# No test command is available - tests would need to be added
```

## Project Architecture

This is a React + TypeScript task management application with AI integration built on Vite. The app uses Supabase for backend services (database, authentication) and Google's Gemini API for AI task generation.

### Core Architecture Patterns

**State Management**: Uses React hooks with custom hooks (`useTasks`, `useAuth`, `useSettings`) that handle business logic and state persistence. Tasks are stored in localStorage and optionally synced to Supabase.

**Task System**: Tasks support rich content including:
- Rich text descriptions (React Quill)
- Code blocks with syntax highlighting (Prism.js)
- Headlines for grouping
- Drag & drop reordering (@dnd-kit)
- Optional flags

**Authentication Flow**: Supabase auth with role-based access:
- First user becomes admin automatically
- Admins can manage example task lists
- Public users can view example lists
- Row Level Security (RLS) enforced

**AI Integration**: Google Gemini API generates structured task lists with code examples and rich formatting based on prompts and optional file uploads.

### Key Data Structures

**Task Interface** (`src/types/task.ts`):
```typescript
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  isHeadline?: boolean;
  codeBlock?: { language: string; code: string; };
  richText?: string;
  optional?: boolean;
}
```

**Task List Format**: Stored as JSON with name and data array, used for import/export and database storage.

### Component Structure

- **App.tsx**: Main application orchestrator with modal management
- **hooks/**: Business logic hooks (auth, tasks, settings)
- **components/**: UI components grouped by feature
  - `admin/`: Admin dashboard and list management
  - `auth/`: Authentication components
  - `tour/`: Onboarding tour
- **services/**: External API integrations (AI, task lists, categories)

### Routing and Deeplinking

The app uses React Router with two main routes:
- `/` - Main application page
- `/list/:listName` - Deep links to specific task lists

**Deeplinking Logic**: URLs like `/list/my-task-list` are normalized by:
1. Converting hyphens to spaces: `my-task-list` → `my task list`
2. Removing special characters (`:`, `+`, `.`) and normalizing spacing
3. Case-insensitive matching against Supabase task list names
4. Falls back to local example lists if not found in database

**Netlify Deployment**: Includes `public/_redirects` file (`/*    /index.html   200`) for client-side routing support.

### Environment Setup

Requires `.env` file with:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_DEV_MODE`: Development mode flag

Google Gemini AI integration requires API key added through Settings UI (not environment variable).

### Database Schema

Uses Supabase with two main tables:
- `task_lists`: Stores task lists with JSONB data, supports example lists
  - Row Level Security (RLS) policies control access
  - Example lists (`is_example: true`) are publicly readable
  - Admin users have full CRUD access
- `users`: User management with role-based permissions
  - First user becomes admin automatically
  - Roles: 'admin' or 'user'

**Important**: Database setup SQL is documented in README.md including all tables, policies, and triggers.

### Key Implementation Details

**Logo Navigation Behavior**:
- From list page with tasks: Shows confirmation modal before navigation
- From list page without tasks: Direct navigation to homepage
- From main page: Standard confirmation behavior

**List Name Matching**: When working with deeplinking, use the `normalizeForMatching` function pattern that handles special characters in list names.

**Modal Management**: App.tsx manages all modal states. Always close modals before navigation/reload to prevent UI issues.

**Task Loading Priority**: 
1. First checks all Supabase task lists
2. Falls back to example lists (includes local files)
3. Local example files are in `public/tasklists/`

### Development Notes

- Uses Tailwind CSS for styling
- ESLint configured for React + TypeScript
- No current test setup
- Drag & drop uses @dnd-kit library
- Rich text editing via React Quill
- Code syntax highlighting via Prism.js
- Supports both npm and pnpm package managers
- Uses Vite 6.x (latest major version)