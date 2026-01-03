import React, { useState } from 'react';
import { PillarData, PillarId } from '../types';
import { Tooltip } from './Tooltip';

interface PillarsProps {
  pillars: Record<PillarId, PillarData>;
  onBoost: (pillarId: PillarId) => void;
}

const PILLAR_CONFIG = {
    ARCTURIAN: { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)' },
    LEMURIAN: { color: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.5)' },
    ATLANTEAN: { color: '#facc15', glow: 'rgba(250, 204, 21, 0.5)' },
};

const PillarColumn: React.FC<{ pillar: PillarData; onBoost: () => void }> = ({ pillar, onBoost }) => {
    const { activation, name, description } = pillar;
    const heightPercent = Math.max(0, Math.min(100, activation * 100));
    const config = PILLAR_CONFIG[pillar.id];
    const activationPercentage = (activation * 100).toFixed(1);
    const [isBoosting, setIsBoosting] = useState(false);

    const handleBoostClick = () => {
        onBoost();
        setIsBoosting(true);
        setTimeout(() => setIsBoosting(false), 500);
    };

    return (
        <div className="flex-1 flex flex-col items-center gap-3 relative group">
             <Tooltip text={description}>
                <button 
                    onClick={handleBoostClick}
                    className={`relative w-16 h-48 bg-slate-900/40 rounded-sm border border-slate-700 overflow-hidden transition-all duration-200 hover:border-pearl/50 focus:outline-none focus:ring-1 focus:ring-pearl ${isBoosting ? 'pillar-boost-animation' : ''}`}
                    aria-label={`Boost ${name} Cradle. Current activation: ${activationPercentage}%`}
                >
                    {/* Background Grid for Pillar */}
                    <div className="absolute inset-0 opacity-20" 
                         style={{ backgroundImage: `linear-gradient(0deg, transparent 24%, ${config.color} 25%, ${config.color} 26%, transparent 27%, transparent 74%, ${config.color} 75%, ${config.color} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${config.color} 25%, ${config.color} 26%, transparent 27%, transparent 74%, ${config.color} 75%, ${config.color} 76%, transparent 77%, transparent)`, backgroundSize: '20px 20px' }} 
                    />

                    {/* Active Energy Fill */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
                        style={{ 
                            height: `${heightPercent}%`, 
                            backgroundColor: config.color,
                            opacity: 0.2,
                            boxShadow: `0 0 20px ${config.color}`
                        }}
                    />
                    
                    {/* Rising Particles Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                         <div className="absolute inset-0 opacity-50"
                              style={{
                                  backgroundImage: `radial-gradient(${config.color} 1px, transparent 1px)`,
                                  backgroundSize: '10px 10px',
                                  transformOrigin: 'bottom',
                                  animation: `rise 3s linear infinite`
                              }}
                         />
                    </div>
                    
                    {/* Top Cap Glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `0 0 10px ${config.color}` }} />

                    {/* Level Indicator Line */}
                    <div 
                        className="absolute w-full h-0.5 bg-white transition-all duration-500"
                        style={{ bottom: `${heightPercent}%`, boxShadow: `0 0 5px white` }}
                    />
                    
                    <style>{`
                        @keyframes rise {
                            from { transform: translateY(0); }
                            to { transform: translateY(-20px); }
                        }
                    `}</style>
                </button>
            </Tooltip>
            
            <div className="text-center z-10">
                <h4 className="font-orbitron text-xs text-warm-grey uppercase tracking-widest mb-1">{name}</h4>
                <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color, boxShadow: `0 0 5px ${config.color}` }} />
                    <p className="font-mono text-xs text-pearl">
                        {activationPercentage}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export const Pillars: React.FC<PillarsProps> = React.memo(({ pillars, onBoost }) => {
  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col h-full relative overflow-hidden">
      {/* Decorative Corner Brackets */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-warm-grey/30" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-warm-grey/30" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-warm-grey/30" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-warm-grey/30" />

      <h3 className="font-orbitron text-md text-warm-grey mb-6 text-center">Resonance Cradles</h3>
      <div className="flex-1 flex justify-around items-end pb-2">
          <PillarColumn pillar={pillars.ARCTURIAN} onBoost={() => onBoost('ARCTURIAN')} />
          <PillarColumn pillar={pillars.LEMURIAN} onBoost={() => onBoost('LEMURIAN')} />
          <PillarColumn pillar={pillars.ATLANTEAN} onBoost={() => onBoost('ATLANTEAN')} />
      </div>
    </div>
  );
});