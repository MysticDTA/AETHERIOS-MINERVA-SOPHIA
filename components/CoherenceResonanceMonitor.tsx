
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
    const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[]>([]);

    useEffect(() => {
        rhoRef.current = rho;
        entropyRef.current = entropy;
    }, [rho, entropy]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrame: number;
        const width = 600;
        const height = 600;
        canvas.width = width;
        canvas.height = height;

        const animate = () => {
            const currentRho = rhoRef.current;
            const currentEntropy = entropyRef.current;
            
            // Trail effect - higher entropy = more ghosting
            ctx.fillStyle = `rgba(5, 5, 5, ${0.2 - currentEntropy * 0.1})`;
            ctx.fillRect(0, 0, width, height);

            // High-fidelity particle emission
            const emissionCount = Math.floor(1 + currentRho * 5);
            for(let i=0; i<emissionCount; i++) {
                if (Math.random() < currentRho) {
                    const angle = Math.random() * Math.PI * 2;
                    // Speed affected by entropy (chaos)
                    const speed = (0.8 + currentRho * 3) * (1 + (Math.random() - 0.5) * currentEntropy * 5);
                    particles.current.push({
                        x: width / 2,
                        y: height / 2,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        size: 0.5 + Math.random() * 2 + (isUpgrading ? 1 : 0),
                        color: Math.random() > 0.7 ? '#ffd700' : Math.random() > 0.4 ? '#a78bfa' : '#67e8f9'
                    });
                }
            }

            particles.current = particles.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.005 + (currentEntropy * 0.01); 

                const alpha = p.life * (0.4 + currentRho * 0.6);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect particles logic
                if (currentRho > 0.85 && Math.random() > 0.95) {
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = alpha * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(width/2, height/2);
                    ctx.stroke();
                }

                return p.life > 0;
            });
            ctx.globalAlpha = 1.0;

            // Radiant Core
            const time = Date.now() / 200;
            const coreRadius = 25 + currentRho * 40 + Math.sin(time) * 8 + (isUpgrading ? Math.random() * 5 : 0);
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, coreRadius);
            
            if (isUpgrading) {
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.4, 'rgba(167, 139, 250, 0.5)'); // Violet tint when thinking
                gradient.addColorStop(1, 'rgba(109, 40, 217, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(248, 245, 236, 0.9)');
                gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.4)');
                gradient.addColorStop(0.6, 'rgba(109, 40, 217, 0.1)');
                gradient.addColorStop(1, 'rgba(109, 40, 217, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(width/2, height/2, coreRadius, 0, Math.PI * 2);
            ctx.fill();

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [isUpgrading]); 

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full rounded-full opacity-90 mix-blend-screen" />
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none shadow-[inset_0_0_80px_rgba(109,40,217,0.1)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-gold/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-pearl/5 rounded-full animate-[spin_90s_linear_infinite_reverse]" />
        </div>
    );
};

export const CoherenceResonanceMonitor: React.FC<CoherenceResonanceMonitorProps> = ({ rho, stability, entropy, isUpgrading }) => {
  return (
    <div className={`w-full h-full bg-[#050505]/90 border border-white/10 p-10 rounded-3xl backdrop-blur-3xl relative overflow-hidden group transition-all duration-1000 shadow-[0_60px_150px_rgba(0,0,0,1)] ${isUpgrading ? 'border-violet-500/30' : ''}`}>
      <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-1000 ${isUpgrading ? 'bg-violet-500 shadow-[0_0_20px_#8b5cf6]' : 'bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-40'}`} />
      
      <div className="flex justify-between items-start mb-12 z-10">
        <div>
          <h3 className="font-minerva italic text-4xl text-pearl text-glow-pearl leading-none tracking-tight">Coherence_Resonance_Array</h3>
          <div className="flex items-center gap-4 mt-3">
             <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] font-black px-4 py-1 border rounded-full transition-colors ${isUpgrading ? 'text-violet-300 bg-violet-950/30 border-violet-500/30' : 'text-gold bg-gold/5 border-gold/20'}`}>
                <span className="animate-pulse">●</span>
                <span>{isUpgrading ? 'Logic_Intercept_Active' : 'Active_Phase_Intercept'}</span>
             </div>
             <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Protocol_v1.3.1_Radiant</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-pearl font-black tracking-[0.3em] uppercase">Lattice_Locked</span>
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_15px_#10b981] ${rho > 0.98 ? 'bg-green-500' : 'bg-yellow-500'}`} />
          </div>
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-0.5 rounded border border-white/5">Freq: 1.617 GHz L-Band</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[400px]">
        <div className="w-[450px] h-[450px] relative">
            <ResonanceSpectrum rho={rho} entropy={entropy} isUpgrading={isUpgrading} />
            
            {/* Dynamic Telemetry HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`text-center bg-black/60 backdrop-blur-2xl px-10 py-6 rounded-sm border shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-1000 group-hover:scale-105 border-l-4 ${isUpgrading ? 'border-violet-500 border-l-violet-500' : 'border-white/10 border-l-gold group-hover:border-gold/40'}`}>
                    <div className="flex flex-col gap-2">
                        <span className={`text-3xl font-orbitron font-black tracking-widest drop-shadow-[0_0_15px_white] ${isUpgrading ? 'text-violet-200' : 'text-pearl'}`}>{rho.toFixed(8)}</span>
                        <p className={`text-[10px] font-mono uppercase tracking-[0.6em] font-black ${isUpgrading ? 'text-violet-400' : 'text-gold'}`}>Sync_Rho_Parity</p>
                    </div>
                    <div className="mt-8 flex gap-3 justify-center">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1 h-4 rounded-sm transition-all duration-1000 ${i < rho * 16 ? (isUpgrading ? 'bg-violet-400' : 'bg-gold') : 'bg-slate-900'}`}
                                style={{ opacity: 0.2 + (i/16) * 0.8, filter: i < rho * 16 ? `drop-shadow(0 0 5px ${isUpgrading ? '#a78bfa' : '#ffd700'})` : 'none' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-3 gap-12">
        <Tooltip text="Delta entropy flux measures the rate of causal decay within the monitoring array. Lower is better.">
          <div className="flex flex-col gap-2 cursor-help group/metric bg-white/[0.02] p-5 border border-white/5 hover:border-gold/30 transition-all rounded-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black group-hover/metric:text-gold transition-colors">Entropy_Flux</span>
            <div className="flex items-end gap-3">
                <span className="text-[16px] font-orbitron text-pearl font-bold">{(entropy * 10).toFixed(5)}</span>
                <span className="text-[9px] font-mono text-slate-600 uppercase mb-1 font-bold">Ψ/ms</span>
            </div>
          </div>
        </Tooltip>
        <Tooltip text="Measures the alignment of the 1.617 GHz L-band carrier waves between the local node and the global collective.">
          <div className="flex flex-col gap-2 cursor-help text-center bg-white/[0.02] p-5 border border-white/5 hover:border-cyan-400/30 transition-all rounded-sm group/metric">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black group-hover/metric:text-cyan-400 transition-colors">Phase_Sync</span>
            <div className="flex items-center justify-center gap-3">
                <span className={`text-[14px] font-orbitron font-black animate-pulse tracking-widest ${isUpgrading ? 'text-violet-400' : 'text-gold'}`}>
                    {isUpgrading ? 'REWEAVING_CAUSALITY' : 'ABSOLUTE_LOCK'}
                </span>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
            </div>
          </div>
        </Tooltip>
        <Tooltip text="Structural stability of the Tesseract matrix during high-load synthesis and deep logical gestation.">
          <div className="flex flex-col gap-2 cursor-help text-right bg-white/[0.02] p-5 border border-white/5 hover:border-pearl/30 transition-all rounded-sm group/metric">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black group-hover/metric:text-pearl transition-colors">Lattice_Stability</span>
            <div className="flex items-end justify-end gap-3">
                <span className="text-[16px] font-orbitron text-pearl font-bold">{(stability * 100).toFixed(2)}%</span>
                <div className={`w-2 h-2 rounded-full mb-1.5 ${stability > 0.95 ? 'bg-green-500 shadow-[0_0_10px_#10b981]' : 'bg-gold animate-bounce'}`} />
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Heavy Scanline Interlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_2px] z-20 opacity-20"></div>
    </div>
  );
};
