
import React, { useState, useId } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  const childWithHandlers = React.cloneElement(React.Children.only(children) as React.ReactElement<any>, {
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false),
      onFocus: () => setIsVisible(true),
      onBlur: () => setIsVisible(false),
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
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#050505]/95 border border-white/10 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md z-[100] min-w-[120px] max-w-[200px] pointer-events-none animate-fade-in-up"
        >
            <div className="text-[9px] font-mono text-pearl/90 uppercase tracking-wider leading-relaxed text-center whitespace-normal">
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
