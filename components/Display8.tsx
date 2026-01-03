import React from 'react';
import { SystemState } from '../types';
import { AethericTransferMonitor } from './AethericTransferMonitor';
import { AbundanceCore } from './AbundanceCore';

interface Display8Props {
  systemState: SystemState;
  onPurgeAethericFlow: () => void;
  isPurgingAether: boolean;
}

export const Display8: React.FC<Display8Props> = ({ 
    systemState,
    onPurgeAethericFlow,
    isPurgingAether,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* --- LEFT COLUMN --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <AethericTransferMonitor 
            data={systemState.aethericTransfer}
            onPurge={onPurgeAethericFlow}
            isPurging={isPurgingAether}
        />
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         <AbundanceCore data={systemState.abundanceCore} />
      </div>
    </div>
  );
};