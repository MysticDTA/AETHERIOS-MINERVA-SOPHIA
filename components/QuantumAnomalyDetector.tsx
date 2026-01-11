
import React, { useEffect, useRef, useState } from 'react';
import { SystemState } from '../types';

interface QuantumAnomalyDetectorProps {
    systemState?: SystemState;
}

// Grover's Algorithm Constants
const QUBIT_COUNT = 6;
const N = Math.pow(2, QUBIT_COUNT); // 64 states
const OPTIMAL_STEPS = Math.floor((Math.PI / 4) * Math.sqrt(N));

export const QuantumAnomalyDetector: React.FC<QuantumAnomalyDetectorProps> = ({ systemState }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [step, setStep] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [targetIndex, setTargetIndex] = useState<number>(() => Math.floor(Math.random() * N));
    const [amplitudes, setAmplitudes] = useState<number[]>(new Array(N).fill(0));
    const [found, setFound] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    
    // Deviation Metrics
    const [phaseDrift, setPhaseDrift] = useState(0);
    const [vectorAlignment, setVectorAlignment] = useState(1.0);

    const rho = systemState?.resonanceFactorRho || 0.9;
    const deviationFactor = 1 - rho;

    // Initialize to superposition
    useEffect(() => {
        reset();
    }, []);

    // Simulate real-time drift based on system resonance
    useEffect(() => {
        const interval = setInterval(() => {
            const noise = (Math.random() - 0.5) * deviationFactor * 0.2;
            setPhaseDrift(prev => Math.max(0, Math.min(1, prev * 0.95 + Math.abs(noise))));
            setVectorAlignment(prev => Math.max(0, Math.min(1, 1 - (phaseDrift * 0.5) - (deviationFactor * 0.1))));
        }, 100);
        return () => clearInterval(interval);
    }, [deviationFactor, phaseDrift]);

    const reset = () => {
        const initialAmp = 1 / Math.sqrt(N);
        setAmplitudes(new Array(N).fill(initialAmp));
        setStep(0);
        setFound(false);
        setTargetIndex(Math.floor(Math.random() * N));
        setIsSearching(false);
        setAutoPlay(false);
        setPhaseDrift(0);
    };

    const applyOracle = () => {
        setAmplitudes(prev => {
            const next = [...prev];
            // Apply slight phase noise to target based on deviation
            const noise = (Math.random() - 0.5) * deviationFactor;
            next[targetIndex] = -next[targetIndex] + noise; 
            return next;
        });
    };

    const applyDiffusion = () => {
        setAmplitudes(prev => {
            const mean = prev.reduce((a, b) => a + b, 0) / N;
            return prev.map(a => 2 * mean - a); 
        });
        setStep(s => s + 1);
    };

    const runStep = async () => {
        if (found || step >= OPTIMAL_STEPS) return;
        setIsSearching(true);
        
        applyOracle();
        await new Promise(r => setTimeout(r, 400));
        
        applyDiffusion();
        await new Promise(r => setTimeout(r, 400));
        
        setIsSearching(false);
    };

    useEffect(() => {
        if (autoPlay && step < OPTIMAL_STEPS) {
            const timer = setTimeout(() => {
                runStep();
            }, 1000);
            return () => clearTimeout(timer);
        } else if (autoPlay && step >= OPTIMAL_STEPS) {
            setAutoPlay(false);
            setFound(true);
        }
    }, [autoPlay, step]);

    // Canvas Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        
        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            const barWidth = width / N;
            const centerY = height / 2;
            const scaleY = height * 0.4; 

            ctx.clearRect(0, 0, width, height);
            
            // Draw Deviation Noise (Ghost Background)
            if (deviationFactor > 0.05) {
                ctx.fillStyle = `rgba(244, 63, 94, ${deviationFactor * 0.3})`;
                for(let i=0; i<N; i++) {
                    const noiseH = (Math.random() - 0.5) * scaleY * deviationFactor;
                    const x = i * barWidth;
                    ctx.fillRect(x, centerY, barWidth, noiseH);
                }
            }

            // Draw Baseline
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Draw Bars
            amplitudes.forEach((amp, i) => {
                const x = i * barWidth;
                const h = amp * scaleY; 
                
                // Color Logic
                let color = '#64748b'; 
                if (Math.abs(amp) > 0.5) color = '#22d3ee'; 
                if (amp < 0) color = '#f43f5e'; 
                if (found && i === targetIndex) color = '#ffd700'; 

                // Deviation Warning Color
                if (i === targetIndex && phaseDrift > 0.2) {
                    color = '#fb923c'; // Orange warning
                }

                if (i === targetIndex && Math.abs(amp) > 0.1) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = color;
                ctx.fillRect(x + 1, centerY, barWidth - 2, -h); 
            });

            // Draw Probability Curve (Envelope)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - phaseDrift * 0.1})`; // Fade with drift
            ctx.lineWidth = 1;
            for(let i=0; i<N; i++) {
                const x = i * barWidth + barWidth/2;
                const y = centerY - amplitudes[i] * scaleY;
                if (i===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw Deviation Envelope (Red Line)
            if (phaseDrift > 0.05) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(244, 63, 94, 0.4)`;
                ctx.setLineDash([2, 4]);
                for(let i=0; i<N; i++) {
                    const x = i * barWidth + barWidth/2;
                    const noise = Math.sin(i * 0.5 + Date.now() * 0.01) * deviationFactor * scaleY * 0.5;
                    const y = centerY - (amplitudes[i] * scaleY) + noise;
                    if (i===0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [amplitudes, found, targetIndex, deviationFactor, phaseDrift]);

    const prob = amplitudes[targetIndex] ** 2;

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {/* Control Deck */}
            <div className="flex justify-between items-end bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol</span>
                        <h3 className="font-orbitron text-xl text-pearl font-bold">Grover_Search + Deviation Monitor</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Iteration</span>
                        <h3 className="font-orbitron text-xl text-cyan-400 font-bold">{step} <span className="text-sm text-slate-600">/ {OPTIMAL_STEPS}</span></h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target_Probability</span>
                        <h3 className={`font-orbitron text-xl font-bold ${prob > 0.9 ? 'text-gold' : 'text-slate-300'}`}>
                            {(prob * 100).toFixed(2)}%
                        </h3>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="px-6 py-2 rounded-sm border border-slate-700 text-slate-500 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => { if (!autoPlay && step < OPTIMAL_STEPS) runStep(); }}
                        disabled={autoPlay || found || step >= OPTIMAL_STEPS}
                        className={`px-6 py-2 rounded-sm border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                            autoPlay ? 'opacity-50 cursor-wait' : 'hover:bg-cyan-900/40 hover:border-cyan-500 hover:text-cyan-300 border-white/10 text-slate-400'
                        }`}
                    >
                        Step
                    </button>
                    <button
                        onClick={() => setAutoPlay(true)}
                        disabled={autoPlay || found || step >= OPTIMAL_STEPS}
                        className={`px-8 py-2 rounded-sm border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                            found
                            ? 'bg-gold border-gold text-black' 
                            : autoPlay 
                                ? 'bg-violet-900/40 border-violet-500 text-violet-300 animate-pulse'
                                : 'bg-emerald-900/40 border-emerald-500 text-emerald-300 hover:bg-emerald-800/40'
                        }`}
                    >
                        {found ? 'ANOMALY_LOCATED' : autoPlay ? 'RUNNING...' : 'EXECUTE'}
                    </button>
                </div>
            </div>

            {/* Metrics Panel for Deviation */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 p-4 rounded flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Hilbert_Space_Drift</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${phaseDrift > 0.1 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${phaseDrift * 100}%` }} />
                        </div>
                        <span className={`font-mono text-xs ${phaseDrift > 0.1 ? 'text-rose-400' : 'text-emerald-400'}`}>{(phaseDrift * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Vector_Alignment</span>
                    <span className="font-orbitron text-sm text-pearl font-bold">{(vectorAlignment * 100).toFixed(2)}%</span>
                </div>
            </div>

            {/* Visualization Canvas */}
            <div className="flex-1 bg-black/60 rounded-xl border border-white/5 relative overflow-hidden shadow-inner flex flex-col">
                <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest z-10 flex flex-col gap-1">
                    <span>Hilbert_Space: {N} States</span>
                    <span className={deviationFactor > 0.1 ? 'text-rose-400 animate-pulse' : 'text-slate-600'}>
                        {deviationFactor > 0.1 ? 'WARNING: HIGH DECOHERENCE' : 'NOMINAL STATE'}
                    </span>
                </div>
                {found && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="bg-black/80 border border-gold/50 p-6 rounded-lg backdrop-blur-md flex flex-col items-center gap-2 animate-scale-in shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Target Identified</span>
                            <span className="font-orbitron text-4xl text-white font-black">INDEX: {targetIndex}</span>
                            <span className="text-[9px] font-mono text-slate-400">Phase Inverted // Amplitude Maximized</span>
                        </div>
                    </div>
                )}
                
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
            </div>
        </div>
    );
};
