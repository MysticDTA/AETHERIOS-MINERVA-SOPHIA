
import React from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaConsole } from './SophiaConsole';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { VoiceInterface } from './VoiceInterface';

interface Display4Props {
  systemState: SystemState;
  orbMode: OrbMode;
  sophiaEngine: SophiaEngineCore | null;
  onSaveInsight: (text: string) => void;
  onToggleInstructionsModal: () => void;
  onRelayCalibration: (relayId: string) => void;
  setOrbMode: (mode: OrbMode) => void;
  voiceInterface: any; // Added to receive the hook data
}

export const Display4: React.FC<Display4Props> = ({ 
    systemState,
    orbMode,
    sophiaEngine,
    onSaveInsight,
    onToggleInstructionsModal,
    onRelayCalibration,
    setOrbMode,
    voiceInterface,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
      {/* --- CHAT CONSOLE (LEFT) --- */}
      <div className="lg:col-span-5 xl:col-span-6 h-full min-h-0">
        <SophiaConsole 
            log={systemState.log} 
            systemState={systemState} 
            sophiaEngine={sophiaEngine}
            onSaveInsight={onSaveInsight}
            onToggleInstructionsModal={onToggleInstructionsModal}
            onRelayCalibration={onRelayCalibration}
            setOrbMode={setOrbMode}
        />
      </div>

      {/* --- VOCAL BRIDGE (RIGHT) --- */}
      <div className="lg:col-span-7 xl:col-span-6 h-full min-h-0">
        <VoiceInterface 
            isSessionActive={voiceInterface.isSessionActive}
            startSession={voiceInterface.startVoiceSession}
            closeSession={voiceInterface.closeVoiceSession}
            userInput={voiceInterface.userInputTranscription}
            sophiaOutput={voiceInterface.sophiaOutputTranscription}
            history={voiceInterface.transcriptionHistory}
            resonance={systemState.resonanceFactorRho}
        />
      </div>
    </div>
  );
};
