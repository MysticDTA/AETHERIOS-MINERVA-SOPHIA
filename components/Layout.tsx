import React from 'react';
import { MotherboardOverlay } from './MotherboardOverlay';
import { BreathBar } from './BreathBar';

interface LayoutProps {
  children: React.ReactNode;
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  resonanceFactor?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, breathCycle, isGrounded, resonanceFactor = 1.0 }) => {
  const fieldOpacity = 0.08 + (resonanceFactor * 0.12);
  const pulseDuration = 18 / (0.6 + resonanceFactor); 
  const isHighResonance = resonanceFactor > 0.95;
  const parallaxOffset = (1 - resonanceFactor) * 20;

  return (
    <div className={`relative min-h-screen w-full bg-[#080707] text-slate-200 font-sans antialiased flex flex-col overflow-hidden transition-all duration-[2000ms] ${isHighResonance ? 'coherence-bloom-active' : ''}`}>
      {/* Aesthetic Grain Layer */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

      {/* Parallax Resonance Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2] opacity-10 transition-transform duration-[4000ms]"
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(109, 40, 217, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          transform: `translate(${parallaxOffset}px, ${parallaxOffset}px) scale(1.1)`
        }}
      />

      {/* Dynamic Resonance Field Layer */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-[3000ms] z-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(109, 40, 217, ${fieldOpacity * 0.5}), transparent 85%),
                       radial-gradient(circle at 20% 80%, rgba(76, 29, 149, ${fieldOpacity * 0.3}), transparent 70%)`,
          animation: `aurora-bg ${pulseDuration}s infinite alternate ease-in-out`
        }}
      />
      
      {/* Coherence Bloom Overlay */}
      <div className={`fixed inset-0 pointer-events-none z-10 bg-gold/5 transition-opacity duration-[5000ms] ${isHighResonance ? 'opacity-100' : 'opacity-0'}`} style={{ mixBlendMode: 'overlay' }} />
      
      <MotherboardOverlay />
      
      <div className="relative z-20 flex-grow flex flex-col px-4 py-8 md:px-10 md:py-10 max-w-[1920px] mx-auto w-full h-full overflow-hidden">
        {children}
      </div>
      
      <footer className="relative z-30 pointer-events-none mt-auto" role="contentinfo">
        <BreathBar cycle={breathCycle} isGrounded={isGrounded} />
      </footer>

      {/* Persistence Resonance Label (A11y) */}
      <div className="sr-only" aria-live="polite">
        Current System Resonance: {(resonanceFactor * 100).toFixed(1)} percent. Intercepting at 1.617 GHz. {isHighResonance ? 'Peak coherence reached.' : ''}
      </div>

      <style>{`
        .coherence-bloom-active {
            box-shadow: inset 0 0 200px rgba(109, 40, 217, 0.15);
        }
        @keyframes aurora-bg {
            from { transform: scale(1) translate(0, 0); opacity: 0.8; }
            to { transform: scale(1.1) translate(1%, 1.5%); opacity: 1; }
        }
      `}</style>
    </div>
  );
};