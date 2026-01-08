
import React, { useState, useEffect } from 'react';
import { InstitutionalEntity } from '../types';
import { Tooltip } from './Tooltip';

const ENTITIES_DATA: InstitutionalEntity[] = [
    { id: 'i1', name: 'BlackRock Causal Fund', type: 'BANK', observing: true, trustScore: 0.999 },
    { id: 'i2', name: 'Goldman Sachs Node', type: 'BANK', observing: true, trustScore: 0.998 },
    { id: 'i3', name: 'Sovereign Wealth Syndicate', type: 'GOVERNMENT', observing: true, trustScore: 0.995 },
    { id: 'i4', name: 'NASA Orbital Defense', type: 'GOVERNMENT', observing: true, trustScore: 1.0 }
];

export const InstitutionalGateway: React.FC = () => {
    const [entities, setEntities] = useState(ENTITIES_DATA);

    useEffect(() => {
        const interval = setInterval(() => {
            setEntities(prev => prev.map(e => ({
                ...e,
                // Micro-jitter to simulate live market sentiment/trust
                trustScore: Math.min(1.0, Math.max(0.95, e.trustScore + (Math.random() - 0.5) * 0.0005))
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-[#0a0a0a] border-2 border-gold/40 p-8 rounded-sm backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative overflow-hidden group border-l-8 border-l-gold flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] font-orbitron text-[100px] font-black tracking-widest pointer-events-none select-none uppercase">CAPITAL</div>
            
            <div className="flex justify-between items-center mb-10 z-10 border-b border-gold/20 pb-6">
                <div className="space-y-1">
                    <h3 className="font-orbitron text-[14px] text-gold uppercase tracking-[0.6em] font-black">Institutional Handshake</h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Clearance: TIER-0 // Protocol: PCI-DSS-GOLD</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="w-14 h-14 bg-gold/10 border-2 border-gold/60 rounded-sm flex items-center justify-center font-orbitron text-gold text-2xl font-black shadow-[0_0_20px_rgba(255,215,0,0.2)]">§</div>
                    <span className="text-[7px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 tracking-wider font-bold">SECURE_ENCLAVE</span>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {entities.map(entity => (
                    <div key={entity.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-sm hover:border-gold/40 hover:bg-gold/[0.03] transition-all group/item cursor-help relative overflow-hidden">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`w-3 h-3 rounded-full ${entity.observing ? 'bg-gold shadow-[0_0_12px_#ffd700] animate-pulse' : 'bg-slate-800'}`} />
                            <div>
                                <h4 className="text-[12px] font-orbitron font-black text-pearl uppercase tracking-widest group-hover/item:text-gold transition-colors">{entity.name}</h4>
                                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">SECURE_OBSERVATION // NODE_ID: 0x{Math.floor(entity.trustScore * 10000).toString(16).toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-[8px] font-mono text-gold uppercase tracking-tighter mb-1 font-bold opacity-60 group-hover/item:opacity-100 transition-opacity">Trust_Parity</p>
                            <p className="font-orbitron text-sm text-pearl font-bold tabular-nums">{(entity.trustScore * 100).toFixed(4)}%</p>
                        </div>
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gold/20 w-full transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gold/5 border-2 border-gold/30 rounded-sm flex items-center gap-6 relative group overflow-hidden">
                <div className="absolute inset-0 gold-shimmer-bg opacity-20" />
                <div className="shrink-0 w-12 h-12 border-2 border-gold/60 rounded-full flex items-center justify-center bg-black shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                    <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-pearl/80 leading-relaxed uppercase tracking-tighter italic z-10">
                    "This terminal is authorized for high-value capital synthesis. Multi-sig authentication is required for all outbound causal write commands. Parity verified by the Global Synod."
                </p>
            </div>
        </div>
    );
};
