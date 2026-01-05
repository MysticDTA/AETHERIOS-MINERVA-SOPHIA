
import React, { useEffect, useRef } from 'react';

interface ResonanceSymmetryArrayProps {
    rho: number;
    isOptimizing: boolean;
}

export const ResonanceSymmetryArray: React.FC<ResonanceSymmetryArrayProps> = ({ rho, isOptimizing }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const petals = 8;
        const baseRadius = 40;

        const render = () => {
            time += 0.01;
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;

            // Clear with trail effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Dark surface color
            ctx.fillRect(0, 0, width, height);

            // Draw Background Grid (Static-ish)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            [20, 40, 60, 80].forEach(r => {
                ctx.moveTo(centerX + r, centerY);
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            });
            ctx.stroke();

            // Rotate entire system
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time * 0.2); // Slow rotation

            // Draw Petals
            ctx.beginPath();
            for (let i = 0; i < petals; i++) {
                const angleOffset = (i / petals) * Math.PI * 2;
                
                for (let j = 0; j <= 30; j++) {
                    const step = j / 30;
                    const angle = (step * Math.PI) - (Math.PI / 2);
                    
                    // Math logic from previous version, optimized for canvas
                    const dynamicRho = rho + (Math.sin(time * 2) * 0.05); // Add subtle breath
                    const r = baseRadius * Math.sin(angle) * Math.cos(i + time) * (dynamicRho + 0.2);
                    
                    // Polar to Cartesian conversion
                    const petalAngle = angleOffset + angle * (1 - dynamicRho);
                    const x = r * Math.cos(petalAngle);
                    const y = r * Math.sin(petalAngle);

                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            
            // Dynamic Styling
            ctx.strokeStyle = isOptimizing ? '#ffffff' : '#6d28d9'; // Pearl or Violet
            ctx.lineWidth = isOptimizing ? 1.5 : 0.8;
            ctx.stroke();
            
            // Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = isOptimizing ? '#ffffff' : '#6d28d9';
            if (rho > 0.8) ctx.fillStyle = 'rgba(109, 40, 217, 0.1)';
            else ctx.fillStyle = 'transparent';
            ctx.fill();
            ctx.shadowBlur = 0;

            // Central Core
            const coreRadius = 2 + rho * 3 + Math.sin(time * 5) * 1;
            ctx.beginPath();
            ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#f8f5ec';
            ctx.fill();

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [rho, isOptimizing]);

    return (
        <div className="w-full h-full bg-dark-surface/40 border border-dark-border/60 rounded-lg p-5 backdrop-blur-md relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4 z-10 border-b border-white/5 pb-2 absolute top-5 left-5 right-5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-sm rotate-45 ${isOptimizing ? 'bg-pearl animate-ping' : 'bg-violet-500'}`} />
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Phase Symmetry V1</h3>
                </div>
                {isOptimizing && (
                    <span className="font-mono text-[8px] text-pearl animate-pulse bg-violet-600/30 px-2 py-0.5 rounded">OPTIMIZATION_ACTIVE</span>
                )}
            </div>

            <div className="w-full h-full flex items-center justify-center">
                <canvas ref={canvasRef} width={300} height={300} className="w-full h-full max-h-[250px] object-contain" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 pt-3 border-t border-white/5">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                         <span className="text-[7px] text-slate-600 uppercase tracking-widest block font-bold">Harmonic Variance</span>
                         <div className="flex gap-0.5 h-1 w-24 bg-slate-900 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${isOptimizing ? 'bg-green-500' : 'bg-violet-500'}`} style={{ width: `${(1 - rho) * 100}%` }} />
                         </div>
                    </div>
                    <div className="text-right">
                        <span className="font-orbitron text-xs text-pearl">{(rho * 1.0).toFixed(4)} Ψ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
