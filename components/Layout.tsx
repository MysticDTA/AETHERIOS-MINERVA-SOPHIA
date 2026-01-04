
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
  
  // Calculate atmospheric intensities
  const blurAmount = useMemo(() => 20 - (resonanceFactor * 10), [resonanceFactor]);
  const grainOpacity = useMemo(() => 0.03 + (1 - resonanceFactor) * 0.05, [resonanceFactor]);

  return (
    <div className={`relative min-h-screen w-full bg-[#030303] text-slate-200 font-sans antialiased flex flex-col overflow-hidden transition-all duration-[2000ms] ${isHighResonance ? 'resonance-peak' : ''} ${isDecoherent ? 'resonance-low' : ''}`}>
      
      {/* --- ATMOSPHERIC LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`, opacity: grainOpacity }}></div>

      {/* Dynamic Aura Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(109, 40, 217, ${0.1 * resonanceFactor}), transparent 80%),
                       radial-gradient(circle at 80% 20%, rgba(255, 215, 0, ${0.05 * resonanceFactor}), transparent 60%)`,
          filter: `blur(${blurAmount}px)`
        }}
      />

      {/* --- THE SOVEREIGN FRAME (HUD OVERLAY) --- */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-4">
          {/* Top Ticker Array */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-6 flex items-center overflow-hidden border-x border-white/5">
              <SpectralTicker />
          </div>

          {/* Top Left: System ID */}
          <div className="absolute top-0 left-0 p-8 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-gold uppercase tracking-[0.6em] font-black">Institutional_Node</span>
              <span className="text-[12px] font-mono text-pearl/50 uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(248,245,236,0.2)]">0x88_SOPHIA_PRIME</span>
          </div>
          {/* Top Right: Real-time Drift */}
          <div className="absolute top-0 right-0 p-8 text-right flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">Causal_Drift_Index</span>
              <span className={`text-[12px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(8)}Ψ</span>
          </div>
          {/* Bottom Left: Logic Parity */}
          <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">Parity_Frequency</span>
              <div className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_12px_cyan]" />
                  <span className="text-[12px] font-mono text-pearl/50 uppercase font-bold tracking-widest">1.617 GHz L-BAND_RX</span>
              </div>
          </div>
          {/* Bottom Right: Resonance Display */}
          <div className="absolute bottom-0 right-0 p-8 text-right flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gold uppercase tracking-[0.6em] font-black">Rho_Synergy_Coefficient</span>
              <span className="text-4xl font-orbitron text-pearl text-glow-pearl leading-none font-extrabold transition-all duration-1000">{(resonanceFactor * 100).toFixed(4)}<span className="text-sm opacity-20 ml-1">%</span></span>
          </div>

          {/* Side Brackets Decorative */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
      
      <MotherboardOverlay />
      
      <div className="relative z-20 flex-grow flex flex-col px-12 py-10 md:px-16 md:py-12 max-w-[2400px] mx-auto w-full h-full overflow-hidden">
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
