import React, { useEffect, useRef } from 'react';
import { SystemState, ResonanceIntelligenceEntry } from '../types';
import { CoherenceMonitor } from './CoherenceMonitor';
import { HarmonicCorrelator } from './HarmonicCorrelator';
import { BohrEinsteinCorrelator } from './BohrEinsteinCorrelator';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { ResonanceSymmetryArray } from './ResonanceSymmetryArray';

interface Display5Props {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  sophiaEngine: SophiaEngineCore | null;
}

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

    // Shift Detection Logic: Increase stability thresholds
    const rhoDelta = Math.abs(rho - lastMetricsRef.current.rho);
    const coherenceDelta = Math.abs(coherence - lastMetricsRef.current.coherence);

    // Only interpret if meaningful shift detected OR if log is empty
    const shouldInterpret = (rhoDelta > 0.08 || coherenceDelta > 0.15 || systemState.coherenceResonance.intelligenceLog.length === 0) 
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="lg:col-span-1 h-full min-h-[400px]">
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

      <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
        <div className="flex-1 min-h-0 grid grid-cols-1 gap-6">
            <ResonanceSymmetryArray rho={systemState.resonanceFactorRho} isOptimizing={false} />
            <HarmonicCorrelator data={systemState.resonanceCoherence} />
        </div>
        <div className="flex-shrink-0">
            <BohrEinsteinCorrelator data={systemState.bohrEinsteinCorrelator} />
        </div>
      </div>
    </div>
  );
};