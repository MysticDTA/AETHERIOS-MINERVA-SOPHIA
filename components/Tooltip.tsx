
import React, { useState, useRef, useId } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const id = useId();

  const handleMouseEnter = () => {
      // Add delay to prevent visual noise when sweeping across controls
      timeoutRef.current = window.setTimeout(() => setIsVisible(true), 300);
  };

  const handleMouseLeave = () => {
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
      setIsVisible(false);
  };

  const childWithHandlers = React.cloneElement(React.Children.only(children) as React.ReactElement<any>, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleMouseEnter,
      onBlur: handleMouseLeave,
      'aria-describedby': `tooltip-${id}`,
      tabIndex: (children.props as any).tabIndex ?? 0,
  });

  return (
    <div className={`relative flex items-center ${className || ''}`}>
      {childWithHandlers}
      
      {isVisible && (
        <div 
            id={`tooltip-${id}`}
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#050505]/95 border border-white/10 rounded-[1px] shadow-[0_4px_15px_rgba(0,0,0,0.8)] backdrop-blur-md z-[100] min-w-[max-content] max-w-[140px] pointer-events-none animate-fade-in-up"
        >
            <div className="text-[6px] font-mono text-pearl/80 uppercase tracking-wider leading-tight text-center whitespace-normal font-medium">
                {text}
            </div>
            {/* Decorative arrow/connector */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-white/10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-[#050505]" />
        </div>
      )}
    </div>
  );
};
