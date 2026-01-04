
import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface CoherenceResonanceMonitorProps {
  rho: number;
  stability: number;
  isUpgrading?: boolean;
}

export const CoherenceResonanceMonitor: React.FC<CoherenceResonanceMonitorProps> = ({ rho, stability, isUpgrading }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = requestAnimationFrame(function animate(t) {
      setTime(t / 1000);
      frame = requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Multi-layered orbital geometry
  const orbits = useMemo(() => {
    const layers = 3;
    return Array.from({ length: layers }).map((_, i) => {
      const radius = 30 + i * 15;
      const speed = (0.5 + (layers - i) * 0.2) * (rho + 0.1);
      const points = 6 + i * 2;
      return { radius, speed, points, color: i === 2 ? '#ffd700' : i === 1 ? '#a78bfa' : '#67e8f9' };
    });
  }, [rho]);

  return (
    <div className={`w-full h-full bg-[#050505]/60 border border-white/5 p-6 rounded-2xl backdrop-blur-3xl relative overflow-hidden group transition-all duration-1000 ${isUpgrading ? 'causal-reweaving' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-8 z-10">
        <div>
          <h3 className="font-minerva italic text-2xl text-pearl text-glow-pearl">Coherence Resonance Array</h3>
          <p className="text-[9px] font-mono text-gold uppercase tracking-[0.4em] mt-1">Real-Time Phase Sync // v1.3.0</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#ffd700]" />
            <span className="font-mono text-[10px] text-pearl font-bold tracking-widest uppercase">Lattice_Locked</span>
          </div>
          <p className="font-mono text-[8px] text-slate-500 mt-1">SIG_PARITY: {(rho * 100).toFixed(4)}%</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        {/* Central Singularity */}
        <div className="absolute w-2 h-2 bg-pearl rounded-full shadow-[0_0_20px_white] animate-pulse z-20" />
        
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-[220px] overflow-visible">
          <defs>
            <filter id="bloom"><feGaussianBlur stdDeviation="3" /><feComposite in="SourceGraphic" operator="over" /></filter>
          </defs>

          {/* Orbital Paths */}
          {orbits.map((orb, idx) => (
            <g key={idx} style={{ transformOrigin: '100px 100px', transform: `rotate(${time * orb.speed * 50}deg)` }}>
              <circle 
                cx="100" cy="100" r={orb.radius} 
                fill="none" 
                stroke={orb.color} 
                strokeWidth="0.3" 
                opacity="0.1" 
                strokeDasharray="4 4"
              />
              {/* Resonant Nodes */}
              {Array.from({ length: orb.points }).map((_, nodeIdx) => {
                const angle = (nodeIdx / orb.points) * Math.PI * 2;
                const x = 100 + orb.radius * Math.cos(angle);
                const y = 100 + orb.radius * Math.sin(angle);
                return (
                  <g key={nodeIdx}>
                    <circle 
                      cx={x} cy={y} r={1.2} 
                      fill={orb.color} 
                      opacity={0.6 + rho * 0.4}
                      filter="url(#bloom)"
                    />
                    <line 
                      x1="100" y1="100" x2={x} y2={y} 
                      stroke={orb.color} 
                      strokeWidth="0.1" 
                      opacity={0.05 + (rho * 0.1)} 
                    />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Interference Field (Hex Grid) */}
          <path 
            d="M 100 20 L 170 60 L 170 140 L 100 180 L 30 140 L 30 60 Z" 
            fill="none" 
            stroke="var(--gold)" 
            strokeWidth="0.1" 
            opacity={0.15}
            style={{ transformOrigin: 'center', animation: 'spin-slow 60s linear infinite' }}
          />
        </svg>

        {/* Dynamic Telemetry Labels */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/5 shadow-2xl">
            <span className="text-[14px] font-orbitron text-gold font-bold tracking-[0.2em]">{rho.toFixed(6)}</span>
            <p className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1">Resonance_Rho</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-6">
        <Tooltip text="Delta entropy flux measures the rate of causal decay within the monitoring array.">
          <div className="flex flex-col gap-1 cursor-help">
            <span className="text-[8px] font-mono text-slate-500 uppercase">Entropy_Flux</span>
            <span className="text-[11px] font-orbitron text-pearl">0.0024 <span className="text-[8px] opacity-40">Ψ</span></span>
          </div>
        </Tooltip>
        <Tooltip text="Measures the alignment of the 1.617 GHz L-band carrier waves.">
          <div className="flex flex-col gap-1 cursor-help text-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase">Phase_Sync</span>
            <span className="text-[11px] font-orbitron text-gold">STABLE_LOCK</span>
          </div>
        </Tooltip>
        <Tooltip text="Structural stability of the Tesseract matrix during high-load synthesis.">
          <div className="flex flex-col gap-1 cursor-help text-right">
            <span className="text-[8px] font-mono text-slate-500 uppercase">Lattice_Stability</span>
            <span className="text-[11px] font-orbitron text-pearl">{(stability * 100).toFixed(1)}%</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
