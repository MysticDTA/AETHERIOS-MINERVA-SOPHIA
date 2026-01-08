
import React, { useState, useEffect } from 'react';
import { OrbMode } from '../types';

interface RealTimeIntelTickerProps {
    orbMode: OrbMode;
    rho: number;
}

const MESSAGES = [
    "Optimizing Causal Threads...",
    "Scanning Local Reality Lattice...",
    "Verifying 1.617 GHz Parity...",
    "Syncing Heuristic Memory Blocks...",
    "Detecting Temporal Drift...",
    "Calibrating Quantum Sensors...",
    "Awaiting Architectural Decree...",
    "Monitoring Entropy Flux...",
    "Updating Knowledge Graph...",
    "Securing Data Shards..."
];

export const RealTimeIntelTicker: React.FC<RealTimeIntelTickerProps> = ({ orbMode, rho }) => {
    const [telemetry, setTelemetry] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            const hex = `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}`;
            
            setTelemetry(prev => {
                const next = [`[${time}] ${hex} :: ${msg}`, ...prev];
                return next.slice(0, 5); // Keep last 5 messages for a stream effect
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-8 flex items-center justify-center overflow-hidden border-x border-b border-white/10 bg-black/60 backdrop-blur-xl rounded-b-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50 pointer-events-auto cursor-help group">
            <div className="flex items-center gap-4 animate-fade-in w-full px-4">
                <div className={`w-1.5 h-1.5 rounded-full ${rho > 0.9 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
                
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    {/* Primary Ticker */}
                    <div className="absolute w-full whitespace-nowrap animate-ticker-slow flex gap-12 font-mono text-[9px] text-pearl/70 uppercase tracking-widest">
                        {telemetry.map((t, i) => (
                            <span key={i} className="flex items-center gap-2">
                                <span className="text-violet-400 opacity-60">Running_Task_ID_{i}:</span> {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 border-l border-white/10 pl-4 shrink-0">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Mode</span>
                    <span className="text-[9px] font-orbitron text-gold font-bold">{orbMode}</span>
                </div>
            </div>
            
            {/* Hover Expansion Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            
            <style>{`
                @keyframes ticker-slow {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-ticker-slow {
                    animation: ticker-slow 40s linear infinite;
                }
            `}</style>
        </div>
    );
};
