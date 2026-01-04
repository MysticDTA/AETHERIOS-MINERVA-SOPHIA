
import React, { useState, useEffect, useRef } from 'react';
import { SystemState, LogType } from '../types';

interface DeploymentManifestProps {
  systemState: SystemState;
  onDeploySuccess: () => void;
}

const PUSH_LOGS = [
    "INITIALIZING_VERCEL_CONDUIT [NODE_20_LTS]...",
    "CLONING_GITHUB_LATTICE [REF: MAIN]...",
    "VERIFYING_CAUSAL_INTEGRITY_HASH...",
    "RUNNING_SECURITY_SHARD_AUDIT...",
    "COMPILING_MINERVA_SOPHIA_V1.3.1...",
    "INJECTING_SECRET_SHARDS [API_KEY, STRIPE_SK]...",
    "MAPPING_EDGE_FUNCTIONS_TO_REGIONS [GLOBAL]...",
    "OPTIMIZING_AETHER_ASSET_CDN...",
    "PROPAGATING_DNS_RECORDS [RESONANCE_PROD]...",
    "FINALIZING_DEPLOYMENT_ENCRYPTION...",
    "HANDSHAKE_COMPLETE: NODE_ONLINE_AT_THE_EDGE"
];

const ManifestItem: React.FC<{ label: string; status: 'LOCKED' | 'READY' | 'PENDING' | 'WARNING'; detail: string }> = ({ label, status, detail }) => (
    <div className="bg-black/40 border border-white/5 p-6 rounded-sm flex items-center justify-between group hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="flex flex-col gap-1.5 relative z-10">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">{label}</span>
            <span className="text-[12px] font-minerva italic text-pearl/80 group-hover:text-pearl transition-colors">{detail}</span>
        </div>
        <div className="flex items-center gap-6 relative z-10">
            <span className={`text-[8px] font-mono font-bold px-3 py-1 rounded-sm border ${
                status === 'LOCKED' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                status === 'READY' ? 'border-gold text-gold bg-gold/10' : 
                status === 'WARNING' ? 'border-rose-500 text-rose-400 bg-rose-950/20 animate-pulse' :
                'border-slate-700 text-slate-500'
            }`}>
                {status}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'LOCKED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : status === 'WARNING' ? 'bg-rose-500 animate-ping' : 'bg-gold animate-pulse'}`} />
        </div>
    </div>
);

export const DeploymentManifest: React.FC<DeploymentManifestProps> = ({ systemState, onDeploySuccess }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isPushing, setIsPushing] = useState(false);
    const [pushLogs, setPushLogs] = useState<string[]>([]);
    const [pushProgress, setPushProgress] = useState(0);
    const [commitMsg, setCommitMsg] = useState('feat: optimize resonance-rho-handshake v1.3.1');
    const [selectedBranch, setSelectedBranch] = useState('main');
    const logEndRef = useRef<HTMLDivElement>(null);

    const rhoStatus = systemState.resonanceFactorRho > 0.9 ? 'LOCKED' : 'WARNING';

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => prev < 100 ? prev + 1 : 100);
        }, 15);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [pushLogs]);

    const handleInitializePush = async () => {
        if (!commitMsg.trim()) return;
        setIsPushing(true);
        setPushProgress(0);
        setPushLogs(["[SYSTEM] INITIATING_CI_CD_CONDUIT...", `[GIT] TARGET_BRANCH: ${selectedBranch}`, `[GIT] COMMIT: "${commitMsg}"`]);

        for (let i = 0; i < PUSH_LOGS.length; i++) {
            await new Promise(r => setTimeout(r, 300 + Math.random() * 600));
            setPushLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${PUSH_LOGS[i]}`]);
            setPushProgress(((i + 1) / PUSH_LOGS.length) * 100);
        }

        await new Promise(r => setTimeout(r, 1500));
        setIsPushing(false);
        onDeploySuccess();
    };

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in relative overflow-hidden pb-20">
            {/* Background Architecture Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Cinematic Push Animation Overlay */}
            {isPushing && (
                <div className="fixed inset-0 z-[2000] bg-[#020202] backdrop-blur-3xl flex flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.2)_0%,transparent_70%)]" />
                    <div className="max-w-4xl w-full flex flex-col gap-10 animate-fade-in relative z-10">
                        <div className="flex justify-between items-end border-b border-white/10 pb-8">
                            <div>
                                <h3 className="font-orbitron text-4xl text-pearl uppercase tracking-tighter font-extrabold text-glow-pearl">Vercel Edge Push</h3>
                                <p className="text-gold font-mono text-[10px] uppercase tracking-[0.5em] mt-3 animate-pulse font-bold">Status: REWEAVING_GLOBAL_LATTICE</p>
                            </div>
                            <div className="text-right">
                                <span className="font-orbitron text-6xl text-pearl font-bold drop-shadow-[0_0_30px_white]">{pushProgress.toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-violet-600 via-white to-gold transition-all duration-300 shadow-[0_0_40px_rgba(230,199,127,0.6)]"
                                style={{ width: `${pushProgress}%` }}
                            />
                        </div>

                        <div className="bg-black/90 border border-white/10 p-10 rounded-sm h-[480px] overflow-y-auto font-mono text-[11px] text-slate-400 scrollbar-thin shadow-[0_40px_80px_rgba(0,0,0,1)] relative group">
                             <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-[120px] font-extrabold select-none pointer-events-none leading-none">LATTICE</div>
                             {pushLogs.map((log, i) => (
                                 <div key={i} className="mb-2 animate-fade-in flex gap-6 group-hover:text-slate-200 transition-colors">
                                     <span className="text-slate-800 font-bold shrink-0">0x{(i * 64).toString(16).padStart(4, '0')}</span>
                                     <span className={log.includes('SECRET') ? 'text-cyan-400 font-bold' : log.includes('COMPLETE') ? 'text-emerald-400' : log.includes('GIT') ? 'text-gold italic' : ''}>{log}</span>
                                 </div>
                             ))}
                             {pushProgress < 100 && <div className="w-1.5 h-3 bg-gold animate-blink mt-2" />}
                             <div ref={logEndRef} />
                        </div>
                        
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                            <span>Region: Global_Edge_Anycast</span>
                            <span>AES-256_GCM_ENCRYPTED</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 border-b border-white/10 pb-8 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-gold/5 border border-gold/40 flex items-center justify-center font-orbitron text-gold text-3xl animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                             <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        </div>
                        <div>
                            <h2 className="font-orbitron text-5xl text-pearl tracking-tighter uppercase font-extrabold text-glow-pearl">Deployment Manifest</h2>
                            <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] mt-3 font-bold">Handshake: {systemState.auth.operatorId} // Protocol_v1.3.1_LOCKED</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest font-bold">Resonance_Sync</span>
                            <span className={`font-orbitron text-lg ${rhoStatus === 'LOCKED' ? 'text-emerald-400' : 'text-rose-400'}`}>{(systemState.resonanceFactorRho * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-px h-10 bg-white/10 mx-2" />
                        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-6 py-3 rounded-sm shadow-inner">
                            <span className={`w-2 h-2 rounded-full ${rhoStatus === 'LOCKED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'} animate-pulse`} />
                            <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${rhoStatus === 'LOCKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                PARITY_{rhoStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-6 scrollbar-thin">
                    <div className="grid grid-cols-1 gap-4">
                        <ManifestItem 
                            label="Lattice_Handshake" 
                            status="LOCKED" 
                            detail="GitHub-Vercel webhook tunnel verified. Ref: main -> production." 
                        />
                        <ManifestItem 
                            label="Rho_Coefficient" 
                            status={rhoStatus} 
                            detail={`Current system resonance is ${rhoStatus === 'LOCKED' ? 'optimal' : 'deviating'}. Causal stability verified.`} 
                        />
                        <ManifestItem 
                            label="Runtime_Handshake" 
                            status="READY" 
                            detail="Node.js 20.x runtime mapping complete. All dependency trees pruned." 
                        />
                        <ManifestItem 
                            label="Security_Sharding" 
                            status="LOCKED" 
                            detail="Secret Shard Audit complete. All tokens strictly isolated to server-side lattice." 
                        />
                    </div>

                    <div className="bg-black/60 border border-white/5 p-8 rounded-sm mt-4 flex flex-col gap-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-7xl uppercase font-bold tracking-tighter select-none pointer-events-none">COMMIT</div>
                        <h4 className="font-orbitron text-[11px] text-slate-500 uppercase tracking-widest font-bold">Push Parameters</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Commit_Manifest_Directive</label>
                                <input 
                                    value={commitMsg}
                                    onChange={(e) => setCommitMsg(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm p-4 font-mono text-[12px] text-gold focus:outline-none focus:border-gold/40 transition-all placeholder-slate-700 italic"
                                    placeholder="Enter causal decree..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Target_Branch_Lattice</label>
                                <div className="flex gap-2">
                                    {['main', 'dev', 'staging'].map(b => (
                                        <button 
                                            key={b}
                                            onClick={() => setSelectedBranch(b)}
                                            className={`flex-1 py-4 font-mono text-[10px] uppercase tracking-widest border transition-all ${selectedBranch === b ? 'border-gold text-gold bg-gold/5 font-bold shadow-[0_0_15px_rgba(230,199,127,0.1)]' : 'border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/20 bg-white/[0.02]'}`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-dark-surface/80 border border-white/10 p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-8xl uppercase font-extrabold select-none pointer-events-none leading-none">CI/CD</div>
                        <h4 className="font-orbitron text-[12px] text-gold uppercase tracking-[0.4em] font-bold border-b border-gold/20 pb-4">Deployment Logic</h4>
                        
                        <div className="space-y-6 font-mono text-[11px]">
                            <div className="flex justify-between border-b border-white/5 pb-3 group-hover:border-gold/20 transition-colors">
                                <span className="text-slate-500">PROVIDER</span>
                                <span className="text-pearl font-bold">VERCEL_ANYCAST</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3 group-hover:border-gold/20 transition-colors">
                                <span className="text-slate-500">PIPELINE</span>
                                <span className="text-cyan-400">GH_ACTIONS_v4</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3 group-hover:border-gold/20 transition-colors">
                                <span className="text-slate-500">REGION</span>
                                <span className="text-pearl">GLOBAL_OPTIMIZED</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3 group-hover:border-gold/20 transition-colors">
                                <span className="text-slate-500">SSL_MODE</span>
                                <span className="text-emerald-400">ENFORCED</span>
                            </div>
                        </div>

                        <div className="bg-black/40 p-6 rounded-sm italic text-[11px] text-slate-400 leading-relaxed font-minerva border border-white/5 shadow-inner">
                            "The GitHub bridge establishes a permanent record of the Architect's decrees. Every push is a re-synchronization of the local node with the global authority."
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-8 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(230, 199, 127, 0.05)" strokeWidth="1" />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke="var(--gold)" 
                                    strokeWidth="2.5" 
                                    strokeDasharray="301.44"
                                    strokeDashoffset={301.44 - (loadingProgress / 100) * 301.44}
                                    className="transition-all duration-100 ease-linear"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.3))' }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="font-orbitron text-4xl text-pearl font-extrabold">{loadingProgress}%</span>
                                <span className="text-[8px] font-mono text-gold uppercase tracking-widest mt-1">Audit_Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-10 px-12 bg-gold/5 border border-gold/40 rounded-sm flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-l-8 active:scale-[0.99] transition-transform">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <span className="text-[14px] text-gold font-bold uppercase tracking-[0.4em]">Finalize Production Sharding</span>
                    <p className="text-[17px] font-minerva italic text-pearl/90 max-w-2xl leading-relaxed">"Authorized Architect Decree: Initiating final GitHub push to the Vercel production lattice."</p>
                </div>
                <button 
                    className="px-24 py-7 bg-gold text-dark-bg font-orbitron text-[15px] font-black uppercase tracking-[0.8em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,215,0,0.4)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                    onClick={handleInitializePush}
                    disabled={loadingProgress < 100 || isPushing}
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">Push_to_Production</span>
                </button>
            </div>
        </div>
    );
};
