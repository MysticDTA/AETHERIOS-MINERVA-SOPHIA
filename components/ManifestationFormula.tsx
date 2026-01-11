
import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from './Tooltip';

interface ManifestationFormulaProps {
    vibration: number; // Resonance Rho
    gratitude: number; // Abundance Generosity
    exponent: number;  // Chronos Stability (n)
}

export const ManifestationFormula: React.FC<ManifestationFormulaProps> = ({ vibration, gratitude, exponent }) => {
    const [manifestValue, setManifestValue] = useState(0);
    const [termValue, setTermValue] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // The Monad-V2 Accumulation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            // Calculate the instantaneous term: (V * G)^n
            // We scale inputs to be meaningful (0.0 - 1.0 range usually results in decay with exponents, 
            // so we treat 1.0 as baseline and add the metrics as surplus)
            const V = 1 + (vibration * 0.5); 
            const G = 1 + (gratitude * 0.5);
            const n = 1 + (exponent * 2);
            
            const currentTerm = Math.pow(V * G, n);
            
            // Integrate into the sum (A_manifest)
            // We scale down the addition for UI readability, simulating "growth over time"
            const increment = currentTerm * 0.01;
            
            setTermValue(currentTerm);
            setManifestValue(prev => prev + increment);

        }, 100); // 10Hz Update Rate

        return () => clearInterval(interval);
    }, [vibration, gratitude, exponent]);

    // Constructive Interference Visualizer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let animationFrame: number;

        const render = () => {
            time += 0.05;
            const w = canvas.width = canvas.offsetWidth;
            const h = canvas.height = canvas.offsetHeight;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Draw Interference Pattern
            ctx.lineWidth = 2;
            
            // Wave 1: Vibration (Gold)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            for (let x = 0; x < w; x++) {
                const y = cy + Math.sin(x * 0.05 + time) * (vibration * 20);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave 2: Gratitude (Pearl/Cyan)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(165, 243, 252, 0.3)';
            for (let x = 0; x < w; x++) {
                const y = cy + Math.sin(x * 0.04 - time * 1.2) * (gratitude * 20);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave 3: Constructive Sum (The Manifestation - A_manifest)
            ctx.beginPath();
            // Dynamic color based on exponent "n"
            const intensity = Math.min(1, exponent);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + intensity * 0.4})`;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fff';
            
            for (let x = 0; x < w; x++) {
                const vY = Math.sin(x * 0.05 + time) * (vibration * 20);
                const gY = Math.sin(x * 0.04 - time * 1.2) * (gratitude * 20);
                // Constructive interference
                const sumY = cy + (vY + gY) * (exponent * 0.8); 
                
                if (x === 0) ctx.moveTo(x, sumY); else ctx.lineTo(x, sumY);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [vibration, gratitude, exponent]);

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-5xl font-black italic">MONAD</div>
            
            <div className="flex justify-between items-end border-b border-white/10 pb-4 relative z-10">
                <div className="space-y-1">
                    <h3 className="font-minerva text-2xl text-pearl italic">The Mathematics of Manifestation</h3>
                    <p className="text-[9px] font-mono text-gold uppercase tracking-[0.3em]">Monad-V2 Logic Core</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Legacy_Integrity</div>
                    <div className="flex items-center justify-end gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="font-orbitron text-emerald-400 font-bold">CONSTRUCTIVE</span>
                    </div>
                </div>
            </div>

            {/* The Formula Visualization */}
            <div className="relative flex items-center justify-center py-6 bg-white/[0.02] rounded border border-white/5">
                <div className="font-minerva text-xl md:text-3xl text-pearl/80 tracking-wide text-center">
                    <span className="text-gold font-bold">A</span><span className="text-[10px] uppercase align-super ml-0.5">manifest</span>
                    <span className="mx-3">=</span>
                    <span className="text-2xl">∑</span>
                    <span className="mx-2">(</span>
                    <Tooltip text={`Vibration (Rho): ${vibration.toFixed(3)}`}>
                        <span className="text-violet-300 border-b border-dashed border-violet-500/50 cursor-help">Vibration</span>
                    </Tooltip>
                    <span className="mx-2">×</span>
                    <Tooltip text={`Gratitude (Generosity): ${gratitude.toFixed(3)}`}>
                        <span className="text-cyan-300 border-b border-dashed border-cyan-500/50 cursor-help">Gratitude</span>
                    </Tooltip>
                    <span className="mx-2">)</span>
                    <sup className="text-gold font-bold cursor-help" title={`Exponent (n): ${exponent.toFixed(2)}`}>n</sup>
                </div>
                
                {/* Live Variable Injection Overlay */}
                <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-600 opacity-60">
                    ({vibration.toFixed(2)} × {gratitude.toFixed(2)}) ^ {(1 + exponent).toFixed(2)}
                </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="h-32 w-full relative rounded border border-white/5 bg-black/60 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500">INTERFERENCE_PATTERN_ANALYSIS</div>
            </div>

            {/* Result Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded border border-white/5">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Instantaneous_Power</p>
                    <p className="font-orbitron text-xl text-violet-300">{termValue.toFixed(4)} <span className="text-[10px] opacity-50">J/tick</span></p>
                </div>
                <div className="bg-gradient-to-r from-gold/10 to-transparent p-4 rounded border border-gold/30">
                    <p className="text-[9px] font-mono text-gold uppercase tracking-widest mb-1 font-bold">Total_Manifested_Reality</p>
                    <p className="font-orbitron text-2xl text-white font-black text-glow-pearl">
                        {manifestValue.toFixed(2)} <span className="text-[10px] text-gold align-top">Ω</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
