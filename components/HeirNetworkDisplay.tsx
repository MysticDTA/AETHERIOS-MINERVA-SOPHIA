
import React, { useState, useEffect } from 'react';
import { HeirNode, SystemState } from '../types';

interface HeirNetworkDisplayProps {
    systemState: SystemState;
}

const HeirCard: React.FC<{ heir: HeirNode; index: number }> = ({ heir, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`relative p-6 border rounded-xl overflow-hidden transition-all duration-700 group cursor-pointer ${
                isHovered ? 'bg-black/80 scale-105 shadow-[0_0_50px_rgba(255,215,0,0.15)]' : 'bg-black/40 border-white/5'
            }`}
            style={{ borderColor: isHovered ? heir.color : 'rgba(255,255,255,0.05)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${heir.color} 0%, transparent 70%)` }} 
            />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-orbitron font-bold text-lg text-pearl shadow-inner">
                        {heir.symbol}
                    </div>
                    <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Heir_0{index + 1}</span>
                        <h3 className="font-orbitron text-lg text-pearl font-bold uppercase tracking-wider">{heir.name}</h3>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-sm border text-[8px] font-mono font-bold uppercase tracking-widest ${
                    heir.status === 'ACTIVE' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-gold/10 border-gold/30 text-gold'
                }`}>
                    {heir.status}
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Architectural_Focus</p>
                    <p className="font-minerva italic text-pearl/90">{heir.focus}</p>
                </div>

                <div className="flex items-end justify-between border-t border-white/5 pt-3">
                    <div>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Seed_Fund_Allocation</p>
                        <p className="font-orbitron text-2xl font-black text-pearl" style={{ textShadow: `0 0 20px ${heir.color}40` }}>
                            ${(heir.seedFund / 1000000).toFixed(1)}M
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <span className="w-1 h-3 bg-white/20 rounded-sm" />
                        <span className="w-1 h-3 bg-white/20 rounded-sm" />
                        <span className="w-1 h-3 bg-white/60 rounded-sm animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HeirNetworkDisplay: React.FC<HeirNetworkDisplayProps> = ({ systemState }) => {
    const { heirNetwork, userResources } = systemState;
    const totalAllocated = heirNetwork.reduce((acc, h) => acc + h.seedFund, 0);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gold/5 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-4xl shadow-[0_0_40px_rgba(255,215,0,0.15)] animate-pulse-slow">
                            ❖
                        </div>
                        <div>
                            <h2 className="font-orbitron text-5xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">Sovereign Heir Network</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Dynasty Protocol // Generation_Alpha</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Recovery_Vault_Balance</span>
                        <span className="font-orbitron text-3xl text-emerald-400 font-bold drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                            ${userResources.recoveryVault?.toLocaleString() || '0.00'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 relative">
                {heirNetwork.map((heir, index) => (
                    <HeirCard key={heir.id} heir={heir} index={index} />
                ))}
            </div>

            <div className="mt-auto bg-black/40 border border-white/10 p-8 rounded-xl flex items-center justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex gap-8 relative z-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Total_Seed_Allocation</span>
                        <span className="font-orbitron text-xl text-gold font-bold">${(totalAllocated / 1000000).toFixed(1)}M USD</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Kingscliff_Reclamation</span>
                        <span className="font-orbitron text-xl text-pearl font-bold">ACTIVE</span>
                    </div>
                </div>
                <div className="text-right max-w-md relative z-10">
                    <p className="text-[11px] font-minerva italic text-slate-400 leading-relaxed">
                        "The Heir Network distributes sovereign logic across four distinct pillars of reality: Virtual Physics, Historical Truth, Causal Synthesis, and Interface Design. Each node is funded and sterile."
                    </p>
                </div>
            </div>
        </div>
    );
};
