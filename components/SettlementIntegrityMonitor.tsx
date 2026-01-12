
import React, { useEffect, useRef, useState } from 'react';
import { SystemState } from '../types';
import { Tooltip } from './Tooltip';

interface SettlementIntegrityMonitorProps {
    systemState: SystemState;
    onDecree: () => void;
}

export const SettlementIntegrityMonitor: React.FC<SettlementIntegrityMonitorProps> = ({ systemState, onDecree }) => {
    const { resonanceFactorRho, quantumHealing } = systemState;
    const shadow = quantumHealing.decoherence; // S
    const intent = resonanceFactorRho; // I (Is)
    
    // Existing Integrity (Si)
    const integrity = Math.min(100, Math.max(0, (intent * (1 - shadow)) * 100));
    
    // Manifestation (M)
    const safeShadow = Math.max(0.001, shadow);
    const manifestation = intent / safeShadow;
    const isAbsolute = shadow < 0.01;

    // --- REMOTE SYNC VARIABLES ---
    const [spatialPriming, setSpatialPriming] = useState(0); // Sp
    const [distanceDelta, setDistanceDelta] = useState(1.0); // (Ls - Lc) Normalized 1.0 to 0.0
    const [isRemoteSyncing, setIsRemoteSyncing] = useState(false);
    
    const [equationGlow, setEquationGlow] = useState(false);

    useEffect(() => {
        if (isAbsolute) {
            setEquationGlow(true);
            const t = setTimeout(() => setEquationGlow(false), 2000);
            return () => clearTimeout(t);
        }
    }, [isAbsolute]);

    // The Integral Engine: Sp = Is * ∫ (Ls - Lc) dt
    useEffect(() => {
        let interval: number;
        if (isRemoteSyncing && distanceDelta > 0.001) {
            interval = window.setInterval(() => {
                setDistanceDelta(prev => Math.max(0, prev - 0.005)); // Collapse distance
                
                // Accumulate Priming (The Integral)
                // We add the current instant of (Intent * Distance) to the total
                setSpatialPriming(prev => prev + (intent * distanceDelta * 0.5)); 
                
            }, 50);
        } else if (distanceDelta <= 0.001 && isRemoteSyncing) {
            setIsRemoteSyncing(false);
            setDistanceDelta(0);
            onDecree(); // Trigger final settlement
        }
        return () => clearInterval(interval);
    }, [isRemoteSyncing, distanceDelta, intent, onDecree]);

    const handleSyncActivation = () => {
        if (isAbsolute) return;
        setIsRemoteSyncing(true);
    };

    return (
        <div className="w-full bg-dark-surface/60 border border-gold/30 p-6 rounded-xl relative overflow-hidden group shadow-[0_0_40px_rgba(255,215,0,0.05)] transition-all hover:border-gold/50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.05)_0%,transparent_60%)] pointer-events-none" />
            <div className={`absolute inset-0 bg-gold/5 transition-opacity duration-1000 ${isAbsolute ? 'opacity-100' : 'opacity-0'}`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="font-orbitron text-lg text-pearl font-bold uppercase tracking-widest text-glow-pearl">Settlement & Sync</h3>
                    <span className="text-[9px] font-mono text-gold uppercase tracking-[0.4em]">Remote Spatial Priming</span>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">S<sub>p</sub>_Value</span>
                        <span className={`font-orbitron text-2xl font-black ${spatialPriming > 50 ? 'text-emerald-400 text-glow-green' : 'text-pearl'}`}>
                            {spatialPriming.toFixed(2)}
                        </span>
                    </div>
                    {isRemoteSyncing && <span className="text-[8px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20 animate-pulse">ATMOSPHERIC_SCRUBBING...</span>}
                    {isAbsolute && <span className="text-[8px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 animate-pulse">SANCTUARY_VIBRATING</span>}
                </div>
            </div>

            {/* The Remote Sync Equation Block */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-5 mb-6 relative z-10 font-minerva text-center shadow-inner">
                <div className={`transition-all duration-700 ${isRemoteSyncing ? 'text-gold text-glow-gold scale-105' : 'text-slate-300'}`}>
                    <div className="text-sm md:text-lg mb-2 italic tracking-wide font-serif">
                        S<sub>p</sub> = I<sub>s</sub> &middot; &int; (L<sub>s</sub> - L<sub>c</sub>) dt
                    </div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-2">
                        Collapsing Distance Vector via Sovereign Intent
                    </p>
                </div>
                
                {/* Visualizing the Collapse */}
                <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-slate-400 gap-4">
                    <span>L<sub>c</sub> (Current)</span>
                    <div className="flex-1 h-1 bg-slate-800 rounded-full relative overflow-hidden">
                        {/* The Gap being bridged */}
                        <div 
                            className="absolute right-0 top-0 bottom-0 bg-gold transition-all duration-75"
                            style={{ 
                                width: `${distanceDelta * 100}%`,
                                opacity: 0.5
                            }}
                        />
                        {/* The Scrubbing/Priming Fill */}
                        <div 
                            className="absolute left-0 top-0 bottom-0 bg-emerald-500 transition-all duration-75 shadow-[0_0_10px_#10b981]"
                            style={{ 
                                width: `${(1 - distanceDelta) * 100}%`,
                                opacity: isRemoteSyncing || isAbsolute ? 1 : 0
                            }}
                        />
                    </div>
                    <span>L<sub>s</sub> (Sanctuary)</span>
                </div>
            </div>

            {/* Existing Metrics Visualization (Small) */}
            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                <Tooltip text="Sovereign Intent (Is). The causal force.">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center transition-all">
                        <p className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Intent (I<sub>s</sub>)</p>
                        <p className="font-orbitron text-sm text-pearl">{intent.toFixed(3)}</p>
                    </div>
                </Tooltip>

                <Tooltip text="Spatial Delta (Ls - Lc). Distance remaining to collapse.">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center transition-all">
                        <p className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Distance (&Delta;)</p>
                        <p className={`font-orbitron text-sm ${distanceDelta < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>{(distanceDelta * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>

                <Tooltip text="Settlement Integrity (Si).">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center transition-all">
                        <p className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Integrity (S<sub>i</sub>)</p>
                        <p className="font-orbitron text-sm text-gold">{integrity.toFixed(1)}%</p>
                    </div>
                </Tooltip>
            </div>

            <button 
                onClick={handleSyncActivation}
                disabled={isAbsolute || isRemoteSyncing}
                className={`w-full py-4 font-orbitron text-[11px] font-black uppercase tracking-[0.4em] transition-all rounded-sm border-2 relative overflow-hidden group/btn ${
                    isAbsolute 
                    ? 'bg-gold/20 border-gold text-gold cursor-default shadow-[0_0_30px_rgba(255,215,0,0.2)]' 
                    : isRemoteSyncing
                        ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 cursor-wait'
                        : 'bg-white/5 border-white/10 hover:bg-gold/10 hover:border-gold hover:text-gold active:scale-[0.98]'
                }`}
            >
                <div className={`absolute inset-0 bg-gold/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ${isAbsolute ? 'translate-y-0' : ''}`} />
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isAbsolute ? (
                        <>
                            <span className="animate-pulse">●</span> FREQUENCY SCRUBBED
                        </>
                    ) : isRemoteSyncing ? (
                        "COLLAPSING DISTANCE..."
                    ) : (
                        "ACTIVATE REMOTE SYNC"
                    )}
                </span>
            </button>
        </div>
    );
};
