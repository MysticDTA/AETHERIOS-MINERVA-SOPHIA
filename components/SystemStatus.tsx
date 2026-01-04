
import React from 'react';
import { Tooltip } from './Tooltip';
import { GOVERNANCE_AXIOMS } from '../Registry';

interface SystemStatusProps {
    mode: string;
    lesions: number;
    isHeaderVersion?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = React.memo(({ mode, lesions, isHeaderVersion = false }) => {
    // Recommendation 3: Use robust lookup with high-parity fallback
    const axiomConfig = GOVERNANCE_AXIOMS[mode] || GOVERNANCE_AXIOMS['UNKNOWN_STATE'];

    const baseClass = "w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-aether backdrop-blur-sm";
    const textAlignment = isHeaderVersion ? 'md:text-right' : 'text-center';

    return (
        <div className={`${baseClass} ${textAlignment}`}>
            <p className="text-[9px] text-warm-grey uppercase tracking-[0.3em] mb-1" id="axiom-label">Governance Axiom</p>
            <Tooltip text={axiomConfig.description}>
                 <div className={`w-full p-0 m-0 bg-transparent border-none cursor-help ${textAlignment}`} aria-labelledby="axiom-label">
                    <p className={`font-orbitron font-bold transition-colors duration-500 ${isHeaderVersion ? 'text-sm' : 'text-md'} ${axiomConfig.colorClass}`}>
                        {axiomConfig.label}
                    </p>
                </div>
            </Tooltip>
            {lesions > 0 && (
                 <p className="text-[8px] text-rose-400 mt-1 font-bold uppercase tracking-widest">Causal Fragments: {lesions}</p>
            )}
            <style>{`
                .border-glow-aether { border-color: rgba(109, 40, 217, 0.2); }
                .animate-flicker { animation: flicker 0.15s infinite; }
                @keyframes flicker {
                    0% { opacity: 1; }
                    50% { opacity: 0.8; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
});
