
import React from 'react';
import { CommunityData } from '../types';

interface SynchronizedSynodMapProps {
    communities: CommunityData[];
    aggregateRho: number;
}

export const SynchronizedSynodMap: React.FC<SynchronizedSynodMapProps> = ({ communities, aggregateRho }) => {
    return (
        <div className="relative w-full aspect-video bg-black/60 rounded-2xl border border-white/5 overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #ffd700 0.5px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                    <filter id="synodGlow">
                        <feGaussianBlur stdDeviation="1.5" />
                    </filter>
                    <radialGradient id="communityHeat">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Connection Lattice */}
                {communities.map((c1, i) => (
                    communities.slice(i + 1).map((c2) => {
                        const distance = Math.sqrt(Math.pow(c1.location.x - c2.location.x, 2) + Math.pow(c1.location.y - c2.location.y, 2));
                        if (distance > 40) return null;
                        return (
                            <line 
                                key={`${c1.id}-${c2.id}`}
                                x1={c1.location.x} y1={c1.location.y}
                                x2={c2.location.x} y2={c2.location.y}
                                stroke="white"
                                strokeWidth="0.1"
                                opacity={0.1 * aggregateRho}
                                strokeDasharray="1 1"
                            />
                        );
                    })
                ))}

                {/* Community Resonance Rings */}
                {communities.map(c => (
                    <g key={c.id}>
                        <circle 
                            cx={c.location.x} cy={c.location.y} 
                            r={c.rho * 6} 
                            fill="url(#communityHeat)" 
                            opacity={0.3}
                            filter="url(#synodGlow)"
                        >
                            <animate attributeName="r" values={`${c.rho * 4};${c.rho * 8};${c.rho * 4}`} dur={`${3 / c.rho}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx={c.location.x} cy={c.location.y} r="0.6" fill="#fff" />
                        <text 
                            x={c.location.x} y={c.location.y + 4} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="1.5" 
                            className="font-orbitron uppercase tracking-widest font-black opacity-40 select-none"
                        >
                            {c.name}
                        </text>
                    </g>
                ))}
            </svg>

            <div className="absolute top-6 left-8 flex flex-col gap-1.5 pointer-events-none">
                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] font-black">Resonance_Sync_Lattice</span>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global_Status: STABLE</span>
                </div>
            </div>

            <div className="absolute bottom-6 right-8 text-right pointer-events-none">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Aggregate_Rho</p>
                <p className="font-orbitron text-2xl text-pearl font-black">{aggregateRho.toFixed(6)}</p>
            </div>
        </div>
    );
};
