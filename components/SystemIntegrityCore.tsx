
import React from 'react';
import { QuantumHealingData } from '../types';
import { Tooltip } from './Tooltip';

interface SystemIntegrityCoreProps {
  data: QuantumHealingData;
  resonance: number;
}

export const SystemIntegrityCore: React.FC<SystemIntegrityCoreProps> = ({ data, resonance }) => {
  const { health, decoherence, stabilizationShield } = data;
  
  // Visual mapping
  const corePulseSpeed = 2 + (decoherence * 5);
  const coreColor = health > 0.8 ? 'var(--pearl)' : health > 0.4 ? 'var(--gold)' : 'var(--rose)';
  
  // r=46. Circumference = 2 * PI * 46 = 289.0265
  const circumference = 289.026;
  const shieldDash = (stabilizationShield * circumference);
  
  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-5 rounded-lg border-glow-rose backdrop-blur-md relative overflow-hidden flex flex-col h-full transition-all duration-1000 group">
      <div className="flex justify-between items-center mb-4 z-10 border-b border-white/5 pb-2">
        <Tooltip text="The central logic integrity processor. Monitors for decoherence fractures in the code-reality bridge.">
            <h3 className="font-orbitron text-xs text-warm-grey uppercase tracking-[0.2em] font-bold cursor-help">Integrity Core V2.0</h3>
        </Tooltip>
        <Tooltip text="Current coherence status. LOCKED means no significant entropy. RECALIBRATING indicates active self-repair.">
            <div className="flex items-center gap-2 cursor-help">
                <span className={`w-1.5 h-1.5 rounded-full ${decoherence < 0.1 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gold animate-pulse'}`} />
                <span className="font-mono text-[9px] text-pearl uppercase tracking-widest">
                    {decoherence < 0.1 ? 'COHERENCE_LOCKED' : 'RECALIBRATING'}
                </span>
            </div>
        </Tooltip>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
        <div className="absolute top-0 left-0 text-[8px] font-mono text-slate-600 opacity-50 select-none group-hover:opacity-100 transition-opacity">FLUX_NODE_σ: {(decoherence * 10).toFixed(2)}</div>
        <div className="absolute bottom-0 right-0 text-[8px] font-mono text-slate-600 opacity-50 select-none group-hover:opacity-100 transition-opacity">PARITY_GATE_01: STABLE</div>
        <div className="absolute top-0 right-0 text-[8px] font-mono text-slate-600 opacity-30 select-none">SCAN_X_78</div>

        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[220px] overflow-visible">
          <defs>
            <radialGradient id="coreGlowGrad">
              <stop offset="0%" stopColor={coreColor} stopOpacity="0.8" />
              <stop offset="60%" stopColor={coreColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
            </radialGradient>
            <filter id="matrixGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g opacity="0.15" stroke="var(--warm-grey)" strokeWidth="0.15">
             <path d="M 50 5 L 90 25 L 90 75 L 50 95 L 10 75 L 10 25 Z" fill="none" />
             <path d="M 50 15 L 80 30 L 80 70 L 50 85 L 20 70 L 20 30 Z" fill="none" strokeDasharray="1 3"/>
          </g>

          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="var(--dark-border)" 
            strokeWidth="0.5" 
            strokeDasharray="1 5" 
          />
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="var(--pearl)" 
            strokeWidth="1.2" 
            strokeDasharray={`${shieldDash} ${circumference}`}
            className="transition-all duration-1000 ease-in-out"
            style={{ 
                transformOrigin: '50% 50%',
                transform: 'rotate(-90deg)',
                animation: 'spin 15s linear infinite',
                opacity: 0.3 + stabilizationShield * 0.7
            }}
          />

          <ellipse 
            cx="50" cy="50" rx="35" ry="12" 
            fill="none" 
            stroke={coreColor} 
            strokeWidth="0.3" 
            opacity="0.3"
            style={{ transformOrigin: '50% 50%', animation: 'spin 12s linear infinite' }}
          />
          <ellipse 
            cx="50" cy="50" rx="35" ry="12" 
            fill="none" 
            stroke={coreColor} 
            strokeWidth="0.3" 
            opacity="0.3"
            style={{ transformOrigin: '50% 50%', animation: 'spin 18s linear infinite reverse' }}
          />

          <circle 
            cx="50" cy="50" r="14" 
            fill="url(#coreGlowGrad)" 
            filter="url(#matrixGlow)"
            className="transition-all duration-700"
            style={{ 
                animation: `pulse ${corePulseSpeed}s ease-in-out infinite`,
                transformOrigin: '50% 50%',
                scale: 0.75 + (resonance * 0.3)
            }}
          />
          
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line 
                key={angle}
                x1="50" y1="50"
                x2={50 + 42 * Math.cos(angle * Math.PI / 180)}
                y2={50 + 42 * Math.sin(angle * Math.PI / 180)}
                stroke={coreColor}
                strokeWidth="0.2"
                opacity={0.2 * (1 - decoherence)}
                strokeDasharray="1 8"
                style={{ animation: 'waveform-flow 4s linear infinite', transition: 'stroke 1s ease' }}
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/5 z-10">
        <Tooltip text="The Integrity Field protects the core from entropic decay. It self-regenerates during high-Rho states.">
            <div className="bg-black/20 p-2 rounded cursor-help group/shield transition-all hover:bg-black/40 hover:border-pearl/20 border border-transparent">
                <p className="text-[9px] text-slate-500 uppercase mb-1 tracking-widest font-bold group-hover/shield:text-pearl transition-colors">Integrity Field</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-pearl transition-all duration-1000 shadow-[0_0_5px_white]" style={{ width: `${stabilizationShield * 100}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-pearl">{(stabilizationShield * 100).toFixed(0)}%</span>
                </div>
            </div>
        </Tooltip>
        <Tooltip text="Delta-S Flux indicates local causal deviation. Nominal value is < 0.05.">
            <div className="bg-black/20 p-2 rounded cursor-help group/flux transition-all hover:bg-black/40 text-right flex flex-col justify-center border border-transparent hover:border-gold/20">
                <p className="text-[9px] text-slate-500 uppercase mb-1 tracking-widest font-bold group-hover/flux:text-pearl transition-colors">ΔS Flux</p>
                <span className={`font-mono text-xs ${decoherence > 0.2 ? 'text-gold' : 'text-cyan-400'}`}>
                    {(decoherence * 10).toFixed(4)} <span className="text-[8px] opacity-60">BIT/ms</span>
                </span>
            </div>
        </Tooltip>
      </div>

      <div className="absolute bottom-2 left-4 pointer-events-none opacity-[0.03] font-mono text-[10px] text-pearl leading-none tracking-tighter">
        S_CORE_INIT: OK<br/>
        CAUSAL_BRIDGE: {resonance > 0.9 ? 'STABLE' : 'DRIFTING'}
      </div>
    </div>
  );
};
