
import React from 'react';
import { UserTier, CommsStatus } from '../types';
import { SystemStatus } from './SystemStatus';
import { AudioEngine } from './audio/AudioEngine';
import { SYSTEM_NODES, TIER_REGISTRY, checkNodeAccess } from '../Registry';

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

const UserAvatar: React.FC<{ tier: UserTier; onClick: () => void }> = ({ tier, onClick }) => {
    const config = TIER_REGISTRY[tier] || TIER_REGISTRY['ACOLYTE'];
    const isHighTier = tier === 'ARCHITECT' || tier === 'SOVEREIGN' || tier === 'LEGACY_MENERVA';

    return (
        <button 
            onClick={onClick}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-110 group relative ${
                tier === 'ACOLYTE' ? 'border-slate-700 bg-slate-900/50' : 
                tier === 'ARCHITECT' ? 'border-gold/50 bg-gold/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 
                tier === 'SOVEREIGN' ? 'border-pearl/50 bg-pearl/5 shadow-[0_0_20px_rgba(248,245,236,0.2)]' :
                'border-rose-400/50 bg-rose-400/5 shadow-[0_0_12px_rgba(244,63,94,0.1)]'
            }`}
        >
            <svg className={`w-5 h-5 md:w-6 md:h-6 ${tier === 'ACOLYTE' ? 'text-slate-500' : tier === 'LEGACY_MENERVA' ? 'text-rose-400' : 'text-pearl'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-bg ${
                !isHighTier ? 'bg-slate-700' : 
                tier === 'LEGACY_MENERVA' ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 
                'bg-gold animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.8)]'
            }`} />
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ governanceAxiom, lesions, currentPage, onPageChange, audioEngine, tokens = 0, userTier, transmissionStatus }) => {
    const activeTier = TIER_REGISTRY[userTier] || TIER_REGISTRY['ACOLYTE'];

    const handlePageChange = (pageId: number, requiredTier: UserTier) => {
        if (checkNodeAccess(userTier, requiredTier)) {
            if (pageId !== currentPage) {
                audioEngine?.playHighResonanceChime();
                onPageChange(pageId);
            }
        } else {
            audioEngine?.playEffect('renewal'); 
        }
    }

    const isTransmissionActive = transmissionStatus && transmissionStatus !== 'AWAITING SIGNAL';

    return (
        <header className="relative z-50 flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-6 w-full lg:w-auto overflow-hidden">
                <div className="flex flex-col shrink-0">
                    <h1 className="font-minerva text-3xl md:text-4xl text-pearl text-glow-pearl leading-none tracking-tight mb-1 uppercase italic">ÆTHERIOS</h1>
                    <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-mono uppercase tracking-[0.3em] font-black ${activeTier.color}`} style={{ textShadow: activeTier.shadow }}>{activeTier.label}</span>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                             <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-black">MINERVA_SOPHIA: LOCKED</span>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2 pr-6 mask-fade-right">
                    {SYSTEM_NODES.filter(n => !n.isLogs && !n.isShield && !n.isBridge).map(node => {
                        const hasAccess = checkNodeAccess(userTier, node.requiredTier);
                        const disabled = !hasAccess;
                        const isSpecial = node.isAudit;
                        const commsAlert = (node.id === 7) && isTransmissionActive;

                        return (
                            <button
                                key={node.id}
                                onClick={() => handlePageChange(node.id, node.requiredTier)}
                                className={`flex-shrink-0 px-4 py-2 rounded-sm text-[9px] font-orbitron transition-all duration-300 relative border-2 ${
                                    currentPage === node.id
                                    ? 'bg-pearl text-dark-bg font-black border-pearl shadow-[0_0_15px_rgba(248,245,236,0.4)] scale-105'
                                    : isSpecial
                                        ? 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-dark-bg font-black'
                                        : disabled 
                                            ? 'bg-black/40 text-slate-800 cursor-not-allowed border-transparent opacity-40'
                                            : commsAlert
                                                ? 'bg-gold/20 border-gold/60 text-gold animate-pulse shadow-[0_0_10px_gold]'
                                                : 'bg-dark-surface/80 hover:bg-white/5 text-warm-grey border-white/5 hover:border-white/20'
                                }`}
                            >
                                {disabled && <span className="absolute -top-1.5 -right-1.5 text-[8px] filter grayscale opacity-40">🔒</span>}
                                {commsAlert && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full shadow-[0_0_8px_gold] animate-ping" />}
                                {node.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            <div className="flex items-center gap-6 md:gap-10 w-full lg:w-auto justify-between lg:justify-end shrink-0">
                 <div className="flex items-center gap-4 bg-black/60 border border-gold/20 px-6 py-2.5 rounded-lg transition-all hover:border-gold/60 group shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gold/60 font-black uppercase tracking-[0.4em] mb-0.5 group-hover:text-gold transition-colors">Sovereignty</span>
                        <span className="font-orbitron text-xl md:text-2xl text-gold font-black text-glow-gold leading-none">{tokens.toLocaleString()} <span className="text-[10px] opacity-40 ml-1">Ω</span></span>
                    </div>
                    <UserAvatar tier={userTier} onClick={() => onPageChange(15)} />
                 </div>

                 <div className="min-w-[200px] md:min-w-[280px]">
                      <SystemStatus mode={governanceAxiom} lesions={lesions} isHeaderVersion={true} />
                 </div>
            </div>

            <style>{`
                .mask-fade-right {
                    -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
                    mask-image: linear-gradient(to right, black 90%, transparent 100%);
                }
            `}</style>
        </header>
    );
};
