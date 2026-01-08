
import React, { useEffect, useRef } from 'react';

interface QuantumSentinelPulseProps {
    active: boolean;
    color?: string;
}

export const QuantumSentinelPulse: React.FC<QuantumSentinelPulseProps> = ({ active, color = '#10b981' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let pulses: { r: number; opacity: number }[] = [];
        
        const render = () => {
            if (!active) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            // Spawn pulse
            if (Math.random() > 0.95) {
                pulses.push({ r: 0, opacity: 1.0 });
            }

            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;

            ctx.clearRect(0, 0, width, height);

            pulses = pulses.filter(p => p.opacity > 0);
            
            pulses.forEach(p => {
                p.r += 2;
                p.opacity -= 0.01;

                ctx.beginPath();
                ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.globalAlpha = p.opacity;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Secondary ring
                ctx.beginPath();
                ctx.arc(cx, cy, p.r * 0.8, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.globalAlpha = p.opacity * 0.5;
                ctx.lineWidth = 1;
                ctx.stroke();
            });
            ctx.globalAlpha = 1.0;

            // Core
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active, color]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <canvas ref={canvasRef} className="w-full h-full" width={400} height={300} />
        </div>
    );
};
