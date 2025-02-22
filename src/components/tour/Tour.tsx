import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TourProps {
  onComplete: () => void;
}

export function Tour({ onComplete }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});
  const positioningRef = useRef<number>();

  const steps: TourStep[] = [
    {
      target: '.task-input input',
      title: 'Create Tasks',
      content: 'Add new tasks here. Use the buttons to toggle between regular tasks and headlines.',
      position: 'bottom'
    },
    {
      target: '.headline-button',
      title: 'Create Headlines',
      content: 'Toggle this to create section headers for organizing your tasks.',
      position: 'bottom'
    },
    {
      target: '.code-button',
      title: 'Add Code Blocks',
      content: 'Click here to add code examples to your tasks.',
      position: 'bottom'
    },
    {
      target: '.rich-text-button',
      title: 'Rich Text Editor',
      content: 'Add formatted descriptions with bullet points and styling.',
      position: 'bottom'
    },
    {
      target: '.optional-checkbox',
      title: 'Optional Tasks',
      content: 'Mark tasks as optional to indicate they are not required for completion.',
      position: 'bottom'
    },
    {
      target: '.ai-config-text',
      title: 'AI Task Generation',
      content: 'To use AI task generation, first add your Google API key in the settings. Once configured, you can automatically generate task lists from text descriptions.',
      position: 'bottom'
    },
    {
      target: '.import-export-buttons',
      title: 'Import & Export',
      content: 'Save and share your task lists.',
      position: 'left'
    }
  ];

  const positionTooltip = useCallback(() => {
    if (positioningRef.current) {
      cancelAnimationFrame(positioningRef.current);
    }

    positioningRef.current = requestAnimationFrame(() => {
      const target = document.querySelector(steps[currentStep].target);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const position = steps[currentStep].position;
      const tooltipWidth = 300;
      const tooltipHeight = 150;
      const arrowSize = 8;
      const spacing = 16;

      let newTooltipStyle = {
        position: 'fixed' as const,
        zIndex: 1000,
        width: `${tooltipWidth}px`,
      };

      let newArrowStyle = {
        position: 'absolute' as const,
        width: '0',
        height: '0',
        border: `${arrowSize}px solid transparent`,
      };

      switch (position) {
        case 'top':
          newTooltipStyle = {
            ...newTooltipStyle,
            top: rect.top - tooltipHeight - (arrowSize + spacing),
            left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          };
          newArrowStyle = {
            ...newArrowStyle,
            bottom: -arrowSize * 2,
            left: '50%',
            transform: 'translateX(-50%)',
            borderTopColor: 'white',
          };
          break;
        case 'bottom':
          newTooltipStyle = {
            ...newTooltipStyle,
            top: rect.bottom + (arrowSize + spacing),
            left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          };
          newArrowStyle = {
            ...newArrowStyle,
            top: -arrowSize * 2,
            left: '50%',
            transform: 'translateX(-50%)',
            borderBottomColor: 'white',
          };
          break;
        case 'left':
          newTooltipStyle = {
            ...newTooltipStyle,
            top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
            left: rect.left - tooltipWidth - (arrowSize + spacing),
          };
          newArrowStyle = {
            ...newArrowStyle,
            right: -arrowSize * 2,
            top: '50%',
            transform: 'translateY(-50%)',
            borderLeftColor: 'white',
          };
          break;
        case 'right':
          newTooltipStyle = {
            ...newTooltipStyle,
            top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
            left: rect.right + (arrowSize + spacing),
          };
          newArrowStyle = {
            ...newArrowStyle,
            left: -arrowSize * 2,
            top: '50%',
            transform: 'translateY(-50%)',
            borderRightColor: 'white',
          };
          break;
      }

      setTooltipStyle(newTooltipStyle);
      setArrowStyle(newArrowStyle);
    });
  }, [currentStep, steps]);

  useEffect(() => {
    // Initial positioning
    positionTooltip();

    // Add highlight effect to current target
    const target = document.querySelector(steps[currentStep].target);
    if (target) {
      target.classList.add('tour-highlight');
    }

    // Set up event listeners for scroll and resize
    window.addEventListener('scroll', positionTooltip, true);
    window.addEventListener('resize', positionTooltip);

    // Set up ResizeObserver to handle content changes
    const resizeObserver = new ResizeObserver(positionTooltip);

    if (target) {
      resizeObserver.observe(target);
    }

    return () => {
      // Clean up event listeners and observers
      window.removeEventListener('scroll', positionTooltip, true);
      window.removeEventListener('resize', positionTooltip);
      resizeObserver.disconnect();

      // Remove highlight when step changes
      if (target) {
        target.classList.remove('tour-highlight');
      }

      // Cancel any pending animation frames
      if (positioningRef.current) {
        cancelAnimationFrame(positioningRef.current);
      }
    };
  }, [currentStep, positionTooltip]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenTour', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTour', 'true');
    onComplete();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-xl p-4 pointer-events-auto relative"
          style={tooltipStyle}
        >
          <div className="arrow" style={arrowStyle} />
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">{steps[currentStep].title}</h3>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{steps[currentStep].content}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 0 ? (
                <button
                  onClick={handlePrevious}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Previous
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Skip
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}