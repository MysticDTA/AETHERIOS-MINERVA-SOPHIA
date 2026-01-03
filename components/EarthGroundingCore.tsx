import React, { useMemo, useState, useEffect } from 'react';
import { EarthGroundingData } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';
import { Tooltip } from './Tooltip';

interface EarthGroundingCoreProps {
  data: EarthGroundingData;
  onDischarge: () => void;
  isDischarging: boolean;
}

const getStatusConfig = (status: EarthGroundingData['status']) => {
    switch(status) {
        case 'STABLE':
            return { color: 'text-pearl', label: 'STABLE', particleColor: 'hsl(180, 50%, 80%)' };
        case 'CHARGING':
            return { color: 'text-gold', label: 'CHARGING', particleColor: 'hsl(50, 80%, 60%)' };
        case 'DISCHARGING':
            return { color: 'text-cyan-400', label: 'DISCHARGING', particleColor: 'hsl(190, 90%, 70%)' };
        case 'WEAK':
            return { color: 'text-orange-400', label: 'WEAK', particleColor: 'hsl(30, 80%, 60%)' };
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', particleColor: 'hsl(0, 0%, 50%)' };
    }
}

const GroundingVisual: React.FC<{ data: EarthGroundingData }> = ({ data }) => {
    const { conductivity, status } = data;
    const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);

    useEffect(() => {
      const unsubscribe = performanceService.subscribe(setTier);
      return () => unsubscribe();
    }, []);

    const config = getStatusConfig(status);
    
    const particleCount = useMemo(() => {
        let baseDensity = conductivity * 30;
        let maxCount = 40;
        if (tier === 'MEDIUM') {
            baseDensity = conductivity * 15;
            maxCount = 20;
        } else if (tier === 'LOW') {
            baseDensity = conductivity * 8;
            maxCount = 10;
        }
        return Math.max(3, Math.min(maxCount, Math.floor(baseDensity)));
    }, [conductivity, tier]);

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            let animationStyle: React.CSSProperties = {};
            const delay = Math.random() * -4;
            let duration = (5 - (conductivity * 4)) + Math.random() * 2;

            switch (status) {
                case 'DISCHARGING':
                    duration *= 0.2; // Much faster flow
                    break;
                case 'WEAK':
                    animationStyle.animationName = 'grounding-flow, grounding-weak-flicker';
                    animationStyle.animationTimingFunction = 'linear, ease-in-out';
                    animationStyle.animationIterationCount = 'infinite, infinite';
                    animationStyle.animationDuration = `${duration * 2}s, 2s`;
                    break;
                 case 'STABLE':
                    duration *= 1.5; // Slower, calmer flow
                    break;
            }
            
            return {
                id: i,
                x: 10 + Math.random() * 80,
                size: 0.5 + Math.random(),
                style: {
                    animation: `grounding-flow ${duration}s ${delay}s linear infinite`,
                    ...animationStyle
                }
            };
        });
    }, [particleCount, conductivity, status]);

    return (
        <div className="w-full h-28 bg-black/20 rounded-md relative overflow-hidden">
             <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <filter id="groundingGlow"><feGaussianBlur stdDeviation="2" /></filter>
                </defs>
                {/* Crystal */}
                <path d="M 50 10 L 65 30 L 50 50 L 35 30 Z" fill={config.particleColor} opacity={0.3} filter="url(#groundingGlow)" />
                <path d="M 50 10 L 65 30 L 50 50 L 35 30 Z" fill="none" stroke={config.particleColor} strokeWidth="1.5" />
                
                {/* Energy Flow */}
                {particles.map(p => (
                    <circle 
                        key={p.id}
                        cx={`${p.x}%`}
                        cy="0"
                        r={p.size}
                        fill={config.particleColor}
                        opacity={0.9}
                        style={{ filter: `drop-shadow(0 0 2px ${config.particleColor})`, ...p.style }}
                    />
                ))}
            </svg>
        </div>
    );
}


export const EarthGroundingCore: React.FC<EarthGroundingCoreProps> = ({ data, onDischarge, isDischarging }) => {
    const { charge, conductivity, status } = data;
    const config = getStatusConfig(status);
    const canDischarge = charge > 0.75 && !isDischarging;

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-orbitron text-md text-warm-grey">Earth Grounding Core</h3>
                    <p className={`font-orbitron font-bold text-md ${config.color} ${status !== 'STABLE' ? 'animate-pulse' : ''}`}>{config.label}</p>
                </div>
                <button 
                    onClick={onDischarge}
                    disabled={!canDischarge}
                    className="px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase bg-cyan-800/70 hover:bg-cyan-700 text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDischarging ? 'DISCHARGING' : 'Discharge Core'}
                </button>
            </div>
            
            <GroundingVisual data={data} />

            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
                <Tooltip text="The amount of stabilized telluric energy stored in the grounding core. This energy can be discharged to rapidly reduce system-wide decoherence.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Charge Level</span>
                        <p className="font-mono text-pearl text-base">{(charge * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>
                <Tooltip text="The efficiency of the connection to the Earth's energy grid. Higher conductivity allows for faster charging and more effective grounding.">
                    <div className="text-right">
                        <span className="text-warm-grey text-xs uppercase">Conductivity</span>
                        <p className="font-mono text-pearl text-base">{(conductivity * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};