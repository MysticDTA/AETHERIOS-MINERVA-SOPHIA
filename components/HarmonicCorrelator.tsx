import React, { useMemo, useEffect, useState } from 'react';
import { ResonanceCoherenceData } from '../types';
import { Tooltip } from './Tooltip';

interface HarmonicCorrelatorProps {
  data: ResonanceCoherenceData;
}

const CORE_CONFIG = {
    lambda: { color: '#67e8f9', label: 'Λ', angle: 0 },   // Cyan
    sigma: { color: '#a78bfa', label: 'Σ', angle: 120 },  // Violet
    tau: { color: '#bef264', label: 'Τ', angle: 240 },    // Lime
};

export const HarmonicCorrelator: React.FC<HarmonicCorrelatorProps> = React.memo(({ data }) => {
  const [time, setTime] = useState(0);

  // Animation loop for wave propagation
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setTime(t => t + 0.02);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Calculate interference patterns
  // We simulate 3 emitters on a circle. 
  // The 'value' at any point (x,y) is the sum of sin waves from each emitter.
  // For performance in React/SVG, we'll visualize the "beams" and a central interference node.
  
  const emitters = useMemo(() => {
      const radius = 40;
      const center = 50;
      
      return Object.entries(CORE_CONFIG).map(([key, config]) => {
          const freq = data[key as keyof ResonanceCoherenceData].frequency;
          const rad = (config.angle - 90) * (Math.PI / 180);
          const cx = center + radius * Math.cos(rad);
          const cy = center + radius * Math.sin(rad);
          
          // Modulation based on frequency relative to a baseline
          const intensity = Math.min(1, freq / 1000); 
          const pulse = Math.sin(time * (freq / 100)) * 0.5 + 0.5;

          return { ...config, key, freq, cx, cy, intensity, pulse };
      });
  }, [data, time]);

  // Calculate central alignment score
  const alignment = (data.lambda.frequency + data.sigma.frequency + data.tau.frequency) / 3000;

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="font-orbitron text-md text-warm-grey">Harmonic Correlator</h3>
        <span className="text-[10px] font-mono text-pearl bg-slate-800 px-2 py-0.5 rounded">
            SYNC: {(alignment * 100).toFixed(1)}%
        </span>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[300px]">
            <defs>
                <filter id="correlatorGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <radialGradient id="centerGradient">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                </radialGradient>
            </defs>

            {/* Background Grid */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--dark-border)" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="var(--dark-border)" strokeWidth="0.5" opacity="0.3" />

            {/* Emitters and Waves */}
            {emitters.map(e => (
                <g key={e.key}>
                    {/* Emitter Node */}
                    <circle cx={e.cx} cy={e.cy} r="3" fill="var(--dark-bg)" stroke={e.color} strokeWidth="1" />
                    <text x={e.cx} y={e.cy} dy="1" textAnchor="middle" alignmentBaseline="middle" fontSize="3" fill={e.color} fontWeight="bold">{e.label}</text>
                    
                    {/* Carrier Wave (Beam to center) */}
                    <line 
                        x1={e.cx} y1={e.cy} 
                        x2="50" y2="50" 
                        stroke={e.color} 
                        strokeWidth={0.5 + e.intensity} 
                        strokeDasharray="2 1"
                        opacity={0.3 + e.pulse * 0.4}
                    />
                    
                    {/* Propagating Ripples */}
                    <circle 
                        cx={e.cx} cy={e.cy} 
                        r={10} 
                        fill="none" 
                        stroke={e.color} 
                        strokeWidth="0.2" 
                        opacity={1 - e.pulse}
                    >
                        <animate attributeName="r" from="2" to="45" dur={`${2000/e.freq}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur={`${2000/e.freq}s`} repeatCount="indefinite" />
                    </circle>
                </g>
            ))}

            {/* Central Interference Node */}
            <circle cx="50" cy="50" r={5 + alignment * 5} fill="url(#centerGradient)" opacity={0.5} filter="url(#correlatorGlow)">
                <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
            </circle>
            
            {/* Tri-Link Connection */}
            <path 
                d={`M ${emitters[0].cx} ${emitters[0].cy} L ${emitters[1].cx} ${emitters[1].cy} L ${emitters[2].cx} ${emitters[2].cy} Z`} 
                fill="none" 
                stroke="white" 
                strokeWidth="0.2" 
                opacity="0.1"
            />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-dark-border/50 text-center">
          {emitters.map(e => (
              <Tooltip key={e.key} text={`${e.key.toUpperCase()} Frequency: ${e.freq.toFixed(0)} zHz`}>
                <div>
                    <span className="text-[10px] uppercase text-slate-500 block">{e.key}</span>
                    <span className="font-mono text-xs" style={{ color: e.color }}>{e.freq.toFixed(0)}</span>
                </div>
              </Tooltip>
          ))}
      </div>
    </div>
  );
});