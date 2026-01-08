
import React, { useEffect, useRef } from 'react';
import { Tooltip } from './Tooltip';

interface CoherenceResonanceMonitorProps {
  rho: number;
  stability: number;
  entropy: number;
  isUpgrading?: boolean;
}

const ResonanceSpectrum: React.FC<{ rho: number; entropy: number; isUpgrading?: boolean }> = ({ rho, entropy, isUpgrading }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rhoRef = useRef(rho); 
    const entropyRef = useRef(entropy);
    // Use React ref to hold particle state across renders without resetting
    const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; offset: number }[]>([]);

    useEffect(() => {
        rhoRef.current = rho;
        entropyRef.current = entropy;
    }, [rho, entropy]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d'); 
        if (!ctx) return;

        let animationFrame: number;
        const width = 600;
        const height = 600;
        canvas.width = width;
        canvas.height = height;

        const animate = () => {
            const currentRho = rhoRef.current;
            const currentEntropy = entropyRef.current;
            const time = Date.now() / 500;
            
            // Clear with slight trail for motion blur
            ctx.fillStyle = `rgba(3, 3, 5, ${0.2 - currentEntropy * 0.1})`;
            ctx.fillRect(0, 0, width, height);

            // 1. Unified Field Ripples (Background)
            if (currentRho > 0.8) {
                ctx.lineWidth = 1;
                const rippleCount = 3;
                for(let r=0; r<rippleCount; r++) {
                    const rSize = (time * 50 + r * 150) % 400;
                    const opacity = Math.max(0, 1 - (rSize / 400)) * 0.1 * currentRho;
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(width/2, height/2, rSize, 0, Math.PI*2);
                    ctx.stroke();
                }
            }

            // 2. Particle Emission Logic
            const emissionCount = Math.floor(1 + currentRho * 3);
            for(let i=0; i<emissionCount; i++) {
                if (Math.random() < currentRho) {
                    const angle = Math.random() * Math.PI * 2;
                    // Chaos factor: entropy introduces random velocity jitter
                    const chaos = (Math.random() - 0.5) * currentEntropy * 15;
                    const speed = (1 + currentRho * 3) + chaos;
                    
                    particlesRef.current.push({
                        x: width / 2,
                        y: height / 2,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        size: 0.5 + Math.random() * 2 + (isUpgrading ? 1.5 : 0),
                        color: Math.random() > 0.8 ? '#ffd700' : Math.random() > 0.5 ? '#a78bfa' : '#67e8f9',
                        offset: Math.random() * 5 // For chromatic aberration shift
                    });
                }
            }

            // 3. Render Particles with Chromatic Aberration
            // We use Composite Operations to create glowing effects
            ctx.globalCompositeOperation = 'screen';

            particlesRef.current = particlesRef.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.005 + (currentEntropy * 0.02); 

                if (p.life <= 0) return false;

                const alpha = p.life * (0.6 + currentRho * 0.4);
                
                // Chromatic Aberration: Draw Red, Green, Blue channels slightly offset
                // This simulates high-energy spectral splitting
                
                // Red Channel (Offset -)
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x - p.offset, p.y - p.offset, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Blue Channel (Offset +)
                ctx.fillStyle = `rgba(0, 0, 255, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x + p.offset, p.y + p.offset, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Main Core (White/Color)
                ctx.fillStyle = p.color; // Simplified for main body, acts as the "green/luminance" anchor
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                return true;
            });

            ctx.globalCompositeOperation = 'source-over';
            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [isUpgrading]);

    return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
};

export const CoherenceResonanceMonitor: React.FC<CoherenceResonanceMonitorProps> = ({ rho, stability, entropy, isUpgrading }) => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" />
        
        <div className="absolute top-4 left-6 z-10">
            <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-black">Spectral Analysis</h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Resonance_Rho: {rho.toFixed(6)}</span>
        </div>

        <div className="w-full h-full relative z-0">
            <ResonanceSpectrum rho={rho} entropy={entropy} isUpgrading={isUpgrading} />
        </div>

        <div className="absolute bottom-6 w-full px-8 flex justify-between items-end z-10 pointer-events-none">
            <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Entropy_Flux</span>
                <div className="flex items-center gap-2">
                    <span className={`font-orbitron text-xl font-bold ${entropy > 0.3 ? 'text-rose-400' : 'text-emerald-400'}`}>{(entropy * 100).toFixed(2)}%</span>
                    {entropy > 0.3 && <span className="text-[8px] font-bold text-rose-500 bg-rose-950/30 px-1 rounded animate-pulse">HIGH</span>}
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Harmonic_Stability</span>
                <span className="font-orbitron text-xl text-pearl font-bold">{(stability * 100).toFixed(2)}%</span>
            </div>
        </div>
    </div>
  );
};
