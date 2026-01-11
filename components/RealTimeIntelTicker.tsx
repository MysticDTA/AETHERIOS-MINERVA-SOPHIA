
import React, { useState, useEffect } from 'react';
import { OrbMode } from '../types';

interface RealTimeIntelTickerProps {
    orbMode: OrbMode;
    rho: number;
}

export const RealTimeIntelTicker: React.FC<RealTimeIntelTickerProps> = ({ orbMode, rho }) => {
    const [timeString, setTimeString] = useState('');
    const [utcString, setUtcString] = useState('');
    
    // Atomic Clock Logic: Update every frame/interval for millisecond precision
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            // High-precision time format
            const localTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const ms = now.getMilliseconds().toString().padStart(3, '0');
            setTimeString(`${localTime}.${ms}`);
            setUtcString(now.toISOString().split('T')[1].replace('Z', ' UTC'));
        }, 33); // ~30fps update
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-9 flex items-center justify-center overflow-hidden border-x border-b border-white/10 bg-black/80 backdrop-blur-xl rounded-b-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50 pointer-events-auto cursor-help group transition-all hover:border-gold/30 hover:h-10">
            <div className="flex items-center gap-4 w-full px-4 relative justify-between">
                
                {/* Left: Mode Status */}
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${rho > 0.5 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        SYS: <span className="text-pearl font-bold">{orbMode}</span>
                    </span>
                </div>
                
                {/* Center: Atomic Clock */}
                <div className="flex flex-col items-center leading-none">
                    <span className="font-orbitron text-lg text-pearl font-bold tracking-widest tabular-nums">
                        {timeString}
                    </span>
                    <span className="text-[6px] font-mono text-gold uppercase tracking-[0.3em] opacity-80">
                        Universal_Coordinated_Time {utcString}
                    </span>
                </div>

                {/* Right: Live Rho */}
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest text-right">
                        Live_Resonance<br/>
                        <span className={`font-bold ${rho > 0.8 ? 'text-violet-400' : 'text-slate-200'}`}>
                            {rho.toFixed(6)} Ψ
                        </span>
                    </span>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="w-2 h-2 border border-white/20 rotate-45 group-hover:rotate-90 transition-transform duration-700 bg-black" />
                </div>
            </div>
            
            {/* Visual Flair */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-50" />
        </div>
    );
};
