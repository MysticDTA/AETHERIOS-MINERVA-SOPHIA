import React from 'react';
import { TesseractData } from '../types';
import { Tooltip } from './Tooltip';

interface TesseractMonitorProps {
  data: TesseractData;
}

const Hypercube: React.FC<{ flux: number; stability: number; vector: string }> = ({ flux, stability, vector }) => {
    // Determine color based on stability
    let color = '#a78bfa'; // violet
    if (stability < 0.7) color = '#f472b6'; // pink
    if (stability < 0.4) color = '#ef4444'; // red

    const rotationSpeed = 20 - (flux * 15); // Faster flux = faster rotation (lower duration)

    return (
        <div className="relative w-full h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    <filter id="tesseractGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background HUD Circle */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--dark-border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="10 30" style={{ animation: `spin ${rotationSpeed * 2}s linear infinite` }} />

                {/* Hypercube Projection Simulation */}
                <g style={{ animation: `spin ${rotationSpeed}s linear infinite`, transformOrigin: '100px 100px' }}>
                    {/* Outer Cube */}
                    <rect x="60" y="60" width="80" height="80" fill="none" stroke={color} strokeWidth="2" filter="url(#tesseractGlow)" />
                    
                    {/* Inner Cube (Offset) */}
                    <rect 
                        x="80" 
                        y="80" 
                        width="40" 
                        height="40" 
                        fill={color} 
                        fillOpacity="0.1"
                        stroke={color} 
                        strokeWidth="1.5"
                        style={{ animation: `pulse 3s ease-in-out infinite` }} 
                    />

                    {/* Connecting Lines (Corners) */}
                    <path d="M 60 60 L 80 80" stroke={color} strokeWidth="1" opacity="0.6" />
                    <path d="M 140 60 L 120 80" stroke={color} strokeWidth="1" opacity="0.6" />
                    <path d="M 60 140 L 80 120" stroke={color} strokeWidth="1" opacity="0.6" />
                    <path d="M 140 140 L 120 120" stroke={color} strokeWidth="1" opacity="0.6" />
                </g>
                
                {/* Active Vector Text overlay */}
                <text x="100" y="190" textAnchor="middle" fill={color} fontSize="10" className="font-orbitron tracking-widest opacity-80">
                    VECTOR: {vector}
                </text>
            </svg>

            {/* Corner Metrics */}
            <div className="absolute top-2 left-2 text-xs">
                 <span className="text-warm-grey uppercase block text-[10px]">Flux</span>
                 <span className="font-mono text-pearl">{(flux * 100).toFixed(0)}%</span>
            </div>
             <div className="absolute top-2 right-2 text-xs text-right">
                 <span className="text-warm-grey uppercase block text-[10px]">Stab</span>
                 <span className="font-mono text-pearl">{(stability * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
};

export const TesseractMonitor: React.FC<TesseractMonitorProps> = ({ data }) => {
  const { integrity } = data;
  let borderColor = 'border-dark-border/50';
  if (integrity < 0.9) borderColor = 'border-yellow-500/50';
  if (integrity < 0.7) borderColor = 'border-rose-500/50';
  
  return (
    <div className={`w-full bg-dark-surface/50 border ${borderColor} p-4 rounded-lg backdrop-blur-sm h-full flex flex-col justify-between transition-all duration-500 relative overflow-hidden`}>
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="font-orbitron text-md text-warm-grey">Tesseract Matrix</h3>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pearl animate-pulse" />
            <span className="font-mono text-xs text-pearl">ACTIVE</span>
        </div>
      </div>
      
      <Tooltip text="Visual representation of the hyper-dimensional data structure. The rotation speed correlates with data flux.">
         <div className="flex-1 cursor-help">
            <Hypercube flux={data.flux} stability={data.stability} vector={data.activeVector} />
         </div>
      </Tooltip>

      <div className="mt-2 pt-2 border-t border-dark-border/50 flex justify-between items-center z-10">
            <span className='text-warm-grey uppercase text-xs tracking-wider'>Matrix Integrity</span>
            <p className='font-orbitron text-lg text-pearl text-glow-pearl'>{(data.integrity * 100).toFixed(2)}%</p>
      </div>
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
    </div>
  );
};