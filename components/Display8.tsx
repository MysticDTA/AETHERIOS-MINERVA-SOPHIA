
import React, { useCallback } from 'react';
import { SystemState } from '../types';
import { AethericTransferMonitor } from './AethericTransferMonitor';
import { EntropicStreamLoom } from './EntropicStreamLoom';
import { AudioEngine } from './audio/AudioEngine';

interface Display8Props {
  systemState: SystemState;
  onPurgeAethericFlow: () => void;
  isPurgingAether: boolean;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>; // Needed for updates
  audioEngine?: AudioEngine | null;
}

export const Display8: React.FC<Display8Props> = ({ 
    systemState,
    onPurgeAethericFlow,
    isPurgingAether,
    setSystemState,
    audioEngine
}) => {
  
  const handleLoomStabilization = useCallback((amount: number) => {
      setSystemState(prev => ({
          ...prev,
          quantumHealing: {
              ...prev.quantumHealing,
              health: Math.min(1.0, prev.quantumHealing.health + amount),
              decoherence: Math.max(0, prev.quantumHealing.decoherence - amount)
          },
          coherenceResonance: {
              ...prev.coherenceResonance,
              score: Math.min(1.0, prev.coherenceResonance.score + amount),
              entropyFlux: Math.max(0, prev.coherenceResonance.entropyFlux - amount)
          }
      }));
  }, [setSystemState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
      {/* --- LEFT COLUMN --- */}
      <div className="flex flex-col h-full min-h-0">
        <AethericTransferMonitor 
            data={systemState.aethericTransfer}
            onPurge={onPurgeAethericFlow}
            isPurging={isPurgingAether}
        />
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="flex flex-col h-full min-h-0">
         <EntropicStreamLoom 
            entropy={systemState.coherenceResonance.entropyFlux}
            onStabilize={handleLoomStabilization}
            audioEngine={audioEngine}
         />
      </div>
    </div>
  );
};
