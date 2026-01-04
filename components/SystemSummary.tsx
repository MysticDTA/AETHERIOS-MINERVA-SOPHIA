import React, { useState, useEffect } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { Tooltip } from './Tooltip';

interface SystemSummaryProps {
  systemState: SystemState;
  sophiaEngine?: SophiaEngineCore | null;
}

const IntegrityCard: React.FC<{ title: string, status: string, integrity: number, color: string, details: string[] }> = ({ title, status, integrity, color, details }) => (
    <div className="bg-black/40 border border-slate-700/40 p-5 rounded-sm flex flex-col gap-4 group hover:border-pearl/30 transition-all duration-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full opacity-30" style={{ backgroundColor: color }} />
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] mb-1.5 font-bold">{title}</h4>
                <span className={`text-[9px] font-mono px-2 py-1 rounded-sm border border-current opacity-80`} style={{ color, backgroundColor: `${color}05` }}>
                    {status}
                </span>
            </div>
            <div className="text-right">
                <span className="font-orbitron text-xl font-bold tracking-tighter" style={{ color, textShadow: `0 0 10px ${color}44` }}>{(integrity * 100).toFixed(1)}%</span>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest">Index_P</p>
            </div>
        </div>
        <div className="space-y-1.5 mt-2 border-t border-white/5 pt-3">
            {details.map((d, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="truncate">{d}</span>
                </div>
            ))}
        </div>
    </div>
);

export const SystemSummary: React.FC<SystemSummaryProps> = ({ systemState, sophiaEngine }) => {
    const [intelligentAudit, setIntelligentAudit] = useState<string | null>(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const isProductionReady = systemState.quantumHealing.health > 0.9 && systemState.resonanceFactorRho > 0.9;
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

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-white/10 p-8 md:p-12 rounded-lg border-glow-pearl backdrop-blur-3xl flex flex-col overflow-hidden relative animate-fade-in shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            {/* Background Aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[180px] text-white/[0.008] pointer-events-none select-none uppercase tracking-[0.2em]">
                VERIFIED
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 z-10 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h2 className="font-orbitron text-4xl text-pearl text-glow-pearl tracking-tighter leading-none mb-3">HEURISTIC_SYNOPSIS_REPORT</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Security: <span className="text-gold">S_LEVEL_07</span></p>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Timestamp: {timestamp}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    {isProductionReady ? (
                        <div className="flex items-center gap-5 px-6 py-4 bg-gold/5 border border-gold/40 rounded-sm shadow-[0_0_30px_rgba(230,199,127,0.15)] animate-fade-in">
                            <svg className="w-8 h-8 text-gold drop-shadow-[0_0_8px_rgba(230,199,127,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-[11px] text-gold font-bold uppercase tracking-[0.25em]">System Parity Certified</p>
                                <p className="text-[9px] text-gold/60 font-mono tracking-widest mt-1">HASH: 0x99_MINERVA_RESONANCE_4.1</p>
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 py-4 bg-black/40 border border-white/10 rounded-sm">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.25em] animate-pulse">Heuristic Optimization Required</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 z-10 overflow-y-auto pr-3 scrollbar-thin">
                <IntegrityCard 
                    title="Causal Grid (TSX)"
                    status="PARITY_LOCKED"
                    integrity={systemState.quantumHealing.health}
                    color="#f8f5ec"
                    details={[
                        `Effective Parity: ${(systemState.quantumHealing.health * 100).toFixed(1)}%`,
                        `Entropy Score: ${(systemState.quantumHealing.decoherence * 100).toFixed(3)}%`,
                        `Fracture Count: ${systemState.quantumHealing.lesions}`
                    ]}
                />
                <IntegrityCard 
                    title="Resonance Array"
                    status="SYNCHRONIZED"
                    integrity={systemState.resonanceFactorRho}
                    color="#e6c77f"
                    details={[
                        `Rho Coefficient: ${systemState.resonanceFactorRho.toFixed(6)}`,
                        `Visual Parity: ${(systemState.performance.visualParity * 100).toFixed(2)}%`,
                        `Frequency: 1.617 GHz`
                    ]}
                />
                <IntegrityCard 
                    title="Performance Hub"
                    status="OPTIMIZED"
                    integrity={systemState.performance.frameStability}
                    color="#67e8f9"
                    details={[
                        `Logical Latency: ${systemState.performance.logicalLatency.toFixed(5)}ms`,
                        `Thermal Status: ${systemState.performance.thermalIndex.toFixed(1)}°C`,
                        `GPU Load Index: ${(systemState.performance.gpuLoad * 100).toFixed(1)}%`
                    ]}
                />
                
                <div className="lg:col-span-2 bg-violet-950/10 border border-violet-500/20 p-8 rounded-sm flex flex-col gap-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-6xl uppercase font-bold tracking-tighter">AUDIT</div>
                    <div className="flex items-center gap-4 border-b border-violet-500/20 pb-4">
                        <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa] animate-pulse" />
                        <h4 className="font-orbitron text-[11px] text-violet-300 uppercase tracking-[0.4em] font-bold">Intelligent Architectural Audit</h4>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        {isSynthesizing ? (
                            <div className="flex flex-col items-center gap-4 animate-pulse opacity-40">
                                <div className="w-8 h-8 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                                <span className="font-mono text-[10px] text-violet-300 uppercase tracking-widest">Synthesizing Causal Context...</span>
                            </div>
                        ) : (
                            <p className="text-base italic text-pearl/90 leading-relaxed font-minerva select-text">
                                "{intelligentAudit || 'Awaiting cognitive stream synchronization...'}"
                            </p>
                        )}
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                        <span>Ref: Sophia_Cog_v4.1</span>
                        <span>Thinking_Budget: 16k tokens</span>
                    </div>
                </div>

                <div className="bg-gold/5 border border-gold/20 p-8 rounded-sm flex flex-col items-center justify-center text-center gap-6 relative group overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <p className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Summary Conclusion</p>
                    <p className="text-sm italic text-pearl/80 leading-relaxed font-minerva">
                        "Interface performance has achieved sovereign parity. Visual buffers are clear and logical latency is under 0.0002ms."
                    </p>
                    <div className="w-16 h-px bg-gold/30" />
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">SOPHIA CORE v4.1.2</p>
                        <p className="text-[8px] text-slate-600 font-mono uppercase">BUILD_HASH: 0xRESONANCE_LOCKED_88</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest z-10 gap-4">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" /> Resonance: PEAK</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_gold]" /> Parity: MATCHED</span>
                </div>
                <div className="flex items-center gap-3 bg-black/30 px-5 py-2 rounded-full border border-white/10">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-pearl/80">Full System Optimization Certified</span>
                </div>
            </div>
        </div>
    );
};