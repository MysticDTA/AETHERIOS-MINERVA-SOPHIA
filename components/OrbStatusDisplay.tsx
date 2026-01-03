import React from 'react';
import { OrbMode, OrbModeConfig } from '../types';

const MODE_EFFECTS: Record<OrbMode, string> = {
  STANDBY: 'Baseline',
  ANALYSIS: 'Self-Correction++',
  SYNTHESIS: 'Resonance++',
  REPAIR: 'Regen Amplified',
  GROUNDING: 'Decoherence Damping',
  CONCORDANCE: 'Lyran Stabilized',
  OFFLINE: 'System Degrading'
};

interface OrbStatusDisplayProps {
  currentMode: OrbMode;
  modes: OrbModeConfig[];
}

export const OrbStatusDisplay: React.FC<OrbStatusDisplayProps> = ({ currentMode }) => {
  const effectText = MODE_EFFECTS[currentMode];

  return (
    <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider font-bold">Status:</span>
            <span className="text-pearl font-mono animate-pulse">{effectText}</span>
        </div>
        <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
        <div className="flex items-center gap-1 hidden sm:flex">
             <span className="text-[10px] text-slate-600 uppercase tracking-wider">Integrity:</span>
             <span className="text-[10px] text-green-400 font-mono">OK</span>
             <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
        </div>
    </div>
  );
};