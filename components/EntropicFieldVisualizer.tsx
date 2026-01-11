
import React, { useRef, useEffect } from 'react';
import { EntropicFieldData } from '../types';
import { Tooltip } from './Tooltip';

interface EntropicFieldVisualizerProps {
    data: EntropicFieldData;
}

export const EntropicFieldVisualizer: React.FC<EntropicFieldVisualizerProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let particles: { x: number; y: number; angle: number; speed: number; life: number; color: string }[] = [];
        let shieldPulse = 0;

        const render = () => {
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            const cx = width / 2;
            const cy = height / 2;
            const shieldRadius = Math.min(width, height) * 0.25;

            // Clear
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Heavy trail for speed perception
            ctx.fillRect(0, 0, width, height);

            // Spawn Incoming Entropy Particles
            const spawnRate = data.globalStress * 0.5; // More stress = more particles
            if (Math.random() < spawnRate) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.max(width, height) / 2 + 50;
                particles.push({
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist,
                    angle: angle + Math.PI, // Towards center
                    speed: 2 + Math.random() * 3 + (data.causalVolatility * 5),
                    life: 1.0,
                    color: Math.random() > 0.5 ? '#f43f5e' : '#fb923c' // Red/Orange entropy
                });
            }

            // Update & Draw Particles
            particles.forEach((p, i) => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                
                const distToCenter = Math.hypot(p.x - cx, p.y - cy);
                
                // Shield Impact Logic
                if (distToCenter < shieldRadius + 5) {
                    // Shield Hit
                    shieldPulse = 1.0;
                    particles.splice(i, 1);
                    // Draw impact flash
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                } else {
                    // Draw Particle Trail
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - Math.cos(p.angle) * 15, p.y - Math.sin(p.angle) * 15);
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });

            // Draw Sovereign Shield
            shieldPulse *= 0.9; // Decay
            ctx.beginPath();
            ctx.arc(cx, cy, shieldRadius, 0, Math.PI * 2);
            // Color shifts from Cyan (Healthy) to Red (Critical) based on integrity
            const r = 255 * (1 - data.shieldIntegrity);
            const g = 255 * data.shieldIntegrity;
            const b = 255 * data.shieldIntegrity;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + shieldPulse})`;
            ctx.lineWidth = 3 + shieldPulse * 10;
            ctx.shadowBlur = 20 * data.shieldIntegrity + shieldPulse * 50;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
            ctx.stroke();
            
            // Inner Core
            ctx.beginPath();
            ctx.arc(cx, cy, shieldRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;
            ctx.fill();

            // Text Label inside
            ctx.fillStyle = '#fff';
            ctx.font = '10px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${(data.shieldIntegrity * 100).toFixed(0)}%`, cx, cy);

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [data]);

    return (
        <div className="w-full h-full bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col relative overflow-hidden group shadow-2xl">
            <div className="flex justify-between items-center z-10 mb-2">
                <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Causal Field Monitor</h3>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${data.globalStress > 0.5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${data.globalStress > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {data.globalStress > 0.5 ? 'HIGH_ENTROPY' : 'FIELD_STABLE'}
                    </span>
                </div>
            </div>
            
            <div className="flex-1 relative rounded border border-white/5 bg-black/20 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                    <span>Incoming_Vector: {data.incomingVector}</span>
                    <span>Volatility: {data.causalVolatility.toFixed(3)}</span>
                </div>
            </div>
        </div>
    );
};
