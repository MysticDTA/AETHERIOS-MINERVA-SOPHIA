
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

  const maxParticleCount = useMemo(() => {
    switch (tier) {
      case 'HIGH': return 60;
      case 'MEDIUM': return 30;
      case 'LOW': return 15;
      default: return 30;
    }
  }, [tier]);
  
  const healthPercentage = health * 100;
  const isCritical = health < 0.3;
  const isOptimal = health > 0.95;

  // Particle Logic
  const particles = useMemo(() => {
    return Array.from({ length: maxParticleCount }).map((_, i) => {
      const angle = (i / maxParticleCount) * 360;
      const radius = 60 + Math.random() * 40;
      const size = 0.5 + Math.random() * 1.0;
      const baseDuration = 5 + Math.random() * 10;
      const delay = Math.random() * -baseDuration;
      const direction = i % 2 === 0 ? 1 : -1;

      return {
        id: i,
        angle,
        radius,
        size,
        baseDuration,
        delay,
        direction
      };
    });
  }, [maxParticleCount]);
  
  const coreScale = 0.85 + (health * 0.15); 
  const rotationVelocity = 1 / (0.1 + health * 0.9);
  
  // Color Calculation
  let hue, saturation, lightness;
  if (healthPercentage < 50) {
    hue = 0 + (healthPercentage / 50) * 45; 
    saturation = 85 - (healthPercentage / 50) * 15;
    lightness = 65 + (healthPercentage / 50) * 5;
  } else {
    hue = 45 + ((healthPercentage - 50) / 50) * 45; 
    saturation = 70 - ((healthPercentage - 50) / 50) * 60;
    lightness = 70 + ((healthPercentage - 50) / 50) * 20;
  }
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsl(${hue}, ${saturation + 10}%, ${lightness + 5}%)`;

  return (
    <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center my-6 transition-all duration-[2000ms] gpu-accel perspective-1000">
      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full overflow-visible ${isCritical ? 'glitch-effect' : ''}`}
        style={{
          transform: `scale(${coreScale})`,
          filter: isCritical ? `drop-shadow(0 0 10px rgba(244, 63, 94, 0.4))` : 'none'
        }}
      >
        <defs>
          <filter id="quantumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
          
          <radialGradient id="singularityGradient">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor={glowColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor={glowColor} stopOpacity="0" />
             <stop offset="50%" stopColor={glowColor} stopOpacity="0.5" />
             <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Rings - High Tech */}
        <g style={{ animation: `spin ${60 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
             <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="0.2" strokeDasharray="2 10" opacity="0.3" />
             <circle cx="100" cy="100" r="95" fill="none" stroke={color} strokeWidth="0.1" opacity="0.1" />
        </g>
        
        <g style={{ animation: `spin-reverse ${45 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
             <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke="url(#ringGradient)" strokeWidth="1" opacity="0.4" />
             <path d="M 100 190 A 90 90 0 0 1 10 100" fill="none" stroke="url(#ringGradient)" strokeWidth="1" opacity="0.4" />
        </g>

        {/* Particle Cloud */}
        {tier !== 'LOW' && (
          <g>
            {particles.map((p, i) => (
              <g 
                key={p.id} 
                style={{ 
                  transformOrigin: '100px 100px', 
                  animation: `particle-orbit ${p.baseDuration / rotationVelocity}s ${p.delay}s linear infinite`, 
                  animationDirection: p.direction === -1 ? 'reverse' : 'normal',
                }}
              >
                <circle 
                    cx={100 + p.radius} 
                    cy="100" 
                    r={p.size} 
                    fill={glowColor} 
                    opacity={0.6}
                    style={{ filter: 'url(#quantumBlur)' }}
                />
              </g>
            ))}
          </g>
        )}

        {/* The Singularity Core */}
        <g style={{ transformOrigin: '100px 100px' }}>
            {/* Core Pulse */}
            <circle 
                cx="100" 
                cy="100" 
                r="45" 
                fill="url(#singularityGradient)" 
                style={{ 
                    animation: `pulse 3s ease-in-out infinite`,
                    mixBlendMode: 'screen' 
                }} 
            />
            
            {/* Inner Geometry */}
            <path 
                d="M 100 60 L 135 120 L 65 120 Z" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="0.5" 
                opacity="0.3"
                style={{ animation: `spin ${20 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}
            />
             <path 
                d="M 100 140 L 65 80 L 135 80 Z" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="0.5" 
                opacity="0.3"
                style={{ animation: `spin-reverse ${20 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}
            />
        </g>

        {/* Phase Lock Ring (Sovereign Mode) */}
        {isOptimal && (
          <circle 
            cx="100"
            cy="100"
            r="52"
            fill="none"
            stroke={glowColor}
            strokeWidth="1.5"
            strokeDasharray="20 40"
            style={{ animation: 'spin 4s linear infinite', transformOrigin: '100px 100px', filter: 'drop-shadow(0 0 5px #fff)' }}
          />
        )}
      </svg>

      <style>{`
        @keyframes particle-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
});
