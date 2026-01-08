
import React from 'react';
import { SystemState, PillarId } from '../types';
import { Pillars } from './Pillars';
import { TesseractMonitor } from './TesseractMonitor';
import { DilutionRefrigerator } from './DilutionRefrigerator';

interface Display6Props {
  systemState: SystemState;
  onPillarBoost: (pillarId: PillarId) => void;
  onHeliumFlush: () => void;
  isFlushingHelium: boolean;
  onDilutionCalibrate: () => void;
  isCalibratingDilution: boolean;
}

export const Display6: React.FC<Display6Props> = ({ 
    systemState,
    onPillarBoost,
    onHeliumFlush,
    isFlushingHelium,
    onDilutionCalibrate,
    isCalibratingDilution,
}) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
        {/* --- LEFT COLUMN: Resonance Cradles --- */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          <Pillars pillars={systemState.pillars} onBoost={onPillarBoost} />
        </div>

        {/* --- RIGHT COLUMN: Core Matrix Monitors --- */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          <div className="flex-1 min-h-0">
             <TesseractMonitor data={systemState.tesseract} />
          </div>
          <div className="flex-shrink-0">
             <DilutionRefrigerator 
                data={systemState.dilutionRefrigerator}
                onFlush={onHeliumFlush}
                isFlushing={isFlushingHelium}
                onCalibrate={onDilutionCalibrate}
                isCalibrating={isCalibratingDilution}
             />
          </div>
        </div>
      </div>
  );
};
