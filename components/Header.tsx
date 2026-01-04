
import React from 'react';
import { SystemStatus } from './SystemStatus';
import { AudioEngine } from './audio/AudioEngine';
import { UserTier, CommsStatus } from '../types';

interface HeaderProps {
    governanceAxiom: string;
    lesions: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    audioEngine: AudioEngine | null;
    tokens?: number;
    userTier: UserTier;
    transmissionStatus?: CommsStatus;
}

const TIER_CONFIG: Record<UserTier, { label: string; color: string; shadow: string }> = {
    ACOLYTE: { label: 'OBSERVER_NODE', color: 'text-slate-500', shadow: 'none' },
    ARCHITECT: { label: 'GOLD_ARCHITECT', color: 'text-gold', shadow: '0 0 15px rgba(255, 215, 0, 0.4)' },
    SOVEREIGN: { label: 'SOVEREIGN_CHAIRMAN', color: 'text-pearl', shadow: '0 0 25px rgba(248, 245, 236, 0.6)' },
    LEGACY_MENERVA: { label: 'LEGACY_DIRECTOR', color: 'text-rose-400', shadow: '0 0 15px rgba(244, 63, 94, 0.4)' }
};

const MODULE_PERMISSIONS: Record<number, UserTier> = {
    1: 'ACOLYTE', 2: 'ACOLYTE', 3: 'ARCHITECT', 4: 'ARCHITECT',
    5: 'ARCHITECT', 6: 'ARCHITECT', 7: 'ACOLYTE', 8: 'ARCHITECT',
    9: 'ARCHITECT', 10: 'ARCHITECT', 11: 'ARCHITECT', 12: 'ARCHITECT',
    13: 'ARCHITECT', 14: 'ACOLYTE', 15: 'ACOLYTE', 16: 'ARCHITECT',
    17: 'ACOLYTE', 18: 'SOVEREIGN', 19: 'ARCHITECT', 21: 'ARCHITECT', 22: 'ACOLYTE', 23: 'ARCHITECT'
};

const UserAvatar: React.FC<{ tier: UserTier; onClick: () => void }> = ({ tier, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center transition-all duration-700 hover:scale-110 group relative ${
            tier === 'ACOLYTE' ? 'border-slate-800 bg-slate-900/50' : 
            tier === 'ARCHITECT' ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.15)]' : 'border-pearl bg-pearl/5 shadow-[0_0_30px_rgba(248,245,236,0.2)]'
        }`}
    >
        <svg className={`w-7 h-7 ${tier === 'ACOLYTE' ? 'text-slate-600' : 'text-pearl'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg ${
            tier === 'ACOLYTE' ? 'bg-slate-700' : 'bg-gold animate-pulse shadow-[0_0_12px_rgba(255,215,0,0.9)]'
        }`} />
    </button>
);

export const Header: React.FC<HeaderProps> = ({ governanceAxiom, lesions, currentPage, onPageChange, audioEngine, tokens = 0, userTier, transmissionStatus }) => {
    const activeTier = TIER_CONFIG[userTier];

    const handlePageChange = (page: number) => {
        const required = MODULE_PERMISSIONS[page];
        const canAccess = userTier === 'SOVEREIGN' || 
                         (userTier === 'ARCHITECT' && (required === 'ARCHITECT' || required === 'ACOLYTE')) ||
                         (userTier === 'ACOLYTE' && required === 'ACOLYTE');

        if (canAccess) {
            if (page !== currentPage) {
                audioEngine?.playHighResonanceChime();
                onPageChange(page);
            }
        } else {
            audioEngine?.playEffect('renewal'); 
        }
    }

    const isTransmissionActive = transmissionStatus && transmissionStatus !== 'AWAITING SIGNAL';

    return (
        <header className="relative z-50 flex flex-col md:flex-row items-center justify-between gap-10 pb-10 border-b border-gold/20 pt-4">
            <div className="flex items-center gap-12 w-full md:w-auto overflow-hidden">
                <div className="flex flex-col shrink-0">
                    <h1 className="font-minerva text-5xl text-pearl text-glow-pearl leading-none tracking-tighter mb-3 uppercase italic">ÆTHERIOS</h1>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] font-black ${activeTier.color} transition-all duration-1000`} style={{ textShadow: activeTier.shadow }}>{activeTier.label}</span>
                        <div className="h-4 w-px bg-gold/20" />
                        <div className="flex items-center gap-3">
                             <span className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#ffd700]" />
                             <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">LATTICE_SYNC: LOCKED</span>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2 pr-6">
                    {[1, 2, 3, 4, 16, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 21, 22, 23].map(page => {
                        const required = MODULE_PERMISSIONS[page];
                        const canAccess = userTier === 'SOVEREIGN' || 
                                         (userTier === 'ARCHITECT' && (required === 'ARCHITECT' || required === 'ACOLYTE')) ||
                                         (userTier === 'ACOLYTE' && required === 'ACOLYTE');
                        const disabled = !canAccess;
                        const labels: any = { 
                            1: 'SANCTUM', 2: 'LATTICE', 3: 'STARMAP', 4: 'CRADLE', 16: 'ORBIT', 
                            5: 'HARMONY', 6: 'MATRIX', 7: 'COMS', 8: 'FLOW', 9: 'SYNOD',
                            10: 'BREATH', 11: 'CORE', 12: 'AURA', 13: 'NEURON', 14: 'SUMMARY', 15: 'VAULT',
                            17: 'READY', 18: 'VEO', 19: 'AUDIT', 21: 'BRIDGE', 22: 'LOGS', 23: 'SHIELD'
                        };

                        const isAuditPage = page === 19;
                        const isLogsPage = page === 22;
                        const isShieldPage = page === 23;
                        const commsAlert = (page === 7) && isTransmissionActive;

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`flex-shrink-0 px-4 py-2.5 rounded-sm text-[10px] font-orbitron transition-all duration-500 relative border-2 ${
                                    currentPage === page
                                    ? 'bg-gold text-dark-bg font-black border-gold shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105'
                                    : isAuditPage || isShieldPage
                                        ? 'bg-gold/5 border-gold/30 text-gold hover:bg-gold hover:text-dark-bg font-bold'
                                        : isLogsPage
                                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white'
                                            : disabled 
                                                ? 'bg-black/40 text-slate-800 cursor-not-allowed border-transparent opacity-40'
                                                : commsAlert
                                                    ? 'bg-gold/20 border-gold/60 text-gold animate-pulse shadow-[0_0_15px_#ffd700]'
                                                    : 'bg-dark-surface/80 hover:bg-gold/10 text-warm-grey border-white/5 hover:border-gold/30 hover:text-gold'
                                }`}
                            >
                                {disabled && <span className="absolute -top-2 -right-2 text-[9px] filter grayscale group-hover:grayscale-0 transition-all">🔒</span>}
                                {commsAlert && <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-gold rounded-full shadow-[0_0_8px_gold] animate-ping" />}
                                {labels[page] || `NODE_${page}`}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end shrink-0">
                 <div className="flex items-center gap-6 bg-black/60 border-2 border-gold/30 px-6 py-3 rounded-sm shadow-2xl group hover:border-gold transition-all duration-700">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gold/60 font-black uppercase tracking-[0.4em] mb-1 group-hover:text-gold transition-colors">Sovereignty_Index</span>
                        <span className="font-orbitron text-2xl text-gold font-black text-glow-gold">{tokens.toLocaleString()} <span className="text-[12px] opacity-40 ml-1">Ω</span></span>
                    </div>
                    <UserAvatar tier={userTier} onClick={() => onPageChange(15)} />
                 </div>

                 <div className="min-w-[240px]">
                      <SystemStatus mode={governanceAxiom} lesions={lesions} isHeaderVersion={true} />
                 </div>
            </div>
        </header>
    );
};
