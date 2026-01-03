import React, { useMemo, useState, useEffect } from 'react';
import { DilutionRefrigeratorData, DilutionRefrigeratorStatus } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';
import { Tooltip } from './Tooltip';

interface DilutionRefrigeratorProps {
  data: DilutionRefrigeratorData;
  onFlush: () => void;
  isFlushing: boolean;
  onCalibrate: () => void;
  isCalibrating: boolean;
}

const getStatusConfig = (status: DilutionRefrigeratorStatus) => {
    switch(status) {
        case 'STABLE': return { color: 'text-cyan-300', label: 'STABLE' };
        case 'UNSTABLE': return { color: 'text-yellow-400', label: 'UNSTABLE' };
        case 'BOOSTED': return { color: 'text-pearl', label: 'FLUSH CYCLE ACTIVE' };
        case 'OFFLINE': return { color: 'text-rose-400', label: 'OFFLINE' };
        default: return { color: 'text-warm-grey', label: 'UNKNOWN' };
    }
};

const FridgeVisualizer: React.FC<{ status: DilutionRefrigeratorStatus, isCalibrating: boolean }> = ({ status, isCalibrating }) => {
    const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);

    useEffect(() => {
      const unsubscribe = performanceService.subscribe(setTier);
      return () => unsubscribe();
    }, []);
    
    const particleCount = useMemo(() => {
        let count = 20;
        if (tier === 'MEDIUM') count = 12;
        if (tier === 'LOW') count = 6;
        return count;
    }, [tier]);
    
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            const isHe3 = i % 4 === 0; // 1 in 4 particles is He-3
            let duration = 5 + Math.random() * 5;
            let animationName = 'fridge-flow-stable';

            if (isCalibrating) {
                duration = 2 + Math.random(); // Fast, smooth flow
                // We'll handle the visual style in the render via overrides
            } else if (status === 'BOOSTED') {
                duration = 1 + Math.random() * 2;
                animationName = 'fridge-flow-boosted';
            } else if (status === 'UNSTABLE') {
                duration = 3 + Math.random() * 4;
                animationName = 'fridge-flow-unstable';
            } else if (status === 'OFFLINE') {
                duration = 0;
            }
            
            return {
                id: i,
                isHe3,
                duration,
                delay: Math.random() * -duration,
                animationName,
            };
        });
    }, [particleCount, status, isCalibrating]);

    return (
        <div className="w-full h-full relative">
            <style>{`
                @keyframes fridge-flow-stable {
                    from { motion-offset: 0%; } to { motion-offset: 100%; }
                }
                @keyframes fridge-flow-unstable {
                    from { motion-offset: 0%; } to { motion-offset: 100%; }
                }
                @keyframes fridge-flow-boosted {
                    from { motion-offset: 0%; } to { motion-offset: 100%; }
                }
            `}</style>
             <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <path id="fridge-path" d="M 20 80 C 20 20, 50 20, 50 50 S 80 80, 110 80 S 140 20, 170 20" fill="none" />
                    <filter id="coolingGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path d="M 10 90 L 190 90 M 10 10 L 190 10" stroke="var(--dark-border)" strokeWidth="1" />
                <path d="M 30 10 V 90 M 70 10 V 90 M 120 10 V 90 M 160 10 V 90" stroke="var(--dark-border)" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="30" y="8" fill="var(--warm-grey)" fontSize="6" textAnchor="middle">Still</text>
                <text x="70" y="8" fill="var(--warm-grey)" fontSize="6" textAnchor="middle">HX-1</text>
                <text x="120" y="8" fill="var(--warm-grey)" fontSize="6" textAnchor="middle">HX-2</text>
                <text x="160" y="8" fill="var(--warm-grey)" fontSize="6" textAnchor="middle">Chamber</text>

                <use href="#fridge-path" stroke={isCalibrating ? "var(--cyan-400)" : "var(--dark-border)"} strokeWidth="2" opacity={isCalibrating ? 0.5 : 1} />
                
                {status !== 'OFFLINE' && particles.map(p => (
                    <circle 
                        key={p.id} 
                        r={p.isHe3 ? 2 : 1.5} 
                        fill={isCalibrating ? (p.isHe3 ? "#fff" : "var(--cyan-300)") : (p.isHe3 ? "var(--gold)" : "var(--pearl)")} 
                        opacity={p.isHe3 ? 1 : 0.7}
                        filter={isCalibrating ? "url(#coolingGlow)" : undefined}
                    >
                        <animateMotion dur={`${p.duration}s`} begin={`${p.delay}s`} repeatCount="indefinite" path="M 20 80 C 20 20, 50 20, 50 50 S 80 80, 110 80 S 140 20, 170 20" />
                    </circle>
                ))}
             </svg>
             {isCalibrating && (
                 <div className="absolute inset-0 flex items-center justify-center">
                     <p className="font-orbitron text-cyan-300 bg-black/70 px-2 py-1 rounded border border-cyan-500 animate-pulse text-xs">CALIBRATING</p>
                 </div>
             )}
        </div>
    );
};


export const DilutionRefrigerator: React.FC<DilutionRefrigeratorProps> = ({ data, onFlush, isFlushing, onCalibrate, isCalibrating }) => {
    const { temperature, status, coolingPower } = data;
    const config = getStatusConfig(status);
    const canFlush = !isFlushing && !isCalibrating && status !== 'OFFLINE' && status !== 'BOOSTED';
    const canCalibrate = !isFlushing && !isCalibrating && status !== 'OFFLINE' && (status === 'UNSTABLE' || temperature > 20);
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className={`w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col transition-all duration-300 ${isMinimized ? 'h-auto' : 'h-64'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMinimized(!isMinimized)} 
                            className="text-warm-grey hover:text-pearl"
                            title={isMinimized ? "Expand" : "Minimize"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMinimized ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                )}
                            </svg>
                        </button>
                        <h3 className="font-orbitron text-md text-warm-grey">Dilution Refrigerator</h3>
                    </div>
                    <p className={`font-orbitron font-bold text-xs ${config.color} ${status !== 'STABLE' ? 'animate-pulse' : ''} ml-6`}>{config.label}</p>
                </div>
                {!isMinimized && (
                    <div className="flex flex-col gap-1 items-end">
                        {canCalibrate && (
                            <button
                                onClick={onCalibrate}
                                className="px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase bg-pearl/20 hover:bg-pearl/40 text-pearl animate-pulse border border-pearl/30"
                            >
                                Calibrate Temp
                            </button>
                        )}
                        <button
                            onClick={onFlush}
                            disabled={!canFlush}
                            className="px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase bg-cyan-800/70 hover:bg-cyan-700 text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFlushing ? 'FLUSHING...' : 'Flush Helium-3'}
                        </button>
                    </div>
                )}
            </div>

            {!isMinimized ? (
                <>
                    <div className="flex-1 min-h-0">
                        <FridgeVisualizer status={status} isCalibrating={isCalibrating} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center border-t border-dark-border/50 pt-2">
                        <Tooltip text="Operational temperature of the mixing chamber.">
                            <div>
                                <p className="text-[10px] text-warm-grey uppercase">Temp</p>
                                <p className={`font-orbitron text-lg font-bold ${temperature > 40 ? 'text-yellow-400' : 'text-pearl'}`}>{temperature.toFixed(1)} <span className="text-xs">mK</span></p>
                            </div>
                        </Tooltip>
                        <Tooltip text="Heat extraction capability.">
                            <div>
                                <p className="text-[10px] text-warm-grey uppercase">Power</p>
                                <p className={`font-orbitron text-lg font-bold ${coolingPower < 300 ? 'text-yellow-400' : 'text-pearl'}`}>{coolingPower.toFixed(0)} <span className="text-xs">µW</span></p>
                            </div>
                        </Tooltip>
                    </div>
                </>
            ) : (
                <div className="flex justify-between items-center px-4">
                     <span className={`font-mono text-sm ${temperature > 40 ? 'text-yellow-400' : 'text-pearl'}`}>{temperature.toFixed(1)} mK</span>
                     <span className={`font-mono text-sm text-slate-400`}>{coolingPower.toFixed(0)} µW</span>
                </div>
            )}
        </div>
    );
};