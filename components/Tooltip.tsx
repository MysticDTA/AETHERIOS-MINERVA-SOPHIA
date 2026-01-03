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
      // Ensure the child can be focused for keyboard users
      tabIndex: (children.props as any).tabIndex ?? 0,
  });

  return (
    <div className={`tooltip ${className || ''} ${isVisible ? 'tooltip-visible' : ''}`}>
      {childWithHandlers}
      <span className="tooltiptext" role="tooltip" id={`tooltip-${id}`}>
        {text}
      </span>
    </div>
  );
};