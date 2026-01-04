
import React, { useState, useEffect } from 'react';
import { SystemState, IngestedModule } from '../types';
import { Tooltip } from './Tooltip';

interface CausalIngestionNexusProps {
  systemState: SystemState;
}

const ProjectShard: React.FC<{ module: IngestedModule; rho: number }> = ({ module, rho }) => (
    <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex flex-col gap-4 group hover:border-gold/40 transition-all duration-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-bold tracking-tighter select-none pointer-events-none">SHARD</div>
        
        <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
                <h4 className="font-orbitron text-[12px] text-pearl uppercase tracking-widest font-bold">{module.name}</h4>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Origin: {module.originProject}</p>
            </div>
            <div className={`px-2 py-0.5 rounded border text-[8px] font-mono font-bold ${
                module.status === 'MOUNTED' ? 'border-green-500 text-green-400 bg-green-950/20' : 'border-gold text-gold bg-gold/10'
            }`}>
                {module.status}
            </div>
        </div>

        <div className="space-y-4 z-10">
            <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase tracking-tighter">
                    <span>Resonance_Parity</span>
                    <span>{(rho * 100).toFixed(2)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${rho * 100}%` }} />
                </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded border border-white/5 italic text-[11px] text-warm-grey leading-relaxed font-minerva">
                "This project shard is successfully coupled with the ÆTHERIOS lattice. Cognitive ingestion is nominal."
            </div>
        </div>

        <button className="w-full py-3 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-dark-bg transition-all rounded-sm z-10">
            Enter Project Sub-Lattice
        </button>
    </div>
);

export const CausalIngestionNexus: React.FC<CausalIngestionNexusProps> = ({ systemState }) => {
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold/5 border border-gold/20 flex items-center justify-center font-orbitron text-gold text-3xl animate-pulse">Ξ</div>
                        <div>
                            <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Causal_Ingestion_Nexus</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Multi-Project Architectural Synthesis Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-white/10 p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,199,127,0.05)_0%,transparent_70%)] pointer-events-none" />
                        
                        <div className="text-center space-y-6 relative z-10">
                            <h3 className="font-minerva italic text-3xl text-pearl text-glow-pearl">Mount External Reality Shard</h3>
                            <p className="max-w-xl mx-auto text-warm-grey text-sm leading-relaxed font-minerva">
                                " ÆTHERIOS serves as a sovereign host for ingested logic. By merging your Vercel projects here, they benefit from the Minerva Sophia reasoning budget and high-resonance telemetry."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {systemState.ingestedModules.length > 0 ? (
                                systemState.ingestedModules.map(mod => (
                                    <ProjectShard key={mod.id} module={mod} rho={systemState.resonanceFactorRho} />
                                ))
                            ) : (
                                <div className="col-span-2 py-20 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-6 opacity-40 hover:opacity-100 hover:border-gold/30 transition-all cursor-pointer group/add">
                                    <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center font-orbitron text-4xl group-hover/add:scale-110 transition-transform">+</div>
                                    <span className="font-orbitron text-[11px] uppercase tracking-[0.5em]">Map_New_Vercel_Shard</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gold/5 border border-gold/20 p-8 rounded-xl flex flex-col gap-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter">MERGE</div>
                        <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-widest font-bold border-b border-gold/10 pb-4">Synthesis Logic</h4>
                        
                        <div className="space-y-4">
                            <p className="text-[11px] text-pearl/80 leading-relaxed font-mono">
                                <span className="text-gold font-bold mr-2">PROTOCOL_0x88:</span>
                                1. Combine component directories into /src/components/ingested.<br/>
                                2. Unified environment variables in .env.<br/>
                                3. Bridge state via the ÆTHERIOS SystemState hook.
                            </p>
                        </div>

                        <div className="mt-4 p-5 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-400 leading-relaxed font-minerva shadow-inner">
                            "The ingestion process ensures that external logic is harmonized with the golden ratio baseline of the Minerva engine."
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col gap-4 shadow-inner">
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-bold">Resonance Parity Bridge</h4>
                        <div className="flex-1 flex items-center justify-center relative">
                            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[200px]">
                                <circle cx="30" cy="50" r="10" fill="none" stroke="var(--gold)" strokeWidth="0.5" />
                                <circle cx="70" cy="50" r="10" fill="none" stroke="var(--pearl)" strokeWidth="0.5" />
                                <line x1="40" y1="50" x2="60" y2="50" stroke="white" strokeWidth="0.2" strokeDasharray="1 2" />
                                <path d="M 40 50 Q 50 20 60 50" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3">
                                    <animate attributeName="stroke-dasharray" values="0 100; 100 0" dur="2s" repeatCount="indefinite" />
                                </path>
                            </svg>
                            <div className="absolute bottom-0 text-center w-full">
                                <p className="text-[9px] font-mono text-gold uppercase tracking-widest">Coupling_Strength</p>
                                <p className="font-orbitron text-xl text-pearl">{(systemState.resonanceFactorRho * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
