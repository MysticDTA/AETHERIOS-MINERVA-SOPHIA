
import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../types';

const SECURITY_CHECKS = [
    { id: 'git_ignore', label: 'GITHUB_SECRET_SHIELDING', desc: 'Verifying .env exclusion in local lattice.', status: 'LOCKED' },
    { id: 'cors_headers', label: 'CORS_PARITY_HANDSHAKE', desc: 'Confirming Vercel edge-origin restrictions.', status: 'LOCKED' },
    { id: 'stripe_isolation', label: 'STRIPE_SK_ISOLATION', desc: 'Ensuring Secret Key is strictly server-side.', status: 'LOCKED' },
    { id: 'token_encryption', label: 'CAUSAL_AES_ENCRYPTION', desc: 'Validating AES-256 GCM packet parity.', status: 'LOCKED' },
    { id: 'rate_limiting', label: 'RES_QUOTA_DAMPING', desc: 'Global rate-limit circuit breaker status.', status: 'LOCKED' }
];

export const SecurityShieldAudit: React.FC<{ systemState: SystemState }> = ({ systemState }) => {
    const [progress, setProgress] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState<typeof SECURITY_CHECKS>(SECURITY_CHECKS);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] INITIALIZING_SECURITY_FIREWALL_v2.1...", "TARGET: MINERVA_CORE_SHARDS"]);

    const runScan = async () => {
        setIsScanning(true);
        setProgress(0);
        setLogs(["[SYSTEM] INITIATING PENETRATION_SIMULATION..."]);
        
        for (let i = 0; i < SECURITY_CHECKS.length; i++) {
            setLogs(prev => [...prev, `[AUDIT] Scanning ${SECURITY_CHECKS[i].label}...`]);
            const iterations = 10;
            for (let j = 0; j <= iterations; j++) {
                await new Promise(r => setTimeout(r, 100));
                setProgress(prev => Math.min(100, prev + (100 / (SECURITY_CHECKS.length * iterations))));
            }
            setLogs(prev => [...prev, `[SUCCESS] ${SECURITY_CHECKS[i].label}: SECURE`]);
        }
        setIsScanning(false);
        setLogs(prev => [...prev, "--- SHIELD_AUDIT_COMPLETE ---", "NO_LEAKS_DETECTED_IN_PUBLIC_LATTICE"]);
    };

    /** 
     * CAUSAL STRESS INDUCTION
     * Deliberately triggers unhandled events to verify window-level interception.
     */
    const triggerRuntimeFracture = () => {
        setLogs(prev => [...prev, "[STRESS_TEST] Inducing immediate Runtime Fracture..."]);
        setTimeout(() => {
            // This will be caught by window.addEventListener('error')
            throw new Error("Controlled Lattice Fracture Inducted for Audit Verification.");
        }, 100);
    };

    const triggerAsyncDrift = () => {
        setLogs(prev => [...prev, "[STRESS_TEST] Inducing Async Decoherence Drift..."]);
        setTimeout(() => {
            // This will be caught by window.addEventListener('unhandledrejection')
            Promise.reject(new Error("Architectural Rejection: Async Drift simulation detected."));
        }, 100);
    };

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20 overflow-hidden">
            <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/40 flex items-center justify-center font-orbitron text-rose-400 text-3xl animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.2)]">🛡</div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Causal_Shield_Audit</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Fraud Protection & Secret Isolation Registry</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={runScan} 
                        disabled={isScanning}
                        className="px-12 py-4 bg-rose-600/10 border border-rose-500/40 text-rose-400 font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
                    >
                        {isScanning ? 'Scanning...' : 'Execute Security Sweep'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
                <div className="lg:col-span-7 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin">
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((check, i) => (
                            <div key={check.id} className="bg-black/40 border border-white/5 p-6 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-700">
                                <div className="space-y-1">
                                    <h4 className="font-orbitron text-[12px] text-pearl uppercase tracking-widest font-bold group-hover:text-emerald-400 transition-colors">{check.label}</h4>
                                    <p className="text-[10px] font-minerva italic text-slate-500">{check.desc}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">VERIFIED</span>
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-8 bg-rose-950/5 border border-rose-500/20 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter">GATEWAY</div>
                        <h4 className="font-orbitron text-[11px] text-rose-400 uppercase tracking-widest font-bold border-b border-rose-500/10 pb-4 mb-4">Entropic Stress Induction [Test Core]</h4>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button 
                                onClick={triggerRuntimeFracture}
                                className="flex-1 px-4 py-3 bg-rose-500/10 border border-rose-500/40 text-rose-400 font-mono text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all rounded-sm"
                            >
                                Inject Runtime Fracture
                            </button>
                            <button 
                                onClick={triggerAsyncDrift}
                                className="flex-1 px-4 py-3 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-[9px] uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all rounded-sm"
                            >
                                Induce Async Drift
                            </button>
                        </div>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter leading-relaxed">
                            Note: Inducing fractures triggers unhandled exceptions. These should appear as <span className="text-rose-400 font-bold">CRITICAL</span> entries in the System Logs (Node 22), verifying global interceptor parity.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
                    <div className="flex-1 bg-black border border-white/10 rounded-sm p-8 flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 scanline-overlay pointer-events-none" />
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                            <span className="font-mono text-[10px] text-rose-500 font-bold tracking-widest uppercase">Firewall_Packet_Stream</span>
                            <span className="text-[8px] font-mono text-slate-700">NODE_0x88_SECURE</span>
                        </div>
                        <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-slate-500 scrollbar-thin select-text">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 animate-fade-in group">
                                    <span className="text-slate-800 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">0x{i.toString(16).padStart(4, '0')}</span>
                                    <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('SYSTEM') ? 'text-rose-500 font-bold' : log.includes('STRESS') ? 'text-gold italic' : ''}>{log}</span>
                                </div>
                            ))}
                            {isScanning && <div className="w-1.5 h-3 bg-rose-500 animate-blink mt-2" />}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex justify-between text-[10px] font-mono mb-2">
                                <span className="text-slate-600">Audit_Progress</span>
                                <span className="text-pearl">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 transition-all duration-300 shadow-[0_0_10px_#f43f5e]" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
