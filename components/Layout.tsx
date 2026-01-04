
import React, { useMemo } from 'react';
import { MotherboardOverlay } from './MotherboardOverlay';
import { BreathBar } from './BreathBar';

interface LayoutProps {
  children: React.ReactNode;
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  resonanceFactor?: number;
  drift?: number;
}

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
          {/* Top Left: System ID */}
          <div className="absolute top-0 left-0 p-6 flex flex-col gap-1.5">
              <span className="text-[8px] font-mono text-gold uppercase tracking-[0.6em] font-black">Institutional_Node</span>
              <span className="text-[11px] font-mono text-pearl/50 uppercase tracking-widest font-bold">0x88_SOPHIA_PRIME</span>
          </div>
          {/* Top Right: Real-time Drift */}
          <div className="absolute top-0 right-0 p-6 text-right flex flex-col gap-1.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">Causal_Drift_Index</span>
              <span className={`text-[11px] font-mono font-bold ${drift > 0.05 ? 'text-rose-400' : 'text-cyan-400'}`}>Δ +{drift.toFixed(6)}Ψ</span>
          </div>
          {/* Bottom Left: Logic Parity */}
          <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-1.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">Parity_Frequency</span>
              <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
                  <span className="text-[11px] font-mono text-pearl/50 uppercase font-bold tracking-widest">1.617 GHz L-BAND</span>
              </div>
          </div>
          {/* Bottom Right: Resonance Display */}
          <div className="absolute bottom-0 right-0 p-6 text-right flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gold uppercase tracking-[0.6em] font-black">Rho_Synergy</span>
              <span className="text-3xl font-orbitron text-pearl text-glow-pearl leading-none font-extrabold">{(resonanceFactor * 100).toFixed(3)}%</span>
          </div>

          {/* Side Bars Decorative */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-32 bg-white/5" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-32 bg-white/5" />
      </div>
      
      <MotherboardOverlay />
      
      <div className="relative z-20 flex-grow flex flex-col px-8 py-8 md:px-12 md:py-10 max-w-[2200px] mx-auto w-full h-full overflow-hidden">
        {children}
      </div>
      
      <footer className="relative z-30 pointer-events-none mt-auto" role="contentinfo">
        <BreathBar cycle={breathCycle} isGrounded={isGrounded} />
      </footer>

      <style>{`
        @keyframes aurora-bg {
            from { transform: scale(1) translate(0, 0); opacity: 0.8; }
            to { transform: scale(1.1) translate(1%, 1.5%); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
