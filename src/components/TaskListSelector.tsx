import React from 'react';
import { Task } from '../types/task';
import { List } from 'lucide-react'; // Icon for visual cue

interface TaskListSelectorProps {
  exampleLists: { name: string; data: Task[] }[];
  onImportTaskList: (tasks: Task[]) => void;
}

export function TaskListSelector({
  exampleLists,
  onImportTaskList,
}: TaskListSelectorProps) {
  if (!exampleLists || exampleLists.length === 0) {
    return (
      <div className="text-center my-4">
        <p className="text-base-content/70 italic">No example lists available at the moment.</p>
      </div>
    );
  }

  return (
    // Using a more structured layout for the buttons, ensuring they are centered and wrap nicely.
    // Added a title/icon for the section for better context.
    <div className="py-4">
      {/* Optional: Add a small header for this selector if it's not already clear from context */}
      {/* <h4 className="text-md font-semibold text-center text-base-content/80 mb-3 flex items-center justify-center">
        <List size={18} className="mr-2 text-info" />
        Or Select an Example List
      </h4> */}
      <div className="flex flex-wrap gap-3 justify-center">
        {exampleLists.map((list) => (
          <button
            key={list.name}
            onClick={() => onImportTaskList(list.data)}
            // Using daisyUI button styles. btn-outline provides a clear but distinct look.
            // btn-sm for smaller buttons if many examples.
            // Added a subtle shadow and transition for hover effect.
            className="btn btn-sm btn-outline btn-accent hover:shadow-md transition-shadow duration-200 ease-in-out"
            title={`Load the "${list.name}" example task list`}
          >
            {list.name}
          </button>
        ))}
      </div>
    </div>
  );
}