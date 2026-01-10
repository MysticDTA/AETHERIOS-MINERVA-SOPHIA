
import React, { useEffect, useRef } from 'react';

interface CoherenceResonancePulseProps {
    rho: number;
    coherence: number;
    active: boolean;
}

export const CoherenceResonancePulse: React.FC<CoherenceResonancePulseProps> = ({ rho, coherence, active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            if (!active) return;
            time += 0.02;
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Pulse intensity based on rho and coherence
            const pulseRate = 1 + (rho * 2);
            const intensity = 0.5 + (coherence * 0.5);
            const baseRadius = 40;
            const pulse = Math.sin(time * pulseRate) * 10 * intensity;

            // Draw Inner Core
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius + pulse);
            const hue = 180 + (rho * 40); // Shift from cyan to violet based on rho
            gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.8)`);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

            ctx.beginPath();
            ctx.arc(cx, cy, baseRadius + pulse, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw Orbiting Electrons (Causal Packets)
            const orbitCount = 3;
            for (let i = 0; i < orbitCount; i++) {
                const angle = time * (1 + i * 0.5) + (i * Math.PI * 2 / orbitCount);
                const rx = cx + Math.cos(angle) * (baseRadius + 20);
                const ry = cy + Math.sin(angle) * (baseRadius + 10);

                ctx.beginPath();
                ctx.arc(rx, ry, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#fff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Resonance Rings
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(248, 245, 236, ${0.1 * intensity})`;
            for (let i = 1; i <= 4; i++) {
                const r = (time * 40 + i * 20) % 100;
                const alpha = (1 - r / 100) * 0.2 * intensity;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(248, 245, 236, ${alpha})`;
                ctx.stroke();
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active, rho, coherence]);

    return (
        <div className="relative w-40 h-40 flex items-center justify-center pointer-events-none group">
            <canvas ref={canvasRef} width={200} height={200} className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-orbitron text-[8px] text-gold uppercase tracking-[0.3em] opacity-40">Resonance</span>
                <span className="font-mono text-[10px] text-pearl font-bold">{(rho * 100).toFixed(2)}%</span>
            </div>
        </div>
    );
};
