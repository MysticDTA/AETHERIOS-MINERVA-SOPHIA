
import React, { useEffect, useRef, useState } from 'react';
import { ResonanceCoherenceData } from '../types';
import { Tooltip } from './Tooltip';

interface HarmonicCorrelatorProps {
  data: ResonanceCoherenceData;
}

const CORE_CONFIG = {
    lambda: { color: '#67e8f9', label: 'Λ', angle: 0 },   // Cyan
    sigma: { color: '#a78bfa', label: 'Σ', angle: 120 },  // Violet
    tau: { color: '#bef264', label: 'Τ', angle: 240 },    // Lime
};

export const HarmonicCorrelator: React.FC<HarmonicCorrelatorProps> = React.memo(({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCore, setHoveredCore] = useState<keyof typeof CORE_CONFIG | null>(null);

  // Calculate central alignment score based on amplitude coherence
  const alignment = (data.lambda.amplitude + data.sigma.amplitude + data.tau.amplitude) / 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const render = () => {
        time += 0.05;
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.35;

        ctx.clearRect(0, 0, width, height);

        // Draw Background Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pre-calculate positions
        const positions: Record<string, {x: number, y: number, color: string}> = {};
        Object.entries(CORE_CONFIG).forEach(([key, config]) => {
             const rad = (config.angle - 90) * (Math.PI / 180);
             positions[key] = {
                 x: cx + radius * Math.cos(rad),
                 y: cy + radius * Math.sin(rad),
                 color: config.color
             };
        });

        // Draw Connecting Triangle Segments
        const keys = Object.keys(CORE_CONFIG);
        for (let i = 0; i < keys.length; i++) {
            const k1 = keys[i];
            const k2 = keys[(i + 1) % keys.length];
            const p1 = positions[k1];
            const p2 = positions[k2];

            // Highlight line if it connects to the hovered core
            const isHighlighted = hoveredCore && (hoveredCore === k1 || hoveredCore === k2);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            ctx.lineWidth = isHighlighted ? 2 : 1;
            ctx.strokeStyle = isHighlighted ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)';
            
            if (isHighlighted) {
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                ctx.shadowBlur = 8;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
        }

        // Emitters
        Object.entries(CORE_CONFIG).forEach(([key, config]) => {
            const metric = data[key as keyof ResonanceCoherenceData];
            const pos = positions[key];
            const ex = pos.x;
            const ey = pos.y;
            const isHovered = key === hoveredCore;

            // Draw Emitter
            ctx.fillStyle = '#050505';
            ctx.strokeStyle = config.color;
            ctx.lineWidth = isHovered ? 3 : 2;
            
            const baseSize = 4 * metric.amplitude + 2;
            // Pulse effect if hovered
            const size = isHovered ? baseSize * 1.3 + Math.sin(time * 10) * 1.5 : baseSize;

            if (isHovered) {
                ctx.shadowColor = config.color;
                ctx.shadowBlur = 15;
            }

            ctx.beginPath();
            ctx.arc(ex, ey, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Carrier Beam to Center with Phase Modulation
            const phaseFactor = Math.sin((time * 2) + (metric.phase * Math.PI / 180));
            const intensity = metric.amplitude * (0.5 + 0.5 * phaseFactor);
            
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = config.color;
            ctx.lineWidth = (0.5 + intensity * 2) * (isHovered ? 1.5 : 1);
            ctx.globalAlpha = (0.2 + intensity * 0.6) * (isHovered ? 1.5 : 1);
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Draw Propagating Ripples
            const rippleCount = 3;
            for(let r=0; r<rippleCount; r++) {
                const freqSpeed = metric.frequency / 200;
                const rOffset = ((time * freqSpeed) + r * 20 + metric.phase/10) % 60;
                const rOpacity = (1 - (rOffset / 60)) * metric.amplitude;
                
                ctx.beginPath();
                ctx.arc(ex, ey, rOffset, 0, Math.PI * 2);
                ctx.strokeStyle = config.color;
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.globalAlpha = rOpacity * (isHovered ? 0.8 : 0.5);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        });

        // Central Interference Node
        const centerPulse = Math.sin(time * 2) * 2 * alignment;
        ctx.beginPath();
        ctx.arc(cx, cy, (5 + alignment * 15) + centerPulse, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [data, alignment, hoveredCore]);

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 z-10 relative">
        <h3 className="font-orbitron text-md text-warm-grey">Harmonic Correlator</h3>
        <span className="text-[10px] font-mono text-pearl bg-slate-800 px-2 py-0.5 rounded">
            AMP_SYNC: {(alignment * 100).toFixed(1)}%
        </span>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
        <canvas ref={canvasRef} width={300} height={300} className="w-full h-full object-contain" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-dark-border/50 text-center relative z-10">
          {Object.entries(CORE_CONFIG).map(([key, config]) => {
              const metric = data[key as keyof ResonanceCoherenceData];
              const isHovered = hoveredCore === key;
              return (
                <div 
                    key={key} 
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredCore(key as keyof typeof CORE_CONFIG)}
                    onMouseLeave={() => setHoveredCore(null)}
                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', opacity: hoveredCore && !isHovered ? 0.5 : 1 }}
                >
                    <Tooltip text={`${config.label} Wave | Freq: ${metric.frequency.toFixed(0)}zHz | Phase: ${metric.phase.toFixed(0)}°`}>
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 block">{config.label}</span>
                            <span className="font-mono text-xs" style={{ color: config.color, fontWeight: isHovered ? 'bold' : 'normal', textShadow: isHovered ? `0 0 8px ${config.color}` : 'none' }}>
                                {metric.frequency.toFixed(0)}
                            </span>
                            <div className="w-full h-0.5 bg-slate-800 mt-1 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-300" style={{ width: `${metric.amplitude * 100}%`, backgroundColor: config.color, boxShadow: isHovered ? `0 0 8px ${config.color}` : 'none' }} />
                            </div>
                        </div>
                    </Tooltip>
                </div>
              );
          })}
      </div>
    </div>
  );
});
