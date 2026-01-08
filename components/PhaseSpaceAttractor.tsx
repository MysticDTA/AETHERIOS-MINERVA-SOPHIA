
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Tooltip } from './Tooltip';

interface PhaseSpaceAttractorProps {
    rho: number; // System Resonance (X)
    coherence: number; // Secondary variable for perturbation
}

export const PhaseSpaceAttractor: React.FC<PhaseSpaceAttractorProps> = ({ rho, coherence }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // History for the phase plot: { x: rho, y: delta_rho }
    const historyRef = useRef<{x: number, y: number}[]>([]);
    const lastRhoRef = useRef(rho);
    
    // Simulated Lyapunov Exponent (Stability metric)
    // < 0 = Stable (Orbit), > 0 = Chaotic
    const [lyapunov, setLyapunov] = useState(-0.5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        
        // Configuration
        const trailLength = 60;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 120; // Visual scale factor

        const render = () => {
            // 1. Calculate Phase State
            // dRho (Velocity) = Current - Last
            // We add some synthetic noise based on (1 - coherence) to simulate entropy
            const noise = (Math.random() - 0.5) * 0.05 * (1 - coherence);
            let dRho = (rho - lastRhoRef.current) * 10 + noise; // Amplify delta for visibility
            
            // Damping/Smoothing
            // If dRho is too small, the visualization is boring, so we inject a tiny "carrier wave"
            // to show the system is "alive" even when stable.
            const carrier = Math.sin(Date.now() / 500) * 0.02;
            dRho += carrier;

            lastRhoRef.current = rho;

            // Update History
            historyRef.current.push({ x: rho, y: dRho });
            if (historyRef.current.length > trailLength) {
                historyRef.current.shift();
            }

            // Calculate Lyapunov (Simulated based on variance of dRho)
            // High variance = Chaos = Positive Exponent
            const variance = Math.abs(dRho);
            setLyapunov(prev => prev * 0.95 + (variance > 0.1 ? 0.1 : -0.1) * 0.05);

            // 2. Render
            // Fade effect for trails
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
            ctx.fillRect(0, 0, width, height);

            // Grid / Axes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X Axis (Rho)
            ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y Axis (dRho)
            ctx.stroke();

            // Draw Phase Trajectory
            ctx.beginPath();
            ctx.lineWidth = 2;
            
            // Dynamic Color based on stability
            // Stable (Green/Cyan) -> Chaotic (Orange/Red)
            const stabilityColor = lyapunov < 0 ? '#10b981' : lyapunov < 0.2 ? '#facc15' : '#f43f5e';
            ctx.strokeStyle = stabilityColor;
            
            for (let i = 0; i < historyRef.current.length - 1; i++) {
                const p1 = historyRef.current[i];
                const p2 = historyRef.current[i+1];
                
                // Map Rho (0..1) to X centered around 0.8 (target resonance)
                // If Rho is 1.0, X should be slightly right. 0.8 is center.
                const x1 = centerX + (p1.x - 0.8) * scale * 2;
                const y1 = centerY - (p1.y) * scale;
                const x2 = centerX + (p2.x - 0.8) * scale * 2;
                const y2 = centerY - (p2.y) * scale;

                ctx.globalAlpha = i / historyRef.current.length; // Fade in tail
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;

            // Draw Current Head
            const lastP = historyRef.current[historyRef.current.length - 1];
            if (lastP) {
                const headX = centerX + (lastP.x - 0.8) * scale * 2;
                const headY = centerY - (lastP.y) * scale;
                
                ctx.fillStyle = '#fff';
                ctx.shadowColor = stabilityColor;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(headX, headY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [rho, coherence]);

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 z-10 relative">
                <h3 className="font-orbitron text-md text-warm-grey">Phase-Space Attractor</h3>
                <div className="flex gap-2">
                    <Tooltip text="The Lyapunov Exponent (λ) measures the rate of separation of infinitesimally close trajectories. λ < 0 indicates a stable Limit Cycle (Order). λ > 0 indicates a Strange Attractor (Chaos).">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border cursor-help ${lyapunov < 0 ? 'border-green-500 text-green-400' : 'border-rose-500 text-rose-400'}`}>
                            λ: {lyapunov.toFixed(4)}
                        </span>
                    </Tooltip>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center min-h-[200px] border border-white/5 bg-black/40 rounded-lg">
                <canvas ref={canvasRef} width={300} height={200} className="w-full h-full object-cover" />
                
                {/* HUD Overlay */}
                <div className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-500 pointer-events-none">
                    X: Rho (State)<br/>Y: dRho/dt (Flux)
                </div>
                <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-500 pointer-events-none text-right">
                    TOPOLOGY:<br/>
                    <span className={lyapunov < 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {lyapunov < 0 ? 'LIMIT_CYCLE' : 'CHAOS_REGIME'}
                    </span>
                </div>
            </div>
        </div>
    );
};
