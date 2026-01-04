
import React from 'react';
import { SystemState } from '../types';
import { BiometricSync } from './BiometricSync';
import { SchumannResonance } from './SchumannResonance';
import { VibrationMonitor } from './VibrationMonitor';
import { EarthGroundingCore } from './EarthGroundingCore';
import { SystemModeVisual } from './SystemModeVisual';

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
    <div className="flex flex-col gap-8 h-full animate-fade-in overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                <h2 className="font-orbitron text-md text-pearl uppercase tracking-[0.4em] font-black">Resonant Subsystem Cluster</h2>
             </div>
             <div className="text-[10px] font-mono text-cyan-500 bg-cyan-900/10 px-4 py-1 rounded-full border border-cyan-800/30 font-bold">
                TELEMETRY_PROTOCOL: GRS-V2
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <BiometricSync data={systemState.biometricSync} />
                <SchumannResonance data={systemState.schumannResonance} />
                <VibrationMonitor data={systemState.vibration} />
                <EarthGroundingCore
                    data={systemState.earthGrounding}
                    onDischarge={onGroundingDischarge}
                    isDischarging={isDischargingGround}
                />
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Integration of the missing visual logic */}
                <SystemModeVisual mode={systemState.governanceAxiom === 'SOVEREIGN EMBODIMENT' ? 'CONCORDANCE' : 'STANDBY'} />
                
                <div className="bg-dark-surface/60 border border-white/5 p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-black tracking-tighter">PARITY</div>
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.5em] font-black border-b border-gold/20 pb-4">Matrix Diagnostics</h4>
                    <div className="space-y-4 font-mono text-[11px]">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-500">RES_RHO</span>
                            <span className="text-pearl">{systemState.resonanceFactorRho.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-500">DECOHERENCE</span>
                            <span className={systemState.quantumHealing.decoherence > 0.2 ? 'text-gold' : 'text-cyan-400'}>
                                {systemState.quantumHealing.decoherence.toFixed(4)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">PHASE_LOCK</span>
                            <span className="text-green-500">NOMINAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-auto bg-black/40 p-5 rounded border border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest shadow-inner">
            <div className="flex gap-10">
                <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> SENSORS: OPTIMAL</span>
                <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> DRIFT: +0.0004</span>
            </div>
            <div className="flex gap-6">
                <span>PACKET_PARITY: 99.998%</span>
                <span>NODE: 0x88_SOPHIA</span>
            </div>
        </div>
    </div>
  );
};
