
import React from 'react';
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

const DOMAINS = [
    { label: 'SANCTUM', pages: [1, 2, 11, 14], desc: 'Core Reality & Legacy Management' },
    { label: 'LOGIC', pages: [4, 13, 19, 9], desc: 'AI Synthesis & Collective Audit' },
    { label: 'FLUX', pages: [3, 7, 16, 10, 12], desc: 'Real-time Telemetry & Bio-Sync' },
    { label: 'INFRA', pages: [17, 18, 15, 22, 21, 5, 6, 8], desc: 'Deployment & System Evolution' }
];

const TIER_CONFIG: Record<UserTier, { label: string; color: string; shadow: string }> = {
    ACOLYTE: { label: 'GUEST_NODE', color: 'text-slate-500', shadow: 'none' },
    ARCHITECT: { label: 'ARCHITECT', color: 'text-gold', shadow: '0 0 10px rgba(230, 199, 127, 0.4)' },
    SOVEREIGN: { label: 'SOVEREIGN', color: 'text-pearl', shadow: '0 0 15px rgba(248, 245, 236, 0.6)' },
    LEGACY_MENERVA: { label: 'LEGACY', color: 'text-rose-400', shadow: '0 0 10px rgba(244, 63, 94, 0.4)' }
};

const PAGE_LABELS: Record<number, string> = {
    1: 'Sanctum', 2: 'Lattice', 3: 'StarMap', 4: 'Cradle', 16: 'Orbit', 
    5: 'Harmony', 6: 'Matrix', 7: 'Comms', 8: 'Flow', 9: 'Synod', 
    10: 'Breath', 11: 'Core', 12: 'Aura', 13: 'Neuron', 14: 'Legacy', 15: 'Vestige',
    17: 'Ready', 18: 'VEO', 19: 'Audit', 21: 'Bridge', 22: 'Logs'
};

export const Header: React.FC<HeaderProps> = ({ governanceAxiom, lesions, currentPage, onPageChange, audioEngine, tokens = 0, userTier, transmissionStatus }) => {
    const activeTier = TIER_CONFIG[userTier];

    return (
        <header className="relative z-50 flex flex-col xl:flex-row items-center justify-between gap-8 pb-8 border-b border-white/[0.05] pt-2">
            <div className="flex flex-col md:flex-row items-center gap-12 w-full xl:w-auto">
                {/* Brand Identity: Minimalist */}
                <div className="flex flex-col shrink-0 items-center md:items-start group cursor-pointer" onClick={() => onPageChange(1)}>
                    <h1 className="font-minerva text-5xl text-pearl group-hover:text-gold transition-colors duration-1000 leading-none tracking-tighter mb-1 italic">Æ</h1>
                    <div className="flex items-center gap-3">
                        <span className={`text-[7px] font-mono uppercase tracking-[0.4em] font-extrabold ${activeTier.color}`}>{activeTier.label}</span>
                        <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    </div>
                </div>

                {/* Domain-Based Grouped Navigation */}
                <nav className="flex flex-wrap justify-center md:justify-start items-start gap-12">
                    {DOMAINS.map(domain => (
                        <div key={domain.label} className="flex flex-col gap-3 group">
                            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.6em] font-black group-hover:text-gold transition-colors duration-700">{domain.label}</span>
                            <div className="flex gap-1.5">
                                {domain.pages.map(page => {
                                    const isActive = currentPage === page;
                                    const label = PAGE_LABELS[page] || `NODE_${page}`;
                                    
                                    return (
                                        <Tooltip key={page} text={label}>
                                            <button
                                                onClick={() => { audioEngine?.playUIClick(); onPageChange(page); }}
                                                className={`w-3 h-3 rounded-[1px] transition-all duration-700 border ${
                                                    isActive 
                                                        ? 'bg-pearl border-pearl shadow-[0_0_15px_white] scale-125' 
                                                        : 'border-white/10 bg-white/5 hover:border-white/40 hover:bg-white/10'
                                                }`}
                                            />
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {/* Active Context Readout */}
                    <div className="flex flex-col gap-1 pl-6 border-l border-white/10">
                         <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Active_Node</span>
                         <span className="text-[12px] font-orbitron text-pearl uppercase font-bold tracking-[0.3em] animate-fade-in" key={currentPage}>
                            {PAGE_LABELS[currentPage] || 'Unknown'}
                         </span>
                    </div>
                </nav>
            </div>
            
            <div className="flex items-center gap-10 w-full xl:w-auto justify-between md:justify-end shrink-0">
                 <div className="flex flex-col items-end group">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em] mb-1 group-hover:text-gold transition-colors">Sovereignty_Ledger</span>
                    <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-2.5 rounded-sm border border-white/[0.05] group-hover:border-gold/30 transition-all duration-1000">
                        <span className="font-orbitron text-xl text-gold font-bold text-glow-gold">{tokens} <span className="text-[10px] opacity-40 ml-1">Ω</span></span>
                        <div className="w-8 h-8 rounded-full border border-white/10 bg-pearl/5 flex items-center justify-center">
                            <svg className="w-4 h-4 text-pearl/40 group-hover:text-pearl transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3a10.003 10.003 0 00-6.237 2.433" strokeWidth={1.5} />
                            </svg>
                        </div>
                    </div>
                 </div>

                 <div className="min-w-[240px]">
                      <SystemStatus mode={governanceAxiom} lesions={lesions} isHeaderVersion={true} />
                 </div>
            </div>
        </header>
    );
};
