
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
    const isHighTier = tier === 'ARCHITECT' || tier === 'SOVEREIGN';

    return (
        <button 
            onClick={onClick}
            className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all duration-700 hover:scale-110 group relative ${
                tier === 'ACOLYTE' ? 'border-slate-800 bg-slate-900/50' : 
                tier === 'ARCHITECT' ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.15)]' : 
                tier === 'SOVEREIGN' ? 'border-pearl bg-pearl/5 shadow-[0_0_30px_rgba(248,245,236,0.2)]' :
                'border-rose-400 bg-rose-400/5 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
            }`}
        >
            <svg className={`w-7 h-7 ${tier === 'ACOLYTE' ? 'text-slate-600' : 'text-pearl'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg ${
                !isHighTier ? 'bg-slate-700' : 'bg-gold animate-pulse shadow-[0_0_12px_rgba(255,215,0,0.9)]'
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
        <header className="relative z-50 flex flex-col md:flex-row items-center justify-between gap-10 pb-8 border-b border-gold/20 pt-2 transition-all duration-500">
            <div className="flex items-center gap-12 w-full md:w-auto overflow-hidden">
                <div className="flex flex-col shrink-0">
                    <h1 className="font-minerva text-5xl text-pearl text-glow-pearl leading-none tracking-tighter mb-4 uppercase italic">ÆTHERIOS</h1>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] font-black ${activeTier.color} transition-all duration-1000 drop-shadow-lg`} style={{ textShadow: activeTier.shadow }}>{activeTier.label}</span>
                        <div className="h-4 w-px bg-gold/20" />
                        <div className="flex items-center gap-3">
                             <span className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#ffd700]" />
                             <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">LATTICE_SYNC: LOCKED</span>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar py-3 pr-8 mask-fade-right">
                    {SYSTEM_NODES.map(node => {
                        const hasAccess = checkNodeAccess(userTier, node.requiredTier);
                        const disabled = !hasAccess;
                        const isSpecialNode = node.isAudit || node.isShield || node.isLogs || node.isBridge;
                        const commsAlert = (node.id === 7) && isTransmissionActive;

                        return (
                            <button
                                key={node.id}
                                onClick={() => handlePageChange(node.id, node.requiredTier)}
                                className={`flex-shrink-0 px-5 py-3 rounded-sm text-[10px] font-orbitron transition-all duration-500 relative border-2 ${
                                    currentPage === node.id
                                    ? 'bg-gold text-dark-bg font-black border-gold shadow-[0_0_25px_rgba(255,215,0,0.6)] scale-105 z-10'
                                    : isSpecialNode
                                        ? 'bg-gold/5 border-gold/40 text-gold hover:bg-gold hover:text-dark-bg font-bold'
                                        : disabled 
                                            ? 'bg-black/40 text-slate-800 cursor-not-allowed border-transparent opacity-30 grayscale'
                                            : commsAlert
                                                ? 'bg-gold/20 border-gold/60 text-gold animate-pulse shadow-[0_0_15px_#ffd700]'
                                                : 'bg-dark-surface/80 hover:bg-gold/10 text-warm-grey border-white/5 hover:border-gold/30 hover:text-gold hover:scale-105'
                                }`}
                            >
                                {disabled && <span className="absolute -top-2.5 -right-2.5 text-[10px] filter grayscale group-hover:grayscale-0 transition-all drop-shadow-xl">🔒</span>}
                                {commsAlert && <span className="absolute -top-2 -right-2 w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_gold] animate-ping" />}
                                {node.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end shrink-0">
                 <div className="flex items-center gap-6 bg-black/60 border border-gold/30 px-8 py-3 rounded-xl shadow-2xl group hover:border-gold transition-all duration-700 backdrop-blur-3xl">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gold/60 font-black uppercase tracking-[0.4em] mb-1.5 group-hover:text-gold transition-colors">Sovereignty_Index</span>
                        <span className="font-orbitron text-2xl text-gold font-black text-glow-gold leading-none">{tokens.toLocaleString()} <span className="text-[12px] opacity-40 ml-1">Ω</span></span>
                    </div>
                    <UserAvatar tier={userTier} onClick={() => onPageChange(15)} />
                 </div>

                 <div className="min-w-[260px] transform hover:scale-[1.02] transition-transform">
                      <SystemStatus mode={governanceAxiom} lesions={lesions} isHeaderVersion={true} />
                 </div>
            </div>
            
            <style>{`
                .mask-fade-right {
                    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
                    mask-image: linear-gradient(to right, black 85%, transparent 100%);
                }
            `}</style>
        </header>
    );
};
