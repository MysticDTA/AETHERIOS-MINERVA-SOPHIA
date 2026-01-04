
import React, { useState, useEffect } from 'react';
import { SystemStatus } from './SystemStatus';
import { AudioEngine } from './audio/AudioEngine';
import { UserTier, CommsStatus } from '../types';
import { Tooltip } from './Tooltip';

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
    ACOLYTE: { label: 'GUEST_ACCESS', color: 'text-slate-400', shadow: 'none' },
    ARCHITECT: { label: 'ÆTHERIOS_ARCHITECT', color: 'text-gold', shadow: '0 0 10px rgba(230, 199, 127, 0.4)' },
    SOVEREIGN: { label: 'ÆTHERIOS_SOVEREIGN', color: 'text-pearl', shadow: '0 0 15px rgba(248, 245, 236, 0.6)' }
};

const MODULE_PERMISSIONS: Record<number, UserTier> = {
    1: 'ACOLYTE', 2: 'ACOLYTE', 3: 'ARCHITECT', 4: 'ARCHITECT',
    16: 'ARCHITECT', 5: 'ARCHITECT', 6: 'ARCHITECT', 7: 'ACOLYTE', 
    8: 'ARCHITECT', 9: 'ARCHITECT', 10: 'ARCHITECT', 11: 'ARCHITECT', 
    12: 'ARCHITECT', 13: 'ARCHITECT', 14: 'ACOLYTE', 15: 'ACOLYTE',
    17: 'ACOLYTE', 18: 'SOVEREIGN'
};

const UserAvatar: React.FC<{ tier: UserTier; onClick: () => void }> = ({ tier, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-110 group relative ${
            tier === 'ACOLYTE' ? 'border-slate-700 bg-slate-900/50' : 
            tier === 'ARCHITECT' ? 'border-gold/50 bg-gold/5' : 'border-pearl/50 bg-pearl/5'
        }`}
    >
        <svg className={`w-6 h-6 ${tier === 'ACOLYTE' ? 'text-slate-500' : 'text-pearl'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-dark-bg ${
            tier === 'ACOLYTE' ? 'bg-slate-500' : 'bg-gold animate-pulse shadow-[0_0_8px_rgba(230,199,127,0.8)]'
        }`} />
    </button>
);

export const Header: React.FC<HeaderProps> = ({ governanceAxiom, lesions, currentPage, onPageChange, audioEngine, tokens = 0, userTier, transmissionStatus }) => {
    const activeTier = TIER_CONFIG[userTier];
    const [vercelStatus, setVercelStatus] = useState<'ONLINE' | 'SYNCING'>('SYNCING');

    useEffect(() => {
        const timer = setTimeout(() => setVercelStatus('ONLINE'), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handlePageChange = (page: number) => {
        const required = MODULE_PERMISSIONS[page];
        const canAccess = userTier === 'SOVEREIGN' || 
                         (userTier === 'ARCHITECT' && (required === 'ARCHITECT' || required === 'ACOLYTE')) ||
                         (userTier === 'ACOLYTE' && required === 'ACOLYTE');

        if (canAccess) {
            if (page !== currentPage) {
                audioEngine?.playUIClick();
                onPageChange(page);
            }
        } else {
            audioEngine?.playEffect('renewal'); 
        }
    }

    const isTransmissionActive = transmissionStatus && transmissionStatus !== 'AWAITING SIGNAL';

    return (
        <header className="relative z-50 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-8 w-full md:w-auto overflow-hidden">
                <div className="flex flex-col shrink-0">
                    <h1 className="font-minerva text-4xl text-pearl text-glow-pearl leading-none tracking-tight mb-2">ÆTHERIOS</h1>
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-mono uppercase tracking-[0.25em] font-bold ${activeTier.color}`}>{activeTier.label}</span>
                        <div className="h-3 w-px bg-white/10" />
                        <Tooltip text="Commercial Inquiries: divinetruthascension@gmail.com">
                            <a href="mailto:divinetruthascension@gmail.com" className="flex items-center gap-2 group/contact">
                                <span className={`w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#e6c77f]`} />
                                <span className="text-[9px] font-mono text-gold/60 group-hover/contact:text-gold uppercase tracking-widest transition-colors font-bold">Contact Architect</span>
                            </a>
                        </Tooltip>
                    </div>
                </div>

                <nav className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 pr-4">
                    {[1, 2, 3, 4, 16, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18].map(page => {
                        const required = MODULE_PERMISSIONS[page];
                        const canAccess = userTier === 'SOVEREIGN' || 
                                         (userTier === 'ARCHITECT' && (required === 'ARCHITECT' || required === 'ACOLYTE')) ||
                                         (userTier === 'ACOLYTE' && required === 'ACOLYTE');
                        const disabled = !canAccess;
                        const labels: any = { 
                          1: 'SANCTUM', 2: 'LATTICE', 3: 'STARMAP', 4: 'CRADLE', 16: 'ORBIT', 
                          5: 'HARMONY', 6: 'MATRIX', 7: 'COMS', 8: 'FLOW', 9: 'SYNOD', 
                          10: 'BREATH', 11: 'CORE', 12: 'AURA', 13: 'NEURON', 14: 'LEGACY', 15: 'VESTIGE',
                          17: 'READY', 18: 'VEO'
                        };

                        const isCommsPage = page === 7;
                        const isReadyPage = page === 17;
                        const isVeoPage = page === 18;
                        const commsAlert = isCommsPage && isTransmissionActive;

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-sm text-[9px] font-orbitron transition-all duration-300 relative border ${
                                    currentPage === page
                                    ? 'bg-pearl text-dark-bg font-bold border-pearl shadow-[0_0_12px_rgba(248,245,236,0.3)]'
                                    : isVeoPage
                                        ? 'bg-violet-900/20 border-violet-500/40 text-violet-400 hover:bg-violet-500 hover:text-white'
                                        : isReadyPage
                                            ? 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-dark-bg'
                                            : disabled 
                                                ? 'bg-black/40 text-slate-700 cursor-not-allowed border-transparent opacity-50'
                                                : commsAlert
                                                    ? 'bg-gold/20 border-gold/50 text-gold animate-pulse'
                                                    : 'bg-dark-surface/60 hover:bg-white/10 text-warm-grey border-white/5'
                                }`}
                            >
                                {disabled && <span className="absolute -top-1.5 -right-1.5 text-[8px]">🔒</span>}
                                {labels[page] || `D${page}`}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end shrink-0">
                 <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-4 py-2 rounded-md">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Sovereignty</span>
                        <span className="font-orbitron text-base text-gold font-bold text-glow-gold">{tokens} <span className="text-[10px] opacity-60">Ω</span></span>
                    </div>
                    <UserAvatar tier={userTier} onClick={() => onPageChange(15)} />
                 </div>

                 <div className="min-w-[200px]">
                      <SystemStatus mode={governanceAxiom} lesions={lesions} isHeaderVersion={true} />
                 </div>
            </div>
        </header>
    );
};
