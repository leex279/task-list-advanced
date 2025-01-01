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

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/yourusername/task-list-advanced.git
cd task-list-advanced
pnpm install
```

2. Create `.env` file:
```env
VITE_DEV_MODE=true
```

3. Start development server:
```bash
pnpm run dev
```

4. Open `http://localhost:5173` in your browser

## Core Components

The application is built using several key components:

- **Task Management**
  - `TaskInput`: Add new tasks with text, code blocks, and rich text
  - `TaskList`: Display and manage tasks with drag-and-drop
  - `TaskItem`: Individual task display and editing
  - `CodeBlock`: Syntax-highlighted code display

- **Features**
  - `RichTextEditor`: Format task descriptions
  - `ImportExport`: Save and load task lists
  - `SettingsModal`: Configure AI integration

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
      "optional": false
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
