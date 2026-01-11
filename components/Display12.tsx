
import React, { useState, useEffect, useMemo } from 'react';
import { SystemState } from '../types';
import { AuraScanner } from './AuraScanner';
import { MetricDisplay } from './MetricDisplay';
import { Tooltip } from './Tooltip';

const HISTORY_LENGTH = 60;
const CHART_HEIGHT = 160;
const CHART_WIDTH = 400;

const ResonanceHistoryChart: React.FC<{ currentRho: number; coherence: number }> = ({ currentRho, coherence }) => {
    const [history, setHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(currentRho));

    // Update history specifically when the resonance factor changes from the parent simulation tick
    useEffect(() => {
        setHistory(prev => {
            const next = [...prev, currentRho];
            if (next.length > HISTORY_LENGTH) return next.slice(1);
            return next;
        });
    }, [currentRho]);

    const pathData = useMemo(() => {
        const points = history.map((val, i) => {
            const x = (i / (HISTORY_LENGTH - 1)) * CHART_WIDTH;
            const y = CHART_HEIGHT - (val * CHART_HEIGHT * 0.8) - (CHART_HEIGHT * 0.1);
            return `${x},${y}`;
        });
        return `M ${points.join(' L ')}`;
    }, [history]);

    const volatility = useMemo(() => {
        const deltas = [];
        for (let i = 1; i < history.length; i++) deltas.push(Math.abs(history[i] - history[i-1]));
        return (deltas.reduce((a, b) => a + b, 0) / deltas.length) * 1000;
    }, [history]);

    // Dynamic Visuals based on System State
    const visuals = useMemo(() => {
        if (currentRho > 0.9) return { color: '#10b981', glow: '#86efac', bg: 'rgba(16, 185, 129, 0.05)' }; // Emerald
        if (currentRho > 0.6) return { color: '#ffd700', glow: '#fde047', bg: 'rgba(255, 215, 0, 0.05)' }; // Gold
        return { color: '#f43f5e', glow: '#fda4af', bg: 'rgba(244, 63, 94, 0.05)' }; // Rose
    }, [currentRho]);

    // Particle System linked to Coherence (Density) and Rho (Speed)
    const particles = useMemo(() => {
        const count = Math.max(5, Math.floor(coherence * 50)); // Density
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * CHART_WIDTH,
            y: Math.random() * CHART_HEIGHT,
            r: Math.random() * 2 + 0.5,
            // Speed: High Rho = Faster, Energetic
            duration: 2 + Math.random() * 3 * (1.1 - currentRho), 
            delay: Math.random() * -5
        }));
    }, [coherence, currentRho]);

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden shadow-inner group transition-all duration-1000"
             style={{ 
                 borderColor: `rgba(255, 255, 255, ${0.1 + currentRho * 0.2})`,
                 boxShadow: currentRho > 0.9 ? `0 0 30px ${visuals.bg}` : 'none'
             }}>
            
            {/* Ambient Background linked to State */}
            <div className="absolute inset-0 transition-colors duration-1000 pointer-events-none" 
                 style={{ backgroundColor: visuals.bg }} />

            <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div 
                        className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500" 
                        style={{ backgroundColor: visuals.color, boxShadow: `0 0 10px ${visuals.color}` }}
                    />
                    <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Spectral Resonance Chronology</h4>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[7px] text-slate-500 uppercase">Stability Delta</p>
                        <p className="font-mono text-[10px] text-pearl">{volatility.toFixed(4)}Ψ</p>
                    </div>
                </div>
            </div>

            <div className="relative h-[160px] w-full pt-4">
                {/* Background Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
                    <defs>
                        <pattern id="rhoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#rhoGrid)" />
                </svg>

                {/* Data Visualization Layer */}
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="rhoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={visuals.color} stopOpacity="0.2" />
                            <stop offset="50%" stopColor={visuals.color} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={visuals.glow} stopOpacity="1" />
                        </linearGradient>
                        <filter id="rhoGlow"><feGaussianBlur stdDeviation="3" /></filter>
                    </defs>

                    {/* Dynamic Particles */}
                    {particles.map(p => (
                        <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill={visuals.glow} opacity={0.3}>
                            <animate attributeName="cy" values={`${p.y};${p.y - 30};${p.y}`} dur={`${p.duration}s`} repeatCount="indefinite" begin={`${p.delay}s`} />
                            <animate attributeName="opacity" values="0;0.5;0" dur={`${p.duration}s`} repeatCount="indefinite" begin={`${p.delay}s`} />
                        </circle>
                    ))}

                    <path 
                        d={pathData} 
                        fill="none" 
                        stroke="url(#rhoGrad)" 
                        strokeWidth="2" 
                        className="transition-all duration-1000 ease-linear"
                        style={{ filter: 'url(#rhoGlow)' }}
                    />
                    <path 
                        d={pathData} 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="0.5" 
                        opacity="0.3"
                        className="transition-all duration-1000 ease-linear"
                    />
                    {/* Pulsing end point */}
                    <circle 
                        cx={CHART_WIDTH} 
                        cy={CHART_HEIGHT - (currentRho * CHART_HEIGHT * 0.8) - (CHART_HEIGHT * 0.1)} 
                        r="4" 
                        fill={visuals.color} 
                        className="animate-pulse"
                        style={{ filter: `drop-shadow(0 0 10px ${visuals.color})` }}
                    />
                </svg>
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase tracking-widest pt-2 border-t border-white/5">
                <span>T-Minus 60s</span>
                <span style={{ color: visuals.color, opacity: 0.8 }}>Phase_Lock: {currentRho > 0.9 ? 'ABSOLUTE' : 'DRIFTING'}</span>
                <span>Real-Time</span>
            </div>
        </div>
    );
};

interface Display12Props {
  systemState: SystemState;
}

export const Display12: React.FC<Display12Props> = ({ systemState }) => {
  const coherence = systemState.biometricSync.coherence;
  const rho = systemState.resonanceFactorRho;

  // Dynamic Chakra Calculation linked to Coherence
  const getChakraValue = (base: number) => {
      // Fluctuate around base value based on coherence. Higher coherence = closer to 1.0 (Alignment)
      const noise = (Math.random() - 0.5) * 0.05 * (1 - coherence); 
      return Math.min(1, Math.max(0, base + (coherence * 0.1) + noise));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
      {/* --- LEFT COLUMN: METRICS --- */}
      <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin">
         <MetricDisplay 
            label="Bio-Field Integrity"
            value={coherence}
            maxValue={1}
            formatAs="percent"
            className="h-32 shrink-0"
            tooltip="The overall structural integrity of the operator's bio-field, calculated from HRV coherence and optical aura analysis."
         />
         
         <div className="shrink-0">
            <ResonanceHistoryChart currentRho={rho} coherence={coherence} />
         </div>

         <div className="bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg flex-1 min-h-[300px] flex flex-col border-glow-gold backdrop-blur-sm overflow-hidden transition-colors duration-1000"
              style={{ borderColor: coherence > 0.8 ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                <h4 className="font-orbitron text-sm text-warm-grey uppercase">Chakra Alignment</h4>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${coherence > 0.8 ? 'border-green-500 text-green-400' : 'border-slate-700 text-slate-500'}`}>
                    {coherence > 0.8 ? 'HARMONIC' : 'ALIGNING'}
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-3.5">
                {[
                    { name: 'Crown', val: getChakraValue(0.92), color: '#a78bfa' },
                    { name: 'Third Eye', val: getChakraValue(0.88), color: '#818cf8' },
                    { name: 'Throat', val: getChakraValue(0.78), color: '#60a5fa' },
                    { name: 'Heart', val: systemState.pillars.LEMURIAN.activation, color: '#34d399' },
                    { name: 'Solar', val: getChakraValue(0.82), color: '#facc15' },
                    { name: 'Sacral', val: getChakraValue(0.70), color: '#fb923c' },
                    { name: 'Root', val: systemState.earthGrounding.charge, color: '#f87171' },
                ].map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-[10px] group">
                        <span className="w-20 text-slate-400 group-hover:text-pearl transition-colors uppercase tracking-wider">{c.name}</span>
                        <div className="flex-1 bg-slate-800/40 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-[1000ms] ease-out" 
                                style={{ 
                                    width: `${c.val * 100}%`, 
                                    backgroundColor: c.color, 
                                    boxShadow: coherence > 0.8 ? `0 0 10px ${c.color}` : 'none',
                                    opacity: 0.8 + coherence * 0.2
                                }} 
                            />
                        </div>
                        <span className="w-10 text-right font-mono text-slate-500">{(c.val * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* --- CENTER/RIGHT: AURA SCANNER --- */}
      <div className="lg:col-span-2 h-full min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            <AuraScanner 
                biometricData={systemState.biometricSync}
                resonance={systemState.resonanceFactorRho}
            />
        </div>
      </div>
    </div>
  );
};
