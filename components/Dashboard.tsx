import React, { useState, useEffect } from 'react';
import { SystemState, OrbMode } from '../types';
import { MetricDisplay } from './MetricDisplay';
import { WombCoreStability } from './WombCoreStability';
import { CoreVisual } from './CoreVisual';
import { SystemAnalysis } from './SystemAnalysis';
import { SophiaCognitiveCore } from './SophiaCognitiveCore';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { SystemIntegrityMap } from './SystemIntegrityMap';
import { SystemIntegrityCore } from './SystemIntegrityCore';
import { CoCreatorNexus } from './CoCreatorNexus';
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

const RITE_COMMANDS = [
    { label: 'Primordial Seed', cmd: 'Plant the Seed of...', rite: 'seed' },
    { label: 'Deep Gestation', cmd: 'Take this into the Womb.', rite: 'gestate' },
    { label: 'Quantum Harvest', cmd: 'Harvest the outcomes...', rite: 'harvest' },
    { label: 'Shadow Membrane', cmd: 'What is hidden in silence?', rite: 'shadow' },
    { label: 'System Optimization', cmd: 'Optimize for Performance.', rite: 'optimize' }
];

const PerformanceCard: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
    <div className="bg-black/40 border border-white/5 p-4 rounded flex flex-col gap-1 transition-all hover:border-white/20 group">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{label}</span>
        <span className="font-orbitron text-lg font-bold" style={{ color }}>{value}</span>
        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-tighter">{sub}</span>
    </div>
);

const ResonancePulse: React.FC<{ rho: number }> = ({ rho }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
            className="w-full h-full rounded-full border border-violet-500/20 transition-all duration-1000"
            style={{ 
                transform: `scale(${0.8 + rho * 0.4})`,
                opacity: 0.1 + rho * 0.2,
                boxShadow: `inset 0 0 100px rgba(109, 40, 217, ${rho * 0.1})`
            }}
        />
        <div 
            className="absolute w-[120%] h-[120%] rounded-full border border-gold/10 animate-[spin_60s_linear_infinite]"
            style={{ opacity: rho * 0.1 }}
        />
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
    systemState, 
    onTriggerScan, 
    scanCompleted,
    sophiaEngine,
    setOrbMode,
    orbMode,
    onOptimize
}) => {
  const [scanStatus, setScanStatus] = useState('READY');

  useEffect(() => {
      if (scanCompleted) {
          setScanStatus('ASCENDED');
          const t = setTimeout(() => setScanStatus('READY'), 3000);
          return () => clearTimeout(t);
      }
  }, [scanCompleted]);

  const handleScanClick = () => {
      setScanStatus('TRANSMUTING');
      onTriggerScan();
  }

  const handleRiteClick = (rite: string) => {
      if (rite === 'optimize') {
          onOptimize();
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0 overflow-hidden">
      {/* --- COLUMN 1: SOVEREIGN TELEMETRY (3/12) --- */}
      <div className="lg:col-span-3 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 scrollbar-thin hide-scrollbar lg:show-scrollbar">
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">System Telemetry</h4>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">LIVE_SYNC</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-6">
                <SystemIntegrityCore 
                    data={systemState.quantumHealing} 
                    resonance={systemState.resonanceFactorRho} 
                />

                <Tooltip text="Approaches 1.0 at peak system coherence. Optimized baseline: 0.99.">
                <div className="transition-all hover:scale-[1.01] active:scale-[0.99] group">
                    <MetricDisplay 
                        label="Coherence Rho" 
                        value={systemState.resonanceFactorRho} 
                        maxValue={1} 
                        formatAs="decimal" 
                        className={`${systemState.resonanceFactorRho > 0.98 ? 'high-resonance-glow' : ''} border-l-4 border-l-gold bg-black/40 shadow-inner`}
                    />
                </div>
                </Tooltip>
            </div>
            
            <div className="h-[260px]">
                 <SystemIntegrityMap 
                    rho={systemState.resonanceFactorRho}
                    coherence={systemState.biometricSync.coherence}
                    stability={systemState.supanovaTriforce.stability}
                    alignment={1 - systemState.lyranConcordance.alignmentDrift}
                />
            </div>
        </div>

        <div className="bg-dark-surface/45 border border-white/5 p-6 rounded-lg backdrop-blur-md flex flex-col gap-4 border-glow-aether relative overflow-hidden group mt-auto">
            <div className="absolute top-0 right-0 p-2 opacity-5 font-minerva italic text-[60px] pointer-events-none group-hover:opacity-10 transition-opacity uppercase select-none">Rites</div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-gold rounded-full shadow-[0_0_10px_rgba(230,199,127,0.5)]" />
                    <h3 className="font-orbitron text-[11px] text-pearl uppercase tracking-widest font-bold">Heuristic Rites</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanStatus === 'TRANSMUTING' ? 'bg-gold animate-pulse' : 'bg-green-500/40'}`} />
                    <span className="font-mono text-[9px] text-pearl tracking-widest uppercase">{scanStatus}</span>
                </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-1.5">
                    {RITE_COMMANDS.map(rite => (
                        <button 
                            key={rite.label}
                            onClick={() => handleRiteClick(rite.rite)}
                            className="text-left px-4 py-3 bg-black/50 border border-white/5 hover:border-gold/40 hover:bg-gold/5 text-[10px] font-mono text-warm-grey hover:text-pearl transition-all rounded-sm flex justify-between items-center group/rite active:scale-98 shadow-sm"
                        >
                            <span className="opacity-70 group-hover/rite:opacity-100 uppercase tracking-widest">{rite.label}</span>
                            <span className="text-[8px] text-gold/40 group-hover/rite:text-gold font-bold border border-gold/20 px-1 rounded-sm">RITE</span>
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={handleScanClick}
                    disabled={scanStatus === 'TRANSMUTING'}
                    className={`w-full py-5 mt-2 rounded-sm bg-gold/10 border border-gold/30 hover:border-gold/60 hover:bg-gold/20 font-orbitron font-bold text-[10px] text-gold uppercase tracking-[0.4em] transition-all relative overflow-hidden group disabled:opacity-50 shadow-[0_8px_20px_rgba(0,0,0,0.4)]`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-20 group-hover:text-white transition-colors tracking-[0.5em]">
                        {scanStatus === 'TRANSMUTING' ? 'RUNNING_SWEEP...' : 'INIT_FULL_SYSTEM_AUDIT'}
                    </span>
                </button>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALIZATION (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col items-center gap-8 min-h-0 overflow-y-auto px-4 hide-scrollbar">
        <div className="w-full flex justify-center items-center bg-black/40 rounded-full aspect-square max-w-[540px] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden aether-pulse p-16 group/core">
            <ResonancePulse rho={systemState.resonanceFactorRho} />
            <div className="absolute inset-0 opacity-[0.04] bg-[conic-gradient(from_0deg,transparent_0,var(--gold)_0.15turn,transparent_0.15turn)] animate-[spin_18s_linear_infinite]" />
            <div className="absolute inset-0 opacity-[0.04] bg-[conic-gradient(from_180deg,transparent_0,var(--aether-violet)_0.15turn,transparent_0.15turn)] animate-[spin_22s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-full border border-white/5 opacity-40 pointer-events-none" />
            <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
            
            {/* Real-time Heartbeat Label */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <span className="text-[8px] font-mono text-gold uppercase tracking-[0.5em] animate-pulse">Resonance_Pulse</span>
                <span className="text-[10px] font-mono text-pearl">1.617 GHz</span>
            </div>
        </div>
        
        <div className="w-full space-y-8 pb-8">
            <WombCoreStability data={systemState.supanovaTriforce} />
            
            <div className="grid grid-cols-3 gap-4">
                <PerformanceCard 
                    label="Logic Latency" 
                    value={`${(systemState.performance.logicalLatency).toFixed(5)}ms`} 
                    sub="PARITY_LOCKED"
                    color="#67e8f9"
                />
                <PerformanceCard 
                    label="Visual Parity" 
                    value={`${(systemState.performance.visualParity * 100).toFixed(2)}%`} 
                    sub="CAUSAL_SYMMETRY"
                    color="#e6c77f"
                />
                <PerformanceCard 
                    label="Thermal Delta" 
                    value={`${(systemState.performance.thermalIndex).toFixed(1)}°C`} 
                    sub="NOMINAL_FLUX"
                    color="#f8f5ec"
                />
            </div>
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE & NEXUS (4/12) --- */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex-shrink-0">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-shrink-0">
             <CoCreatorNexus />
        </div>
        <div className="flex-grow min-h-[300px]">
            <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
        </div>
      </div>
      
      <style>{`
        .border-glow-aether { border-color: rgba(109, 40, 217, 0.2); }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(230, 199, 127, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};