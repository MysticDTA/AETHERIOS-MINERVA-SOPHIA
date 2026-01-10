
import React, { useEffect, useState, useRef } from 'react';

interface TrailPoint {
    x: number;
    y: number;
    id: number;
}

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add point to trail
      setTrail(prev => [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }].slice(-12)); // Keep last 12 points

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

  // Animation loop to clean up old trail points for "fading" effect logic if needed, 
  // but react state slice is sufficient for simple trail.

  if (isHidden) return null;

  return (
    <>
        {trail.map((point, index) => (
            <div 
                key={point.id}
                className="fixed pointer-events-none rounded-full bg-gold/40 z-[9998]"
                style={{
                    left: point.x,
                    top: point.y,
                    width: Math.max(2, (index / trail.length) * 6) + 'px',
                    height: Math.max(2, (index / trail.length) * 6) + 'px',
                    transform: 'translate(-50%, -50%)',
                    opacity: index / trail.length,
                    transition: 'opacity 0.1s'
                }}
            />
        ))}
        <div 
          className="fixed top-0 left-0 w-8 h-8 border border-gold/50 rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out flex items-center justify-center mix-blend-screen"
          style={{ 
            transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 0.8 : 1})`,
            backgroundColor: isPointer ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
            borderColor: isPointer ? 'var(--cyan-400)' : 'var(--gold)'
          }}
        >
            <div className={`w-1 h-1 bg-pearl rounded-full transition-opacity duration-200 ${isPointer ? 'opacity-0' : 'opacity-100'}`} />
            <div className={`absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20`} />
            {isPointer && <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow" style={{ borderStyle: 'dashed' }} />}
        </div>
    </>
  );
};
