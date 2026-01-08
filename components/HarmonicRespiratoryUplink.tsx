
import React, { useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';

interface HarmonicRespiratoryUplinkProps {
  breathCycle: 'INHALE' | 'EXHALE';
  efficiency: number; // 0-1
  throughput: number; // 0-100
}

export const HarmonicRespiratoryUplink: React.FC<HarmonicRespiratoryUplinkProps> = ({ breathCycle, efficiency, throughput }) => {
  const isInhale = breathCycle === 'INHALE';
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (breathCycle === 'INHALE') {
        setCycleCount(c => c + 1);
    }
  }, [breathCycle]);

  // Dynamic colors based on cycle
  const primaryColor = isInhale ? 'var(--pearl)' : 'var(--gold)';
  const secondaryColor = isInhale ? 'var(--cyan-400)' : 'var(--rose)';
  
  // Particle Direction: Inward for Inhale, Outward for Exhale
  // We use a CSS mask or transform to flip direction
  const flowDirection = isInhale ? 'normal' : 'reverse';

  return (
    <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-6 rounded-lg border-glow-pearl backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000"
         style={{ borderColor: isInhale ? 'rgba(165, 243, 252, 0.3)' : 'rgba(244, 194, 194, 0.3)' }}>
      
      <div className="absolute top-4 left-4 z-10">
        <h3 className="font-orbitron text-lg text-warm-grey">Respiratory Uplink</h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Cycle: {cycleCount}</p>
      </div>

      <div className="absolute top-4 right-4 z-10 text-right">
         <p className="text-xs text-warm-grey uppercase">Phase</p>
         <p className={`font-orbitron text-xl font-bold transition-colors duration-500 ${isInhale ? 'text-cyan-300' : 'text-gold'}`}>
             {breathCycle}
         </p>
      </div>

      {/* Main Respiratory Visualizer */}
      <div className="relative w-64 h-64 flex items-center justify-center my-8">
        {/* Background Rings */}
        <div className="absolute inset-0 rounded-full border border-slate-700/50 scale-150" />
        <div className="absolute inset-0 rounded-full border border-slate-700/30 scale-[1.8]" />
        
        {/* Breathing Core */}
        <div 
            className="absolute rounded-full transition-all duration-[4000ms] ease-in-out blur-xl opacity-30"
            style={{
                width: isInhale ? '100%' : '40%',
                height: isInhale ? '100%' : '40%',
                backgroundColor: primaryColor,
            }}
        />
        
        <div 
            className="absolute rounded-full border-2 transition-all duration-[4000ms] ease-in-out flex items-center justify-center"
            style={{
                width: isInhale ? '90%' : '30%',
                height: isInhale ? '90%' : '30%',
                borderColor: primaryColor,
                boxShadow: `0 0 30px ${secondaryColor}`,
                opacity: 0.8
            }}
        >
             {/* Center Text */}
             <div className="text-center transition-all duration-500" style={{ transform: isInhale ? 'scale(1)' : 'scale(1.2)' }}>
                 <p className="text-[10px] font-mono text-dark-bg font-bold bg-pearl/80 px-2 rounded mb-1 mx-auto w-max">
                     {isInhale ? 'ACCUMULATING' : 'TRANSMITTING'}
                 </p>
                 <p className="font-orbitron text-2xl font-bold text-white drop-shadow-md">
                     {throughput.toFixed(0)} <span className="text-xs">TB/s</span>
                 </p>
             </div>
        </div>

        {/* Particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
             <defs>
                 <radialGradient id="breathGradient">
                     <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
                     <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
                 </radialGradient>
             </defs>
             {Array.from({ length: 12 }).map((_, i) => (
                 <circle 
                    key={i} 
                    r={1.5} 
                    fill="url(#breathGradient)"
                    className="transition-all duration-1000"
                 >
                     <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite"
                        path="M 50 50 L 50 5" 
                        keyPoints={isInhale ? "1;0" : "0;1"}
                        keyTimes="0;1"
                        begin={`${i * 0.3}s`}
                     />
                 </circle>
             ))}
             {Array.from({ length: 12 }).map((_, i) => (
                 <circle 
                    key={`r-${i}`} 
                    r={1} 
                    fill={secondaryColor}
                    opacity="0.6"
                 >
                     <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from={`0 50 50`} 
                        to={`360 50 50`} 
                        dur="20s" 
                        repeatCount="indefinite" 
                     />
                     <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite"
                        path="M 50 50 L 95 50" 
                        keyPoints={isInhale ? "1;0" : "0;1"}
                        keyTimes="0;1"
                        begin={`${i * 0.3}s`}
                     />
                 </circle>
             ))}
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="w-full grid grid-cols-2 gap-4 border-t border-dark-border/50 pt-4">
          <Tooltip text="The efficiency of the resonant coupling between the operator's rhythm and the system's data cycle.">
            <div className="bg-black/20 p-2 rounded text-center">
                <span className="text-xs text-warm-grey uppercase block mb-1">Harmonic Efficiency</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-pearl transition-all duration-1000" style={{ width: `${efficiency * 100}%` }} />
                </div>
                <span className="font-mono text-pearl">{(efficiency * 100).toFixed(1)}%</span>
            </div>
          </Tooltip>
          
          <Tooltip text="The status of the Aetheric Data Buffer. Fills during Inhale, Empties during Exhale.">
            <div className="bg-black/20 p-2 rounded text-center">
                <span className="text-xs text-warm-grey uppercase block mb-1">Buffer State</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                    <div 
                        className={`h-full transition-all duration-[4000ms] ease-in-out ${isInhale ? 'bg-cyan-400' : 'bg-gold'}`} 
                        style={{ width: isInhale ? '100%' : '5%' }} 
                    />
                </div>
                <span className={`font-mono text-xs ${isInhale ? 'text-cyan-300' : 'text-gold'}`}>
                    {isInhale ? 'CHARGING' : 'FLUSHING'}
                </span>
            </div>
          </Tooltip>
      </div>
    </div>
  );
};
