
import React from 'react';
import { SystemState, OrbMode } from '../types';
import { MetricDisplay } from './MetricDisplay';
import { WombCoreStability } from './WombCoreStability';
import { CoreVisual } from './CoreVisual';
import { SystemAnalysis } from './SystemAnalysis';
import { SophiaCognitiveCore } from './SophiaCognitiveCore';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { SystemIntegrityCore } from './SystemIntegrityCore';
import { PerformanceMetricsChart } from './PerformanceMetricsChart';

interface DashboardProps {
  systemState: SystemState;
  onTriggerScan: () => void;
  scanCompleted: boolean;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode: (mode: OrbMode) => void;
  orbMode: OrbMode;
  onOptimize: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    systemState, 
    onTriggerScan, 
    sophiaEngine,
    setOrbMode,
    orbMode
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0 overflow-hidden pb-4">
      
      {/* --- COLUMN 1: SYSTEM INTEGRITY (3/12) --- */}
      <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex flex-col">
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.6em] font-black leading-none">Coherence_Lattice</h4>
                    <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-1">Institutional Node: 0x88_S7</span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            </div>
            
            <SystemIntegrityCore 
                data={systemState.quantumHealing} 
                resonance={systemState.resonanceFactorRho} 
            />

            <MetricDisplay 
                label="Resonance Rho" 
                value={systemState.resonanceFactorRho} 
                maxValue={1} 
                formatAs="decimal" 
                className="hover:border-gold/30"
                secondaryValue={`Δ+${(systemState.resonanceFactorRho * 0.04).toFixed(6)}Ψ`}
            />

            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] font-orbitron text-5xl font-black">SCAN</div>
                <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">Heuristic_Audit</span>
                    <button 
                        onClick={onTriggerScan}
                        className="px-6 py-2 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] uppercase font-bold hover:bg-gold hover:text-dark-bg transition-all rounded-sm shadow-lg active:scale-95"
                    >
                        INIT_SCAN
                    </button>
                </div>
                <p className="text-[12px] font-minerva italic text-pearl/60 leading-relaxed relative z-10 group-hover:text-pearl/90 transition-colors">
                    "Execute a causal sweep to rectify local timeline fractures and verify node parity across the 32k reasoning core."
                </p>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALS & TELEMETRY (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col items-center gap-8 overflow-y-auto px-2 hide-scrollbar">
        <div className="w-full flex justify-center items-center aspect-square max-w-[460px] relative shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_70%)] pointer-events-none" />
            <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center opacity-20 group-hover:opacity-60 transition-all duration-1000">
                <p className="font-mono text-[8px] text-pearl uppercase tracking-[1.5em]">Primary_Core_Frequencies</p>
            </div>
        </div>
        
        <div className="w-full space-y-6 pb-6">
            <PerformanceMetricsChart performance={systemState.performance} />
            <WombCoreStability data={systemState.supernovaTriforce} />
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE ANALYSIS (4/12) --- */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
        <div className="flex-shrink-0 h-[380px]">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-grow min-h-0 bg-black/20 rounded-2xl border border-white/5 overflow-hidden shadow-inner">
            <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
        </div>
      </div>
    </div>
  );
};
