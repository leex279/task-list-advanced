import React from 'react';
import { X, Upload, Download, HelpCircle, Code, ListChecks, Settings, Github, ExternalLink } from 'lucide-react'; // Added more icons

interface HelpModalProps {
  onClose: () => void;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <div className="card-body items-center text-center p-4">
      <div className="text-primary mb-2">{icon}</div>
      <h3 className="card-title text-md text-base-content">{title}</h3>
      <p className="text-sm text-base-content/80">{description}</p>
    </div>
  </div>
);

export function HelpModal({ onClose }: HelpModalProps) {
  // daisyUI handles modal closure via form method="dialog" or by pressing ESC
  return (
    <dialog id="help_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-3xl"> {/* Responsive width */}
        {/* Modal Header */}
        <div className="flex items-center pb-3 border-b border-base-300">
          <HelpCircle size={22} className="text-accent mr-3 shrink-0" />
          <h3 className="text-xl font-bold text-base-content flex-grow">Help & Information</h3>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2"> {/* Added pr-2 for scrollbar space */}
          <section>
            <h4 className="text-lg font-semibold text-primary mb-1">Task List Advanced</h4>
            <p className="text-base-content/90">
              A modern task management application with code block support, rich text editing, AI task generation, drag & drop reordering, and customizable themes.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-primary mb-3">Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FeatureCard title="Rich Task Creation" description="Tasks with text, code blocks, and rich descriptions." icon={<ListChecks size={24}/>} />
              <FeatureCard title="Task Organization" description="Group tasks with headlines and mark as optional." icon={<ListChecks size={24}/>} />
              <FeatureCard title="Drag & Drop" description="Easily reorder tasks." icon={<ListChecks size={24}/>} />
              <FeatureCard title="Import/Export" description="JSON import/export for your task lists." icon={<><Upload size={18} className="inline"/> <Download size={18} className="inline ml-1"/></>} />
              <FeatureCard title="AI Generation" description="Use Google's Gemini AI for task list ideas (API key needed)." icon={<Code size={24}/>} />
              <FeatureCard title="Customizable Themes" description="Light and Dark Material Design themes." icon={<Settings size={24}/>} />
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-primary mb-3">Getting Started</h4>
            <ul className="list-disc list-inside space-y-1 text-base-content/90 pl-2">
              <li>Use the input field at the top to add new tasks or headlines.</li>
              <li>Toggle headline mode, code block, or rich text options as needed.</li>
              <li>Mark tasks as optional using the toggle in the input/edit form.</li>
              <li>Drag and drop tasks to reorder them within the list.</li>
              <li>Use the <Upload size={16} className="inline align-middle"/> / <Download size={16} className="inline align-middle"/> buttons in the header for JSON import/export.</li>
              <li>Configure your Google API Key in <Settings size={16} className="inline align-middle"/> Settings to enable AI task generation.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-primary mb-2">Source Code</h4>
            <p className="text-base-content/90">
              This project is open source. Contributions and feedback are welcome!
              Visit the{' '}
              <a
                href="https://github.com/leex279/task-list-advanced"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-secondary hover:link-accent font-medium items-center inline-flex"
              >
                <Github size={16} className="mr-1"/> GitHub Repository <ExternalLink size={14} className="ml-1 opacity-70"/>
              </a>
              .
            </p>
          </section>
        </div>
        
        {/* Modal Actions */}
        <div className="modal-action mt-4 pt-4 border-t border-base-300">
          <button onClick={onClose} className="btn btn-primary">
            Got it!
          </button>
        </div>
      </div>
      {/* Modal backdrop for closing when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
