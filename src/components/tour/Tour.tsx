import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface TourStepDefinition {
  target: string; // CSS selector for the target element
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // Added 'center' for non-targeted steps
  // Future: Add options for spotlight shape, exact pixel offsets, etc.
}

interface TourProps {
  onComplete: () => void;
  steps: TourStepDefinition[]; // Allow steps to be passed as props for flexibility
  // enableSpotlight?: boolean; // Future: option to dim background and highlight target
}

const DEFAULT_TOOLTIP_WIDTH = 320; // px
const DEFAULT_TOOLTIP_MIN_HEIGHT = 120; // px, approximate
const ARROW_SIZE = 10; // px
const SPACING = 15; // px from target element

export function Tour({ onComplete, steps }: TourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const positioningRef = useRef<number>(); // For requestAnimationFrame
  const tourTooltipRef = useRef<HTMLDivElement>(null); // Ref for the tooltip itself

  const currentTourStep = steps[currentStepIndex];

  const positionTooltip = useCallback(() => {
    if (positioningRef.current) {
      cancelAnimationFrame(positioningRef.current);
    }

    positioningRef.current = requestAnimationFrame(() => {
      if (!currentTourStep) return;

      const targetElement = currentTourStep.target ? document.querySelector(currentTourStep.target) : null;
      const tooltipElement = tourTooltipRef.current;
      if (!tooltipElement) return;

      const tooltipRect = tooltipElement.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width || DEFAULT_TOOLTIP_WIDTH;
      const tooltipHeight = tooltipRect.height || DEFAULT_TOOLTIP_MIN_HEIGHT;
      
      let newTtStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 10000, // High z-index for tour
        width: `${DEFAULT_TOOLTIP_WIDTH}px`, // Use fixed width for consistency or measure content
        visibility: 'hidden', // Initially hidden until position is calculated
      };
      let newArrStyle: React.CSSProperties = {
        position: 'absolute',
        width: '0',
        height: '0',
        border: `${ARROW_SIZE}px solid transparent`,
        visibility: 'hidden',
      };

      if (!targetElement || currentTourStep.position === 'center') {
        // Center on screen if no target or position is 'center'
        newTtStyle.top = `calc(50% - ${tooltipHeight / 2}px)`;
        newTtStyle.left = `calc(50% - ${tooltipWidth / 2}px)`;
        // No arrow for centered tooltips
      } else {
        const targetRect = targetElement.getBoundingClientRect();
        const { position } = currentTourStep;

        // Calculate available space (simple version)
        const spaceTop = targetRect.top;
        const spaceBottom = window.innerHeight - targetRect.bottom;
        // const spaceLeft = targetRect.left;
        // const spaceRight = window.innerWidth - targetRect.right;

        // Auto-adjust position if not enough space (basic example)
        let effectivePosition = position;
        if (position === 'bottom' && spaceBottom < tooltipHeight + SPACING + ARROW_SIZE) effectivePosition = 'top';
        if (position === 'top' && spaceTop < tooltipHeight + SPACING + ARROW_SIZE) effectivePosition = 'bottom';
        // Similar logic for left/right can be added

        switch (effectivePosition) {
          case 'top':
            newTtStyle.top = `${targetRect.top - tooltipHeight - SPACING - ARROW_SIZE}px`;
            newTtStyle.left = `${targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)}px`;
            newArrStyle.top = `${tooltipHeight}px`; // Arrow points down from bottom of tooltip
            newArrStyle.left = `calc(50% - ${ARROW_SIZE}px)`;
            newArrStyle.borderTopColor = 'var(--fallback-b1, oklch(var(--b1) / 1))'; // Use daisyUI base-100 color
            break;
          case 'left':
            newTtStyle.top = `${targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)}px`;
            newTtStyle.left = `${targetRect.left - tooltipWidth - SPACING - ARROW_SIZE}px`;
            newArrStyle.top = `calc(50% - ${ARROW_SIZE}px)`;
            newArrStyle.left = `${tooltipWidth}px`; // Arrow points right from edge of tooltip
            newArrStyle.borderLeftColor = 'var(--fallback-b1, oklch(var(--b1) / 1))';
            break;
          case 'right':
            newTtStyle.top = `${targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)}px`;
            newTtStyle.left = `${targetRect.right + SPACING + ARROW_SIZE}px`;
            newArrStyle.top = `calc(50% - ${ARROW_SIZE}px)`;
            newArrStyle.right = `${tooltipWidth}px`; // Arrow points left from edge of tooltip
            newArrStyle.borderRightColor = 'var(--fallback-b1, oklch(var(--b1) / 1))';
            break;
          default: // bottom (or fallback)
            newTtStyle.top = `${targetRect.bottom + SPACING + ARROW_SIZE}px`;
            newTtStyle.left = `${targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)}px`;
            newArrStyle.bottom = `${tooltipHeight}px`; // Arrow points up from top of tooltip
            newArrStyle.left = `calc(50% - ${ARROW_SIZE}px)`;
            newArrStyle.borderBottomColor = 'var(--fallback-b1, oklch(var(--b1) / 1))';
            break;
        }
         // Clamp tooltip to viewport
        const parsedTop = parseFloat(String(newTtStyle.top || 0));
        const parsedLeft = parseFloat(String(newTtStyle.left || 0));

        newTtStyle.top = `${Math.max(SPACING, Math.min(parsedTop, window.innerHeight - tooltipHeight - SPACING))}px`;
        newTtStyle.left = `${Math.max(SPACING, Math.min(parsedLeft, window.innerWidth - tooltipWidth - SPACING))}px`;
        newArrStyle.visibility = 'visible';
      }
      
      newTtStyle.visibility = 'visible';
      setTooltipStyle(newTtStyle);
      setArrowStyle(newArrStyle);
    });
  }, [currentStepIndex, steps, currentTourStep]);

  useEffect(() => {
    if (!currentTourStep) return;

    positionTooltip(); // Position on step change

    const target = currentTourStep.target ? document.querySelector(currentTourStep.target) : null;
    if (target) {
      target.classList.add('tour-highlight'); // Add highlight class
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip, true); // Use capture phase for scroll

    return () => {
      if (target) {
        target.classList.remove('tour-highlight'); // Clean up highlight
      }
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip, true);
      if (positioningRef.current) {
        cancelAnimationFrame(positioningRef.current);
      }
    };
  }, [currentStepIndex, positionTooltip, currentTourStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete(); // Tour finished
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  if (!currentTourStep) return null; // Should not happen if steps are provided

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm" onClick={onComplete} /> 
      
      {/* Tooltip */}
      <div 
        ref={tourTooltipRef}
        className="card bg-base-100 shadow-2xl pointer-events-auto" // daisyUI card for styling
        style={tooltipStyle}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div className="card-body p-4 relative"> {/* Arrow will be relative to this */}
           <div style={arrowStyle} data-testid="tour-arrow"/>
          <div className="flex justify-between items-center mb-2">
            <h3 id="tour-title" className="card-title text-md font-semibold text-primary">{currentTourStep.title}</h3>
            <button
              onClick={onComplete}
              className="btn btn-xs btn-ghost btn-circle"
              aria-label="Close tour"
            >
              <X size={18} />
            </button>
          </div>
          <p id="tour-content" className="text-sm text-base-content/80 mb-4">{currentTourStep.content}</p>
          
          <div className="card-actions flex justify-between items-center">
            <div className="flex-1">
              {currentStepIndex > 0 && (
                <button onClick={handlePrevious} className="btn btn-sm btn-ghost">
                  <ArrowLeft size={16} className="mr-1" /> Previous
                </button>
              )}
              {currentStepIndex === 0 && (
                 <button onClick={onComplete} className="btn btn-sm btn-ghost">Skip</button>
              )}
            </div>
            
            {/* Step indicators */}
            <div className="join hidden sm:flex">
              {steps.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentStepIndex(index)}
                  className={`join-item btn btn-xs ${index === currentStepIndex ? 'btn-primary' : 'btn-ghost'}`}
                  aria-label={`Go to step ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex-1 text-right">
              <button onClick={handleNext} className="btn btn-sm btn-primary">
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStepIndex === steps.length - 1 ? <CheckCircle size={16} className="ml-1"/> : <ArrowRight size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Global style for highlighting (can be moved to a CSS file) */}
      <style jsx global>{`
        .tour-highlight {
          outline: 3px solid oklch(var(--p) / 0.7); /* Primary color outline */
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.3); /* Dim overlay effect */
          border-radius: 0.375rem; /* rounded-md */
          position: relative; /* Needed for z-index to work if target is complex */
          z-index: 10001 !important; /* Ensure target is above overlay */
          transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
}