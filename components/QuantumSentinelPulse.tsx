
import React, { useEffect, useRef } from 'react';

interface QuantumSentinelPulseProps {
    active: boolean;
    resonance?: number;
    color?: string;
    className?: string;
}

export const QuantumSentinelPulse: React.FC<QuantumSentinelPulseProps> = ({ 
    active, 
    resonance = 0.9, 
    color = '#10b981',
    className = ""
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let pulses: { r: number; opacity: number; speed: number }[] = [];
        
        const render = () => {
            if (!active) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;

            // Clear with slight trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Spawn logic based on resonance
            const spawnChance = 0.95 - (resonance * 0.05);
            if (Math.random() > spawnChance) {
                pulses.push({ 
                    r: 0, 
                    opacity: 1.0, 
                    speed: 1.5 + (resonance * 2) 
                });
            }

            pulses = pulses.filter(p => p.opacity > 0);
            
            pulses.forEach(p => {
                p.r += p.speed;
                p.opacity -= 0.005 + (1 - resonance) * 0.01;

                // Primary Scan Ring
                ctx.beginPath();
                ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.globalAlpha = p.opacity * 0.6;
                ctx.lineWidth = 1 + resonance * 2;
                ctx.stroke();
                
                // Entanglement Grid (Subtle)
                if (resonance > 0.8) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, p.r * 0.5, 0, Math.PI * 2);
                    ctx.setLineDash([2, 10]);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = p.opacity * 0.2;
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            });
            
            // Core Logic Anchor
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.fill();
            ctx.shadowBlur = 0;

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active, resonance, color]);

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-lg ${className}`}>
            <canvas 
                ref={canvasRef} 
                className="w-full h-full block" 
                width={600} 
                height={600} 
            />
        </div>
    );
};
