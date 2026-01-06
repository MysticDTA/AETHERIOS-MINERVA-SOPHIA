
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
import { NodeStabilityMatrix } from './NodeStabilityMatrix';
import { Tooltip } from './Tooltip';

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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-0 overflow-hidden pb-4 px-2">
      
      {/* --- COLUMN 1: SYSTEM TOPOLOGY & LATTICE (3/12) --- */}
      <div className="xl:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex flex-col">
                    <Tooltip text="The structural layout of the local reality node within the global ÆTHERIOS lattice.">
                        <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.6em] font-black leading-none cursor-help">Topology_Lattice</h4>
                    </Tooltip>
                    <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-1">Node_Registry: 0x88_ALPHA</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-emerald-400 font-bold tracking-tighter">PHASE_LOCK</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                </div>
            </div>
            
            <NodeStabilityMatrix resonance={systemState.resonanceFactorRho} decoherence={systemState.quantumHealing.decoherence} />

            <div className="space-y-4">
                <SystemIntegrityCore 
                    data={systemState.quantumHealing} 
                    resonance={systemState.resonanceFactorRho} 
                />
                
                <div className="bg-black/40 border border-white/5 p-5 rounded-xl flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] font-orbitron text-4xl font-black">AUDIT</div>
                    <div className="flex justify-between items-center relative z-10">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">Heuristic_Sweep</span>
                        <button 
                            onClick={onTriggerScan}
                            className="px-5 py-1.5 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[9px] uppercase font-bold hover:bg-gold hover:text-dark-bg transition-all rounded-sm shadow-lg active:scale-95"
                        >
                            PERF_AUDIT
                        </button>
                    </div>
                    <p className="text-[11px] font-minerva italic text-pearl/50 leading-relaxed relative z-10 group-hover:text-pearl/80 transition-colors">
                        "Execute causal sweep to rectify timeline fractures."
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALS & PERFORMANCE (5/12) --- */}
      <div className="xl:col-span-5 flex flex-col items-center gap-6 overflow-y-auto px-2 hide-scrollbar">
        <div className="w-full flex flex-col items-center justify-center min-h-[440px] relative shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.02)_0%,transparent_80%)] pointer-events-none" />
            
            <Tooltip text="Causal Health Visualization: Represents the structural integrity of the local reality shard. A stable, coherent core indicates optimal logic flow (1.0), while fragmentation or red-shifting warns of decoherence and potential causal fractures.">
                <div className="cursor-help">
                    <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
                </div>
            </Tooltip>

            <div className="mt-8 w-full max-w-[420px]">
                <MetricDisplay 
                    label="Resonance Rho" 
                    value={systemState.resonanceFactorRho} 
                    maxValue={1} 
                    formatAs="decimal" 
                    className="hover:border-gold/30"
                    secondaryValue={`Δ+${(systemState.resonanceFactorRho * 0.04).toFixed(6)}Ψ`}
                    tooltip="The primary coefficient of systemic harmony. A value of 1.0 represents perfect causal alignment between the local node and the universal lattice."
                />
            </div>
        </div>
        
        <div className="w-full space-y-6">
            <PerformanceMetricsChart performance={systemState.performance} />
            <WombCoreStability data={systemState.supernovaTriforce} />
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE ANALYSIS & ARCHIVE (4/12) --- */}
      <div className="xl:col-span-4 flex flex-col gap-6 h-full min-h-0 overflow-hidden">
        <div className="flex-shrink-0 h-[360px]">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-grow min-h-0 bg-black/30 rounded-2xl border border-white/5 relative group flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-[0.02] font-orbitron text-5xl font-black italic group-hover:opacity-[0.05] transition-opacity pointer-events-none">SYNTHESIS</div>
            <div className="flex-1 min-h-0 relative">
                <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
            </div>
        </div>
      </div>
    </div>
  );
};
