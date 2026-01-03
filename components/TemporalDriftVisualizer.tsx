import React, { useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';

interface TemporalDriftVisualizerProps {
  drift: number; // 0-1
}

export const TemporalDriftVisualizer: React.FC<TemporalDriftVisualizerProps> = ({ drift }) => {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const next = [...prev, drift];
        if (next.length > 50) next.shift();
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [drift]);

  const isCritical = drift > 0.1;
  const color = isCritical ? '#fb923c' : '#a78bfa'; // Orange if critical, violet if stable

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10">
        <h3 className="font-orbitron text-md text-warm-grey">Temporal Causal Drift</h3>
        <p className={`font-orbitron text-md font-bold ${isCritical ? 'text-orange-400 animate-pulse' : 'text-violet-300'}`}>
          {isCritical ? 'DIVERGENCE DETECTED' : 'NOMINAL'}
        </p>
      </div>

      <div className="flex-1 relative">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="driftGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id="driftGlow">
               <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Central Time Axis */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--dark-border)" strokeDasharray="4 2" />

          {/* Drift Stream */}
          {history.map((val, i) => {
            const x = (i / 50) * 100;
            const yOffset = val * 500; // Scale drift effect
            const opacity = (i / 50);
            
            return (
              <g key={i}>
                {/* Main Worldline */}
                <circle 
                    cx={`${x}%`} 
                    cy={`${50 - yOffset / 2}%`} 
                    r={1 + val * 10} 
                    fill={color} 
                    opacity={opacity} 
                />
                {/* Divergent Branch (Ghost) */}
                {val > 0.02 && (
                    <circle 
                        cx={`${x}%`} 
                        cy={`${50 + yOffset / 2}%`} 
                        r={val * 5} 
                        fill={color} 
                        opacity={opacity * 0.5} 
                        filter="url(#driftGlow)"
                    />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Interference Scanlines */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ 
                 background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${color}33 4px)`,
                 opacity: drift * 5, // More scanlines with higher drift
                 mixBlendMode: 'overlay'
             }} 
        />
      </div>

      <div className="mt-4 pt-3 border-t border-dark-border/50 flex justify-between text-xs z-10">
        <Tooltip text="The deviation of the local reality matrix from the prime causal timeline. High drift indicates potential timeline fracturing.">
            <div className='cursor-help'>
                <p className='text-warm-grey uppercase'>Variance</p>
                <p className='font-mono text-pearl'>{(drift * 100).toFixed(4)}%</p>
            </div>
        </Tooltip>
        <div className='text-right'>
             <p className='text-warm-grey uppercase'>Chronon Flux</p>
             <p className='font-mono text-pearl'>{(100 - drift * 1000).toFixed(2)} &#936;</p>
        </div>
      </div>
    </div>
  );
};