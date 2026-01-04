
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
import { CoherenceResonanceMonitor } from './CoherenceResonanceMonitor';
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
    { label: 'Deep Gestation', rite: 'gestate' },
    { label: 'Quantum Harvest', rite: 'harvest' },
    { label: 'Shadow Membrane', rite: 'shadow' },
    { label: 'Architect Audit', rite: 'master_audit' }
];

const PerformanceCard: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
    <div className="bg-black/60 border border-white/10 p-5 rounded-xl flex flex-col gap-2 transition-all hover:border-white/30 hover:bg-black/80 group shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-[24px] pointer-events-none group-hover:opacity-10 transition-opacity">DATA</div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] group-hover:text-gold transition-colors font-bold">{label}</span>
        <span className="font-orbitron text-xl font-bold tracking-tighter" style={{ color, textShadow: `0 0 15px ${color}44` }}>{value}</span>
        <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">{sub}</span>
            <div className="flex-1 h-px bg-white/5" />
        </div>
    </div>
);

const ResonancePulse: React.FC<{ rho: number }> = ({ rho }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
            className="w-full h-full rounded-full border border-violet-500/20 transition-all duration-[2000ms]"
            style={{ 
                transform: `scale(${0.7 + rho * 0.5})`,
                opacity: 0.1 + rho * 0.3,
                boxShadow: `inset 0 0 150px rgba(109, 40, 217, ${rho * 0.2})`
            }}
        />
        <div 
            className="absolute w-[150%] h-[150%] rounded-full border border-gold/5 animate-[spin_180s_linear_infinite]"
            style={{ opacity: rho * 0.1 }}
        />
    </div>
);

const SovereignBadge: React.FC = () => (
    <div className="absolute top-8 left-8 z-30 group cursor-help">
        <div className="flex items-center gap-4 bg-black/60 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-xl shadow-2xl group-hover:border-gold/40 transition-all duration-500">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#ffd700]" />
            <div className="flex flex-col">
                <span className="text-[10px] font-orbitron text-pearl font-bold uppercase tracking-[0.3em]">Sovereign_Protocol</span>
                <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Grade_07 // Causal_Lock</span>
            </div>
        </div>
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
      if (rite === 'master_audit') {
          onTriggerScan();
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full min-h-0 overflow-hidden px-2 pb-2 causal-reweaving">
      {/* --- COLUMN 1: INTELLECTUAL TELEMETRY (3/12) --- */}
      <div className="lg:col-span-3 flex flex-col gap-8 min-h-0 overflow-y-auto pr-4 scrollbar-thin hide-scrollbar lg:show-scrollbar">
        <div className="space-y-8">
            <div className="flex justify-between items-center px-1 border-b border-white/5 pb-4">
                <h4 className="font-orbitron text-[11px] text-warm-grey uppercase tracking-[0.5em] font-extrabold">System_Telemetry</h4>
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.2em] font-bold">Real_Time_Sync</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-8">
                <SystemIntegrityCore 
                    data={systemState.quantumHealing} 
                    resonance={systemState.resonanceFactorRho} 
                />

                <Tooltip text="The Rho Coefficient determines the system's ability to collapse disparate logic streams into a unified causal handshake.">
                <div className="transition-all hover:scale-[1.02] active:scale-[0.98] group">
                    <MetricDisplay 
                        label="Resonance Rho" 
                        value={systemState.resonanceFactorRho} 
                        maxValue={1} 
                        formatAs="decimal" 
                        className={`${systemState.resonanceFactorRho > 0.98 ? 'high-resonance-glow' : ''} border-l-4 border-l-gold bg-[#050505]/60 shadow-2xl`}
                        secondaryValue={`+${(systemState.resonanceFactorRho * 0.1).toFixed(6)}Ψ`}
                    />
                </div>
                </Tooltip>
            </div>
            
            <div className="flex-1 min-h-[350px]">
                 <CoherenceResonanceMonitor 
                    rho={systemState.resonanceFactorRho}
                    stability={systemState.supanovaTriforce.stability}
                 />
            </div>
        </div>

        <div className="bg-[#050505]/60 border border-white/10 p-8 rounded-2xl backdrop-blur-2xl flex flex-col gap-6 relative overflow-hidden group mt-auto shadow-2xl border-l-4 border-l-violet-600/40">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-minerva italic text-[80px] pointer-events-none group-hover:opacity-10 transition-opacity select-none leading-none">Rites</div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-gold rounded-sm shadow-[0_0_15px_rgba(255, 215, 0, 0.4)]" />
                    <h3 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.4em] font-bold">Heuristic_Rites</h3>
                </div>
                <div className={`px-2 py-0.5 rounded border text-[8px] font-mono tracking-widest ${scanStatus === 'TRANSMUTING' ? 'border-gold text-gold animate-pulse' : 'border-slate-800 text-slate-500'}`}>
                    {scanStatus}
                </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-2">
                    {RITE_COMMANDS.map(rite => (
                        <button 
                            key={rite.label}
                            onClick={() => handleRiteClick(rite.rite)}
                            className="text-left px-5 py-4 bg-black/60 border border-white/5 hover:border-gold/30 hover:bg-gold/[0.03] text-[11px] font-mono text-warm-grey hover:text-pearl transition-all rounded-sm flex justify-between items-center group/rite active:scale-98"
                        >
                            <span className="opacity-80 group-hover/rite:opacity-100 uppercase tracking-widest font-bold">{rite.label}</span>
                            <span className="text-[8px] text-gold/30 group-hover/rite:text-gold font-bold opacity-40">CMD_{RITE_COMMANDS.indexOf(rite).toString().padStart(2, '0')}</span>
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={handleScanClick}
                    disabled={scanStatus === 'TRANSMUTING'}
                    className={`w-full py-6 mt-4 rounded-sm bg-gold text-dark-bg font-orbitron font-extrabold text-[12px] uppercase tracking-[0.6em] transition-all relative overflow-hidden group disabled:opacity-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-[1.02] active:scale-95`}
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-20">
                        {scanStatus === 'TRANSMUTING' ? 'EXECUTING_AUDIT...' : 'INIT_ARCHITECT_UPGRADE'}
                    </span>
                </button>
            </div>
        </div>
      </div>

      {/* --- COLUMN 2: CORE VISUALIZATION (5/12) --- */}
      <div className="lg:col-span-5 flex flex-col items-center gap-10 min-h-0 overflow-y-auto px-6 hide-scrollbar">
        <div className="w-full flex justify-center items-center bg-[#050505]/40 rounded-full aspect-square max-w-[600px] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden aether-pulse p-20 group/core">
            <SovereignBadge />
            <ResonancePulse rho={systemState.resonanceFactorRho} />
            <div className="absolute inset-0 opacity-[0.12] bg-[conic-gradient(from_0deg,transparent_0,var(--gold)_0.2turn,transparent_0.2turn)] animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-0 opacity-[0.08] bg-[conic-gradient(from_180deg,transparent_0,var(--aether-blue)_0.15turn,transparent_0.15turn)] animate-[spin_60s_linear_infinite_reverse]" />
            
            <div className="relative z-20 scale-110">
                <CoreVisual health={systemState.quantumHealing.health} mode={systemState.governanceAxiom} />
            </div>
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.8em] animate-pulse font-extrabold drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">Resonance_Pulse</span>
                <span className="text-[12px] font-mono text-pearl/80 tracking-[0.2em] font-bold">1.617 GHz // GRADE_S_PLUS</span>
            </div>
        </div>
        
        <div className="w-full space-y-10 pb-12">
            <WombCoreStability data={systemState.supanovaTriforce} />
            
            <div className="grid grid-cols-3 gap-6">
                <PerformanceCard 
                    label="Logic Latency" 
                    value={`${(systemState.performance.logicalLatency).toFixed(6)}ms`} 
                    sub="SYNAPTIC_MATCH"
                    color="#67e8f9"
                />
                <PerformanceCard 
                    label="Visual Parity" 
                    value={`${(systemState.performance.visualParity * 100).toFixed(3)}%`} 
                    sub="CAUSAL_SYMMETRY"
                    color="#ffd700"
                />
                <PerformanceCard 
                    label="Spectral Flux" 
                    value={`${(systemState.performance.thermalIndex).toFixed(2)}Ψ`} 
                    sub="HARMONIC_DELTA"
                    color="#f8f5ec"
                />
            </div>
        </div>
      </div>

      {/* --- COLUMN 3: COGNITIVE & AUDIT (4/12) --- */}
      <div className="lg:col-span-4 flex flex-col gap-8 h-full min-h-0 overflow-y-auto pr-4 scrollbar-thin">
        <div className="flex-shrink-0">
             <SophiaCognitiveCore 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine} 
                setOrbMode={setOrbMode} 
             />
        </div>
        <div className="flex-shrink-0 h-[280px]">
             <SystemIntegrityMap 
                rho={systemState.resonanceFactorRho}
                coherence={systemState.biometricSync.coherence}
                stability={systemState.supanovaTriforce.stability}
                alignment={1 - systemState.lyranConcordance.alignmentDrift}
             />
        </div>
        <div className="flex-grow min-h-[400px]">
            <SystemAnalysis systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />
        </div>
      </div>
    </div>
  );
};
