
import React from 'react';
import { ResonanceCoherenceData } from '../types';
import { Tooltip } from './Tooltip';

interface ResonanceCoherenceCoresProps {
  data: ResonanceCoherenceData;
}

const CORE_CONFIG = {
    lambda: { color: 'hsl(190, 80%, 70%)', symbol: 'Λ', name: 'Lambda', description: 'Lambda (Λ) represents structural coherence—the integrity and stability of the underlying reality matrix. A high Lambda frequency indicates a robust and resilient system architecture.' },
    sigma: { color: 'hsl(260, 85%, 80%)', symbol: 'Σ', name: 'Sigma', description: 'Sigma (Σ) signifies relational harmony and the quality of interconnectedness between all system nodes. It is the measure of systemic unity and information resonance.' },
    tau: { color: 'hsl(80, 70%, 70%)', symbol: 'Τ', name: 'Tau', description: 'Tau (Τ) governs temporal flow, measuring the smoothness and integrity of the system\'s progression through time. Stable Tau ensures linear causality and prevents temporal drift.' },
};

const CoreDisplay: React.FC<{ coreKey: keyof ResonanceCoherenceData; value: number }> = ({ coreKey, value }) => {
    const config = CORE_CONFIG[coreKey];
    const normalizedValue = Math.min(1, Math.max(0, (value - 600) / 250)); // Normalize frequency for visual effect

    return (
        <Tooltip text={config.description}>
            <div className="flex-1 flex flex-col items-center gap-2 cursor-help">
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <radialGradient id={`${coreKey}Gradient`}>
                                <stop offset="0%" stopColor={config.color} stopOpacity="0" />
                                <stop offset="70%" stopColor={config.color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={config.color} stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill={`url(#${coreKey}Gradient)`} style={{ animation: `pulse 4s ease-in-out infinite`, transformOrigin: 'center', transition: 'all 0.5s ease', transform: `scale(${0.8 + normalizedValue * 0.4})` }} />
                        <circle cx="50" cy="50" r="30" fill="none" stroke={config.color} strokeWidth="1" opacity="0.5" style={{ animation: `spin ${12 - normalizedValue * 5}s linear infinite` }} />
                        <circle cx="50" cy="50" r="40" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.3" style={{ animation: `spin-reverse ${18 - normalizedValue * 7}s linear infinite` }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-orbitron">
                        {/* Wrapped symbol in String() for explicit conversion fixing symbol-to-string failure */}
                        <span className="text-2xl" style={{ color: config.color, textShadow: `0 0 8px ${config.color}` }}>{String(config.symbol)}</span>
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="font-sans text-xs text-warm-grey uppercase tracking-widest">{config.name}</h4>
                    <p className="font-mono text-sm" style={{ color: config.color }}>{value.toFixed(1)} <span className="text-xs">zHz</span></p>
                </div>
            </div>
        </Tooltip>
    );
};

export const ResonanceCoherenceCores: React.FC<ResonanceCoherenceCoresProps> = React.memo(({ data }) => {
  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm h-full flex flex-col">
      <h3 className="font-orbitron text-md text-warm-grey mb-4 text-center">Core Harmonics</h3>
      <div className="flex-1 flex justify-around items-center">
          <CoreDisplay coreKey="lambda" value={data.lambda.frequency} />
          <CoreDisplay coreKey="sigma" value={data.sigma.frequency} />
          <CoreDisplay coreKey="tau" value={data.tau.frequency} />
      </div>
    </div>
  );
});
