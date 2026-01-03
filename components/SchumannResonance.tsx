import React from 'react';
import { SchumannResonanceData, SchumannResonanceStatus } from '../types';
import { Tooltip } from './Tooltip';

interface SchumannResonanceProps {
  data: SchumannResonanceData;
}

const getStatusConfig = (status: SchumannResonanceStatus) => {
    switch(status) {
        case 'ELEVATED':
            return { color: 'text-gold', label: 'ELEVATED', waveColor: 'hsl(50, 90%, 60%)' };
        case 'SUPPRESSED':
            return { color: 'text-orange-400', label: 'SUPPRESSED', waveColor: 'hsl(30, 80%, 60%)' };
        case 'NOMINAL':
        default:
            return { color: 'text-pearl', label: 'NOMINAL', waveColor: 'hsl(180, 50%, 80%)' };
    }
}

const ResonanceWave: React.FC<{ intensity: number; color: string }> = ({ intensity, color }) => {
    const waves = [
        { id: 1, opacity: 0.8, duration: 3 + (1-intensity) * 3 }, // Fundamental
        { id: 2, opacity: 0.5, duration: 2 + (1-intensity) * 2 }, // 1st Harmonic
        { id: 3, opacity: 0.3, duration: 1.5 + (1-intensity) * 1.5 }, // 2nd Harmonic
    ];

    return (
        <div className="w-full h-[60px] bg-black/20 rounded-md relative overflow-hidden">
            <svg viewBox="0 0 200 60" className="w-full h-full">
                <defs>
                    <filter id="resonanceGlow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {waves.map((wave, index) => (
                    <path
                        key={wave.id}
                        d={`M 0,${15 + index * 15} C 50,${(15 + index * 15) - 10 * intensity}, 150,${(15 + index * 15) + 10 * intensity}, 200,${15 + index * 15}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        filter="url(#resonanceGlow)"
                        style={{
                            '--start-opacity': 0.4 * wave.opacity,
                            '--end-opacity': 1 * wave.opacity,
                            animation: `resonance-pulse ${wave.duration}s ease-in-out infinite`,
                            transition: 'd 0.5s ease-in-out',
                        } as React.CSSProperties}
                    />
                ))}
            </svg>
        </div>
    );
};

export const SchumannResonance: React.FC<SchumannResonanceProps> = React.memo(({ data }) => {
    const { liveFrequency, intensity, status } = data;
    const config = getStatusConfig(status);
    const drift = liveFrequency - 7.83;
    const driftDisplay = `${drift > 0 ? '+' : ''}${drift.toFixed(3)}`;

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-orbitron text-md text-warm-grey">Schumann Resonance</h3>
                <p className={`font-orbitron font-bold text-md ${config.color} ${status !== 'NOMINAL' ? 'animate-pulse' : ''}`}>{config.label}</p>
            </div>
            
            <ResonanceWave intensity={intensity} color={config.waveColor} />

            <div className="mt-2 grid grid-cols-3 gap-x-2 text-sm text-center">
                <Tooltip text="The real-time dominant frequency of Earth's electromagnetic field. The baseline is approximately 7.83 Hz.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Frequency</span>
                        <p className="font-mono text-pearl text-base">{liveFrequency.toFixed(3)} Hz</p>
                    </div>
                </Tooltip>
                <Tooltip text="The strength or amplitude of the Schumann Resonance signal. Higher intensity can influence system stability and biometric coherence.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Intensity</span>
                        <p className="font-mono text-pearl text-base">{(intensity * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>
                <Tooltip text="The deviation from the baseline 7.83 Hz frequency. Significant drift can indicate heightened geomagnetic activity or system interference.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Drift</span>
                        <p className={`font-mono text-base ${Math.abs(drift) > 0.05 ? 'text-gold' : 'text-pearl'}`}>{driftDisplay}</p>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
});