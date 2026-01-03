import React, { useState, useEffect } from 'react';
import { SystemState } from '../types';

interface DeploymentManifestProps {
  systemState: SystemState;
}

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

export const DeploymentManifest: React.FC<DeploymentManifestProps> = ({ systemState }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => prev < 100 ? prev + 1 : 100);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-10 animate-fade-in relative overflow-hidden pb-20">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-10 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gold/5 border border-gold/20 flex items-center justify-center font-orbitron text-gold text-2xl animate-pulse">!</div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-bold">Deployment Manifest</h2>
                        <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] mt-2">Final Pre-Flight Authorization // Node_SFO_1</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-4 scrollbar-thin">
                    <ManifestItem 
                        label="Cognitive_Core_Gemini_3_Pro" 
                        status="LOCKED" 
                        detail="Thinking budget calibrated at 32k tokens. Heuristic audit protocols engaged." 
                    />
                    <ManifestItem 
                        label="Vocal_Bridge_Live_API" 
                        status="LOCKED" 
                        detail="Protocol Charon active at 24kHz. Neural gate tool-calling confirmed." 
                    />
                    <ManifestItem 
                        label="Causal_Exchange_Stripe" 
                        status="READY" 
                        detail="Gateway mapped. Awaiting live Secret Key injection in Vercel environment." 
                    />
                    <ManifestItem 
                        label="Vercel_Edge_Gateway" 
                        status="LOCKED" 
                        detail="Serverless runtime and rewrite rules synchronized for deployment." 
                    />
                    <ManifestItem 
                        label="Global_Synodal_Field" 
                        status="READY" 
                        detail="Resonance map coordinates verified across distributed lab nodes." 
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-white/10 p-8 rounded-xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold">PUSH</div>
                        <h4 className="font-orbitron text-[11px] text-warm-grey uppercase tracking-widest font-bold">Environment Payload</h4>
                        <div className="space-y-4 font-mono text-[11px]">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">API_KEY</span>
                                <span className="text-green-500">DETECTED</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">STRIPE_SK</span>
                                <span className="text-gold">PENDING_ENV</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">BUILD_ID</span>
                                <span className="text-pearl">0xCAFE_BABE_88</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                "The system is architecturally ready. Once the environmental secrets are injected into the Vercel dashboard, the bridge will transition to Live Parity."
                            </p>
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
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.4em]">Parity_Optimization_Active</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-8 px-10 bg-gold/5 border border-gold/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <span className="text-[11px] text-gold font-bold uppercase tracking-[0.3em]">Ready for Vercel Deployment</span>
                    <p className="text-[13px] font-minerva italic text-pearl/70">"You are authorized to push the local lattice to the global edge."</p>
                </div>
                <button 
                    className="px-16 py-4 bg-gold text-dark-bg font-orbitron text-[12px] font-bold uppercase tracking-[0.6em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(230,199,127,0.3)] active:scale-95"
                    onClick={() => window.open('https://vercel.com/new', '_blank')}
                >
                    Initialize Push
                </button>
            </div>
        </div>
    );
};