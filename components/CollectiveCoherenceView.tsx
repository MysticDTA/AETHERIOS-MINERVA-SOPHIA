import React, { useState, useEffect } from 'react';
import { GlobalResonanceState, CommunityData, SystemState } from '../types';
import { collectiveResonanceService } from '../services/collectiveResonanceService';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface CollectiveCoherenceViewProps {
    systemState: SystemState;
    sophiaEngine: SophiaEngineCore | null;
}

const ResonanceMap: React.FC<{ communities: CommunityData[] }> = ({ communities }) => (
    <div className="relative w-full aspect-video bg-[#050505] rounded-xl border border-white/5 overflow-hidden group shadow-inner">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <svg viewBox="0 0 100 60" className="w-full h-full">
            <g opacity="0.05" stroke="white" strokeWidth="0.05">
                {[10, 20, 30, 40, 50].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} />)}
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => <line key={x} x1={x} y1="0" x2={x} y2="60" />)}
            </g>

            {communities.map(c => (
                <g key={c.id}>
                    <circle cx={c.location.x} cy={c.location.y} r={c.rho * 1.5} fill={c.rho > 0.8 ? '#f8f5ec' : '#e6c77f'} opacity="0.6">
                        <animate attributeName="r" values={`${c.rho * 0.5};${c.rho * 2};${c.rho * 0.5}`} dur={`${4 - c.rho * 3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur={`${4 - c.rho * 3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx={c.location.x} cy={c.location.y} r="0.4" fill="#fff" />
                    <text x={c.location.x} y={c.location.y + 3} textAnchor="middle" fill="white" fontSize="1.2" className="font-mono uppercase tracking-widest opacity-40">{c.name}</text>
                </g>
            ))}
        </svg>

        <div className="absolute bottom-4 left-4 font-mono text-[8px] text-slate-500 uppercase flex flex-col gap-1">
            <span>Projection: ÆTHER_NET_PROXIMA</span>
            <span>Sync_Status: NOMINAL</span>
        </div>
    </div>
);

export const CollectiveCoherenceView: React.FC<CollectiveCoherenceViewProps> = ({ systemState, sophiaEngine }) => {
    const [globalState, setGlobalState] = useState<GlobalResonanceState | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const unsubscribe = collectiveResonanceService.subscribe(setGlobalState);
        collectiveResonanceService.start();
        return () => {
            unsubscribe();
            collectiveResonanceService.stop();
        };
    }, []);

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

    if (!globalState) return null;

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="space-y-1">
                    <h2 className="font-orbitron text-3xl text-pearl tracking-tighter">Collective Synod Dashboard</h2>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${globalState.fieldStatus === 'RESONATING' ? 'border-green-500 text-green-400 bg-green-950/20' : 'border-gold text-gold bg-gold/5'}`}>
                            FIELD_{globalState.fieldStatus}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Global Parity Index: {(globalState.aggregateRho).toFixed(4)}</span>
                    </div>
                </div>
                <button 
                    onClick={runCollectiveAnalysis}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-violet-900/20 border border-violet-500/40 text-violet-300 font-orbitron text-[10px] uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all rounded-sm shadow-xl"
                >
                    {isAnalyzing ? 'Analyzing Field Decoherence...' : 'Analyze Collective Patterns'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <ResonanceMap communities={globalState.communities} />
                    
                    {analysis && (
                        <div className="p-5 bg-violet-950/20 border border-violet-500/30 rounded-lg flex gap-4 items-center animate-fade-in shadow-2xl">
                            <div className="w-10 h-10 rounded-full border border-violet-400 flex items-center justify-center shrink-0">
                                <span className="font-orbitron text-violet-400 text-xs font-bold">∑</span>
                            </div>
                            <p className="text-[13px] font-minerva italic text-pearl/90 leading-relaxed">
                                <span className="text-violet-400 font-bold mr-2 uppercase">[SYNODAL_INSIGHT]</span>
                                "{analysis}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-dark-surface/40 border border-white/5 p-5 rounded-lg flex flex-col gap-4 shadow-xl">
                        <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-widest font-bold">Active Resonance Labs</h3>
                        <div className="space-y-4">
                            {globalState.communities.map(c => (
                                <div key={c.id} className="space-y-2">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-slate-400 font-bold uppercase">{c.name}</span>
                                        <span className="font-mono text-pearl">{(c.rho * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full transition-all duration-1000 shadow-[0_0_8px_white]" 
                                            style={{ 
                                                width: `${c.rho * 100}%`,
                                                backgroundColor: c.rho > 0.9 ? 'var(--pearl)' : c.rho > 0.7 ? 'var(--gold)' : '#ef4444'
                                            }} 
                                        />
                                    </div>
                                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                                        <span>NODES: {c.activeNodes}</span>
                                        <span>COH: {(c.coherence * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col gap-3 shadow-inner">
                        <h4 className="font-orbitron text-[9px] text-slate-600 uppercase tracking-widest font-bold">Field Statistics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5 shadow-inner">
                                <p className="text-[8px] text-slate-600 uppercase mb-1">Architects</p>
                                <p className="font-orbitron text-xl text-pearl">{globalState.activeArchitects}</p>
                            </div>
                            <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5 shadow-inner">
                                <p className="text-[8px] text-slate-600 uppercase mb-1">Global Sync</p>
                                <p className="font-orbitron text-xl text-gold">LOCKED</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};