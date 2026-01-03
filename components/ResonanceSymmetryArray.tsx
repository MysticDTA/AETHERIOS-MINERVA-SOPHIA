
import React, { useMemo, useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';

interface ResonanceSymmetryArrayProps {
    rho: number;
    isOptimizing: boolean;
}

export const ResonanceSymmetryArray: React.FC<ResonanceSymmetryArrayProps> = ({ rho, isOptimizing }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let frame = requestAnimationFrame(function animate(t) {
            setTime(t / 1000);
            frame = requestAnimationFrame(animate);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const symmetryPaths = useMemo(() => {
        const petals = 8;
        const pointsPerPetal = 30;
        const baseRadius = 40;
        const jitter = isOptimizing ? 0 : (1 - rho) * 20;
        
        return Array.from({ length: petals }).map((_, petalIdx) => {
            const petalRotation = (petalIdx / petals) * Math.PI * 2;
            let d = "M ";
            
            for (let i = 0; i <= pointsPerPetal; i++) {
                const step = i / pointsPerPetal;
                const angle = (step * Math.PI) - (Math.PI / 2);
                
                // Mathematical flower petal logic influenced by Rho
                const r = baseRadius * Math.sin(angle) * Math.cos(petalIdx + time) * (rho + 0.2);
                const x = 50 + r * Math.cos(petalRotation + angle * (1 - rho));
                const y = 50 + r * Math.sin(petalRotation + angle * (1 - rho));
                
                if (i === 0) d += `${x} ${y}`;
                else d += ` L ${x} ${y}`;
            }
            return d + " Z";
        });
    }, [rho, time, isOptimizing]);

    return (
        <div className="w-full h-full bg-dark-surface/40 border border-dark-border/60 rounded-lg p-5 backdrop-blur-md relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4 z-10 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-sm rotate-45 ${isOptimizing ? 'bg-pearl animate-ping' : 'bg-violet-500'}`} />
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Phase Symmetry V1</h3>
                </div>
                {isOptimizing && (
                    <span className="font-mono text-[8px] text-pearl animate-pulse bg-violet-600/30 px-2 py-0.5 rounded">OPTIMIZATION_ACTIVE</span>
                )}
            </div>

            <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
                <svg viewBox="0 0 100 100" className="w-full h-full max-h-[200px]">
                    <defs>
                        <filter id="symmetryGlow"><feGaussianBlur stdDeviation="1" /></filter>
                        <linearGradient id="symGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--aether-blue)" />
                            <stop offset="100%" stopColor="var(--pearl)" />
                        </linearGradient>
                    </defs>
                    
                    {/* Background Grid Lines */}
                    {[20, 40, 60, 80].map(r => (
                        <circle key={r} cx="50" cy="50" r={r/2} fill="none" stroke="var(--dark-border)" strokeWidth="0.1" strokeDasharray="1 4" />
                    ))}

                    <g style={{ transformOrigin: 'center', transition: 'transform 2s ease-in-out', transform: `rotate(${time * 5}deg)` }}>
                        {symmetryPaths.map((path, i) => (
                            <path 
                                key={i}
                                d={path}
                                fill="none"
                                stroke="url(#symGrad)"
                                strokeWidth={isOptimizing ? "0.4" : "0.2"}
                                opacity={0.3 + (rho * 0.4)}
                                filter="url(#symmetryGlow)"
                                className="transition-all duration-1000"
                            />
                        ))}
                    </g>

                    {/* Central Core Pulse */}
                    <circle cx="50" cy="50" r={2 + rho * 3} fill="var(--pearl)" opacity={0.1}>
                        <animate attributeName="r" values={`${2 + rho * 3};${5 + rho * 5};${2 + rho * 3}`} dur="3s" repeatCount="indefinite" />
                    </circle>
                </svg>

                {/* Real-time jitter indicator */}
                <div className="absolute bottom-2 left-2 font-mono text-[8px] text-slate-500 uppercase space-y-1">
                    <p>Phase_Lock: {(rho * 100).toFixed(2)}%</p>
                    <p>Causal_Sym: {isOptimizing ? 'MAX' : 'DIVERGING'}</p>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                         <span className="text-[7px] text-slate-600 uppercase tracking-widest block font-bold">Harmonic Variance</span>
                         <div className="flex gap-0.5 h-1 w-24 bg-slate-900 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${isOptimizing ? 'bg-green-500' : 'bg-violet-500'}`} style={{ width: `${(1 - rho) * 100}%` }} />
                         </div>
                    </div>
                    <div className="text-right">
                        <span className="font-orbitron text-xs text-pearl">{(rho * 1.0).toFixed(4)} Ψ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
