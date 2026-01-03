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
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-5 rounded-lg border-glow-rose backdrop-blur-md relative overflow-hidden flex flex-col transition-all duration-700">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[120px] text-white/[0.02] pointer-events-none select-none">RESONANCE</div>
            
            <div className="flex justify-between items-end mb-6 z-10">
                <div className="space-y-1">
                    <h3 className="font-orbitron text-xl text-warm-grey tracking-tighter uppercase">Unified Field Coherence</h3>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 tracking-widest">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-cyan-900/50 uppercase">Sync_Status: {status}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-orbitron text-2xl font-bold transition-all duration-500" style={{ color: config.color, textShadow: `0 0 15px ${config.glow}` }}>{config.label}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 z-10 overflow-hidden">
                <div className="md:col-span-7 flex flex-col gap-4 overflow-hidden">
                    {/* Strategy Architect Inset */}
                    <div className="bg-violet-950/20 border border-violet-500/30 rounded p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 font-orbitron text-xl uppercase font-bold">CSA</div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-4 bg-violet-400 rounded-sm" />
                                <h4 className="font-orbitron text-[10px] text-violet-300 uppercase tracking-widest font-bold">Causal Strategy Architect</h4>
                            </div>
                            <button 
                                onClick={runStrategySynthesis}
                                disabled={isStrategizing}
                                className="px-4 py-1.5 bg-violet-600/20 border border-violet-400/40 text-violet-200 font-orbitron text-[8px] uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all rounded-sm disabled:opacity-20"
                            >
                                {isStrategizing ? 'Synthesizing Roadmap...' : 'Regenerate Protocol'}
                            </button>
                        </div>

                        {strategy ? (
                            <div className="space-y-3 animate-fade-in">
                                <div className="flex justify-between items-center">
                                    <span className="font-minerva italic text-pearl text-sm">{strategy.title}</span>
                                    <span className="text-[9px] font-mono text-gold uppercase">Confidence: {(strategy.totalConfidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {strategy.steps.map((step, i) => (
                                        <div key={step.id} className="p-2.5 bg-black/40 border border-white/5 rounded-sm hover:border-violet-500/40 transition-all group/step cursor-help">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Step_{i+1}</span>
                                                <div className={`w-1 h-1 rounded-full ${step.impact === 'HIGH' ? 'bg-rose-500 shadow-[0_0_5px_#f43f5e]' : 'bg-cyan-500'}`} />
                                            </div>
                                            <p className="text-[9px] font-bold text-pearl uppercase truncate">{step.label}</p>
                                            <div className="h-0.5 bg-white/5 mt-1.5 overflow-hidden">
                                                <div className="h-full bg-violet-400 transition-all duration-1000" style={{ width: `${step.probability * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-sm opacity-30">
                                <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Initialize Strategic Synthesis</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-black/40 border border-slate-700/30 rounded flex flex-col min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 flex-shrink-0">
                            <span className="text-[10px] text-warm-grey uppercase tracking-widest font-bold">Coherence Flux Graph</span>
                        </div>
                        <div className="flex-1 p-4">
                            <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor={config.color} stopOpacity="0.15" />
                                        <stop offset="100%" stopColor={config.color} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={graphPath.area} fill={`url(#areaGrad)`} className="transition-all duration-300" />
                                <path d={graphPath.stroke} fill="none" stroke={config.color} strokeWidth="1.5" className="transition-all duration-300" />
                                <circle cx={GRAPH_WIDTH} cy={GRAPH_HEIGHT - (score * GRAPH_HEIGHT * 0.8) - (GRAPH_HEIGHT * 0.1)} r="3" fill={config.color} />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-3 overflow-hidden">
                    <div className="bg-slate-800/20 border border-slate-700/30 p-3 rounded">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resonance Coefficient</span>
                            <span className="font-orbitron text-xl text-pearl">{(score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-pearl transition-all duration-1000 shadow-[0_0_8px_white]" style={{ width: `${score * 100}%` }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 border border-slate-700/30 p-3 rounded">
                            <span className="text-[9px] text-slate-500 uppercase block mb-1">Entropy Flux</span>
                            <span className={`font-mono text-lg ${entropyFlux > 0.4 ? 'text-gold' : 'text-cyan-400'}`}>{(entropyFlux * 10).toFixed(3)}</span>
                        </div>
                        <div className="bg-black/40 border border-slate-700/30 p-3 rounded">
                            <span className="text-[9px] text-slate-500 uppercase block mb-1">Quantum Sync</span>
                            <span className="font-mono text-lg text-pearl">{(phaseSync * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded flex flex-col min-h-0 overflow-hidden">
                        <div className="px-4 py-2 border-b border-white/5">
                            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Intellectual Log</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                            {intelligenceLog.map(entry => (
                                <div key={entry.id} className="animate-fade-in space-y-2 group">
                                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-b border-white/5 pb-1">
                                        <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                        <span className="text-gold">RHO: {entry.metricsAtTime.rho.toFixed(4)}</span>
                                    </div>
                                    <p className="text-[11px] text-pearl/80 leading-relaxed font-sans italic">"{entry.interpretation}"</p>
                                    <div className="bg-rose-900/10 border border-rose-500/20 p-2 rounded-sm">
                                        <p className="text-[9px] text-rose-300 font-mono tracking-tighter">DIRECTIVE: {entry.directive}</p>
                                    </div>
                                </div>
                            ))}
                            {intelligenceLog.length === 0 && (
                                <div className="h-full flex items-center justify-center opacity-30 italic text-[10px] text-warm-grey">Awaiting field shift...</div>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-20 opacity-20"></div>
        </div>
    );
};