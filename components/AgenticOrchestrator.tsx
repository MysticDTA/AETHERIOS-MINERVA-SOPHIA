
import React, { useState, useEffect } from 'react';
import { NegotiationNode } from '../types';

export const AgenticOrchestrator: React.FC<{ active: boolean }> = ({ active }) => {
    const [negotiations, setNegotiations] = useState<NegotiationNode[]>([
        { id: 'deal_01', target: 'SINGAPORE_NODE', status: 'NEGOTIATING', ripeness: 0.72, lastHeuristic: "Proposed 0.05% Carry override." },
        { id: 'deal_02', target: 'SWISS_NODE', status: 'VERIFYING_STERILITY', ripeness: 0.88, lastHeuristic: "STA Protocol Handshake pending." }
    ]);

    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setNegotiations(prev => prev.map(n => ({
                ...n,
                ripeness: Math.min(0.99, n.ripeness + (Math.random() * 0.01)),
                status: n.ripeness > 0.95 ? 'CONTRACT_READY' : n.status
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="w-full h-full p-8 flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="font-orbitron text-3xl text-gold uppercase font-black tracking-tighter">Agentic Orchestrator</h2>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">AUTONOMIC LEASE PROCUREMENT :: ACTIVE</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-emerald-950/20 border border-emerald-500/30 rounded flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">STA_STERILE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {negotiations.map(node => (
                    <div key={node.id} className="bg-black/60 border border-white/10 p-6 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl italic font-black">{node.target.split('_')[0]}</div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h4 className="font-orbitron text-sm text-pearl font-bold uppercase tracking-widest">{node.target}</h4>
                                <span className="text-[9px] font-mono text-slate-500">NEG_ID: {node.id}</span>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${node.status === 'CONTRACT_READY' ? 'border-emerald-500 text-emerald-400' : 'border-gold text-gold'}`}>
                                {node.status}
                            </span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                                    <span>Contract Ripeness</span>
                                    <span>{(node.ripeness * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold transition-all duration-1000 shadow-[0_0_10px_gold]" style={{ width: `${node.ripeness * 100}%` }} />
                                </div>
                            </div>

                            <div className="p-3 bg-white/5 rounded border border-white/5 italic text-[11px] text-slate-400 font-minerva">
                                "{node.lastHeuristic}"
                            </div>

                            {node.status === 'CONTRACT_READY' ? (
                                <button className="w-full py-4 bg-pearl text-black font-orbitron text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                    EXEC_BIO_SIGNATURE
                                </button>
                            ) : (
                                <div className="text-center py-4 border border-dashed border-white/10 rounded">
                                    <span className="text-[10px] font-mono text-slate-600 uppercase animate-pulse">Autonomic Negotiation in progress...</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
