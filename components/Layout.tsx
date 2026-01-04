
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
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5 m-2 md:m-4 overflow-hidden">
          {/* Top Ticker Array */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-5 flex items-center overflow-hidden border-x border-white/5 bg-black/40">
              <SpectralTicker />
          </div>

          {/* Micro Labels positioned for 0 obstruction */}
          <div className="absolute top-2 left-4 md:top-4 md:left-6 flex flex-col gap-0.5 opacity-20 group-hover:opacity-60 transition-opacity">
              <span className="text-[6px] font-mono text-gold uppercase tracking-[0.4em] font-black">Institutional_Node</span>
              <span className="text-[8px] font-mono text-pearl uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
          </div>
          
          <div className="absolute top-2 right-4 md:top-4 md:right-6 text-right flex flex-col gap-0.5 opacity-20 group-hover:opacity-60 transition-opacity">
              <span className="text-[6px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black">Causal_Drift</span>
              <span className={`text-[8px] font-mono font-bold transition-colors duration-1000 ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(6)}</span>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 md:h-64 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
      
      <MotherboardOverlay />
      
      <div className="relative z-20 flex-grow flex flex-col px-4 py-4 md:px-16 md:py-8 max-w-[2400px] mx-auto w-full h-full overflow-hidden">
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
