
import React, { useMemo, useState, useEffect } from 'react';
import { MotherboardOverlay } from './MotherboardOverlay';
import { BreathBar } from './BreathBar';
import { Tooltip } from './Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  resonanceFactor?: number;
  drift?: number;
}

// Inline Noise SVG Data URI for offline reliability
const NOISE_DATA_URI = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E";

const SpectralTicker: React.FC = () => {
    const [telemetry, setTelemetry] = useState<string[]>([]);
    
    useEffect(() => {
        const codes = ["1.617GHz", "RHO_SYNC", "PHI_STABLE", "NULL_PTR_VOID", "CAUSAL_LOCK", "PARITY_OK", "NODE_0x88", "SOPHIA_PRIME"];
        const interval = setInterval(() => {
            setTelemetry(prev => {
                const next = [...prev, codes[Math.floor(Math.random() * codes.length)]];
                if (next.length > 20) return next.slice(1);
                return next;
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-12 font-mono text-[7px] text-pearl/20 uppercase tracking-[0.8em] whitespace-nowrap animate-ticker">
            {telemetry.map((t, i) => <span key={i}>{t}</span>)}
            {telemetry.map((t, i) => <span key={`dup-${i}`}>{t}</span>)}
        </div>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children, breathCycle, isGrounded, resonanceFactor = 1.0, drift = 0 }) => {
  const isHighResonance = resonanceFactor > 0.95;
  const isDecoherent = resonanceFactor < 0.6;
  
  const blurAmount = useMemo(() => 20 - (resonanceFactor * 10), [resonanceFactor]);
  const grainOpacity = useMemo(() => 0.03 + (1 - resonanceFactor) * 0.05, [resonanceFactor]);

  return (
    <div className={`relative min-h-screen w-full bg-[#030303] text-slate-200 font-sans antialiased flex flex-col overflow-hidden transition-all duration-[2000ms] ${isHighResonance ? 'resonance-peak' : ''} ${isDecoherent ? 'resonance-low' : ''}`}>
      
      <div className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000" style={{ backgroundImage: `url("${NOISE_DATA_URI}")`, opacity: grainOpacity }}></div>

      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(109, 40, 217, ${0.1 * resonanceFactor}), transparent 80%),
                       radial-gradient(circle at 80% 20%, rgba(255, 215, 0, ${0.05 * resonanceFactor}), transparent 60%)`,
          filter: `blur(${blurAmount}px)`
        }}
      />

      {/* --- THE SOVEREIGN FRAME (HUD OVERLAY) --- */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-1 md:m-2 overflow-hidden rounded-lg">
          {/* Top Ticker Array */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-4 flex items-center overflow-hidden border-x border-b border-white/5 bg-black/40 backdrop-blur-sm rounded-b-sm">
              <SpectralTicker />
          </div>

          {/* Micro Labels positioned for 0 obstruction */}
          <div className="absolute top-2 left-4 md:top-3 md:left-5 flex flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Your unique institutional node identifier within the ÆTHERIOS lattice. Used for routing causal decrees.">
                  <div>
                      <span className="text-[6px] font-mono text-gold uppercase tracking-[0.4em] font-black">Institutional_Node</span>
                      <span className="text-[8px] font-mono text-pearl uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
                  </div>
              </Tooltip>
          </div>
          
          <div className="absolute top-2 right-4 md:top-3 md:right-5 text-right opacity-30 group-hover:opacity-60 transition-opacity pointer-events-auto cursor-help">
              <Tooltip text="Measures the temporal misalignment of local causal events from the prime timeline. Drift > 0.05 indicates instability.">
                  <div className="flex flex-col gap-0.5 items-end">
                      <span className="text-[6px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black">Causal_Drift</span>
                      <span className={`text-[8px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(6)}</span>
                  </div>
              </Tooltip>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
      
      <MotherboardOverlay />
      
      {/* Optimized Main Content Area with maximized screen real-estate */}
      <div className="relative z-20 flex-grow flex flex-col px-2 py-2 md:px-4 md:py-3 max-w-[2400px] mx-auto w-full h-full overflow-hidden">
        {children}
      </div>
      
      <footer className="relative z-30 pointer-events-none mt-auto" role="contentinfo">
        <BreathBar cycle={breathCycle} isGrounded={isGrounded} />
      </footer>

      <style>{`
        @keyframes ticker {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 40s linear infinite; }
        .resonance-peak { filter: contrast(1.05) brightness(1.05); }
      `}</style>
    </div>
  );
};
