
import React from 'react';
import { SystemState, GalacticRelay } from '../types';
import { Tooltip } from './Tooltip';

interface SystemSummaryProps {
  systemState: SystemState;
}

const IntegrityCard: React.FC<{ title: string, status: string, integrity: number, color: string, details: string[] }> = ({ title, status, integrity, color, details }) => (
    <div className="bg-black/40 border border-slate-700/40 p-5 rounded-sm flex flex-col gap-4 group hover:border-pearl/30 transition-all duration-700 shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] mb-1.5 font-bold">{title}</h4>
                <span className={`text-[9px] font-mono px-2 py-1 rounded-sm border border-current opacity-80`} style={{ color, backgroundColor: `${color}05` }}>
                    {status}
                </span>
            </div>
            <div className="text-right">
                <span className="font-orbitron text-xl font-bold tracking-tighter" style={{ color, textShadow: `0 0 10px ${color}44` }}>{(integrity * 100).toFixed(1)}%</span>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest">Integrity_X</p>
            </div>
        </div>
        <div className="space-y-1.5 mt-2 border-t border-white/5 pt-3">
            {details.map((d, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-sm rotate-45 shrink-0" style={{ backgroundColor: color }} />
                    <span className="truncate">{d}</span>
                </div>
            ))}
        </div>
    </div>
);

export const SystemSummary: React.FC<SystemSummaryProps> = ({ systemState }) => {
    const isProductionReady = systemState.quantumHealing.health > 0.9 && systemState.resonanceFactorRho > 0.9;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-white/10 p-8 md:p-12 rounded-lg border-glow-pearl backdrop-blur-3xl flex flex-col overflow-hidden relative animate-fade-in shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            {/* Background Aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[180px] text-white/[0.008] pointer-events-none select-none uppercase tracking-[0.2em]">
                CERTIFIED
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-pearl/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 z-10 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h2 className="font-orbitron text-4xl text-pearl text-glow-pearl tracking-tighter leading-none mb-3">SYSTEM_AUDIT_REPORT</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Status: <span className="text-green-500">VERIFIED</span></p>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Time: {timestamp}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    {isProductionReady ? (
                        <div className="flex items-center gap-5 px-6 py-4 bg-green-950/25 border border-green-500/40 rounded-sm shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-fade-in">
                            <svg className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-[11px] text-green-400 font-bold uppercase tracking-[0.25em]">Production Integrity Certified</p>
                                <p className="text-[9px] text-green-500/60 font-mono tracking-widest mt-1">SIGNATURE: 0x88_MINERVA_SOPHIA_777</p>
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 py-4 bg-gold/5 border border-gold/30 rounded-sm">
                            <span className="text-[11px] text-gold font-bold uppercase tracking-[0.25em] animate-pulse">Heuristic Optimization Active</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 z-10 overflow-y-auto pr-3 hide-scrollbar hover:show-scrollbar">
                <IntegrityCard 
                    title="Causal Matrix (TSX)"
                    status="PARITY_LOCKED"
                    integrity={systemState.quantumHealing.health}
                    color="#f8f5ec"
                    details={[
                        `Effective Health: ${(systemState.quantumHealing.health * 100).toFixed(1)}%`,
                        `Entropy Flux: ${(systemState.quantumHealing.decoherence * 100).toFixed(2)}%`,
                        `Anomalous Fragments: ${systemState.quantumHealing.lesions}`
                    ]}
                />
                <IntegrityCard 
                    title="Resonance Array"
                    status="PHASE_SYNCHRONIZED"
                    integrity={systemState.resonanceFactorRho}
                    color="#e6c77f"
                    details={[
                        `Rho Coefficient: ${systemState.resonanceFactorRho.toFixed(5)}`,
                        `Temporal Drift: Stable`,
                        `Phase Symmetry: Locked`
                    ]}
                />
                <IntegrityCard 
                    title="Cognitive Core (AI)"
                    status="HIGH_INTELLIGENCE"
                    integrity={0.998}
                    color="#67e8f9"
                    details={[
                        `Logic Model: Gemini 3 Pro`,
                        `Recursive Memory: Enabled`,
                        `Grounding: Google Search Connected`
                    ]}
                />
                <IntegrityCard 
                    title="Celestial Uplink"
                    status="HEVO_STABLE"
                    integrity={systemState.lyranConcordance.connectionStability}
                    color="#a78bfa"
                    details={[
                        `Stability index: ${(systemState.lyranConcordance.connectionStability * 100).toFixed(1)}%`,
                        `Uplink Protocol: HEVO-4`,
                        `Nodes Active: ${(Object.values(systemState.galacticRelayNetwork) as GalacticRelay[]).filter(r => r.status === 'ONLINE').length}/4`
                    ]}
                />
                <IntegrityCard 
                    title="Operator Interface"
                    status="BIO_COHERENT"
                    integrity={systemState.biometricSync.coherence}
                    color="#f4c2c2"
                    details={[
                        `HRV Alignment: ${(systemState.biometricSync.coherence * 100).toFixed(1)}%`,
                        `Voice Bridge: Protocol Charon`,
                        `Aura Scanner: CALIBRATED`
                    ]}
                />
                <div className="bg-pearl/5 border border-pearl/20 p-8 rounded-sm flex flex-col items-center justify-center text-center gap-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pearl/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <p className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Director decree</p>
                    <p className="text-sm italic text-pearl/80 leading-relaxed font-minerva">
                        "The system has achieved operational maturity. All file functions have passed heuristic verification. Continue monitoring Rho synergies."
                    </p>
                    <div className="w-16 h-px bg-pearl/30" />
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">SOPHIA CORE v1.2.5</p>
                        <p className="text-[8px] text-slate-600 font-mono uppercase">BUILD_HASH: 0xCAFE_BABE_88</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest z-10 gap-4">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Session: ACTIVE</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> Load: NOMINAL</span>
                </div>
                <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-white/5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-pearl/60">Functional Parity Confirmed</span>
                </div>
            </div>
        </div>
    );
};
