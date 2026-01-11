
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
import { AudioEngine } from './audio/AudioEngine';
import { CoherenceResonancePulse } from './CoherenceResonancePulse';

interface DashboardProps {
  systemState: SystemState;
  onTriggerScan: () => void;
  scanCompleted: boolean;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode: (mode: OrbMode) => void;
  orbMode: OrbMode;
  onOptimize: () => void;
  onUpgrade?: () => void;
  audioEngine?: AudioEngine | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    systemState, 
    onTriggerScan, 
    sophiaEngine,
    setOrbMode,
    orbMode,
    onOptimize,
    onUpgrade,
    audioEngine
}) => {
  const isSovereign = systemState.userResources.sovereignTier === 'SOVEREIGN';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-4 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin">
      
      {/* --- COLUMN 1: SYSTEM TOPOLOGY & LATTICE (3/12) --- */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex flex-col">
                    <Tooltip text="The structural layout of the local reality node within the global ÆTHERIOS lattice.">
                        <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.6em] font-black leading-none cursor-help">Topology_Lattice</h4>
                    </Tooltip>
                    <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-1">Node_Registry: 0x88_ALPHA</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[6px] font-mono text-emerald-400 font-bold uppercase">Audit_Locked</span>
                        <span className="text-[8px] font-mono text-pearl">v1.4.0_PROD</span>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                </div>
            </div>
            
            <NodeStabilityMatrix resonance={systemState.resonanceFactorRho} decoherence={systemState.quantumHealing.decoherence} />

            {isSovereign ? (
                <div className="bg-black/40 border border-gold/30 p-4 rounded-sm relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[8px] font-mono text-gold uppercase tracking-widest font-black">Capital_Reserve</span>
                        <div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_5px_gold] animate-pulse" />
                    </div>
                    <p className="font-orbitron text-xl text-pearl font-black tracking-tight">
                        ${(systemState.userResources.sovereignLiquidity || 22500000).toLocaleString()}
                    </p>
                    <div className="mt-2 flex justify-between text-[7px] font-mono text-slate-500 uppercase">
                        <span>Manifest Pulse</span>
                        <span className="text-blue-400 font-bold">ACTIVE</span>
                    </div>
                </div>
            ) : (
                <div 
                    className="bg-black/40 border border-white/10 p-4 rounded-sm relative overflow-hidden group hover:border-gold/30 transition-all cursor-pointer shadow-lg" 
                    onClick={() => { audioEngine?.playUIClick(); onUpgrade?.(); }}
                >
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black">Sovereign_Access</span>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-gold transition-colors" />
                    </div>
                    <p className="font-orbitron text-sm text-slate-400 group-hover:text-pearl transition-colors relative z-10">
                        Restricted. <span className="text-gold underline decoration-gold/30 underline-offset-4 group-hover:decoration-gold">Upgrade License</span>
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div className="bg-black/40 border border-violet-500/20 p-4 rounded-xl relative overflow-hidden group shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-black">Quantum_Posture</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981] animate-pulse" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="font-orbitron text-xl text-pearl font-black">READY</p>
                        <span className="text-[9px] font-mono text-slate-500">Hybrid_Cipher</span>
                    </div>
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 w-[98%] shadow-[0_0_10px_#8b5cf6]" />
                    </div>
                </div>

                <SystemIntegrityCore 
                    data={systemState.quantumHealing} 
                    resonance={systemState.resonanceFactorRho} 
                />
                
                <div className="bg-black/40 border border-white/5 p-5 rounded-xl flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] font-orbitron text-4xl font-black">AUDIT</div>
                    <div className="flex flex-col gap-3 relative z-10">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">Production_Oversight</span>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={onTriggerScan}
                                className="flex-1 py-3 bg-emerald-600/10 border border-emerald-500/40 text-emerald-400 font-orbitron text-[9px] uppercase font-bold hover:bg-emerald-600 hover:text-white transition-all rounded-sm shadow-lg active:scale-95"
                            >
                                FULL_SYSTEM_AUDIT
                            </button>
                            <button 
                                onClick={onOptimize}
                                className="flex-1 py-3 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[9px] uppercase font-bold hover:bg-gold hover:text-dark-bg transition-all rounded-sm shadow-lg active:scale-95"
                            >
                                OPTIMIZE_NODE
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 p-3 bg-white/[0.02] border border-white/5 rounded">
                        <CoherenceResonancePulse 
                            rho={systemState.resonanceFactorRho} 
                            coherence={systemState.biometricSync.coherence} 
                            active={true}
                        />
                        <div className="flex-1">
                             <p className="text-[10px] font-mono text-slate-400 uppercase leading-tight">Real-Time_Coherence_Pulse</p>
                             <p className="text-[9px] font-minerva italic text-slate-500 mt-1">Monitoring the causal heartbeat of the production lattice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALS & PERFORMANCE (5/12) --- */}
      <div className="xl:col-span-5 flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center justify-center min-h-[350px] relative shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.02)_0%,transparent_80%)] pointer-events-none" />
            
            <Tooltip text="Causal Health Visualization: Represents the structural integrity of the local reality shard. A stable, coherent core indicates optimal logic flow (1.0).">
                <div className="cursor-help transform hover:scale-105 transition-transform duration-700">
                    <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
                </div>
            </Tooltip>

            <div className="mt-6 w-full max-w-[420px]">
                <MetricDisplay 
                    label="Resonance Rho" 
                    value={systemState.resonanceFactorRho} 
                    maxValue={1} 
                    formatAs="decimal" 
                    className="hover:border-gold/30 bg-black/40 backdrop-blur-md"
                    secondaryValue={`Δ+${(systemState.resonanceFactorRho * 0.04).toFixed(6)}Ψ`}
                    tooltip="The primary coefficient of systemic harmony."
                />
            </div>
        </div>
        
        <div className="w-full space-y-6">
            <PerformanceMetricsChart performance={systemState.performance} />
            <WombCoreStability data={systemState.supernovaTriforce} />
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE ANALYSIS & ARCHIVE (4/12) --- */}
      <div className="xl:col-span-4 flex flex-col gap-6 h-full">
        <div className="flex-shrink-0 h-[360px]">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
                audioEngine={audioEngine}
             />
        </div>
        <div className="flex-grow min-h-[400px] bg-black/30 rounded-2xl border border-white/5 relative group flex flex-col overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-3 opacity-[0.02] font-orbitron text-5xl font-black italic group-hover:opacity-[0.05] transition-opacity pointer-events-none">ANALYSIS</div>
            <div className="flex-1 relative overflow-hidden">
                <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
            </div>
        </div>
      </div>
    </div>
  );
};
