import React, { useMemo, useState, useEffect } from 'react';
import { performanceService, PerformanceTier } from '../services/performanceService';

interface CoreVisualProps {
  health: number; // 0.0 to 1.0
  mode: string; // governanceAxiom
}

export const CoreVisual: React.FC<CoreVisualProps> = React.memo(({ health, mode }) => {
  const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);

  useEffect(() => {
    const unsubscribe = performanceService.subscribe(setTier);
    return () => unsubscribe();
  }, []);

  const particleCount = useMemo(() => {
    switch (tier) {
      case 'HIGH': return 25;
      case 'MEDIUM': return 15;
      case 'LOW': return 5;
      default: return 15;
    }
  }, [tier]);
  
  const healthPercentage = health * 100;
  const isCritical = health < 0.3;
  
  // Interpolate from Rose (0) to Gold (60) to Pearl (90)
  let hue, saturation, lightness;
  if (healthPercentage < 50) {
    hue = 0 + (healthPercentage / 50) * 45; // 0 (Rose-red) to 45 (Gold)
    saturation = 80 - (healthPercentage / 50) * 10;
    lightness = 75 - (healthPercentage / 50) * 5;
  } else {
    hue = 45 + ((healthPercentage - 50) / 50) * (55); // 45 (Gold) to 100 (Subtle off-white)
    saturation = 70 - ((healthPercentage - 50) / 50) * 60;
    lightness = 70 + ((healthPercentage - 50) / 50) * 20;
  }
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsl(${hue}, ${saturation+10}%, ${lightness+5}%)`;

  // Dynamic animation speeds based on health (Lower health = faster, more erratic rotation)
  const corePulseDuration = Math.max(0.5, health * 6) + 's';
  const ringRotationDuration = Math.max(5, health * 60) + 's';
  const ringReverseDuration = Math.max(4, health * 50) + 's';
  
  let auraOpacity = 0.5;
  
  switch(mode) {
    case 'SOVEREIGN EMBODIMENT':
      auraOpacity = 1.0;
      break;
    case 'RECALIBRATING HARMONICS':
      auraOpacity = 0.7;
      break;
    case 'REGENERATIVE CYCLE':
      auraOpacity = 0.9;
      break;
    case 'CRADLE OF PRESENCE':
    default:
      break;
  }

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i / particleCount) * 360;
      const radius = 65 + Math.random() * 25;
      const size = 0.5 + Math.random() * 1;
      const duration = 10 + Math.random() * 15;
      const delay = Math.random() * -duration;
      const direction = i % 2 === 0 ? 1 : -1;

      return {
        id: i,
        angle,
        radius,
        size,
        duration,
        delay,
        direction
      };
    });
  }, [particleCount]);

  // Sacred Geometry Path Generators
  const triangleUp = "M 100,50 L 143,125 L 57,125 Z";
  const triangleDown = "M 100,150 L 57,75 L 143,75 Z";

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center my-4 transition-all duration-1000">
      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full overflow-visible ${isCritical ? 'glitch-effect' : ''}`}
        style={isCritical ? { animation: 'shake-effect 0.2s infinite' } : {}}
      >
        <defs>
          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isCritical ? 2 : 5} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
           <radialGradient id="coreGradient">
            <stop offset="0%" style={{ stopColor: glowColor, stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.6 }} />
          </radialGradient>
          <radialGradient id="auraGradient">
              <stop offset="0%" stopColor={glowColor} stopOpacity={0.4} />
              <stop offset="70%" stopColor={glowColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
          <filter id="haloGlow">
             <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Cradle Halo */}
        <circle 
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={glowColor}
            strokeWidth="12"
            opacity="0.1"
            filter="url(#haloGlow)"
            style={{ animation: `pulse ${corePulseDuration} ease-in-out infinite` }}
        />

        {/* Aura */}
        <circle 
            cx="100" 
            cy="100" 
            r="100" 
            fill="url(#auraGradient)" 
            style={{ 
                animation: `pulse ${corePulseDuration} ease-in-out infinite`, 
                transition: 'opacity 1s ease',
                opacity: auraOpacity,
            }} 
        />
        
        {/* Data Rings (The "Ultra" addition) */}
        <circle cx="100" cy="100" r="85" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="5 5" opacity="0.4" style={{ animation: `spin ${ringRotationDuration} linear infinite` }} />
        <circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="0.2" strokeDasharray="2 10" opacity="0.3" style={{ animation: `spin-reverse ${ringReverseDuration} linear infinite` }} />

        {/* Animated Rings */}
        <circle cx="100" cy="100" r="70" fill="none" stroke={color} strokeWidth="1" opacity="0.5" style={{ animation: `spin ${ringRotationDuration} linear infinite`, transition: 'stroke 1s ease' }} />
        <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" style={{ animation: `spin-reverse ${ringReverseDuration} linear infinite`, transition: 'stroke 1s ease' }} />
        
        {/* Sacred Geometry (Merkaba Field) */}
        <g style={{ animation: `spin ${Math.max(10, health * 30)}s linear infinite`, transformOrigin: '100px 100px', opacity: 0.3 }}>
            <path d={triangleUp} fill="none" stroke={glowColor} strokeWidth="0.5" />
        </g>
        <g style={{ animation: `spin-reverse ${Math.max(10, health * 30)}s linear infinite`, transformOrigin: '100px 100px', opacity: 0.3 }}>
            <path d={triangleDown} fill="none" stroke={glowColor} strokeWidth="0.5" />
        </g>

         {/* Particle Field */}
        {tier !== 'LOW' && (<g style={{ opacity: Math.max(0.2, health) }}>
          {particles.map(p => (
            <g key={p.id} style={{ transformOrigin: '100px 100px', animation: `particle-orbit ${p.duration}s ${p.delay}s linear infinite`, animationDirection: p.direction === -1 ? 'reverse' : 'normal' }}>
              <circle cx={100 + p.radius} cy="100" r={p.size} fill={glowColor} opacity={0.8} />
            </g>
          ))}
        </g>)}

        {/* Central Orb */}
        <circle 
            cx="100" 
            cy="100" 
            r="60" 
            fill="url(#coreGradient)" 
            stroke={glowColor} 
            strokeWidth="1.5" 
            filter="url(#coreGlow)" 
            style={{ 
                animation: `pulse ${corePulseDuration} ease-in-out infinite`,
                transformOrigin: 'center',
                transition: 'all 1s ease-in-out'
            }} 
        />

        {/* Special glow for Sovereign Embodiment */}
        {mode === 'SOVEREIGN EMBODIMENT' && (
          <circle 
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            opacity="0.7"
            style={{ animation: 'pulse 2s ease-in-out infinite' }}
          />
        )}
      </svg>
    </div>
  );
});