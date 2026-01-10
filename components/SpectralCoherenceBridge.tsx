
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Tooltip } from './Tooltip';

interface SpectralCoherenceBridgeProps {
    rho: number;
    coherence: number;
    isActive: boolean;
    manualOffset?: number; // -1 to 1 manual tuning
}

export const SpectralCoherenceBridge: React.FC<SpectralCoherenceBridgeProps> = ({ 
    rho, 
    coherence, 
    isActive,
    manualOffset = 0 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [phaseLocked, setPhaseLocked] = useState(false);
    const [tuningAccuracy, setTuningAccuracy] = useState(0.99);

    useEffect(() => {
        setPhaseLocked(rho > 0.96 && Math.abs(manualOffset) < 0.05);
        setTuningAccuracy(1 - Math.abs(manualOffset));
    }, [rho, manualOffset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            if (!isActive) return;
            time += 0.02 + (rho * 0.02);
            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            // Deep background clear with heavy persistence trail
            ctx.fillStyle = 'rgba(2, 2, 5, 0.12)';
            ctx.fillRect(0, 0, w, h);

            // 1. Draw Geometric Interference Grid
            ctx.strokeStyle = 'rgba(109, 40, 217, 0.05)';
            ctx.lineWidth = 0.5;
            for(let i=0; i<w; i+=50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, h);
                ctx.stroke();
            }

            // 2. Causal Echoes (Ghost Waveforms)
            // Represents the "Shadow" or "Drift" versions of the timeline
            if (rho < 0.98) {
                const echoCount = 3;
                for (let e = 1; e <= echoCount; e++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = `rgba(244, 63, 94, ${0.1 * (1 - rho) * (1 / e)})`; // Reddish echoes
                    for (let x = 0; x < w; x++) {
                        const freq = 0.02 + (e * 0.005);
                        const amp = 40 * (1 - rho) * (1 / e);
                        const y = cy + Math.sin(x * freq + time * e + manualOffset * 10) * amp;
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
            }

            // 3. Primary Coherence Wave (Synthesis)
            ctx.beginPath();
            ctx.lineWidth = phaseLocked ? 3 : 1.5;
            const primaryColor = phaseLocked ? '#f8f5ec' : rho > 0.9 ? '#ffd700' : '#a78bfa';
            ctx.strokeStyle = primaryColor;
            
            if (phaseLocked) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            }

            for (let x = 0; x < w; x++) {
                // Fundamental
                const f1 = Math.sin(x * 0.02 + time) * 30 * rho;
                // Harmonic Resonance
                const f2 = Math.sin(x * 0.05 - time * 0.5) * 15 * coherence;
                // Manual Tuning Influence
                const f3 = Math.sin(x * 0.08 + manualOffset * 5) * 10 * (1 - tuningAccuracy);
                
                const y = cy + f1 + f2 + f3;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 4. Intercept Points (Data Packets)
            const packetCount = 5;
            for (let i = 0; i < packetCount; i++) {
                const px = (time * 100 + i * (w / packetCount)) % w;
                const py = cy + Math.sin(px * 0.02 + time) * 30 * rho + Math.sin(px * 0.05 - time * 0.5) * 15 * coherence;
                
                ctx.beginPath();
                ctx.arc(px, py, phaseLocked ? 4 : 2, 0, Math.PI * 2);
                ctx.fillStyle = phaseLocked ? '#fff' : primaryColor;
                ctx.fill();
                
                if (phaseLocked) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(px, py, 10 * (Math.sin(time * 5) * 0.5 + 0.5), 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // 5. HUD Matrix Overlays
            ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
            ctx.font = '8px "JetBrains Mono"';
            ctx.fillText(`PHASE_OFFSET: ${(manualOffset * 360).toFixed(2)}°`, 20, 40);
            ctx.fillText(`HARMONIC_YIELD: ${(tuningAccuracy * 100).toFixed(2)}%`, 20, 50);

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [isActive, rho, coherence, manualOffset, phaseLocked, tuningAccuracy]);

    return (
        <div className="w-full h-full bg-black/60 border border-white/5 rounded-xl relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Header Telemetry */}
            <div className="absolute top-6 left-8 z-10 flex flex-col gap-1.5 pointer-events-none">
                <span className="text-[10px] font-orbitron text-gold uppercase tracking-[0.5em] font-black leading-none">Spectral Bridge v2.0</span>
                <div className="flex items-center gap-3">
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${phaseLocked ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'border-gold/30 text-gold/60'}`}>
                        {phaseLocked ? 'ABSOLUTE_PHASE_LOCK' : 'CAUSAL_DRIFT_DETECTED'}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${phaseLocked ? 'bg-emerald-500 animate-ping shadow-[0_0_10px_#10b981]' : 'bg-gold animate-pulse'}`} />
                </div>
            </div>

            <div className="absolute top-6 right-8 z-10 text-right pointer-events-none">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Intercept_Vector</p>
                <p className="font-orbitron text-lg text-pearl font-bold tracking-tighter">1.617 GHz // L-BAND</p>
            </div>

            <canvas ref={canvasRef} width={1000} height={400} className="w-full h-full block cursor-crosshair" />

            {/* Bottom Controls Legend */}
            <div className="absolute bottom-6 left-8 right-8 z-10 flex justify-between items-end pointer-events-none">
                <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">Lambda_Σ</span>
                        <span className="text-[10px] font-mono text-pearl">{tuningAccuracy.toFixed(8)}Ψ</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">Spectral_Purity</span>
                        <span className="text-[10px] font-mono text-cyan-400">{(rho * coherence * 100).toFixed(2)}%</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.3em]">Institutional_Handshake_Active</span>
                </div>
            </div>
        </div>
    );
};
