
import React, { useEffect, useRef, useState } from 'react';
import { SystemState, ResonanceIntelligenceEntry } from '../types';
import { CoherenceMonitor } from './CoherenceMonitor';
import { BohrEinsteinCorrelator } from './BohrEinsteinCorrelator';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { PhaseSpaceAttractor } from './PhaseSpaceAttractor';
import { SpectralCoherenceBridge } from './SpectralCoherenceBridge';
import { HeuristicPermutationMesh } from './HeuristicPermutationMesh';
import { Canvas } from '@react-three/fiber';
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
  const [manualPhaseOffset, setManualPhaseOffset] = useState(0);
  const [isLocking, setIsLocking] = useState(false);
  const lastMetricsRef = useRef({ rho: systemState.resonanceFactorRho, coherence: systemState.biometricSync.coherence });
  const isFetchingRef = useRef(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const lastChime = useRef(0);

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

  const handleInitiateLock = () => {
      setIsLocking(true);
      audioEngine?.playUIScanStart();
      setTimeout(() => {
          setManualPhaseOffset(0);
          setIsLocking(false);
          audioEngine?.playAscensionChime();
          setSystemState(prev => ({
              ...prev,
              resonanceFactorRho: Math.min(1.0, prev.resonanceFactorRho + 0.05),
              isPhaseLocked: true
          }));
      }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
      {/* --- LEFT COLUMN: CORE COHERENCE MONITORING --- */}
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
        
        <div className="bg-dark-surface/60 border border-white/10 p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden group shrink-0">
             <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-7xl uppercase font-black tracking-tighter select-none pointer-events-none leading-none">REASON</div>
             <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.5em] font-black border-b border-gold/20 pb-4">Heuristic Mesh Topology</h4>
             
             <div className="h-48 rounded-lg bg-black/40 border border-white/5 relative overflow-hidden">
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.5} />
                    <HeuristicPermutationMesh resonance={systemState.resonanceFactorRho} />
                </Canvas>
                <div className="absolute bottom-2 left-3 font-mono text-[7px] text-slate-500 uppercase tracking-widest pointer-events-none">
                    Render_Engine: WEBGL_2.0 // Shaders: RADIANT_FRACTAL
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                    onClick={handleInitiateLock}
                    disabled={isLocking}
                    className={`flex-1 py-3 font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] transition-all rounded-sm border-2 relative overflow-hidden group/btn active:scale-95 ${
                        isLocking 
                        ? 'bg-white/5 border-white/20 text-slate-500 cursor-wait' 
                        : 'bg-gold text-dark-bg border-gold hover:bg-white hover:border-white shadow-[0_0_40px_rgba(255,215,0,0.3)]'
                    }`}
                >
                    <span className="relative z-10">{isLocking ? 'SYNCHRONIZING...' : 'Recalibrate Mesh'}</span>
                </button>
             </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: HIGH-FIDELITY SPECTRAL ANALYSIS --- */}
      <div className="lg:col-span-6 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin scroll-smooth">
        
        <div className="flex-shrink-0 flex flex-col gap-6 flex-grow">
            <div className="flex-1 min-h-[350px] rounded-2xl relative group shadow-2xl backdrop-blur-xl transition-all duration-700 hover:border-gold/30 border border-transparent">
               <SpectralCoherenceBridge 
                  rho={systemState.resonanceFactorRho} 
                  coherence={systemState.biometricSync.coherence}
                  isActive={true}
                  manualOffset={manualPhaseOffset}
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[240px] shrink-0">
                <div className="h-full">
                    <PhaseSpaceAttractor 
                        rho={systemState.resonanceFactorRho}
                        coherence={systemState.biometricSync.coherence}
                    />
                </div>
                <div className="h-full">
                    <BohrEinsteinCorrelator data={systemState.bohrEinsteinCorrelator} />
                </div>
            </div>
        </div>

        <div className="bg-violet-950/20 border border-violet-500/30 p-8 rounded-2xl flex gap-6 items-center shadow-2xl relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-sm bg-violet-500/10 border border-violet-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <svg className={`w-8 h-8 text-violet-400 ${isInterpreting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-mono text-violet-300 uppercase tracking-widest font-black">
                    {isInterpreting ? 'SOPHIA_ENGINE_ACTIVE' : 'BRIDGE_HEURISTICS'}
                </p>
                <p className="text-[13px] font-minerva italic text-pearl/80 leading-relaxed antialiased">
                    "The Heuristic Permutation Mesh visualizes the internal logic-branching of the core. Observe the structural collapse during definitive synthesis."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
