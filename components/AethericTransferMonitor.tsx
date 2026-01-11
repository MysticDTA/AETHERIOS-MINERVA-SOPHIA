
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AethericTransferData, AethericTransferStatus } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';

interface AethericTransferMonitorProps {
  data: AethericTransferData;
  onPurge: () => void;
  isPurging: boolean;
}

const getStatusConfig = (status: AethericTransferStatus) => {
    switch(status) {
        case 'STABLE':
            return { color: 'text-pearl', label: 'STABLE', particleColor: 'rgba(165, 243, 252, 1)' }; // Cyan/Pearl
        case 'TURBULENT':
            return { color: 'text-gold', label: 'TURBULENT', particleColor: 'rgba(253, 224, 71, 1)' }; // Gold
        case 'STAGNANT':
            return { color: 'text-orange-400', label: 'STAGNANT', particleColor: 'rgba(251, 146, 60, 1)' }; // Orange
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', particleColor: 'rgba(120, 113, 108, 1)' };
    }
}

const AetherStreamCanvas: React.FC<{ density: number; efficiency: number, color: string, status: AethericTransferStatus, entropy: number }> = ({ density, efficiency, color, status, entropy }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const particleCount = Math.floor(density * 100) + 20;
        const particles: { x: number; y: number; vx: number; size: number }[] = [];

        // Init
        for(let i=0; i<particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() * 2 + 1) * efficiency,
                size: Math.random() * 1.5 + 0.5
            });
        }

        const render = () => {
            // Trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = color;
            ctx.globalCompositeOperation = 'screen';

            particles.forEach(p => {
                // Dynamics
                let speedMod = 1;
                if (status === 'STAGNANT') speedMod = 0.1;
                if (status === 'TURBULENT') speedMod = 1.5;

                p.x += p.vx * speedMod;
                
                // Turbulence/Entropy: Vertical Jitter
                if (status === 'TURBULENT' || entropy > 0.1) {
                    p.y += (Math.random() - 0.5) * (entropy * 10);
                }

                // Wrap
                if (p.x > width) {
                    p.x = 0;
                    p.y = Math.random() * height;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.globalCompositeOperation = 'source-over';
            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [density, efficiency, color, status, entropy]);

    return <canvas ref={canvasRef} className="w-full h-full block rounded bg-black/20" />;
};

export const AethericTransferMonitor: React.FC<AethericTransferMonitorProps> = ({ data, onPurge, isPurging }) => {
    const { efficiency, particleDensity, fluxStatus, entropy } = data;
    const [previewStatus, setPreviewStatus] = useState<AethericTransferStatus | null>(null);

    const displayStatus = previewStatus || fluxStatus;
    const displayConfig = getStatusConfig(displayStatus);
    const isPreviewing = previewStatus !== null;
    
    const filterOptions: AethericTransferStatus[] = ['STABLE', 'TURBULENT', 'STAGNANT'];

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-orbitron text-md text-warm-grey">Aetheric Transfer</h3>
                     <p className={`font-orbitron font-bold text-md ${displayConfig.color} ${!isPreviewing && fluxStatus !== 'STABLE' ? 'animate-pulse' : ''}`}>
                        {displayConfig.label}
                        {isPreviewing && <span className="text-[10px] text-cyan-400 ml-2 font-mono uppercase tracking-widest">(Simulation Active)</span>}
                    </p>
                </div>
                <button 
                    onClick={onPurge}
                    disabled={isPurging || fluxStatus === 'STABLE'}
                    className="px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase bg-dark-surface/70 hover:bg-slate-700 text-warm-grey disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPurging ? 'PURGING...' : 'Purge Flow'}
                </button>
            </div>
            
            <div className="flex-1 min-h-0 relative border border-white/5 rounded overflow-hidden">
                <AetherStreamCanvas 
                    density={particleDensity} 
                    efficiency={efficiency} 
                    color={displayConfig.particleColor} 
                    status={displayStatus}
                    entropy={entropy}
                />
            </div>

            <div className="mt-4 flex flex-wrap justify-center items-center gap-2 border-t border-dark-border/30 pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mr-1">Visual Filter:</span>
                <button 
                    onClick={() => setPreviewStatus(null)}
                    className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-tighter transition-all duration-300 border ${!isPreviewing ? 'bg-pearl text-dark-bg border-pearl shadow-[0_0_10px_rgba(248,245,236,0.4)]' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'}`}
                >
                    Live
                </button>
                {filterOptions.map(opt => (
                     <button 
                        key={opt}
                        onClick={() => setPreviewStatus(opt)}
                        className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-tighter transition-all duration-300 border ${previewStatus === opt ? 'bg-cyan-500 text-dark-bg border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-x-4 text-sm text-center border-t border-dark-border/50 pt-3">
                <div>
                    <span className="text-warm-grey text-[10px] uppercase font-bold tracking-widest block mb-1">Efficiency</span>
                    <p className="font-mono text-pearl text-base">{(efficiency * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <span className="text-warm-grey text-[10px] uppercase font-bold tracking-widest block mb-1">Density</span>
                    <p className="font-mono text-pearl text-base">{particleDensity.toFixed(2)}</p>
                </div>
                 <div>
                    <span className="text-warm-grey text-[10px] uppercase font-bold tracking-widest block mb-1">Entropy</span>
                    <p className="font-mono text-pearl text-base">{(entropy * 100).toFixed(1)}%</p>
                </div>
            </div>
        </div>
    );
};
