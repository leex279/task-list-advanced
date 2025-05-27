import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'; // Added CheckCircle for final step
import { WelcomeImage } from './intro/WelcomeImage';
import { TaskCreationImage } from './intro/TaskCreationImage';
import { RichContentImage } from './intro/RichContentImage';
import { AIGenerationImage } from './intro/AIGenerationImage';
import { ImportExportImage } from './intro/ImportExportImage';

interface IntroModalProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to Task List Advanced!",
    content: "Let's take a quick tour of the main features. You can skip this guide at any time.",
    image: <WelcomeImage />
  },
  {
    title: "Effortless Task Creation",
    content: "Add new tasks using the intuitive input field. Toggle between regular tasks and headlines to seamlessly organize your list.",
    image: <TaskCreationImage />
  },
  {
    title: "Rich Content Integration",
    content: "Enhance your tasks with detailed code blocks and rich text descriptions for comprehensive documentation and clarity.",
    image: <RichContentImage />
  },
  {
    title: "AI-Powered Task Generation",
    content: "Leverage the power of AI to automatically generate task lists. Simply add your Google API key in the settings to get started.",
    image: <AIGenerationImage />
  },
  {
    title: "Seamless Import & Export",
    content: "Easily save your task lists in JSON format and share them with others using the straightforward import and export features.",
    image: <ImportExportImage />
  }
];

export function IntroModal({ onClose }: IntroModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Close on the last step when "Get Started" is clicked
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <dialog id="intro_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-2xl"> {/* Responsive width */}
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-base-300">
          <h3 className="text-xl font-bold text-base-content">{steps[currentStep].title}</h3>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close"
            title="Skip tutorial"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4">
          <div className="aspect-video bg-base-200 rounded-lg mb-4 overflow-hidden shadow-inner">
            {steps[currentStep].image}
          </div>
          <p className="text-base-content/90 text-center sm:text-left">{steps[currentStep].content}</p>
        </div>

        {/* Modal Actions / Footer */}
        <div className="modal-action mt-4 pt-4 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center w-full">
          <div className="join mb-4 sm:mb-0">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`join-item btn btn-xs ${index === currentStep ? 'btn-primary' : 'btn-ghost'}`}
                aria-label={`Go to step ${index + 1}`}
              >{index + 1}</button>
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrevious}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            ) : (
              <button // Show skip button only on first step if previous is not available
                onClick={onClose}
                className="btn btn-ghost" 
              >
                Skip Tutorial
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 ? <ArrowRight size={16} /> : <CheckCircle size={16} />}
            </button>
          </div>
        </div>
      </div>
       {/* Modal backdrop for closing when clicking outside - though skip/close buttons are primary */}
       <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}