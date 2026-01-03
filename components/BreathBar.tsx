import React from 'react';

interface BreathBarProps {
  cycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
}

export const BreathBar: React.FC<BreathBarProps> = ({ cycle, isGrounded }) => {
  const isExhale = cycle === 'EXHALE';
  const duration = isGrounded ? '2s' : '4s';

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center pointer-events-none z-20 p-4">
      <div 
        className="w-48 h-1 rounded-full transition-all"
        style={{
            backgroundColor: isExhale ? 'var(--rose)' : 'var(--pearl)',
            boxShadow: `0 0 10px ${isExhale ? 'var(--rose)' : 'var(--pearl)'}`,
            transform: `scaleX(${isExhale ? 0.5 : 1})`,
            opacity: isExhale ? 0.6 : 1,
            transitionDuration: duration,
            transitionTimingFunction: 'ease-in-out',
        }}
        aria-label={`System breath cycle: ${cycle}`}
      >
      </div>
    </div>
  );
};