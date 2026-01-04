
import React, { useMemo, useState, useEffect } from 'react';
import { MotherboardOverlay } from './MotherboardOverlay';
import { BreathBar } from './BreathBar';

interface LayoutProps {
  children: React.ReactNode;
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  resonanceFactor?: number;
  drift?: number;
}

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
      
      <div className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`, opacity: grainOpacity }}></div>

      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(109, 40, 217, ${0.1 * resonanceFactor}), transparent 80%),
                       radial-gradient(circle at 80% 20%, rgba(255, 215, 0, ${0.05 * resonanceFactor}), transparent 60%)`,
          filter: `blur(${blurAmount}px)`
        }}
      />

      {/* --- THE SOVEREIGN FRAME (HUD OVERLAY) --- */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-2 md:m-4">
          {/* Top Ticker Array */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-5 flex items-center overflow-hidden border-x border-white/5 bg-black/20">
              <SpectralTicker />
          </div>

          {/* Micro Labels positioned to avoid Header overlap */}
          <div className="absolute top-2 left-4 md:top-4 md:left-6 flex flex-col gap-0.5">
              <span className="text-[7px] font-mono text-gold uppercase tracking-[0.4em] font-black opacity-40">System_ID</span>
              <span className="text-[9px] font-mono text-pearl/30 uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
          </div>
          
          <div className="absolute top-2 right-4 md:top-4 md:right-6 text-right flex flex-col gap-0.5">
              <span className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black opacity-40">Causal_Drift</span>
              <span className={`text-[9px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400/50' : 'text-cyan-400/50'}`}>Δ +{drift.toFixed(6)}</span>
          </div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-4 left-6 hidden xl:flex flex-col gap-1">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">Parity_RX</span>
              <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
                  <span className="text-[10px] font-mono text-pearl/30 uppercase font-bold tracking-widest">1.617 GHz L-BAND</span>
              </div>
          </div>

          <div className="absolute bottom-4 right-6 hidden xl:flex flex-col gap-1 text-right">
              <span className="text-[8px] font-mono text-gold uppercase tracking-[0.6em] font-black">Resonance_Coefficient</span>
              <span className="text-2xl font-orbitron text-pearl/20 leading-none font-extrabold transition-all duration-1000">{(resonanceFactor * 100).toFixed(4)}%</span>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
      
      <MotherboardOverlay />
      
      <div className="relative z-20 flex-grow flex flex-col px-6 py-6 md:px-16 md:py-10 max-w-[2400px] mx-auto w-full h-full overflow-hidden">
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
      `}</style>
    </div>
  );
};
