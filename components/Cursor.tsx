
import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const computed = window.getComputedStyle(target);
      setIsPointer(computed.cursor === 'pointer' || target.tagName === 'BUTTON' || target.tagName === 'A');
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-8 h-8 border border-gold/50 rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out flex items-center justify-center mix-blend-screen"
      style={{ 
        transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 0.8 : 1})`,
        backgroundColor: isPointer ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
      }}
    >
        <div className={`w-1 h-1 bg-pearl rounded-full transition-opacity duration-200 ${isPointer ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20`} />
    </div>
  );
};
