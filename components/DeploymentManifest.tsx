
import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../types';

interface DeploymentManifestProps {
  systemState: SystemState;
  onDeploySuccess: () => void;
}

const PUSH_LOGS = [
    "INITIALIZING_VERCEL_CONDUIT [NODE_20_LTS]...",
    "CLONING_GITHUB_LATTICE [REF: MAIN]...",
    "VERIFYING_CAUSAL_INTEGRITY_HASH...",
    "COMPILING_MINERVA_SOPHIA_V1.3.1...",
    "INJECTING_SECRET_SHARDS [API_KEY, STRIPE_SK]...",
    "MAPPING_EDGE_FUNCTIONS_TO_REGIONS [GLOBAL]...",
    "OPTIMIZING_AETHER_ASSET_CDN...",
    "PROPAGATING_DNS_RECORDS [RESONANCE_PROD]...",
    "FINALIZING_DEPLOYMENT_ENCRYPTION...",
    "HANDSHAKE_COMPLETE: NODE_ONLINE_AT_THE_EDGE"
];

const ManifestItem: React.FC<{ label: string; status: 'LOCKED' | 'READY' | 'PENDING'; detail: string }> = ({ label, status, detail }) => (
    <div className="bg-black/40 border border-white/5 p-6 rounded flex items-center justify-between group hover:border-gold/30 transition-all duration-500">
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-[12px] font-minerva italic text-pearl/80 group-hover:text-pearl transition-colors">{detail}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-[9px] font-mono font-bold px-3 py-1 rounded border ${
                status === 'LOCKED' ? 'border-green-500 text-green-400 bg-green-950/20' : 
                status === 'READY' ? 'border-gold text-gold bg-gold/10' : 'border-slate-700 text-slate-500'
            }`}>
                {status}
            </span>
            <div className={`w-2 h-2 rounded-full ${status === 'LOCKED' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
        </div>
    </div>
);

export const DeploymentManifest: React.FC<DeploymentManifestProps> = ({ systemState, onDeploySuccess }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isPushing, setIsPushing] = useState(false);
    const [pushLogs, setPushLogs] = useState<string[]>([]);
    const [pushProgress, setPushProgress] = useState(0);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => prev < 100 ? prev + 1 : 100);
        }, 20);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [pushLogs]);

    const handleInitializePush = async () => {
        setIsPushing(true);
        setPushProgress(0);
        setPushLogs(["[SYSTEM] ESTABLISHING_GITHUB_VERCEL_PARITY..."]);

        for (let i = 0; i < PUSH_LOGS.length; i++) {
            await new Promise(r => setTimeout(r, 400 + Math.random() * 800));
            setPushLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${PUSH_LOGS[i]}`]);
            setPushProgress(((i + 1) / PUSH_LOGS.length) * 100);
        }

        await new Promise(r => setTimeout(r, 1500));
        setIsPushing(false);
        onDeploySuccess();
    };

    return (
        <div className="w-full h-full flex flex-col gap-10 animate-fade-in relative overflow-hidden pb-20">
            {/* Cinematic Push Animation Overlay */}
            {isPushing && (
                <div className="fixed inset-0 z-[2000] bg-[#020202] backdrop-blur-3xl flex flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.3)_0%,transparent_70%)]" />
                    <div className="max-w-4xl w-full flex flex-col gap-10 animate-fade-in relative z-10">
                        <div className="flex justify-between items-end border-b border-white/10 pb-8">
                            <div>
                                <h3 className="font-orbitron text-3xl text-pearl uppercase tracking-tighter font-bold text-glow-pearl">Vercel Deployment Chain</h3>
                                <p className="text-gold font-mono text-[10px] uppercase tracking-[0.5em] mt-3 animate-pulse">Status: Synchronizing_Causal_Nodes_to_Edge</p>
                            </div>
                            <div className="text-right">
                                <span className="font-orbitron text-5xl text-pearl font-bold drop-shadow-[0_0_20px_white]">{pushProgress.toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-violet-600 to-gold transition-all duration-300 shadow-[0_0_30px_rgba(230,199,127,0.5)]"
                                style={{ width: `${pushProgress}%` }}
                            />
                        </div>

                        <div className="bg-[#050505] border border-white/10 p-10 rounded-sm h-[450px] overflow-y-auto font-mono text-[12px] text-slate-400 scrollbar-thin shadow-2xl relative group">
                             <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl font-bold uppercase tracking-widest">PUSH</div>
                             {pushLogs.map((log, i) => (
                                 <div key={i} className="mb-3 animate-fade-in flex gap-6 group-hover:text-slate-200 transition-colors">
                                     <span className="text-slate-800 font-bold">{(i * 128).toString(16).padStart(4, '0')}</span>
                                     <span className={log.includes('SECRET') ? 'text-cyan-400 font-bold' : log.includes('COMPLETE') ? 'text-gold' : ''}>{log}</span>
                                 </div>
                             ))}
                             {pushProgress < 100 && <div className="w-2 h-4 bg-gold animate-blink mt-2" />}
                             <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 border-b border-white/10 pb-10 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-gold/5 border border-gold/40 flex items-center justify-center font-orbitron text-gold text-3xl animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.1)]">!</div>
                        <div>
                            <h2 className="font-orbitron text-5xl text-pearl tracking-tighter uppercase font-extrabold text-glow-pearl">Vercel Readiness Manifest</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[11px] mt-3 font-bold">Continuous Integration Protocol // Production_Lock v1.3.1</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-6 py-3 rounded-full">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                         <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Git_Hook: CONNECTED</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 min-h-0 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-6 scrollbar-thin">
                    <ManifestItem 
                        label="Source_Control_GitHub" 
                        status="LOCKED" 
                        detail="Repository synchronization verified. Vercel Webhook active for 'main' branch triggers." 
                    />
                    <ManifestItem 
                        label="Runtime_Environment_Node" 
                        status="READY" 
                        detail="Node.js 20.x runtime mapping complete. All dependency trees pruned and optimized." 
                    />
                    <ManifestItem 
                        label="Edge_Gateway_Causal" 
                        status="LOCKED" 
                        detail="vercel.json security headers and sub-route rewrites established for high-resonance delivery." 
                    />
                    <ManifestItem 
                        label="Secret_Shard_Injection" 
                        status="PENDING" 
                        detail="Awaiting final handshake to inject API_KEY and STRIPE_SK into the production cluster." 
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-dark-surface/80 border border-white/10 p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-7xl uppercase font-extrabold select-none pointer-events-none">EDGE</div>
                        <h4 className="font-orbitron text-[12px] text-gold uppercase tracking-[0.4em] font-bold border-b border-gold/20 pb-4">Architectural Logic</h4>
                        
                        <div className="space-y-6 font-mono text-[11px]">
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-500">PLATFORM</span>
                                <span className="text-green-500 font-bold">VERCEL_EDGE_PRO</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-500">PIPELINE</span>
                                <span className="text-pearl">GITHUB_CI_CD</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-500">VERSION</span>
                                <span className="text-gold font-bold">1.3.1_RADIANT</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-500">BUILD_STATE</span>
                                <span className="text-pearl">OPTIMIZED_CHUNKED</span>
                            </div>
                        </div>

                        <div className="bg-black/40 p-5 rounded italic text-[11px] text-slate-400 leading-relaxed font-minerva border border-white/5">
                            "The Edge deployment ensures that Minerva's logic is distributed across the planetary lattice, reducing synaptic latency to near-zero."
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-8 shadow-inner">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(230, 199, 127, 0.1)" strokeWidth="0.5" />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke="var(--gold)" 
                                    strokeWidth="3" 
                                    strokeDasharray="301.44"
                                    strokeDashoffset={301.44 - (loadingProgress / 100) * 301.44}
                                    className="transition-all duration-100 ease-linear"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))' }}
                                />
                            </svg>
                            <span className="absolute font-orbitron text-3xl text-pearl font-bold">{loadingProgress}%</span>
                        </div>
                        <div className="space-y-2">
                             <p className="font-mono text-[10px] text-gold uppercase tracking-[0.5em] font-bold">Handshake_Parity</p>
                             <p className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Local_to_Cloud_Resonance</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-10 px-12 bg-gold/5 border border-gold/40 rounded-xl flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-l-8">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <span className="text-[13px] text-gold font-bold uppercase tracking-[0.5em]">Release Authorization Protocol</span>
                    <p className="text-[16px] font-minerva italic text-pearl/80">"Establishing the ÆTHERIOS lattice as a global production authority."</p>
                </div>
                <button 
                    className="px-20 py-6 bg-gold text-dark-bg font-orbitron text-[14px] font-extrabold uppercase tracking-[0.8em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,215,0,0.3)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                    onClick={handleInitializePush}
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    Push_to_Production
                </button>
            </div>
        </div>
    );
};
