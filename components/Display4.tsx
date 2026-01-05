
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
  voiceInterface: any; 
  onTriggerAudit?: () => void;
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
    onTriggerAudit
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0 overflow-hidden pb-4">
      {/* --- CHAT CONSOLE (LEFT) --- */}
      <div className="h-full min-h-0 flex flex-col bg-black/20 rounded-2xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm relative">
        <SophiaConsole 
            log={systemState.log} 
            systemState={systemState} 
            sophiaEngine={sophiaEngine}
            onSaveInsight={onSaveInsight}
            onToggleInstructionsModal={onToggleInstructionsModal}
            onRelayCalibration={onRelayCalibration}
            setOrbMode={setOrbMode}
            onSystemAuditTrigger={onTriggerAudit}
        />
      </div>

      {/* --- VOCAL BRIDGE (RIGHT) --- */}
      <div className="h-full min-h-0 flex flex-col bg-black/20 rounded-2xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
        <VoiceInterface 
            isSessionActive={voiceInterface.isSessionActive}
            startSession={voiceInterface.startVoiceSession}
            closeSession={voiceInterface.closeVoiceSession}
            userInput={voiceInterface.userInputTranscription}
            sophiaOutput={voiceInterface.sophiaOutputTranscription}
            history={voiceInterface.transcriptionHistory}
            resonance={systemState.resonanceFactorRho}
            lastSystemCommand={voiceInterface.lastSystemCommand}
            onSetOrbMode={setOrbMode}
            clearHistory={voiceInterface.clearHistory}
        />
      </div>
    </div>
  );
};
