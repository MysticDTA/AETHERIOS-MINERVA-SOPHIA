import React from 'react';
import { VibrationData, VibrationStatus } from '../types';
import { Tooltip } from './Tooltip';

interface VibrationMonitorProps {
  data: VibrationData;
}

const getStatusConfig = (status: VibrationStatus) => {
    switch(status) {
        case 'HARMONIC':
            return { color: 'text-pearl', label: 'HARMONIC', waveColor: 'hsl(180, 50%, 80%)' };
        case 'DISCORDANT':
            return { color: 'text-gold', label: 'DISCORDANT', waveColor: 'hsl(50, 80%, 60%)' };
        case 'CRITICAL':
            return { color: 'text-rose-400', label: 'CRITICAL', waveColor: 'hsl(0, 80%, 70%)' };
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', waveColor: 'hsl(0, 0%, 50%)' };
    }
}

const Waveform: React.FC<{ amplitude: number; frequency: number; color: string }> = ({ amplitude, frequency, color }) => {
    const width = 200;
    const height = 50;
    const points = 100;
    
    // Normalize amplitude (0-10 microns to 0-25 pixels) and frequency (100-400hz to 2-8 waves)
    const waveAmplitude = Math.min(25, (amplitude / 10) * (height / 2));
    const waveLength = Math.max(2, Math.min(8, (frequency-100) / 40));

    let path = `M 0 ${height/2}`;
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * (width*2); // draw twice the width for scrolling animation
        const sin = Math.sin((i / points) * Math.PI * 2 * waveLength + Math.random() * 0.2); // Add jitter
        const y = height / 2 + sin * waveAmplitude * (1 - (i/points) * 0.2); // Dampen amplitude slightly over time
        path += ` L ${x} ${y}`;
    }

    return (
        <div className="w-full h-[50px] bg-black/20 rounded overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <defs>
                    <linearGradient id="waveformFade" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="80%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path 
                    d={path}
                    fill="none"
                    stroke="url(#waveformFade)"
                    strokeWidth="1.5"
                    style={{ animation: 'waveform-flow 2s linear infinite' }}
                />
            </svg>
        </div>
    );
}


export const VibrationMonitor: React.FC<VibrationMonitorProps> = React.memo(({ data }) => {
    const { amplitude, frequency, resonanceStatus } = data;
    const config = getStatusConfig(resonanceStatus);

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-orbitron text-md text-warm-grey">Vibration Analysis</h3>
                <p className={`font-orbitron font-bold text-md ${config.color} ${resonanceStatus !== 'HARMONIC' ? 'animate-pulse' : ''}`}>{config.label}</p>
            </div>
            
            <Waveform amplitude={amplitude} frequency={frequency} color={config.waveColor} />

            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
                <Tooltip text="The intensity or magnitude of the system's physical vibrations. Higher amplitude can indicate instability or high energy states.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Amplitude</span>
                        <p className="font-mono text-pearl text-base">{amplitude.toFixed(2)} µm</p>
                    </div>
                </Tooltip>
                <Tooltip text="The speed of the system's vibrations. Frequencies outside the harmonic range can indicate external interference or internal decoherence.">
                    <div className="text-right">
                        <span className="text-warm-grey text-xs uppercase">Frequency</span>
                        <p className="font-mono text-pearl text-base">{frequency.toFixed(0)} Hz</p>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
});