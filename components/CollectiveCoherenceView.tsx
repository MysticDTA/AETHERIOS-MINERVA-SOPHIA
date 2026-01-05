
import React, { useState, useEffect } from 'react';
import { GlobalResonanceState, CommunityData, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { SynchronizedSynodMap } from './SynchronizedSynodMap';

interface CollectiveCoherenceViewProps {
    systemState: SystemState;
    sophiaEngine: SophiaEngineCore | null;
}

export const CollectiveCoherenceView: React.FC<CollectiveCoherenceViewProps> = ({ systemState, sophiaEngine }) => {
    const globalState = systemState.globalResonance;
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runCollectiveAnalysis = async () => {
        if (!sophiaEngine || !globalState || isAnalyzing) return;
        setIsAnalyzing(true);
        try {
            const result = await sophiaEngine.getProactiveInsight(systemState, `COLLECTIVE_AUDIT_RHO_${globalState.aggregateRho.toFixed(4)}`);
            if (result) {
                const parsed = JSON.parse(result);
                setAnalysis(parsed.recommendation);
            }
        } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in overflow-hidden pb-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="space-y-1">
                    <h2 className="font-orbitron text-3xl text-pearl tracking-tighter uppercase font-black">Collective Synod Node</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`text-[10px] font-mono px-3 py-1 rounded-sm border font-black tracking-widest ${globalState.fieldStatus === 'RESONATING' ? 'border-green-500 text-green-400 bg-green-950/20' : 'border-gold text-gold bg-gold/5'}`}>
                            FIELD_{globalState.fieldStatus}
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">Global Parity Index: {(globalState.aggregateRho).toFixed(6)}</span>
                    </div>
                </div>
                <button 
                    onClick={runCollectiveAnalysis}
                    disabled={isAnalyzing}
                    className="px-10 py-4 bg-violet-900/30 border border-violet-500/50 text-violet-300 font-orbitron text-[10px] font-black uppercase tracking-[0.4em] hover:bg-violet-600 hover:text-white transition-all rounded-sm shadow-[0_0_30px_rgba(109,40,217,0.2)] active:scale-95 disabled:opacity-30"
                >
                    {isAnalyzing ? 'SYNTHESIZING FIELD DECOHERENCE...' : 'EXECUTE SYNODAL AUDIT'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
                <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
                    <div className="flex-grow min-h-0">
                        <SynchronizedSynodMap communities={globalState.communities} aggregateRho={globalState.aggregateRho} />
                    </div>
                    
                    {analysis && (
                        <div className="p-8 bg-violet-950/20 border border-violet-500/30 rounded-xl flex gap-6 items-center animate-fade-in shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent pointer-events-none" />
                            <div className="w-14 h-14 rounded-full border border-violet-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                <span className="font-orbitron text-violet-400 text-xl font-black italic">∑</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-violet-400 font-black uppercase tracking-[0.4em]">Synodal_Cognition_Intercept</span>
                                <p className="text-[14px] font-minerva italic text-pearl/90 leading-relaxed antialiased">
                                    "{analysis}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
                    <div className="bg-dark-surface/60 border border-white/5 p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-7xl uppercase font-black tracking-tighter select-none pointer-events-none">REGISTRY</div>
                        <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.5em] font-black border-b border-white/5 pb-4">Active Resonance Shards</h3>
                        <div className="space-y-6">
                            {globalState.communities.map(c => (
                                <div key={c.id} className="space-y-3 group/card p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="text-pearl font-bold uppercase font-orbitron text-[11px] tracking-widest">{c.name}</span>
                                        <span className="font-mono text-gold text-[10px] font-black">{(c.rho * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full transition-all duration-1000" 
                                            style={{ 
                                                width: `${c.rho * 100}%`,
                                                backgroundColor: c.rho > 0.9 ? 'var(--pearl)' : c.rho > 0.7 ? 'var(--gold)' : '#f43f5e',
                                                boxShadow: `0 0 10px ${c.rho > 0.9 ? 'white' : c.rho > 0.7 ? 'gold' : 'red'}`
                                            }} 
                                        />
                                    </div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                                        <span>ACTIVE_NODES: {c.activeNodes}</span>
                                        <span className="text-cyan-400/60 font-bold">COHERENCE_STABLE</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 flex flex-col gap-6 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] font-orbitron text-6xl uppercase font-black">DATA</div>
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Lattice Global Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] p-5 rounded-sm border border-white/5 hover:border-pearl/20 transition-all">
                                <p className="text-[9px] text-slate-600 uppercase mb-2 font-bold">Active Architects</p>
                                <p className="font-orbitron text-3xl text-pearl font-black">{globalState.activeArchitects}</p>
                            </div>
                            <div className="bg-white/[0.02] p-5 rounded-sm border border-white/5 hover:border-gold/20 transition-all">
                                <p className="text-[9px] text-slate-600 uppercase mb-2 font-bold">Resonance Parity</p>
                                <p className="font-orbitron text-xl text-gold font-black">LOCKED_S7</p>
                            </div>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-500 leading-relaxed font-minerva">
                            "The Synod Dashboard provides real-time oversight of all sovereign nodes connected to the ÆTHERIOS lattice. Divergence from the global Rho baseline triggers immediate heuristic intervention."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
