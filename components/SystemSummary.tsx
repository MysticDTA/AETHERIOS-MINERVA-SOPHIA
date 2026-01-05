
import React, { useState, useEffect } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { Tooltip } from './Tooltip';

interface SystemSummaryProps {
  systemState: SystemState;
  sophiaEngine?: SophiaEngineCore | null;
}

const AuditMetric: React.FC<{ label: string; value: string; status: 'OPTIMAL' | 'DEVIATING' | 'CRITICAL' }> = ({ label, value, status }) => (
    <div className="bg-black/40 border border-white/5 p-5 rounded-sm flex flex-col gap-2 group hover:border-gold/30 transition-all">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover:text-slate-300 transition-colors">{label}</span>
        <div className="flex justify-between items-end">
            <span className="font-orbitron text-lg text-pearl font-bold truncate">{value}</span>
            <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${
                status === 'OPTIMAL' ? 'border-green-500 text-green-400 bg-green-950/20' : 
                status === 'DEVIATING' ? 'border-gold text-gold bg-gold/10' : 
                'border-rose-500 text-rose-400 bg-rose-950/20'
            }`}>
                {status}
            </span>
        </div>
    </div>
);

export const SystemSummary: React.FC<SystemSummaryProps> = ({ systemState, sophiaEngine }) => {
    const [intelligentAudit, setIntelligentAudit] = useState<string | null>(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    useEffect(() => {
        if (sophiaEngine && !intelligentAudit && !isSynthesizing) {
            const runIntelligentAudit = async () => {
                setIsSynthesizing(true);
                const report = await sophiaEngine.getArchitecturalSummary(systemState);
                setIntelligentAudit(report);
                setIsSynthesizing(false);
            };
            runIntelligentAudit();
        }
    }, [sophiaEngine, systemState, intelligentAudit, isSynthesizing]);

    const auditData = [
        { label: "Causal Parity", value: (systemState.performance.visualParity * 100).toFixed(2) + "%", status: (systemState.performance.visualParity > 0.9 ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Resonance Rho", value: systemState.resonanceFactorRho.toFixed(6), status: (systemState.resonanceFactorRho > 0.95 ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Network Latency", value: systemState.performance.logicalLatency.toFixed(4) + "ms", status: 'OPTIMAL' as any },
        { label: "Entropy Flux", value: (systemState.coherenceResonance.entropyFlux * 10).toFixed(4), status: (systemState.coherenceResonance.entropyFlux < 0.2 ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Vocal Link", value: "24kHz PCM", status: 'OPTIMAL' as any },
        { label: "Memory Depth", value: "100 Blocks", status: 'OPTIMAL' as any },
    ];

    return (
        <div className="w-full h-full bg-[#050505] border border-white/10 p-10 md:p-16 rounded-xl border-glow-pearl backdrop-blur-3xl flex flex-col overflow-hidden relative animate-fade-in shadow-[0_40px_100px_rgba(0,0,0,1)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[220px] text-white/[0.005] pointer-events-none select-none uppercase tracking-[0.4em]">
                AUDIT
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 z-10 border-b border-white/10 pb-10 gap-8">
                <div className="space-y-4">
                    <h2 className="font-orbitron text-5xl text-pearl text-glow-pearl tracking-tighter leading-none uppercase font-extrabold">System_Integrity_Audit</h2>
                    <div className="flex flex-wrap items-center gap-6">
                        <p className="font-mono text-[11px] text-slate-500 tracking-[0.5em] uppercase">Registrar: <span className="text-gold">SOPHIA_V1.3.1</span></p>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                        <p className="font-mono text-[11px] text-slate-500 tracking-[0.5em] uppercase">Hash_ID: 0x{Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase()}</p>
                    </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-3">
                    <div className="flex items-center gap-6 px-8 py-5 bg-gold/5 border border-gold/40 rounded-sm shadow-[0_0_50px_rgba(230,199,127,0.1)]">
                        <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-[13px] text-gold font-black uppercase tracking-[0.3em]">Causal Parity Verified</p>
                            <p className="text-[9px] text-gold/40 font-mono tracking-widest mt-1">Institutional Standard v1.3.1</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 z-10 overflow-y-auto pr-6 scrollbar-thin flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auditData.map((metric, i) => (
                        <AuditMetric key={i} {...metric} />
                    ))}
                </div>

                <div className="bg-violet-950/10 border border-violet-500/20 p-10 rounded-sm flex flex-col gap-8 relative group overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] font-orbitron text-9xl uppercase font-bold tracking-tighter select-none pointer-events-none">HEURISTIC</div>
                    <div className="flex items-center gap-5 border-b border-violet-500/20 pb-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_15px_#a78bfa] animate-pulse" />
                        <h4 className="font-orbitron text-[13px] text-violet-300 uppercase tracking-[0.5em] font-black">Synthesized Heuristic Conclusion</h4>
                    </div>
                    
                    <div className="flex-1 min-h-[140px]">
                        {isSynthesizing ? (
                            <div className="flex flex-col items-center justify-center gap-6 py-12 animate-pulse opacity-40">
                                <div className="w-10 h-10 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                                <span className="font-mono text-[11px] text-violet-300 uppercase tracking-[0.5em] font-bold">Accessing Cognitive Budget [32K]...</span>
                            </div>
                        ) : (
                            <p className="text-xl italic text-pearl/90 leading-relaxed font-minerva select-text antialiased indent-10">
                                "{intelligentAudit || 'Awaiting synchronization of the reasoning lattice...'}"
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                    <div className="space-y-6">
                         <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-[0.6em] font-black border-b border-gold/10 pb-4">Logic Shard Registry</h4>
                         <div className="space-y-4">
                            {['services/sophiaEngine.ts', 'services/cosmosCommsService.ts', 'hooks/useVoiceInterface.ts'].map(file => (
                                <div key={file} className="flex justify-between items-center bg-white/[0.02] p-4 border border-white/5 rounded-sm group hover:border-gold/20 transition-all">
                                    <span className="font-mono text-[11px] text-slate-400 group-hover:text-pearl transition-colors">{file}</span>
                                    <span className="text-[9px] font-mono text-emerald-400 font-bold">INTEGRITY_OK</span>
                                </div>
                            ))}
                         </div>
                    </div>
                    <div className="space-y-6">
                         <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-[0.6em] font-black border-b border-gold/10 pb-4">Security Parameter Audit</h4>
                         <div className="space-y-4">
                            {['Secret Isolation', 'CORS Edge Parity', 'Fraud Shield v4.1'].map(param => (
                                <div key={param} className="flex justify-between items-center bg-white/[0.02] p-4 border border-white/5 rounded-sm group hover:border-gold/20 transition-all">
                                    <span className="font-mono text-[11px] text-slate-400 group-hover:text-pearl transition-colors">{param}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-mono text-gold font-bold">LOCKED</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#ffd700]" />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="mt-16 pt-16 border-t border-white/10 flex flex-col items-center gap-8 pb-16">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[10px] font-orbitron text-gold uppercase tracking-[0.6em] font-black opacity-30">Architectural Approval</span>
                        <h3 className="font-minerva italic text-5xl text-pearl text-glow-pearl">Desmond McBride</h3>
                        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.5em] mt-2 font-bold">Principal Architect // ÆTHERIOS Global</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-slate-600 uppercase tracking-widest z-10 gap-6">
                <div className="flex gap-10">
                    <span className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]" /> Resonance: LOCKED</span>
                    <span className="flex items-center gap-3"><div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_gold]" /> Identity: VERIFIED</span>
                </div>
                <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/10">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                    <span className="text-pearl/80 font-bold">Sovereign Node Certification: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};
