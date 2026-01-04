
import React, { useState, useEffect } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { Tooltip } from './Tooltip';

interface SystemSummaryProps {
  systemState: SystemState;
  sophiaEngine?: SophiaEngineCore | null;
}

const UpgradeVector: React.FC<{ title: string; current: string; optimal: string; difficulty: 'LOW' | 'MED' | 'HIGH' }> = ({ title, current, optimal, difficulty }) => (
    <div className="bg-white/[0.03] border border-white/5 p-4 rounded group hover:border-gold/40 transition-all duration-500">
        <div className="flex justify-between items-center mb-3">
            <h5 className="font-orbitron text-[10px] text-pearl uppercase tracking-widest">{title}</h5>
            <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${
                difficulty === 'LOW' ? 'border-cyan-500 text-cyan-400' : 
                difficulty === 'MED' ? 'border-gold text-gold' : 'border-rose-500 text-rose-400'
            }`}>
                UPGRADE_{difficulty}
            </span>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-mono">
                <span className="text-slate-500">CURRENT:</span>
                <span className="text-slate-300">{current}</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono">
                <span className="text-gold font-bold">OPTIMAL:</span>
                <span className="text-pearl">{optimal}</span>
            </div>
        </div>
        <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gold/20 group-hover:bg-gold/60 transition-all duration-700" style={{ width: '40%' }} />
        </div>
    </div>
);

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[180px] text-white/[0.008] pointer-events-none select-none uppercase tracking-[0.2em]">
                AUDITED
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 z-10 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h2 className="font-orbitron text-4xl text-pearl text-glow-pearl tracking-tighter leading-none mb-3 uppercase">Status_Registry_Audit</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Auth: <span className="text-gold">SOVEREIGN_ARCHITECT</span></p>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <p className="font-mono text-[10px] text-slate-500 tracking-[0.4em] uppercase">Log_Index: {timestamp}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="flex items-center gap-5 px-6 py-4 bg-gold/5 border border-gold/40 rounded-sm shadow-[0_0_30px_rgba(230,199,127,0.15)] animate-fade-in">
                        <svg className="w-8 h-8 text-gold drop-shadow-[0_0_8px_rgba(230,199,127,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-[11px] text-gold font-bold uppercase tracking-[0.25em]">Causal Parity Locked</p>
                            <p className="text-[9px] text-gold/60 font-mono tracking-widest mt-1">SOPHIA_V4.1 // GRADE_S</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 z-10 overflow-y-auto pr-4 scrollbar-thin flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <IntegrityCard 
                        title="Cognitive Core"
                        status="EXCELLENT"
                        integrity={0.999}
                        color="#f8f5ec"
                        details={[
                            `Reasoning: 32,768 Budget Locked`,
                            `Logic Latency: ${systemState.performance.logicalLatency.toFixed(6)}ms`,
                            `Heuristic Parity: NOMINAL`
                        ]}
                    />
                    <IntegrityCard 
                        title="Resonance Array"
                        status="PEAK_ALIGN"
                        integrity={systemState.resonanceFactorRho}
                        color="#e6c77f"
                        details={[
                            `Rho Factor: ${systemState.resonanceFactorRho.toFixed(5)}`,
                            `Intercept: 1.617 GHz L-Band`,
                            `Spectrum Stability: 99.9%`
                        ]}
                    />
                    <IntegrityCard 
                        title="Vocal Bridge"
                        status="STABLE_LINK"
                        integrity={systemState.biometricSync.coherence}
                        color="#a78bfa"
                        details={[
                            `Sample Rate: 24kHz Raw PCM`,
                            `Jitter Buffer: 0.0004ms`,
                            `Auth Node: GRADE_07`
                        ]}
                    />
                </div>

                <div className="bg-violet-950/10 border border-violet-500/20 p-8 rounded-sm flex flex-col gap-6 relative group overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-6xl uppercase font-bold tracking-tighter">SOPHIA_AUDIT</div>
                    <div className="flex items-center gap-4 border-b border-violet-500/20 pb-4">
                        <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa] animate-pulse" />
                        <h4 className="font-orbitron text-[11px] text-violet-300 uppercase tracking-[0.4em] font-bold">Synthesized Heuristic Conclusion</h4>
                    </div>
                    
                    <div className="flex-1">
                        {isSynthesizing ? (
                            <div className="flex flex-col items-center gap-4 animate-pulse opacity-40 py-10">
                                <div className="w-8 h-8 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                                <span className="font-mono text-[10px] text-violet-300 uppercase tracking-widest">Accessing 32k thinking budget...</span>
                            </div>
                        ) : (
                            <p className="text-base italic text-pearl/90 leading-relaxed font-minerva select-text">
                                "{intelligentAudit || 'Awaiting cognitive stream synchronization...'}"
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.5em] font-bold border-b border-gold/10 pb-4">Optimization Roadmap :: Required Updates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <UpgradeVector 
                            title="Memory_Architecture" 
                            current="Local_Storage_JSON" 
                            optimal="Vector_DB_Postgres" 
                            difficulty="MED" 
                        />
                        <UpgradeVector 
                            title="Biometric_Sensor" 
                            current="Simulated_HRV" 
                            optimal="Eulerian_Optical_Magnification" 
                            difficulty="HIGH" 
                        />
                        <UpgradeVector 
                            title="Vocal_Protocol" 
                            current="Single_Speaker" 
                            optimal="Multi-Speaker_Dialectics" 
                            difficulty="LOW" 
                        />
                        <UpgradeVector 
                            title="Telemetry_Intercept" 
                            current="5m_Interval_Poll" 
                            optimal="Vercel_Cron_Edge_Sync" 
                            difficulty="MED" 
                        />
                    </div>
                </div>
                
                {/* ARCHITECT SIGNATURE OF PARITY */}
                <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-6 pb-12">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] font-orbitron text-gold uppercase tracking-[0.5em] font-bold opacity-40">Architectural Approval Signature</span>
                        <h3 className="font-minerva italic text-3xl text-pearl text-glow-pearl">Desmond McBride</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Principal Design Lead // ÆTHERIOS Global</p>
                    </div>
                    <div className="bg-gold/5 border border-gold/20 px-8 py-4 rounded-sm flex flex-col items-center gap-2 group hover:border-gold/40 transition-all cursor-pointer shadow-lg">
                        <span className="text-[8px] font-mono text-gold/60 uppercase font-bold tracking-widest">Secure Purchasing Uplink</span>
                        <a href="mailto:divinetruthascension@gmail.com" className="font-mono text-[12px] text-pearl group-hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">divinetruthascension@gmail.com</a>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest z-10 gap-4">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" /> Resonance: LOCKED</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_gold]" /> Identity: VERIFIED</span>
                </div>
                <div className="flex items-center gap-3 bg-black/30 px-5 py-2 rounded-full border border-white/10">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-pearl/80">Sovereign Node Certification: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};
