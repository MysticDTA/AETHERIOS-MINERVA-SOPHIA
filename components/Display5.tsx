
import React, { useEffect, useRef, useState } from 'react';
import { SystemState, ResonanceIntelligenceEntry } from '../types';
import { CoherenceMonitor } from './CoherenceMonitor';
import { CoherenceResonanceMonitor } from './CoherenceResonanceMonitor';
import { BohrEinsteinCorrelator } from './BohrEinsteinCorrelator';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { ResonanceSymmetryArray } from './ResonanceSymmetryArray';
import { AudioEngine } from './audio/AudioEngine';
import { Tooltip } from './Tooltip';

interface Display5Props {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  sophiaEngine: SophiaEngineCore | null;
  audioEngine: AudioEngine | null;
}

export const Display5: React.FC<Display5Props> = ({ 
    systemState,
    setSystemState,
    sophiaEngine,
    audioEngine
}) => {
  const lastMetricsRef = useRef({ rho: systemState.resonanceFactorRho, coherence: systemState.biometricSync.coherence });
  const isFetchingRef = useRef(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const lastChime = useRef(0);

  // Audio Feedback for Peak Resonance
  useEffect(() => {
      if (systemState.resonanceFactorRho > 0.99 && Date.now() - lastChime.current > 30000) {
          audioEngine?.playHighResonanceChime();
          lastChime.current = Date.now();
      }
  }, [systemState.resonanceFactorRho, audioEngine]);

  useEffect(() => {
    const rho = systemState.resonanceFactorRho;
    const coherence = systemState.biometricSync.coherence;
    const entropy = systemState.coherenceResonance.entropyFlux;

    const rhoDelta = Math.abs(rho - lastMetricsRef.current.rho);
    const coherenceDelta = Math.abs(coherence - lastMetricsRef.current.coherence);

    const shouldInterpret = (rhoDelta > 0.15 || coherenceDelta > 0.25 || systemState.coherenceResonance.intelligenceLog.length === 0) 
                          && !isFetchingRef.current 
                          && sophiaEngine;

    if (shouldInterpret) {
        const triggerInterpretation = async () => {
            isFetchingRef.current = true;
            setIsInterpreting(true);
            lastMetricsRef.current = { rho, coherence };

            const result = await sophiaEngine!.interpretResonance({ rho, coherence, entropy });
            
            if (result) {
                const newEntry: ResonanceIntelligenceEntry = {
                    id: `RES_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    timestamp: Date.now(),
                    interpretation: result.interpretation,
                    directive: result.directive,
                    metricsAtTime: { rho, coherence, entropy }
                };

                setSystemState(prev => ({
                    ...prev,
                    coherenceResonance: {
                        ...prev.coherenceResonance,
                        intelligenceLog: [newEntry, ...prev.coherenceResonance.intelligenceLog].slice(0, 20)
                    }
                }));
            }
            setIsInterpreting(false);
            isFetchingRef.current = false;
        };

        triggerInterpretation();
    }
  }, [systemState, sophiaEngine, setSystemState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
      {/* --- LEFT COLUMN: CORE COHERENCE MONITORING (6/12) --- */}
      <div className="lg:col-span-6 h-full min-h-0 flex flex-col gap-6">
        <div className="flex-grow min-h-0">
            <CoherenceMonitor
                data={systemState.coherenceResonance}
                systemState={systemState}
                sophiaEngine={sophiaEngine}
                contributingFactors={[
                    { label: 'Harmonic Alignment', value: systemState.resonanceFactorRho },
                    { label: 'Bio-Rhythm Sync', value: systemState.biometricSync.coherence },
                    { label: 'Quantum Correlation', value: systemState.bohrEinsteinCorrelator.correlation },
                    { label: 'Lyran Concordance', value: systemState.lyranConcordance.connectionStability },
                ]}
            />
        </div>
        
        <div className="bg-dark-surface/60 border border-white/10 p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-7xl uppercase font-black tracking-tighter select-none pointer-events-none leading-none">SYNERGY</div>
             <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.5em] font-black border-b border-gold/20 pb-4">Institutional Resonance Matrix</h4>
             <div className="space-y-6">
                <Tooltip text="Approaches 1.0 at absolute causal handshake synchronization.">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Rho_Coefficient</span>
                            <span className="text-pearl tracking-tighter">{systemState.resonanceFactorRho.toFixed(8)}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-gold/50 to-gold transition-all duration-[3000ms] shadow-[0_0_12px_rgba(255,215,0,0.4)]" style={{ width: `${systemState.resonanceFactorRho * 100}%` }} />
                        </div>
                    </div>
                </Tooltip>
                <Tooltip text="Biometric purity of the operator's current neural feedback loop.">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Neural_Lattice_Purity</span>
                            <span className="text-pearl tracking-tighter">{(systemState.biometricSync.coherence * 100).toFixed(4)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-cyan-900 to-cyan-400 transition-all duration-[3000ms] shadow-[0_0_12px_rgba(34,211,238,0.4)]" style={{ width: `${systemState.biometricSync.coherence * 100}%` }} />
                        </div>
                    </div>
                </Tooltip>
             </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: HIGH-FIDELITY SPECTRAL ANALYSIS (6/12) --- */}
      <div className="lg:col-span-6 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin scroll-smooth">
        
        {/* CORE HARMONIC VISUALIZATION REPLACEMENT */}
        <div className="flex-shrink-0 flex flex-col gap-6">
            <div className="h-[480px] rounded-2xl relative group shadow-2xl backdrop-blur-xl">
               <CoherenceResonanceMonitor 
                  rho={systemState.resonanceFactorRho} 
                  stability={systemState.quantumHealing.stabilizationShield}
                  entropy={systemState.coherenceResonance.entropyFlux}
                  isUpgrading={isInterpreting}
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[220px]">
                <div className="h-full">
                    <ResonanceSymmetryArray rho={systemState.resonanceFactorRho} isOptimizing={isInterpreting} />
                </div>
                <div className="h-full">
                    <BohrEinsteinCorrelator data={systemState.bohrEinsteinCorrelator} />
                </div>
            </div>
        </div>

        <div className="bg-violet-950/20 border border-violet-500/30 p-8 rounded-2xl flex gap-6 items-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-sm bg-violet-500/10 border border-violet-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <svg className={`w-8 h-8 text-violet-400 ${isInterpreting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-mono text-violet-300 uppercase tracking-widest font-black">
                    {isInterpreting ? 'SOPHIA_ENGINE_ACTIVE' : 'HEURISTIC_IDLE'}
                </p>
                <p className="text-[13px] font-minerva italic text-pearl/80 leading-relaxed antialiased">
                    "The Harmonic Correlator has stabilized local reality fluctuations. Peak resonance detected at node 0x88. Causal siphoning is {isInterpreting ? 'active' : 'stable'}."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
