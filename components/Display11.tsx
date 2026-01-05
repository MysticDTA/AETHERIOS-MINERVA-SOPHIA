
import React from 'react';
import { SystemState } from '../types';
import { SupernovaTriforceReactor } from '../services/SupanovaTriforceReactor';
import { PatternRecognitionHUD } from './PatternRecognitionHUD';
import { TemporalDriftVisualizer } from './TemporalDriftVisualizer';

interface Display11Props {
  systemState: SystemState;
}

export const Display11: React.FC<Display11Props> = ({ systemState }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
      {/* --- LEFT COLUMN: Reactor Dynamics & Pattern HUD (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden h-full min-h-0">
        <div className="flex-shrink-0">
            <SupernovaTriforceReactor data={systemState.supernovaTriforce} />
        </div>
        <div className="flex-grow min-h-0 bg-black/20 rounded-xl border border-white/5 p-2 shadow-inner">
            <PatternRecognitionHUD systemState={systemState} />
        </div>
      </div>

      {/* --- RIGHT COLUMN: Temporal Physics (7/12) --- */}
      <div className="lg:col-span-7 h-full min-h-0 flex flex-col bg-black/30 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
         <div className="absolute top-5 left-8 z-20">
             <span className="text-[10px] font-mono text-gold uppercase tracking-[0.5em] font-black opacity-40">Temporal_Phase_Engine</span>
         </div>
         <div className="flex-1 min-h-0">
            <TemporalDriftVisualizer drift={systemState.temporalCoherenceDrift} />
         </div>
         <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
             <div className="flex items-center gap-6">
                 <div className="w-1 h-10 bg-gold rounded-full shadow-[0_0_12px_gold]" />
                 <p className="text-[14px] font-minerva italic text-pearl/70 leading-relaxed">
                    "Operator Note: High temporal drift (&gt;0.05) indicates potential timeline divergence. Initialize a Causal Audit to resync local chronons with the prime reality matrix."
                 </p>
             </div>
         </div>
      </div>
    </div>
  );
};
