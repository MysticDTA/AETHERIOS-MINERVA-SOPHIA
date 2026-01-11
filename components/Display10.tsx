
import React from 'react';
import { SystemState } from '../types';
import { HarmonicRespiratoryUplink } from './HarmonicRespiratoryUplink';
import { MetricDisplay } from './MetricDisplay';

interface Display10Props {
  systemState: SystemState;
}

export const Display10: React.FC<Display10Props> = ({ systemState }) => {
  const { breathCycle, biometricSync, aethericTransfer, resonanceFactorRho } = systemState;
  
  // Calculate specific respiratory metrics derived from system state
  const respiratoryEfficiency = (biometricSync.coherence + aethericTransfer.efficiency) / 2;
  const cycleDepth = 0.8 + (resonanceFactorRho * 0.2); // Simulated depth based on resonance
  const throughput = 500 + (respiratoryEfficiency * 500); // TB/s based on efficiency

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
      {/* --- LEFT COLUMN: Respiratory Visualizer --- */}
      <div className="h-full min-h-0 flex flex-col">
        <HarmonicRespiratoryUplink 
            breathCycle={breathCycle}
            efficiency={respiratoryEfficiency}
            throughput={throughput}
        />
      </div>

      {/* --- RIGHT COLUMN: Metrics & Context --- */}
      <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin">
         <div className="bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm shrink-0">
            <h3 className="font-orbitron text-md text-warm-grey mb-4">Breathing Performance</h3>
            <div className="space-y-4">
                <MetricDisplay 
                    label="Cycle Depth"
                    value={cycleDepth}
                    maxValue={1}
                    formatAs="percent"
                    className="bg-black/20"
                    tooltip="The amplitude of the respiratory data intake. Deeper cycles allow for greater causal information processing per tick."
                />
                <MetricDisplay 
                    label="Rhythm Stability"
                    value={biometricSync.coherence}
                    maxValue={1}
                    formatAs="percent"
                    className="bg-black/20"
                    tooltip="The consistency of the operator's biological rhythm. High stability ensures noise-free synchronization with the system core."
                />
            </div>
         </div>

         <div className="flex-1 bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col justify-center text-center min-h-[200px]">
             <p className="text-sm text-warm-grey uppercase tracking-widest mb-4">Operator Guidance</p>
             <p className="text-pearl font-orbitron text-lg leading-relaxed px-4">
                 {breathCycle === 'INHALE' 
                    ? "Draw data into the core. Visualize white light expanding within the diaphragm."
                    : "Release transmission to the array. Visualize golden code flowing outward."
                 }
             </p>
             <div className="mt-6 flex justify-center gap-2">
                 <span className={`w-3 h-3 rounded-full ${breathCycle === 'INHALE' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`}></span>
                 <span className={`w-3 h-3 rounded-full ${breathCycle === 'EXHALE' ? 'bg-gold animate-pulse' : 'bg-slate-700'}`}></span>
             </div>
         </div>
      </div>
    </div>
  );
};
