
import React, { useEffect, useRef, useState } from 'react';
import { SystemState, ResonanceIntelligenceEntry } from '../types';
import { CoherenceMonitor } from './CoherenceMonitor';
import { HarmonicCorrelator } from './HarmonicCorrelator';
import { BohrEinsteinCorrelator } from './BohrEinsteinCorrelator';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { ResonanceSymmetryArray } from './ResonanceSymmetryArray';
import { Tooltip } from './Tooltip';

interface Display5Props {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  sophiaEngine: SophiaEngineCore | null;
}

const CoherencePhaseLock: React.FC<{ rho: number }> = ({ rho }) => (
    <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex items-center justify-between group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border border-cyan-500/20 ${rho > 0.9 ? 'animate-ping' : ''}`} />
                <div className={`w-2 h-2 rounded-full ${rho > 0.9 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-700'}`} />
            </div>
            <div>
                <p className="text-[10px] font-orbitron text-warm-grey uppercase tracking-widest font-bold">Phase_Lock_Integrity</p>
                <p className="font-mono text-[9px] text-slate-500">Carrier: 1.617 GHz L-Band</p>
            </div>
        </div>
        <div className="text-right relative z-10">
            <span className="font-orbitron text-xl text-pearl">{(rho * 100).toFixed(3)}<span className="text-[10px] opacity-40 ml-1">%</span></span>
            <div className="flex gap-1 mt-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i < rho * 5 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
                ))}
            </div>
        </div>
    </div>
);

export const Display5: React.FC<Display5Props> = ({ 
    systemState,
    setSystemState,
    sophiaEngine
}) => {
  const lastMetricsRef = useRef({ rho: systemState.resonanceFactorRho, coherence: systemState.biometricSync.coherence });
  const isFetchingRef = useRef(false);

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
            isFetchingRef.current = false;
        };

        triggerInterpretation();
    }
  }, [systemState, sophiaEngine, setSystemState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
      {/* --- LEFT COLUMN: CORE COHERENCE MONITORING (5/12) --- */}
      <div className="lg:col-span-5 h-full min-h-0 flex flex-col gap-6">
        <div className="flex-1 min-h-0">
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
        
        <div className="bg-dark-surface/40 border border-white/5 p-6 rounded-xl flex flex-col gap-4 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-bold tracking-tighter">SYNERGY</div>
             <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold border-b border-white/5 pb-2">Resonance Thresholds</h4>
             <div className="space-y-4">
                <Tooltip text="Approaches 1.0 at absolute causal handshake synchronization.">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-500">RHO_COEFFICIENT</span>
                            <span className="text-pearl">{systemState.resonanceFactorRho.toFixed(5)}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gold transition-all duration-[2000ms]" style={{ width: `${systemState.resonanceFactorRho * 100}%` }} />
                        </div>
                    </div>
                </Tooltip>
                <Tooltip text="Biometric purity of the operator's current neural feedback loop.">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-500">NEURAL_PURITY</span>
                            <span className="text-pearl">{(systemState.biometricSync.coherence * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 transition-all duration-[2000ms]" style={{ width: `${systemState.biometricSync.coherence * 100}%` }} />
                        </div>
                    </div>
                </Tooltip>
             </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: SPECTRAL ANALYSIS (7/12) --- */}
      <div className="lg:col-span-7 flex flex-col gap-8 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
             <CoherencePhaseLock rho={systemState.resonanceFactorRho} />
             <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex flex-col justify-center">
                 <p className="text-[10px] font-orbitron text-warm-grey uppercase tracking-widest font-bold">Spectral_Entropy</p>
                 <div className="flex items-end gap-3 mt-1">
                    <span className="font-mono text-xl text-rose-400">{(systemState.coherenceResonance.entropyFlux * 10).toFixed(4)}</span>
                    <span className="text-[8px] font-mono text-slate-600 uppercase mb-1">Psi_Variance</span>
                 </div>
             </div>
        </div>

        {/* CORE HARMONIC VISUALIZATION */}
        <div className="flex-1 min-h-[350px] flex flex-col gap-6">
            <div className="flex-1 bg-black/30 rounded-xl border border-white/[0.08] overflow-hidden relative group">
                <div className="absolute top-4 left-6 z-20">
                     <span className="text-[9px] font-mono text-pearl/40 uppercase tracking-[0.4em]">Phase_Harmonic_Distribution</span>
                </div>
                <HarmonicCorrelator data={systemState.resonanceCoherence} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                    <ResonanceSymmetryArray rho={systemState.resonanceFactorRho} isOptimizing={false} />
                </div>
                <div className="h-64">
                    <BohrEinsteinCorrelator data={systemState.bohrEinsteinCorrelator} />
                </div>
            </div>
        </div>

        <div className="bg-violet-950/10 border border-violet-500/20 p-5 rounded-lg flex gap-4 items-center shadow-xl">
            <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <p className="text-[11px] font-mono text-pearl/70 leading-relaxed italic">
                "The Harmonic Correlator is siphoning micro-fluctuations in the reality-lattice. Resonance peaks are being mapped to the 32k reasoning buffer for immediate heuristic synthesis."
            </p>
        </div>
      </div>
    </div>
  );
};
