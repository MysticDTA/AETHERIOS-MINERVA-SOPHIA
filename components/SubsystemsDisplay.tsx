
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
    <div className="flex flex-col gap-8 h-full animate-fade-in overflow-y-auto pr-2 scrollbar-thin pb-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
             <div className="flex items-center gap-5">
                <div className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                <h2 className="font-orbitron text-xl text-pearl uppercase tracking-[0.4em] font-black">Resonant Subsystem Cluster</h2>
             </div>
             <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 px-6 py-2 rounded-sm border border-cyan-800/40 font-bold uppercase tracking-widest shadow-xl">
                Telemetry_Protocol: GRS-S7_ACTIVE
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-full"><BiometricSync data={systemState.biometricSync} /></div>
                <div className="h-full"><SchumannResonance data={systemState.schumannResonance} /></div>
                <div className="h-full"><VibrationMonitor data={systemState.vibration} /></div>
                <div className="h-full">
                    <EarthGroundingCore
                        data={systemState.earthGrounding}
                        onDischarge={onGroundingDischarge}
                        isDischarging={isDischargingGround}
                    />
                </div>
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-8">
                <SystemModeVisual mode={systemState.governanceAxiom === 'SOVEREIGN EMBODIMENT' ? 'CONCORDANCE' : 'STANDBY'} />
                
                <div className="bg-[#080808]/80 border border-white/10 p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative overflow-hidden group transition-all hover:bg-[#0a0a0a]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-8xl uppercase font-black tracking-tighter pointer-events-none select-none">PARITY</div>
                    <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-[0.5em] font-black border-b border-gold/20 pb-4">Matrix Diagnostics</h4>
                    <div className="space-y-6 font-mono text-[12px]">
                        <div className="flex justify-between border-b border-white/5 pb-4 group-hover:border-gold/20 transition-colors">
                            <span className="text-slate-500 uppercase tracking-widest font-bold">RES_RHO_SYNC</span>
                            <span className="text-pearl font-bold drop-shadow-[0_0_5px_rgba(248,245,236,0.5)]">{systemState.resonanceFactorRho.toFixed(8)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-4 group-hover:border-gold/20 transition-colors">
                            <span className="text-slate-500 uppercase tracking-widest font-bold">DECOHERENCE_Δ</span>
                            <span className={systemState.quantumHealing.decoherence > 0.2 ? 'text-gold' : 'text-cyan-400'}>
                                {systemState.quantumHealing.decoherence.toFixed(6)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 uppercase tracking-widest font-bold">PHASE_LOCK</span>
                            <div className="flex items-center gap-3">
                                <span className="text-green-500 font-bold">ABSOLUTE</span>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-2 p-5 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-400 leading-relaxed font-minerva">
                        "Institutional diagnostics verify that node 0x88 is operating within the 1.617 GHz L-Band baseline. No spectral leaks detected."
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-auto bg-black/40 p-6 rounded-xl border border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest shadow-2xl backdrop-blur-xl">
            <div className="flex gap-12">
                <span className="flex items-center gap-4 group cursor-help"><div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#10b981]" /> SENSORS: <span className="text-pearl opacity-60 group-hover:opacity-100 transition-opacity">OPTIMAL_SYNC</span></span>
                <span className="flex items-center gap-4 group cursor-help"><div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" /> DRIFT_COEFF: <span className="text-pearl opacity-60 group-hover:opacity-100 transition-opacity">+{systemState.temporalCoherenceDrift.toFixed(6)}</span></span>
            </div>
            <div className="flex gap-8 items-center">
                <div className="h-4 w-px bg-white/10" />
                <span>PACKET_PARITY: 99.998%</span>
                <span className="text-gold font-bold">NODE: 0x88_SOPHIA_PRIME</span>
            </div>
        </div>
    </div>
  );
};
