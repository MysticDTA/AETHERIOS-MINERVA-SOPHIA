
import React, { useState, useEffect } from 'react';
import { SystemState, IngestedModule } from '../types';
import { Tooltip } from './Tooltip';

interface MenervaBridgeProps {
  systemState: SystemState;
}

const LegacyShard: React.FC<{ module: IngestedModule }> = ({ module }) => (
    <div className="bg-black/60 border border-gold/20 p-6 rounded-xl flex flex-col gap-4 group hover:border-gold transition-all duration-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-bold tracking-tighter select-none pointer-events-none">MENERVA</div>
        
        <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
                <h4 className="font-orbitron text-[12px] text-gold uppercase tracking-widest font-bold">{module.name}</h4>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Protocol: STRIPE_INGESTED_v1</p>
            </div>
            <div className="px-2 py-0.5 rounded border border-green-500 text-green-400 bg-green-950/20 text-[8px] font-mono font-bold">
                {module.status}
            </div>
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/5 italic text-[11px] text-warm-grey leading-relaxed font-minerva">
            "Your Menerva legacy data has been synchronized with the Aetherios reality-lattice. All credits and logic blocks are active."
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="text-center bg-black/40 p-2 rounded border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase">Legacy_Points</p>
                <p className="font-orbitron text-sm text-pearl">1,250</p>
            </div>
            <div className="text-center bg-black/40 p-2 rounded border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase">Parity_Match</p>
                <p className="font-orbitron text-sm text-gold">99.9%</p>
            </div>
        </div>

        <button className="w-full py-3 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-dark-bg transition-all rounded-sm z-10 mt-2">
            Open Sub-Interface
        </button>
    </div>
);

export const MenervaBridge: React.FC<MenervaBridgeProps> = ({ systemState }) => {
    const [isEstablishing, setIsEstablishing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsEstablishing(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const menervaModules: IngestedModule[] = [
        { id: 'm1', name: 'Legacy_Stripe_Conduit', originProject: 'MENERVA', status: 'MOUNTED', entryPoint: '/api/menerva/stripe' },
        { id: 'm2', name: 'Logic_Gestation_Archive', originProject: 'MENERVA', status: 'MOUNTED', entryPoint: '/api/menerva/gestate' }
    ];

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold/5 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-3xl animate-pulse">M</div>
                        <div>
                            <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Menerva_Synthesis_Bridge</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Cross-Project Ingestion Logic // Unified Stripe Backend</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-gold/20 p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,199,127,0.08)_0%,transparent_70%)] pointer-events-none" />
                        
                        <div className="text-center space-y-4 relative z-10">
                            <h3 className="font-minerva italic text-3xl text-pearl text-glow-pearl">Unified Causal Conduit</h3>
                            <p className="max-w-2xl mx-auto text-warm-grey text-sm leading-relaxed font-minerva">
                                "The Menerva project has been successfully ingested. All Vercel serverless functions are now mapped to the Aetherios core, sharing a single Stripe identity and reasoning pool."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {menervaModules.map(mod => (
                                <LegacyShard key={mod.id} module={mod} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gold/5 border border-gold/20 p-8 rounded-xl flex flex-col gap-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter">CONDUIT</div>
                        <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-widest font-bold border-b border-gold/10 pb-4">Consolidated Backend</h4>
                        
                        <div className="space-y-4 font-mono text-[10px] text-slate-400">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>STRIPE_MODE</span>
                                <span className="text-green-500">UNIFIED</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>VERCEL_ENV</span>
                                <span className="text-pearl">SYNCED</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>LEGACY_CID</span>
                                <span className="text-gold">0xMEN_88</span>
                            </div>
                        </div>

                        <div className="mt-4 p-5 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-400 leading-relaxed font-minerva shadow-inner">
                            "By merging the Stripe Secret Keys, Aetherios acts as the parent host, allowing Menerva shards to process transactions through the same sovereign gateway."
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-6">
                        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center animate-spin-slow">
                            <span className="font-orbitron text-gold text-xl">∞</span>
                        </div>
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.4em]">Continuous_Integration_Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
