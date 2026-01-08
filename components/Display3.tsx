
import React from 'react';
import { SystemState, OrbMode } from '../types';
import { LyranStarMap } from './LyranStarMap';
import { CosmicUplinkArray } from './CosmicUplinkArray';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface Display3Props {
  systemState: SystemState;
  onRelayCalibration: (relayId: string) => void;
  onStarCalibrate: (starId: number) => void;
  calibrationTargetId: number | null;
  calibrationEffect: { starId: number, success: boolean } | null;
  setOrbMode: (mode: OrbMode) => void;
  sophiaEngine: SophiaEngineCore | null;
}

export const Display3: React.FC<Display3Props> = ({ 
    systemState,
    onRelayCalibration,
    onStarCalibrate,
    calibrationTargetId,
    calibrationEffect,
    setOrbMode,
    sophiaEngine
}) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex-1 min-h-0 relative">
             <LyranStarMap 
                data={systemState.lyranConcordance}
                calibrationTargetId={calibrationTargetId}
                onCalibrate={onStarCalibrate}
                calibrationEffect={calibrationEffect}
                vibrationAmplitude={systemState.vibration.amplitude}
                setOrbMode={setOrbMode}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex-1 min-h-0 relative">
            <CosmicUplinkArray 
                uplinkData={systemState.satelliteUplink} 
                relayData={systemState.galacticRelayNetwork}
                onCalibrate={onRelayCalibration}
                setOrbMode={setOrbMode}
                sophiaEngine={sophiaEngine}
                systemState={systemState}
            />
          </div>
        </div>
      </div>
  );
};
