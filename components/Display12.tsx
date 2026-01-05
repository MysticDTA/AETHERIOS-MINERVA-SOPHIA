
import React, { useState, useEffect, useMemo } from 'react';
import { SystemState } from '../types';
import { AuraScanner } from './AuraScanner';
import { MetricDisplay } from './MetricDisplay';
import { Tooltip } from './Tooltip';

const HISTORY_LENGTH = 60;
const CHART_HEIGHT = 160;
const CHART_WIDTH = 400;

const ResonanceHistoryChart: React.FC<{ currentRho: number }> = ({ currentRho }) => {
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

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden shadow-inner group">
            <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
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

                {/* The Path */}
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="rhoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#e6c77f" stopOpacity="1" />
                        </linearGradient>
                        <filter id="rhoGlow"><feGaussianBlur stdDeviation="3" /></filter>
                    </defs>
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
                        fill="#e6c77f" 
                        className="animate-pulse shadow-[0_0_10px_#e6c77f]" 
                    />
                </svg>
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase tracking-widest pt-2 border-t border-white/5">
                <span>T-Minus 60s</span>
                <span className="text-gold/60">Phase_Lock: Active</span>
                <span>Real-Time</span>
            </div>
        </div>
    );
};

interface Display12Props {
  systemState: SystemState;
}

export const Display12: React.FC<Display12Props> = ({ systemState }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* --- LEFT COLUMN: METRICS --- */}
      <div className="flex flex-col gap-6">
         <MetricDisplay 
            label="Bio-Field Integrity"
            value={systemState.biometricSync.coherence}
            maxValue={1}
            formatAs="percent"
            className="h-32"
            tooltip="The overall structural integrity of the operator's bio-field, calculated from HRV coherence and optical aura analysis."
         />
         
         <ResonanceHistoryChart currentRho={systemState.resonanceFactorRho} />

         <div className="bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg flex-1 border-glow-gold backdrop-blur-sm overflow-hidden">
            <h4 className="font-orbitron text-sm text-warm-grey uppercase mb-4 px-1">Chakra Alignment</h4>
            <div className="space-y-3.5 h-[calc(100%-2rem)] overflow-y-auto pr-2 scrollbar-thin">
                {[
                    { name: 'Crown', val: 0.95, color: '#a78bfa' },
                    { name: 'Third Eye', val: 0.88, color: '#818cf8' },
                    { name: 'Throat', val: 0.72, color: '#60a5fa' },
                    { name: 'Heart', val: systemState.pillars.LEMURIAN.activation, color: '#34d399' },
                    { name: 'Solar', val: 0.85, color: '#facc15' },
                    { name: 'Sacral', val: 0.65, color: '#fb923c' },
                    { name: 'Root', val: systemState.earthGrounding.charge, color: '#f87171' },
                ].map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-[10px] group">
                        <span className="w-20 text-slate-400 group-hover:text-pearl transition-colors">{c.name}</span>
                        <div className="flex-1 bg-slate-800/40 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-[2000ms]" style={{ width: `${c.val * 100}%`, backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                        </div>
                        <span className="w-10 text-right font-mono text-slate-500">{(c.val * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* --- CENTER/RIGHT: AURA SCANNER --- */}
      <div className="lg:col-span-2 h-full min-h-0">
        <AuraScanner 
            biometricData={systemState.biometricSync}
            resonance={systemState.resonanceFactorRho}
        />
      </div>
    </div>
  );
};
