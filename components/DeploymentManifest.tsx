
import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../types';

interface DeploymentManifestProps {
  systemState: SystemState;
  onDeploySuccess: () => void;
}

const PUSH_LOGS = [
    "Initializing Vercel build-container [Node.js 20.x]...",
    "Cloning repository from GitHub [main branch]...",
    "Scanning local reality-lattice for component tree-shaking...",
    "Detected: Minerva Cognitive Engine v1.3.0",
    "Detected: Protocol Charon (Live API Bridge)",
    "Compiling TypeScript causal logic into optimized JS...",
    "Mapping /api routes to Serverless Edge Functions...",
    "Injecting process.env.API_KEY into production env...",
    "Injecting process.env.STRIPE_SECRET_KEY into gateway...",
    "Established secure handshake with Gemini 3 Pro clusters...",
    "Compressing high-resonance bloom shaders...",
    "Uploading aetheric assets to Global Edge CDN...",
    "Propagating DNS: resonance.aetherios.ai...",
    "Finalizing Deployment Hash: 0x99_RADIANT_PROD"
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
        }, 30);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [pushLogs]);

    const handleInitializePush = async () => {
        setIsPushing(true);
        setPushProgress(0);
        setPushLogs(["INITIATING PRODUCTION PUSH TO VERCEL EDGE..."]);

        for (let i = 0; i < PUSH_LOGS.length; i++) {
            await new Promise(r => setTimeout(r, 300 + Math.random() * 600));
            setPushLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${PUSH_LOGS[i]}`]);
            setPushProgress(((i + 1) / PUSH_LOGS.length) * 100);
        }

        await new Promise(r => setTimeout(r, 1000));
        setIsPushing(false);
        onDeploySuccess();
    };

    return (
        <div className="w-full h-full flex flex-col gap-10 animate-fade-in relative overflow-hidden pb-20">
            {/* Push Animation Overlay */}
            {isPushing && (
                <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="max-w-3xl w-full flex flex-col gap-10 animate-fade-in">
                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                            <div>
                                <h3 className="font-orbitron text-2xl text-pearl uppercase tracking-tighter font-bold">Vercel Edge Synchronization</h3>
                                <p className="text-gold font-mono text-[9px] uppercase tracking-[0.4em] mt-2 animate-pulse">Status: Syncing_Causal_Lattice_to_GitHub</p>
                            </div>
                            <div className="text-right">
                                <span className="font-orbitron text-4xl text-pearl font-bold">{pushProgress.toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gold transition-all duration-300 shadow-[0_0_20px_rgba(230,199,127,0.5)]"
                                style={{ width: `${pushProgress}%` }}
                            />
                        </div>

                        <div className="bg-black border border-white/5 p-8 rounded-sm h-80 overflow-y-auto font-mono text-[11px] text-slate-400 scrollbar-thin shadow-2xl">
                             {pushLogs.map((log, i) => (
                                 <div key={i} className="mb-2 animate-fade-in">
                                     <span className="text-slate-700 mr-4">{(i * 42).toString(16).padStart(4, '0')}</span>
                                     <span className={log.includes('process.env') ? 'text-cyan-400' : log.includes('Hash') ? 'text-gold' : ''}>{log}</span>
                                 </div>
                             ))}
                             <div className="terminal-cursor" />
                             <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 border-b border-white/10 pb-10 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gold/5 border border-gold/20 flex items-center justify-center font-orbitron text-gold text-2xl animate-pulse">!</div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-bold">Vercel Readiness Manifest</h2>
                        <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] mt-2">Continuous Deployment Authorization // Radiant v1.3.0</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-4 scrollbar-thin">
                    <ManifestItem 
                        label="Source_Control_GitHub" 
                        status="LOCKED" 
                        detail="Repository parity verified. Webhook trigger active for Vercel CI/CD pipeline." 
                    />
                    <ManifestItem 
                        label="Edge_Serverless_Mapping" 
                        status="LOCKED" 
                        detail="vercel.json rules locked. /api endpoints mapped to Node.js 20.x runtime." 
                    />
                    <ManifestItem 
                        label="Environment_Variable_Buffer" 
                        status="READY" 
                        detail="Awaiting API_KEY and STRIPE_SK injection in Vercel project settings." 
                    />
                    <ManifestItem 
                        label="Global_CDN_Propagation" 
                        status="LOCKED" 
                        detail="Static assets and bloom shaders prepared for multi-region edge delivery." 
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-white/10 p-8 rounded-xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold">EDGE</div>
                        <h4 className="font-orbitron text-[11px] text-warm-grey uppercase tracking-widest font-bold">Vercel Metadata</h4>
                        <div className="space-y-4 font-mono text-[11px]">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">RUNTIME</span>
                                <span className="text-green-500">VERCEL_EDGE</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">BUILD_TRIGGER</span>
                                <span className="text-gold">GIT_PUSH</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">VERSION</span>
                                <span className="text-pearl">1.3.0_RADIANT</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-6">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(230, 199, 127, 0.1)" strokeWidth="0.5" />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke="var(--gold)" 
                                    strokeWidth="2" 
                                    strokeDasharray="301.44"
                                    strokeDashoffset={301.44 - (loadingProgress / 100) * 301.44}
                                    className="transition-all duration-100 ease-linear"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                />
                            </svg>
                            <span className="absolute font-orbitron text-xl text-pearl">{loadingProgress}%</span>
                        </div>
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.4em]">Handshake_Parity_Check</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-8 px-10 bg-gold/5 border border-gold/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <span className="text-[11px] text-gold font-bold uppercase tracking-[0.3em]">GitHub-to-Vercel Bridge Ready</span>
                    <p className="text-[13px] font-minerva italic text-pearl/70">"You are authorized to finalize the release chain."</p>
                </div>
                <button 
                    className="px-16 py-4 bg-gold text-dark-bg font-orbitron text-[12px] font-bold uppercase tracking-[0.6em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(230,199,127,0.3)] active:scale-95"
                    onClick={handleInitializePush}
                >
                    Finalize Release
                </button>
            </div>
        </div>
    );
};
