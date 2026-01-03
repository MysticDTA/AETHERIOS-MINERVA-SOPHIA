
import React, { useMemo } from 'react';

interface SystemIntegrityMapProps {
    rho: number;
    coherence: number;
    stability: number;
    alignment: number;
}

export const SystemIntegrityMap: React.FC<SystemIntegrityMapProps> = ({ rho, coherence, stability, alignment }) => {
    const quadrants = [
        { label: 'COGNITION', val: alignment, color: '#67e8f9', desc: 'Logic Alignment' },
        { label: 'HARMONY', val: rho, color: '#e6c77f', desc: 'Resonant Synergy' },
        { label: 'VITALITY', val: coherence, color: '#f4c2c2', desc: 'Bio-Sync Purity' },
        { label: 'STABILITY', val: stability, color: '#a78bfa', desc: 'Causal Anchor' },
    ];

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-5 rounded-lg border-glow-gold backdrop-blur-md relative overflow-hidden h-full flex flex-col group transition-all duration-500 hover:bg-dark-surface/70">
            {/* Background Intellectual Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
                backgroundImage: `radial-gradient(circle at 2px 2px, var(--warm-grey) 1px, transparent 0)`,
                backgroundSize: '15px 15px'
            }} />
            
            <div className="flex justify-between items-center mb-4 flex-shrink-0 z-10 border-b border-white/5 pb-2">
                <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Resonance Topology V4</h3>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] text-pearl tracking-widest uppercase">INTERCEPT_LOCKED</span>
                </div>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full max-h-[160px] overflow-visible">
                    <defs>
                        <filter id="dataGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" operator="over" /></filter>
                        <radialGradient id="topologyGrad">
                            <stop offset="0%" stopColor="rgba(248, 245, 236, 0.05)" />
                            <stop offset="100%" stopColor="rgba(230, 199, 127, 0.1)" />
                        </radialGradient>
                    </defs>

                    {/* Radar Circles */}
                    {[20, 35, 48].map(r => (
                        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--dark-border)" strokeWidth="0.2" strokeDasharray={r === 48 ? "none" : "2 2"} opacity={r / 60} />
                    ))}
                    
                    {/* Crosshair Axes */}
                    <line x1="50" y1="2" x2="50" y2="98" stroke="var(--dark-border)" strokeWidth="0.1" opacity="0.3" />
                    <line x1="2" y1="50" x2="98" y2="50" stroke="var(--dark-border)" strokeWidth="0.1" opacity="0.3" />

                    {/* Data Shape with Animation */}
                    <path 
                        d={`M 50 ${50 - alignment * 45} L ${50 + rho * 45} 50 L 50 ${50 + coherence * 45} L ${50 - stability * 45} 50 Z`}
                        fill="url(#topologyGrad)"
                        stroke="var(--pearl)"
                        strokeWidth="0.8"
                        filter="url(#dataGlow)"
                        className="transition-all duration-1000 ease-in-out"
                        style={{ transformOrigin: 'center' }}
                    >
                        <animateTransform attributeName="transform" type="scale" values="1;1.02;1" dur="4s" repeatCount="indefinite" />
                    </path>

                    {/* Intercept Markers */}
                    {quadrants.map((q, i) => {
                        const angle = i * Math.PI / 2;
                        const dist = q.val * 45;
                        const cx = 50 + dist * Math.sin(angle);
                        const cy = 50 - dist * Math.cos(angle);
                        
                        return (
                            <g key={q.label}>
                                <line x1="50" y1="50" x2={cx} y2={cy} stroke={q.color} strokeWidth="0.3" opacity="0.4" />
                                <circle cx={cx} cy={cy} r="1.5" fill={q.color} filter="url(#dataGlow)">
                                    <animate attributeName="r" values="1.5;2.5;1.5" dur={`${2 + i}s`} repeatCount="indefinite" />
                                </circle>
                                {/* Vector Labels Integrated */}
                                <text 
                                    x={50 + 54 * Math.sin(angle)} 
                                    y={50 - 54 * Math.cos(angle)} 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    fontSize="3.5"
                                    fill={q.color}
                                    className="font-orbitron uppercase tracking-widest font-bold opacity-80"
                                >
                                    {q.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-dark-border/50 flex-shrink-0">
                {quadrants.map(q => (
                    <div key={q.label} className="flex flex-col items-center">
                        <span className="text-[7px] text-slate-500 uppercase tracking-tighter mb-0.5">{q.desc}</span>
                        <span className="font-mono text-[10px] text-pearl">{(q.val * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
