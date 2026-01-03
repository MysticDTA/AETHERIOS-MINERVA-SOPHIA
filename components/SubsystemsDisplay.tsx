import React from 'react';
import { SystemState } from '../types';
import { BiometricSync } from './BiometricSync';
import { SchumannResonance } from './SchumannResonance';
import { VibrationMonitor } from './VibrationMonitor';
import { EarthGroundingCore } from './EarthGroundingCore';

interface SubsystemsDisplayProps {
  systemState: SystemState;
  onGroundingDischarge: () => void;
  isDischargingGround: boolean;
}

export const SubsystemsDisplay: React.FC<SubsystemsDisplayProps> = ({ 
    systemState,
    onGroundingDischarge,
    isDischargingGround,
}) => {
  return (
    <div className="flex flex-col gap-6 h-full animate-fade-in">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
             <h2 className="font-orbitron text-sm text-slate-400 uppercase tracking-[0.3em]">Resonant Subsystem Cluster</h2>
             <div className="text-[10px] font-mono text-cyan-500 bg-cyan-900/10 px-2 py-0.5 rounded border border-cyan-800/30">
                DIAGNOSTIC_MODE: ACTIVE
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full flex flex-col">
                <BiometricSync data={systemState.biometricSync} />
            </div>
            <div className="h-full flex flex-col">
                <SchumannResonance data={systemState.schumannResonance} />
            </div>
            <div className="h-full flex flex-col">
                <VibrationMonitor data={systemState.vibration} />
            </div>
            <div className="h-full flex flex-col">
                <EarthGroundingCore
                    data={systemState.earthGrounding}
                    onDischarge={onGroundingDischarge}
                    isDischarging={isDischargingGround}
                />
            </div>
        </div>
        
        <div className="mt-auto bg-dark-surface/30 p-3 rounded border border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <span>Primary Sensor Array status: OPTIMAL</span>
            <div className="flex gap-4">
                <span>Packet parity: 99.98%</span>
                <span>Drift index: 0.002</span>
            </div>
        </div>
    </div>
  );
};