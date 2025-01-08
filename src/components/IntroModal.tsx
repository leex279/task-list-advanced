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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{steps[currentStep].title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Skip tutorial"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
            {steps[currentStep].image}
          </div>
          <p className="text-gray-600">{steps[currentStep].content}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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