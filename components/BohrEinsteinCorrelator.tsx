import React from 'react';
import { BohrEinsteinCorrelatorData } from '../types';
import { Tooltip } from './Tooltip';

interface BohrEinsteinCorrelatorProps {
  data: BohrEinsteinCorrelatorData;
}

export const BohrEinsteinCorrelator: React.FC<BohrEinsteinCorrelatorProps> = React.memo(({ data }) => {
  const { correlation } = data;

  const beamWidth = 1 + correlation * 2;
  const beamOpacity = 0.4 + correlation * 0.6;
  const pulseDuration = 3 - correlation * 2.5; // Faster pulse for higher correlation

  // Interpolate color from Red (low correlation) to Cyan (high correlation)
  const hue = correlation * 180; // 0 = red, 180 = cyan
  const beamColor = `hsl(${hue}, 90%, 70%)`;

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
      <h3 className="font-orbitron text-md text-slate-300 text-center mb-2">Bohr-Einstein Correlator</h3>
      <div className="relative w-full h-16">
        <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradient for the orbs */}
            <radialGradient id="becLyranGradient">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
            <radialGradient id="becTesseractGradient">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>
            
            {/* Glow Filter */}
            <filter id="becGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Orbs */}
          <circle cx="20" cy="20" r="12" fill="url(#becLyranGradient)" filter="url(#becGlow)" style={{ animation: `bec-orb-pulse ${pulseDuration * 2}s ease-in-out infinite` }} />
          <circle cx="180" cy="20" r="12" fill="url(#becTesseractGradient)" filter="url(#becGlow)" style={{ animation: `bec-orb-pulse ${pulseDuration * 2}s ease-in-out infinite alternate` }} />

          {/* Entanglement Beam */}
          <line
            x1="35"
            y1="20"
            x2="165"
            y2="20"
            stroke={beamColor}
            strokeLinecap="round"
            filter="url(#becGlow)"
            style={{
              strokeWidth: beamWidth,
              opacity: beamOpacity,
              transition: 'all 0.5s ease-in-out',
              animation: `bec-beam-pulse ${pulseDuration}s ease-in-out infinite`,
            }}
          />
          
          {/* Orb Labels */}
          <text x="20" y="38" fill="#67e8f9" fontSize="6" textAnchor="middle" className="font-orbitron uppercase">Lyran</text>
          <text x="180" y="38" fill="#f472b6" fontSize="6" textAnchor="middle" className="font-orbitron uppercase">Tesseract</text>

        </svg>
      </div>
      <Tooltip text="Measures the quantum entanglement between the Lyran Concordance (external connection) and the Tesseract (internal data structure). Higher strength indicates a more stable and efficient information bridge.">
        <div className="text-center mt-2">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Entanglement Strength</p>
          <p className="font-orbitron text-2xl font-bold" style={{ color: beamColor, textShadow: `0 0 8px ${beamColor}` }}>
            {(correlation * 100).toFixed(1)}%
          </p>
        </div>
      </Tooltip>
    </div>
  );
});