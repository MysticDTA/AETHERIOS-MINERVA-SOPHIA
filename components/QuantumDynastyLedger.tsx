
import React, { useState, useEffect, useMemo } from 'react';
import { DynastyEpoch, LedgerTransaction, SystemState } from '../types';
import { Tooltip } from './Tooltip';

interface QuantumDynastyLedgerProps {
    systemState: SystemState;
}

// Mock Data Generator for initial state if empty
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
                { id: 'tx_001', hash: '0x3A...B2C', type: 'SYSTEM_UPGRADE', amount: 1000, currency: 'Ω', timestamp: Date.now() - 10000000, status: 'VERIFIED', counterparty: 'MINERVA_CORE' },
                { id: 'tx_002', hash: '0x8F...11A', type: 'CAPITAL_INJECTION', amount: 5000, currency: 'USD', timestamp: Date.now() - 9500000, status: 'VERIFIED', counterparty: 'STRIPE_GATEWAY' }
            ]
        },
        {
            id: 2,
            label: "Epoch of Expansion",
            startBlock: 1241,
            endBlock: 2890,
            sovereignId: operatorId,
            totalVolume: 125000,
            resonanceAvg: 0.94,
            status: 'SEALED',
            transactions: [
                { id: 'tx_003', hash: '0xCC...991', type: 'ASSET_TRANSFER', amount: 500, currency: 'RHO', timestamp: Date.now() - 5000000, status: 'VERIFIED', counterparty: 'LYRAN_NODE' }
            ]
        },
        {
            id: 3,
            label: "Current Reign",
            startBlock: 2891,
            endBlock: 0,
            sovereignId: operatorId,
            totalVolume: 12000,
            resonanceAvg: 0.98,
            status: 'ACTIVE',
            transactions: [
                { id: 'tx_004', hash: '0xPEND...ING', type: 'RESONANCE_MINT', amount: 50, currency: 'Ω', timestamp: Date.now(), status: 'PENDING', counterparty: 'LOCAL_OPERATOR' }
            ]
        }
    ];
};

const EpochBlock: React.FC<{ epoch: DynastyEpoch; isActive: boolean; onClick: () => void }> = ({ epoch, isActive, onClick }) => {
    const isSealed = epoch.status === 'SEALED';
    
    return (
        <div 
            onClick={onClick}
            className={`
                relative p-6 border-l-4 cursor-pointer transition-all duration-500 group overflow-hidden
                ${isActive 
                    ? 'bg-gold/10 border-gold shadow-[0_0_30px_rgba(255,215,0,0.1)]' 
                    : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-gold/50'
                }
            `}
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ffd700 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${isActive ? 'text-gold' : 'text-slate-500'}`}>
                        Block_Height: {epoch.startBlock}
                    </span>
                    <h4 className={`font-minerva italic text-xl ${isActive ? 'text-pearl' : 'text-slate-400 group-hover:text-pearl'}`}>
                        {epoch.label}
                    </h4>
                </div>
                {isSealed ? (
                    <div className="flex items-center gap-2 text-emerald-500 opacity-60">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                ) : (
                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_8px_gold]" />
                )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 opacity-80">
                <div>
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">Volume</span>
                    <span className="font-orbitron text-sm text-pearl">{epoch.totalVolume.toLocaleString()}</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">Avg_Rho</span>
                    <span className={`font-orbitron text-sm ${epoch.resonanceAvg > 0.9 ? 'text-emerald-400' : 'text-gold'}`}>
                        {epoch.resonanceAvg.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const QuantumDynastyLedger: React.FC<QuantumDynastyLedgerProps> = ({ systemState }) => {
    const [epochs, setEpochs] = useState<DynastyEpoch[]>([]);
    const [selectedEpochId, setSelectedEpochId] = useState<number>(3); // Default to current
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Hydrate with real or mock data
        if (systemState.dynastyLedger && systemState.dynastyLedger.length > 0) {
            setEpochs(systemState.dynastyLedger);
        } else {
            setEpochs(generateMockEpochs(systemState.auth.operatorId));
        }
    }, [systemState]);

    const activeEpoch = useMemo(() => epochs.find(e => e.id === selectedEpochId), [epochs, selectedEpochId]);

    const filteredTransactions = useMemo(() => {
        if (!activeEpoch) return [];
        return activeEpoch.transactions.filter(tx => 
            tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
            tx.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeEpoch, searchTerm]);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gold/5 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-4xl shadow-[0_0_30px_rgba(255,215,0,0.15)] animate-pulse-slow">
                            ◈
                        </div>
                        <div>
                            <h2 className="font-orbitron text-5xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">Dynasty Ledger</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Immutable Causal History // Sovereign Record</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Total_Locked_Value</span>
                        <span className="font-orbitron text-2xl text-gold font-bold text-glow-gold">
                            {epochs.reduce((acc, e) => acc + e.totalVolume, 0).toLocaleString()} <span className="text-sm">Ω</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
                {/* Left: Timeline (Epochs) */}
                <div className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0 relative">
                    <h3 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black mb-2 pl-1">Ancestral Chain</h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-white/5 ml-[-10px] hidden md:block" />
                        
                        {epochs.map(epoch => (
                            <EpochBlock 
                                key={epoch.id} 
                                epoch={epoch} 
                                isActive={epoch.id === selectedEpochId} 
                                onClick={() => setSelectedEpochId(epoch.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Block Details */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
                    {activeEpoch ? (
                        <div className="flex-1 bg-[#050505] border border-white/10 rounded-sm p-8 flex flex-col shadow-2xl relative overflow-hidden group">
                            {/* Decorative Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="font-minerva text-3xl text-pearl italic">{activeEpoch.label}</h3>
                                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${activeEpoch.status === 'SEALED' ? 'border-emerald-500 text-emerald-400' : 'border-gold text-gold animate-pulse'}`}>
                                            {activeEpoch.status}
                                        </span>
                                    </div>
                                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                                        Hash: {activeEpoch.sovereignId}_BLK_{activeEpoch.startBlock}-{activeEpoch.endBlock || 'LATEST'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH_HASH..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-sm px-4 py-2 font-mono text-[10px] text-gold focus:outline-none focus:border-gold/50 transition-all uppercase placeholder-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Transaction Table */}
                            <div className="flex-1 overflow-y-auto scrollbar-thin">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[9px] font-mono text-slate-600 uppercase tracking-widest border-b border-white/5">
                                            <th className="pb-3 pl-2">Hash_ID</th>
                                            <th className="pb-3">Type</th>
                                            <th className="pb-3">Counterparty</th>
                                            <th className="pb-3 text-right">Value</th>
                                            <th className="pb-3 text-right pr-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[11px] font-mono">
                                        {filteredTransactions.map(tx => (
                                            <tr key={tx.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]">
                                                <td className="py-4 pl-2 text-slate-400 font-bold">{tx.hash}</td>
                                                <td className="py-4 text-pearl">{tx.type.replace('_', ' ')}</td>
                                                <td className="py-4 text-slate-500">{tx.counterparty}</td>
                                                <td className="py-4 text-right font-orbitron text-gold">
                                                    {tx.amount.toLocaleString()} <span className="text-[8px] opacity-60">{tx.currency}</span>
                                                </td>
                                                <td className="py-4 text-right pr-2">
                                                    <span className={`text-[8px] px-2 py-1 rounded-sm ${
                                                        tx.status === 'VERIFIED' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'
                                                    }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-slate-600 italic text-[10px] uppercase tracking-widest">
                                                    No Matching Records in Ledger
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                                <span>Verification: SHA-256</span>
                                <span>Node_Consensus: 100%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-black/20 border border-white/5 rounded-sm flex items-center justify-center">
                            <span className="font-orbitron text-slate-600 uppercase tracking-[0.5em] text-xs">Select an Epoch to Audit</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
