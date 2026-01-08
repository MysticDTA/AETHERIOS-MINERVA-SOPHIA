
import React, { useState, useEffect } from 'react';
import { OrbMode } from '../types';

interface RealTimeIntelTickerProps {
    orbMode: OrbMode;
    rho: number;
}

const BASE_MESSAGES = [
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

const GENERATE_HEX = () => `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`;

const ScrambleText: React.FC<{ text: string }> = ({ text }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    useEffect(() => {
        let iter = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((letter, index) => {
                if (index < iter) return letter;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));

            if (iter >= text.length) clearInterval(interval);
            iter += 1 / 2; // Decoding speed
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}</span>;
};

export const RealTimeIntelTicker: React.FC<RealTimeIntelTickerProps> = ({ orbMode, rho }) => {
    const [telemetry, setTelemetry] = useState<{ id: number, text: string, hex: string, timestamp: string }[]>([]);
    
    // Dynamic Message Generation
    useEffect(() => {
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // Context-aware injections
            let msg = BASE_MESSAGES[Math.floor(Math.random() * BASE_MESSAGES.length)];
            const rnd = Math.random();
            if (rnd > 0.7) msg = `RHO_METRIC_UPDATE: ${(rho + (Math.random() * 0.001 - 0.0005)).toFixed(6)}`;
            else if (rnd > 0.5) msg = `MODE_INTERCEPT: ${orbMode}_PROTOCOL`;

            const hex = GENERATE_HEX();
            
            setTelemetry(prev => {
                const next = [{ id: Date.now(), text: msg, hex, timestamp: time }, ...prev];
                return next.slice(0, 4); // Keep last 4 for density
            });
        }, 2500);
        return () => clearInterval(interval);
    }, [orbMode, rho]);

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-9 flex items-center justify-center overflow-hidden border-x border-b border-white/10 bg-black/80 backdrop-blur-xl rounded-b-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50 pointer-events-auto cursor-help group transition-all hover:border-gold/30 hover:h-10">
            <div className="flex items-center gap-4 w-full px-4 relative">
                {/* Status Indicator */}
                <div className="flex flex-col items-center justify-center gap-0.5 shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${rho > 0.9 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
                    <div className={`w-0.5 h-2 ${rho > 0.9 ? 'bg-emerald-500/50' : 'bg-gold/50'}`} />
                </div>
                
                {/* Scrolling Ticker Area */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center mask-linear-fade">
                    <div className="flex gap-12 font-mono text-[9px] text-pearl/80 uppercase tracking-widest whitespace-nowrap animate-ticker-slow hover:[animation-play-state:paused]">
                        {telemetry.map((t) => (
                            <span key={t.id} className="flex items-center gap-2">
                                <span className="text-violet-400/60 font-bold">[{t.timestamp}]</span>
                                <span className="text-gold/80">{t.hex}</span>
                                <span className="text-slate-300">::</span>
                                <span><ScrambleText text={t.text} /></span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex items-center gap-3 border-l border-white/10 pl-4 shrink-0">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-[6px] font-mono text-slate-500 uppercase tracking-[0.2em]">System_Mode</span>
                        <span className="text-[8px] font-orbitron text-gold font-bold">{orbMode}</span>
                    </div>
                    <div className="w-2 h-2 border border-white/20 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                </div>
            </div>
            
            {/* Visual Flair */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-50" />
            
            <style>{`
                @keyframes ticker-slow {
                    0% { transform: translateX(10%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-ticker-slow {
                    animation: ticker-slow 30s linear infinite;
                }
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </div>
    );
};
