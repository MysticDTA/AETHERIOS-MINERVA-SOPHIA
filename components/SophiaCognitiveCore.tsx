
import React, { useState, useEffect, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import AscensionOrbEngine from './AscensionOrbEngine';
import { AudioEngine } from './audio/AudioEngine';

interface SophiaCognitiveCoreProps {
  systemState: SystemState;
  orbMode: OrbMode;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode: (mode: OrbMode) => void;
  audioEngine?: AudioEngine | null;
}

interface Insight {
    alert: string | null;
    recommendation: string | null;
}

export const SophiaCognitiveCore: React.FC<SophiaCognitiveCoreProps> = ({ systemState, orbMode, sophiaEngine, setOrbMode, audioEngine }) => {
    const [insight, setInsight] = useState<Insight | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingProgress, setThinkingProgress] = useState(0);
    const lastFetchTime = useRef<number>(0);
    const prevHealthRef = useRef<number>(systemState.quantumHealing.health);
    const cooldown = 20000; // Increased cooldown to prevent spamming audio

    const health = systemState.quantumHealing.health;
    const decoherence = systemState.quantumHealing.decoherence;
    const lesions = systemState.quantumHealing.lesions;
    
    const healthDelta = health - prevHealthRef.current;
    // Enhanced proactive triggers
    const isCritical = health < 0.6 || lesions > 1 || decoherence > 0.55;
    const isDegrading = healthDelta < -0.005 || (decoherence > 0.3 && systemState.resonanceFactorRho < 0.8);

    useEffect(() => {
        prevHealthRef.current = health;
    }, [health]);

    // Thinking simulation for the reasoning budget
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setThinkingProgress(p => p < 98 ? p + Math.random() * 2 : p);
            }, 200);
            return () => clearInterval(interval);
        } else {
            setThinkingProgress(0);
        }
    }, [isLoading]);
    
    useEffect(() => {
        const now = Date.now();
        const shouldFetch = (isCritical || isDegrading) && !isLoading && (now - lastFetchTime.current > cooldown);
        
        if (sophiaEngine && shouldFetch) {
            const fetchInsight = async () => {
                setIsLoading(true);
                setOrbMode('ANALYSIS');
                lastFetchTime.current = now;
                
                let trendContext = isDegrading ? "Decoherence trend accelerating. Predictive analysis required." : "Critical system state. Heuristic intervention recommended.";
                
                try {
                    const resultJson = await sophiaEngine.getProactiveInsight(systemState, trendContext);
                    if (resultJson) {
                        const parsedResult: Insight = JSON.parse(resultJson);
                        setInsight(parsedResult);
                        // Trigger auditory alert for the insight
                        audioEngine?.playEffect('renewal');
                    }
                } catch (e) {
                    console.error("Cognitive Core Fetch Failure:", e);
                } finally {
                    setIsLoading(false);
                    setOrbMode('STANDBY'); 
                }
            };
            fetchInsight();
        }
    }, [systemState, sophiaEngine, isCritical, isDegrading, isLoading, setOrbMode, audioEngine]);
    
    return (
        <div className={`w-full h-full glass-panel p-6 rounded-2xl flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-700 ${insight?.alert ? 'shadow-[inset_0_0_40px_rgba(109,40,217,0.1)]' : ''}`}>
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

            <div className="w-full flex justify-between items-center z-10 border-b border-white/5 pb-4">
                <div className="flex flex-col">
                    <h3 className="font-minerva text-xl text-pearl italic">Minerva Sophia</h3>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] font-bold">Intelligence_Prime</span>
                </div>
                <div className="text-right">
                    <div className={`w-2 h-2 rounded-full mx-auto ${isLoading ? 'bg-violet-400 animate-ping' : 'bg-green-500 shadow-[0_0_8px_#10b981]'}`} />
                    <span className={`text-[7px] font-mono uppercase mt-1 block tracking-widest ${isLoading ? 'text-violet-300' : 'text-slate-600'}`}>
                        {isLoading ? 'ANALYZING...' : 'ACTIVE_SYNC'}
                    </span>
                </div>
            </div>

            <div className="relative z-10 py-4 scale-110">
                <AscensionOrbEngine mode={orbMode} />
            </div>

            <div className="w-full space-y-4 z-10 min-h-[80px] flex flex-col justify-end">
                {isLoading ? (
                    <div className="space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center text-[8px] font-mono text-violet-300 uppercase tracking-widest">
                            <span>Reasoning_Budget_Usage</span>
                            <span>{thinkingProgress.toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                            <div className="h-full bg-violet-500 logic-trace-bar transition-all duration-300" style={{ width: `${thinkingProgress}%` }} />
                        </div>
                        <p className="text-[9px] text-slate-500 italic text-center font-mono animate-pulse">Deep causal permutation in progress...</p>
                    </div>
                ) : insight?.alert ? (
                    <div className="bg-violet-950/20 border border-violet-500/30 rounded-lg p-4 animate-fade-in-up shadow-[0_0_20px_rgba(109,40,217,0.15)] relative overflow-hidden group/insight">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover/insight:opacity-100 transition-opacity" />
                        <div className="flex items-start gap-3 relative z-10">
                            <span className="text-violet-400 mt-0.5 text-xs animate-pulse">◈</span>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-orbitron text-violet-200 font-bold uppercase tracking-widest leading-tight">{insight.alert}</p>
                                <p className="text-[11px] text-pearl/80 leading-relaxed font-minerva italic">"{insight.recommendation}"</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-40">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Awaiting Heuristic Trigger</p>
                    </div>
                )}
            </div>

            <div className="w-full pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase tracking-widest z-10">
                <span>Core: Gemini_3_Pro</span>
                <span>Uptime: 99.98%</span>
            </div>
        </div>
    );
};
