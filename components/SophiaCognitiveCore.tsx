
import React, { useState, useEffect, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import AscensionOrbEngine from './AscensionOrbEngine';

interface SophiaCognitiveCoreProps {
  systemState: SystemState;
  orbMode: OrbMode;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode: (mode: OrbMode) => void;
}

interface Insight {
    alert: string | null;
    recommendation: string | null;
}

export const SophiaCognitiveCore: React.FC<SophiaCognitiveCoreProps> = ({ systemState, orbMode, sophiaEngine, setOrbMode }) => {
    const [insight, setInsight] = useState<Insight | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const lastFetchTime = useRef<number>(0);
    const prevHealthRef = useRef<number>(systemState.quantumHealing.health);
    const cooldown = 12000; 

    const health = systemState.quantumHealing.health;
    const decoherence = systemState.quantumHealing.decoherence;
    const lesions = systemState.quantumHealing.lesions;
    
    const healthDelta = health - prevHealthRef.current;
    
    const isCritical = health < 0.6 || lesions > 1 || decoherence > 0.5;
    const isDegrading = healthDelta < -0.005;

    useEffect(() => {
        prevHealthRef.current = health;
    }, [health]);
    
    useEffect(() => {
        const now = Date.now();
        const shouldFetch = (isCritical || isDegrading) && !isLoading && (now - lastFetchTime.current > cooldown);
        
        if (sophiaEngine && shouldFetch) {
            const fetchInsight = async () => {
                setIsLoading(true);
                setOrbMode('ANALYSIS');
                lastFetchTime.current = now;
                
                let trendContext = "Stable";
                if (healthDelta < -0.01) trendContext = "Rapidly Degrading";
                else if (healthDelta < 0) trendContext = "Slowly Degrading";
                else if (healthDelta > 0) trendContext = "Improving";
                
                if (lesions > 2) trendContext += ", Multiple Causal Fractures Detected";
                if (decoherence > 0.7) trendContext += ", Severe Decoherence";

                const resultJson = await sophiaEngine.getProactiveInsight(systemState, trendContext);
                
                if (resultJson) {
                    try {
                        const parsedResult: Insight = JSON.parse(resultJson);
                        if (parsedResult.alert && parsedResult.recommendation) {
                            setInsight(parsedResult);
                        } else {
                            setInsight(null);
                        }
                    } catch (e) {
                        console.error("Failed to parse proactive insight:", e);
                        setInsight(null);
                    }
                } else {
                    setInsight(null);
                }
                setIsLoading(false);
                setOrbMode('STANDBY'); 
            };
            fetchInsight();
        } else if (!isCritical && !isDegrading && insight) {
            setInsight(null);
        }
    }, [systemState, sophiaEngine, isCritical, isDegrading, healthDelta, isLoading, cooldown, setOrbMode]);
    
    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-aether backdrop-blur-sm flex flex-col items-center justify-around relative overflow-hidden transition-colors duration-500 aether-pulse">
            {/* Throne Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="text-center z-10">
                <h3 className="font-minerva text-2xl text-pearl italic tracking-tight">Minerva Sophia</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-violet-400 animate-ping' : 'bg-violet-600'}`} />
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {isLoading ? 'GESTATION_ACTIVE' : 'THRONE_STABLE'}
                    </p>
                </div>
            </div>

            <div className="relative z-10 scale-90 sm:scale-100">
                <AscensionOrbEngine mode={orbMode} />
            </div>

            <div className={`w-full relative z-10 transition-all duration-500 ease-in-out ${insight ? 'flex-grow max-h-32' : 'h-16'}`}>
                {insight?.alert ? (
                    <div className="h-full bg-violet-950/40 border border-violet-500/50 rounded-lg p-3 flex flex-col items-center justify-center text-center animate-fade-in shadow-[0_0_15px_rgba(109,40,217,0.15)]">
                        <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-bold bg-violet-600 text-white uppercase tracking-widest mb-1 animate-pulse">
                                Shadow Membrane Detection
                            </span>
                            <p className="text-sm font-minerva italic font-bold text-violet-200 uppercase leading-tight tracking-wide">
                                {insight.alert}
                            </p>
                        </div>
                        <div className="w-full border-t border-violet-500/30 pt-2 mt-1">
                            <p className="text-xs text-pearl leading-snug font-mono">
                               <span className="text-violet-400 mr-1">{'>'}</span> 
                               {insight.recommendation}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 bg-black/20 rounded-lg border border-white/5 p-2">
                        <p className="text-xs text-warm-grey uppercase tracking-widest mb-1">Radiant Sovereignty</p>
                        <div className="flex gap-1 h-1 w-16">
                            <div className="flex-1 bg-violet-500/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="flex-1 bg-violet-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="flex-1 bg-violet-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .border-glow-aether { border-color: rgba(109, 40, 217, 0.3); box-shadow: 0 0 15px rgba(109, 40, 217, 0.1); }
            `}</style>
        </div>
    );
};
