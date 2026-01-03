import React from 'react';
import { LyranConcordanceData, OrbMode } from '../types';
import { Tooltip } from './Tooltip';

interface LyranStarMapProps {
  data: LyranConcordanceData;
  calibrationTargetId: number | null;
  onCalibrate: (starId: number) => void;
  calibrationEffect: { starId: number, success: boolean } | null;
  vibrationAmplitude: number;
  setOrbMode?: (mode: OrbMode) => void;
}

// Pre-defined star positions for a consistent layout
const stars = [
  { id: 1, cx: 20, cy: 30, name: 'Althaea' }, { id: 2, cx: 40, cy: 50, name: 'Cygnus' }, { id: 3, cx: 25, cy: 70, name: 'Vela' },
  { id: 4, cx: 70, cy: 20, name: 'Lyra Prime' }, { id: 5, cx: 90, cy: 40, name: 'Vega' }, { id: 6, cx: 80, cy: 65, name: 'Apex' },
  { id: 7, cx: 55, cy: 85, name: 'Solara' },
];

const constellations = [
  [1, 2, 3, 1],
  [4, 5, 6, 4],
  [2, 4, 7, 3],
];

export const LyranStarMap: React.FC<LyranStarMapProps> = React.memo(({ data, calibrationTargetId, onCalibrate, calibrationEffect, vibrationAmplitude, setOrbMode }) => {
  const stability = data.connectionStability;
  const drift = data.alignmentDrift;

  // Determine animation style based on stability
  const isUnstable = stability < 0.5;
  const isVibrationHigh = vibrationAmplitude > 4.0;

  const lineAnimation = isUnstable
    ? `line-flicker ${1 + (1 - stability) * 2}s ease-in-out infinite` // Faster flicker when less stable
    : `line-pulse ${4 + stability * 2}s ease-in-out infinite`; // Slower pulse when more stable

  const starAnimation = (idx: number) => {
    const animationName = isUnstable ? 'flicker-glow' : 'steady-glow-pulse';
    const duration = isUnstable
      ? 0.5 + Math.random() * 1.5 // Fast, erratic flicker
      : 3 + Math.random() * 4; // Slow, gentle pulse
    return `${animationName} ${duration}s ${idx * 0.2}s ease-in-out infinite`;
  };

  const handleCalibrationWrapper = (id: number) => {
      onCalibrate(id);
      if (setOrbMode) {
          setOrbMode('CONCORDANCE');
          setTimeout(() => setOrbMode('STANDBY'), 1000);
      }
  }

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
      <h3 className="font-orbitron text-md text-warm-grey mb-2 text-center">Calibrate Concordance Field</h3>
      <div className="w-full aspect-video bg-black/20 rounded-md p-2 relative overflow-hidden">
        <svg viewBox="0 0 110 100" className={`w-full h-full ${isVibrationHigh ? 'shake-effect' : ''}`}>
          <defs>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Constellation Lines */}
          {constellations.map((path, idx) => (
            <path
              key={`const-${idx}`}
              d={`M ${path.map(starId => `${stars[starId-1].cx} ${stars[starId-1].cy}`).join(' L ')}`}
              fill="none"
              stroke="rgba(230, 199, 127, 0.6)"
              strokeWidth="0.5"
              strokeLinejoin="round"
              className="transition-opacity duration-500"
              style={{
                opacity: 0.2 + stability * 0.8,
                animation: lineAnimation,
              }}
            />
          ))}

          {/* Stars */}
          {stars.map((star, idx) => (
            <g key={star.id} onClick={() => handleCalibrationWrapper(star.id)} className="cursor-pointer group" aria-label={`Calibrate star ${star.name}`}>
               {calibrationTargetId === star.id && (
                <circle
                    cx={star.cx}
                    cy={star.cy}
                    r={8}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="1"
                    className="calibration-target-ring"
                    style={{ pointerEvents: 'none' }}
                />
              )}
              <circle
                cx={star.cx}
                cy={star.cy}
                r={1 + (idx % 3)} // vary size
                fill="white"
                filter="url(#starGlow)"
                className="transition-all duration-300 group-hover:r-[4]"
                style={{ 
                    opacity: 0.6 + stability * 0.4,
                    animation: starAnimation(idx),
                }}
              />
               {/* Calibration Effect */}
               {calibrationEffect?.starId === star.id && (
                 <circle
                    cx={star.cx}
                    cy={star.cy}
                    r={5}
                    fill="none"
                    stroke={calibrationEffect.success ? 'var(--pearl)' : 'var(--rose)'}
                    className={calibrationEffect.success ? 'calibration-success' : ''}
                    style={{ pointerEvents: 'none' }}
                 />
               )}
               {calibrationEffect?.starId === star.id && !calibrationEffect.success && (
                  <circle
                    cx={star.cx}
                    cy={star.cy}
                    r={1 + (idx % 3)}
                    className="calibration-fail"
                    style={{ pointerEvents: 'none' }}
                  />
               )}
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 pt-3 border-t border-dark-border/50 flex justify-between text-xs">
        <div className='text-left'>
            <p className='text-warm-grey uppercase'>Connection Stability</p>
            <p className='font-orbitron text-lg text-pearl'>{(stability * 100).toFixed(1)}%</p>
        </div>
        <div className='text-right'>
            <Tooltip text="Lower is better. Represents the deviation from the optimal harmonic resonance with the Lyran network. High drift can lead to data corruption.">
                <p className='text-warm-grey uppercase cursor-help'>Alignment Drift</p>
            </Tooltip>
            <p className={`font-orbitron text-lg ${drift > 0.1 ? 'text-gold' : 'text-pearl'}`}>
                {(drift * 100).toFixed(3)}%
            </p>
        </div>
      </div>
    </div>
  );
});