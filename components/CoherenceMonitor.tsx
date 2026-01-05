
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CoherenceResonanceData, ResonanceIntelligenceEntry, SystemState } from '../types';
import { Tooltip } from './Tooltip';
import { useSophiaCore } from './hooks/useSophiaCore';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface CoherenceMonitorProps {
  data: CoherenceResonanceData;
  contributingFactors: { label: string; value: number }[];
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
}

const getStatusConfig = (status: CoherenceResonanceData['status']) => {
    switch(status) {
        case 'COHERENT':
            return { color: '#f8f5ec', label: 'COHERENT', glow: 'rgba(248, 245, 236, 0.4)' };
        case 'RESONATING':
            return { color: '#e6c77f', label: 'RESONATING', glow: 'rgba(230, 199, 127, 0.3)' };
        case 'DECOHERING':
            return { color: '#f59e0b', label: 'DECOHERING', glow: 'rgba(245, 158, 11, 0.2)' };
        case 'CRITICAL':
            return { color: '#f4c2c2', label: 'CRITICAL', glow: 'rgba(244, 194, 194, 0.5)' };
        default:
            return { color: '#b6b0a0', label: 'UNKNOWN', glow: 'none' };
    }
}

const HISTORY_LENGTH = 80;
const GRAPH_HEIGHT = 120;
const GRAPH_WIDTH = 400;

export const CoherenceMonitor: React.FC<CoherenceMonitorProps> = ({ data, contributingFactors, systemState, sophiaEngine }) => {
    const { score, status, entropyFlux, phaseSync, intelligenceLog } = data;
    const config = getStatusConfig(status);
    const [history, setHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(score));
    const logEndRef = useRef<HTMLDivElement>(null);
    const { strategy, isStrategizing, runStrategySynthesis } = useSophiaCore(sophiaEngine, systemState);

    useEffect(() => {
        setHistory(prev => [...prev.slice(1), score]);
    }, [score]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [intelligenceLog]);

    const graphPath = useMemo(() => {
        const points = history.map((val, i) => {
            const x = (i / (HISTORY_LENGTH - 1)) * GRAPH_WIDTH;
            const y = GRAPH_HEIGHT - (val * GRAPH_HEIGHT * 0.8) - (GRAPH_HEIGHT * 0.1);
            return `${x},${y}`;
        });
        return { stroke: `M ${points.join(' L ')}`, area: `M 0,${GRAPH_HEIGHT} L ${points.join(' L ')} L ${GRAPH_WIDTH},${GRAPH_HEIGHT} Z` };
    }, [history]);

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-6 rounded-2xl border-glow-rose backdrop-blur-md relative overflow-hidden flex flex-col transition-all duration-700 shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[100px] text-white/[0.01] pointer-events-none select-none">RESONANCE</div>
            
            <div className="flex justify-between items-end mb-8 z-10 border-b border-white/5 pb-6">
                <div className="space-y-1">
                    <h3 className="font-orbitron text-xl text-warm-grey tracking-tighter uppercase">Unified Field Coherence</h3>
                    <div className="flex items-center gap-3 font-mono text-[9px] text-slate-500 tracking-widest">
                        <span className="bg-slate-800/80 px-2 py-0.5 rounded text-cyan-400 border border-cyan-900/40 uppercase">Sync_Status: {status}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-orbitron text-3xl font-black transition-all duration-500" style={{ color: config.color, textShadow: `0 0 20px ${config.glow}` }}>{config.label}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 z-10 overflow-hidden min-h-0">
                <div className="lg:col-span-7 flex flex-col gap-6 overflow-hidden">
                    {/* Strategy Architect Panel */}
                    <div className="bg-violet-950/20 border border-violet-500/30 rounded-xl p-6 relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-black italic">CSA</div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-violet-400 rounded-sm shadow-[0_0_10px_#a78bfa]" />
                                <h4 className="font-orbitron text-[11px] text-violet-300 uppercase tracking-widest font-black">Causal Strategy Architect</h4>
                            </div>
                            <button 
                                onClick={runStrategySynthesis}
                                disabled={isStrategizing}
                                className="px-8 py-3 bg-violet-600/10 border border-violet-500/40 text-violet-200 font-orbitron text-[10px] uppercase tracking-[0.3em] font-black hover:bg-violet-600 hover:text-white transition-all rounded-sm disabled:opacity-20 active:scale-95 shadow-lg group/btn relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10">{isStrategizing ? 'SYNTHESIZING...' : 'HEURISTIC TRIGGER'}</span>
                            </button>
                        </div>

                        {strategy ? (
                            <div className="space-y-4 animate-fade-in relative z-10">
                                <div className="flex justify-between items-center bg-black/40 p-3 border border-white/5 rounded-sm">
                                    <span className="font-minerva italic text-pearl text-base leading-none">{strategy.title}</span>
                                    <span className="text-[10px] font-mono text-gold uppercase font-black">Conf: {(strategy.totalConfidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {strategy.steps.map((step, i) => (
                                        <div key={step.id} className="p-3 bg-black/40 border border-white/5 rounded-sm hover:border-violet-500/40 transition-all group/step cursor-help hover:bg-black/60 shadow-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">0{i+1}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${step.impact === 'HIGH' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-cyan-500'}`} />
                                            </div>
                                            <p className="text-[10px] font-black text-pearl uppercase truncate tracking-tighter mb-2">{step.label}</p>
                                            <div className="h-0.5 bg-white/5 overflow-hidden">
                                                <div className="h-full bg-violet-400 transition-all duration-[2000ms]" style={{ width: `${step.probability * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 opacity-20 group-hover:opacity-40 transition-opacity">
                                <span className="font-orbitron text-[11px] uppercase tracking-[0.6em] font-black">Initialize Strategic Synthesis</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-black/40 border border-slate-700/30 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 flex-shrink-0 bg-white/[0.02]">
                            <span className="text-[10px] text-warm-grey uppercase tracking-widest font-black opacity-60">Coherence Spectral Flux</span>
                        </div>
                        <div className="flex-1 p-6 relative">
                            <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="spectralFluxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" /> {/* Gold */}
                                        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.2" /> {/* Violet */}
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" /> {/* Red */}
                                    </linearGradient>
                                </defs>
                                <path d={graphPath.area} fill="url(#spectralFluxGrad)" className="transition-all duration-300" />
                                <path d={graphPath.stroke} fill="none" stroke={config.color} strokeWidth="2" className="transition-all duration-300" />
                                <circle cx={GRAPH_WIDTH} cy={GRAPH_HEIGHT - (score * GRAPH_HEIGHT * 0.8) - (GRAPH_HEIGHT * 0.1)} r="4" fill={config.color} className="animate-pulse shadow-[0_0_10px_currentColor]" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden h-full min-h-0">
                    <div className="bg-slate-800/20 border border-slate-700/30 p-5 rounded-xl shadow-inner flex-shrink-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Aggregate Coefficient</span>
                            <span className="font-orbitron text-2xl text-pearl font-black">{(score * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-transparent to-pearl transition-all duration-[3000ms] shadow-[0_0_10px_white]" style={{ width: `${score * 100}%` }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                        <div className="bg-black/40 border border-slate-700/30 p-4 rounded-xl shadow-inner">
                            <span className="text-[9px] text-slate-500 uppercase font-black block mb-1.5 tracking-widest">Entropy Flux</span>
                            <span className={`font-mono text-xl font-bold ${entropyFlux > 0.4 ? 'text-gold' : 'text-cyan-400'}`}>{(entropyFlux * 10).toFixed(4)}</span>
                        </div>
                        <div className="bg-black/40 border border-slate-700/30 p-4 rounded-xl shadow-inner">
                            <span className="text-[9px] text-slate-500 uppercase font-black block mb-1.5 tracking-widest">Phase Lock</span>
                            <span className="font-mono text-xl font-bold text-pearl">{(phaseSync * 100).toFixed(2)}%</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-950/60 border border-slate-800/50 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2),transparent_70%)]" />
                        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-60">Heuristic Trace Log</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                            {intelligenceLog.map(entry => (
                                <div key={entry.id} className="animate-fade-in space-y-3 group border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
                                        <span className="opacity-40">{new Date(entry.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit'})}</span>
                                        <span className="text-gold/60 font-black">RHO: {entry.metricsAtTime.rho.toFixed(6)}</span>
                                    </div>
                                    <p className="text-[12px] text-pearl/80 leading-relaxed font-minerva italic">"{entry.interpretation}"</p>
                                    <div className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-sm group-hover:bg-rose-950/40 transition-all">
                                        <p className="text-[9px] text-rose-400 font-mono tracking-tighter font-bold">DIRECTIVE: {entry.directive}</p>
                                    </div>
                                </div>
                            ))}
                            {intelligenceLog.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 italic text-[11px] text-warm-grey gap-4">
                                     <div className="w-10 h-10 rounded-full border-2 border-dashed border-current animate-spin-slow" />
                                     <span className="tracking-[0.4em]">Awaiting Shift</span>
                                </div>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
