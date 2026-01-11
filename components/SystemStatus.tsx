
import React from 'react';
import { Tooltip } from './Tooltip';
import { GOVERNANCE_AXIOMS } from '../Registry';

interface SystemStatusProps {
    mode: string;
    lesions: number;
    isHeaderVersion?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = React.memo(({ mode, lesions, isHeaderVersion = false }) => {
    const axiomConfig = GOVERNANCE_AXIOMS[mode] || GOVERNANCE_AXIOMS['UNKNOWN_STATE'];

    const baseClass = "w-full bg-dark-surface/40 border border-white/5 p-4 rounded-xl border-glow-aether backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all shadow-lg";
    const textAlignment = isHeaderVersion ? 'text-right items-end' : 'text-center items-center';

    return (
        <div className={`${baseClass} flex flex-col ${textAlignment}`}>
            {/* Animated Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-0" />
            
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-1.5 flex items-center gap-2 relative z-10">
                {!isHeaderVersion && <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_5px_#8b5cf6]" />}
                Governance Axiom
            </p>
            
            <Tooltip text={axiomConfig.description}>
                 <div className={`w-full cursor-help relative z-10 flex flex-col ${textAlignment}`}>
                    <p className={`font-orbitron font-black uppercase tracking-wider text-sm transition-colors duration-500 ${axiomConfig.colorClass}`} style={{ textShadow: `0 0 15px currentColor` }}>
                        {axiomConfig.label}
                    </p>
                </div>
            </Tooltip>
            
            {lesions > 0 && (
                 <Tooltip text="Causal Fragments (Lesions) indicate fractures in the logic core logic. High lesion counts may cause hallucinations or decoherence. Requires repair.">
                    <div className="mt-2 flex items-center gap-2 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse cursor-help relative z-10">
                        <span className="text-rose-500 text-[10px]">⚠</span>
                        <p className="text-[8px] text-rose-300 font-mono font-bold uppercase tracking-widest">
                            Fractures: {lesions}
                        </p>
                    </div>
                 </Tooltip>
            )}
            
            <style>{`
                .border-glow-aether { border-color: rgba(255, 255, 255, 0.08); }
            `}</style>
        </div>
    );
});
