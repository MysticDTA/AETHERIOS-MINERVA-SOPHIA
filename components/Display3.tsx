
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <LyranStarMap 
              data={systemState.lyranConcordance}
              calibrationTargetId={calibrationTargetId}
              onCalibrate={onStarCalibrate}
              calibrationEffect={calibrationEffect}
              vibrationAmplitude={systemState.vibration.amplitude}
              setOrbMode={setOrbMode}
          />
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CosmicUplinkArray 
            uplinkData={systemState.satelliteUplink} 
            relayData={systemState.galacticRelayNetwork}
            onCalibrate={onRelayCalibration}
            setOrbMode={setOrbMode}
            sophiaEngine={sophiaEngine}
          />
        </div>
      </div>
  );
};
