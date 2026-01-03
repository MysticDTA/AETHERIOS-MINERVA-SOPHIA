import React from 'react';
import { SystemState } from '../types';
import { SupanovaTriforceReactor } from '../services/SupanovaTriforceReactor';
import { PatternRecognitionHUD } from './PatternRecognitionHUD';
import { TemporalDriftVisualizer } from './TemporalDriftVisualizer';

interface Display11Props {
  systemState: SystemState;
}

export const Display11: React.FC<Display11Props> = ({ systemState }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* --- LEFT COLUMN: Reactor Dynamics --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <SupanovaTriforceReactor data={systemState.supanovaTriforce} />
        <PatternRecognitionHUD systemState={systemState} />
      </div>

      {/* --- RIGHT COLUMN: Temporal Physics --- */}
      <div className="lg:col-span-1 h-full min-h-0">
         <TemporalDriftVisualizer drift={systemState.temporalCoherenceDrift} />
      </div>
    </div>
  );
};