
import React, { useEffect, useRef } from 'react';
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

  // Calculate central alignment score
  const alignment = (data.lambda.frequency + data.sigma.frequency + data.tau.frequency) / 3000;

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

        // Emitters
        Object.entries(CORE_CONFIG).forEach(([key, config]) => {
            const freq = data[key as keyof ResonanceCoherenceData].frequency;
            const rad = (config.angle - 90) * (Math.PI / 180);
            
            const ex = cx + radius * Math.cos(rad);
            const ey = cy + radius * Math.sin(rad);

            // Draw Emitter
            ctx.fillStyle = '#050505';
            ctx.strokeStyle = config.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ex, ey, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw Carrier Beam to Center
            const intensity = Math.min(1, freq / 1000);
            const pulse = Math.sin(time * (freq / 200)) * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = config.color;
            ctx.lineWidth = 0.5 + intensity;
            ctx.globalAlpha = 0.2 + pulse * 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Draw Propagating Ripples (The "Harmonic" Waves)
            const rippleCount = 3;
            for(let r=0; r<rippleCount; r++) {
                const rOffset = (time * (freq/100) + r * 20) % 60;
                const rOpacity = 1 - (rOffset / 60);
                
                ctx.beginPath();
                ctx.arc(ex, ey, rOffset, 0, Math.PI * 2);
                ctx.strokeStyle = config.color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = rOpacity * 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        });

        // Central Interference Node
        const centerPulse = Math.sin(time * 2) * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, (5 + alignment * 10) + centerPulse, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Connecting Triangle
        ctx.beginPath();
        const pts = Object.values(CORE_CONFIG).map(config => {
            const rad = (config.angle - 90) * (Math.PI / 180);
            return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
        });
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [data, alignment]);

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 z-10 relative">
        <h3 className="font-orbitron text-md text-warm-grey">Harmonic Correlator</h3>
        <span className="text-[10px] font-mono text-pearl bg-slate-800 px-2 py-0.5 rounded">
            SYNC: {(alignment * 100).toFixed(1)}%
        </span>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
        <canvas ref={canvasRef} width={300} height={300} className="w-full h-full object-contain" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-dark-border/50 text-center relative z-10">
          {Object.entries(CORE_CONFIG).map(([key, config]) => (
              <Tooltip key={key} text={`${key.toUpperCase()} Frequency: ${data[key as keyof ResonanceCoherenceData].frequency.toFixed(0)} zHz`}>
                <div>
                    <span className="text-[10px] uppercase text-slate-500 block">{config.label}</span>
                    <span className="font-mono text-xs" style={{ color: config.color }}>
                        {data[key as keyof ResonanceCoherenceData].frequency.toFixed(0)}
                    </span>
                </div>
              </Tooltip>
          ))}
      </div>
    </div>
  );
});
