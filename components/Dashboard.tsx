
import React, { useState, useEffect } from 'react';
import { SystemState, OrbMode } from '../types';
import { MetricDisplay } from './MetricDisplay';
import { WombCoreStability } from './WombCoreStability';
import { CoreVisual } from './CoreVisual';
import { SystemAnalysis } from './SystemAnalysis';
import { SophiaCognitiveCore } from './SophiaCognitiveCore';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { SystemIntegrityCore } from './SystemIntegrityCore';
import { Tooltip } from './Tooltip';
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

const RITE_COMMANDS = [
    { label: 'Prime Logic Seed', cmd: 'seed' },
    { label: 'Resonance Harvest', cmd: 'harvest' },
    { label: 'Architect Audit', cmd: 'audit' }
];

const PerformanceCard: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
    <div className="glass-panel p-8 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700">
        <span className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.5em] font-black group-hover:text-gold transition-colors">{label}</span>
        <span className="font-orbitron text-2xl font-bold tracking-tighter" style={{ color, textShadow: `0 0 25px ${color}22` }}>{value}</span>
        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest opacity-60">{sub}</span>
    </div>
);

const CausalFirewall: React.FC = () => (
    <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group shadow-inner">
        <div className="flex justify-between items-center mb-1">
            <h4 className="font-orbitron text-[9px] text-rose-400 uppercase tracking-[0.4em] font-black">Causal_Firewall</h4>
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]" />
        </div>
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500">ENCRYPTION</span>
                <span className="text-pearl">AES-256-GCM</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500">PARITY_ERRORS</span>
                <span className="text-emerald-400">0.00%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500">PROXY_HOP</span>
                <span className="text-pearl">VERCEL_EDGE</span>
            </div>
        </div>
        <div className="mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500/40 animate-shimmer w-full" />
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
    systemState, 
    onTriggerScan, 
    scanCompleted,
    sophiaEngine,
    setOrbMode,
    orbMode
}) => {
  const [scanStatus, setScanStatus] = useState('READY');

  useEffect(() => {
      if (scanCompleted) {
          setScanStatus('SYNCHRONIZED');
          const t = setTimeout(() => setScanStatus('READY'), 4000);
          return () => clearTimeout(t);
      }
  }, [scanCompleted]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full min-h-0 overflow-hidden pb-6 causal-reweaving">
      
      {/* --- COLUMN 1: TELEMETRY (3/12) --- */}
      <div className="lg:col-span-3 flex flex-col gap-10 overflow-y-auto pr-2 scrollbar-thin">
        <div className="space-y-12">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-5">
                <h4 className="font-orbitron text-[9px] text-warm-grey uppercase tracking-[0.8em] font-black">Resonance</h4>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping shadow-[0_0_8px_cyan]" />
            </div>
            
            <div className="flex flex-col gap-12">
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
                        className="glass-panel border-l-2 border-l-gold/40"
                        secondaryValue={`Δ+${(systemState.resonanceFactorRho * 0.04).toFixed(6)}Ψ`}
                    />
                </div>
            </div>

            <CausalFirewall />

            <div className="glass-panel p-10 rounded-3xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.01] font-minerva italic text-8xl pointer-events-none uppercase tracking-tighter">Rites</div>
                <h3 className="font-orbitron text-[10px] text-pearl uppercase tracking-[0.5em] font-black border-b border-white/10 pb-6">Heuristic_Rites</h3>
                <div className="space-y-3">
                    {RITE_COMMANDS.map((rite, i) => (
                        <button 
                            key={rite.label}
                            onClick={() => rite.cmd === 'audit' && onTriggerScan()}
                            className="w-full text-left px-6 py-5 bg-white/[0.01] border border-white/5 hover:border-gold/20 hover:bg-gold/[0.02] text-[10px] font-mono text-slate-500 hover:text-pearl transition-all rounded-sm flex justify-between items-center group/item"
                        >
                            <span className="uppercase tracking-[0.2em]">{rite.label}</span>
                            <span className="text-gold/10 group-hover/item:text-gold transition-colors font-black text-[9px]">0{i+1}</span>
                        </button>
                    ))}
                    <button
                        onClick={onTriggerScan}
                        disabled={scanStatus === 'SYNCHRONIZING'}
                        className="w-full py-6 mt-6 rounded-sm bg-gold text-dark-bg font-orbitron font-black text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group shadow-2xl hover:scale-[1.01] active:scale-95"
                    >
                        <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]" />
                        <span className="relative z-10">{scanStatus === 'SYNCHRONIZING' ? 'GESTATION...' : 'INIT_AUDIT'}</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUAL & TELEMETRY CHARTS (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col items-center gap-10 overflow-y-auto px-6 hide-scrollbar">
        <div className="w-full flex justify-center items-center aspect-square max-w-[500px] relative shrink-0">
            <div className="absolute inset-0 bg-radial-gradient from-violet-600/5 via-transparent to-transparent blur-3xl opacity-20" />
            <div className="relative z-20 scale-100">
                <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-30 space-y-2 opacity-40 group-hover:opacity-100 transition-opacity duration-[2000ms]">
                <p className="font-orbitron text-[8px] text-gold uppercase tracking-[1.5em] font-black">Phase_Intercept</p>
                <p className="font-mono text-[10px] text-pearl/50">1.617 GHz L-BAND LOCK</p>
            </div>
        </div>
        
        <div className="w-full space-y-8 pb-16">
            <PerformanceMetricsChart performance={systemState.performance} />
            <WombCoreStability data={systemState.supernovaTriforce} />
            <div className="grid grid-cols-3 gap-6">
                <PerformanceCard label="Sync_Latency" value={`${(systemState.performance.logicalLatency).toFixed(4)}ms`} sub="LATTICE_MATCH" color="#67e8f9" />
                <PerformanceCard label="Causal_Parity" value={`${(systemState.performance.visualParity * 100).toFixed(2)}%`} sub="SYNAPTIC_SYNC" color="#ffd700" />
                <PerformanceCard label="Aether_Flux" value={`${(systemState.performance.thermalIndex).toFixed(2)}Ψ`} sub="HARMONIC_Δ" color="#f8f5ec" />
            </div>
        </div>
      </div>

      {/* --- COLUMN 3: ANALYSIS (4/12) --- */}
      <div className="lg:col-span-4 flex flex-col gap-10 overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex-shrink-0 h-[420px]">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-grow min-h-[600px]">
            <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
        </div>
      </div>
    </div>
  );
};
