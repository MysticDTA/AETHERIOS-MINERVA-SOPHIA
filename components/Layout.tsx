
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { UnifiedLatticeBackground } from './visuals/UnifiedLatticeBackground';
import { BreathBar } from './BreathBar';
import { Tooltip } from './Tooltip';
import { OrbMode } from '../types';
import { RealTimeIntelTicker } from './RealTimeIntelTicker';
import { UniversalConnectome } from './UniversalConnectome';

interface LayoutProps {
  children: React.ReactNode;
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  resonanceFactor?: number;
  drift?: number;
  orbMode?: OrbMode;
  coherence?: number;
}

const NOISE_DATA_URI = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E";

export const Layout: React.FC<LayoutProps> = React.memo(({ 
    children, 
    breathCycle, 
    isGrounded, 
    resonanceFactor = 1.0, 
    drift = 0,
    orbMode = 'STANDBY',
    coherence = 0.5
}) => {
  const isHighResonance = resonanceFactor > 0.95;
  const isDecoherent = resonanceFactor < 0.6;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const grainOpacity = useMemo(() => 0.04 + (1 - resonanceFactor) * 0.06, [resonanceFactor]);

  return (
    <div 
        ref={containerRef}
        className={`relative min-h-screen w-full bg-dark-bg text-pearl font-sans antialiased flex flex-col overflow-x-hidden transition-all duration-[2000ms] ${isHighResonance ? 'resonance-peak' : ''} ${isDecoherent ? 'resonance-low' : ''}`}
    >
      
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 mix-blend-soft-light" style={{ backgroundImage: `url("${NOISE_DATA_URI}")`, opacity: grainOpacity }}></div>
      
      {/* CRT Scanline Effect */}
      <div className="scanlines"></div>
      
      {/* Cinematic Vignette */}
      <div className="vignette"></div>

      {/* 3D Unified Graphics Pipeline */}
      <UnifiedLatticeBackground rho={resonanceFactor} coherence={coherence} orbMode={orbMode} />

      {/* --- UNIVERSAL CONNECTOME INTERCONNECT LAYER (NEW) --- */}
      <UniversalConnectome rho={resonanceFactor} coherence={coherence} orbMode={orbMode} />

      {/* --- THE SOVEREIGN FRAME (HUD OVERLAY) --- */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-2 md:m-3 overflow-hidden rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {/* Top Intelligent Ticker */}
          <RealTimeIntelTicker orbMode={orbMode} rho={resonanceFactor} />

          {/* Micro Labels */}
          <div className="absolute top-3 left-5 md:top-4 md:left-6 flex flex-col gap-0.5 opacity-40 group-hover:opacity-80 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Your unique institutional node identifier within the ÆTHERIOS lattice.">
                  <div>
                      <span className="text-[6px] font-mono text-gold uppercase tracking-[0.4em] font-black block mb-0.5">Institutional_Node</span>
                      <span className="text-[9px] font-mono text-pearl uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
                  </div>
              </Tooltip>
          </div>
          
          <div className="absolute top-3 right-5 md:top-4 md:right-6 text-right opacity-40 group-hover:opacity-80 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Measures the temporal misalignment of local causal events.">
                  <div className="flex flex-col gap-0.5 items-end">
                      <span className="text-[6px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black block mb-0.5">Causal_Drift</span>
                      <span className={`text-[9px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(6)}Ψ</span>
                  </div>
              </Tooltip>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-24 md:h-48 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-24 md:h-48 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      </div>
      
      {/* Optimized Main Content Area */}
      <div className="relative z-20 flex-grow flex flex-col px-3 py-3 md:px-6 md:py-4 max-w-[2400px] mx-auto w-full h-full">
        {children}
      </div>
      
      <footer className="relative z-30 pointer-events-none mt-auto" role="contentinfo">
        <BreathBar cycle={breathCycle} isGrounded={isGrounded} />
      </footer>
    </div>
  );
});
