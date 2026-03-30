import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { WelcomeImage } from './intro/WelcomeImage';
import { TaskCreationImage } from './intro/TaskCreationImage';
import { RichContentImage } from './intro/RichContentImage';
import { AIGenerationImage } from './intro/AIGenerationImage';
import { ImportExportImage } from './intro/ImportExportImage';

interface IntroModalProps {
  onClose: () => void;
}

export function IntroModal({ onClose }: IntroModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Task List Advanced",
      content: "Let's take a quick tour of the main features. You can skip this guide at any time.",
      image: <WelcomeImage />
    },
    {
      title: "Create Tasks",
      content: "Add new tasks using the input field. Toggle between regular tasks and headlines to organize your list.",
      image: <TaskCreationImage />
    },
    {
      title: "Rich Content",
      content: "Add code blocks and rich text descriptions to your tasks for better documentation.",
      image: <RichContentImage />
    },
    {
      title: "AI Generation",
      content: "Use AI to automatically generate task lists. Just add your Google API key in settings.",
      image: <AIGenerationImage />
    },
    {
      title: "Import & Export",
      content: "Save your task lists and share them with others using the import/export features.",
      image: <ImportExportImage />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">{steps[currentStep].title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            title="Skip tutorial"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="aspect-video bg-surface-100 rounded-lg mb-4 overflow-hidden border border-surface-200">
            {steps[currentStep].image}
          </div>
          <p className="text-surface-600">{steps[currentStep].content}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-surface-200 bg-surface-50">
          <div className="flex gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrevious}
                className="btn btn-ghost"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                Skip Tutorial
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary-500' : 'bg-surface-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
