import React, { useMemo, useState, useEffect } from 'react';
import { AethericTransferData, AethericTransferStatus } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';

interface AethericTransferMonitorProps {
  data: AethericTransferData;
  onPurge: () => void;
  isPurging: boolean;
}

const getStatusConfig = (status: AethericTransferStatus) => {
    switch(status) {
        case 'STABLE':
            return { color: 'text-pearl', label: 'STABLE', particleColor: 'hsl(180, 50%, 80%)' };
        case 'TURBULENT':
            return { color: 'text-gold', label: 'TURBULENT', particleColor: 'hsl(50, 80%, 60%)' };
        case 'STAGNANT':
            return { color: 'text-orange-400', label: 'STAGNANT', particleColor: 'hsl(30, 80%, 60%)' };
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', particleColor: 'hsl(0, 0%, 50%)' };
    }
}

const ParticleFlow: React.FC<{ density: number; efficiency: number, color: string, status: AethericTransferStatus }> = ({ density, efficiency, color, status }) => {
    const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);

    useEffect(() => {
      const unsubscribe = performanceService.subscribe(setTier);
      return () => unsubscribe();
    }, []);

    const particleCount = useMemo(() => {
        let baseDensity = density * 20;
        let maxCount = 50;
        if (tier === 'MEDIUM') {
          baseDensity = density * 10;
          maxCount = 25;
        } else if (tier === 'LOW') {
          baseDensity = density * 5;
          maxCount = 10;
        }
        return Math.max(5, Math.min(maxCount, Math.floor(baseDensity)));
    }, [density, tier]);

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            let animationStyle: React.CSSProperties = {};
            const delay = Math.random() * -5;
            let duration = (4 - (efficiency * 3)) + Math.random(); // 1s to 5s

            switch (status) {
                case 'TURBULENT':
                    animationStyle = {
                        animation: `particle-flow ${duration * 0.8}s ${delay}s linear infinite, particle-turbulence ${0.3 + Math.random() * 0.4}s linear infinite alternate`
                    };
                    break;
                case 'STAGNANT':
                     animationStyle = {
                        animation: `particle-flow ${duration * 4}s ${delay}s linear infinite, particle-stagnant-flicker 1.5s ${delay}s ease-in-out infinite`
                    };
                    break;
                case 'STABLE':
                default:
                     animationStyle = {
                        animation: `particle-flow ${duration}s ${delay}s linear infinite`
                    };
                    break;
            }
            
            return {
                id: i,
                x: Math.random() * 100,
                size: 0.5 + Math.random() * 1.5,
                style: animationStyle
            };
        });
    }, [particleCount, efficiency, status]);

    return (
        <div className="w-full h-24 bg-black/20 rounded-md relative overflow-hidden">
             <svg className="w-full h-full" preserveAspectRatio="none">
                {particles.map(p => (
                    <circle 
                        key={p.id}
                        cx={`${p.x}%`}
                        cy="0"
                        r={p.size}
                        fill={color}
                        opacity={0.8}
                        style={{
                            filter: `drop-shadow(0 0 2px ${color})`,
                            ...p.style,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}


export const AethericTransferMonitor: React.FC<AethericTransferMonitorProps> = ({ data, onPurge, isPurging }) => {
    const { efficiency, particleDensity, fluxStatus, entropy } = data;
    const [previewStatus, setPreviewStatus] = useState<AethericTransferStatus | null>(null);

    const displayStatus = previewStatus || fluxStatus;
    const displayConfig = getStatusConfig(displayStatus);
    const isPreviewing = previewStatus !== null;
    
    const filterOptions: AethericTransferStatus[] = ['STABLE', 'TURBULENT', 'STAGNANT'];

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-orbitron text-md text-warm-grey">Aetheric Transfer</h3>
                     <p className={`font-orbitron font-bold text-md ${displayConfig.color} ${!isPreviewing && fluxStatus !== 'STABLE' ? 'animate-pulse' : ''}`}>
                        {displayConfig.label}
                        {isPreviewing && <span className="text-xs text-cyan-400 ml-2">(PREVIEW)</span>}
                    </p>
                </div>
                <button 
                    onClick={onPurge}
                    disabled={isPurging || fluxStatus === 'STABLE'}
                    className="px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase bg-dark-surface/70 hover:bg-slate-700 text-warm-grey disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPurging ? 'PURGING...' : 'Purge Flow'}
                </button>
            </div>
            
            <ParticleFlow density={particleDensity} efficiency={efficiency} color={displayConfig.particleColor} status={displayStatus} />

            <div className="mt-3 flex justify-center items-center gap-2">
                <span className="text-xs text-warm-grey uppercase">View Filter:</span>
                <button 
                    onClick={() => setPreviewStatus(null)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${!isPreviewing ? 'bg-cyan-500 text-slate-900 font-bold' : 'bg-dark-surface/80 text-warm-grey hover:bg-slate-700'}`}
                >
                    Live
                </button>
                {filterOptions.map(opt => (
                     <button 
                        key={opt}
                        onClick={() => setPreviewStatus(opt)}
                        className={`px-2 py-0.5 rounded text-xs transition-colors capitalize ${previewStatus === opt ? 'bg-cyan-500 text-slate-900 font-bold' : 'bg-dark-surface/80 text-warm-grey hover:bg-slate-700'}`}
                    >
                        {opt.toLowerCase()}
                    </button>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-3 gap-x-4 text-sm text-center border-t border-dark-border/50 pt-2">
                <div>
                    <span className="text-warm-grey text-xs uppercase">Efficiency</span>
                    <p className="font-mono text-pearl text-base">{(efficiency * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <span className="text-warm-grey text-xs uppercase">Density</span>
                    <p className="font-mono text-pearl text-base">{particleDensity.toFixed(2)}</p>
                </div>
                 <div>
                    <span className="text-warm-grey text-xs uppercase">Entropy</span>
                    <p className="font-mono text-pearl text-base">{(entropy * 100).toFixed(1)}%</p>
                </div>
            </div>
        </div>
    );
};