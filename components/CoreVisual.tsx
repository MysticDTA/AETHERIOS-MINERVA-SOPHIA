
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

  // Performance-based base counts
  const maxParticleCount = useMemo(() => {
    switch (tier) {
      case 'HIGH': return 50;
      case 'MEDIUM': return 25;
      case 'LOW': return 10;
      default: return 25;
    }
  }, [tier]);
  
  const healthPercentage = health * 100;
  const isCritical = health < 0.3;
  const isOptimal = health > 0.95;

  // Adaptive particle pool
  const particles = useMemo(() => {
    return Array.from({ length: maxParticleCount }).map((_, i) => {
      const angle = (i / maxParticleCount) * 360;
      const radius = 65 + Math.random() * 35;
      const size = 0.5 + Math.random() * 1.5;
      const baseDuration = 8 + Math.random() * 12;
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
  
  // Dynamic scaling and animation factors
  const coreScale = 0.85 + (health * 0.15); // Core slightly smaller when damaged
  const rotationVelocity = 1 / (0.1 + health * 0.9); // Spins significantly faster when health is low
  const pulseVelocity = 0.5 + (1 - health) * 1.5; // Faster pulsing during decoherence
  
  // Interpolate from Rose (0) to Gold (60) to Pearl (90)
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

  let auraOpacity = 0.4 + (health * 0.4);
  if (mode === 'SOVEREIGN EMBODIMENT') auraOpacity = 1.0;

  // Sacred Geometry Paths
  const triangleUp = "M 100,50 L 143,125 L 57,125 Z";
  const triangleDown = "M 100,150 L 57,75 L 143,75 Z";

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center my-4 transition-all duration-[2000ms] gpu-accel">
      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full overflow-visible ${isCritical ? 'glitch-effect' : ''}`}
        style={{
          transform: `scale(${coreScale})`,
          filter: isCritical ? `drop-shadow(0 0 10px rgba(244, 63, 94, 0.4))` : 'none'
        }}
      >
        <defs>
          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isCritical ? 1.5 : 4} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="coreGradient">
            <stop offset="0%" style={{ stopColor: glowColor, stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: color, stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.5 }} />
          </radialGradient>
          <radialGradient id="auraGradient">
              <stop offset="0%" stopColor={glowColor} stopOpacity={0.4} />
              <stop offset="80%" stopColor={glowColor} stopOpacity={0.05} />
              <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Dynamic Aura Background */}
        <circle 
            cx="100" 
            cy="100" 
            r="100" 
            fill="url(#auraGradient)" 
            style={{ 
                animation: `pulse ${4 / pulseVelocity}s ease-in-out infinite`, 
                opacity: auraOpacity,
                transition: 'opacity 1.5s ease-in-out'
            }} 
        />
        
        {/* Lattice Rings */}
        <circle 
          cx="100" cy="100" r="85" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="4 8" opacity="0.2" 
          style={{ animation: `spin ${30 / rotationVelocity}s linear infinite` }} 
        />
        <circle 
          cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="0.2" strokeDasharray="1 12" opacity="0.3" 
          style={{ animation: `spin-reverse ${45 / rotationVelocity}s linear infinite` }} 
        />

        {/* Sacred Geometry Layer */}
        <g 
          style={{ 
            animation: `spin ${20 / rotationVelocity}s linear infinite`, 
            transformOrigin: 'center', 
            opacity: 0.2 + (health * 0.3) 
          }}
        >
            <path d={triangleUp} fill="none" stroke={glowColor} strokeWidth="0.8" />
            <path d={triangleDown} fill="none" stroke={glowColor} strokeWidth="0.8" />
        </g>

         {/* Dynamic Particle Field - Density scales with health */}
        {tier !== 'LOW' && (
          <g>
            {particles.map((p, i) => {
              // Damaged system emits "debris" (more visible particles at low health)
              const particleOpacity = (i < maxParticleCount * (0.3 + (1 - health) * 0.7)) ? 0.7 : 0;
              return (
                <g 
                  key={p.id} 
                  style={{ 
                    transformOrigin: 'center', 
                    animation: `particle-orbit ${p.baseDuration / rotationVelocity}s ${p.delay}s linear infinite`, 
                    animationDirection: p.direction === -1 ? 'reverse' : 'normal',
                    opacity: particleOpacity,
                    transition: 'opacity 2s ease-in-out'
                  }}
                >
                  <circle cx={100 + p.radius} cy="100" r={p.size} fill={glowColor} />
                </g>
              );
            })}
          </g>
        )}

        {/* The Central Singularity */}
        <circle 
            cx="100" 
            cy="100" 
            r="58" 
            fill="url(#coreGradient)" 
            stroke={glowColor} 
            strokeWidth={isOptimal ? 2 : 1} 
            filter="url(#coreGlow)" 
            style={{ 
                animation: `pulse ${3 / pulseVelocity}s ease-in-out infinite`,
                transformOrigin: 'center',
                transition: 'all 1s cubic-bezier(0.19, 1, 0.22, 1)',
                boxShadow: isOptimal ? `0 0 40px ${glowColor}` : 'none'
            }} 
        />

        {/* Phase Lock Ring for Sovereign States */}
        {isOptimal && (
          <circle 
            cx="100"
            cy="100"
            r="64"
            fill="none"
            stroke={glowColor}
            strokeWidth="0.5"
            opacity="0.4"
            strokeDasharray="20 10"
            style={{ animation: 'spin 10s linear infinite' }}
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
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
});
