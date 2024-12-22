# Task List Advanced

A feature-rich task list application built with React, TypeScript, and Tailwind CSS. This project aims to provide a more advanced and flexible task management experience compared to basic to-do lists.

## Features

- **Task Creation:** Add tasks with text descriptions, including support for headlines and code blocks.
- **Task Management:** Mark tasks as complete, edit existing tasks, and delete tasks.
- **Code Blocks:** Include code snippets within tasks with syntax highlighting using Prism.js.
- **Drag and Drop Reordering:** Reorder tasks using drag and drop functionality.
- **Import/Export:** Import and export tasks as JSON files.
- **Community Task Lists:** Load predefined task lists from a community repository.
- **Subtask Completion:** Check all subtasks under a headline with a single click.
- **Link Processing:** Automatically convert URLs in task descriptions into clickable links.
- **Responsive Design:** Built with Tailwind CSS for a responsive and modern user interface.

## How It Works

The application is built using React for the user interface, TypeScript for type safety, and Tailwind CSS for styling. It uses the following key components:

- **`App.tsx`:** The main component that manages the application state and renders the UI.
- **`TaskInput.tsx`:** Component for adding new tasks, including text, headlines, and code blocks.
- **`TaskList.tsx`:** Component for displaying and managing the list of tasks, including drag and drop reordering.
- **`TaskItem.tsx`:** Component for rendering individual tasks, including edit and delete options.
- **`TaskDisplay.tsx`:** Component for displaying the task content.
- **`TaskEditForm.tsx`:** Component for editing existing tasks.
- **`CodeBlock.tsx`:** Component for rendering code blocks with syntax highlighting.
- **`CodeBlockEditor.tsx`:** Component for editing code blocks.
- **`ImportExport.tsx`:** Component for importing and exporting tasks as JSON files.
- **`TaskListSelector.tsx`:** Component for loading predefined task lists.
- **`utils/storage.ts`:** Utility functions for exporting and importing tasks.
- **`utils/links.ts`:** Utility functions for processing links in task descriptions.
- **`types/task.ts`:** TypeScript interface for defining the structure of a task.

The application uses `@dnd-kit` for drag and drop functionality, `lucide-react` for icons, and `prismjs` for code syntax highlighting.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/leex279/task-list-advanced.git
    cd task-list-advanced
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).
3.  Use the input field to add new tasks.
4.  Click the checkbox to mark tasks as complete.
5.  Use the edit and delete buttons to modify or remove tasks.
6.  Drag and drop tasks to reorder them.
7.  Use the import/export buttons to save and load tasks.
8.  Load community task lists using the provided buttons.

## Contributing

Contributions are welcome! If you have any ideas for improvements or bug fixes, please feel free to submit a pull request.

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your branch to your forked repository.
5.  Submit a pull request.

## License

This project is licensed under the MIT License.
