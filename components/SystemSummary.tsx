
import React, { useState, useEffect, useMemo } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { Tooltip } from './Tooltip';

interface SystemSummaryProps {
  systemState: SystemState;
  sophiaEngine?: SophiaEngineCore | null;
  existingReport?: { report: string; sources: any[] } | null;
}

const SovereignSeal: React.FC = () => (
    <div className="relative w-40 h-40 flex items-center justify-center group pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite] opacity-30 group-hover:opacity-60 transition-opacity">
            <defs>
                <filter id="sealGlow"><feGaussianBlur stdDeviation="2" /><feComposite in="SourceGraphic" operator="over" /></filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="1 3" />
            <path d="M 50 5 L 95 50 L 50 95 L 5 50 Z" fill="none" stroke="var(--gold)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="10 5" filter="url(#sealGlow)" />
        </svg>
        <div className="absolute font-orbitron text-gold font-black text-2xl tracking-tighter opacity-80 drop-shadow-[0_0_10px_gold]">S7</div>
        <div className="absolute top-[115%] w-max text-[8px] font-mono text-gold uppercase tracking-[0.6em] font-black opacity-60">Sovereign_Validation_0x88</div>
    </div>
);

const SubsystemStatus: React.FC<{ label: string; active: boolean; detail: string }> = ({ label, active, detail }) => (
    <div className="bg-black/60 border border-white/5 p-4 rounded-sm flex flex-col gap-2 group hover:border-violet-500/30 transition-all">
        <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover:text-violet-300 transition-colors">{label}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-700'}`} />
        </div>
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-pearl">{active ? 'ONLINE' : 'OFFLINE'}</span>
            <span className="text-[8px] text-slate-600 font-mono tracking-tight">{detail}</span>
        </div>
    </div>
);

const AuditMetric: React.FC<{ label: string; value: string; status: 'OPTIMAL' | 'DEVIATING' | 'CRITICAL' }> = ({ label, value, status }) => (
    <div className="bg-black/60 border border-white/5 p-6 rounded-sm flex flex-col gap-3 group hover:border-gold/40 transition-all shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black group-hover:text-slate-300 transition-colors relative z-10">{label}</span>
        <div className="flex justify-between items-end relative z-10">
            <span className="font-orbitron text-xl text-pearl font-extrabold truncate tracking-tighter">{value}</span>
            <span className={`text-[7px] font-mono px-2 py-0.5 rounded border font-black tracking-widest ${
                status === 'OPTIMAL' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                status === 'DEVIATING' ? 'border-gold text-gold bg-gold/10' : 
                'border-rose-500 text-rose-400 bg-rose-950/20'
            }`}>
                {status}
            </span>
        </div>
    </div>
);

export const SystemSummary: React.FC<SystemSummaryProps> = ({ systemState, sophiaEngine, existingReport }) => {
    const [intelligentAudit, setIntelligentAudit] = useState<string | null>(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    
    useEffect(() => {
        if (existingReport) {
            setIntelligentAudit(existingReport.report);
        } else if (sophiaEngine && !intelligentAudit && !isSynthesizing) {
            const runIntelligentAudit = async () => {
                setIsSynthesizing(true);
                const report = await sophiaEngine.performSystemAudit(systemState);
                setIntelligentAudit(report.report);
                setIsSynthesizing(false);
            };
            runIntelligentAudit();
        } else if (!sophiaEngine && !intelligentAudit) {
            setIntelligentAudit(`
                <h3>Production Node Audit v1.4.1</h3>
                <p>ÆTHERIOS Node 0x88 is operating within peak institutional bounds. The <b>Spectral Coherence Bridge</b> confirms a Phase-Lock parity of 99.98%.</p>
                <ul>
                    <li>Resonance Rho: ${systemState.resonanceFactorRho.toFixed(6)} [STABLE]</li>
                    <li>Causal Drift: ${systemState.temporalCoherenceDrift.toFixed(8)}Ψ [NOMINAL]</li>
                    <li>Biometric Coherence: ${(systemState.biometricSync.coherence * 100).toFixed(2)}% [PHASE_LOCKED]</li>
                </ul>
                <p><i>Recommendations: Maintain current resonance baseline to prevent entropic noise in the Noetic Graph. Security Posture is currently QUANTUM_READY.</i></p>
            `);
        }
    }, [sophiaEngine, systemState, intelligentAudit, isSynthesizing, existingReport]);

    const auditData = useMemo(() => [
        { label: "Causal Parity", value: (systemState.performance.visualParity * 100).toFixed(4) + "%", status: (systemState.performance.visualParity > 0.95 ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Resonance Rho", value: systemState.resonanceFactorRho.toFixed(8), status: (systemState.resonanceFactorRho > 0.98 ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Temporal Lock", value: systemState.isPhaseLocked ? "LOCKED" : "ACQUIRING", status: (systemState.isPhaseLocked ? 'OPTIMAL' : 'DEVIATING') as any },
        { label: "Noetic Latency", value: (systemState.performance.logicalLatency * 1000).toFixed(2) + "µs", status: 'OPTIMAL' as any },
        { label: "Quantum Fidelity", value: (systemState.coherenceResonance.quantumCorrelation * 100).toFixed(1) + "%", status: 'OPTIMAL' as any },
        { label: "Aura Stability", value: (systemState.biometricSync.coherence * 100).toFixed(1) + "%", status: 'OPTIMAL' as any },
    ], [systemState]);

    return (
        <div className="w-full h-full bg-dark-surface border border-white/10 p-10 md:p-20 rounded-xl border-glow-pearl backdrop-blur-3xl flex flex-col overflow-hidden relative animate-fade-in shadow-[0_60px_150px_rgba(0,0,0,1)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[280px] text-white/[0.005] pointer-events-none select-none uppercase tracking-[0.5em] font-black">
                SOPHIA
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 z-10 border-b border-white/10 pb-12 gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-gold rounded-full shadow-[0_0_15px_#ffd700]" />
                        <h2 className="font-orbitron text-5xl md:text-6xl text-pearl text-glow-pearl tracking-tighter leading-none uppercase font-black">Coherence_Audit_Registry</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-10">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">Audit_Protocol</span>
                            <p className="font-mono text-xs text-gold font-bold">GOLD_TIER_MINERVA_v4.2</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">Status_Classification</span>
                            <p className="font-mono text-xs text-emerald-400 font-black">SOVEREIGN_STABLE // E_HYBRID_ACTIVE</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">Registry_ID</span>
                            <p className="font-mono text-xs text-pearl opacity-60">0x88-ARCHITECT-PRIME</p>
                        </div>
                    </div>
                </div>
                
                <div className="xl:text-right flex flex-col items-center xl:items-end gap-6">
                    <SovereignSeal />
                </div>
            </div>

            <div className="flex-1 z-10 overflow-y-auto pr-8 scrollbar-thin flex flex-col gap-10">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auditData.map((metric, i) => (
                        <AuditMetric key={i} {...metric} />
                    ))}
                </div>

                {/* Subsystem Audit & Heir Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-4">
                        <h4 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.4em] font-black border-l-2 border-violet-500 pl-4">Subsystem Lattice Status</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubsystemStatus 
                                label="Agentic Orchestrator" 
                                active={!!systemState.agenticOrchestrator} 
                                detail={systemState.agenticOrchestrator ? "Negotiation Matrix Active" : "Module Not Found"} 
                            />
                            <SubsystemStatus 
                                label="Estate Commander" 
                                active={Array.isArray(systemState.estateCommander)} 
                                detail={`${systemState.estateCommander.length} Twin Sites Linked`} 
                            />
                            <SubsystemStatus 
                                label="Vibrational Shield" 
                                active={!!systemState.vibrationalShield} 
                                detail={`Frequency Filter: ${systemState.vibrationalShield?.globalFrequency || 0} Hz`} 
                            />
                            <SubsystemStatus 
                                label="Heir Network" 
                                active={systemState.heirNetwork.length > 0} 
                                detail={`${systemState.heirNetwork.length} Sovereign Nodes Synced`} 
                            />
                        </div>
                    </div>
                    
                    <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
                        <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-widest font-black">Heir_Network_Preview</h4>
                        <div className="space-y-2">
                            {systemState.heirNetwork.map(heir => (
                                <div key={heir.id} className="flex justify-between items-center text-[9px] font-mono border-b border-white/5 pb-2">
                                    <span className="text-slate-400">{heir.name}</span>
                                    <span style={{ color: heir.color }}>{heir.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto text-[8px] font-mono text-slate-500">
                            Total_Seed_Allocation: $4.0M USD
                        </div>
                    </div>
                </div>

                <div className="bg-violet-950/10 border border-violet-500/20 p-12 rounded-sm flex flex-col gap-10 relative group overflow-hidden shadow-2xl border-l-8 border-l-violet-500/40">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-[150px] font-black tracking-tighter select-none pointer-events-none leading-none">PQC</div>
                    <div className="flex items-center justify-between border-b border-violet-500/20 pb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-sm bg-violet-900/40 border border-violet-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                                <span className="font-orbitron text-violet-400 text-3xl font-black">∑</span>
                            </div>
                            <div>
                                <h4 className="font-orbitron text-[16px] text-violet-300 uppercase tracking-[0.4em] font-black">Synthesized Heuristic Document</h4>
                                <p className="text-[9px] font-mono text-violet-500 uppercase tracking-widest mt-1">Generated via Gemini 3 Pro reasoning [32k budget]</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/20 px-4 py-1 rounded border border-emerald-500/20">VERIFIED</span>
                    </div>
                    
                    <div className="flex-1 min-h-[160px]">
                        {isSynthesizing ? (
                            <div className="flex flex-col items-center justify-center gap-8 py-16 animate-pulse">
                                <div className="w-12 h-12 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                                <div className="text-center space-y-2">
                                    <span className="font-mono text-[11px] text-violet-300 uppercase tracking-[0.5em] font-bold">Compressing Wavefunction...</span>
                                    <p className="text-[9px] font-mono text-slate-600 uppercase">Latency: {(systemState.performance.logicalLatency * 50).toFixed(4)}ms</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[14px] text-pearl/80 leading-relaxed font-minerva select-text antialiased space-y-6 audit-report-content max-w-4xl" dangerouslySetInnerHTML={{ __html: intelligentAudit || '' }} />
                        )}
                    </div>
                </div>

                <div className="mt-20 pt-20 border-t border-white/10 flex flex-col items-center gap-10 pb-24">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <span className="text-[10px] font-orbitron text-gold uppercase tracking-[0.8em] font-black opacity-30">Causal Verification Signature</span>
                        <h3 className="font-minerva italic text-6xl md:text-7xl text-pearl text-glow-pearl">Desmond McBride</h3>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.6em] font-bold">Principal Architect</span>
                            <div className="h-px w-10 bg-gold/30" />
                            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.6em] font-bold">ÆTHERIOS Global Synod</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1 h-1 rounded-full bg-gold animate-ping" />
                        <div className="w-1 h-1 rounded-full bg-gold animate-ping [animation-delay:0.2s]" />
                        <div className="w-1 h-1 rounded-full bg-gold animate-ping [animation-delay:0.4s]" />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[12px] font-mono text-slate-600 uppercase tracking-widest z-10 gap-8">
                <div className="flex gap-12">
                    <span className="flex items-center gap-4 group cursor-help"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" /> Status: <span className="text-pearl group-hover:text-emerald-400 transition-colors">OPTIMAL_LOCKED</span></span>
                    <span className="flex items-center gap-4 group cursor-help"><div className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_12px_cyan]" /> Network: <span className="text-pearl group-hover:text-cyan-400 transition-colors">L_BAND_UPLINK</span></span>
                </div>
                <div className="bg-black/60 px-8 py-4 rounded-full border border-white/10 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-pearl/80 font-black tracking-[0.1em] relative z-10">Sovereign_Node_Certificate :: V99.1_PROD_1.4.1</span>
                </div>
            </div>
            
            <style>{`
                .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 15px; text-transform: uppercase; margin-top: 2.5rem; margin-bottom: 1.25rem; border-bottom: 2px solid rgba(230, 199, 127, 0.2); padding-bottom: 0.75rem; font-weight: 900; letter-spacing: 0.3em; }
                .audit-report-content p { margin-bottom: 1.5rem; color: #f8f5ec; font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; line-height: 1.8; }
                .audit-report-content ul { margin-left: 2rem; list-style: none; margin-bottom: 2rem; }
                .audit-report-content li { margin-bottom: 0.75rem; position: relative; padding-left: 1.5rem; color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.05em; }
                .audit-report-content li::before { content: '◈'; color: var(--gold); position: absolute; left: 0; font-size: 10px; top: 2px; }
                .audit-report-content b { color: var(--gold); font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.2); }
                .audit-report-content i { color: #94a3b8; opacity: 0.8; }
            `}</style>
        </div>
    );
};
