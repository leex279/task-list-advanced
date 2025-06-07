# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev          # Start development server on localhost:5173
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build

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

### Environment Setup

Requires `.env` file with:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_DEV_MODE`: Development mode flag

### Database Schema

Uses Supabase with two main tables:
- `task_lists`: Stores task lists with JSONB data, supports example lists
- `users`: User management with role-based permissions

### Development Notes

- Uses Tailwind CSS for styling
- ESLint configured for React + TypeScript
- No current test setup
- Drag & drop uses @dnd-kit library
- Rich text editing via React Quill
- Code syntax highlighting via Prism.js