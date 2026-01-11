
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CoherenceResonanceData, ResonanceIntelligenceEntry, SystemState } from '../types';
import { Tooltip } from './Tooltip';
import { useSophiaCore } from './hooks/useSophiaCore';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface CoherenceMonitorProps {
  data: CoherenceResonanceData;
  contributingFactors: { label: string; value: number }[];
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
}

const INTELLIGENCE_LOGS = [
    "Analyzing harmonic deviations in local lattice...",
    "Correlating bio-rhythm with Schumann baseline...",
    "Detecting subtle entropy flux in sector 7...",
    "Optimizing causal probability vectors...",
    "Verifying Golden Ratio phase alignment...",
    "Synthesizing heuristic strategy for resonance boost...",
    "Monitoring sub-quantum noise levels...",
    "Calibrating neural-link latency..."
];

const WaveformVisualizer: React.FC<{ 
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

        const render = () => {
            time += 0.02;
            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Draw Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x=0; x<w; x+=40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
            ctx.stroke();

            // 1. The "Ideal" Wave (Golden Standard) - Reference
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(230, 199, 127, 0.3)'; // Dim Gold
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            for (let x = 0; x < w; x++) {
                const y = cy + Math.sin(x * 0.03 + time) * 40 * targetRho;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // 2. The "Real" Wave (Current System State) - Active
            // Affected by entropy (jitter) and phase offset (user tuning)
            ctx.beginPath();
            const coherenceColor = Math.abs(phaseOffset) < 0.1 ? '#10b981' : '#a78bfa'; // Green if locked, else Violet
            ctx.strokeStyle = coherenceColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = coherenceColor;

            for (let x = 0; x < w; x++) {
                // Noise based on entropy
                const noise = (Math.random() - 0.5) * entropy * 20;
                
                // Frequency shift based on difference between target and current
                const freq = 0.03 + (phaseOffset * 0.01);
                
                const y = cy + Math.sin(x * freq + time + (phaseOffset * Math.PI)) * 40 * currentRho + noise;
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 3. Analysis Overlay
            if (Math.abs(phaseOffset) < 0.05) {
                ctx.fillStyle = '#10b981';
                ctx.font = '10px "Orbitron"';
                ctx.fillText("PHASE LOCK ACQUIRED", 20, 30);
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
            height={200} 
            className="w-full h-full bg-black/40 rounded border border-white/5"
        />
    );
};

export const CoherenceMonitor: React.FC<CoherenceMonitorProps> = ({ data, contributingFactors, systemState, sophiaEngine }) => {
    const { score, status, entropyFlux, phaseSync, intelligenceLog } = data;
    const [tuning, setTuning] = useState(0.5); // 0 to 1, target is 0.5
    const [aiThought, setAiThought] = useState(INTELLIGENCE_LOGS[0]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    
    // Derived alignment metric based on user tuning
    // Ideally user wants tuning to be 0.5 (center)
    const phaseAlignment = (tuning - 0.5) * 2; // -1 to 1
    const effectiveCoherence = score * (1 - Math.abs(phaseAlignment) * 0.5);

    // AI Thought Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const nextThought = INTELLIGENCE_LOGS[Math.floor(Math.random() * INTELLIGENCE_LOGS.length)];
            setAiThought(nextThought);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleOptimize = () => {
        setIsOptimizing(true);
        // Simulate auto-tuning
        let steps = 0;
        const interval = setInterval(() => {
            setTuning(prev => {
                const diff = 0.5 - prev;
                if (Math.abs(diff) < 0.01) return 0.5;
                return prev + diff * 0.2;
            });
            steps++;
            if (steps > 20) {
                clearInterval(interval);
                setIsOptimizing(false);
            }
        }, 100);
    };

    return (
        <div className="w-full h-full bg-dark-surface/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-6 relative overflow-hidden shadow-2xl group transition-all hover:border-violet-500/20">
            {/* Header */}
            <div className="flex justify-between items-start z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-900/10 border border-violet-500/30 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-orbitron text-lg text-pearl font-bold tracking-widest uppercase">Intellectual Resonance Core</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Sophia_Engine_v4.1 // Real-Time</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`font-orbitron text-2xl font-black ${Math.abs(phaseAlignment) < 0.1 ? 'text-emerald-400' : 'text-gold'}`}>
                        {(effectiveCoherence * 100).toFixed(1)}%
                    </span>
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">Coherence_Efficiency</p>
                </div>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 min-h-[180px] relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2">
                    <span>Waveform_Comparison</span>
                    <span className="text-violet-300 animate-pulse">{isOptimizing ? 'AUTO-TUNING...' : 'LIVE_FEED'}</span>
                </div>
                
                <div className="flex-1 relative">
                    <WaveformVisualizer 
                        targetRho={0.9} 
                        currentRho={effectiveCoherence} 
                        entropy={entropyFlux} 
                        phaseOffset={phaseAlignment} 
                    />
                    
                    {/* Tuning Slider Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 bg-black/60 p-2 rounded border border-white/10 backdrop-blur-md flex flex-col gap-2">
                        <div className="flex justify-between text-[8px] font-mono text-pearl uppercase">
                            <span>Phase_Lag</span>
                            <span>Phase_Lead</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={tuning} 
                            onChange={(e) => setTuning(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Intelligence Stream & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10">
                
                {/* AI Thought Matrix */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg flex flex-col gap-2 shadow-inner h-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 font-orbitron text-4xl font-black">AI</div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-bold mb-1">Cognitive_Stream</span>
                    <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
                        <div className="flex gap-3 items-start animate-fade-in">
                            <span className="text-violet-500 font-bold shrink-0">{'>'}</span>
                            <p className="text-[11px] font-mono text-pearl/90 leading-relaxed type-writer-effect">
                                {aiThought}
                            </p>
                        </div>
                        <div className="flex gap-3 items-start opacity-50">
                            <span className="text-slate-600 shrink-0">{'>'}</span>
                            <p className="text-[11px] font-mono text-slate-400">
                                Previous: Calculating entropy vector delta...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heuristic Controls */}
                <div className="flex flex-col gap-3 justify-center">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                            <p className="text-[8px] text-slate-500 uppercase">Entropy</p>
                            <p className={`font-mono text-sm ${entropyFlux > 0.3 ? 'text-rose-400' : 'text-emerald-400'}`}>{(entropyFlux * 10).toFixed(3)}</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                            <p className="text-[8px] text-slate-500 uppercase">Phase</p>
                            <p className="font-mono text-sm text-gold">{phaseSync.toFixed(3)}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing || Math.abs(phaseAlignment) < 0.05}
                        className={`w-full py-3 font-orbitron text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm transition-all border ${
                            isOptimizing 
                            ? 'bg-violet-900/20 border-violet-500 text-violet-300' 
                            : Math.abs(phaseAlignment) < 0.05
                                ? 'bg-emerald-900/20 border-emerald-500 text-emerald-300 cursor-default'
                                : 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-black'
                        }`}
                    >
                        {isOptimizing ? 'Optimizing Lattice...' : Math.abs(phaseAlignment) < 0.05 ? 'Resonance Optimized' : 'Auto-Tune Harmonics'}
                    </button>
                </div>
            </div>
        </div>
    );
};
