import React from 'react';
import { InstitutionalEntity } from '../types';
import { Tooltip } from './Tooltip';

const ENTITIES: InstitutionalEntity[] = [
    { id: 'i1', name: 'Federal Reserve Node', type: 'BANK', observing: true, trustScore: 0.98 },
    { id: 'i2', name: 'Global Energy Synod', type: 'GOVERNMENT', observing: true, trustScore: 0.92 },
    { id: 'i3', name: 'Stripe Core Security', type: 'CORPORATION', observing: true, trustScore: 0.99 },
    { id: 'i4', name: 'NOAA Solar Watch', type: 'GOVERNMENT', observing: true, trustScore: 0.95 }
];

export const InstitutionalGateway: React.FC = () => {
    return (
        <div className="w-full bg-[#0a0a0a]/80 border border-gold/20 p-6 rounded-xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group border-l-4 border-l-gold">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-7xl uppercase font-bold tracking-widest pointer-events-none">TRUST</div>
            
            <div className="flex justify-between items-center mb-8 z-10">
                <div className="space-y-1">
                    <h3 className="font-orbitron text-[11px] text-gold uppercase tracking-[0.5em] font-bold">Institutional Handshake</h3>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Visibility: HIGH // Protocol: PCI-DSS-AETHER</p>
                </div>
                <div className="w-10 h-10 bg-gold/10 border border-gold/40 rounded-lg flex items-center justify-center font-orbitron text-gold text-lg">§</div>
            </div>

            <div className="space-y-5">
                {ENTITIES.map(entity => (
                    <div key={entity.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded hover:bg-white/[0.05] transition-all group/item">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${entity.observing ? 'bg-cyan-400 shadow-[0_0_8px_#67e8f9]' : 'bg-slate-700'}`} />
                            <div>
                                <h4 className="text-[11px] font-orbitron font-bold text-pearl uppercase tracking-widest">{entity.name}</h4>
                                <span className="text-[8px] font-mono text-slate-500 uppercase">{entity.type} // STATUS: ACTIVE_OBSERVATION</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-mono text-gold uppercase tracking-tighter mb-1">Trust_Parity</p>
                            <p className="font-orbitron text-xs text-pearl">{(entity.trustScore * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-gold/5 border border-gold/10 rounded flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-slate-400 leading-relaxed uppercase tracking-tighter">
                    "This interface is verified by global banking and governance standards for high-fidelity data synthesis. Security clearance Grade_S is mandatory for full causal write access."
                </p>
            </div>
        </div>
    );
};