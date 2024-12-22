# Task List Advanced

A feature-rich task list application built with React, TypeScript, and Tailwind CSS. This project aims to provide a more advanced and flexible task management experience compared to basic to-do lists.

## Features

-   **Task Creation:** Add tasks with text descriptions, including support for headlines and code blocks.
-   **Task Management:** Mark tasks as complete, edit existing tasks, and delete tasks.
-   **Code Blocks:** Include code snippets within tasks with syntax highlighting using Prism.js.
-   **Drag and Drop Reordering:** Reorder tasks using drag and drop functionality.
-   **Import/Export:** Import and export tasks as JSON files.
-   **Community Task Lists:** Load predefined task lists from a configurable GitHub repository.
-   **Subtask Completion:** Check all subtasks under a headline with a single click.
-   **Link Processing:** Automatically convert URLs in task descriptions into clickable links.
-   **Responsive Design:** Built with Tailwind CSS for a responsive and modern user interface.
-   **Settings Management:** Configure GitHub repository settings for community task lists via an in-app settings modal.

## How It Works

The application is built using React for the user interface, TypeScript for type safety, and Tailwind CSS for styling. It uses the following key components:

-   **`App.tsx`:** The main component that manages the application state and renders the UI.
-   **`TaskInput.tsx`:** Component for adding new tasks, including text, headlines, and code blocks.
-   **`TaskList.tsx`:** Component for displaying and managing the list of tasks, including drag and drop reordering.
-   **`TaskItem.tsx`:** Component for rendering individual tasks, including edit and delete options.
-   **`TaskDisplay.tsx`:** Component for displaying the task content.
-   **`TaskEditForm.tsx`:** Component for editing existing tasks.
-   **`CodeBlock.tsx`:** Component for rendering code blocks with syntax highlighting.
-   **`CodeBlockEditor.tsx`:** Component for editing code blocks.
-   **`ImportExport.tsx`:** Component for importing and exporting tasks as JSON files.
-   **`TaskListSelector.tsx`:** Component for loading predefined task lists from a configurable GitHub repository.
-   **`ConfirmationModal.tsx`:** Modal component for confirming actions like reloading the app.
-   **`SettingsModal.tsx`:** Modal component for managing application settings, including GitHub repository configurations.
-   **`utils/storage.ts`:** Utility functions for exporting and importing tasks.
-   **`utils/links.ts`:** Utility functions for processing links in task descriptions.
-   **`types/task.ts`:** TypeScript interface for defining the structure of a task.

The application uses `@dnd-kit` for drag and drop functionality, `lucide-react` for icons, and `prismjs` for code syntax highlighting.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/leex279/task-list-advanced.git
    cd task-list-advanced
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the development server:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).
3. Use the input field to add new tasks.
4. Click the checkbox to mark tasks as complete.
5. Use the edit and delete buttons to modify or remove tasks.
6. Drag and drop tasks to reorder them.
7. Use the import/export buttons to save and load tasks.
8. Load community task lists using the provided buttons.
9. Click the settings icon (next to the beta badge) to open the settings modal and configure the GitHub repository settings for community task lists.

## Configuration

The application allows you to configure the following settings via the settings modal:

-   **GitHub Repository URL:** The URL of the GitHub repository where community task lists are stored.
-   **GitHub Task Lists URL:** The API URL for fetching the list of available task lists from the GitHub repository.
-   **GitHub Raw Content Base URL:** The base URL for fetching the raw content of individual task list JSON files.

These settings are used to fetch and display the community task lists in the `TaskListSelector` component.

### Environment Variables

The application uses the following environment variables, which are defined in a `.env` file at the root of the project:

```
VITE_DEFAULT_GITHUB_TASKLISTS_URL=https://api.github.com/repos/leex279/task-list-advanced/contents/public/tasklists?ref=stable
VITE_DEFAULT_GITHUB_REPO_URL=https://github.com/leex279/task-list-advanced
VITE_DEFAULT_GITHUB_RAW_URL=https://raw.githubusercontent.com/leex279/task-list-advanced/stable/public/tasklists
```

These variables are used as default values for the settings. When you modify the settings in the app, they are saved to local storage and override the default values.

### JSON Format for Tasks

The application uses a specific JSON format for importing and exporting tasks. The JSON file should contain an object with the following structure:

```json
{
  "name": "Task List Name",
  "data": [
    {
      "id": "unique-task-id",
      "text": "Task description",
      "completed": false,
      "isHeadline": false,
      "createdAt": "2024-07-20T12:00:00.000Z",
      "codeBlock": {
        "language": "javascript",
        "code": "console.log('Hello, world!');"
      }
    },
    {
      "id": "unique-headline-id",
      "text": "Headline",
      "completed": false,
      "isHeadline": true,
      "createdAt": "2024-07-20T12:00:00.000Z"
    }
    // ... more tasks
  ]
}
```

-   **`name`**: (String, optional) The name of the task list. This is used when loading community task lists.
-   **`data`**: (Array) An array of task objects. Each task object can have the following properties:
    -   **`id`**: (String, required) A unique identifier for the task.
    -   **`text`**: (String, required) The text description of the task.
    -   **`completed`**: (Boolean, required) Indicates whether the task is completed.
    -   **`isHeadline`**: (Boolean, optional) Indicates whether the task is a headline. Defaults to `false`.
    -   **`createdAt`**: (String, required) A timestamp indicating when the task was created.
    -   **`codeBlock`**: (Object, optional) An object containing code block information:
        -   **`language`**: (String, optional) The language of the code block (e.g., "javascript", "typescript", "jsx", "tsx").
        -   **`code`**: (String, optional) The code snippet.

#### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will generate a `dist` directory with the production-ready files.

#### Deployment to Netlify

When deploying to Netlify, you need to set the environment variables in the Netlify site settings:

1. Go to your site's settings in the Netlify dashboard.
2. Navigate to **Build & deploy** > **Environment**.
3. Add the following environment variables:
    
    -   `VITE_DEFAULT_GITHUB_TASKLISTS_URL`
    -   `VITE_DEFAULT_GITHUB_REPO_URL`
    -   `VITE_DEFAULT_GITHUB_RAW_URL`
    
    Set the values according to your GitHub repository configuration.

4. Redeploy your site to apply the changes.

## Contributing

Contributions are welcome! If you have any ideas for improvements or bug fixes, please feel free to submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
