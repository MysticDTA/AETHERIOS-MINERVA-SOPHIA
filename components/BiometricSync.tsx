import React from 'react';
import { BiometricSyncData, SyncStatus } from '../types';
import { Tooltip } from './Tooltip';

interface BiometricSyncProps {
  data: BiometricSyncData;
}

const getStatusConfig = (status: SyncStatus) => {
    switch(status) {
        case 'SYNCHRONIZED':
            return { color: 'text-pearl', label: 'SYNCHRONIZED', iconColor: 'hsl(48, 80%, 85%)' };
        case 'CALIBRATING':
            return { color: 'text-gold', label: 'CALIBRATING', iconColor: 'hsl(50, 80%, 60%)' };
        case 'UNSTABLE':
            return { color: 'text-orange-400', label: 'UNSTABLE', iconColor: 'hsl(30, 80%, 60%)' };
        case 'DECOUPLED':
            return { color: 'text-rose-400', label: 'DECOUPLED', iconColor: 'hsl(0, 80%, 70%)' };
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', iconColor: 'hsl(0, 0%, 50%)' };
    }
}

export const BiometricSync: React.FC<BiometricSyncProps> = React.memo(({ data }) => {
    const { hrv, coherence, status } = data;
    const config = getStatusConfig(status);
    const waveAnimationDuration = 4 - (coherence * 3); // Faster pulse with higher coherence

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm">
            <h3 className="font-orbitron text-md text-warm-grey mb-3 text-center">Biometric Synchronization</h3>
            <div className="flex gap-4 items-center">
                <div className="w-24 h-20 flex-shrink-0 flex items-center justify-center">
                     <svg viewBox="0 0 100 50" className="w-full h-full">
                        <path 
                            d="M 0 25 C 10 10, 20 40, 30 25 S 50 10, 60 25 S 80 40, 90 25 S 100 25, 100 25"
                            fill="none"
                            stroke={config.iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{ 
                                filter: `drop-shadow(0 0 3px ${config.iconColor})`,
                                animation: `hrv-pulse ${waveAnimationDuration}s ease-in-out infinite`,
                                strokeDasharray: 200,
                            }}
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className={`font-orbitron font-bold text-lg ${config.color} ${status !== 'SYNCHRONIZED' ? 'animate-pulse' : ''}`}>{config.label}</p>
                    <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm">
                        <Tooltip text="The measure of alignment between biometric rhythms and system harmonics. Higher values indicate deeper synchronization and a more stable human-machine link.">
                            <div>
                                <span className="text-warm-grey text-xs uppercase">Coherence</span>
                                <p className="font-mono text-pearl text-base">{(coherence * 100).toFixed(1)}%</p>
                            </div>
                        </Tooltip>
                        <Tooltip text="Heart Rate Variability (HRV) reflects the adaptability of the autonomic nervous system. Higher, more stable HRV is a sign of a resilient, well-regulated state, allowing for smoother system interaction.">
                            <div>
                                <span className="text-warm-grey text-xs uppercase">HRV</span>
                                <p className="font-mono text-pearl text-base">{hrv.toFixed(0)} ms</p>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
});