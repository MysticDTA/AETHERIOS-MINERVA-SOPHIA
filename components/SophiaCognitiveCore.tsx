
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
    
    // Refs for trend analysis
    const lastFetchTime = useRef<number>(0);
    const prevHealthRef = useRef<number>(systemState.quantumHealing.health);
    const prevRhoRef = useRef<number>(systemState.resonanceFactorRho);
    
    const cooldown = 45000; // Increased cooldown to avoid fatigue

    const health = systemState.quantumHealing.health;
    const decoherence = systemState.quantumHealing.decoherence;
    const lesions = systemState.quantumHealing.lesions;
    const rho = systemState.resonanceFactorRho;
    
    // Calculate trends (deltas since last tick)
    const healthDelta = health - prevHealthRef.current;
    const rhoDelta = rho - prevRhoRef.current;

    // Enhanced proactive triggers
    // Critical: System is currently in a bad state (Health < 60% or Decoherence > 40%)
    const isCritical = health < 0.6 || lesions > 1 || decoherence > 0.4;
    
    // Degrading: System is actively getting worse (negative health trend or dropping resonance with moderate decoherence)
    const isDegrading = healthDelta < -0.001 || (decoherence > 0.2 && rhoDelta < -0.002);

    // Auto-clear insight if system stabilizes to reduce visual noise
    useEffect(() => {
        if (!isCritical && !isDegrading && insight) {
            setInsight(null);
        }
    }, [isCritical, isDegrading, insight]);

    // Update refs for next render cycle
    useEffect(() => {
        prevHealthRef.current = health;
        prevRhoRef.current = rho;
    }, [health, rho]);

    // Thinking simulation for the reasoning budget visualizer
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setThinkingProgress(p => p < 98 ? p + Math.random() * 3 : p);
            }, 150);
            return () => clearInterval(interval);
        } else {
            setThinkingProgress(0);
        }
    }, [isLoading]);
    
    useEffect(() => {
        const now = Date.now();
        // Trigger if critical or degrading, allowing for cooldown period
        const shouldFetch = (isCritical || isDegrading) && !isLoading && (now - lastFetchTime.current > cooldown);
        
        if (sophiaEngine && shouldFetch) {
            const fetchInsight = async () => {
                setIsLoading(true);
                // Switch Orb to ANALYSIS to indicate cognitive load
                setOrbMode('ANALYSIS');
                lastFetchTime.current = now;
                
                // Construct a context-aware prompt based on the specific trend
                let trendContext = "";
                if (isCritical) {
                    trendContext = `CRITICAL SYSTEM STATE. Health is critically low (${(health*100).toFixed(1)}%) or Decoherence is high (${(decoherence*100).toFixed(1)}%). The system is fracturing. Provide immediate remedial protocols.`;
                } else if (isDegrading) {
                    const rate = Math.abs(healthDelta) > 0.005 ? "RAPIDLY" : "MODERATELY";
                    trendContext = `NEGATIVE TREND DETECTED. System is ${rate} degrading. Health Delta: ${healthDelta.toFixed(5)}/tick. Rho Delta: ${rhoDelta.toFixed(5)}/tick. Provide preventative resonance stabilization advice.`;
                }
                
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
    }, [systemState, sophiaEngine, isCritical, isDegrading, isLoading, setOrbMode, audioEngine, health, decoherence, healthDelta, rhoDelta]);
    
    return (
        <div id="sophia-cognitive-core" className={`w-full h-full glass-panel p-6 rounded-2xl flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-700 ${insight?.alert ? 'shadow-[inset_0_0_40px_rgba(220,38,38,0.15)] border-rose-500/30' : ''}`}>
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

            <div className="w-full flex justify-between items-center z-10 border-b border-white/5 pb-4">
                <div className="flex flex-col">
                    <h3 className="font-minerva text-xl text-pearl italic">Minerva Sophia</h3>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] font-bold">Intelligence_Prime</span>
                </div>
                <div className="text-right">
                    <div className={`w-2 h-2 rounded-full mx-auto ${isLoading ? 'bg-violet-400 animate-ping' : insight?.alert ? 'bg-rose-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_#10b981]'}`} />
                    <span className={`text-[7px] font-mono uppercase mt-1 block tracking-widest ${isLoading ? 'text-violet-300' : insight?.alert ? 'text-rose-400' : 'text-slate-600'}`}>
                        {isLoading ? 'ANALYZING...' : insight?.alert ? 'ALERT_ACTIVE' : 'ACTIVE_SYNC'}
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
                    <div className="bg-rose-950/30 border border-rose-500/40 rounded-lg p-4 animate-fade-in-up shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden group/insight backdrop-blur-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover/insight:opacity-100 transition-opacity" />
                        <div className="flex items-start gap-3 relative z-10">
                            <span className="text-rose-400 mt-0.5 text-xs animate-pulse">⚠</span>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-orbitron text-rose-200 font-bold uppercase tracking-widest leading-tight">{insight.alert}</p>
                                <p className="text-[11px] text-pearl/90 leading-relaxed font-minerva italic">"{insight.recommendation}"</p>
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
