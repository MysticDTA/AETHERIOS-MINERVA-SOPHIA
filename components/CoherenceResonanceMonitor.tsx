
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Tooltip } from './Tooltip';

interface CoherenceResonanceMonitorProps {
  rho: number;
  stability: number;
  isUpgrading?: boolean;
}

const ResonanceSpectrum: React.FC<{ rho: number }> = ({ rho }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = 400;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const animate = () => {
            ctx.fillStyle = 'rgba(2, 2, 2, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Emit new particles based on Rho
            if (Math.random() < rho * 0.8) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + rho * 2;
                particles.current.push({
                    x: width / 2,
                    y: height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    color: Math.random() > 0.8 ? '#ffd700' : '#67e8f9'
                });
            }

            // Update and draw particles
            ctx.lineWidth = 1;
            particles.current = particles.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.005;

                const opacity = p.life * (0.3 + rho * 0.7);
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
                ctx.stroke();

                return p.life > 0;
            });
            ctx.globalAlpha = 1.0;

            // Draw Core Pulse
            const coreRadius = 15 + rho * 25 + Math.sin(Date.now() / 200) * 5;
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, coreRadius);
            gradient.addColorStop(0, 'rgba(248, 245, 236, 0.8)');
            gradient.addColorStop(0.5, 'rgba(109, 40, 217, 0.4)');
            gradient.addColorStop(1, 'rgba(109, 40, 217, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(width/2, height/2, coreRadius, 0, Math.PI * 2);
            ctx.fill();

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [rho]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full rounded-full opacity-60" />
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="font-orbitron text-xs text-gold font-bold tracking-[0.4em] uppercase opacity-40">Aetheric_Flux_Field</span>
            </div>
        </div>
    );
};

export const CoherenceResonanceMonitor: React.FC<CoherenceResonanceMonitorProps> = ({ rho, stability, isUpgrading }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = requestAnimationFrame(function animate(t) {
      setTime(t / 1000);
      frame = requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`w-full h-full bg-[#050505]/80 border border-white/5 p-8 rounded-3xl backdrop-blur-3xl relative overflow-hidden group transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.9)] ${isUpgrading ? 'causal-reweaving' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex justify-between items-start mb-10 z-10">
        <div>
          <h3 className="font-minerva italic text-3xl text-pearl text-glow-pearl leading-none">Coherence Resonance Array</h3>
          <div className="flex items-center gap-3 mt-2 font-mono text-[9px] text-gold uppercase tracking-[0.4em] font-bold">
            <span className="animate-pulse">●</span>
            <span>Real-Time Phase Sync // v1.3.1</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
            <span className="font-mono text-[11px] text-pearl font-bold tracking-widest uppercase">Lattice_Locked</span>
          </div>
          <p className="font-mono text-[8px] text-slate-600 mt-1 uppercase">Intercept: 1.617 GHz L-Band</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
        <ResonanceSpectrum rho={rho} />
        
        {/* Dynamic Telemetry HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-center bg-black/40 backdrop-blur-xl px-6 py-4 rounded border border-white/10 shadow-2xl transition-all duration-500 hover:scale-105 group-hover:border-gold/30">
            <div className="flex flex-col gap-1">
                <span className="text-[18px] font-orbitron text-pearl font-bold tracking-[0.2em]">{rho.toFixed(6)}</span>
                <p className="text-[8px] font-mono text-gold uppercase tracking-[0.5em] font-bold">Resonance_Rho</p>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 h-3 rounded-sm transition-all duration-500 ${i < rho * 8 ? 'bg-gold' : 'bg-slate-800'}`}
                        style={{ opacity: 0.3 + (i/8) * 0.7 }}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-3 gap-10">
        <Tooltip text="Delta entropy flux measures the rate of causal decay within the monitoring array. Lower is better.">
          <div className="flex flex-col gap-1.5 cursor-help group/metric">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover/metric:text-gold transition-colors">Entropy_Flux</span>
            <div className="flex items-end gap-2">
                <span className="text-[13px] font-orbitron text-pearl">0.0024</span>
                <span className="text-[8px] font-mono text-slate-700 uppercase mb-1">Ψ/ms</span>
            </div>
          </div>
        </Tooltip>
        <Tooltip text="Measures the alignment of the 1.617 GHz L-band carrier waves between the local node and the global collective.">
          <div className="flex flex-col gap-1.5 cursor-help text-center group/metric">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover/metric:text-cyan-400 transition-colors">Phase_Sync</span>
            <span className="text-[11px] font-orbitron text-gold font-bold animate-pulse">STABLE_LOCK</span>
          </div>
        </Tooltip>
        <Tooltip text="Structural stability of the Tesseract matrix during high-load synthesis and deep logical gestation.">
          <div className="flex flex-col gap-1.5 cursor-help text-right group/metric">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold group-hover/metric:text-pearl transition-colors">Lattice_Stability</span>
            <div className="flex items-end justify-end gap-2">
                <span className="text-[13px] font-orbitron text-pearl">{(stability * 100).toFixed(1)}%</span>
                <div className={`w-1.5 h-1.5 rounded-full mb-1 ${stability > 0.9 ? 'bg-green-500' : 'bg-gold'}`} />
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Aesthetic Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-20 opacity-[0.05]"></div>
    </div>
  );
};
