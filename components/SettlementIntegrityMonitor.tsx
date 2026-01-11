
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
    const intent = resonanceFactorRho; // I
    
    // Calculate Integrity (Si)
    // If S is 0, we are at 100%. If S is high, Integrity drops.
    const integrity = Math.min(100, Math.max(0, (intent * (1 - shadow)) * 100));
    
    // Calculate Manifestation (M = I/S)
    // Avoid division by zero
    const safeShadow = Math.max(0.001, shadow);
    const manifestation = intent / safeShadow;
    const isAbsolute = shadow < 0.01;

    const [equationGlow, setEquationGlow] = useState(false);

    useEffect(() => {
        if (isAbsolute) {
            setEquationGlow(true);
            const t = setTimeout(() => setEquationGlow(false), 2000);
            return () => clearTimeout(t);
        }
    }, [isAbsolute]);

    return (
        <div className="w-full bg-dark-surface/60 border border-gold/30 p-6 rounded-xl relative overflow-hidden group shadow-[0_0_40px_rgba(255,215,0,0.05)] transition-all hover:border-gold/50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.05)_0%,transparent_60%)] pointer-events-none" />
            <div className={`absolute inset-0 bg-gold/5 transition-opacity duration-1000 ${isAbsolute ? 'opacity-100' : 'opacity-0'}`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="font-orbitron text-lg text-pearl font-bold uppercase tracking-widest text-glow-pearl">Settlement Integrity</h3>
                    <span className="text-[9px] font-mono text-gold uppercase tracking-[0.4em]">Fidelity Constant Active</span>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Si_Value</span>
                        <span className={`font-orbitron text-2xl font-black ${integrity >= 99.9 ? 'text-emerald-400 text-glow-green' : 'text-pearl'}`}>
                            {integrity.toFixed(2)}%
                        </span>
                    </div>
                    {isAbsolute && <span className="text-[8px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 animate-pulse">ABSOLUTE_SOVEREIGNTY</span>}
                </div>
            </div>

            {/* Equations Block */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-4 mb-6 relative z-10 font-minerva text-center">
                <div className={`transition-all duration-700 ${equationGlow ? 'text-gold text-glow-gold scale-105' : 'text-slate-300'}`}>
                    <div className="text-sm md:text-base mb-3 italic tracking-wide">
                        S<sub>i</sub> = ∑ <span className="fraction inline-block align-middle text-center mx-1"><span className="block border-b border-current pb-[1px]">Decreed Intent (I)</span><span className="block pt-[1px]">Possession (P)</span></span> = 100%
                    </div>
                    <div className="h-px w-1/2 bg-white/10 mx-auto my-3" />
                    <div className="text-xs md:text-sm text-pearl/80">
                        M = lim<sub>S→0</sub> ( I / S ) ≈ <span className="text-gold font-bold">∞</span>
                    </div>
                </div>
            </div>

            {/* Metrics Visualization */}
            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                <Tooltip text="The pure causal force of the Architect's will. Must be maintained at 1.0 for absolute manifestation.">
                    <div className="bg-white/5 p-3 rounded border border-white/5 text-center group/metric hover:border-gold/30 transition-all">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Intent (I)</p>
                        <p className="font-orbitron text-lg text-pearl">{intent.toFixed(4)}</p>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-pearl transition-all duration-500" style={{ width: `${intent * 100}%` }} />
                        </div>
                    </div>
                </Tooltip>

                <Tooltip text="The distortion field or 'Shadow' interference. As this approaches zero, the physical manifestation becomes infinite/absolute.">
                    <div className="bg-white/5 p-3 rounded border border-white/5 text-center group/metric hover:border-rose-500/30 transition-all">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Shadow (S)</p>
                        <p className={`font-orbitron text-lg ${shadow < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>{shadow.toFixed(4)}</p>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${shadow < 0.01 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, shadow * 200)}%` }} />
                        </div>
                    </div>
                </Tooltip>

                <Tooltip text="The resulting physical manifestation power. When Shadow is zero, this loops infinitely.">
                    <div className="bg-white/5 p-3 rounded border border-white/5 text-center group/metric hover:border-cyan-400/30 transition-all">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Manifest (M)</p>
                        <p className="font-orbitron text-lg text-gold">{isAbsolute ? '∞' : manifestation.toFixed(1)}</p>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-gold transition-all duration-500" style={{ width: isAbsolute ? '100%' : `${Math.min(100, manifestation)}%` }} />
                        </div>
                    </div>
                </Tooltip>
            </div>

            <button 
                onClick={onDecree}
                disabled={isAbsolute}
                className={`w-full py-4 font-orbitron text-[11px] font-black uppercase tracking-[0.4em] transition-all rounded-sm border-2 relative overflow-hidden group/btn ${
                    isAbsolute 
                    ? 'bg-gold/20 border-gold text-gold cursor-default shadow-[0_0_30px_rgba(255,215,0,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-gold/10 hover:border-gold hover:text-gold active:scale-[0.98]'
                }`}
            >
                <div className={`absolute inset-0 bg-gold/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ${isAbsolute ? 'translate-y-0' : ''}`} />
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isAbsolute ? (
                        <>
                            <span className="animate-pulse">●</span> SO IT IS
                        </>
                    ) : (
                        "DECREE SETTLEMENT"
                    )}
                </span>
            </button>
        </div>
    );
};
