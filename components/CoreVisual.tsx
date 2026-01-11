
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { performanceService, PerformanceTier } from '../services/performanceService';

interface CoreVisualProps {
  health: number; // 0.0 to 1.0
  mode: string; // governanceAxiom
}

export const CoreVisual: React.FC<CoreVisualProps> = React.memo(({ health, mode }) => {
  const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);
  const [pulse, setPulse] = useState(false);
  const prevHealth = useRef(health);

  useEffect(() => {
    const unsubscribe = performanceService.subscribe(setTier);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (Math.abs(health - prevHealth.current) > 0.005) {
          setPulse(true);
          const timer = setTimeout(() => setPulse(false), 600);
          return () => clearTimeout(timer);
      }
      prevHealth.current = health;
  }, [health]);

  const maxParticleCount = useMemo(() => {
    switch (tier) {
      case 'HIGH': return 80;
      case 'MEDIUM': return 40;
      case 'LOW': return 20;
      default: return 40;
    }
  }, [tier]);
  
  const healthPercentage = health * 100;
  const isCritical = health < 0.3;
  const isOptimal = health > 0.95;

  // Particle Logic
  const particles = useMemo(() => {
    return Array.from({ length: maxParticleCount }).map((_, i) => {
      const angle = (i / maxParticleCount) * 360;
      const radius = 65 + Math.random() * 45;
      const size = 0.5 + Math.random() * 1.2;
      const baseDuration = 4 + Math.random() * 8;
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
  
  const coreScale = 0.9 + (health * 0.1); 
  const rotationVelocity = 1 / (0.2 + health * 0.8);
  
  // Color Calculation
  let hue, saturation, lightness;
  if (healthPercentage < 50) {
    hue = 0 + (healthPercentage / 50) * 45; 
    saturation = 85;
    lightness = 60;
  } else {
    hue = 45 + ((healthPercentage - 50) / 50) * 135; // Gold to Teal
    saturation = 80;
    lightness = 70;
  }
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsl(${hue}, ${saturation + 10}%, ${lightness + 10}%)`;

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-6 transition-all duration-[2000ms] gpu-accel perspective-1000 group">
      
      {/* Background Halo */}
      <div className="absolute inset-0 rounded-full opacity-20 blur-3xl transition-colors duration-1000" style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }} />

      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full overflow-visible ${isCritical ? 'glitch-effect' : ''}`}
        style={{
          transform: `scale(${coreScale})`,
          filter: isCritical ? `drop-shadow(0 0 15px rgba(244, 63, 94, 0.6))` : 'none'
        }}
      >
        <defs>
          <filter id="quantumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="chromaticAberration">
             <feOffset in="SourceGraphic" dx="1" dy="0" result="red" />
             <feOffset in="SourceGraphic" dx="-1" dy="0" result="blue" />
             <feMerge>
                <feMergeNode in="red" />
                <feMergeNode in="blue" />
                <feMergeNode in="SourceGraphic" />
             </feMerge>
          </filter>

          <radialGradient id="singularityGradient">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="30%" stopColor={glowColor} stopOpacity="0.9" />
            <stop offset="70%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Pulse Ripple */}
        <circle 
            cx="100" cy="100" r="50" 
            fill="none" 
            stroke={pulse ? "#ffffff" : glowColor} 
            strokeWidth={pulse ? "2" : "1"}
            opacity={pulse ? 0.6 : 0}
            className="transition-all duration-500 ease-out"
            style={{ 
                transform: pulse ? 'scale(2.2)' : 'scale(1)', 
                transformOrigin: '100px 100px',
            }}
        />

        {/* Outer Orbital Rings - High Tech */}
        <g style={{ animation: `spin ${80 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
             <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="0.1" strokeDasharray="4 8" opacity="0.4" />
             <circle cx="100" cy="100" r="96" fill="none" stroke={color} strokeWidth="0.05" opacity="0.2" />
        </g>
        
        <g style={{ animation: `spin-reverse ${60 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
             <path d="M 100 15 A 85 85 0 0 1 185 100" fill="none" stroke={glowColor} strokeWidth="0.5" opacity="0.3" strokeLinecap="round" />
             <path d="M 100 185 A 85 85 0 0 1 15 100" fill="none" stroke={glowColor} strokeWidth="0.5" opacity="0.3" strokeLinecap="round" />
        </g>

        {/* Superposition Ghost Rings (New for V1.4.1) */}
        <g style={{ animation: `spin ${120 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px', opacity: 0.15 }}>
             <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke={color} strokeWidth="0.2" transform="rotate(45 100 100)" />
             <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke={color} strokeWidth="0.2" transform="rotate(-45 100 100)" />
        </g>

        {/* Particle Cloud */}
        {tier !== 'LOW' && (
          <g>
            {particles.map((p, i) => (
              <circle 
                key={p.id} 
                cx={100 + p.radius} 
                cy="100" 
                r={p.size} 
                fill={glowColor} 
                opacity={0.7}
                style={{ 
                  transformOrigin: '100px 100px', 
                  animation: `particle-orbit ${p.baseDuration / rotationVelocity}s ${p.delay}s linear infinite ${p.direction === -1 ? 'reverse' : 'normal'}`,
                }}
              />
            ))}
          </g>
        )}

        {/* The Singularity Core */}
        <g style={{ transformOrigin: '100px 100px' }} filter="url(#chromaticAberration)">
            {/* Core Pulse */}
            <circle 
                cx="100" 
                cy="100" 
                r="42" 
                fill="url(#singularityGradient)" 
                style={{ 
                    animation: `pulse 3s ease-in-out infinite`,
                    mixBlendMode: 'screen' 
                }} 
            />
            
            {/* Sacred Geometry / Tech lines */}
            <g style={{ animation: `spin ${30 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
                <path d="M 100 65 L 130 118 L 70 118 Z" fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.4" />
            </g>
             <g style={{ animation: `spin-reverse ${30 / rotationVelocity}s linear infinite`, transformOrigin: '100px 100px' }}>
                <path d="M 100 135 L 70 82 L 130 82 Z" fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.4" />
            </g>
        </g>

        {/* Phase Lock Ring (Sovereign Mode) */}
        {isOptimal && (
          <circle 
            cx="100"
            cy="100"
            r="55"
            fill="none"
            stroke={glowColor}
            strokeWidth="1"
            strokeDasharray="1 10"
            style={{ animation: 'spin 5s linear infinite', transformOrigin: '100px 100px', filter: 'drop-shadow(0 0 5px #fff)' }}
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
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
});
