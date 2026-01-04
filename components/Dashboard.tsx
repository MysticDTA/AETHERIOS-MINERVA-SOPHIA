
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0 overflow-hidden pb-6">
      
      {/* --- COLUMN 1: SYSTEM INTEGRITY (3/12) --- */}
      <div className="lg:col-span-3 flex flex-col gap-8 overflow-y-auto pr-2 scrollbar-thin">
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.6em] font-black">Coherence_Lattice</h4>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            </div>
            
            <SystemIntegrityCore 
                data={systemState.quantumHealing} 
                resonance={systemState.resonanceFactorRho} 
            />

            <div className="group transition-all duration-700">
                <MetricDisplay 
                    label="Resonance Rho" 
                    value={systemState.resonanceFactorRho} 
                    maxValue={1} 
                    formatAs="decimal" 
                    className="glass-panel"
                    secondaryValue={`Δ+${(systemState.resonanceFactorRho * 0.04).toFixed(6)}Ψ`}
                />
            </div>

            <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex flex-col gap-4 shadow-inner">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Heuristic_Audit</span>
                    <button 
                        onClick={onTriggerScan}
                        className="px-4 py-1.5 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[9px] uppercase hover:bg-gold hover:text-dark-bg transition-all rounded-sm"
                    >
                        INIT_SCAN
                    </button>
                </div>
                <p className="text-[11px] font-minerva italic text-pearl/60 leading-relaxed">
                    "Execute a causal sweep to rectify local timeline fractures and verify node parity."
                </p>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALS & TELEMETRY (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col items-center gap-8 overflow-y-auto px-4 hide-scrollbar">
        <div className="w-full flex justify-center items-center aspect-square max-w-[480px] relative shrink-0">
            <div className="absolute inset-0 bg-radial-gradient from-gold/5 via-transparent to-transparent blur-3xl opacity-30" />
            <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center opacity-40 group-hover:opacity-100 transition-opacity">
                <p className="font-mono text-[9px] text-pearl/50 uppercase tracking-[1em]">Core_Frequencies</p>
            </div>
        </div>
        
        <div className="w-full space-y-8 pb-10">
            <PerformanceMetricsChart performance={systemState.performance} />
            <WombCoreStability data={systemState.supernovaTriforce} />
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE ANALYSIS (4/12) --- */}
      <div className="lg:col-span-4 flex flex-col gap-8 h-full min-h-0">
        <div className="flex-shrink-0 h-[400px]">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-grow min-h-0 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
        </div>
      </div>
    </div>
  );
};
