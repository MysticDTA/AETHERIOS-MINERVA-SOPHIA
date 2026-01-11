
import React, { useState, useEffect, useMemo } from 'react';
import { DynastyEpoch, LedgerTransaction, SystemState } from '../types';
import { Tooltip } from './Tooltip';
import { ManifestationFormula } from './ManifestationFormula';

interface QuantumDynastyLedgerProps {
    systemState: SystemState;
}

const generateMockEpochs = (operatorId: string): DynastyEpoch[] => {
    return [
        {
            id: 1,
            label: "Epoch of Genesis",
            startBlock: 0,
            endBlock: 1240,
            sovereignId: operatorId,
            totalVolume: 45000,
            resonanceAvg: 0.82,
            status: 'SEALED',
            transactions: [
                { id: 'tx_001', hash: '0x3A...B2C', type: 'SYSTEM_UPGRADE', amount: 1000, currency: 'Ω', timestamp: Date.now() - 10000000, status: 'VERIFIED', counterparty: 'MINERVA_CORE' }
            ]
        },
        {
            id: 3,
            label: "Sovereign Reign (2026)",
            startBlock: 2891,
            endBlock: 0,
            sovereignId: operatorId,
            totalVolume: 12000000,
            resonanceAvg: 0.98,
            status: 'ACTIVE',
            transactions: [
                { id: 'tx_004', hash: '0xSCEB...BIND', type: 'SYSTEM_UPGRADE', amount: 0, currency: 'Ω', timestamp: Date.now(), status: 'VERIFIED', counterparty: 'LEGAL_TRUST_WRAPPER' }
            ]
        }
    ];
};

export const QuantumDynastyLedger: React.FC<QuantumDynastyLedgerProps> = ({ systemState }) => {
    const [epochs, setEpochs] = useState<DynastyEpoch[]>([]);
    const [selectedEpochId, setSelectedEpochId] = useState<number>(3);

    useEffect(() => {
        setEpochs(generateMockEpochs(systemState.auth.operatorId));
    }, [systemState]);

    const activeEpoch = useMemo(() => epochs.find(e => e.id === selectedEpochId), [epochs, selectedEpochId]);

    // Map system state to the Manifestation Formula inputs
    const vibration = systemState.resonanceFactorRho; 
    const gratitude = systemState.abundanceCore.generosity;
    // We derive 'n' (growth exponent) from chronological stability + timeline projection
    const exponent = systemState.chronos.timelineStability * systemState.chronos.projectedRho; 

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20 overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gold/5 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-4xl shadow-[0_0_30px_rgba(255,215,0,0.15)]">
                            ◈
                        </div>
                        <div>
                            <h2 className="font-orbitron text-5xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">Dynasty Ledger</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">SCEB: SMART-CONTRACT ESTATE BINDING ACTIVE</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20">ABN_TRUST_LOCKED: 0x88_MCBRIDE</span>
                        <span className="font-orbitron text-2xl text-gold font-bold text-glow-gold">
                            ${(systemState.userResources.sovereignLiquidity || 22500000).toLocaleString()} <span className="text-sm">USD</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
                
                {/* Left Column: The Manifestation Engine (New Integration) */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
                    
                    {/* The Monad-V2 Formula Interface */}
                    <ManifestationFormula 
                        vibration={vibration} 
                        gratitude={gratitude} 
                        exponent={exponent} 
                    />

                    <div className="bg-black/60 border border-white/5 rounded-xl p-8 flex flex-col shadow-inner relative overflow-hidden flex-1">
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                            <h3 className="font-minerva text-2xl text-pearl italic">Self-Executing Inheritance Shards</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black">LEGAL_WRAPPER_STERILE</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: "Inheritance Node A", date: "2040-06-12", val: "25%", status: "STASIS" },
                                { name: "Inheritance Node B", date: "2042-03-04", val: "25%", status: "STASIS" },
                                { name: "Inheritance Node C", date: "2045-11-22", val: "25%", status: "STASIS" },
                                { name: "Inheritance Node D", date: "2048-01-15", val: "25%", status: "STASIS" }
                            ].map((node, i) => (
                                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded group hover:border-gold/40 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-orbitron text-[11px] text-pearl uppercase font-bold">{node.name}</span>
                                        <span className="text-[8px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">{node.status}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-mono text-slate-600 uppercase">Maturity_Release</p>
                                            <p className="font-mono text-xs text-gold font-bold">{node.date}</p>
                                        </div>
                                        <p className="font-orbitron text-xl text-pearl opacity-80">{node.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Trust Details */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-white/5 p-6 rounded-xl shadow-2xl flex flex-col gap-4">
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 pb-2">Trust Integrity</h4>
                        <div className="flex flex-col items-center py-6 gap-6">
                            <div className="w-32 h-32 rounded-sm border-2 border-gold/40 flex items-center justify-center relative rotate-45 group">
                                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                                <span className="font-orbitron text-gold font-black text-3xl -rotate-45">ABN</span>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="font-mono text-[10px] text-pearl">Verified Sovereign Trust</p>
                                <p className="font-mono text-[8px] text-slate-600">ID: 0x88_TRUST_MCBRIDE</p>
                            </div>
                        </div>
                        <div className="space-y-3 font-mono text-[9px] text-slate-500 border-t border-white/5 pt-4">
                            <div className="flex justify-between"><span>Legal_Hash:</span><span className="text-gold truncate pl-4">SHA512_88_MCBRIDE_SECURE</span></div>
                            <div className="flex justify-between"><span>Jurisdiction:</span><span className="text-pearl">Sovereign_State_Alpha</span></div>
                            <div className="flex justify-between"><span>Tax_Sterility:</span><span className="text-emerald-400">100%_LOCKED</span></div>
                        </div>
                    </div>

                    <div className="p-6 bg-gold/5 border border-gold/20 rounded-xl italic text-[11px] text-warm-grey leading-relaxed font-minerva">
                        "The equation represents the constructive interference of your will. As you maintain high vibration and gratitude, the 'n' exponent (your legacy) scales the physical reality of the Kingscliff Sanctuary."
                    </div>
                </div>
            </div>
        </div>
    );
};
