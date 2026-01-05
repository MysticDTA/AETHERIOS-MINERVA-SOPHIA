
import React from 'react';
import { SystemStatus } from './SystemStatus';
import { AudioEngine } from './audio/AudioEngine';
import { UserTier, CommsStatus } from '../types';
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
    return (
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
};

export const Header: React.FC<HeaderProps> = ({ governanceAxiom, lesions, currentPage, onPageChange, audioEngine, tokens = 0, userTier, transmissionStatus }) => {
    const activeTier = TIER_REGISTRY[userTier] || TIER_REGISTRY['ACOLYTE'];

    const handlePageChange = (pageId: number, requiredTier: UserTier) => {
        if (checkNodeAccess(userTier, requiredTier)) {
            if (pageId !== currentPage) {
                audioEngine?.playUIClick();
                onPageChange(pageId);
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
                    <h1 className="font-minerva text-4xl text-pearl text-glow-pearl leading-none tracking-tight mb-2 uppercase italic">ÆTHERIOS</h1>
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-mono uppercase tracking-[0.25em] font-bold ${activeTier.color}`} style={{ textShadow: activeTier.shadow }}>{activeTier.label}</span>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                             <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-black">MINERVA_LINK: ACTIVE</span>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 pr-4">
                    {SYSTEM_NODES.filter(n => !n.isLogs && !n.isShield && !n.isBridge && !n.isAudit).map(node => {
                        const hasAccess = checkNodeAccess(userTier, node.requiredTier);
                        const disabled = !hasAccess;
                        const isCommsPage = node.id === 7;
                        const commsAlert = isCommsPage && isTransmissionActive;

                        return (
                            <button
                                key={node.id}
                                onClick={() => handlePageChange(node.id, node.requiredTier)}
                                title={node.description}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-sm text-[9px] font-orbitron transition-all duration-300 relative border ${
                                    currentPage === node.id
                                    ? 'bg-pearl text-dark-bg font-bold border-pearl shadow-[0_0_12px_rgba(248,245,236,0.3)] scale-105'
                                    : disabled 
                                        ? 'bg-black/40 text-slate-700 cursor-not-allowed border-transparent opacity-50'
                                        : commsAlert
                                            ? 'bg-gold/20 border-gold/50 text-gold animate-pulse shadow-[0_0_8px_gold]'
                                            : 'bg-dark-surface/60 hover:bg-white/10 text-warm-grey border-white/5'
                                }`}
                            >
                                {disabled && <span className="absolute -top-1.5 -right-1.5 text-[8px] filter grayscale">🔒</span>}
                                {commsAlert && <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_5px_gold]" />}
                                {node.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end shrink-0">
                 <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-4 py-2 rounded-md transition-all hover:border-gold/20 group">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 group-hover:text-gold transition-colors">Sovereignty</span>
                        <span className="font-orbitron text-base text-gold font-bold text-glow-gold leading-none">{tokens.toLocaleString()} <span className="text-[10px] opacity-40 ml-1">Ω</span></span>
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
