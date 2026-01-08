
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SentientLatticeOverlay } from './SentientLatticeOverlay';
import { BreathBar } from './BreathBar';
import { Tooltip } from './Tooltip';
import { OrbMode } from '../types';
import { RealTimeIntelTicker } from './RealTimeIntelTicker';

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

export const Layout: React.FC<LayoutProps> = ({ 
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const blurAmount = useMemo(() => 20 - (resonanceFactor * 10), [resonanceFactor]);
  const grainOpacity = useMemo(() => 0.03 + (1 - resonanceFactor) * 0.05, [resonanceFactor]);

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
          const y = (clientY / innerHeight - 0.5) * 2;
          setMousePos({ x, y });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
        ref={containerRef}
        className={`relative min-h-screen w-full bg-[#030303] text-slate-200 font-sans antialiased flex flex-col overflow-hidden transition-all duration-[2000ms] ${isHighResonance ? 'resonance-peak' : ''} ${isDecoherent ? 'resonance-low' : ''}`}
    >
      
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000" style={{ backgroundImage: `url("${NOISE_DATA_URI}")`, opacity: grainOpacity }}></div>

      {/* Atmospheric Glow Layer with Parallax */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[1000ms]"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 5}% ${40 + mousePos.y * 5}%, rgba(109, 40, 217, ${0.05 * resonanceFactor}), transparent 80%),
                       radial-gradient(circle at ${80 - mousePos.x * 5}% ${20 - mousePos.y * 5}%, rgba(255, 215, 0, ${0.03 * resonanceFactor}), transparent 60%)`,
          filter: `blur(${blurAmount}px)`,
          transform: `scale(1.05)` // Slight scale to prevent edge bleeding
        }}
      />

      {/* Sentient Lattice Overlay */}
      <SentientLatticeOverlay orbMode={orbMode} rho={resonanceFactor} coherence={coherence} />

      {/* --- THE SOVEREIGN FRAME (HUD OVERLAY) --- */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-1 md:m-2 overflow-hidden rounded-lg">
          {/* Top Intelligent Ticker */}
          <RealTimeIntelTicker orbMode={orbMode} rho={resonanceFactor} />

          {/* Micro Labels */}
          <div className="absolute top-2 left-4 md:top-3 md:left-5 flex flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Your unique institutional node identifier within the ÆTHERIOS lattice.">
                  <div>
                      <span className="text-[6px] font-mono text-gold uppercase tracking-[0.4em] font-black">Institutional_Node</span>
                      <span className="text-[8px] font-mono text-pearl uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
                  </div>
              </Tooltip>
          </div>
          
          <div className="absolute top-2 right-4 md:top-3 md:right-5 text-right opacity-30 group-hover:opacity-60 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Measures the temporal misalignment of local causal events.">
                  <div className="flex flex-col gap-0.5 items-end">
                      <span className="text-[6px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black">Causal_Drift</span>
                      <span className={`text-[8px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(6)}</span>
                  </div>
              </Tooltip>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
      
      {/* Optimized Main Content Area */}
      <div className="relative z-20 flex-grow flex flex-col px-2 py-2 md:px-4 md:py-3 max-w-[2400px] mx-auto w-full h-full overflow-hidden">
        {children}
      </div>
      
      <footer className="relative z-30 pointer-events-none mt-auto" role="contentinfo">
        <BreathBar cycle={breathCycle} isGrounded={isGrounded} />
      </footer>

      <style>{`
        .resonance-peak { filter: contrast(1.05) brightness(1.05); }
      `}</style>
    </div>
  );
};
