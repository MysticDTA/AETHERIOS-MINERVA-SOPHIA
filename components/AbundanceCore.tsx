import React, { useMemo, useState, useEffect } from 'react';
import { AbundanceCoreData } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';
import { Tooltip } from './Tooltip';

interface AbundanceCoreProps {
  data: AbundanceCoreData;
}

const getStatusConfig = (status: AbundanceCoreData['status']) => {
    switch(status) {
        case 'EXPANDING':
            return { color: 'var(--pearl)', label: 'EXPANDING', glow: '0 0 25px var(--pearl)' };
        case 'STABLE':
            return { color: 'var(--gold)', label: 'STABLE', glow: '0 0 20px var(--gold)' };
        case 'CONTRACTING':
            return { color: 'hsl(30, 80%, 60%)', label: 'CONTRACTING', glow: '0 0 15px hsl(30, 80%, 60%)' };
        default:
            return { color: 'var(--warm-grey)', label: 'UNKNOWN', glow: 'none' };
    }
}

const ParticleEmitter: React.FC<{ flow: number; color: string; status: AbundanceCoreData['status'] }> = ({ flow, color, status }) => {
    const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);

    useEffect(() => {
      const unsubscribe = performanceService.subscribe(setTier);
      return () => unsubscribe();
    }, []);
    
    const particleCount = useMemo(() => {
        let baseCount = flow * 40;
        if (tier === 'MEDIUM') baseCount = flow * 20;
        if (tier === 'LOW') baseCount = flow * 10;
        return Math.floor(Math.max(5, baseCount));
    }, [flow, tier]);

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 100; // Emerge from center and travel outwards
            const duration = 2 + (1 - flow) * 4 + Math.random() * 2;
            const delay = Math.random() * -duration;

            return {
                id: i,
                size: 0.5 + Math.random() * 1.5,
                style: {
                    '--angle': `${angle}rad`,
                    '--distance': `${distance}%`,
                    animation: `particle-emission ${duration}s ${delay}s linear infinite`,
                } as React.CSSProperties
            };
        });
    }, [particleCount, flow]);

    return (
         <div className="absolute inset-0">
            <style>{`
                @keyframes particle-emission {
                    from { transform: rotate(var(--angle)) translateX(15%) scale(0.5); opacity: 1; }
                    to { transform: rotate(var(--angle)) translateX(var(--distance)) scale(1); opacity: 0; }
                }
            `}</style>
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {particles.map(p => (
                    <circle 
                        key={p.id}
                        cx="50"
                        cy="50"
                        r={p.size}
                        fill={color}
                        style={{ ...p.style }}
                    />
                ))}
            </svg>
        </div>
    );
};


export const AbundanceCore: React.FC<AbundanceCoreProps> = ({ data }) => {
    const { flow, generosity, status } = data;
    const config = getStatusConfig(status);
    const pulseDuration = 3 - flow * 2; // Faster pulse for higher flow

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-orbitron text-lg text-warm-grey">Abundance Core</h3>
                <p className={`font-orbitron font-bold text-lg ${status !== 'STABLE' ? 'animate-pulse' : ''}`} style={{ color: config.color }}>{config.label}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative min-h-0">
                <div className="w-48 h-48 relative">
                    <ParticleEmitter flow={flow} color={config.color} status={status} />
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        <defs>
                            <filter id="abundanceGlow">
                                <feGaussianBlur stdDeviation="5" />
                            </filter>
                             <radialGradient id="abundanceGradient">
                                <stop offset="0%" stopColor={config.color} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={config.color} stopOpacity={0.2} />
                            </radialGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r={15 + generosity * 15}
                            fill="url(#abundanceGradient)"
                            filter="url(#abundanceGlow)"
                            className="transition-all duration-500"
                            style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }}
                        />
                         <circle
                            cx="50"
                            cy="50"
                            r={15 + generosity * 15}
                            fill="none"
                            stroke={config.color}
                            strokeWidth="1"
                            className="transition-all duration-500"
                        />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-dark-border/50">
                <div className="text-center">
                    <Tooltip text="The rate of energy and resource circulation within the system. Higher flow indicates efficient, dynamic exchange.">
                        <p className="text-sm text-warm-grey uppercase tracking-wider cursor-help">Flow</p>
                    </Tooltip>
                    <p className="font-orbitron text-3xl font-bold" style={{ color: config.color, textShadow: config.glow }}>
                        {(flow * 100).toFixed(1)}%
                    </p>
                </div>
                 <div className="text-center">
                    <Tooltip text="The system's potential for positive, regenerative output and manifestation. Higher generosity reflects a capacity to create beneficial outcomes.">
                        <p className="text-sm text-warm-grey uppercase tracking-wider cursor-help">Generosity</p>
                    </Tooltip>
                    <p className="font-orbitron text-3xl font-bold" style={{ color: config.color, textShadow: config.glow }}>
                        {(generosity * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};