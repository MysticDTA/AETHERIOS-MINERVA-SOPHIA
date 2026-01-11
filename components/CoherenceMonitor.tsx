
import React, { useState, useEffect, useRef } from 'react';
import { CoherenceResonanceData, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { audioAnalysisService } from '../services/audioAnalysisService';

interface CoherenceMonitorProps {
  data: CoherenceResonanceData;
  contributingFactors: { label: string; value: number }[];
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
}

const INTELLIGENCE_LOGS = [
    "INTERFEROMETRY_ACTIVE: Calculating phase offset...",
    "Scanning local causal lattice for entropic shear...",
    "Harmonic convergence detected at 1.617 GHz...",
    "Optimizing probability vectors for Sovereign Lock...",
    "Verifying Golden Ratio geometry in sub-layer...",
    "Resonance Delta decreasing. Stability imminent.",
    "Monitoring quantum noise floor...",
    "Calibrating neural-link latency to zero-point..."
];

const InterferometerCanvas: React.FC<{ 
    targetRho: number; 
    currentRho: number; 
    entropy: number; 
    phaseOffset: number; 
}> = ({ targetRho, currentRho, entropy, phaseOffset }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        // Configuration for the Moiré Pattern
        const ringCount = 32;
        const baseSpacing = 8;

        const render = () => {
            // Audio Reactivity
            const audioMetrics = audioAnalysisService.getEnergyMetrics();
            const bassKick = audioMetrics.bass * 20;
            const midJitter = audioMetrics.mid * 5;

            time += 0.005 + (currentRho * 0.01);
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            // Clear with deep void trail
            ctx.fillStyle = 'rgba(2, 2, 4, 0.2)';
            ctx.fillRect(0, 0, w, h);

            // Phase Lock Visual Indicator (Background Glow)
            const isLocked = Math.abs(phaseOffset) < 0.05 && currentRho > 0.95;
            if (isLocked) {
                const glowSize = 100 + Math.sin(time * 5) * 10;
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Reference Grid (The "Truth" / System Baseline)
            // This layer rotates slowly and consistently
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(time * 0.2); 
            ctx.strokeStyle = 'rgba(230, 199, 127, 0.15)'; // Dim Gold
            ctx.lineWidth = 1;
            
            for(let i = 1; i <= ringCount; i++) {
                const r = i * baseSpacing + bassKick * 0.5;
                
                // Hexagonal distortion for the reference lattice
                ctx.beginPath();
                for (let j = 0; j < 6; j++) {
                    const angle = (j / 6) * Math.PI * 2;
                    const x = r * Math.cos(angle);
                    const y = r * Math.sin(angle);
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();

            // Draw Input Grid (The "Operator" / Current State)
            // This layer's rotation and stability are affected by Rho, Entropy, and Tuning
            ctx.save();
            ctx.translate(cx, cy);
            
            // Rotation Delta: When phaseOffset is 0, this matches the reference speed (Lock)
            // Otherwise, it spins faster/slower creating interference
            const rotationDelta = phaseOffset * Math.PI; 
            ctx.rotate((time * 0.2) + rotationDelta + (midJitter * 0.05 * entropy)); 

            // Color shifts based on alignment
            const signalColor = isLocked ? '#10b981' : currentRho > 0.8 ? '#a78bfa' : '#f43f5e';
            ctx.strokeStyle = signalColor;
            ctx.lineWidth = isLocked ? 2 : 1.5;
            
            // Jitter/Entropy Effect on position
            const shakeX = (Math.random() - 0.5) * entropy * 10;
            const shakeY = (Math.random() - 0.5) * entropy * 10;
            ctx.translate(shakeX, shakeY);

            for(let i = 1; i <= ringCount; i++) {
                // Determine shape based on coherence. High coherence = Hexagon (matches reference). Low = Circle/Blob.
                const morphFactor = currentRho; // 1 = Hex, 0 = Circle
                const r = i * baseSpacing + bassKick;

                ctx.beginPath();
                for (let j = 0; j <= 60; j++) {
                    const theta = (j / 60) * Math.PI * 2;
                    
                    // Interpolate between Circle (cos(theta)) and Hexagon approximation
                    // Simple Hexagon radius modulation
                    const hexR = r / Math.cos(((theta % (Math.PI/3)) - (Math.PI/6)));
                    const circleR = r;
                    
                    // We only use true Hex logic for simplicity in visual:
                    // Just draw circles that deform into hexes? 
                    // Let's stick to circles for the interference layer to create Moiré with the hex background
                    
                    // Actually, Moiré is best with identical patterns offset. Let's draw Hexagons too.
                    // But offset them radially if rho is low.
                    
                    // Radial distortion based on entropy
                    const noise = Math.sin(theta * 10 + time * 5) * entropy * 10;
                    const finalR = r + noise; 

                    // Drawing a circle/blob for the user layer to contrast the rigid hex background
                    const x = finalR * Math.cos(theta);
                    const y = finalR * Math.sin(theta);
                    
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();

            // Center Singularity
            ctx.beginPath();
            ctx.arc(cx, cy, 10 + bassKick, 0, Math.PI * 2);
            ctx.fillStyle = isLocked ? '#fff' : signalColor;
            ctx.shadowBlur = 20;
            ctx.shadowColor = signalColor;
            ctx.fill();
            ctx.shadowBlur = 0;

            // HUD Overlay Text
            if (isLocked) {
                ctx.fillStyle = '#10b981';
                ctx.font = '12px "Orbitron"';
                ctx.textAlign = 'center';
                ctx.fillText("PHASE LOCK ACQUIRED", cx, h - 20);
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '10px "JetBrains Mono"';
                ctx.textAlign = 'center';
                ctx.fillText(`OFFSET: ${(phaseOffset * 180).toFixed(1)}°`, cx, h - 20);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [targetRho, currentRho, entropy, phaseOffset]);

    return (
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={300} 
            className="w-full h-full bg-black/20 rounded border border-white/5"
        />
    );
};

export const CoherenceMonitor: React.FC<CoherenceMonitorProps> = ({ data, contributingFactors, systemState, sophiaEngine }) => {
    const { score, status, entropyFlux, phaseSync } = data;
    const [tuning, setTuning] = useState(0.5); // 0 to 1, target is 0.5
    const [aiThought, setAiThought] = useState(INTELLIGENCE_LOGS[0]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    
    // Derived alignment metric based on user tuning
    const phaseAlignment = (tuning - 0.5) * 2; // -1 to 1
    const effectiveCoherence = score * (1 - Math.abs(phaseAlignment) * 0.5);

    // AI Thought Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const nextThought = INTELLIGENCE_LOGS[Math.floor(Math.random() * INTELLIGENCE_LOGS.length)];
            setAiThought(nextThought);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleOptimize = () => {
        setIsOptimizing(true);
        // Simulate auto-tuning algorithm
        let steps = 0;
        const interval = setInterval(() => {
            setTuning(prev => {
                const diff = 0.5 - prev;
                // Easing function
                if (Math.abs(diff) < 0.005) return 0.5;
                return prev + diff * 0.15;
            });
            steps++;
            if (steps > 25) {
                clearInterval(interval);
                setIsOptimizing(false);
            }
        }, 60);
    };

    return (
        <div className="w-full h-full bg-dark-surface/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-6 relative overflow-hidden shadow-2xl group transition-all hover:border-violet-500/20">
            {/* Header */}
            <div className="flex justify-between items-start z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-900/10 border border-violet-500/30 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-orbitron text-lg text-pearl font-bold tracking-widest uppercase text-glow-pearl">Interferometer</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Phase-Lock Engine v4.2</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`font-orbitron text-3xl font-black ${Math.abs(phaseAlignment) < 0.05 ? 'text-emerald-400 text-glow-green' : 'text-gold'}`}>
                        {(effectiveCoherence * 100).toFixed(1)}%
                    </span>
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">Causal_Symmetry</p>
                </div>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 min-h-[220px] relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2">
                    <span>Moiré_Interference_Pattern</span>
                    <span className="text-violet-300 animate-pulse">{isOptimizing ? 'SEEKING_NULL_POINT...' : 'LIVE_FEED'}</span>
                </div>
                
                <div className="flex-1 relative rounded-lg overflow-hidden border border-white/5 shadow-inner">
                    <InterferometerCanvas 
                        targetRho={0.9} 
                        currentRho={effectiveCoherence} 
                        entropy={entropyFlux} 
                        phaseOffset={phaseAlignment} 
                    />
                    
                    {/* Tuning Slider Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 bg-black/80 p-3 rounded-full border border-white/10 backdrop-blur-md flex flex-col gap-1 shadow-2xl">
                        <div className="flex justify-between text-[7px] font-mono text-slate-400 uppercase px-2">
                            <span>Lag_(-π)</span>
                            <span className="text-gold font-bold">Phase_Null_Point</span>
                            <span>Lead_(+π)</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.001" 
                            value={tuning} 
                            onChange={(e) => setTuning(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pearl [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-500 hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Intelligence Stream & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10 mt-2">
                
                {/* AI Thought Matrix */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg flex flex-col gap-2 shadow-inner h-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 font-orbitron text-4xl font-black">AI</div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-bold mb-1">Reasoning_Stream</span>
                    <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 relative z-10">
                        <div className="flex gap-3 items-start animate-fade-in">
                            <span className="text-violet-500 font-bold shrink-0">{'>'}</span>
                            <p className="text-[11px] font-mono text-pearl/90 leading-relaxed type-writer-effect">
                                {aiThought}
                            </p>
                        </div>
                        <div className="flex gap-3 items-start opacity-40">
                            <span className="text-slate-600 shrink-0">{'>'}</span>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                                Previous: Recalibrating resonance vector for optimal throughput...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heuristic Controls */}
                <div className="flex flex-col gap-3 justify-center">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center group hover:border-rose-500/30 transition-all">
                            <p className="text-[8px] text-slate-500 uppercase">Entropy_Flux</p>
                            <p className={`font-mono text-sm font-bold ${entropyFlux > 0.3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {(entropyFlux * 10).toFixed(3)}
                            </p>
                        </div>
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center group hover:border-gold/30 transition-all">
                            <p className="text-[8px] text-slate-500 uppercase">Phase_Offset</p>
                            <p className="font-mono text-sm text-gold">{(phaseAlignment * 180).toFixed(1)}°</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing || Math.abs(phaseAlignment) < 0.005}
                        className={`w-full py-3 font-orbitron text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm transition-all border shadow-lg relative overflow-hidden group ${
                            isOptimizing 
                            ? 'bg-violet-900/40 border-violet-500 text-violet-200' 
                            : Math.abs(phaseAlignment) < 0.005
                                ? 'bg-emerald-900/20 border-emerald-500 text-emerald-300 cursor-default'
                                : 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-black'
                        }`}
                    >
                        <span className="relative z-10">
                            {isOptimizing ? 'Auto-Tuning...' : Math.abs(phaseAlignment) < 0.005 ? 'Resonance Locked' : 'Execute Phase Alignment'}
                        </span>
                        {isOptimizing && <div className="absolute inset-0 bg-violet-500/20 animate-pulse" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
