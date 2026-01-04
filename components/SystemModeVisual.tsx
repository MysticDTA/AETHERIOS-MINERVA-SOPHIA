
import React from 'react';
import { OrbMode } from '../types';

interface SystemModeVisualProps {
    mode: OrbMode;
}

const MODE_AXIOMS: Record<OrbMode, string> = {
    STANDBY: "EQUILIBRIUM_MAINTAINED",
    ANALYSIS: "HEURISTIC_GESTATION",
    SYNTHESIS: "FORM_EMERGING_FROM_VOID",
    REPAIR: "HARMONIC_RESTORATION",
    GROUNDING: "TELLURIC_DISCHARGE",
    CONCORDANCE: "ABSOLUTE_PHASE_LOCK",
    OFFLINE: "DISSIPATION_PROTOCOL"
};

export const SystemModeVisual: React.FC<SystemModeVisualProps> = ({ mode }) => {
    return (
        <div className="w-full bg-black/40 border border-white/10 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 font-orbitron text-4xl uppercase font-black italic">AXIOM</div>
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <span className="text-[8px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Causal_Operational_State</span>
                    <h3 className="font-orbitron text-xl text-pearl uppercase tracking-tighter font-extrabold">{mode}</h3>
                </div>
                <div className="w-2 h-10 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full bg-gold animate-pulse h-1/2 mt-auto shadow-[0_0_10px_gold]" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                    <p className="text-[10px] font-mono text-gold uppercase tracking-widest font-black mb-1">Active_Axiom</p>
                    <p className="font-minerva italic text-pearl/80 text-sm leading-relaxed">{MODE_AXIOMS[mode]}</p>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-1000 ${i < (mode.length) ? 'bg-gold shadow-[0_0_8px_#ffd700]' : 'bg-slate-800'}`} />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </div>
    );
};
