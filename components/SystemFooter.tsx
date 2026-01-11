
import React, { useState } from 'react';
import { OrbControls } from './OrbControls';
import { OrbMode, OrbModeConfig } from '../types';
import { SYSTEM_NODES } from '../Registry';

interface SystemFooterProps {
    orbModes: OrbModeConfig[];
    currentMode: OrbMode;
    setMode: (mode: OrbMode) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    onOpenConfig?: () => void;
}

export const SystemFooter: React.FC<SystemFooterProps> = React.memo(({ 
    orbModes, 
    currentMode, 
    setMode, 
    currentPage, 
    setCurrentPage,
    onOpenConfig
}) => {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div 
            className={`
                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${isMinimized ? 'w-auto px-8 py-3 rounded-full bg-black/90 border-white/20 translate-y-0' : 'w-full rounded-2xl bg-[#080808]/80 border-white/10 p-2 md:p-3'}
                border backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group overflow-hidden mx-auto
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Toggle Handle */}
            <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-500 hover:text-pearl transition-colors z-20 p-2 rounded-full hover:bg-white/5 ${isMinimized ? 'right-3' : 'right-2 top-2 -translate-y-0'}`}
                title={isMinimized ? "Expand Nexus" : "Minimize Nexus"}
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMinimized ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M20 8V4m0 0h-4M4 16v4m0 0h4M20 16v4m0 0h-4" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                </svg>
            </button>

            {isMinimized ? (
                // Minimized View
                <div className="flex items-center gap-6 pr-8 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${currentMode === 'OFFLINE' ? 'bg-red-500' : 'bg-green-500'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                        <div className="flex flex-col">
                            <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-0.5">Axiom</span>
                            <span className="font-orbitron text-[10px] text-pearl font-bold uppercase tracking-wider leading-none">{currentMode}</span>
                        </div>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-[8px] font-mono text-gold uppercase tracking-[0.2em] opacity-60">NEXUS_IDLE</span>
                </div>
            ) : (
                // Expanded View
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 animate-fade-in pr-8 pl-2">
                    <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
                        <OrbControls modes={orbModes} currentMode={currentMode} setMode={setMode} />
                        <div className="h-6 w-px bg-white/10 hidden xl:block shrink-0" />
                        <div className="hidden xl:flex items-center gap-2 shrink-0">
                            <span className="w-1 h-1 bg-gold rounded-full animate-blink" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.3em] font-black whitespace-nowrap">COMMAND_READY</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 items-center flex-wrap justify-center md:justify-end shrink-0">
                        {SYSTEM_NODES.filter(n => n.isShield || n.isLogs || n.isBridge || n.isAudit).map(node => (
                            <button 
                                key={node.id}
                                onClick={() => setCurrentPage(node.id)} 
                                className={`px-5 py-2 border font-orbitron text-[9px] uppercase tracking-[0.2em] rounded-sm transition-all font-bold active:scale-95 shadow-md hover:scale-105 ${
                                    currentPage === node.id ? 'bg-pearl text-dark-bg border-pearl shadow-[0_0_15px_white]' :
                                    node.isShield ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-400' :
                                    node.isLogs ? 'bg-slate-900/20 border-slate-500/20 text-slate-400 hover:bg-slate-500 hover:text-white hover:border-slate-400' :
                                    node.isAudit ? 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-dark-bg hover:border-gold' :
                                    'bg-violet-950/20 border-violet-500/30 text-violet-400 hover:bg-violet-500 hover:text-white hover:border-violet-400'
                                }`}
                            >
                                {node.label}
                            </button>
                        ))}
                        {onOpenConfig && (
                            <button
                                onClick={onOpenConfig}
                                className="px-5 py-2 border border-slate-700/50 bg-slate-900/40 text-slate-300 font-orbitron text-[9px] uppercase tracking-[0.2em] rounded-sm hover:bg-slate-800 hover:text-pearl transition-all font-bold hover:border-pearl/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 ml-2"
                            >
                                CONFIG
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
