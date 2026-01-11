
import React, { useEffect, useState, useRef } from 'react';
import { SystemState } from '../types';

interface PatternRecognitionHUDProps {
  systemState: SystemState;
}

const PATTERNS = [
    { name: 'HARMONIC CASCADE', color: '#a3e635', condition: (rho: number) => rho > 0.98 },
    { name: 'STABLE RESONANCE', color: '#67e8f9', condition: (rho: number) => rho > 0.8 && rho <= 0.98 },
    { name: 'PHASE DRIFT', color: '#facc15', condition: (rho: number) => rho > 0.5 && rho <= 0.8 },
    { name: 'ENTROPY SPIKE', color: '#fb923c', condition: (rho: number) => rho > 0.3 && rho <= 0.5 },
    { name: 'CAUSAL FRACTURE', color: '#f43f5e', condition: (rho: number) => rho <= 0.3 },
];

export const PatternRecognitionHUD: React.FC<PatternRecognitionHUDProps> = ({ systemState }) => {
    const { resonanceFactorRho } = systemState;
    const [history, setHistory] = useState<number[]>(new Array(40).fill(0));
    const [detectedPattern, setDetectedPattern] = useState(PATTERNS[1]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setHistory(prev => {
            const next = [...prev, resonanceFactorRho];
            if (next.length > 40) next.shift();
            return next;
        });

        const match = PATTERNS.find(p => p.condition(resonanceFactorRho)) || PATTERNS[2];
        setDetectedPattern(match);
    }, [resonanceFactorRho]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !canvasRef.current) return;

        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        
        ctx.clearRect(0, 0, w, h);

        // Draw Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<w; i+=20) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
        for(let j=0; j<h; j+=20) { ctx.moveTo(0, j); ctx.lineTo(w, j); }
        ctx.stroke();

        // Draw Graph
        ctx.strokeStyle = detectedPattern.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        history.forEach((val, i) => {
            const x = (i / (history.length - 1)) * w;
            const y = h - (val * h * 0.8) - 10; // Scale to fit
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw "AI Analysis" Bounding Box overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.strokeRect(w - 60, h - (resonanceFactorRho * h * 0.8) - 25, 50, 30);
        ctx.setLineDash([]);
        
        // Draw Connecting Analysis Line
        ctx.beginPath();
        ctx.moveTo(w - 60, h - (resonanceFactorRho * h * 0.8) - 10);
        ctx.lineTo(w - 100, h - (resonanceFactorRho * h * 0.8) - 10);
        ctx.stroke();

    }, [history, detectedPattern, resonanceFactorRho]);

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 z-10">
                <h3 className="font-orbitron text-md text-warm-grey">Pattern Recognition</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest">Logic Core:</span>
                    <span className="font-mono text-xs font-bold" style={{ color: detectedPattern.color }}>
                        {detectedPattern.name}
                    </span>
                </div>
            </div>

            <div className="flex-1 relative min-h-[150px] bg-black/20 rounded border border-white/5">
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={200} 
                    className="w-full h-full object-cover opacity-80"
                />
                
                {/* Simulated AI Overlay Text */}
                <div className="absolute top-2 left-2 font-mono text-[9px] text-slate-500 leading-tight">
                    <p>SCAN_WINDOW: 4000ms</p>
                    <p>SAMPLE_RATE: 20Hz</p>
                    <p>CONFIDENCE: {(0.85 + Math.random() * 0.14).toFixed(4)}</p>
                </div>

                <div className="absolute bottom-2 right-2 text-right">
                    <p className="font-orbitron text-xl font-bold" style={{ color: detectedPattern.color }}>
                        {(resonanceFactorRho * 100).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-warm-grey uppercase">Rho Coefficient</p>
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-dark-border/50">
                <div className="flex gap-1 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="flex-1 h-1 rounded-full transition-colors duration-300" 
                            style={{ 
                                backgroundColor: i < resonanceFactorRho * 20 ? detectedPattern.color : '#333',
                                opacity: i < resonanceFactorRho * 20 ? 1 : 0.2
                            }} 
                        />
                    ))}
                </div>
                <p className="text-[9px] text-center text-slate-600 mt-1 uppercase tracking-[0.2em]">Neural Match Probability</p>
            </div>
        </div>
    );
};
